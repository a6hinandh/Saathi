from __future__ import annotations

import json
from datetime import datetime, timezone
from pathlib import Path
from typing import Any

from pydantic import ValidationError

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


def reset_alerts() -> None:
    ALERTS_LOG.clear()
    _write_alert_dicts([])


def storage_metadata() -> dict[str, Any]:
    return {
        'path': _relative_path(ALERT_STORAGE_PATH),
        'raw_sensitive_data_logged': False,
        'stored_behavior_data': 'aggregated feature vectors only'
    }


class DashboardService:
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
        return StatsResponse(
            active_sessions=active_sessions,
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
