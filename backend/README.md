# Backend

FastAPI risk engine for Saathi.

## Stack

- FastAPI
- Python 3.11
- scikit-learn
- pandas
- numpy
- uvicorn
- pydantic

## Run locally

```bash
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
```

## API

- `GET /health`
- `POST /risk/evaluate`
- `POST /demo/run-scenario`
- `POST /demo/reset`
- `GET /federated/status`
- `GET /admin/overview`
- `GET /admin/models`
- `GET /dashboard/alerts`
- `GET /dashboard/stats`

The backend is structured into API routes, services, ML artifacts, dashboard helpers, and tests.

## Train models

```bash
cd backend
python ../scripts/train-models.py
```

This writes:

```text
backend/app/ml/artifacts/scam_note_model.joblib
backend/app/ml/artifacts/behavior_anomaly_model.joblib
```

Runtime services try to load these artifacts first. If an artifact is missing, incompatible, or scikit-learn is unavailable, the service uses the existing fallback heuristic or in-memory demo model.

## Run tests

```bash
cd backend
python -m pytest
```

## Demo scenarios

```bash
curl -X POST http://localhost:8000/demo/reset
curl -X POST http://localhost:8000/demo/run-scenario -H "Content-Type: application/json" -d "{\"scenario\":\"NORMAL_PAYMENT\"}"
curl -X POST http://localhost:8000/demo/run-scenario -H "Content-Type: application/json" -d "{\"scenario\":\"SUSPICIOUS_SESSION\"}"
curl -X POST http://localhost:8000/demo/run-scenario -H "Content-Type: application/json" -d "{\"scenario\":\"SCAM_COERCION_PAYMENT\"}"
```

Expected:

```text
NORMAL_PAYMENT -> LOW / ALLOW
SUSPICIOUS_SESSION -> HIGH / STEP_UP
SCAM_COERCION_PAYMENT -> CRITICAL / BLOCK / SCAM_GUIDED
```

## Notes

- `/risk/evaluate` remains the main frontend-compatible endpoint.
- Alerts are persisted to `backend/storage/risk_alerts.json`.
- Only aggregate feature vectors are stored; raw passwords, raw keystroke sequences, mouse paths, and full event streams are not logged.
- Federated learning is represented by `GET /federated/status` as simulated status, not a production FL implementation.
- Auth is demo-only.
