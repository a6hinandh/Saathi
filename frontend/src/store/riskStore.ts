import { create } from 'zustand';
import type { RiskEvaluationResponse } from '@/lib/types';

interface RiskState {
  latestRisk?: RiskEvaluationResponse;
  setLatestRisk: (value: RiskEvaluationResponse) => void;
}

export const useRiskStore = create<RiskState>((set) => ({
  latestRisk: undefined,
  setLatestRisk: (value) => set({ latestRisk: value })
}));
