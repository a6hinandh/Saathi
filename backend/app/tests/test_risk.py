from app.models.schemas import BehaviorFeatures, RiskEvaluationRequest
from app.api.routes.risk import evaluate_risk


def test_risk_flow_blocks_demo_case():
    request = RiskEvaluationRequest(
        customer_id='CUST-10021',
        session_id='sess_91ad',
        amount=25000,
        beneficiary='unknown_agent@upi',
        note='KYC verification fee',
        features=BehaviorFeatures(
            avg_key_interval=420,
            typing_variance=110,
            backspace_rate=0.22,
            mouse_speed=1200,
            confirmation_delay=24,
            amount_edit_count=4,
            focus_switch_count=6,
            paste_count=1,
            hesitation_delay=18
        )
    )
    response = evaluate_risk(request)
    assert response.final_risk_score >= 80
    assert response.action == 'BLOCK'
