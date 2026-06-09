import json
from datetime import datetime, timezone
from pathlib import Path

from fastapi import APIRouter, Depends

from ..dependencies import get_dashboard_service
from .federated import federated_status_payload
from ...services.anomaly_detection import BehavioralAnomalyDetector
from ...services.dashboard_service import DashboardService
from ...services.scam_classifier import ScamNoteClassifier

router = APIRouter(prefix='/admin', tags=['admin'])

BENCHMARK_REPORT_PATH = Path(__file__).resolve().parents[3] / 'app' / 'ml' / 'reports' / 'benchmark_policy_report.json'


def _load_benchmark_metadata() -> dict:
    if not BENCHMARK_REPORT_PATH.exists():
        return {'benchmark_report_available': False}
    try:
        with open(BENCHMARK_REPORT_PATH, 'r', encoding='utf-8') as f:
            payload = json.load(f)
        r = payload.get('report', {})
        return {
            'benchmark_report_available': True,
            'benchmark_action_accuracy': r.get('action_accuracy'),
            'benchmark_risky_f1': r.get('risky_f1'),
        }
    except Exception:
        return {'benchmark_report_available': False}


def model_metadata() -> dict:
    behavior = BehavioralAnomalyDetector()
    scam = ScamNoteClassifier()
    bench = _load_benchmark_metadata()

    behavior_meta = behavior.metadata()
    behavior_meta.update(bench)
    if behavior.metrics:
        behavior_meta['anomaly_precision'] = behavior.metrics.get('precision')
        behavior_meta['anomaly_recall'] = behavior.metrics.get('recall')

    scam_meta = scam.metadata()
    if hasattr(scam, 'synthetic_data_warning') and scam.synthetic_data_warning:
        scam_meta['synthetic_data_warning'] = scam.synthetic_data_warning

    return {'behavior_model': behavior_meta, 'scam_classifier': scam_meta}


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
