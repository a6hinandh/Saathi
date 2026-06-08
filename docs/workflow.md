# Saathi Transaction Risk Evaluation Workflow

This document describes the step-by-step runtime workflow of the Saathi security overlay during a retail banking session.

---

## 1. User Interaction & Telemetry Collection

1. **Session Initialization**: The customer signs in to the *Saathi Bank of India* internet banking portal. The Saathi Browser SDK initializes a unique `session_id` and starts monitoring.
2. **Behavior Logging**: As the customer navigates the portal and prepares a fund transfer, the SDK captures behavioral signals:
   - Keystroke time deltas in details inputs.
   - Mouse speed coordinates.
   - Focus switches between form inputs or browser tabs.
   - Values modification (e.g. amount edits).
   - Clipboard events (copy-pasting beneficiary coordinates).
3. **Local Vectorization**: The SDK aggregates these events locally, generating a feature snapshot (`BehaviorFeatures`). No raw credentials or keystrokes are stored or transmitted.

---

## 2. Risk Evaluation Lifecycle

4. **REST Submission**: The customer clicks the "Review & Transfer" button. The frontend banking portal halts submission and posts a JSON evaluation request to the backend `/risk/evaluate` endpoint.
5. **Component Scopes**: The backend FastAPI service resolves the session context and runs parallel evaluations:
   - **Behavior Anomaly**: The pre-trained `IsolationForest` ML model evaluates typing cadence consistency and variance.
   - **Scam note classification**: The pre-trained `LogisticRegression` ML model evaluates the transfer reference note.
   - **Hesitation Engine**: Heuristics evaluate input pauses, focus switches, and confirmation delays.
   - **Transaction & Device scoring**: Heuristics calculate beneficiary risks and verify device identifiers.
6. **Risk Fusion**: The fusion engine combines the component scores into a final risk score (0 to 100).
7. **Policy Decision**: The policy engine maps the risk score to an enforcement action:
   - **Risk <= 30 (ALLOW)**: The backend authorizes the transfer. The customer sees a success screen.
   - **31 <= Risk <= 60 (WARNING)**: The customer is shown an interactive vishing safety modal warning (" hang up if you are being guided by someone on a call"). The customer can choose to cancel or proceed.
   - **61 <= Risk <= 80 (STEP-UP)**: Requires out-of-band multi-factor verification.
   - **Risk > 80 (BLOCK)**: The transaction is blocked instantly to safeguard funds. The customer is shown a transaction blocked screen explaining the behavioral triggers.

---

## 3. Operations Logging & Monitoring

8. **Database Persistence**: The FastAPI endpoint writes the finalized evaluation, including components score, action, and detailed risk explanations, as a persistent row in the SQLite database (`saathi.db`).
9. **Dashboard Update**: The **Fraud Operations Dashboard** updates in real-time, displaying:
   - The newly generated fraud alert entry.
   - The specific behavioral indicators (e.g., "high hesitation", "scam-like note", "external UPI handle") via the explanation panel.
   - Updated aggregate dashboard statistics (average risk scores, active alerts count, block ratios).
