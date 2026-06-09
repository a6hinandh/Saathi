# API Contract

This document specifies the request/response schemas for all frontend-critical API endpoints.

## Common Conventions

- Base URL: `http://localhost:8000`
- All requests and responses use `Content-Type: application/json`
- Risk scores range from 0–100
- Actions: `ALLOW`, `WARNING`, `STEP_UP`, `BLOCK`
- Risk levels: `LOW`, `MEDIUM`, `HIGH`, `CRITICAL`

## Endpoints

---

### POST /risk/evaluate

Evaluate a payment transaction for fraud risk.

**Request Body:**

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `amount` | number | yes | Transaction amount in INR |
| `beneficiary_type` | string | yes | `"saved"` or `"unknown"` |
| `note` | string | yes | Transfer reference note |
| `avg_key_interval` | number | no | Average keystroke interval (ms) |
| `typing_variance` | number | no | Typing rhythm variance |
| `backspace_rate` | number | no | Backspace keystroke ratio |
| `focus_switch_count` | integer | no | Page focus changes |
| `paste_count` | integer | no | Paste events count |
| `hesitation_delay` | number | no | Pre-confirmation pause (s) |
| `confirmation_delay` | number | no | Confirmation click delay (s) |

**Response Body:**

```json
{
  "action": "BLOCK",
  "risk_score": 83.5,
  "risk_level": "CRITICAL",
  "risk_factors": [
    {"name": "scam_note_probability", "score": 72.0, "weight": 1.0},
    {"name": "anomaly_score", "score": 68.0, "weight": 1.0},
    {"name": "coercion_risk", "score": 90.0, "weight": 1.0}
  ],
  "metadata": {
    "ml_diagnostics": {
      "scam_classifier": {
        "raw_model_score": 0.85,
        "heuristic_adjustment": -0.05,
        "keyword_hits": 2,
        "reason_codes": ["kyc_keyword_detected"],
        "model_provided_score": true,
        "final_probability": 0.80,
        "model_status": "LOADED_FROM_ARTIFACT"
      },
      "anomaly_detector": {
        "raw_model_score": 0.55,
        "heuristic_adjustment": 0.35,
        "reason_codes": ["high_irregularity_boost"],
        "model_provided_score": true,
        "final_score": 0.90,
        "model_status": "LOADED_FROM_ARTIFACT"
      },
      "shap": {
        "is_real_shap": true,
        "explainer_type": "linear_weight_decomposition",
        "raw_shap_values": {
          "scam_note_probability": 3.2,
          "anomaly_score": 2.1,
          "coercion_risk": 4.5,
          "hesitation_risk": 1.8,
          "amount_risk": 1.2,
          "beneficiary_risk": 2.0
        },
        "residual": 0.0,
        "policy_override_detected": false
      }
    },
    "shap_explanation": {
      "base_score": 12.0,
      "final_score": 83.5,
      "contributions": [
        {"feature": "coercion_risk", "display_name": "Coercion Scam Patterns", "value": 4.5, "evidence": ""},
        {"feature": "scam_note_probability", "display_name": "Transfer Note Analysis", "value": 3.2, "evidence": "kyc_keyword_detected"},
        {"feature": "anomaly_score", "display_name": "Behavioral Anomaly", "value": 2.1, "evidence": ""},
        {"feature": "beneficiary_risk", "display_name": "Beneficiary Risk", "value": 2.0, "evidence": ""},
        {"feature": "hesitation_risk", "display_name": "Hesitation Risk", "value": 1.8, "evidence": ""},
        {"feature": "amount_risk", "display_name": "Amount Risk", "value": 1.2, "evidence": ""}
      ],
      "is_real_shap": true,
      "explainer_type": "linear_weight_decomposition"
    }
  }
}
```

---

### GET /health

Service health check.

**Response:** `{"status": "healthy"}`

---

### GET /admin/overview

Dashboard overview with model and alert summary.

**Response:**

```json
{
  "active_models": {
    "scam_classifier": "loaded",
    "behavioral_anomaly": "loaded"
  },
  "model_versions": {
    "scam_classifier": "1.2.0",
    "behavioral_anomaly": "1.0.0"
  },
  "total_alerts": 15,
  "critical_alerts": 3,
  "high_alerts": 5,
  "medium_alerts": 4,
  "low_alerts": 3,
  "recent_actions": [
    {"action": "BLOCK", "risk_score": 88.0, "timestamp": "..."}
  ]
}
```

---

### GET /admin/models

Model metadata, versions, artifact status, and benchmark metrics.

**Response:**

```json
{
  "scam_classifier": {
    "version": "1.2.0",
    "status": "LOADED_FROM_ARTIFACT",
    "artifact_path": "ml/artifacts/scam_note_model.joblib",
    "training_data_source": "synthetic",
    "metrics_available": true,
    "benchmark_action_accuracy": 1.0
  },
  "behavior_model": {
    "version": "1.0.0",
    "status": "LOADED_FROM_ARTIFACT",
    "artifact_path": "ml/artifacts/behavior_anomaly_model.joblib",
    "training_data_source": "synthetic",
    "metrics_available": true,
    "benchmark_action_accuracy": 1.0,
    "anomaly_threshold": 0.80
  },
  "policy_date": "2025-06-01",
  "risk_summary": {
    "action": {"ALLOW": 3, "WARNING": 5, "STEP_UP": 4, "BLOCK": 3},
    "severity": {"LOW": 3, "MEDIUM": 4, "HIGH": 5, "CRITICAL": 3}
  }
}
```

---

### GET /dashboard/stats

Aggregate statistics for dashboard charts.

**Response:**

```json
{
  "total_evaluations": 100,
  "active_alerts": 15,
  "risk_distribution": {
    "LOW": 25,
    "MEDIUM": 40,
    "HIGH": 25,
    "CRITICAL": 10
  },
  "action_distribution": {
    "ALLOW": 20,
    "WARNING": 50,
    "STEP_UP": 20,
    "BLOCK": 10
  },
  "avg_risk_score": 42.3,
  "max_risk_score": 95.0,
  "risk_trend": [30, 35, 28, 45, 42]
}
```

---

### GET /dashboard/alerts

List of active risk alerts.

| Query Param | Type | Default | Description |
|-------------|------|---------|-------------|
| `limit` | int | 50 | Max alerts to return |
| `min_severity` | string | `"LOW"` | Minimum severity filter |

**Response:**

```json
{
  "alerts": [
    {
      "id": 1,
      "amount": 95000,
      "risk_score": 88.0,
      "risk_level": "CRITICAL",
      "action_taken": "BLOCK",
      "reason": "KYC verification fee detected",
      "timestamp": "2025-06-01T12:00:00Z"
    }
  ],
  "total": 1,
  "limit": 50
}
```

## Stability Guarantees

- Top-level `action`, `risk_score`, `risk_level` fields are stable.
- `risk_factors` array order is not guaranteed.
- `metadata.shap_explanation.contributions` order is descending by contribution magnitude.
- `metadata.ml_diagnostics` fields may be extended but will not be removed.

## Error Responses

All endpoints return appropriate HTTP status codes:

| Code | Meaning |
|------|---------|
| 200 | Success |
| 422 | Validation error (missing/invalid fields) |
| 500 | Internal server error |
| 503 | Service unavailable (models not loaded) |