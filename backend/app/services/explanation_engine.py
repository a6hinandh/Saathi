from __future__ import annotations

from ..models.schemas import RiskComponents


class ExplanationEngine:
    def build(self, note: str, beneficiary: str, components: RiskComponents, coercion_label: str) -> list[str]:
        explanations = []
        if components.behavior_anomaly > 0.7:
            explanations.append('Typing rhythm, hesitation, and edit frequency are anomalous.')
        if components.scam_note_probability > 0.6:
            explanations.append('Transfer note matches scam-like payment patterns.')
        if components.coercion_risk > 0.7:
            explanations.append(f'Coercion label: {coercion_label}.')
        if '@upi' in beneficiary.lower():
            explanations.append('Beneficiary is an external UPI handle.')
        if not explanations:
            explanations.append('No high-risk fraud indicators were detected.')
        return explanations
