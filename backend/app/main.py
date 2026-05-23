from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from .api.routes.auth import router as auth_router
from .api.routes.dashboard import router as dashboard_router
from .api.routes.demo import router as demo_router
from .api.routes.federated import router as federated_router
from .api.routes.fraud import router as fraud_router
from .api.routes.health import router as health_router
from .api.routes.risk import router as risk_router
from .api.routes.admin import router as admin_router
from .config import settings

app = FastAPI(title='Saathi Risk Engine', version='1.0.0')

app.add_middleware(
    CORSMiddleware,
    allow_origins=[origin.strip() for origin in settings.cors_origins.split(',') if origin.strip()],
    allow_credentials=True,
    allow_methods=['*'],
    allow_headers=['*']
)

app.include_router(health_router)
app.include_router(auth_router)
app.include_router(risk_router)
app.include_router(fraud_router)
app.include_router(dashboard_router)
app.include_router(admin_router)
app.include_router(demo_router)
app.include_router(federated_router)


@app.get('/')
def root() -> dict[str, str]:
    return {'message': 'Saathi risk engine is running'}
