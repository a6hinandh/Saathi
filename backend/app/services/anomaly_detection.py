from __future__ import annotations
from dataclasses import dataclass
from pathlib import Path
import numpy as np

try:
    import joblib
except Exception:
    joblib = None

try:
    from sklearn.ensemble import IsolationForest
except Exception:
    IsolationForest = None

try:
    from sklearn.preprocessing import StandardScaler
except Exception:
    StandardScaler = None

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
    ml_diagnostics: dict | None = None


class BehavioralAnomalyDetector:
    def __init__(self) -> None:
        self.model_name = 'IsolationForest'
        self.model = None
        self.scaler = None
        self.pipeline = None
        self.feature_keys = DEFAULT_FEATURE_KEYS
        self.model_status = 'FALLBACK_HEURISTIC'
        self.model_version = 'unknown'
        self.metrics = None
        self.synthetic_data_warning = None
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
            if not isinstance(artifact, dict):
                return False
            self.pipeline = artifact.get('pipeline')
            self.scaler = artifact.get('scaler')
            self.model = artifact.get('isolation_forest')
            self.feature_keys = artifact.get('feature_keys') or DEFAULT_FEATURE_KEYS
            if self.pipeline is None and self.model is None:
                return False
            self.model_version = artifact.get('model_version', 'unknown')
            self.metrics = artifact.get('metrics')
            self.synthetic_data_warning = artifact.get('synthetic_data_warning')
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
            'fallback_available': True,
            'model_version': self.model_version,
            'feature_count': len(self.feature_keys),
            'has_scaler': self.scaler is not None or self.pipeline is not None,
            'has_metrics': self.metrics is not None
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
        raw_model_score = None
        model_inference_ok = False
        reason_codes = []

        if self.pipeline is not None:
            try:
                raw_model_score_raw = float(-self.pipeline.decision_function(vector)[0])
                raw_model_score = max(0.0, min(1.0, round(0.5 + raw_model_score_raw, 2)))
                score = raw_model_score
                model_inference_ok = True
            except Exception as exc:
                logger.warning('Behavior anomaly pipeline inference failed, using fallback heuristic: %s', exc)
                score = self._heuristic_score(features)
                reason_codes.append('model_inference_failed')
        elif self.model is not None:
            try:
                input_vec = vector
                if self.scaler is not None:
                    input_vec = self.scaler.transform(vector)
                raw_model_score_raw = float(-self.model.decision_function(input_vec)[0])
                raw_model_score = max(0.0, min(1.0, round(0.5 + raw_model_score_raw, 2)))
                score = raw_model_score
                model_inference_ok = True
            except Exception as exc:
                logger.warning('Behavior anomaly model inference failed, using fallback heuristic: %s', exc)
                score = self._heuristic_score(features)
                reason_codes.append('model_inference_failed')
        else:
            score = self._heuristic_score(features)
            reason_codes.append('model_unavailable')

        pre_heuristic_score = score

        if features.typing_variance >= 8000 or features.amount_edit_count >= 4 or features.backspace_rate >= 0.25:
            score = max(score, 0.80)
            reason_codes.append('high_irregularity_boost')
        if features.typing_variance >= 14000 or features.backspace_rate >= 0.35:
            score = max(score, 0.85)
            reason_codes.append('extreme_irregularity_boost')
        if (
            features.typing_variance <= 2000
            and features.backspace_rate <= 0.15
            and features.confirmation_delay <= 6
            and features.amount_edit_count <= 1
            and features.focus_switch_count <= 1
            and features.paste_count == 0
        ):
            score = min(score, 0.12)
            reason_codes.append('normal_behavior_cap')

        heuristic_adjustment = round(score - pre_heuristic_score, 4)

        explanation = 'Behavioral anomaly elevated by irregular typing, hesitation, and edits.' if score > 0.7 else 'Behavior within expected range.'

        diagnostics = {
            'raw_model_score': raw_model_score,
            'heuristic_adjustment': heuristic_adjustment,
            'heuristic_override_applied': heuristic_adjustment != 0,
            'reason_codes': reason_codes,
            'model_provided_score': model_inference_ok,
            'final_score': round(score, 2),
            'scaler_used': self.scaler is not None or self.pipeline is not None,
            'model_status': self.model_status
        }

        return AnomalyResult(score=score, explanation=explanation, ml_diagnostics=diagnostics)
