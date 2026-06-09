from __future__ import annotations

from dataclasses import dataclass

from ..models.schemas import BehaviorFeatures
from ..utils.constants import FAMILY_EMERGENCY_KEYWORDS, SCAM_NOTE_KEYWORDS
from .anomaly_detection import AnomalyResult
from .hesitation_engine import HesitationResult
from .scam_classifier import ScamResult


@dataclass
class CoercionResult:
    score: float
    label: str
    explanation: str


class CoercionEngine:
    def _is_external_or_unknown(self, beneficiary: str, beneficiary_type: str | None = None) -> bool:
        kind = (beneficiary_type or '').upper()
        if kind == 'SAVED':
            return False
        if kind == 'CUSTOM':
            return True
        normalized = beneficiary.lower()
        known_saved = {'priya.sharma@upi', 'rohan.mehta@okaxis', 'priya sharma', 'rohan mehta', 'maya fernandes', 'vivek traders'}
        if normalized in known_saved:
            return False
        return '@upi' in normalized or 'unknown' in normalized or 'agent' in normalized

    def evaluate(
        self,
        amount: float,
        beneficiary: str,
        note: str,
        features: BehaviorFeatures,
        anomaly: AnomalyResult,
        scam: ScamResult,
        hesitation: HesitationResult,
        beneficiary_type: str | None = None
    ) -> CoercionResult:
        normalized_note = (note or '').lower()
        external_or_unknown = self._is_external_or_unknown(beneficiary, beneficiary_type)
        beneficiary_risk = 0.42 if external_or_unknown else 0.16
        amount_risk = min(1.0, amount / 30000.0)
        note_risk = scam.probability
        behavior_risk = anomaly.score
        hesitation_risk = hesitation.score
        scam_phrase_hit = any(keyword in normalized_note for keyword in SCAM_NOTE_KEYWORDS)
        
        # Signature Detection: KYC Scam Coercion
        is_kyc_pattern = 'kyc' in normalized_note
        is_agent_target = 'agent' in beneficiary.lower() or 'unknown' in beneficiary.lower() or 'govt' in beneficiary.lower()
        is_high_value = amount >= 25000

        score = round(
            amount_risk * 0.24
            + beneficiary_risk * 0.16
            + note_risk * 0.24
            + behavior_risk * 0.18
            + hesitation_risk * 0.08,
            2
        )

        if is_kyc_pattern and is_agent_target and is_high_value:
            score = 0.98

        if scam.label == 'SCAM_LIKE' and (anomaly.score >= 0.75 or hesitation.score >= 0.75):
            score = max(score, 0.80)
        if (
            (scam.label == 'SCAM_LIKE' or scam_phrase_hit)
            and amount >= 20000
            and external_or_unknown
            and (
                hesitation.score >= 0.55
                or anomaly.score >= 0.70
                or features.typing_variance >= 8000
                or features.backspace_rate >= 0.2
                or features.focus_switch_count >= 3
                or features.hesitation_delay >= 18
            )
        ):
            score = max(score, 0.85)
        # Family emergency scam pattern: emergency plea + external beneficiary + high amount + hesitation
        is_emergency_pattern = any(kw in normalized_note for kw in FAMILY_EMERGENCY_KEYWORDS)
        if is_emergency_pattern and external_or_unknown and amount >= 15000 and features.hesitation_delay >= 12:
            score = max(score, 0.78)

        label = 'SCAM_GUIDED' if score >= 0.75 else 'SUSPICIOUS' if score >= 0.45 else 'NORMAL'
        explanation = 'Possible scam-guided payment detected' if label == 'SCAM_GUIDED' else 'Signals do not strongly indicate coercion.'
        return CoercionResult(score=score, label=label, explanation=explanation)
