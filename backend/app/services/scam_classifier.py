from __future__ import annotations
from dataclasses import dataclass
from pathlib import Path
import re

try:
    import joblib
except Exception:
    joblib = None

try:
    from sklearn.feature_extraction.text import TfidfVectorizer
    from sklearn.linear_model import LogisticRegression
except Exception:
    TfidfVectorizer = None
    LogisticRegression = None

from ..utils.constants import SCAM_NOTE_KEYWORDS
from ..utils.logger import get_logger


logger = get_logger(__name__)
ARTIFACT_PATH = Path(__file__).resolve().parents[1] / 'ml' / 'artifacts' / 'scam_note_model.joblib'
REPO_ROOT = Path(__file__).resolve().parents[3]


def normalize_note(note: str) -> str:
    if not note:
        return ''
    normalized = re.sub(r'[^a-z0-9\s]', ' ', note.lower())
    normalized = re.sub(r'\s+', ' ', normalized).strip()
    return normalized.replace(' fees', ' fee')


def contains_scam_keyword(note: str) -> bool:
    normalized = normalize_note(note)
    return any(normalize_note(keyword) in normalized for keyword in SCAM_NOTE_KEYWORDS)


@dataclass
class ScamResult:
    probability: float
    label: str
    ml_diagnostics: dict | None = None


class ScamNoteClassifier:
    def __init__(self) -> None:
        self.vectorizer = None
        self.model = None
        self.model_status = 'FALLBACK_HEURISTIC'
        self.model_version = 'unknown'
        self.metrics = None
        self.feature_count = None
        self.synthetic_data_warning = None
        self.artifact_path: str | None = None

        if self._load_artifact():
            return

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
            self.model_status = 'FALLBACK_IN_MEMORY'

    def _load_artifact(self) -> bool:
        if joblib is None or not ARTIFACT_PATH.exists():
            return False
        try:
            artifact = joblib.load(ARTIFACT_PATH)
            if isinstance(artifact, dict):
                self.vectorizer = artifact.get('vectorizer')
                self.model = artifact.get('classifier')
                self.model_version = artifact.get('model_version', 'unknown')
                self.metrics = artifact.get('metrics')
                self.synthetic_data_warning = artifact.get('synthetic_data_warning')
                feature_names = artifact.get('feature_names')
                self.feature_count = len(feature_names) if feature_names else None
            if self.vectorizer is None or self.model is None:
                return False
            self.model_status = 'LOADED_FROM_ARTIFACT'
            self.artifact_path = str(ARTIFACT_PATH.relative_to(REPO_ROOT))
            return True
        except Exception as exc:
            logger.warning('Scam note artifact could not be loaded: %s', exc)
            return False

    def metadata(self) -> dict[str, object]:
        return {
            'type': 'TF-IDF + LogisticRegression',
            'status': self.model_status,
            'artifact_path': self.artifact_path,
            'fallback_available': True,
            'model_version': self.model_version,
            'feature_count': self.feature_count,
            'has_metrics': self.metrics is not None
        }

    def _heuristic_probability(self, normalized: str, keyword_hits: int) -> float:
        return min(0.99, 0.18 + 0.26 * keyword_hits)

    def predict(self, note: str) -> ScamResult:
        normalized = normalize_note(note)
        keyword_hits = sum(1 for keyword in SCAM_NOTE_KEYWORDS if normalize_note(keyword) in normalized)
        reason_codes = []

        raw_model_score = None
        model_inference_ok = False
        if self.model is not None and self.vectorizer is not None:
            try:
                raw_model_score = float(self.model.predict_proba(self.vectorizer.transform([note or '']))[0][1])
                model_inference_ok = True
            except Exception as exc:
                logger.warning('Scam note model inference failed, using fallback heuristic: %s', exc)

        if model_inference_ok:
            probability = raw_model_score
        else:
            probability = self._heuristic_probability(normalized, keyword_hits)
            reason_codes.append('fallback_heuristic_baseline')

        if 'upi' in normalized and keyword_hits:
            probability = min(0.99, probability + 0.12)
            reason_codes.append('upi_keyword_boost')

        if normalized in {'dinner', 'rent payment', 'school fees', 'transfer to family'} and keyword_hits == 0:
            probability = min(probability, 0.18)
            reason_codes.append('known_benign_cap')

        if keyword_hits:
            floor = min(0.95, 0.62 + 0.1 * keyword_hits)
            probability = max(probability, floor)
            reason_codes.append('keyword_floor')

        heuristic_adjustment = round(probability - (raw_model_score if model_inference_ok else 0), 4) if model_inference_ok else None

        label = 'SCAM_LIKE' if probability >= 0.6 else 'BENIGN'

        diagnostics = {
            'raw_model_score': round(raw_model_score, 4) if model_inference_ok else None,
            'heuristic_adjustment': heuristic_adjustment,
            'keyword_hits': keyword_hits,
            'reason_codes': reason_codes,
            'model_provided_score': model_inference_ok,
            'final_probability': round(probability, 4),
            'model_status': self.model_status
        }

        return ScamResult(probability=round(probability, 2), label=label, ml_diagnostics=diagnostics)
