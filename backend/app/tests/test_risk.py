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


def test_risk_flow_includes_shap():
    request = RiskEvaluationRequest(
        customer_id='CUST-10022',
        session_id='sess_91ad',
        amount=10000,
        beneficiary='trusted_friend@upi',
        note='dinner',
        features=BehaviorFeatures(
            avg_key_interval=250,
            typing_variance=4000,
            backspace_rate=0.08,
            mouse_speed=800,
            confirmation_delay=4,
            amount_edit_count=0,
            focus_switch_count=0,
            paste_count=0,
            hesitation_delay=2
        )
    )
    response = evaluate_risk(request)
    assert 'shap_explanation' in response.metadata
    shap = response.metadata['shap_explanation']
    assert 'base_score' in shap
    assert 'final_score' in shap
    assert 'contributions' in shap
    assert len(shap['contributions']) == 6
    for contrib in shap['contributions']:
        assert 'feature' in contrib
        assert 'display_name' in contrib
        assert 'value' in contrib

