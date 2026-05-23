from __future__ import annotations

from dataclasses import dataclass
from pathlib import Path

import numpy as np

try:
    import joblib
except Exception:  # pragma: no cover - fallback when joblib is unavailable
    joblib = None

try:
    from sklearn.ensemble import IsolationForest
except Exception:  # pragma: no cover - fallback when sklearn is unavailable
    IsolationForest = None

from ..models.schemas import BehaviorFeatures
from ..utils.logger import get_logger


logger = get_logger(__name__)
ARTIFACT_PATH = Path(__file__).resolve().parents[1] / 'ml' / 'artifacts' / 'behavior_anomaly_model.joblib'
REPO_ROOT = Path(__file__).resolve().parents[3]
DEFAULT_FEATURE_KEYS = [
    'avg_key_interval',
    'typing_variance',
    'backspace_rate',
    'mouse_speed',
    'confirmation_delay',
    'amount_edit_count',
    'focus_switch_count',
    'paste_count'
]


@dataclass
class AnomalyResult:
    score: float
    explanation: str


class BehavioralAnomalyDetector:
    def __init__(self) -> None:
        self.model_name = 'IsolationForest'
        self.model = None
        self.feature_keys = DEFAULT_FEATURE_KEYS
        self.model_status = 'FALLBACK_HEURISTIC'
        self.artifact_path: str | None = None

        if self._load_artifact():
            return

        if IsolationForest is not None:
            training_data = np.array(
                [
                    [240, 35, 0.08, 980, 4, 1, 3, 0.0],
                    [260, 42, 0.10, 1020, 5, 2, 2, 0.0],
                    [420, 110, 0.22, 1200, 24, 4, 6, 1.0],
                    [390, 95, 0.18, 1180, 18, 3, 5, 1.0]
                ]
            )
            self.model = IsolationForest(contamination=0.25, random_state=42)
            self.model.fit(training_data)
            self.model_status = 'FALLBACK_IN_MEMORY'

    def _load_artifact(self) -> bool:
        if joblib is None or not ARTIFACT_PATH.exists():
            return False
        try:
            artifact = joblib.load(ARTIFACT_PATH)
            model = artifact.get('isolation_forest') if isinstance(artifact, dict) else artifact
            feature_keys = artifact.get('feature_keys') if isinstance(artifact, dict) else None
            if model is None:
                return False
            self.model = model
            self.feature_keys = feature_keys or DEFAULT_FEATURE_KEYS
            self.model_status = 'LOADED_FROM_ARTIFACT'
            self.artifact_path = str(ARTIFACT_PATH.relative_to(REPO_ROOT))
            return True
        except Exception as exc:
            logger.warning('Behavior anomaly artifact could not be loaded: %s', exc)
            return False

    def metadata(self) -> dict[str, object]:
        return {
            'type': self.model_name,
            'status': self.model_status,
            'artifact_path': self.artifact_path,
            'fallback_available': True
        }

    def _vector_from_features(self, features: BehaviorFeatures) -> np.ndarray:
        values = [float(getattr(features, key, 0.0)) for key in self.feature_keys]
        return np.array([values])

    def _heuristic_score(self, features: BehaviorFeatures) -> float:
        return max(
            0.0,
            min(
                1.0,
                round(
                    (
                        (features.typing_variance / 15000.0) * 0.25
                        + (features.hesitation_delay / 60.0) * 0.25
                        + (features.amount_edit_count / 5.0) * 0.2
                        + (features.focus_switch_count / 8.0) * 0.15
                        + (features.backspace_rate / 0.5) * 0.15
                    ),
                    2
                )
            )
        )

    def evaluate(self, features: BehaviorFeatures) -> AnomalyResult:
        vector = self._vector_from_features(features)
        if self.model is not None:
            try:
                raw_score = float(-self.model.decision_function(vector)[0])
                score = max(0.0, min(1.0, round(0.5 + raw_score, 2)))
            except Exception as exc:
                logger.warning('Behavior anomaly model inference failed, using fallback heuristic: %s', exc)
                score = self._heuristic_score(features)
        else:
            score = self._heuristic_score(features)

        # Boost score for irregular/anomalous behavior patterns after telemetry normalization.
        if features.typing_variance >= 8000 or features.amount_edit_count >= 4 or features.backspace_rate >= 0.25:
            score = max(score, 0.80)
        if features.typing_variance >= 14000 or features.backspace_rate >= 0.35:
            score = max(score, 0.85)
        if (
            features.typing_variance <= 2000
            and features.backspace_rate <= 0.15
            and features.confirmation_delay <= 6
            and features.amount_edit_count <= 1
            and features.focus_switch_count <= 1
            and features.paste_count == 0
        ):
            score = min(score, 0.12)

        explanation = 'Behavioral anomaly elevated by irregular typing, hesitation, and edits.' if score > 0.7 else 'Behavior within expected range.'
        return AnomalyResult(score=score, explanation=explanation)
