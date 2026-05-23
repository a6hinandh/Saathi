from __future__ import annotations

from ..models.schemas import RiskEvaluationRequest
from ..utils.validators import normalize_amount


class TransactionRiskService:
    def evaluate(self, request: RiskEvaluationRequest) -> float:
        normalized_beneficiary = request.beneficiary.lower()
        known_saved = {'priya.sharma@upi', 'rohan.mehta@okaxis', 'friend@upi', 'priya sharma'}
        is_saved = (request.beneficiary_type or '').upper() == 'SAVED' or normalized_beneficiary in known_saved
        beneficiary_risk = 0.18 if is_saved else 0.35 if '@upi' in normalized_beneficiary else 0.22
        amount_risk = normalize_amount(request.amount)
        note_risk = 0.22 if any(keyword in request.note.lower() for keyword in ['kyc', 'urgent', 'refund', 'compliance']) else 0.08
        return round(min(1.0, amount_risk * 0.5 + beneficiary_risk * 0.3 + note_risk * 0.2), 2)
