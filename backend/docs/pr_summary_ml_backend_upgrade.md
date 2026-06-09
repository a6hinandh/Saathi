# PR Summary: ML Backend Upgrade

## Overview

This PR upgrades the Saathi risk evaluation backend with enhanced ML diagnostics, honest SHAP explanations, enriched admin model metadata, separate benchmark suites (policy + challenge), and comprehensive test coverage — all while preserving the existing API contract and frontend compatibility.

## Files Changed

### New Files
- `backend/app/ml/benchmarks/fraud_challenge_scenarios.jsonl` — 35 adversarial challenge scenarios
- `backend/app/ml/evaluation/run_benchmark.py` — Benchmark runner with `--suite` support
- `backend/app/ml/evaluation/scenario_evaluator.py` — Core evaluation logic
- `backend/app/ml/evaluation/report_generator.py` — JSON + Markdown report generation
- `backend/app/tests/test_ml_upgrade.py` — 28 new tests covering ML diagnostics, SHAP, benchmarks, fallback behavior
- `backend/docs/ml_backend.md` — ML architecture documentation
- `backend/docs/benchmarking.md` — Benchmark suite documentation
- `backend/docs/demo_script.md` — Demo walkthrough scenarios
- `backend/docs/api_contract.md` — API contract specification
- `backend/docs/pr_summary_ml_backend_upgrade.md` — This document
- `backend/scripts/train-models.py` — Consolidated training script

### Modified Files
- `backend/app/ml/training/train.py` — Enhanced artifact format with metadata, metrics, synthetic data warnings
- `backend/app/services/anomaly_detection.py` — ML diagnostics output, heuristic override transparency
- `backend/app/services/scam_classifier.py` — ML diagnostics output, reason codes, keyword tracking
- `backend/app/services/coercion_engine.py` — Exposed coercion label in response
- `backend/app/services/risk_fusion.py` — Enriched risk fusion with component tracking
- `backend/app/services/shap_service.py` — Linear weight decomposition SHAP
- `backend/app/utils/constants.py` — Updated constants
- `backend/app/api/routes/risk.py` — ml_diagnostics in response metadata
- `backend/app/api/routes/admin.py` — Enriched model metadata endpoint
- `backend/requirements.txt` — Added scikit-learn>=1.0

## ML Improvements

### Artifact Format
Each `.joblib` artifact is now a dictionary with version, metrics, training metadata, and synthetic data warning:
- `model_version` (semver)
- `metrics` (accuracy, precision, recall, F1, confusion matrix)
- `training_date`, `data_source`, `synthetic_data_warning`

### ML Diagnostics
Every `POST /risk/evaluate` response includes `metadata.ml_diagnostics`:
- `scam_classifier`: raw_model_score, heuristic_adjustment, keyword_hits, reason_codes, model_status
- `anomaly_detector`: raw_model_score, heuristic_adjustment, heuristic_override_applied, reason_codes, model_status
- `shap`: is_real_shap, explainer_type, raw_shap_values, residual, policy_override_detected

### SHAP Honesty
SHAP explanations use linear weight decomposition — mathematically equivalent to true SHAP for the fusion layer (weighted linear sum of 6 components). Flagged by `is_real_shap: true` and `explainer_type: "linear_weight_decomposition"`.

### Fallback Behavior
When `.joblib` artifacts are missing, models fall back to in-memory heuristics. Diagnostics clearly report `model_status: "FALLBACK_IN_MEMORY"`. All 58 tests pass with both real and fallback models.

## Benchmark Results

### Policy Regression Suite (57 scenarios)
| Metric | Value |
|--------|-------|
| Action Accuracy | 1.0 |
| Risk Level Accuracy | 1.0 |
| Score-in-Range Accuracy | 1.0 |
| Overall Accuracy | 1.0 |
| Risky Precision | 1.0 |
| Risky Recall | 1.0 |
| Risky F1 | 1.0 |

### Adversarial Challenge Suite (35 scenarios)
| Metric | Value |
|--------|-------|
| Action Accuracy | 0.714 |
| Risk Level Accuracy | 0.629 |
| Score-in-Range Accuracy | 0.800 |
| Overall Accuracy | 0.429 |
| Risky Precision | 0.778 |
| Risky Recall | 1.0 |
| Risky F1 | 0.875 |

**Known limitations revealed by challenge suite:**
- 10 over-escalations in ambiguous cases (indirect language, spelling variants, legitimate investment wording)
- 0 under-escalations — system is conservative by design
- All data is synthetic; metrics do not represent real-world accuracy

## Test Coverage

| Suite | Count | Focus |
|-------|-------|-------|
| test_demo_readiness.py | 14 | Demo scenarios, fallback, error handling |
| test_ml_upgrade.py | 28 | Artifact format, diagnostics, SHAP, benchmarks |
| test_api.py | 8 | API endpoint validation |
| test_coercion.py | 4 | Coercion engine detection |
| test_anomaly.py | 2 | Anomaly detector behavior |
| test_risk.py | 2 | Risk fusion consistency |
| **Total** | **58** | All pass |

## Frontend Compatibility

- No frontend files were modified
- All API response schemas are backward-compatible (`shap_explanation` shape, `final_risk_score`, `risk_level`, `action` unchanged)
- `ml_diagnostics` is an *addition* to `metadata`, not a breaking change
- The frontend is a separate Next.js project with its own `package.json`

## Known Limitations

1. **Synthetic data only**: All training and benchmark data is generated, not real fraud cases
2. **Challenge accuracy**: 0.714 action accuracy reveals policy rules are conservative (over-escalate on ambiguity)
3. **SHAP is a mathematical approximation**: Linear weight decomposition is exact for this model architecture but not a general SHAP explainer
4. **No authentication**: Backend APIs have no auth layer (demo only)
5. **SQLite**: Not suitable for production scale

## Reviewer Checklist

- [x] All 58 tests pass
- [x] Policy benchmark achieves action_accuracy >= 0.95
- [x] Challenge benchmark generates separate report
- [x] Fallback models produce valid responses with clear diagnostics
- [x] API response schema unchanged at top level
- [x] No frontend files modified
- [x] Documentation covers ml_diagnostics, SHAP, benchmarks, limitations
- [x] Synthetic data warnings present in artifact metadata
- [x] Training script produces versioned artifacts with metrics