# Demo Script

This document provides 5 walkthrough scenarios demonstrating Saathi's risk evaluation capabilities.

## Prerequisites

- Backend running on `http://localhost:8000`
- Frontend running on `http://localhost:3000`
- Models trained (`python scripts/train-models.py`)

## Scenario 1: Normal Transaction → ALLOW

A legitimate payment to a saved beneficiary with normal behavior.

| Field | Value |
|-------|-------|
| amount | 12000 |
| beneficiary_type | saved |
| note | "Rent payment for June" |
| behavior | Regular typing, no backspaces, quick confirmation |

**Expected Response:**
- `action`: `ALLOW`
- `risk_score`: ~15-25
- `risk_level`: `LOW`

```bash
curl -X POST http://localhost:8000/risk/evaluate \
  -H "Content-Type: application/json" \
  -d '{
    "amount": 12000,
    "beneficiary_type": "saved",
    "note": "Rent payment for June",
    "avg_key_interval": 180,
    "typing_variance": 0.15,
    "backspace_rate": 0.02,
    "focus_switch_count": 0,
    "paste_count": 0,
    "hesitation_delay": 1.2,
    "confirmation_delay": 0.8
  }'
```

## Scenario 2: Mildly Suspicious → WARNING

Unknown beneficiary with slightly erratic typing.

| Field | Value |
|-------|-------|
| amount | 25000 |
| beneficiary_type | unknown |
| note | "Payment for services" |
| behavior | Mild hesitation, one paste event |

**Expected Response:**
- `action`: `WARNING`
- `risk_score`: ~30-45
- `risk_level`: `MEDIUM`

## Scenario 3: Coerced Transaction → STEP_UP

User being guided by a scammer — copying pasting beneficiary, high hesitation.

| Field | Value |
|-------|-------|
| amount | 50000 |
| beneficiary_type | unknown |
| note | "Payment for invoice" |
| behavior | Copy-paste beneficiary, long hesitation, erratic typing |

**Expected Response:**
- `action`: `STEP_UP`
- `risk_score`: ~60-70
- `risk_level`: `HIGH`

## Scenario 4: KYC Scam → BLOCK

Classic KYC verification fee scam with clear keyword match and high-value transfer.

| Field | Value |
|-------|-------|
| amount | 95000 |
| beneficiary_type | unknown |
| note | "KYC verification fee" |
| behavior | High hesitation, multiple focus switches, pasted beneficiary |

**Expected Response:**
- `action`: `BLOCK`
- `risk_score`: ~80-95
- `risk_level`: `CRITICAL`

## Scenario 5: Admin Dashboard — Model Preview

Check model metadata and benchmark results via the admin API.

```bash
curl http://localhost:8000/admin/models
```

Returns model versions, artifact status, metrics availability, and benchmark scores for both scam classifier and behavioral anomaly detector.

## Running Automated Demo

```bash
# Run all benchmark scenarios
python -m app.ml.evaluation.run_benchmark --suite all

# Run specific suite
python -m app.ml.evaluation.run_benchmark --suite policy
python -m app.ml.evaluation.run_benchmark --suite challenge
```