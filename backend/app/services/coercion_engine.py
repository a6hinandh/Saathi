from __future__ import annotations

from dataclasses import dataclass

from ..models.schemas import BehaviorFeatures
from .anomaly_detection import AnomalyResult
from .hesitation_engine import HesitationResult
from .scam_classifier import ScamResult


@dataclass
class CoercionResult:
    score: float
    label: str
    explanation: str


class CoercionEngine:
    def evaluate(
        self,
        amount: float,
        beneficiary: str,
        note: str,
        features: BehaviorFeatures,
        anomaly: AnomalyResult,
        scam: ScamResult,
        hesitation: HesitationResult
    ) -> CoercionResult:
        beneficiary_risk = 0.18 if '@upi' not in beneficiary.lower() else 0.34
        amount_risk = min(1.0, amount / 30000.0)
        note_risk = scam.probability
        behavior_risk = anomaly.score
        hesitation_risk = hesitation.score
        score = round(
            amount_risk * 0.24
            + beneficiary_risk * 0.16
            + note_risk * 0.24
            + behavior_risk * 0.18
            + hesitation_risk * 0.18,
            2
        )
        label = 'SCAM_GUIDED' if score >= 0.75 else 'SUSPICIOUS' if score >= 0.45 else 'NORMAL'
        explanation = 'Possible scam-guided payment detected' if label == 'SCAM_GUIDED' else 'Signals do not strongly indicate coercion.'
        return CoercionResult(score=score, label=label, explanation=explanation)
