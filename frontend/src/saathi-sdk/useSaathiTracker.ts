'use client';

import { useEffect, useRef, useCallback } from 'react';
import { createEventCapture } from './eventCapture';
import type { SaathiTracker } from './eventCapture';
import type { BehaviorFeatures } from '@/lib/types';

export function useSaathiTracker() {
  const trackerRef = useRef<SaathiTracker | null>(null);

  useEffect(() => {
    const tracker = createEventCapture();
    trackerRef.current = tracker;
    tracker.start();

    return () => {
      tracker.stop();
    };
  }, []);

  const getSnapshot = useCallback((): BehaviorFeatures => {
    if (trackerRef.current) {
      return trackerRef.current.snapshot();
    }
    return {
      avg_key_interval: 0,
      typing_variance: 0,
      backspace_rate: 0,
      mouse_speed: 950,
      confirmation_delay: 0,
      amount_edit_count: 0,
      focus_switch_count: 0,
      paste_count: 0,
      hesitation_delay: 0
    };
  }, []);

  const recordAmountEdit = useCallback(() => {
    trackerRef.current?.recordAmountEdit();
  }, []);

  const recordFocusSwitch = useCallback(() => {
    trackerRef.current?.recordFocusSwitch();
  }, []);

  const recordPaste = useCallback(() => {
    trackerRef.current?.recordPaste();
  }, []);

  return {
    getSnapshot,
    recordAmountEdit,
    recordFocusSwitch,
    recordPaste
  };
}
