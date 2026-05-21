import { api } from '@/lib/api';
import type { RiskEvaluationRequest, RiskEvaluationResponse } from '@/lib/types';

export async function evaluateRisk(payload: RiskEvaluationRequest) {
  const response = await api.post<RiskEvaluationResponse>('/risk/evaluate', payload);
  return response.data;
}
