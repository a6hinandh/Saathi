from __future__ import annotations

from ..services.dashboard_service import DashboardService


def build_alert_timeline() -> list[dict]:
    service = DashboardService()
    return [alert.model_dump() for alert in service.sample_alerts()]
