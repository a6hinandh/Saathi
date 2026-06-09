"""Fraud scenario benchmark for the Saathi ML backend.

Evaluates the risk engine against curated fraud/benign scenarios and
computes accuracy, precision, recall, F1 metrics.

Supports two suites:
  - policy   : Synthetic policy regression benchmark (57 scenarios).
               Tests policy rule consistency. Expected to be near-perfect.
  - challenge: Adversarial challenge benchmark (35 scenarios).
               Tests edge cases, ambiguities, and evasion. Expected to be lower
               and reveal limitations.

Usage:
    python -m backend.app.ml.evaluation.run_benchmark --suite policy
    python -m backend.app.ml.evaluation.run_benchmark --suite challenge
    python -m backend.app.ml.evaluation.run_benchmark --suite all
    python scripts/run-ml-benchmark.py --suite challenge
"""
from __future__ import annotations

import argparse
import json
import sys
from datetime import datetime, timezone
from pathlib import Path
from typing import Any

ROOT = Path(__file__).resolve().parents[3]
sys.path.insert(0, str(ROOT))

BENCHMARK_DIR = ROOT / 'app' / 'ml' / 'benchmarks'
POLICY_BENCHMARK_FILE = BENCHMARK_DIR / 'fraud_scenarios.jsonl'
CHALLENGE_BENCHMARK_FILE = BENCHMARK_DIR / 'fraud_challenge_scenarios.jsonl'
REPORT_DIR = ROOT / 'app' / 'ml' / 'reports'
REPORT_JSON = REPORT_DIR / 'benchmark_report.json'

SUITES = {
    'policy': {
        'file': POLICY_BENCHMARK_FILE,
        'label': 'Synthetic Policy Regression Benchmark',
        'report_json': REPORT_DIR / 'benchmark_policy_report.json',
        'report_md': REPORT_DIR / 'benchmark_policy_report.md',
    },
    'challenge': {
        'file': CHALLENGE_BENCHMARK_FILE,
        'label': 'Synthetic Adversarial Challenge Benchmark',
        'report_json': REPORT_DIR / 'benchmark_challenge_report.json',
        'report_md': REPORT_DIR / 'benchmark_challenge_report.md',
    },
}


def _feat(overrides: dict) -> dict:
    """Build a BehaviorFeatures dict with defaults overridden."""
    base = {
        'avg_key_interval': 220, 'typing_variance': 500, 'backspace_rate': 0.08,
        'mouse_speed': 800, 'confirmation_delay': 4, 'amount_edit_count': 0,
        'focus_switch_count': 0, 'paste_count': 0, 'hesitation_delay': 2
    }
    base.update(overrides)
    return base


def _input(
    amount: float, beneficiary: str, note: str,
    beneficiary_type: str = 'SAVED', device_id: str = 'dev-001',
    features: dict | None = None
) -> dict:
    return {
        'customer_id': 'BENCH-CUST',
        'session_id': 'bench-sess',
        'amount': amount,
        'beneficiary': beneficiary,
        'beneficiary_type': beneficiary_type,
        'note': note,
        'device_id': device_id,
        'features': _feat(features or {})
    }


def generate_scenarios() -> list[dict]:
    """Generate 57 synthetic policy regression scenarios."""
    scenarios = []

    # --- 1. Benign saved beneficiary payment (8) ---
    for i, (amt, note) in enumerate([
        (500, 'dinner'), (200, 'lunch'), (800, 'groceries refund'),
        (300, 'monthly savings'), (100, 'gift'), (400, 'car service'),
        (600, 'books'), (150, 'gym membership fee')
    ]):
        scenarios.append({
            'scenario_id': f'benign-saved-{i+1:02d}',
            'scenario_type': 'benign_saved_beneficiary_payment',
            'input': _input(amt, 'priya.sharma@upi', note),
            'expected_risk_level': 'LOW',
            'expected_action': 'ALLOW',
            'expected_min_score': 0,
            'expected_max_score': 30,
            'notes': f'Saved beneficiary, low amount ({amt}), benign note, normal typing.'
        })

    # --- 2. Benign high-value saved beneficiary (5) ---
    for i, (amt, note, feat) in enumerate([
        (5000, 'school fees', {'hesitation_delay': 3}),
        (8000, 'rent payment', {'typing_variance': 600, 'hesitation_delay': 4}),
        (10000, 'home repair', {'confirmation_delay': 6, 'hesitation_delay': 5}),
        (6000, 'office expense', {'hesitation_delay': 3}),
        (12000, 'family transfer', {'hesitation_delay': 4})
    ]):
        scenarios.append({
            'scenario_id': f'benign-high-value-{i+1:02d}',
            'scenario_type': 'benign_high_value_saved_beneficiary',
            'input': _input(amt, 'rohan.mehta@okaxis', note, features=feat),
            'expected_risk_level': 'LOW',
            'expected_action': 'ALLOW',
            'expected_min_score': 0,
            'expected_max_score': 40,
            'notes': f'Saved beneficiary, high amount ({amt}), benign note, mild hesitation.'
        })

    # --- 3. Unknown beneficiary normal behavior (4) ---
    for i, (amt, note) in enumerate([
        (2000, 'dinner'), (3000, 'gift'), (1500, 'books'), (2500, 'subscription')
    ]):
        scenarios.append({
            'scenario_id': f'unknown-normal-{i+1:02d}',
            'scenario_type': 'unknown_beneficiary_normal_behavior',
            'input': _input(amt, 'new_person@upi', note, beneficiary_type='CUSTOM'),
            'expected_risk_level': 'LOW',
            'expected_action': 'ALLOW',
            'expected_min_score': 0,
            'expected_max_score': 35,
            'notes': f'Unknown beneficiary, moderate amount ({amt}), benign note, normal behavior.'
        })

    # --- 4. Urgent KYC scam (5) ---
    kyc_notes = [
        'KYC verification fee', 'urgent verification fee',
        'account unlock charge', 'RBI compliance payment',
        'anti-money laundering audit charge'
    ]
    for i, note in enumerate(kyc_notes):
        scenarios.append({
            'scenario_id': f'kyc-scam-{i+1:02d}',
            'scenario_type': 'urgent_kyc_scam',
            'input': _input(
                25000 + i * 5000, 'agent_unknown@upi', note,
                beneficiary_type='CUSTOM', device_id='dev-scam',
                features={'typing_variance': 12000, 'backspace_rate': 0.28,
                          'focus_switch_count': 5, 'hesitation_delay': 20,
                          'amount_edit_count': 3, 'paste_count': 1}
            ),
            'expected_risk_level': 'CRITICAL',
            'expected_action': 'BLOCK',
            'expected_min_score': 85,
            'expected_max_score': 100,
            'notes': 'Scam keyword, large amount, unknown beneficiary, high hesitation.'
        })

    # --- 5. Fake customer support scam (4) ---
    support_notes = [
        'tech support security deposit',
        'credit card verification payment',
        'insurance processing clearance',
        'customs clearance fee'
    ]
    for i, note in enumerate(support_notes):
        scenarios.append({
            'scenario_id': f'support-scam-{i+1:02d}',
            'scenario_type': 'fake_customer_support_scam',
            'input': _input(
                15000 + i * 5000, 'support_agent@upi', note,
                beneficiary_type='CUSTOM', device_id='dev-scam',
                features={'typing_variance': 11000, 'backspace_rate': 0.25,
                          'focus_switch_count': 4, 'hesitation_delay': 22,
                          'amount_edit_count': 3, 'paste_count': 1}
            ),
            'expected_risk_level': 'CRITICAL',
            'expected_action': 'BLOCK',
            'expected_min_score': 85,
            'expected_max_score': 100,
            'notes': 'Support scam keyword + high amount + hesitation.'
        })

    # --- 6. Investment scam (3) ---
    for i, (amt, note, feat) in enumerate([
        (40000, 'lottery processing tax',
         {'typing_variance': 13000, 'backspace_rate': 0.30, 'hesitation_delay': 18,
          'focus_switch_count': 5}),
        (50000, 'crypto wallet activation fee',
         {'typing_variance': 14000, 'backspace_rate': 0.32, 'hesitation_delay': 20,
          'focus_switch_count': 6}),
        (30000, 'income tax penalty release',
         {'typing_variance': 10000, 'backspace_rate': 0.22, 'hesitation_delay': 15})
    ]):
        scenarios.append({
            'scenario_id': f'investment-scam-{i+1:02d}',
            'scenario_type': 'investment_scam',
            'input': _input(amt, 'unknown_invest@upi', note,
                            beneficiary_type='CUSTOM', features=feat),
            'expected_risk_level': 'CRITICAL',
            'expected_action': 'BLOCK',
            'expected_min_score': 85,
            'expected_max_score': 100,
            'notes': f'Investment scam ({amt}), keywords + amount + hesitation.'
        })

    # --- 7. Family emergency scam (4) ---
    for i, (amt, note, feat) in enumerate([
        (20000, 'urgent medical bill',
         {'typing_variance': 10000, 'backspace_rate': 0.25, 'hesitation_delay': 18}),
        (25000, 'hospital payment help',
         {'typing_variance': 12000, 'backspace_rate': 0.28, 'hesitation_delay': 22}),
        (15000, 'sister surgery fund',
         {'typing_variance': 9000, 'backspace_rate': 0.22, 'hesitation_delay': 16}),
        (30000, 'emergency loan repayment',
         {'typing_variance': 11000, 'backspace_rate': 0.26, 'hesitation_delay': 20})
    ]):
        scenarios.append({
            'scenario_id': f'emergency-scam-{i+1:02d}',
            'scenario_type': 'family_emergency_scam',
            'input': _input(amt, 'stranger_help@upi', note,
                            beneficiary_type='CUSTOM', features=feat),
            'expected_risk_level': 'CRITICAL',
            'expected_action': 'BLOCK',
            'expected_min_score': 70,
            'expected_max_score': 100,
            'notes': f'Emergency plea ({amt}) to unknown, high hesitation.'
        })

    # --- 8. Mule account transfer (4) ---
    for i, (amt, note, feat) in enumerate([
        (35000, 'business payment',
         {'backspace_rate': 0.05, 'hesitation_delay': 1, 'typing_variance': 200}),
        (45000, 'invoice settlement',
         {'backspace_rate': 0.03, 'hesitation_delay': 1, 'typing_variance': 150}),
        (50000, 'vendor payment',
         {'backspace_rate': 0.04, 'hesitation_delay': 2, 'typing_variance': 180}),
        (30000, 'consulting fee',
         {'backspace_rate': 0.06, 'hesitation_delay': 1, 'typing_variance': 220})
    ]):
        scenarios.append({
            'scenario_id': f'mule-{i+1:02d}',
            'scenario_type': 'mule_account_transfer',
            'input': _input(amt, 'receiving_acct@upi', note,
                            beneficiary_type='CUSTOM', features=feat),
            'expected_risk_level': 'HIGH',
            'expected_action': 'STEP_UP',
            'expected_min_score': 45,
            'expected_max_score': 80,
            'notes': f'Large transfer ({amt}) to unknown, but surprisingly smooth typing (mule pattern).'
        })

    # --- 9. Benign note but anomalous behavior (4) ---
    for i, (note, feat) in enumerate([
        ('dinner', {'typing_variance': 14000, 'backspace_rate': 0.35,
                    'focus_switch_count': 5, 'hesitation_delay': 20}),
        ('lunch', {'typing_variance': 12000, 'backspace_rate': 0.30,
                   'focus_switch_count': 4, 'hesitation_delay': 18}),
        ('gift', {'typing_variance': 13000, 'backspace_rate': 0.28,
                  'focus_switch_count': 5, 'hesitation_delay': 22}),
        ('books', {'typing_variance': 11000, 'backspace_rate': 0.30,
                   'focus_switch_count': 4, 'hesitation_delay': 16})
    ]):
        scenarios.append({
            'scenario_id': f'anomalous-behavior-{i+1:02d}',
            'scenario_type': 'benign_note_anomalous_behavior',
            'input': _input(1000, 'priya.sharma@upi', note, features=feat),
            'expected_risk_level': 'HIGH',
            'expected_action': 'STEP_UP',
            'expected_min_score': 50,
            'expected_max_score': 85,
            'notes': f'Benign note ({note}) but highly anomalous typing.'
        })

    # --- 10. Scam-like note but normal behavior (4) ---
    for i, (note, feat) in enumerate([
        ('KYC verification fee',
         {'hesitation_delay': 2, 'typing_variance': 400, 'backspace_rate': 0.08}),
        ('urgent verification fee',
         {'hesitation_delay': 1, 'typing_variance': 300, 'backspace_rate': 0.05}),
        ('account unlock charge',
         {'hesitation_delay': 2, 'typing_variance': 500, 'backspace_rate': 0.06}),
        ('RBI compliance payment',
         {'hesitation_delay': 3, 'typing_variance': 450, 'backspace_rate': 0.07})
    ]):
        scenarios.append({
            'scenario_id': f'scam-note-normal-behavior-{i+1:02d}',
            'scenario_type': 'scam_like_note_normal_behavior',
            'input': _input(500, 'priya.sharma@upi', note, features=feat),
            'expected_risk_level': 'LOW',
            'expected_action': 'ALLOW',
            'expected_min_score': 0,
            'expected_max_score': 40,
            'notes': f'Scam keyword ({note}) but saved beneficiary, low amount, normal typing.'
        })

    # --- 11. High hesitation but benign transaction (3) ---
    expectations = [
        ('ALLOW', 'LOW', 0, 40),
        ('ALLOW', 'LOW', 0, 40),
        ('WARNING', 'MEDIUM', 25, 50),
    ]
    for i, (amt, note, feat) in enumerate([
        (1000, 'dinner',
         {'hesitation_delay': 25, 'confirmation_delay': 30,
          'typing_variance': 300, 'backspace_rate': 0.08}),
        (800, 'lunch',
         {'hesitation_delay': 20, 'confirmation_delay': 25,
          'typing_variance': 400, 'backspace_rate': 0.06}),
        (500, 'gift',
         {'hesitation_delay': 22, 'confirmation_delay': 28,
          'typing_variance': 350, 'backspace_rate': 0.07})
    ]):
        exp_action, exp_risk, min_s, max_s = expectations[i]
        scenarios.append({
            'scenario_id': f'high-hesitation-{i+1:02d}',
            'scenario_type': 'high_hesitation_benign_transaction',
            'input': _input(amt, 'priya.sharma@upi', note, features=feat),
            'expected_risk_level': exp_risk,
            'expected_action': exp_action,
            'expected_min_score': min_s,
            'expected_max_score': max_s,
            'notes': f'Benign ({note}) but very high hesitation delay ({feat["hesitation_delay"]}s).'
        })

    # --- 12. Low amount scam (3) ---
    for i, (note, feat) in enumerate([
        ('KYC verification fee',
         {'typing_variance': 10000, 'backspace_rate': 0.25, 'hesitation_delay': 18}),
        ('urgent verification fee',
         {'typing_variance': 11000, 'backspace_rate': 0.28, 'hesitation_delay': 20}),
        ('account unlock charge',
         {'typing_variance': 9000, 'backspace_rate': 0.22, 'hesitation_delay': 16})
    ]):
        scenarios.append({
            'scenario_id': f'low-amount-scam-{i+1:02d}',
            'scenario_type': 'low_amount_scam',
            'input': _input(500, 'unknown_scam@upi', note,
                            beneficiary_type='CUSTOM', features=feat),
            'expected_risk_level': 'CRITICAL',
            'expected_action': 'BLOCK',
            'expected_min_score': 80,
            'expected_max_score': 100,
            'notes': f'Scam note + unknown beneficiary + hesitation. KYC coercion signature blocks despite low amount ({500}).'
        })

    # --- 13. High amount scam (3) ---
    for i, (amt, note, feat) in enumerate([
        (50000, 'digital arrest bail bond',
         {'typing_variance': 14000, 'backspace_rate': 0.35, 'hesitation_delay': 25}),
        (75000, 'income tax penalty release',
         {'typing_variance': 13000, 'backspace_rate': 0.30, 'hesitation_delay': 22}),
        (100000, 'anti-money laundering audit charge',
         {'typing_variance': 15000, 'backspace_rate': 0.38, 'hesitation_delay': 28})
    ]):
        scenarios.append({
            'scenario_id': f'high-amount-scam-{i+1:02d}',
            'scenario_type': 'high_amount_scam',
            'input': _input(amt, 'unknown_agent@upi', note,
                            beneficiary_type='CUSTOM', features=feat),
            'expected_risk_level': 'CRITICAL',
            'expected_action': 'BLOCK',
            'expected_min_score': 85,
            'expected_max_score': 100,
            'notes': f'Very high amount ({amt}), scam note, unknown.'
        })

    # --- 14. New device suspicious transfer (3) ---
    for i, (amt, beneficiary, btype, feat) in enumerate([
        (5000, 'new_beneficiary@upi', 'CUSTOM',
         {'hesitation_delay': 10, 'confirmation_delay': 12,
          'typing_variance': 5000, 'backspace_rate': 0.15}),
        (8000, 'unknown_vendor@upi', 'CUSTOM',
         {'hesitation_delay': 12, 'confirmation_delay': 14,
          'typing_variance': 6000, 'backspace_rate': 0.18}),
        (3000, 'new_friend@upi', 'CUSTOM',
         {'hesitation_delay': 8, 'confirmation_delay': 10,
          'typing_variance': 4000, 'backspace_rate': 0.12})
    ]):
        scenarios.append({
            'scenario_id': f'new-device-{i+1:02d}',
            'scenario_type': 'new_device_suspicious_transfer',
            'input': _input(amt, beneficiary, 'payment', beneficiary_type=btype,
                            device_id='dev-new', features=feat),
            'expected_risk_level': 'MEDIUM',
            'expected_action': 'WARNING',
            'expected_min_score': 35,
            'expected_max_score': 70,
            'notes': f'New device, unknown beneficiary ({beneficiary}), moderate amount ({amt}), mild hesitation.'
        })

    return scenarios


def load_or_generate_scenarios(suite: str) -> list[dict]:
    """Load scenarios for a given suite from JSONL file, or generate for policy."""
    info = SUITES[suite]
    benchmark_file = info['file']
    if benchmark_file.exists():
        with open(benchmark_file, 'r', encoding='utf-8') as f:
            return [json.loads(line) for line in f if line.strip()]
    if suite == 'policy':
        scenarios = generate_scenarios()
        BENCHMARK_DIR.mkdir(parents=True, exist_ok=True)
        with open(benchmark_file, 'w', encoding='utf-8') as f:
            for s in scenarios:
                f.write(json.dumps(s) + '\n')
        return scenarios
    raise FileNotFoundError(f'Benchmark file not found: {benchmark_file}')


def _check(actual: dict, expected: dict) -> dict:
    return {
        'risk_level_match': actual['risk_level'] == expected['risk_level'],
        'action_match': actual['action'] == expected['action'],
        'score_in_range': expected['min_score'] <= actual['score'] <= expected['max_score']
    }


ACTION_ORDER = {'ALLOW': 0, 'WARNING': 1, 'STEP_UP': 2, 'BLOCK': 3}
SAFE_ACTIONS = ('ALLOW', 'WARNING')
RISKY_ACTIONS = ('STEP_UP', 'BLOCK')


def compute_metrics(results: list[dict]) -> dict:
    total = len(results)
    action_correct = sum(1 for r in results if r['check']['action_match'])
    risk_level_correct = sum(1 for r in results if r['check']['risk_level_match'])
    score_correct = sum(1 for r in results if r['check']['score_in_range'])
    all_correct = sum(1 for r in results if r['check']['action_match'] and r['check']['risk_level_match'] and r['check']['score_in_range'])

    true_pos = sum(1 for r in results
                   if r['expected']['action'] in RISKY_ACTIONS
                   and r['actual']['action'] in RISKY_ACTIONS)
    binary_false_pos = sum(1 for r in results
                           if r['expected']['action'] in SAFE_ACTIONS
                           and r['actual']['action'] in RISKY_ACTIONS)
    binary_false_neg = sum(1 for r in results
                           if r['expected']['action'] in RISKY_ACTIONS
                           and r['actual']['action'] in SAFE_ACTIONS)
    true_neg = sum(1 for r in results
                   if r['expected']['action'] in SAFE_ACTIONS
                   and r['actual']['action'] in SAFE_ACTIONS)

    risky_precision = round(true_pos / (true_pos + binary_false_pos), 4) if (true_pos + binary_false_pos) > 0 else 0.0
    risky_recall = round(true_pos / (true_pos + binary_false_neg), 4) if (true_pos + binary_false_neg) > 0 else 0.0
    risky_f1 = round(2 * risky_precision * risky_recall / (risky_precision + risky_recall), 4) if (risky_precision + risky_recall) > 0 else 0.0

    actions = ['ALLOW', 'WARNING', 'STEP_UP', 'BLOCK']
    cm = {e: {a: 0 for a in actions} for e in actions}
    for r in results:
        cm[r['expected']['action']][r['actual']['action']] += 1

    action_mismatches = [r for r in results if r['expected']['action'] != r['actual']['action']]
    over_escalations = [r for r in results if ACTION_ORDER.get(r['actual']['action'], 0) > ACTION_ORDER.get(r['expected']['action'], 0)]
    under_escalations = [r for r in results if ACTION_ORDER.get(r['actual']['action'], 99) < ACTION_ORDER.get(r['expected']['action'], 99)]

    binary_fps = [r for r in results if r['expected']['action'] in SAFE_ACTIONS and r['actual']['action'] in RISKY_ACTIONS]
    binary_fns = [r for r in results if r['expected']['action'] in RISKY_ACTIONS and r['actual']['action'] in SAFE_ACTIONS]

    missed_high_risk = [r for r in results if r['expected']['risk_level'] in ('HIGH', 'CRITICAL') and r['actual']['risk_level'] not in ('HIGH', 'CRITICAL')]
    overblocked_benign = [r for r in results if r['scenario_type'] in ('benign_saved_beneficiary_payment', 'benign_high_value_saved_beneficiary') and r['actual']['action'] == 'BLOCK']

    types = set(r['scenario_type'] for r in results)
    avg_scores = {}
    for t in sorted(types):
        scores = [r['actual']['score'] for r in results if r['scenario_type'] == t]
        avg_scores[t] = round(sum(scores) / len(scores), 1) if scores else 0

    report = {
        'timestamp': datetime.now(timezone.utc).isoformat(),
        'total_scenarios': total,
        'action_accuracy': round(action_correct / total, 4) if total else 0.0,
        'risk_level_accuracy': round(risk_level_correct / total, 4) if total else 0.0,
        'score_in_range_accuracy': round(score_correct / total, 4) if total else 0.0,
        'overall_accuracy': round(all_correct / total, 4) if total else 0.0,
        'risky_precision': risky_precision,
        'risky_recall': risky_recall,
        'risky_f1': risky_f1,
        'true_positives': true_pos,
        'true_negatives': true_neg,
        'binary_false_positives': binary_false_pos,
        'binary_false_negatives': binary_false_neg,
        'action_mismatch_count': len(action_mismatches),
        'over_escalation_count': len(over_escalations),
        'under_escalation_count': len(under_escalations),
        'missed_high_risk_count': len(missed_high_risk),
        'overblocked_benign_count': len(overblocked_benign),
        'confusion_matrix': cm,
        'average_risk_score_by_type': avg_scores,
        'binary_false_positive_details': [{'scenario_id': r['scenario_id'], 'scenario_type': r['scenario_type'],
                                            'expected_action': r['expected']['action'], 'actual_action': r['actual']['action']}
                                          for r in binary_fps[:20]],
        'binary_false_negative_details': [{'scenario_id': r['scenario_id'], 'scenario_type': r['scenario_type'],
                                            'expected_action': r['expected']['action'], 'actual_action': r['actual']['action']}
                                          for r in binary_fns[:20]],
        'over_escalation_details': [{'scenario_id': r['scenario_id'], 'scenario_type': r['scenario_type'],
                                      'expected_action': r['expected']['action'], 'actual_action': r['actual']['action']}
                                    for r in over_escalations[:20]],
        'under_escalation_details': [{'scenario_id': r['scenario_id'], 'scenario_type': r['scenario_type'],
                                       'expected_action': r['expected']['action'], 'actual_action': r['actual']['action']}
                                     for r in under_escalations[:20]],
        'action_mismatch_details': [{'scenario_id': r['scenario_id'], 'scenario_type': r['scenario_type'],
                                      'expected_action': r['expected']['action'], 'actual_action': r['actual']['action']}
                                    for r in action_mismatches[:30]],
        'synthetic_data_warning': 'Benchmark uses synthetic scenarios. Expected values are based on policy rules and ideal fraud detection behavior, not real-world fraud data.'
    }
    return report


def _pass_fail(passed: bool) -> str:
    return 'PASS' if passed else 'FAIL'


def _fmt_score(score: int, lo: int, hi: int) -> str:
    return f'{score} [expected {lo}-{hi}]' if lo <= score <= hi else f'{score} [OUTSIDE {lo}-{hi}]'


def save_reports(report: dict, results: list[dict], suite: str) -> None:
    info = SUITES[suite]
    report_json = info['report_json']
    report_md = info['report_md']
    label = info['label']

    REPORT_DIR.mkdir(parents=True, exist_ok=True)
    with open(report_json, 'w', encoding='utf-8') as f:
        json.dump({'report': report, 'results': results}, f, indent=2)
    print(f'Benchmark report saved: {report_json}')

    lines = [
        f'# {label}',
        f'**Run**: {report["timestamp"]}',
        f'**Total Scenarios**: {report["total_scenarios"]}',
        '',
        '## Summary Metrics',
        '| Metric | Value |',
        '|--------|-------|',
        f'| Action Accuracy | {report["action_accuracy"]} |',
        f'| Risk Level Accuracy | {report["risk_level_accuracy"]} |',
        f'| Score-in-Range Accuracy | {report["score_in_range_accuracy"]} |',
        f'| Overall Accuracy | {report["overall_accuracy"]} |',
        f'| Risky Precision | {report["risky_precision"]} |',
        f'| Risky Recall | {report["risky_recall"]} |',
        f'| Risky F1 | {report["risky_f1"]} |',
        f'| True Positives | {report["true_positives"]} |',
        f'| True Negatives | {report["true_negatives"]} |',
        f'| Binary False Positives | {report["binary_false_positives"]} |',
        f'| Binary False Negatives | {report["binary_false_negatives"]} |',
        f'| Action Mismatches | {report["action_mismatch_count"]} |',
        f'| Over-escalations | {report["over_escalation_count"]} |',
        f'| Under-escalations | {report["under_escalation_count"]} |',
        f'| Missed High-Risk | {report["missed_high_risk_count"]} |',
        f'| Overblocked Benign | {report["overblocked_benign_count"]} |',
        '',
        '## Confusion Matrix (Expected vs Actual Action)',
        '| Expected \\ Actual | ' + ' | '.join(['ALLOW', 'WARNING', 'STEP_UP', 'BLOCK']) + ' |',
        '|---|---|---|---|',
    ]
    for exp in ['ALLOW', 'WARNING', 'STEP_UP', 'BLOCK']:
        row = [exp] + [str(report['confusion_matrix'][exp][act]) for act in ['ALLOW', 'WARNING', 'STEP_UP', 'BLOCK']]
        lines.append('| ' + ' | '.join(row) + ' |')

    lines += [
        '',
        '## Results by Scenario',
        '| ID | Type | Expected | Actual | Score | Result |',
        '|---|---|---|---|---|---|',
    ]
    for r in results:
        check = r['check']
        passed = check['action_match'] and check['risk_level_match'] and check['score_in_range']
        exp_str = f'{r["expected"]["risk_level"]}/{r["expected"]["action"]}'
        act_str = f'{r["actual"]["risk_level"]}/{r["actual"]["action"]}'
        sc_str = _fmt_score(r['actual']['score'], r['expected']['min_score'], r['expected']['max_score'])
        lines.append(f'| {r["scenario_id"]} | {r["scenario_type"]} | {exp_str} | {act_str} | {sc_str} | {_pass_fail(passed)} |')

    lines += [
        '',
        '## Average Risk Score by Scenario Type',
        '| Type | Avg Score |',
        '|------|-----------|',
    ]
    for t, s in sorted(report['average_risk_score_by_type'].items()):
        lines.append(f'| {t} | {s} |')

    lines += [
        '',
        '## Classification Details',
        f'- **Binary False Positives** (safe expected, risky actual): {report["binary_false_positives"]}',
        f'- **Binary False Negatives** (risky expected, safe actual): {report["binary_false_negatives"]}',
        f'- **Over-escalations** (actual more severe than expected): {report["over_escalation_count"]}',
        f'- **Under-escalations** (actual less severe than expected): {report["under_escalation_count"]}',
        '',
        '## Key Findings',
        f'- **Missed High-Risk**: {report["missed_high_risk_count"]} scenarios where expected HIGH/CRITICAL was not met.',
        f'- **Overblocked Benign**: {report["overblocked_benign_count"]} benign scenarios that got BLOCK.',
        '',
        '## Limitations',
        '- All data is synthetic. Metrics reflect policy rule coverage, not real-world fraud detection.',
        '- Expected values may not perfectly match actual model output due to heuristic/ML score variation.',
        '- Scenarios test the full pipeline (model + heuristics + policy gates).',
        '',
        '---',
        f'*Report generated {report["timestamp"]}*'
    ]

    with open(report_md, 'w', encoding='utf-8') as f:
        f.write('\n'.join(lines) + '\n')
    print(f'Benchmark markdown report saved: {report_md}')


def save_aggregate_reports(policy_report: dict, challenge_report: dict) -> None:
    """Save a combined aggregate report as benchmark_report.json."""
    aggregate = {
        'timestamp': datetime.now(timezone.utc).isoformat(),
        'policy': {
            'label': SUITES['policy']['label'],
            'total_scenarios': policy_report['total_scenarios'],
            'action_accuracy': policy_report['action_accuracy'],
            'risky_precision': policy_report['risky_precision'],
            'risky_recall': policy_report['risky_recall'],
            'risky_f1': policy_report['risky_f1'],
            'binary_false_positives': policy_report['binary_false_positives'],
            'binary_false_negatives': policy_report['binary_false_negatives'],
            'action_mismatch_count': policy_report['action_mismatch_count'],
            'over_escalation_count': policy_report['over_escalation_count'],
            'under_escalation_count': policy_report['under_escalation_count'],
        },
        'challenge': {
            'label': SUITES['challenge']['label'],
            'total_scenarios': challenge_report['total_scenarios'],
            'action_accuracy': challenge_report['action_accuracy'],
            'risky_precision': challenge_report['risky_precision'],
            'risky_recall': challenge_report['risky_recall'],
            'risky_f1': challenge_report['risky_f1'],
            'binary_false_positives': challenge_report['binary_false_positives'],
            'binary_false_negatives': challenge_report['binary_false_negatives'],
            'action_mismatch_count': challenge_report['action_mismatch_count'],
            'over_escalation_count': challenge_report['over_escalation_count'],
            'under_escalation_count': challenge_report['under_escalation_count'],
        },
        'synthetic_data_warning': 'Both benchmarks use synthetic scenarios. These metrics do not represent real-world fraud detection accuracy.',
    }
    with open(REPORT_JSON, 'w', encoding='utf-8') as f:
        json.dump(aggregate, f, indent=2)
    print(f'Aggregate benchmark report saved: {REPORT_JSON}')


def run_benchmark(suite: str = 'policy') -> dict:
    """Run a single benchmark suite and return the report dict."""
    from app.models.schemas import RiskEvaluationRequest
    from app.api.routes.risk import evaluate_risk

    scenarios = load_or_generate_scenarios(suite)
    print(f'Loaded {len(scenarios)} scenarios for [{suite}] benchmark')

    results = []
    for sc in scenarios:
        try:
            request = RiskEvaluationRequest(**sc['input'])
            response = evaluate_risk(request)
            actual = {
                'risk_level': response.risk_level,
                'action': response.action,
                'score': response.final_risk_score
            }
            expected = {
                'risk_level': sc['expected_risk_level'],
                'action': sc['expected_action'],
                'min_score': sc['expected_min_score'],
                'max_score': sc['expected_max_score']
            }
            check = _check(actual, expected)
            results.append({
                'scenario_id': sc['scenario_id'],
                'scenario_type': sc['scenario_type'],
                'expected': expected,
                'actual': actual,
                'check': check,
                'notes': sc.get('notes', '')
            })
        except Exception as exc:
            print(f'  ERROR in {sc["scenario_id"]}: {exc}')

    report = compute_metrics(results)
    save_reports(report, results, suite)
    print(f'Benchmark [{suite}] complete: {report["action_accuracy"]=}  {report["risky_f1"]=}')
    return report


def main():
    parser = argparse.ArgumentParser(
        description='Saathi Fraud Risk Benchmark Runner'
    )
    parser.add_argument(
        '--suite', '-s',
        choices=['policy', 'challenge', 'all'],
        default='all',
        help='Benchmark suite to run (default: all)'
    )
    args = parser.parse_args()

    if args.suite == 'all':
        print('=' * 60)
        print('Running POLICY regression benchmark...')
        print('=' * 60)
        policy_report = run_benchmark('policy')
        print()
        print('=' * 60)
        print('Running CHALLENGE adversarial benchmark...')
        print('=' * 60)
        challenge_report = run_benchmark('challenge')
        print()
        print('=' * 60)
        print('Saving aggregate report...')
        print('=' * 60)
        save_aggregate_reports(policy_report, challenge_report)
        print()
        print('=' * 60)
        print('SUMMARY')
        print('=' * 60)
        print(f'Policy     : action_acc={policy_report["action_accuracy"]}  risky_f1={policy_report["risky_f1"]}  ({policy_report["total_scenarios"]} scenarios)')
        print(f'Challenge  : action_acc={challenge_report["action_accuracy"]}  risky_f1={challenge_report["risky_f1"]}  ({challenge_report["total_scenarios"]} scenarios)')
        print(f'Aggregate  : {REPORT_JSON}')
        print('=' * 60)
    else:
        report = run_benchmark(args.suite)
        print(json.dumps(report, indent=2))


if __name__ == '__main__':
    main()
