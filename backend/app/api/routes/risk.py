from fastapi import APIRouter, Depends

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
    policy_engine: PolicyEngine = Depends(get_policy_engine)
) -> RiskEvaluationResponse:
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
