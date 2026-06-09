# ML Backend

## Overview

The Saathi fraud detection ML backend has two primary models and a risk fusion layer:

1. **Scam Note Classifier** — TF-IDF vectorizer + LogisticRegression
2. **Behavioral Anomaly Detector** — StandardScaler + IsolationForest
3. **Risk Fusion Engine** — Weighted linear sum of 6 component scores

All components are in `backend/app/services/` and model artifacts in `backend/app/ml/`.

## Model Artifacts

Each artifact is a `.joblib` pickle stored as a Python dictionary with metadata keys for versioning and diagnostics.

### Scam Note Classifier (`scam_note_model.joblib`)

| Key | Type | Description |
|-----|------|-------------|
| `vectorizer` | `TfidfVectorizer` | Fitted vectorizer (backward-compat) |
| `classifier` | `LogisticRegression` | Fitted classifier (backward-compat) |
| `model_version` | `str` | Semver string |
| `label_mapping` | `dict` | `{0: "BENIGN", 1: "SCAM_LIKE"}` |
| `feature_names` | `list[str]` | Top 4000 n-gram features |
| `metrics` | `dict` | Accuracy, precision, recall, F1, ROC-AUC, confusion matrix, classification report |
| `training_date` | `str` | ISO 8601 timestamp |
| `data_source` | `str` | `"synthetic"` |

### Behavioral Anomaly Detector (`behavior_anomaly_model.joblib`)

| Key | Type | Description |
|-----|------|-------------|
| `isolation_forest` | `IsolationForest` | Fitted model (backward-compat) |
| `feature_keys` | `list[str]` | 8 behavioral feature names |
| `model_version` | `str` | Semver string |
| `pipeline` | `Pipeline` | `Scaler + IsolationForest` pipeline |
| `scaler` | `StandardScaler` | Fitted scaler |
| `threshold` | `float` | 80th percentile anomaly score |
| `metrics` | `dict` | Precision, recall, F1, confusion matrix, score distribution |
| `training_date` | `str` | ISO 8601 timestamp |
| `data_source` | `str` | `"synthetic"` |

### Training

```bash
# From repo root
python scripts/train-models.py
```

The script:
- Loads data from `data/fraud_cases.json` and `data/behavioral_profiles.json`
- Splits scam notes 80/20 train/test with stratification
- Scales behavioral features with `StandardScaler` before `IsolationForest`
- Saves metrics reports to `backend/app/ml/reports/`
- Saves versioned artifact dicts to `backend/app/ml/artifacts/`

## ML Diagnostics

Every `POST /risk/evaluate` response includes `metadata.ml_diagnostics` in the JSON body:

```json
{
  "scam_classifier": {
    "raw_model_score": 0.12,
    "heuristic_adjustment": 0.03,
    "keyword_hits": 2,
    "reason_codes": ["known_benign_cap", "keyword_floor"],
    "model_provided_score": true,
    "final_probability": 0.15,
    "model_status": "LOADED_FROM_ARTIFACT"
  },
  "anomaly_detector": {
    "raw_model_score": 0.45,
    "heuristic_adjustment": 0.35,
    "heuristic_override_applied": true,
    "reason_codes": ["high_irregularity_boost"],
    "model_provided_score": true,
    "final_score": 0.80,
    "scaler_used": true,
    "model_status": "LOADED_FROM_ARTIFACT"
  },
  "shap": {
    "is_real_shap": true,
    "explainer_type": "linear_weight_decomposition",
    "raw_shap_values": { "behavior_anomaly": 3.6, ... },
    "residual": 0.0,
    "policy_override_detected": false
  }
}
```

### Key Fields

- **`raw_model_score`** — The pure model output before any heuristic overrides. `null` if the model was unavailable.
- **`heuristic_adjustment`** — Net change applied by hardcoded safety rules (`final - pre_heuristic`). `null` if model was used but no heuristic adjusted.
- **`reason_codes`** — Human-readable list of every rule that fired, in order.
- **`is_real_shap`** — `true` because the component-weight decomposition is mathematically equivalent to SHAP for a linear model.
- **`explainer_type`** — Always `"linear_weight_decomposition"` for the fusion layer.
- **`residual`** — Difference between `final_score - base_score` and the sum of raw SHAP values. Non-zero when policy gates (hard block, safe cap) override the fused score.

## SHAP Explanation

The `metadata.shap_explanation` field provides a waterfall-chart decomposition:

```json
{
  "base_score": 12,
  "final_score": 65,
  "contributions": [
    {"feature": "coercion_risk", "display_name": "Coercion Scam Patterns", "value": 18.5, "evidence": ""},
    {"feature": "scam_note_probability", "display_name": "Transfer Note Analysis", "value": 12.3, "evidence": "Matches scam-like keywords"},
    ...
  ],
  "is_real_shap": true,
  "explainer_type": "linear_weight_decomposition"
}
```

The frontend renders this as a waterfall chart. The `base_score` is the expected risk under a baseline profile.

## Heuristic Overrides

Both the scam classifier and anomaly detector apply hardcoded safety heuristics on top of the ML model output. These heuristics are:

- **Scam classifier**: UPI+keyword boost, known-benign cap, keyword-probability floor
- **Anomaly detector**: High-irregularity boost (≥0.80), extreme-irregularity boost (≥0.85), normal-behavior cap (≤0.12)

These overrides are transparently reported via `reason_codes` and `heuristic_adjustment` in `ml_diagnostics`.

## API Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/risk/evaluate` | POST | Evaluate a payment for fraud risk |
| `/admin/models` | GET | Model metadata (version, artifact path, metrics availability) |
| `/admin/overview` | GET | Dashboard overview including model metadata |

Response schemas are stable. The frontend contract (`shap_explanation` shape, component fields) must not change.
