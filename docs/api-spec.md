# API Spec

## GET /health

Response:

```json
{
  "status": "ok",
  "service": "saathi-risk-engine"
}
```

## POST /risk/evaluate

Request body:

```json
{
  "customer_id": "CUST-10021",
  "session_id": "sess_91ad",
  "amount": 25000,
  "beneficiary": "unknown_agent@upi",
  "note": "KYC verification fee",
  "features": {
    "avg_key_interval": 420,
    "typing_variance": 110,
    "backspace_rate": 0.22,
    "mouse_speed": 1200,
    "confirmation_delay": 24,
    "amount_edit_count": 4,
    "focus_switch_count": 6,
    "paste_count": 1,
    "hesitation_delay": 18
  }
}
```

Response:

```json
{
  "final_risk_score": 91,
  "request_id": "uuid",
  "alert_id": "uuid",
  "timestamp": "2026-05-23T12:00:00+00:00",
  "risk_level": "CRITICAL",
  "action": "BLOCK",
  "summary": "Possible scam-guided payment detected",
  "components": {
    "behavior_anomaly": 0.93,
    "scam_note_probability": 0.89,
    "hesitation_risk": 0.84,
    "coercion_risk": 0.95,
    "transaction_risk": 0.77,
    "device_risk": 0.22
  },
  "explanation": [
    "High hesitation before confirmation",
    "Repeated amount edits",
    "Scam-like note detected",
    "Unknown beneficiary with elevated risk"
  ],
  "structured_explanation": [
    {
      "factor": "Scam-like note",
      "evidence": "KYC verification fee",
      "impact": "HIGH"
    }
  ]
}
```

## GET /dashboard/alerts

Returns recent fraud alerts, timestamps, severity, action, and explanation.

## GET /dashboard/stats

Returns aggregate risk statistics for the fraud operations dashboard.

## POST /demo/run-scenario

Request:

```json
{
  "scenario": "SCAM_COERCION_PAYMENT"
}
```

Supported scenarios:

```text
NORMAL_PAYMENT
SUSPICIOUS_SESSION
SCAM_COERCION_PAYMENT
```

The endpoint runs the same pipeline as `POST /risk/evaluate`.

## POST /demo/reset

Clears persisted demo alerts.

## GET /federated/status

Returns simulated federated-learning status. It does not claim production federated learning.

## GET /admin/overview

Returns dashboard stats, newest persisted alerts, model metadata, simulated federated status, and `last_updated`.

## GET /admin/models

Returns runtime model metadata for the behavior anomaly model and scam-note classifier, including whether artifacts loaded or fallback inference is active.
