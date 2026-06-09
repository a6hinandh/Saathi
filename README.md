# Saathi: AI-Driven Behavioral Authentication & Coercion Defense Overlay

Saathi is an enterprise-pattern showcase demonstrating an adaptive, privacy-preserving behavioral security overlay for retail internet banking. It senses user interactions, detects coercion or stress (e.g., vishing or digital arrest scams), classifies transaction intent semantics, and enforces real-time policy actions.

> **Showcase & Proof of Work Scope**: This repository is structured as a professional portfolio showcase. The retail banking portal, transaction ledger, and payment rails are mock simulations illustrating integration touchpoints. The behavioral biometrics tracking, database logging, ML pipeline, and policy fusion engines are fully functional.

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | Next.js 14, TypeScript, Tailwind CSS, Zustand, Recharts, Axios |
| Client SDK | Autonomous browser telemetry sensor capturing interaction dynamics |
| Backend | FastAPI (Python 3.11) |
| Machine Learning | scikit-learn (IsolationForest, TF-IDF + LogisticRegression), joblib |
| Database | SQLAlchemy ORM + SQLite |

## Architecture

```
Client Browser
  └─ Saathi Telemetry SDK → Global capture listeners → POST /risk/evaluate
FastAPI Risk Engine
  ├─ IsolationForest (behavioral anomaly)
  ├─ TF-IDF + LogisticRegression (scam note classifier)
  ├─ Coercion Heuristics Engine
  ├─ Weighted Risk Fusion
  └─ Policy Engine → Action: ALLOW / WARNING / STEP_UP / BLOCK
Fraud Operations Dashboard
  └─ Queries stats & alerts via REST API
```

### Client SDK (`frontend/src/saathi-sdk`)
Zero-dependency browser telemetry sensor measuring: keystroke latency, typing variance, backspace rate, focus switches, paste events, hesitation delays, and confirmation pauses. Never logs raw input values, passwords, or coordinates.

### ML Core (`backend/app/ml`)
- **Behavioral Anomaly Detector**: IsolationForest trained on synthetic typing profiles to detect stress patterns
- **Scam Note Classifier**: LogisticRegression on TF-IDF vectors of transfer reference notes

## Quick Start

### Backend

```bash
cd backend
python -m venv .venv
.venv\Scripts\activate      # Windows
# source .venv/bin/activate  # macOS/Linux
pip install -r requirements.txt

# Train ML models
python scripts/train-models.py

# Launch API server
uvicorn app.main:app --reload --port 8000
```

### Frontend

```bash
cd frontend
npm install
npm run dev
```

Open http://localhost:3000 to access the banking portal.

## Benchmark Results

All benchmarks run on synthetic data. Metrics do **not** represent real-world fraud detection accuracy.

| Metric | Policy Suite (57 scenarios) | Challenge Suite (35 scenarios) |
|--------|---------------------------|-------------------------------|
| Action Accuracy | 1.000 | 0.714 |
| Risk Level Accuracy | 1.000 | 0.629 |
| Score-in-Range Accuracy | 1.000 | 0.800 |
| Overall Accuracy | 1.000 | 0.429 |
| Risky Precision | 1.000 | 0.778 |
| Risky Recall | 1.000 | 1.000 |
| Risky F1 | 1.000 | 0.875 |

- **Policy Suite**: Regression tests for rule consistency — near-perfect scores are expected.
- **Challenge Suite**: Adversarial edge cases — lower scores reveal known limitations.

Run benchmarks:
```bash
cd backend
python -m app.ml.evaluation.run_benchmark --suite all
```

## API Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/risk/evaluate` | POST | Evaluate a payment for fraud risk |
| `/health` | GET | Service health check |
| `/admin/overview` | GET | Dashboard overview |
| `/admin/models` | GET | Model metadata & diagnostics |
| `/dashboard/stats` | GET | Aggregate statistics |
| `/dashboard/alerts` | GET | Active alerts list |

Full API contract in [backend/docs/api_contract.md](backend/docs/api_contract.md).

## Demonstration Scenarios

See [backend/docs/demo_script.md](backend/docs/demo_script.md) for 5 walkthrough scenarios covering:
1. Normal transaction → ALLOW
2. Suspicious transaction → WARNING
3. Coerced transaction → STEP_UP
4. KYC scam → BLOCK
5. Admin model preview dashboard

## Limitations

- **All training data is synthetic.** Real-world fraud data is not used.
- **Challenge benchmark** reveals known over-escalation in ambiguous cases (10 of 57 policy scenarios subject to heuristic overrides).
- No authentication, session management, or production-grade security.
- Federated learning status is simulated.
- This is a proof-of-concept for security reviews, hackathons, and portfolio demonstration.

## Documentation

| Document | Description |
|----------|-------------|
| [ML Backend](backend/docs/ml_backend.md) | Full ML architecture, diagnostics, SHAP explanation |
| [Benchmarking](backend/docs/benchmarking.md) | Benchmark suites, metrics, how to run |
| [Demo Script](backend/docs/demo_script.md) | Step-by-step demo walkthrough |
| [API Contract](backend/docs/api_contract.md) | Request/response schemas for all endpoints |
| [Testing Guide](docs/testing-and-understanding.md) | In-depth behavioral test scenarios |

## Commands Reference

```bash
cd backend
python -m pytest              # Run all tests (58 tests)
python scripts/train-models.py # Retrain ML models
python -m app.ml.evaluation.run_benchmark --suite all  # Full benchmark
```