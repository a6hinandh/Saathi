import { useState } from 'react';
import { api } from '@/lib/api';
import type { RiskEvaluationRequest, RiskEvaluationResponse } from '@/lib/types';

export function useRiskEngine() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const evaluate = async (payload: RiskEvaluationRequest) => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.post<RiskEvaluationResponse>('/risk/evaluate', payload);
      return response.data;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Risk evaluation failed');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { evaluate, loading, error };
}
