import { useMemo } from 'react';
import { fraudAlerts } from '@/lib/constants';

export function useFraudSignals() {
  return useMemo(() => fraudAlerts, []);
}
