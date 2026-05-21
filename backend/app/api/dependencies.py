from ..services.anomaly_detection import BehavioralAnomalyDetector
from ..services.coercion_engine import CoercionEngine
from ..services.dashboard_service import DashboardService
from ..services.device_risk import DeviceRiskService
from ..services.explanation_engine import ExplanationEngine
from ..services.hesitation_engine import HesitationEngine
from ..services.policy_engine import PolicyEngine
from ..services.risk_fusion import RiskFusionEngine
from ..services.scam_classifier import ScamNoteClassifier
from ..services.transaction_risk import TransactionRiskService


def get_anomaly_detector() -> BehavioralAnomalyDetector:
    return BehavioralAnomalyDetector()


def get_scam_classifier() -> ScamNoteClassifier:
    return ScamNoteClassifier()


def get_hesitation_engine() -> HesitationEngine:
    return HesitationEngine()


def get_coercion_engine() -> CoercionEngine:
    return CoercionEngine()


def get_transaction_risk_service() -> TransactionRiskService:
    return TransactionRiskService()


def get_device_risk_service() -> DeviceRiskService:
    return DeviceRiskService()


def get_risk_fusion_engine() -> RiskFusionEngine:
    return RiskFusionEngine()


def get_explanation_engine() -> ExplanationEngine:
    return ExplanationEngine()


def get_policy_engine() -> PolicyEngine:
    return PolicyEngine()


def get_dashboard_service() -> DashboardService:
    return DashboardService()
