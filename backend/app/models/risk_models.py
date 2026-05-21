from __future__ import annotations

from dataclasses import dataclass


@dataclass
class RiskSignal:
    name: str
    score: float


@dataclass
class RiskDecision:
    final_risk_score: int
    risk_level: str
    action: str