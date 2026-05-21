import type { BehaviorFeatures } from '@/lib/types';

export interface SaathiTracker {
  start: () => void;
  stop: () => void;
  snapshot: () => BehaviorFeatures;
}

export interface CaptureEvent {
  type: 'typing' | 'mouse' | 'focus' | 'clipboard' | 'amount';
  timestamp: number;
  value?: number;
}
