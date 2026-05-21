from fastapi import APIRouter, Depends

from ..dependencies import get_dashboard_service
from ...services.dashboard_service import DashboardService

router = APIRouter(prefix='/dashboard', tags=['dashboard'])


@router.get('/stats')
def stats(service: DashboardService = Depends(get_dashboard_service)) -> dict:
    return service.stats().model_dump()
