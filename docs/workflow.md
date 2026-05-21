# Workflow

1. User logs in to Innovate Bank.
2. Saathi initializes a session and starts tracking behavioral signals.
3. The SDK aggregates events locally into feature vectors.
4. On transfer submission, the frontend posts the feature payload to `/risk/evaluate`.
5. The backend runs:
   - behavior anomaly detection
   - scam note classification
   - hesitation analysis
   - coercion detection
   - transaction risk scoring
   - device risk scoring
6. Risk fusion generates a final score, risk level, action, and explanation.
7. The frontend displays the response immediately.
8. Fraud operations receives the alert and explanation.
