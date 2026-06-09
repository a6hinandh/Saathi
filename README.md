# Saathi

A full-stack behavioral fraud-risk prototype for retail net banking.

Saathi simulates how a banking system could detect high-risk transactions by combining browser interaction telemetry, scam-intent classification, behavioral anomaly detection, and rule-based policy decisions.

The project is built as an engineering prototype, not a production fraud-detection system. It uses synthetic training data and mock banking flows to demonstrate system design, backend ML integration, API design, and fraud-risk dashboarding.

## What It Does

Saathi monitors user interaction patterns during a simulated banking transaction and assigns a fraud-risk decision.

The system can detect signals such as:

- Unusual typing rhythm
- High hesitation before confirmation
- Frequent focus switching
- Paste-heavy behavior
- Suspicious transaction notes
- Scam-like payment context

Based on these signals, the backend returns one of four policy actions:

- `ALLOW`
- `WARNING`
- `STEP_UP`
- `BLOCK`

## Why This Project Exists

Many online banking scams do not look like technical account compromise. In cases such as digital arrest scams, KYC fraud, or vishing, the user may technically be logged in correctly but may be acting under pressure.

Saathi explores whether behavioral telemetry and transaction-context signals can be used to flag risky sessions before the payment is completed.

## System Architecture

```text
Browser Banking UI
    ↓
Saathi Telemetry SDK
    ↓
FastAPI Risk Engine
    ├── Behavioral anomaly detector
    ├── Scam-note classifier
    ├── Coercion heuristic engine
    ├── Risk fusion layer
    └── Policy engine
            ↓
ALLOW / WARNING / STEP_UP / BLOCK
    ↓
Admin fraud dashboard
```

## Tech Stack

| Layer                      | Technology                                                 |
| -------------------------- | ---------------------------------------------------------- |
| Frontend                   | Next.js 14, TypeScript, Tailwind CSS                       |
| State / UI                 | Zustand, Recharts, Axios                                   |
| Backend                    | FastAPI, Python 3.11                                       |
| ML                         | scikit-learn, IsolationForest, TF-IDF, Logistic Regression |
| Database                   | SQLAlchemy, SQLite                                         |
| Testing                    | Pytest                                                     |
| Deployment-ready structure | Docker Compose, GitHub Actions                             |

## Implemented Features

### Frontend

- Simulated retail banking portal
- Payment flow with risk evaluation
- Browser telemetry SDK
- Admin dashboard for alerts and statistics
- Risk result display and transaction feedback

### Backend

- `/risk/evaluate` endpoint for transaction risk scoring
- Behavioral anomaly scoring
- Scam-note classification
- Heuristic coercion scoring
- Weighted risk fusion
- Policy action generation
- Dashboard and admin APIs
- Model metadata and diagnostics endpoint

### ML and Evaluation

- Synthetic-data training pipeline
- Scam-note classifier using TF-IDF + Logistic Regression
- Behavioral anomaly detector using IsolationForest
- Benchmark suites for policy regression and challenge scenarios
- Reproducible model training commands

## What Is Real vs Simulated

| Component                          | Status                          |
| ---------------------------------- | ------------------------------- |
| Browser telemetry capture          | Implemented                     |
| FastAPI risk engine                | Implemented                     |
| Risk fusion logic                  | Implemented                     |
| Scam-note classifier               | Implemented with synthetic data |
| Behavioral anomaly detector        | Implemented with synthetic data |
| Admin dashboard                    | Implemented                     |
| Banking ledger/payment rails       | Mock simulation                 |
| Federated learning                 | Simulated only                  |
| Production authentication/security | Not implemented                 |
| Real-world fraud validation        | Not included                    |

## Benchmark Results

All benchmarks use synthetic scenarios. These results are meant to test system behavior and regression consistency, not real-world fraud-detection accuracy.

| Metric                  | Policy Suite | Challenge Suite |
| ----------------------- | -----------: | --------------: |
| Action Accuracy         |        1.000 |           0.714 |
| Risk Level Accuracy     |        1.000 |           0.629 |
| Score-in-Range Accuracy |        1.000 |           0.800 |
| Overall Accuracy        |        1.000 |           0.429 |
| Risky Precision         |        1.000 |           0.778 |
| Risky Recall            |        1.000 |           1.000 |
| Risky F1                |        1.000 |           0.875 |

The policy suite validates expected rule behavior. The challenge suite contains harder edge cases and exposes current limitations in ambiguous scenarios.

## API Endpoints

| Endpoint            | Method | Purpose                        |
| ------------------- | ------ | ------------------------------ |
| `/health`           | GET    | Health check                   |
| `/risk/evaluate`    | POST   | Evaluate transaction risk      |
| `/admin/overview`   | GET    | Admin dashboard summary        |
| `/admin/models`     | GET    | Model metadata and diagnostics |
| `/dashboard/stats`  | GET    | Aggregate fraud statistics     |
| `/dashboard/alerts` | GET    | Active alert list              |

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
