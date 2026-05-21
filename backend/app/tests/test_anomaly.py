from app.models.schemas import BehaviorFeatures
from app.services.anomaly_detection import BehavioralAnomalyDetector


def test_anomaly_detector_scores_high_for_irregular_behavior():
    detector = BehavioralAnomalyDetector()
    result = detector.evaluate(BehaviorFeatures(typing_variance=180, hesitation_delay=30, amount_edit_count=5, focus_switch_count=8, backspace_rate=0.3))
    assert result.score >= 0.7
