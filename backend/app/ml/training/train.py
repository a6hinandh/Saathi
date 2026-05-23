"""Training script for Saathi demo ML artifacts.

Trains:
- TF-IDF + LogisticRegression for scam note classification
- IsolationForest for behavioral anomaly detection

Artifacts are saved to backend/app/ml/artifacts/ and loaded opportunistically by
the runtime services. Runtime still keeps safe fallback heuristics.
"""
from __future__ import annotations

import json
from pathlib import Path
from typing import List

import joblib
import numpy as np
from sklearn.ensemble import IsolationForest
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.linear_model import LogisticRegression


BASE = Path(__file__).resolve().parents[3]
DATA_DIR = BASE / 'data'
ARTIFACT_DIR = BASE / 'app' / 'ml' / 'artifacts'
ARTIFACT_DIR.mkdir(parents=True, exist_ok=True)

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


def train_scam_classifier(notes: List[str], labels: List[int]) -> None:
    print(f'Training scam classifier on {len(notes)} samples')
    vectorizer = TfidfVectorizer(max_features=4000, ngram_range=(1, 2), lowercase=True)
    matrix = vectorizer.fit_transform(notes)
    classifier = LogisticRegression(max_iter=1000, random_state=42)
    classifier.fit(matrix, labels)
    joblib.dump({'vectorizer': vectorizer, 'classifier': classifier}, ARTIFACT_DIR / 'scam_note_model.joblib')
    print('Saved scam_note_model.joblib')


def train_behavior_anomaly(profiles: List[dict]) -> None:
    print(f'Training behavior anomaly on {len(profiles)} configured profiles')
    demo_profiles = profiles + [
        {'avg_key_interval': 240, 'typing_variance': 35, 'backspace_rate': 0.08, 'mouse_speed': 980, 'confirmation_delay': 4, 'amount_edit_count': 1, 'focus_switch_count': 3, 'paste_count': 0},
        {'avg_key_interval': 260, 'typing_variance': 42, 'backspace_rate': 0.10, 'mouse_speed': 1020, 'confirmation_delay': 5, 'amount_edit_count': 2, 'focus_switch_count': 2, 'paste_count': 0},
        {'avg_key_interval': 420, 'typing_variance': 110, 'backspace_rate': 0.22, 'mouse_speed': 1200, 'confirmation_delay': 24, 'amount_edit_count': 4, 'focus_switch_count': 6, 'paste_count': 1},
        {'avg_key_interval': 390, 'typing_variance': 95, 'backspace_rate': 0.18, 'mouse_speed': 1180, 'confirmation_delay': 18, 'amount_edit_count': 3, 'focus_switch_count': 5, 'paste_count': 1}
    ]
    matrix = np.array([[float(profile.get(key, 0.0)) for key in BEHAVIOR_FEATURE_KEYS] for profile in demo_profiles])
    model = IsolationForest(n_estimators=100, contamination=0.2, random_state=42)
    model.fit(matrix)
    joblib.dump({'isolation_forest': model, 'feature_keys': BEHAVIOR_FEATURE_KEYS}, ARTIFACT_DIR / 'behavior_anomaly_model.joblib')
    print('Saved behavior_anomaly_model.joblib')


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
        train_scam_classifier(notes, labels)
    else:
        print('Skipping scam classifier: need at least 2 unique classes in fraud_cases.json')

    train_behavior_anomaly(profiles)


if __name__ == '__main__':
    main()
