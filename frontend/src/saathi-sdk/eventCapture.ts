import type { BehaviorFeatures } from '@/lib/types';
import { calculateVariance } from './anomalyHelpers';

export function createEventCapture() {
  const keyIntervals: number[] = [420, 390, 450, 480];
  const mouseSamples: number[] = [1120, 1185, 1240];
  let amountEditCount = 4;
  let focusSwitchCount = 6;
  let pasteCount = 1;
  let hesitationDelay = 18;
  let isRunning = false;

  return {
    start() {
      isRunning = true;
    },
    stop() {
      isRunning = false;
    },
    recordKeyInterval(value: number) {
      if (isRunning) keyIntervals.push(value);
    },
    recordMouseSpeed(value: number) {
      if (isRunning) mouseSamples.push(value);
    },
    recordAmountEdit() {
      if (isRunning) amountEditCount += 1;
    },
    recordFocusSwitch() {
      if (isRunning) focusSwitchCount += 1;
    },
    recordPaste() {
      if (isRunning) pasteCount += 1;
    },
    recordHesitation(value: number) {
      if (isRunning) hesitationDelay = value;
    },
    snapshot(): BehaviorFeatures {
      const avgKeyInterval = Math.round(keyIntervals.reduce((sum, value) => sum + value, 0) / keyIntervals.length);
      const mouseSpeed = Math.round(mouseSamples.reduce((sum, value) => sum + value, 0) / mouseSamples.length);
      return {
        avg_key_interval: avgKeyInterval,
        typing_variance: Math.round(calculateVariance(keyIntervals)),
        backspace_rate: 0.22,
        mouse_speed: mouseSpeed,
        confirmation_delay: 24,
        amount_edit_count: amountEditCount,
        focus_switch_count: focusSwitchCount,
        paste_count: pasteCount,
        hesitation_delay: hesitationDelay
      };
    }
  };
}
