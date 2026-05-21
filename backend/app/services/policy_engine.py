from __future__ import annotations


class PolicyEngine:
    def decide(self, score: int) -> str:
        if score <= 30:
            return 'ALLOW'
        if score <= 60:
            return 'WARNING'
        if score <= 80:
            return 'STEP_UP'
        return 'BLOCK'
