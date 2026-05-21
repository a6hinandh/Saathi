from __future__ import annotations

from ..models.schemas import RiskEvaluationRequest
from ..utils.validators import normalize_amount


class TransactionRiskService:
    def evaluate(self, request: RiskEvaluationRequest) -> float:
        beneficiary_risk = 0.35 if '@upi' in request.beneficiary.lower() else 0.18
        amount_risk = normalize_amount(request.amount)
        note_risk = 0.22 if any(keyword in request.note.lower() for keyword in ['kyc', 'urgent', 'refund', 'compliance']) else 0.08
        return round(min(1.0, amount_risk * 0.5 + beneficiary_risk * 0.3 + note_risk * 0.2), 2)
