from __future__ import annotations

from datetime import datetime, timezone

from ..models.schemas import AlertItem, StatsResponse

# Global in-memory alert log database
ALERTS_LOG: list[AlertItem] = []
CRITICAL_BLOCKS_COUNT = 6
WARNINGS_COUNT = 8
AVERAGE_RISK_SCORE_SUM = 47.6 * 14
EVALUATION_COUNT = 14

def add_alert(alert: AlertItem):
    global CRITICAL_BLOCKS_COUNT, WARNINGS_COUNT, AVERAGE_RISK_SCORE_SUM, EVALUATION_COUNT
    ALERTS_LOG.insert(0, alert)
    EVALUATION_COUNT += 1
    AVERAGE_RISK_SCORE_SUM += alert.risk_score
    if alert.action == 'BLOCK':
        CRITICAL_BLOCKS_COUNT += 1
    elif alert.action == 'WARNING':
        WARNINGS_COUNT += 1

class DashboardService:
    def sample_alerts(self) -> list[AlertItem]:
        timestamp = datetime.now(timezone.utc).isoformat()
        base_samples = [
            AlertItem(
                customer_id='CUST-10021',
                session_id='sess_91ad',
                beneficiary='unknown_agent@upi',
                amount=25000,
                risk_score=91,
                risk_level='CRITICAL',
                action='BLOCK',
                coercion_label='SCAM_GUIDED',
                summary='Possible scam-guided payment detected',
                explanation=['Repeated amount edits', 'High hesitation', 'Scam-like note detected'],
                timestamp=timestamp
            ),
            AlertItem(
                customer_id='CUST-10022',
                session_id='sess_81bc',
                beneficiary='trusted_contact@upi',
                amount=12500,
                risk_score=56,
                risk_level='MEDIUM',
                action='WARNING',
                coercion_label='UNCERTAIN',
                summary='Uncertain payment intent',
                explanation=['Some hesitation', 'External transfer context'],
                timestamp=timestamp
            )
        ]
        return ALERTS_LOG + base_samples

    def stats(self) -> StatsResponse:
        avg_score = round(AVERAGE_RISK_SCORE_SUM / max(1, EVALUATION_COUNT), 1)
        return StatsResponse(
            active_sessions=128,
            flagged_payments=WARNINGS_COUNT + CRITICAL_BLOCKS_COUNT,
            fraud_alerts=len(ALERTS_LOG),
            critical_blocks=CRITICAL_BLOCKS_COUNT,
            warning_count=WARNINGS_COUNT,
            step_up_count=3,
            average_risk_score=avg_score
        )
