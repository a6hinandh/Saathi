'use client';

import { useEffect, useRef } from 'react';
import { createTracker } from '@/saathi-sdk';
import type { BehaviorFeatures } from '@/lib/types';

export function useBehaviorTracking(onUpdate?: (features: BehaviorFeatures) => void) {
  const trackerRef = useRef<ReturnType<typeof createTracker> | null>(null);

  useEffect(() => {
    trackerRef.current = createTracker();
    const tracker = trackerRef.current;
    tracker.start();

    const interval = window.setInterval(() => {
      const features = tracker.snapshot();
      onUpdate?.(features);
    }, 1500);

    return () => {
      window.clearInterval(interval);
      tracker.stop();
    };
  }, [onUpdate]);
}
