from __future__ import annotations
from datetime import datetime, timezone

from ..database import SessionLocal
from ..models.database_models import Alert
from ..models.schemas import AlertItem, StatsResponse


class DashboardService:
    def get_all_alerts(self) -> list[AlertItem]:
        """Fetches all evaluations from the database, falling back on sample alerts if empty."""
        db = SessionLocal()
        try:
            db_alerts = db.query(Alert).order_by(Alert.id.desc()).all()
            alerts = []
            for a in db_alerts:
                alerts.append(
                    AlertItem(
                        customer_id=a.customer_id,
                        session_id=a.session_id,
                        beneficiary=a.beneficiary,
                        amount=a.amount,
                        risk_score=a.risk_score,
                        risk_level=a.risk_level,
                        action=a.action,
                        coercion_label=a.coercion_label,
                        summary=a.summary,
                        explanation=a.explanation,
                        timestamp=a.timestamp
                    )
                )

            # Sample fallback alerts if database is completely fresh
            if not alerts:
                timestamp = datetime.now(timezone.utc).isoformat()
                alerts = [
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
                        explanation=[
                            'Typing rhythm, hesitation, and edit frequency are anomalous.',
                            'Transfer note matches scam-like payment patterns.',
                            'Beneficiary is an external UPI handle.'
                        ],
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
                        explanation=[
                            'Some hesitation observed.',
                            'External transfer context.'
                        ],
                        timestamp=timestamp
                    )
                ]
            return alerts
        finally:
            db.close()

    def stats(self) -> StatsResponse:
        """Aggregates metrics dynamically from database records layered over mock baselines."""
        db = SessionLocal()
        try:
            alerts = db.query(Alert).all()
            total_alerts = len(alerts)

            # Seed default counts so dashboard is populated on fresh database
            base_sessions = 128
            base_critical_blocks = 6
            base_warnings = 8
            base_risk_sum = 47.6 * 14
            base_count = 14

            for a in alerts:
                base_count += 1
                base_risk_sum += a.risk_score
                if a.action == 'BLOCK':
                    base_critical_blocks += 1
                elif a.action == 'WARNING':
                    base_warnings += 1

            avg_score = round(base_risk_sum / max(1, base_count), 1)

            return StatsResponse(
                active_sessions=base_sessions,
                flagged_payments=base_warnings + base_critical_blocks,
                fraud_alerts=total_alerts,
                critical_blocks=base_critical_blocks,
                warning_count=base_warnings,
                step_up_count=3,
                average_risk_score=avg_score
            )
        finally:
            db.close()
