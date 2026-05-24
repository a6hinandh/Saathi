from datetime import datetime, timezone
from uuid import uuid4

from fastapi import APIRouter, Depends

from ...models.schemas import RiskEvaluationRequest, RiskEvaluationResponse, RiskComponents
from ...services.anomaly_detection import BehavioralAnomalyDetector
from ...services.coercion_engine import CoercionEngine
from ...services.explanation_engine import ExplanationEngine
from ...services.hesitation_engine import HesitationEngine
from ...services.policy_engine import PolicyEngine
from ...services.risk_fusion import RiskFusionEngine
from ...services.scam_classifier import ScamNoteClassifier, contains_scam_keyword
from ...services.transaction_risk import TransactionRiskService
from ...services.device_risk import DeviceRiskService
from ...utils.logger import get_logger
from ...services.shap_service import ShapExplainer

shap_explainer = ShapExplainer()

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
logger = get_logger(__name__)


def _is_depends(value: object) -> bool:
    return type(value).__name__ == 'Depends' or hasattr(value, 'dependency')


def fallback_response(request_id: str | None = None, alert_id: str | None = None, timestamp: str | None = None) -> RiskEvaluationResponse:
    return RiskEvaluationResponse(
        request_id=request_id or str(uuid4()),
        alert_id=alert_id or str(uuid4()),
        timestamp=timestamp or datetime.now(timezone.utc).isoformat(),
        final_risk_score=65,
        risk_level='HIGH',
        action='STEP_UP',
        summary='Risk engine fallback triggered. Step-up verification required.',
        components=RiskComponents(
            behavior_anomaly=0,
            scam_note_probability=0,
            hesitation_risk=0,
            coercion_risk=0,
            transaction_risk=0,
            device_risk=0
        ),
        coercion_label='UNKNOWN',
        explanation=['Risk engine fallback policy triggered to avoid unsafe silent approval.'],
        structured_explanation=[],
        metadata={'fallback': True}
    )


def _known_or_saved_beneficiary(request: RiskEvaluationRequest) -> bool:
    normalized = request.beneficiary.lower().strip()
    known_saved = {'priya.sharma@upi', 'rohan.mehta@okaxis', 'friend@upi', 'school_fees@upi', 'priya sharma', 'rohan mehta', 'maya fernandes', 'vivek traders'}
    return (request.beneficiary_type or '').upper() == 'SAVED' or normalized in known_saved


def _custom_or_unknown_beneficiary(request: RiskEvaluationRequest) -> bool:
    kind = (request.beneficiary_type or '').upper()
    if kind == 'CUSTOM':
        return True
    if kind == 'SAVED':
        return False
    normalized = request.beneficiary.lower().strip()
    return not _known_or_saved_beneficiary(request) and (
        '@upi' in normalized
        or 'unknown' in normalized
        or 'agent' in normalized
        or 'custom' in normalized
    )


def _behavior_high(request: RiskEvaluationRequest, behavior_score: float) -> bool:
    features = request.features
    return (
        behavior_score >= 0.65
        or features.typing_variance >= 10000
        or features.backspace_rate >= 0.25
        or features.avg_key_interval >= 380
        or features.focus_switch_count >= 3
        or features.hesitation_delay >= 20
    )


def _behavior_present(request: RiskEvaluationRequest, behavior_score: float) -> bool:
    features = request.features
    return (
        behavior_score >= 0.45
        or features.typing_variance >= 8000
        or features.backspace_rate >= 0.20
        or features.avg_key_interval >= 380
        or features.focus_switch_count >= 1
    )


def _risk_band(score: int) -> tuple[str, str]:
    if score <= 30:
        return 'LOW', 'ALLOW'
    if score <= 60:
        return 'MEDIUM', 'WARNING'
    if score <= 80:
        return 'HIGH', 'STEP_UP'
    return 'CRITICAL', 'BLOCK'


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
    # Resolve FastAPI Depends objects if called directly in tests
    if _is_depends(anomaly_detector):
        anomaly_detector = get_anomaly_detector()
    if _is_depends(scam_classifier):
        scam_classifier = get_scam_classifier()
    if _is_depends(hesitation_engine):
        hesitation_engine = get_hesitation_engine()
    if _is_depends(coercion_engine):
        coercion_engine = get_coercion_engine()
    if _is_depends(transaction_risk_service):
        transaction_risk_service = get_transaction_risk_service()
    if _is_depends(device_risk_service):
        device_risk_service = get_device_risk_service()
    if _is_depends(risk_fusion_engine):
        risk_fusion_engine = get_risk_fusion_engine()
    if _is_depends(explanation_engine):
        explanation_engine = get_explanation_engine()
    if _is_depends(policy_engine):
        policy_engine = get_policy_engine()

    request_id = str(uuid4())
    alert_id = str(uuid4())
    timestamp = datetime.now(timezone.utc).isoformat()

    try:
        anomaly = anomaly_detector.evaluate(request.features)
        scam = scam_classifier.predict(request.note)
        hesitation = hesitation_engine.evaluate(request.features)
        coercion = coercion_engine.evaluate(
            request.amount,
            request.beneficiary,
            request.note,
            request.features,
            anomaly,
            scam,
            hesitation,
            request.beneficiary_type
        )
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
        policy_gate = 'WEIGHTED_FUSION'
        scam_note = scam.probability >= 0.65 or contains_scam_keyword(request.note)
        benign_note_context = scam.label != 'SCAM_LIKE' and not contains_scam_keyword(request.note)
        saved_beneficiary = _known_or_saved_beneficiary(request)
        custom_or_unknown = _custom_or_unknown_beneficiary(request)
        behavior_high = _behavior_high(request, anomaly.score)
        behavior_present = _behavior_present(request, anomaly.score)

        if (
            scam_note
            and request.amount >= 20000
            and custom_or_unknown
            and behavior_present
        ):
            policy_gate = 'SCAM_COERCION_HARD_BLOCK'
            coercion.label = 'SCAM_GUIDED'
            coercion.score = max(coercion.score, 0.9)
            components.coercion_risk = max(components.coercion_risk, coercion.score)
            fusion.final_risk_score = max(fusion.final_risk_score, 90)
            fusion.risk_level = 'CRITICAL'
            fusion.action = 'BLOCK'
            fusion.summary = 'URGENT: This appears to be a scam-guided payment. The transaction has been blocked for your safety. End any call or chat instructing you to pay and contact 1930.'
        elif (
            saved_beneficiary
            and benign_note_context
            and behavior_high
            and request.amount >= 5000
        ):
            policy_gate = 'SUSPICIOUS_BEHAVIOR_STEP_UP'
            if coercion.label == 'SCAM_GUIDED':
                coercion.label = 'SUSPICIOUS'
            fusion.final_risk_score = min(max(fusion.final_risk_score, 68), 78)
            fusion.risk_level = 'HIGH'
            fusion.action = 'STEP_UP'
            fusion.summary = 'Step-up verification required due to behavioral anomaly.'
        elif (
            request.amount <= 1000
            and saved_beneficiary
            and scam.probability < 0.3
            and coercion.label == 'NORMAL'
            and device_risk <= 0.15
        ):
            policy_gate = 'SAFE_PAYMENT_ALLOW'
            fusion.final_risk_score = min(fusion.final_risk_score, 25)
            fusion.risk_level = 'LOW'
            fusion.action = 'ALLOW'
            fusion.summary = 'Payment risk is manageable'
        action = policy_engine.decide(fusion.final_risk_score)
        explanations = explanation_engine.build(
            request.note,
            request.beneficiary,
            components,
            coercion.label,
            request.beneficiary_type,
            request.amount
        )
        structured_explanations = explanation_engine.build_structured(
            request.note,
            request.beneficiary,
            components,
            coercion.label,
            request.beneficiary_type,
            request.amount
        )
        if policy_gate == 'SUSPICIOUS_BEHAVIOR_STEP_UP':
            explanations.append('Step-up verification required due to behavioral anomaly.')
        elif policy_gate == 'SCAM_COERCION_HARD_BLOCK':
            explanations.append('High-value transfer to unknown beneficiary.')
            explanations.append('Transaction blocked for customer safety.')

        metadata = {
            'scam_label': scam.label,
            'anomaly_explanation': anomaly.explanation,
            'hesitation_explanation': hesitation.explanation,
            'coercion_explanation': coercion.explanation,
            'models': {
                'behavior_model': anomaly_detector.metadata(),
                'scam_classifier': scam_classifier.metadata()
            },
            'policy_gate': policy_gate,
            'raw_sensitive_data_logged': False,
            'shap_explanation': shap_explainer.full_explanation(components, request.features, fusion.final_risk_score)
        }
    except Exception as exc:
        logger.exception('Risk evaluation failed; using safe fallback: %s', exc)
        response = fallback_response(request_id, alert_id, timestamp)
        try:
            from ...models.schemas import AlertItem
            from ...services.dashboard_service import add_alert

            add_alert(AlertItem(
                alert_id=response.alert_id,
                request_id=response.request_id,
                customer_id=getattr(request, 'customer_id', 'UNKNOWN'),
                session_id=getattr(request, 'session_id', 'UNKNOWN'),
                beneficiary=getattr(request, 'beneficiary', 'UNKNOWN'),
                amount=getattr(request, 'amount', 0),
                note=getattr(request, 'note', ''),
                device_id=getattr(request, 'device_id', None),
                features=getattr(request, 'features', {}).model_dump() if hasattr(getattr(request, 'features', None), 'model_dump') else {},
                components=response.components.model_dump(),
                risk_score=response.final_risk_score,
                risk_level=response.risk_level,
                action=response.action,
                coercion_label=response.coercion_label,
                summary=response.summary,
                explanation=response.explanation,
                structured_explanation=response.structured_explanation,
                metadata=response.metadata,
                timestamp=response.timestamp or timestamp
            ))
        except Exception as log_exc:
            logger.warning('Fallback alert could not be persisted: %s', log_exc)
        return response

    from ...models.schemas import AlertItem
    from ...services.dashboard_service import add_alert

    alert_item = AlertItem(
        alert_id=alert_id,
        request_id=request_id,
        customer_id=request.customer_id,
        session_id=request.session_id,
        beneficiary=request.beneficiary,
        amount=request.amount,
        note=request.note,
        device_id=request.device_id,
        features=request.features.model_dump(),
        components=components.model_dump(),
        risk_score=fusion.final_risk_score,
        risk_level=fusion.risk_level,
        action=action,
        coercion_label=coercion.label,
        summary=fusion.summary,
        explanation=explanations,
        structured_explanation=structured_explanations,
        metadata=metadata,
        timestamp=timestamp
    )
    add_alert(alert_item)

    return RiskEvaluationResponse(
        request_id=request_id,
        alert_id=alert_id,
        timestamp=timestamp,
        final_risk_score=fusion.final_risk_score,
        risk_level=fusion.risk_level,
        action=action,
        summary=fusion.summary,
        components=components,
        coercion_label=coercion.label,
        explanation=explanations,
        structured_explanation=structured_explanations,
        metadata=metadata
    )
