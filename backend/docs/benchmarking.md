# Fraud Scenario Benchmarking

## Benchmark Suites

The Saathi ML backend has **two benchmark suites**:

### 1. Synthetic Policy Regression Benchmark (57 scenarios)

**Purpose**: Verify that the risk engine's policy rules, gates, and heuristics remain consistent after changes. This is a *regression* test for the rule system.

**Characteristics**:
- 14 scenario categories covering clear fraud/benign patterns
- Expected values are based on explicit policy gate rules
- **Expected to achieve near-perfect scores** (action_accuracy ~1.0)
- A regression/degradation here means a rule change broke expected behavior

**Categories**:

| Category | Count | Description |
|----------|-------|-------------|
| Benign saved beneficiary payment | 8 | Low amount, saved beneficiary, benign note |
| Benign high-value saved beneficiary | 5 | High amount but saved beneficiary, mild hesitation |
| Unknown beneficiary normal behavior | 4 | Unknown beneficiary, moderate amount, normal typing |
| Urgent KYC scam | 5 | Scam keywords, large amount, high hesitation |
| Fake customer support scam | 4 | Support scam keywords, high amount |
| Investment scam | 3 | Investment keywords, very large amount |
| Family emergency scam | 4 | Emergency plea to unknown beneficiary |
| Mule account transfer | 4 | Large transfer with suspiciously smooth typing |
| Benign note but anomalous behavior | 4 | Normal note but highly erratic typing |
| Scam-like note but normal behavior | 4 | Scam keywords but saved beneficiary, normal behavior |
| High hesitation benign transaction | 3 | Benign but very high hesitation delay |
| Low amount scam | 3 | Scam note but amount too low for hard-block |
| High amount scam | 3 | Very high amount + scam note + unknown beneficiary |
| New device suspicious transfer | 3 | New device, unknown beneficiary, mild hesitation |

### 2. Adversarial Challenge Benchmark (35 scenarios)

**Purpose**: Probe the system's limits with ambiguous, adversarial cases that test the *edges* of the policy rules. Reveals limitations and over-escalation patterns.

**Characteristics**:
- 14 scenario categories covering tricky cases: indirect scam language, spelling variations, legitimate investment wording, copy-paste behavior, family emergency with saved beneficiary, etc.
- Expected values are based on *ideal* fraud detection behavior (what the system *should* do in an ideal fraud detector)
- **Expected to achieve lower scores** (action_accuracy typically <1.0)
- Failures reveal over-escalation, under-escalation, or missed detection

**Categories**:

| Category | Count | Description |
|----------|-------|-------------|
| Scam without obvious keywords | 3 | Indirect scam language, no direct keyword hit |
| Benign note with scam-like words | 3 | Normal transaction with accidental scam-trigger words |
| Family emergency saved beneficiary | 2 | Emergency wording but beneficiary is a saved contact |
| High-value legitimate business | 2 | Large amount to saved vendor, normal behavior |
| Low-value repeated suspicious | 2 | Small amounts, unknown beneficiary |
| Unknown beneficiary normal behavior | 3 | Legitimate payments to new people |
| Legitimate investment wording | 2 | Investment terms in legitimate context |
| Fake support spelling variants | 4 | Typo-based evasion of keyword matching |
| Indirect KYC scam | 3 | KYC scam described indirectly |
| Copy-pasted normal behavior | 2 | Paste operations but otherwise normal |
| Mule with vague note | 3 | Vague notes like "payment" or "transfer" |
| Anomalous behavior trusted beneficiary | 3 | Erratic typing but to a known person |
| Urgent language low risk | 2 | Urgent wording in low-risk context |
| Empty note risky behavior | 1 | Empty note with mule indicators |

## Metrics

- **Action Accuracy**: How often the predicted action (ALLOW/WARNING/STEP_UP/BLOCK) matches expected.
- **Risk Level Accuracy**: How often the risk level (LOW/MEDIUM/HIGH/CRITICAL) matches expected.
- **Score-in-Range Accuracy**: How often the risk score falls within the expected min/max range.
- **Overall Accuracy**: All three above match simultaneously.
- **Risky Precision/Recall/F1**: Binary classification treating STEP_UP and BLOCK as the positive class.
- **Confusion Matrix**: Expected vs actual action (4x4).
- **False Positives/Negatives**: Detailed scenario IDs for review.
- **Over/Under-escalation**: Counts where actual action was more/less severe than expected.

## How to Run

```bash
# From the backend directory
cd backend

# Run policy regression benchmark only
python -m app.ml.evaluation.run_benchmark --suite policy

# Run challenge adversarial benchmark only
python -m app.ml.evaluation.run_benchmark --suite challenge

# Run both (default)
python -m app.ml.evaluation.run_benchmark --suite all

# Or via script
python scripts/run-ml-benchmark.py --suite challenge
```

## Output Files

Located in `backend/app/ml/reports/`:

| File | Description |
|------|-------------|
| `benchmark_policy_report.json` | Full policy benchmark results (57 scenarios) |
| `benchmark_policy_report.md` | Human-readable policy benchmark summary |
| `benchmark_challenge_report.json` | Full challenge benchmark results (35 scenarios) |
| `benchmark_challenge_report.md` | Human-readable challenge benchmark summary |
| `benchmark_report.json` | Aggregate summary of both benchmarks |
| `anomaly_threshold_analysis.json` | Threshold comparison data from training |

Policy benchmark metrics are also available via API at `GET /admin/models` under `behavior_model.benchmark_*` fields.

## Limitations

- **All data is synthetic.** Both benchmarks use generated scenarios, not real fraud data. Metrics do not represent real-world fraud detection accuracy.
- **Policy benchmark** checks rule consistency — high scores mean the rules behave predictably, not that fraud is caught.
- **Challenge benchmark** reveals edge cases — low scores indicate where policy rules diverge from ideal detection.
- Expected values are heuristic estimates based on policy gate rules and ideal behavior, not learned from data.
- Scenarios test the full pipeline (ML + heuristics + policy gates) — individual component metrics appear in training reports.

## Threshold Analysis

Training runs an additional `analyze_anomaly_thresholds()` step that compares anomaly detection metrics at the 80th, 75th, and 70th percentiles of the raw IsolationForest anomaly score. This analysis is read-only and does not change the production `contamination=0.2` setting.

Results are saved to `backend/app/ml/reports/anomaly_threshold_analysis.json`.
