from fastapi import APIRouter, Depends

from ..dependencies import get_dashboard_service
from ...services.dashboard_service import DashboardService

router = APIRouter(prefix='/dashboard', tags=['fraud'])


@router.get('/alerts')
def alerts(service: DashboardService = Depends(get_dashboard_service)) -> list[dict]:
    return [alert.model_dump() for alert in service.get_all_alerts()]
