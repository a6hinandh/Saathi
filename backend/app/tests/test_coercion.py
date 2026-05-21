from app.models.schemas import BehaviorFeatures
from app.services.anomaly_detection import BehavioralAnomalyDetector
from app.services.coercion_engine import CoercionEngine
from app.services.hesitation_engine import HesitationEngine
from app.services.scam_classifier import ScamNoteClassifier


def test_coercion_engine_labels_scam_guided_case():
    features = BehaviorFeatures(avg_key_interval=420, typing_variance=110, backspace_rate=0.22, mouse_speed=1200, confirmation_delay=24, amount_edit_count=4, focus_switch_count=6, paste_count=1, hesitation_delay=18)
    anomaly = BehavioralAnomalyDetector().evaluate(features)
    scam = ScamNoteClassifier().predict('KYC verification fee')
    hesitation = HesitationEngine().evaluate(features)
    result = CoercionEngine().evaluate(25000, 'unknown_agent@upi', 'KYC verification fee', features, anomaly, scam, hesitation)
    assert result.label == 'SCAM_GUIDED'
