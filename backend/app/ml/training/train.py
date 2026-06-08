"""Simple training script for Saathi ML models.
Trains:
 - TF-IDF + LogisticRegression for scam note classification
 - IsolationForest for behavioral anomaly detection
Saves artifacts to backend/app/ml/artifacts/
"""
from __future__ import annotations
import json
import os
from pathlib import Path
from typing import List

import joblib
import numpy as np
from sklearn.ensemble import IsolationForest
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.linear_model import LogisticRegression
from sklearn.model_selection import train_test_split

BASE = Path(__file__).resolve().parents[3]
DATA_DIR = BASE / 'data'
ARTIFACT_DIR = BASE / 'app' / 'ml' / 'artifacts'
ARTIFACT_DIR.mkdir(parents=True, exist_ok=True)


def load_json(name: str):
    p = DATA_DIR / name
    if not p.exists():
        return []
    with open(p, 'r', encoding='utf-8') as fh:
        return json.load(fh)


def train_scam_classifier(notes: List[str], labels: List[int]):
    print(f"Training scam classifier on {len(notes)} samples")
    vec = TfidfVectorizer(max_features=4000, ngram_range=(1, 2))
    X = vec.fit_transform(notes)
    clf = LogisticRegression(max_iter=1000)
    clf.fit(X, labels)
    joblib.dump({'vectorizer': vec, 'classifier': clf}, ARTIFACT_DIR / 'scam_note_model.joblib')
    print("Saved scam_note_model.joblib")


def train_behavior_anomaly(profiles: List[dict]):
    # Expect profiles to be list of feature dicts -> numeric vectorizable
    print(f"Training behavior anomaly on {len(profiles)} profiles")
    if len(profiles) < 5:
        print("Not enough profiles to train IsolationForest — creating a small synthetic set")
        # create small synthetic
        X = np.random.normal(size=(50, 9))
        keys = [
            'avg_key_interval', 'typing_variance', 'backspace_rate', 'mouse_speed',
            'confirmation_delay', 'amount_edit_count', 'focus_switch_count', 'paste_count', 'hesitation_delay'
        ]
    else:
        keys = [
            'avg_key_interval', 'typing_variance', 'backspace_rate', 'mouse_speed',
            'confirmation_delay', 'amount_edit_count', 'focus_switch_count', 'paste_count', 'hesitation_delay'
        ]
        X = np.array([[float(p.get(k, 0.0)) for k in keys] for p in profiles])
    iso = IsolationForest(n_estimators=100, contamination=0.10, random_state=42)
    iso.fit(X)
    joblib.dump({'isolation_forest': iso, 'feature_keys': keys}, ARTIFACT_DIR / 'behavior_anomaly_model.joblib')
    print("Saved behavior_anomaly_model.joblib")


def main():
    fraud_cases = load_json('fraud_cases.json')
    profiles = load_json('behavioral_profiles.json')

    # Prepare scam data
    notes = []
    labels = []
    for c in fraud_cases:
        note = c.get('note', '')
        label = 1 if c.get('label', '').lower() in ('fraud', 'scam', 'scam_guided', 'scam_like') else 0
        notes.append(note)
        labels.append(label)

    if len(notes) >= 1:
        train_scam_classifier(notes, labels)
    else:
        print('No scam notes found; skipping scam classifier')

    train_behavior_anomaly(profiles)


if __name__ == '__main__':
    main()
