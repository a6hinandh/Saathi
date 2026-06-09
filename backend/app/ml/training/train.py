"""Training script with evaluation, metrics, and model versioning.

Trains:
- TF-IDF + LogisticRegression for scam note classification (with train/test split)
- StandardScaler + IsolationForest for behavioral anomaly detection

Artifacts saved with metadata dict for versioning and diagnostics.
Metrics reports saved to app/ml/reports/.
"""
from __future__ import annotations

import json
from datetime import datetime, timezone
from pathlib import Path
from typing import List

import joblib
import numpy as np
from sklearn.ensemble import IsolationForest
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import (
    accuracy_score,
    classification_report,
    confusion_matrix,
    f1_score,
    precision_score,
    recall_score,
    roc_auc_score,
)
from sklearn.model_selection import train_test_split
from sklearn.pipeline import Pipeline
from sklearn.preprocessing import StandardScaler

BASE = Path(__file__).resolve().parents[3]
DATA_DIR = BASE / 'data'
ARTIFACT_DIR = BASE / 'app' / 'ml' / 'artifacts'
REPORT_DIR = BASE / 'app' / 'ml' / 'reports'
ARTIFACT_DIR.mkdir(parents=True, exist_ok=True)
REPORT_DIR.mkdir(parents=True, exist_ok=True)

MODEL_VERSION = '1.0.0'
SEED = 42
CONTAMINATION = 0.2

BEHAVIOR_FEATURE_KEYS = [
    'avg_key_interval',
    'typing_variance',
    'backspace_rate',
    'mouse_speed',
    'confirmation_delay',
    'amount_edit_count',
    'focus_switch_count',
    'paste_count'
]


def load_json(name: str):
    path = DATA_DIR / name
    if not path.exists():
        return []
    with open(path, 'r', encoding='utf-8') as handle:
        return json.load(handle)


def train_scam_classifier(notes: List[str], labels: List[int]) -> dict:
    """Train TF-IDF + LogisticRegression with train/test split and evaluation metrics."""
    X_train, X_test, y_train, y_test = train_test_split(
        notes, labels, test_size=0.2, random_state=SEED, stratify=labels
    )
    print(f'Scam classifier: {len(X_train)} train, {len(X_test)} test samples')

    vectorizer = TfidfVectorizer(max_features=4000, ngram_range=(1, 2), lowercase=True)
    X_train_vec = vectorizer.fit_transform(X_train)
    X_test_vec = vectorizer.transform(X_test)

    classifier = LogisticRegression(max_iter=1000, random_state=SEED)
    classifier.fit(X_train_vec, y_train)

    y_pred = classifier.predict(X_test_vec)
    y_prob = classifier.predict_proba(X_test_vec)[:, 1]

    metrics = {
        'accuracy': round(float(accuracy_score(y_test, y_pred)), 4),
        'precision': round(float(precision_score(y_test, y_pred, zero_division=0)), 4),
        'recall': round(float(recall_score(y_test, y_pred, zero_division=0)), 4),
        'f1_score': round(float(f1_score(y_test, y_pred, zero_division=0)), 4),
        'roc_auc': round(float(roc_auc_score(y_test, y_prob)), 4),
        'confusion_matrix': confusion_matrix(y_test, y_pred).tolist(),
        'classification_report': classification_report(y_test, y_pred, output_dict=True, zero_division=0),
        'warning': 'Perfect metrics on synthetic/template-generated data indicate an overly easy benchmark. These scores should NOT be interpreted as real-world fraud performance.'
    }
    print(f'  metrics: {metrics}')

    return {
        'vectorizer': vectorizer,
        'classifier': classifier,
        'model_version': MODEL_VERSION,
        'label_mapping': {0: 'BENIGN', 1: 'SCAM_LIKE'},
        'feature_names': vectorizer.get_feature_names_out().tolist(),
        'metrics': metrics,
        'training_date': datetime.now(timezone.utc).isoformat(),
        'data_source': 'synthetic',
        'notes_trained': len(notes),
        'test_set_size': len(X_test),
        'synthetic_data_warning': 'Perfect metrics on synthetic/template-generated data. Do NOT interpret as real-world fraud performance.'
    }


def train_behavior_anomaly(profiles: List[dict]) -> dict:
    """Train StandardScaler + IsolationForest with unsupervised evaluation metrics.

    IsolationForest is unsupervised: it detects statistical outliers without
    using any labels during training. Labels from the 'profile' field are used
    ONLY for post-hoc evaluation and threshold calibration.
    """
    demo_profiles = profiles + [
        {'avg_key_interval': 240, 'typing_variance': 35, 'backspace_rate': 0.08, 'mouse_speed': 980, 'confirmation_delay': 4, 'amount_edit_count': 1, 'focus_switch_count': 3, 'paste_count': 0},
        {'avg_key_interval': 260, 'typing_variance': 42, 'backspace_rate': 0.10, 'mouse_speed': 1020, 'confirmation_delay': 5, 'amount_edit_count': 2, 'focus_switch_count': 2, 'paste_count': 0},
        {'avg_key_interval': 420, 'typing_variance': 110, 'backspace_rate': 0.22, 'mouse_speed': 1200, 'confirmation_delay': 24, 'amount_edit_count': 4, 'focus_switch_count': 6, 'paste_count': 1},
        {'avg_key_interval': 390, 'typing_variance': 95, 'backspace_rate': 0.18, 'mouse_speed': 1180, 'confirmation_delay': 18, 'amount_edit_count': 3, 'focus_switch_count': 5, 'paste_count': 1}
    ]

    matrix = np.array([[float(p.get(key, 0.0)) for key in BEHAVIOR_FEATURE_KEYS] for p in demo_profiles])

    labels = np.array([1 if p.get('profile', '') == 'high_risk' else 0 for p in demo_profiles])

    n_high_risk = int(labels.sum())
    n_normal = len(labels) - n_high_risk
    print(f'Behavior anomaly: {len(demo_profiles)} profiles ({n_normal} normal, {n_high_risk} high-risk)')

    scaler = StandardScaler()
    scaled = scaler.fit_transform(matrix)

    model = IsolationForest(n_estimators=100, contamination=CONTAMINATION, random_state=SEED)
    model.fit(scaled)

    raw_scores = -model.decision_function(scaled)
    threshold_percentile = 100.0 * (1.0 - CONTAMINATION)
    threshold = float(np.percentile(raw_scores, threshold_percentile))
    pred_labels = (raw_scores > threshold).astype(int)

    normal_scores = raw_scores[labels == 0]
    high_risk_scores = raw_scores[labels == 1]

    try:
        p = round(float(precision_score(labels, pred_labels, zero_division=0)), 4)
        r = round(float(recall_score(labels, pred_labels, zero_division=0)), 4)
        f = round(float(f1_score(labels, pred_labels, zero_division=0)), 4)
        cmat = confusion_matrix(labels, pred_labels).tolist()
        metrics = {
            'precision': p,
            'recall': r,
            'f1_score': f,
            'confusion_matrix': cmat,
            'threshold': round(threshold, 4),
            'contamination': CONTAMINATION,
            'threshold_selection_method': f'contamination_percentile_{int(threshold_percentile)}th',
            'score_direction': 'higher_score_more_anomalous',
            'score_distribution_normal': {
                'min': round(float(normal_scores.min()), 4) if len(normal_scores) > 0 else None,
                'max': round(float(normal_scores.max()), 4) if len(normal_scores) > 0 else None,
                'mean': round(float(normal_scores.mean()), 4) if len(normal_scores) > 0 else None,
                'std': round(float(normal_scores.std()), 4) if len(normal_scores) > 0 else None,
                'count': len(normal_scores),
            } if len(normal_scores) > 0 else None,
            'score_distribution_high_risk': {
                'min': round(float(high_risk_scores.min()), 4) if len(high_risk_scores) > 0 else None,
                'max': round(float(high_risk_scores.max()), 4) if len(high_risk_scores) > 0 else None,
                'mean': round(float(high_risk_scores.mean()), 4) if len(high_risk_scores) > 0 else None,
                'std': round(float(high_risk_scores.std()), 4) if len(high_risk_scores) > 0 else None,
                'count': len(high_risk_scores),
            } if len(high_risk_scores) > 0 else None,
            'warning': 'Synthetic data only. These metrics compare unsupervised IsolationForest anomaly scores against heuristic profile labels (profile=high_risk). They indicate outlier-detection agreement, not real fraud detection performance.'
        }
    except Exception as exc:
        print(f'  metrics computation failed: {exc}')
        metrics = {
            'threshold': round(threshold, 4),
            'contamination': CONTAMINATION,
            'threshold_selection_method': f'contamination_percentile_{int(threshold_percentile)}th',
            'score_direction': 'higher_score_more_anomalous',
        }

    print(f'  anomaly metrics: {metrics}')

    return {
        'isolation_forest': model,
        'feature_keys': BEHAVIOR_FEATURE_KEYS,
        'model_version': MODEL_VERSION,
        'pipeline': Pipeline([('scaler', scaler), ('model', model)]),
        'scaler': scaler,
        'threshold': threshold,
        'contamination': CONTAMINATION,
        'threshold_selection_method': f'contamination_percentile_{int(threshold_percentile)}th',
        'score_direction': 'higher_score_more_anomalous',
        'metrics': metrics,
        'training_date': datetime.now(timezone.utc).isoformat(),
        'data_source': 'synthetic',
        'profiles_trained': len(profiles),
        'synthetic_data_warning': 'Trained on synthetic data only. Do NOT interpret metrics as real-world fraud detection performance.'
    }


def analyze_anomaly_thresholds(profiles: List[dict]) -> dict:
    """Analyze anomaly recall at different percentile thresholds.

    Trains IsolationForest once (same as train_behavior_anomaly) then
    evaluates precision/recall/F1/confusion_matrix at 80th, 75th, and
    70th percentiles.  This is analysis-only — it does NOT change the
    production contamination setting.
    """
    demo_profiles = profiles + [
        {'avg_key_interval': 240, 'typing_variance': 35, 'backspace_rate': 0.08, 'mouse_speed': 980, 'confirmation_delay': 4, 'amount_edit_count': 1, 'focus_switch_count': 3, 'paste_count': 0},
        {'avg_key_interval': 260, 'typing_variance': 42, 'backspace_rate': 0.10, 'mouse_speed': 1020, 'confirmation_delay': 5, 'amount_edit_count': 2, 'focus_switch_count': 2, 'paste_count': 0},
        {'avg_key_interval': 420, 'typing_variance': 110, 'backspace_rate': 0.22, 'mouse_speed': 1200, 'confirmation_delay': 24, 'amount_edit_count': 4, 'focus_switch_count': 6, 'paste_count': 1},
        {'avg_key_interval': 390, 'typing_variance': 95, 'backspace_rate': 0.18, 'mouse_speed': 1180, 'confirmation_delay': 18, 'amount_edit_count': 3, 'focus_switch_count': 5, 'paste_count': 1}
    ]

    matrix = np.array([[float(p.get(key, 0.0)) for key in BEHAVIOR_FEATURE_KEYS] for p in demo_profiles])
    labels = np.array([1 if p.get('profile', '') == 'high_risk' else 0 for p in demo_profiles])

    scaler = StandardScaler()
    scaled = scaler.fit_transform(matrix)

    model = IsolationForest(n_estimators=100, contamination=CONTAMINATION, random_state=SEED)
    model.fit(scaled)
    raw_scores = -model.decision_function(scaled)

    comparisons = {}
    for pct in [80, 75, 70]:
        thresh = float(np.percentile(raw_scores, pct))
        pred = (raw_scores > thresh).astype(int)
        comparisons[f'{pct}th'] = {
            'threshold': round(thresh, 4),
            'anomalies_flagged': int(pred.sum()),
            'precision': round(float(precision_score(labels, pred, zero_division=0)), 4),
            'recall': round(float(recall_score(labels, pred, zero_division=0)), 4),
            'f1_score': round(float(f1_score(labels, pred, zero_division=0)), 4),
            'confusion_matrix': confusion_matrix(labels, pred).tolist(),
        }

    report = {
        'analysis_date': datetime.now(timezone.utc).isoformat(),
        'profile_count': len(demo_profiles),
        'high_risk_profile_count': int(labels.sum()),
        'feature_keys': BEHAVIOR_FEATURE_KEYS,
        'production_contamination': CONTAMINATION,
        'note': 'Analysis only. Does not change production contamination setting.',
        'threshold_comparison': comparisons,
    }
    save_report('anomaly_threshold_analysis.json', report)
    print(f'Threshold analysis saved.')
    for pct_key, stats in comparisons.items():
        print(f'  {pct_key}: threshold={stats["threshold"]}  recall={stats["recall"]}  precision={stats["precision"]}  F1={stats["f1_score"]}  CM={stats["confusion_matrix"]}')
    return report


def save_report(name: str, data: dict) -> None:
    path = REPORT_DIR / name
    with open(path, 'w') as f:
        json.dump(data, f, indent=2, default=str)
    print(f'Report saved: {path.relative_to(BASE)}')


def main() -> None:
    fraud_cases = load_json('fraud_cases.json')
    profiles = load_json('behavioral_profiles.json')

    notes: list[str] = []
    labels: list[int] = []
    for case in fraud_cases:
        notes.append(case.get('note', ''))
        labels.append(0 if case.get('label', '').lower() in {'benign', 'normal', 'safe'} else 1)
    notes.extend(['transfer to family', 'rent payment', 'school fees', 'dinner'])
    labels.extend([0, 0, 0, 0])

    if len(notes) > 0 and len(set(labels)) > 1:
        scam_artifact = train_scam_classifier(notes, labels)
        joblib.dump(scam_artifact, ARTIFACT_DIR / 'scam_note_model.joblib')
        save_report('scam_classifier_metrics.json', scam_artifact['metrics'])
        print('Saved scam_note_model.joblib')
    else:
        print('Skipping scam classifier: need at least 2 unique classes in fraud_cases.json')

    anomaly_artifact = train_behavior_anomaly(profiles)
    joblib.dump(anomaly_artifact, ARTIFACT_DIR / 'behavior_anomaly_model.joblib')
    save_report('behavior_anomaly_metrics.json', anomaly_artifact['metrics'])
    print('Saved behavior_anomaly_model.joblib')

    analyze_anomaly_thresholds(profiles)


if __name__ == '__main__':
    main()
