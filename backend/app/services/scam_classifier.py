from __future__ import annotations

from dataclasses import dataclass

try:
    from sklearn.feature_extraction.text import TfidfVectorizer
    from sklearn.linear_model import LogisticRegression
except Exception:  # pragma: no cover - fallback when sklearn is unavailable
    TfidfVectorizer = None
    LogisticRegression = None

from ..utils.constants import SCAM_NOTE_KEYWORDS


@dataclass
class ScamResult:
    probability: float
    label: str


class ScamNoteClassifier:
    def __init__(self) -> None:
        self.vectorizer = None
        self.model = None
        if TfidfVectorizer is not None and LogisticRegression is not None:
            notes = [
                'KYC verification fee',
                'urgent verification',
                'account unlock fee',
                'refund processing',
                'RBI compliance payment',
                'transfer to family',
                'rent payment',
                'school fees'
            ]
            labels = [1, 1, 1, 1, 1, 0, 0, 0]
            self.vectorizer = TfidfVectorizer(ngram_range=(1, 2), lowercase=True)
            matrix = self.vectorizer.fit_transform(notes)
            self.model = LogisticRegression(max_iter=1000, random_state=42)
            self.model.fit(matrix, labels)

    def predict(self, note: str) -> ScamResult:
        normalized = note.lower().strip()
        keyword_hits = sum(1 for keyword in SCAM_NOTE_KEYWORDS if keyword in normalized)
        if self.model is not None and self.vectorizer is not None:
            probability = float(self.model.predict_proba(self.vectorizer.transform([note]))[0][1])
        else:
            probability = min(0.99, 0.18 + 0.26 * keyword_hits)
        if 'upi' in normalized and keyword_hits:
            probability = min(0.99, probability + 0.12)
        label = 'SCAM_LIKE' if probability >= 0.6 else 'BENIGN'
        return ScamResult(probability=round(probability, 2), label=label)
