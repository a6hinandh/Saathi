import type { BehaviorFeatures } from '@/lib/types';
import { createEventCapture } from './eventCapture';

export function extractBehaviorFeatures(): BehaviorFeatures {
  return createEventCapture().snapshot();
}
