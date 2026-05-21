export type RiskLevel = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';

export interface BehaviorFeatures {
  avg_key_interval: number;
  typing_variance: number;
  backspace_rate: number;
  mouse_speed: number;
  confirmation_delay: number;
  amount_edit_count: number;
  focus_switch_count?: number;
  paste_count?: number;
  hesitation_delay?: number;
}

export interface RiskEvaluationRequest {
  customer_id: string;
  session_id: string;
  amount: number;
  beneficiary: string;
  note: string;
  device_id?: string;
  features: BehaviorFeatures;
}

export interface RiskEvaluationResponse {
  final_risk_score: number;
  risk_level: string;
  action: string;
  summary: string;
  components: Record<string, number>;
  explanation: string[];
  coercion_label?: string;
}
