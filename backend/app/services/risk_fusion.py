from __future__ import annotations

from dataclasses import dataclass

from ..models.schemas import RiskComponents
from ..utils.helpers import percent_to_score


@dataclass
class FusionResult:
    final_risk_score: int
    risk_level: str
    action: str
    summary: str


class RiskFusionEngine:
    def fuse(self, components: RiskComponents, coercion_label: str) -> FusionResult:
        score = (
            components.behavior_anomaly * 24
            + components.scam_note_probability * 18
            + components.hesitation_risk * 14
            + components.coercion_risk * 22
            + components.transaction_risk * 14
            + components.device_risk * 8
        )
        final_score = max(0, min(100, int(round(score))))
        if final_score <= 30:
            risk_level, action = 'LOW', 'ALLOW'
        elif final_score <= 60:
            risk_level, action = 'MEDIUM', 'WARNING'
        elif final_score <= 80:
            risk_level, action = 'HIGH', 'STEP_UP'
        else:
            risk_level, action = 'CRITICAL', 'BLOCK'
        summary = 'Possible scam-guided payment detected' if coercion_label == 'SCAM_GUIDED' or final_score >= 81 else 'Payment risk is manageable'
        return FusionResult(final_risk_score=final_score, risk_level=risk_level, action=action, summary=summary)
