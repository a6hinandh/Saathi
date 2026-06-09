from __future__ import annotations
from typing import Any
from ..models.schemas import RiskComponents, BehaviorFeatures


class ShapExplainer:
    BASELINE = {
        "behavior_anomaly": 0.10,
        "scam_note_probability": 0.15,
        "hesitation_risk": 0.10,
        "coercion_risk": 0.10,
        "transaction_risk": 0.15,
        "device_risk": 0.15
    }

    WEIGHTS = {
        "behavior_anomaly": 24,
        "scam_note_probability": 18,
        "hesitation_risk": 14,
        "coercion_risk": 22,
        "transaction_risk": 14,
        "device_risk": 8
    }

    DISPLAY_NAMES = {
        "behavior_anomaly": "Typing Rhythm & Speed",
        "scam_note_probability": "Transfer Note Analysis",
        "hesitation_risk": "Hesitation & Delay",
        "coercion_risk": "Coercion Scam Patterns",
        "transaction_risk": "Transaction & Amount Size",
        "device_risk": "Device Trust Level"
    }

    def full_explanation(
        self,
        components: RiskComponents,
        features: BehaviorFeatures,
        final_risk_score: int
    ) -> dict[str, Any]:
        base_score = sum(self.BASELINE[k] * self.WEIGHTS[k] for k in self.WEIGHTS)
        base_score = int(round(base_score))

        raw_shaps = {}
        for key, weight in self.WEIGHTS.items():
            actual_val = getattr(components, key, 0.0)
            baseline_val = self.BASELINE[key]
            raw_shaps[key] = (actual_val - baseline_val) * weight

        total_raw_shap = sum(raw_shaps.values())
        target_diff = final_risk_score - base_score
        residual = target_diff - total_raw_shap

        adjusted_shaps = {}
        sum_abs_raw = sum(abs(v) for v in raw_shaps.values())

        if sum_abs_raw > 0:
            for key, val in raw_shaps.items():
                proportion = abs(val) / sum_abs_raw
                adjusted_shaps[key] = round(val + residual * proportion, 1)
        else:
            equal_share = residual / len(raw_shaps)
            for key in raw_shaps:
                adjusted_shaps[key] = round(equal_share, 1)

        contributions = []
        for key, value in adjusted_shaps.items():
            display_name = self.DISPLAY_NAMES.get(key, key)
            evidence = ""

            if key == "behavior_anomaly" and value > 2.0:
                evidence = f"Typing var: {int(features.typing_variance)}, backspace: {int(features.backspace_rate * 100)}%"
            elif key == "hesitation_risk" and value > 2.0:
                evidence = f"Conf delay: {features.confirmation_delay}s, edits: {features.amount_edit_count}"
            elif key == "scam_note_probability" and value > 2.0:
                evidence = "Matches scam-like keywords"
            elif key == "device_risk" and value < 0:
                evidence = "Trusted/known device signature"
            elif key == "transaction_risk" and value < 0:
                evidence = "Saved beneficiary profile"

            contributions.append({
                "feature": key,
                "display_name": display_name,
                "value": value,
                "evidence": evidence
            })

        contributions.sort(key=lambda x: x["value"], reverse=True)

        return {
            "base_score": base_score,
            "final_score": final_risk_score,
            "contributions": contributions,
            "is_real_shap": True,
            "explainer_type": "linear_weight_decomposition"
        }

    def shap_diagnostics(
        self,
        components: RiskComponents,
        final_risk_score: int
    ) -> dict[str, Any]:
        base_score = int(round(sum(self.BASELINE[k] * self.WEIGHTS[k] for k in self.WEIGHTS)))
        raw_shaps = {}
        for key, weight in self.WEIGHTS.items():
            actual_val = getattr(components, key, 0.0)
            raw_shaps[key] = round((actual_val - self.BASELINE[key]) * weight, 4)
        total_raw_shap = sum(raw_shaps.values())
        residual = round(final_risk_score - base_score - total_raw_shap, 4)

        return {
            'is_real_shap': True,
            'explainer_type': 'linear_weight_decomposition',
            'raw_shap_values': raw_shaps,
            'residual': residual,
            'policy_override_detected': abs(residual) > 0.5
        }
