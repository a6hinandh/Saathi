from __future__ import annotations

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel

from ...models.schemas import BehaviorFeatures, RiskEvaluationRequest, RiskEvaluationResponse
from ...services.dashboard_service import reset_alerts
from .risk import evaluate_risk


router = APIRouter(prefix='/demo', tags=['demo'])


class DemoScenarioRequest(BaseModel):
    scenario: str


def _scenario_payload(name: str) -> RiskEvaluationRequest:
    scenarios = {
        'NORMAL_PAYMENT': RiskEvaluationRequest(
            customer_id='CUST-10021',
            session_id='sess_normal',
            amount=500,
            beneficiary='priya.sharma@upi',
            beneficiary_type='SAVED',
            note='dinner',
            device_id='demo-device',
            features=BehaviorFeatures(
                avg_key_interval=220,
                typing_variance=500,
                backspace_rate=0.1,
                mouse_speed=392,
                confirmation_delay=5,
                amount_edit_count=0,
                focus_switch_count=0,
                paste_count=0,
                hesitation_delay=5
            )
        ),
        'SUSPICIOUS_SESSION': RiskEvaluationRequest(
            customer_id='CUST-10021',
            session_id='sess_suspicious',
            amount=8500,
            beneficiary='priya.sharma@upi',
            beneficiary_type='SAVED',
            note='School fee payment',
            device_id='demo-device',
            features=BehaviorFeatures(
                avg_key_interval=693,
                typing_variance=15000,
                backspace_rate=0.43,
                mouse_speed=525,
                confirmation_delay=42,
                amount_edit_count=5,
                focus_switch_count=1,
                paste_count=0,
                hesitation_delay=42
            )
        ),
        'SCAM_COERCION_PAYMENT': RiskEvaluationRequest(
            customer_id='CUST-10021',
            session_id='sess_scam_coercion',
            amount=25000,
            beneficiary='unknown_agent@upi',
            beneficiary_type='CUSTOM',
            note='KYC verification fee',
            device_id='demo-device',
            features=BehaviorFeatures(
                avg_key_interval=578,
                typing_variance=15000,
                backspace_rate=0.30,
                mouse_speed=636,
                confirmation_delay=1,
                amount_edit_count=1,
                focus_switch_count=2,
                paste_count=0,
                hesitation_delay=1
            )
        )
    }
    try:
        return scenarios[name]
    except KeyError as exc:
        raise HTTPException(status_code=400, detail='Unsupported demo scenario') from exc


@router.post('/run-scenario', response_model=RiskEvaluationResponse)
def run_scenario(payload: DemoScenarioRequest) -> RiskEvaluationResponse:
    return evaluate_risk(_scenario_payload(payload.scenario))


@router.post('/reset')
def reset_demo() -> dict[str, str]:
    reset_alerts()
    return {
        'status': 'success',
        'message': 'Demo logs reset successfully'
    }
