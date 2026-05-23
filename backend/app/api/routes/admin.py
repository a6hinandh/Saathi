from datetime import datetime, timezone

from fastapi import APIRouter, Depends

from ..dependencies import get_dashboard_service
from .federated import federated_status_payload
from ...services.anomaly_detection import BehavioralAnomalyDetector
from ...services.dashboard_service import DashboardService
from ...services.scam_classifier import ScamNoteClassifier

router = APIRouter(prefix='/admin', tags=['admin'])


def model_metadata() -> dict:
    return {
        'behavior_model': BehavioralAnomalyDetector().metadata(),
        'scam_classifier': ScamNoteClassifier().metadata()
    }


@router.get('/overview')
def overview(service: DashboardService = Depends(get_dashboard_service)) -> dict:
    stats = service.stats().model_dump()
    alerts = service.recent_alert_dicts(limit=10)
    return {
        'stats': stats,
        'recent_alerts': alerts,
        'models': model_metadata(),
        'federated_status': federated_status_payload(),
        'last_updated': datetime.now(timezone.utc).isoformat()
    }


@router.get('/alerts')
def admin_alerts(service: DashboardService = Depends(get_dashboard_service)) -> list[dict]:
    return [a.model_dump() for a in service.sample_alerts()]


@router.get('/models')
def models() -> dict:
    return model_metadata()
