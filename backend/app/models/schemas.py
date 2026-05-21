from typing import Any

from pydantic import BaseModel, Field


class BehaviorFeatures(BaseModel):
    avg_key_interval: float = 0
    typing_variance: float = 0
    backspace_rate: float = 0
    mouse_speed: float = 0
    confirmation_delay: float = 0
    amount_edit_count: int = 0
    focus_switch_count: int = 0
    paste_count: int = 0
    hesitation_delay: float = 0


class RiskEvaluationRequest(BaseModel):
    customer_id: str
    session_id: str
    amount: float = Field(ge=0)
    beneficiary: str
    note: str
    device_id: str | None = None
    features: BehaviorFeatures


class RiskComponents(BaseModel):
    behavior_anomaly: float
    scam_note_probability: float
    hesitation_risk: float
    coercion_risk: float
    transaction_risk: float
    device_risk: float


class RiskEvaluationResponse(BaseModel):
    final_risk_score: int
    risk_level: str
    action: str
    summary: str
    components: RiskComponents
    coercion_label: str
    explanation: list[str]
    metadata: dict[str, Any] = Field(default_factory=dict)


class AlertItem(BaseModel):
    customer_id: str
    session_id: str
    beneficiary: str
    amount: float
    risk_score: int
    risk_level: str
    action: str
    coercion_label: str
    summary: str
    explanation: list[str]
    timestamp: str


class StatsResponse(BaseModel):
    active_sessions: int
    flagged_payments: int
    fraud_alerts: int
    critical_blocks: int
    warning_count: int
    step_up_count: int
    average_risk_score: float
