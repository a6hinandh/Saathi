from __future__ import annotations

from ..models.schemas import RiskComponents, StructuredExplanation


class ExplanationEngine:
    def _is_external_or_custom(self, beneficiary: str, beneficiary_type: str | None = None) -> bool:
        kind = (beneficiary_type or '').upper()
        if kind == 'SAVED':
            return False
        if kind == 'CUSTOM':
            return True
        normalized = beneficiary.lower().strip()
        known_saved = {'priya.sharma@upi', 'rohan.mehta@okaxis', 'friend@upi', 'priya sharma', 'rohan mehta', 'maya fernandes', 'vivek traders'}
        return normalized not in known_saved and ('@upi' in normalized or 'unknown' in normalized or 'agent' in normalized)

    def build(
        self,
        note: str,
        beneficiary: str,
        components: RiskComponents,
        coercion_label: str,
        beneficiary_type: str | None = None,
        amount: float = 0
    ) -> list[str]:
        explanations = []
        if components.behavior_anomaly > 0.7:
            explanations.append('Typing rhythm, hesitation, and edit frequency are anomalous.')
        if components.scam_note_probability > 0.6:
            explanations.append('Transfer note matches scam-like payment patterns.')

        # Scam Coercion Signature Detection
        is_kyc_pattern = 'kyc' in note.lower()
        is_agent_target = 'agent' in beneficiary.lower() or 'unknown' in beneficiary.lower() or 'govt' in beneficiary.lower()
        
        if amount >= 25000 and is_kyc_pattern and is_agent_target:
            explanations.append('CRITICAL: Verified scam-coercion pattern (KYC/Agent Signature).')
        elif amount >= 20000:
            explanations.append('High-value transfer amount increases fraud exposure.')

        if components.coercion_risk > 0.6 or coercion_label in ['SCAM_GUIDED', 'SUSPICIOUS'] or (is_kyc_pattern and is_agent_target):
            explanations.append(f'Coercion label: {coercion_label}.')
        if self._is_external_or_custom(beneficiary, beneficiary_type):
            explanations.append('Beneficiary is a custom or external UPI handle.')
        if not explanations:
            explanations.append('No high-risk fraud indicators were detected.')
        return explanations

    def build_structured(
        self,
        note: str,
        beneficiary: str,
        components: RiskComponents,
        coercion_label: str,
        beneficiary_type: str | None = None,
        amount: float = 0
    ) -> list[StructuredExplanation]:
        normalized_note = (note or '').strip()
        explanations: list[StructuredExplanation] = []

        # Implementation of requested Scam Signature logic
        is_kyc_pattern = 'kyc' in normalized_note.lower()
        is_agent_target = 'agent' in beneficiary.lower() or 'unknown' in beneficiary.lower() or 'govt' in beneficiary.lower()
        is_high_value = amount >= 25000

        if is_kyc_pattern and is_agent_target and is_high_value:
            explanations.append(
                StructuredExplanation(
                    factor='Scam Coercion Signature',
                    evidence=f'Verified scam pattern: {beneficiary} | Amount: {amount} | Note: {note}',
                    impact='CRITICAL'
                )
            )

        if components.scam_note_probability > 0.6:
            explanations.append(
                StructuredExplanation(
                    factor='Scam-like note',
                    evidence=normalized_note or 'Empty transfer note',
                    impact='HIGH'
                )
            )
        if components.behavior_anomaly > 0.6:
            explanations.append(
                StructuredExplanation(
                    factor='Behavior anomaly',
                    evidence='Typing rhythm, hesitation, and edit frequency are unusual',
                    impact='HIGH'
                )
            )
        if components.hesitation_risk > 0.6:
            explanations.append(
                StructuredExplanation(
                    factor='Hesitation pattern',
                    evidence='Long confirmation delay with repeated edits or focus switches',
                    impact='HIGH'
                )
            )
        if components.coercion_risk > 0.6 or coercion_label in ['SCAM_GUIDED', 'SUSPICIOUS']:
            explanations.append(
                StructuredExplanation(
                    factor='Coercion pattern',
                    evidence='Scam note, hesitation, behavior anomaly, or external beneficiary combined',
                    impact='CRITICAL'
                )
            )
        if amount >= 20000:
            explanations.append(
                StructuredExplanation(
                    factor='High-value transfer',
                    evidence=f'Amount: {amount}',
                    impact='HIGH'
                )
            )
        if self._is_external_or_custom(beneficiary, beneficiary_type):
            explanations.append(
                StructuredExplanation(
                    factor='Custom or external beneficiary',
                    evidence=beneficiary,
                    impact='MEDIUM'
                )
            )
        if not explanations:
            explanations.append(
                StructuredExplanation(
                    factor='Baseline risk',
                    evidence='No high-risk fraud indicators were detected',
                    impact='LOW'
                )
            )
        return explanations
