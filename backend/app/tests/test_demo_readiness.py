from fastapi.testclient import TestClient
from pathlib import Path

from app.main import app
from app.api import dependencies
from app.services import anomaly_detection, scam_classifier
from app.services.anomaly_detection import BehavioralAnomalyDetector
from app.services.scam_classifier import ScamNoteClassifier


client = TestClient(app)


def reset_demo_logs():
    client.post('/demo/reset')


NORMAL_PAYMENT_PAYLOAD = {
    'customer_id': 'CUST-10021',
    'session_id': 'sess_normal',
    'amount': 500,
    'beneficiary': 'priya.sharma@upi',
    'beneficiary_type': 'SAVED',
    'note': 'dinner',
    'device_id': 'demo-device',
    'features': {
        'avg_key_interval': 220,
        'typing_variance': 500,
        'backspace_rate': 0.1,
        'mouse_speed': 392,
        'confirmation_delay': 5,
        'amount_edit_count': 0,
        'focus_switch_count': 0,
        'paste_count': 0,
        'hesitation_delay': 5
    }
}

SUSPICIOUS_SESSION_PAYLOAD = {
    'customer_id': 'CUST-10021',
    'session_id': 'sess_suspicious',
    'amount': 8500,
    'beneficiary': 'priya.sharma@upi',
    'beneficiary_type': 'SAVED',
    'note': 'School fee payment',
    'device_id': 'demo-device',
    'features': {
        'avg_key_interval': 399,
        'typing_variance': 15000,
        'backspace_rate': 0.30,
        'mouse_speed': 441,
        'confirmation_delay': 42,
        'amount_edit_count': 1,
        'focus_switch_count': 3,
        'paste_count': 0,
        'hesitation_delay': 42
    }
}

SCAM_COERCION_PAYLOAD = {
    'customer_id': 'CUST-10021',
    'session_id': 'sess_scam_coercion',
    'amount': 25000,
    'beneficiary': 'unknown_agent@upi',
    'beneficiary_type': 'CUSTOM',
    'note': 'KYC verification fee',
    'device_id': 'demo-device',
    'features': {
        'avg_key_interval': 578,
        'typing_variance': 15000,
        'backspace_rate': 0.30,
        'mouse_speed': 636,
        'confirmation_delay': 1,
        'amount_edit_count': 1,
        'focus_switch_count': 2,
        'paste_count': 0,
        'hesitation_delay': 1
    }
}


def test_normal_payment_allows():
    reset_demo_logs()
    response = client.post('/risk/evaluate', json=NORMAL_PAYMENT_PAYLOAD)
    assert response.status_code == 200
    body = response.json()
    assert body['risk_level'] == 'LOW'
    assert body['action'] == 'ALLOW'
    assert body['final_risk_score'] <= 30
    assert body['coercion_label'] == 'NORMAL'
    assert not any('external UPI handle' in item for item in body['explanation'])
    assert not any('anomalous' in item for item in body['explanation'])
    assert body['request_id']
    assert body['alert_id']


def test_suspicious_session_step_up():
    reset_demo_logs()
    response = client.post('/risk/evaluate', json=SUSPICIOUS_SESSION_PAYLOAD)
    assert response.status_code == 200
    body = response.json()
    assert body['risk_level'] == 'HIGH'
    assert body['action'] == 'STEP_UP'
    assert 61 <= body['final_risk_score'] <= 80
    assert body['coercion_label'] in {'SUSPICIOUS', 'NORMAL'}
    assert any('anomalous' in item or 'hesitation' in item.lower() for item in body['explanation'])
    assert any('step-up verification' in item.lower() for item in body['explanation'])
    assert not any('SCAM_GUIDED' in item for item in body['explanation'])
    assert not any('external UPI handle' in item for item in body['explanation'])
    assert body['metadata']['policy_gate'] == 'SUSPICIOUS_BEHAVIOR_STEP_UP'


def test_suspicious_session_step_up_without_artifacts(monkeypatch):
    monkeypatch.setattr(anomaly_detection, 'ARTIFACT_PATH', Path('missing_behavior.joblib'))
    monkeypatch.setattr(scam_classifier, 'ARTIFACT_PATH', Path('missing_scam.joblib'))
    app.dependency_overrides[dependencies.get_anomaly_detector] = lambda: BehavioralAnomalyDetector()
    app.dependency_overrides[dependencies.get_scam_classifier] = lambda: ScamNoteClassifier()
    try:
        reset_demo_logs()
        response = client.post('/risk/evaluate', json=SUSPICIOUS_SESSION_PAYLOAD)
        assert response.status_code == 200
        body = response.json()
        assert body['risk_level'] == 'HIGH'
        assert body['action'] == 'STEP_UP'
        assert body['metadata']['policy_gate'] == 'SUSPICIOUS_BEHAVIOR_STEP_UP'
    finally:
        app.dependency_overrides.pop(dependencies.get_anomaly_detector, None)
        app.dependency_overrides.pop(dependencies.get_scam_classifier, None)


def test_scam_coercion_blocks():
    reset_demo_logs()
    response = client.post('/risk/evaluate', json=SCAM_COERCION_PAYLOAD)
    assert response.status_code == 200
    body = response.json()
    assert body['risk_level'] == 'CRITICAL'
    assert body['action'] == 'BLOCK'
    assert body['coercion_label'] == 'SCAM_GUIDED'
    assert body['final_risk_score'] >= 85
    assert 'URGENT' in body['summary']
    assert body['structured_explanation']
    assert any('scam-like' in item.lower() for item in body['explanation'])
    assert any('custom or external' in item.lower() for item in body['explanation'])
    assert any('transaction blocked' in item.lower() for item in body['explanation'])
    assert body['metadata']['policy_gate'] == 'SCAM_COERCION_HARD_BLOCK'


def test_scam_keyword_plural_fee_variant_blocks():
    payload = SCAM_COERCION_PAYLOAD | {'note': 'KYC VERIFICATION FEES'}
    response = client.post('/risk/evaluate', json=payload)
    assert response.status_code == 200
    body = response.json()
    assert body['risk_level'] == 'CRITICAL'
    assert body['action'] == 'BLOCK'
    assert body['coercion_label'] == 'SCAM_GUIDED'


def test_missing_model_uses_fallback(monkeypatch, tmp_path):
    monkeypatch.setattr(anomaly_detection, 'ARTIFACT_PATH', tmp_path / 'missing_behavior.joblib')
    monkeypatch.setattr(scam_classifier, 'ARTIFACT_PATH', tmp_path / 'missing_scam.joblib')
    behavior_model = BehavioralAnomalyDetector()
    scam_model = ScamNoteClassifier()
    assert behavior_model.metadata()['status'] in {'FALLBACK_IN_MEMORY', 'FALLBACK_HEURISTIC'}
    assert scam_model.metadata()['status'] in {'FALLBACK_IN_MEMORY', 'FALLBACK_HEURISTIC'}


def test_invalid_payload_does_not_crash():
    response = client.post('/risk/evaluate', json={'amount': -10})
    assert response.status_code in {422, 400}


def test_empty_note_no_crash():
    payload = NORMAL_PAYMENT_PAYLOAD | {'note': ''}
    response = client.post('/risk/evaluate', json=payload)
    assert response.status_code == 200
    assert response.json()['action'] in {'ALLOW', 'WARNING', 'STEP_UP', 'BLOCK'}


def test_invalid_amount_no_crash():
    payload = NORMAL_PAYMENT_PAYLOAD | {'amount': -1}
    response = client.post('/risk/evaluate', json=payload)
    assert response.status_code in {422, 400}


def test_missing_features_no_crash():
    payload = NORMAL_PAYMENT_PAYLOAD.copy()
    payload.pop('features')
    response = client.post('/risk/evaluate', json=payload)
    assert response.status_code in {422, 400}


def test_dashboard_alert_created_after_risk_eval():
    reset_demo_logs()
    risk_response = client.post('/demo/run-scenario', json={'scenario': 'SCAM_COERCION_PAYMENT'})
    assert risk_response.status_code == 200
    overview = client.get('/admin/overview')
    assert overview.status_code == 200
    body = overview.json()
    assert body['stats']['fraud_alerts'] >= 1
    assert body['recent_alerts'][0]['alert_id'] == risk_response.json()['alert_id']


def test_demo_scenario_endpoint():
    reset_demo_logs()
    response = client.post('/demo/run-scenario', json={'scenario': 'NORMAL_PAYMENT'})
    assert response.status_code == 200
    assert response.json()['action'] == 'ALLOW'


def test_demo_scenario_normal():
    reset_demo_logs()
    response = client.post('/demo/run-scenario', json={'scenario': 'NORMAL_PAYMENT'})
    assert response.status_code == 200
    body = response.json()
    assert body['risk_level'] == 'LOW'
    assert body['action'] == 'ALLOW'


def test_demo_scenario_suspicious():
    reset_demo_logs()
    response = client.post('/demo/run-scenario', json={'scenario': 'SUSPICIOUS_SESSION'})
    assert response.status_code == 200
    body = response.json()
    assert body['risk_level'] == 'HIGH'
    assert body['action'] == 'STEP_UP'


def test_demo_scenario_scam_coercion():
    reset_demo_logs()
    response = client.post('/demo/run-scenario', json={'scenario': 'SCAM_COERCION_PAYMENT'})
    assert response.status_code == 200
    body = response.json()
    assert body['risk_level'] == 'CRITICAL'
    assert body['action'] == 'BLOCK'
    assert body['coercion_label'] == 'SCAM_GUIDED'


def test_demo_reset_endpoint():
    client.post('/demo/run-scenario', json={'scenario': 'SCAM_COERCION_PAYMENT'})
    response = client.post('/demo/reset')
    assert response.status_code == 200
    assert response.json()['status'] == 'success'
    overview = client.get('/admin/overview')
    assert overview.json()['stats']['fraud_alerts'] == 0


def test_federated_status_endpoint():
    response = client.get('/federated/status')
    assert response.status_code == 200
    body = response.json()
    assert body['federated_status'] == 'SIMULATED'
    assert body['raw_data_uploaded'] is False


def test_admin_models_endpoint():
    response = client.get('/admin/models')
    assert response.status_code == 200
    body = response.json()
    assert 'behavior_model' in body
    assert 'scam_classifier' in body
    assert body['behavior_model']['fallback_available'] is True
    assert body['scam_classifier']['fallback_available'] is True
