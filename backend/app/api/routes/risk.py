from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from ...database import get_db
from ...models.database_models import Alert
from ...models.schemas import RiskEvaluationRequest, RiskEvaluationResponse, RiskComponents
from ...services.anomaly_detection import BehavioralAnomalyDetector
from ...services.coercion_engine import CoercionEngine
from ...services.explanation_engine import ExplanationEngine
from ...services.hesitation_engine import HesitationEngine
from ...services.policy_engine import PolicyEngine
from ...services.risk_fusion import RiskFusionEngine
from ...services.scam_classifier import ScamNoteClassifier
from ...services.transaction_risk import TransactionRiskService
from ...services.device_risk import DeviceRiskService
from ..dependencies import (
    get_anomaly_detector,
    get_coercion_engine,
    get_device_risk_service,
    get_explanation_engine,
    get_hesitation_engine,
    get_policy_engine,
    get_risk_fusion_engine,
    get_scam_classifier,
    get_transaction_risk_service
)

router = APIRouter(prefix='/risk', tags=['risk'])


@router.post('/evaluate', response_model=RiskEvaluationResponse)
def evaluate_risk(
    request: RiskEvaluationRequest,
    anomaly_detector: BehavioralAnomalyDetector = Depends(get_anomaly_detector),
    scam_classifier: ScamNoteClassifier = Depends(get_scam_classifier),
    hesitation_engine: HesitationEngine = Depends(get_hesitation_engine),
    coercion_engine: CoercionEngine = Depends(get_coercion_engine),
    transaction_risk_service: TransactionRiskService = Depends(get_transaction_risk_service),
    device_risk_service: DeviceRiskService = Depends(get_device_risk_service),
    risk_fusion_engine: RiskFusionEngine = Depends(get_risk_fusion_engine),
    explanation_engine: ExplanationEngine = Depends(get_explanation_engine),
    policy_engine: PolicyEngine = Depends(get_policy_engine),
    db: Session = Depends(get_db)
) -> RiskEvaluationResponse:
    # Resolve FastAPI Depends objects if called directly in tests
    if type(anomaly_detector).__name__ == 'Depends' or hasattr(anomaly_detector, 'dependency'):
        anomaly_detector = get_anomaly_detector()
    if type(scam_classifier).__name__ == 'Depends' or hasattr(scam_classifier, 'dependency'):
        scam_classifier = get_scam_classifier()
    if type(hesitation_engine).__name__ == 'Depends' or hasattr(hesitation_engine, 'dependency'):
        hesitation_engine = get_hesitation_engine()
    if type(coercion_engine).__name__ == 'Depends' or hasattr(coercion_engine, 'dependency'):
        coercion_engine = get_coercion_engine()
    if type(transaction_risk_service).__name__ == 'Depends' or hasattr(transaction_risk_service, 'dependency'):
        transaction_risk_service = get_transaction_risk_service()
    if type(device_risk_service).__name__ == 'Depends' or hasattr(device_risk_service, 'dependency'):
        device_risk_service = get_device_risk_service()
    if type(risk_fusion_engine).__name__ == 'Depends' or hasattr(risk_fusion_engine, 'dependency'):
        risk_fusion_engine = get_risk_fusion_engine()
    if type(explanation_engine).__name__ == 'Depends' or hasattr(explanation_engine, 'dependency'):
        explanation_engine = get_explanation_engine()
    if type(policy_engine).__name__ == 'Depends' or hasattr(policy_engine, 'dependency'):
        policy_engine = get_policy_engine()
    if type(db).__name__ == 'Depends' or hasattr(db, 'dependency') or db is None:
        db = next(get_db())

    anomaly = anomaly_detector.evaluate(request.features)
    scam = scam_classifier.predict(request.note)
    hesitation = hesitation_engine.evaluate(request.features)
    coercion = coercion_engine.evaluate(request.amount, request.beneficiary, request.note, request.features, anomaly, scam, hesitation)
    transaction_risk = transaction_risk_service.evaluate(request)
    device_risk = device_risk_service.evaluate(request.device_id, request.session_id)

    components = RiskComponents(
        behavior_anomaly=anomaly.score,
        scam_note_probability=scam.probability,
        hesitation_risk=hesitation.score,
        coercion_risk=coercion.score,
        transaction_risk=transaction_risk,
        device_risk=device_risk
    )

    fusion = risk_fusion_engine.fuse(components, coercion.label)
    action = policy_engine.decide(fusion.final_risk_score)
    explanations = explanation_engine.build(request.note, request.beneficiary, components, coercion.label)

    from datetime import datetime, timezone

    db_alert = Alert(
        customer_id=request.customer_id,
        session_id=request.session_id,
        beneficiary=request.beneficiary,
        amount=request.amount,
        risk_score=fusion.final_risk_score,
        risk_level=fusion.risk_level,
        action=action,
        coercion_label=coercion.label,
        summary=fusion.summary,
        timestamp=datetime.now(timezone.utc).isoformat()
    )
    db_alert.explanation = explanations
    db.add(db_alert)
    db.commit()
    db.refresh(db_alert)

    return RiskEvaluationResponse(
        final_risk_score=fusion.final_risk_score,
        risk_level=fusion.risk_level,
        action=action,
        summary=fusion.summary,
        components=components,
        coercion_label=coercion.label,
        explanation=explanations,
        metadata={
            'scam_label': scam.label,
            'anomaly_explanation': anomaly.explanation,
            'hesitation_explanation': hesitation.explanation,
            'coercion_explanation': coercion.explanation
        }
    )
