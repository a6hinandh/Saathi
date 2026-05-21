# Saathi

AI-driven behavioral authentication, coercion detection, and adaptive fraud prevention framework for internet banking.

Saathi is a controlled prototype that demonstrates how a behavioral security layer can sit beside an existing bank portal. It is not a banking core and does not handle account opening, ledger operations, or payment rails. The demo focuses on behavioral monitoring, feature extraction, anomaly detection, coercion detection, risk fusion, explainable decisioning, and fraud operations visibility for a mock PSB portal named Innovate Bank.

## What is included

- Mock internet banking frontend for Innovate Bank built with Next.js 14, TypeScript, Tailwind CSS, Zustand, Axios, and Recharts.
- Saathi browser SDK that captures behavioral signals locally and sends feature vectors, not raw sensitive inputs.
- FastAPI backend with layered services for anomaly detection, scam note classification, hesitation analysis, coercion detection, risk fusion, and policy decisions.
- Fraud operations dashboard with alerts, scores, explanations, and chart-based monitoring.
- Sample data, scripts, Docker compose, and documentation for hackathon-style demos.

## Demo flow

1. Customer signs in to the Innovate Bank portal.
2. Saathi JS SDK tracks behavioral signals during navigation and transfer entry.
3. Events are transformed locally into feature vectors.
4. The frontend sends a feature payload to the backend risk API.
5. The backend evaluates behavior anomaly, scam note probability, hesitation, coercion risk, transaction risk, and device risk.
6. The risk fusion engine produces a final score and policy action.
7. The UI shows allow, warning, step-up, or block, and the dashboard logs the explanation for fraud ops.

## Strong demo case

- Amount: ₹25,000
- Beneficiary: unknown_agent@upi
- Note: KYC verification fee
- Behavior: abnormal typing rhythm, repeated amount edits, long hesitation, multiple focus switches, copy-paste detection

Expected output:

- Risk Score: 91
- Risk Level: CRITICAL
- Action: BLOCK
- Reason: Possible scam-guided payment detected

## Architecture

- Frontend: Next.js 14, TypeScript, Tailwind CSS, Axios, Zustand, Recharts
- Backend: FastAPI, Python 3.11, scikit-learn, pandas, numpy, uvicorn, pydantic
- Storage: SQLite by default, PostgreSQL ready through Docker Compose
- ML: Isolation Forest, TF-IDF + Logistic Regression, rule-based coercion engine, weighted risk fusion

See [docs/architecture.md](docs/architecture.md) and [docs/workflow.md](docs/workflow.md) for the full control flow.

## Repo layout

- [frontend/README.md](frontend/README.md) for the portal and SDK implementation notes.
- [backend/README.md](backend/README.md) for the risk API and services.
- [docs/api-spec.md](docs/api-spec.md) for endpoint contracts.
- [docs/threat-model.md](docs/threat-model.md) for the hackathon security framing.
- [docs/demo-script.md](docs/demo-script.md) for the presenter runbook.

## Setup

### Frontend

```bash
cd frontend
npm install
npm run dev
```

### Backend

```bash
cd backend
python -m venv .venv
.venv\Scripts\activate
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
```

### Docker

```bash
docker compose up --build
```

## Screenshots

Add final demo screenshots under [docs/screenshots](docs/screenshots) and frontend screenshots under [frontend/screenshots](frontend/screenshots).

## API surface

- `GET /health`
- `POST /risk/evaluate`
- `GET /dashboard/alerts`
- `GET /dashboard/stats`

Full request and response examples live in [docs/api-spec.md](docs/api-spec.md).

## Notes

This repository is intentionally designed as a realistic proof-of-concept for a security review or hackathon pitch. It should be integrated into an existing banking portal rather than used as a standalone retail banking application.
