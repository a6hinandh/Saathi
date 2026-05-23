from __future__ import annotations

from dataclasses import dataclass

from ..models.schemas import BehaviorFeatures


@dataclass
class HesitationResult:
    score: float
    label: str
    explanation: str


class HesitationEngine:
    def evaluate(self, features: BehaviorFeatures) -> HesitationResult:
        raw = (
            min(1.0, features.confirmation_delay / 25.0) * 0.4
            + min(1.0, features.amount_edit_count / 5.0) * 0.35
            + min(1.0, features.focus_switch_count / 8.0) * 0.25
        )
        score = round(raw, 2)
        label = 'HIGH' if score >= 0.75 else 'MEDIUM' if score >= 0.45 else 'LOW'
        explanation = 'Long pause and repeated edits indicate uncertainty.' if score >= 0.45 else 'No significant hesitation observed.'
        return HesitationResult(score=score, label=label, explanation=explanation)
