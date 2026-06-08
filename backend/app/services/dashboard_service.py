from __future__ import annotations

import json
from datetime import datetime, timezone
from pathlib import Path
from typing import Any

from pydantic import ValidationError

from ..database import SessionLocal
from ..models.database_models import Alert
from ..models.schemas import AlertItem, StatsResponse
from ..utils.logger import get_logger

logger = get_logger(__name__)
BACKEND_DIR = Path(__file__).resolve().parents[2]
STORAGE_DIR = BACKEND_DIR / 'storage'
ALERT_STORAGE_PATH = STORAGE_DIR / 'risk_alerts.json'

# In-memory mirror for fast reads during a single process. The JSON file is the durable demo store.
ALERTS_LOG: list[AlertItem] = []


def _relative_path(path: Path) -> str:
    try:
        return str(path.relative_to(Path.cwd()))
    except ValueError:
        return str(path)


def _ensure_storage_file() -> None:
    STORAGE_DIR.mkdir(parents=True, exist_ok=True)
    if not ALERT_STORAGE_PATH.exists():
        ALERT_STORAGE_PATH.write_text('[]', encoding='utf-8')


def _read_alert_dicts() -> list[dict[str, Any]]:
    try:
        _ensure_storage_file()
        raw = ALERT_STORAGE_PATH.read_text(encoding='utf-8').strip()
        if not raw:
            return []
        data = json.loads(raw)
        if not isinstance(data, list):
            logger.warning('Alert storage was not a list; returning empty alert set')
            return []
        return [item for item in data if isinstance(item, dict)]
    except json.JSONDecodeError as exc:
        logger.warning('Alert storage is corrupted; returning empty alert set: %s', exc)
        return []
    except Exception as exc:
        logger.warning('Alert storage could not be read; returning empty alert set: %s', exc)
        return []


def _write_alert_dicts(alerts: list[dict[str, Any]]) -> None:
    try:
        _ensure_storage_file()
        ALERT_STORAGE_PATH.write_text(json.dumps(alerts, indent=2), encoding='utf-8')
    except Exception as exc:
        logger.warning('Alert storage could not be written: %s', exc)


def _parse_alerts(alerts: list[dict[str, Any]]) -> list[AlertItem]:
    parsed: list[AlertItem] = []
    for item in alerts:
        try:
            parsed.append(AlertItem(**item))
        except ValidationError as exc:
            logger.warning('Skipping invalid alert record: %s', exc)
    return parsed


def add_alert(alert: AlertItem) -> None:
    # Only feature vectors are persisted. Raw passwords, keystroke sequences, mouse paths,
    # and full event streams are intentionally not collected or stored.
    ALERTS_LOG.insert(0, alert)
    persisted = _read_alert_dicts()
    persisted.insert(0, alert.model_dump())
    _write_alert_dicts(persisted[:250])

    # Also save to SQLite database for SQL logging persistence
    db = SessionLocal()
    try:
        db_alert = Alert(
            customer_id=alert.customer_id,
            session_id=alert.session_id,
            beneficiary=alert.beneficiary,
            amount=alert.amount,
            risk_score=alert.risk_score,
            risk_level=alert.risk_level,
            action=alert.action,
            coercion_label=alert.coercion_label,
            summary=alert.summary,
            timestamp=alert.timestamp
        )
        db_alert.explanation = alert.explanation
        db.add(db_alert)
        db.commit()
        db.refresh(db_alert)
    except Exception as log_exc:
        logger.warning('Failed to save alert to SQLite database: %s', log_exc)
        db.rollback()
    finally:
        db.close()


def reset_alerts() -> None:
    ALERTS_LOG.clear()
    _write_alert_dicts([])
    # Also delete alerts in SQLite database
    db = SessionLocal()
    try:
        db.query(Alert).delete()
        db.commit()
    except Exception as e:
        logger.warning('Failed to clear alerts from SQLite database: %s', e)
        db.rollback()
    finally:
        db.close()


def storage_metadata() -> dict[str, Any]:
    return {
        'path': _relative_path(ALERT_STORAGE_PATH),
        'raw_sensitive_data_logged': False,
        'stored_behavior_data': 'aggregated feature vectors only'
    }


class DashboardService:
    def get_all_alerts(self) -> list[AlertItem]:
        """Fetches all evaluations from the database, falling back on JSON/sample alerts if empty."""
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
                alerts = self.sample_alerts()
            return alerts
        finally:
            db.close()

    def sample_alerts(self) -> list[AlertItem]:
        persisted = _parse_alerts(_read_alert_dicts())
        if persisted:
            return persisted
        return list(ALERTS_LOG)

    def recent_alert_dicts(self, limit: int = 10) -> list[dict[str, Any]]:
        return [alert.model_dump() for alert in self.sample_alerts()[:limit]]

    def stats(self) -> StatsResponse:
        alerts = self.sample_alerts()
        scores = [alert.risk_score for alert in alerts]
        warning_count = sum(1 for alert in alerts if alert.action == 'WARNING')
        critical_blocks = sum(1 for alert in alerts if alert.action == 'BLOCK')
        step_up_count = sum(1 for alert in alerts if alert.action == 'STEP_UP')
        flagged = sum(1 for alert in alerts if alert.action in {'WARNING', 'STEP_UP', 'BLOCK'})
        active_sessions = len({alert.session_id for alert in alerts})
        avg_score = round(sum(scores) / len(scores), 1) if scores else 0.0
        
        # Merge with baseline if empty, to match both branches
        if not alerts:
            return StatsResponse(
                active_sessions=128,
                flagged_payments=14,
                fraud_alerts=0,
                critical_blocks=6,
                warning_count=8,
                step_up_count=3,
                average_risk_score=47.6
            )
            
        return StatsResponse(
            active_sessions=max(active_sessions, 1),
            flagged_payments=flagged,
            fraud_alerts=len(alerts),
            critical_blocks=critical_blocks,
            warning_count=warning_count,
            step_up_count=step_up_count,
            average_risk_score=avg_score
        )

    def last_updated(self) -> str:
        alerts = self.sample_alerts()
        if alerts:
            return alerts[0].timestamp
        return datetime.now(timezone.utc).isoformat()
