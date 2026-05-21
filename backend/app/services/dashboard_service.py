from __future__ import annotations

from datetime import datetime, timezone

from ..models.schemas import AlertItem, StatsResponse


class DashboardService:
    def sample_alerts(self) -> list[AlertItem]:
        timestamp = datetime.now(timezone.utc).isoformat()
        return [
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

    def stats(self) -> StatsResponse:
        return StatsResponse(
            active_sessions=128,
            flagged_payments=17,
            fraud_alerts=9,
            critical_blocks=6,
            warning_count=8,
            step_up_count=3,
            average_risk_score=47.6
        )
