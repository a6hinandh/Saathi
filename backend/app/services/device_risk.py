from __future__ import annotations


class DeviceRiskService:
    def evaluate(self, device_id: str | None, session_id: str) -> float:
        if not device_id:
            return 0.22
        if device_id.startswith('demo-'):
            return 0.12
        return 0.28 if session_id.endswith('x') else 0.2
