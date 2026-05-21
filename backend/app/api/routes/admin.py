from fastapi import APIRouter, Depends
from pathlib import Path
from datetime import datetime

from ..dependencies import get_dashboard_service
from ...services.dashboard_service import DashboardService

ARTIFACT_DIR = Path(__file__).resolve().parents[2] / 'ml' / 'artifacts'

router = APIRouter(prefix='/admin', tags=['admin'])


def _list_artifacts():
    items = []
    if not ARTIFACT_DIR.exists():
        return items
    for p in sorted(ARTIFACT_DIR.iterdir()):
        try:
            stat = p.stat()
            items.append({
                'name': p.name,
                'path': str(p.relative_to(Path.cwd())),
                'size': stat.st_size,
                'modified': datetime.fromtimestamp(stat.st_mtime).isoformat()
            })
        except Exception:
            items.append({'name': p.name, 'error': 'stat failed'})
    return items


@router.get('/overview')
def overview(service: DashboardService = Depends(get_dashboard_service)) -> dict:
    stats = service.stats().model_dump()
    alerts = [a.model_dump() for a in service.sample_alerts()]
    artifacts = _list_artifacts()
    return {
        'stats': stats,
        'alerts_count': len(alerts),
        'recent_alerts': alerts[:10],
        'artifacts': artifacts
    }


@router.get('/alerts')
def admin_alerts(service: DashboardService = Depends(get_dashboard_service)) -> list[dict]:
    return [a.model_dump() for a in service.sample_alerts()]


@router.get('/models')
def models() -> list[dict]:
    return _list_artifacts()
