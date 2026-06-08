from typing import Any

from pydantic import BaseModel, Field, field_validator


def _clamp(value: float, lower: float, upper: float) -> float:
    return max(lower, min(upper, value))


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

    @field_validator('avg_key_interval')
    @classmethod
    def clamp_key_interval(cls, value: float) -> float:
        return _clamp(value, 80, 800)

    @field_validator('typing_variance')
    @classmethod
    def clamp_typing_variance(cls, value: float) -> float:
        return _clamp(value, 0, 15000)

    @field_validator('backspace_rate')
    @classmethod
    def clamp_backspace_rate(cls, value: float) -> float:
        return _clamp(value, 0, 0.5)

    @field_validator('mouse_speed')
    @classmethod
    def clamp_mouse_speed(cls, value: float) -> float:
        return _clamp(value, 0, 2000)

    @field_validator('confirmation_delay', 'hesitation_delay')
    @classmethod
    def clamp_delay(cls, value: float) -> float:
        return _clamp(value, 0, 60)

    @field_validator('amount_edit_count')
    @classmethod
    def clamp_amount_edits(cls, value: int) -> int:
        return int(_clamp(value, 0, 5))

    @field_validator('focus_switch_count')
    @classmethod
    def clamp_focus_switches(cls, value: int) -> int:
        return int(_clamp(value, 0, 8))

    @field_validator('paste_count')
    @classmethod
    def clamp_paste_count(cls, value: int) -> int:
        return int(_clamp(value, 0, 3))


class RiskEvaluationRequest(BaseModel):
    customer_id: str
    session_id: str
    amount: float = Field(ge=0)
    beneficiary: str
    beneficiary_type: str | None = None
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


class StructuredExplanation(BaseModel):
    factor: str
    evidence: str
    impact: str


class RiskEvaluationResponse(BaseModel):
    request_id: str | None = None
    alert_id: str | None = None
    timestamp: str | None = None
    final_risk_score: int
    risk_level: str
    action: str
    summary: str
    components: RiskComponents
    coercion_label: str
    explanation: list[str]
    structured_explanation: list[StructuredExplanation] = Field(default_factory=list)
    metadata: dict[str, Any] = Field(default_factory=dict)


class AlertItem(BaseModel):
    alert_id: str | None = None
    request_id: str | None = None
    customer_id: str
    session_id: str
    beneficiary: str
    amount: float
    note: str = ''
    device_id: str | None = None
    features: dict[str, Any] = Field(default_factory=dict)
    components: dict[str, Any] = Field(default_factory=dict)
    risk_score: int
    risk_level: str
    action: str
    coercion_label: str
    summary: str
    explanation: list[str]
    structured_explanation: list[StructuredExplanation] = Field(default_factory=list)
    metadata: dict[str, Any] = Field(default_factory=dict)
    timestamp: str


class StatsResponse(BaseModel):
    active_sessions: int
    flagged_payments: int
    fraud_alerts: int
    critical_blocks: int
    warning_count: int
    step_up_count: int
    average_risk_score: float
