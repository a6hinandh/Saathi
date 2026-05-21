from dataclasses import dataclass


@dataclass
class FraudCase:
    customer_id: str
    risk_score: int
    label: str


@dataclass
class FraudDashboardSnapshot:
    active_sessions: int
    flagged_payments: int
    fraud_alerts: int
