from __future__ import annotations
from dataclasses import dataclass
from pathlib import Path

try:
    import joblib
    from sklearn.feature_extraction.text import TfidfVectorizer
    from sklearn.linear_model import LogisticRegression
except Exception:  # pragma: no cover
    joblib = None
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

        # Load trained model from artifacts if available
        model_path = Path(__file__).resolve().parents[1] / 'ml' / 'artifacts' / 'scam_note_model.joblib'
        if joblib is not None and model_path.exists():
            try:
                artifact = joblib.load(model_path)
                self.vectorizer = artifact.get('vectorizer')
                self.model = artifact.get('classifier')
            except Exception as e:
                print(f"Warning: Could not load trained scam classification model: {e}")
                self._load_fallback_model()
        else:
            self._load_fallback_model()

    def _load_fallback_model(self) -> None:
        """Fallback to in-memory training on basic examples if artifact is missing."""
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
            try:
                probability = float(self.model.predict_proba(self.vectorizer.transform([note]))[0][1])
            except Exception as e:
                print(f"Error executing ML scam classifier: {e}. Falling back to keyword heuristics.")
                probability = min(0.99, 0.18 + 0.26 * keyword_hits)
        else:
            probability = min(0.99, 0.18 + 0.26 * keyword_hits)

        if 'upi' in normalized and keyword_hits:
            probability = min(0.99, probability + 0.12)
        label = 'SCAM_LIKE' if probability >= 0.6 else 'BENIGN'
        return ScamResult(probability=round(probability, 2), label=label)
