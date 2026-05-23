# Demo Script

## Backend setup

```bash
cd backend
pip install -r requirements.txt
python ../scripts/train-models.py
uvicorn app.main:app --reload --port 8000
```

## Frontend setup

```bash
cd frontend
npm install
npm run dev
```

## API demo path

1. Reset demo logs:

```bash
curl -X POST http://localhost:8000/demo/reset
```

2. Run normal payment:

```bash
curl -X POST http://localhost:8000/demo/run-scenario -H "Content-Type: application/json" -d "{\"scenario\":\"NORMAL_PAYMENT\"}"
```

Expected: `LOW / ALLOW`.

3. Run suspicious session:

```bash
curl -X POST http://localhost:8000/demo/run-scenario -H "Content-Type: application/json" -d "{\"scenario\":\"SUSPICIOUS_SESSION\"}"
```

Expected: `HIGH / STEP_UP`.

4. Run scam-coercion payment:

```bash
curl -X POST http://localhost:8000/demo/run-scenario -H "Content-Type: application/json" -d "{\"scenario\":\"SCAM_COERCION_PAYMENT\"}"
```

Expected: `CRITICAL / BLOCK`, `SCAM_GUIDED`, score `85+`.

5. Open dashboard overview:

```bash
curl http://localhost:8000/admin/overview
```

Show recent alerts, model metadata, structured explanations, persisted alert IDs, and simulated federated status.

## UI demo path

1. Open Innovate Bank and sign in.
2. Show the dashboard balances and recent activity.
3. Start a transfer for Rs. 25,000 to `unknown_agent@upi`.
4. Enter the note `KYC verification fee`.
5. Pause, edit the amount repeatedly, and switch focus fields to simulate hesitation.
6. Submit the transfer.
7. Show the Saathi risk panel returning a CRITICAL block decision.
8. Open the fraud dashboard and point out the explanation, component scores, model metadata, and alert history.
9. Explain that the same interface could integrate into an existing bank portal as a behavioral defense layer.

## Real vs simulated

- `/risk/evaluate` is the real demo risk path used by the frontend and scenario endpoint.
- Saved `.joblib` artifacts are loaded when present, with safe fallbacks if missing.
- Federated learning is simulated. The status endpoint does not claim production FL.
- Auth and banking ledger behavior are demo-only mocks.
- Only aggregate behavioral feature vectors are persisted; raw passwords, raw keystroke sequences, mouse paths, and full event streams are not logged.
