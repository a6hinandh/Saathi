import type { BehaviorFeatures } from '@/lib/types';

export interface SaathiTracker {
  start: () => void;
  stop: () => void;
  recordAmountEdit: () => void;
  recordFocusSwitch: () => void;
  recordPaste: () => void;
  snapshot: () => BehaviorFeatures;
}

export function createEventCapture(): SaathiTracker {
  let isRunning = false;
  let startedAt = Date.now();
  let lastActiveTime = Date.now();

  const keyIntervals: number[] = [];
  let lastKeyTime = 0;
  let backspaceCount = 0;
  let totalKeystrokes = 0;

  // Mouse speed tracking variables
  let lastX = 0;
  let lastY = 0;
  let lastMouseTime = 0;
  const mouseSpeedSamples: number[] = [];

  let amountEditCount = 0;
  let focusSwitchCount = 0;
  let pasteCount = 0;
  let maxHesitationDelay = 0;

  // Event handlers
  const handleKeyDown = (e: KeyboardEvent) => {
    if (!isRunning) return;
    totalKeystrokes++;
    lastActiveTime = Date.now();

    if (e.key === 'Backspace') {
      backspaceCount++;
    }

    const now = Date.now();
    if (lastKeyTime > 0) {
      const interval = now - lastKeyTime;
      // Filter out long pauses (e.g. > 3 seconds) as hesitation instead of raw typing speed
      if (interval < 3000) {
        keyIntervals.push(interval);
      } else {
        const pause = interval / 1000;
        if (pause > maxHesitationDelay) {
          maxHesitationDelay = pause;
        }
      }
    }
    lastKeyTime = now;
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (!isRunning) return;
    const now = Date.now();
    lastActiveTime = now;

    if (lastMouseTime > 0) {
      const dt = now - lastMouseTime;
      if (dt > 10) {
        const dx = e.clientX - lastX;
        const dy = e.clientY - lastY;
        const dist = Math.sqrt(dx * dx + dy * dy);
        const speed = (dist / dt) * 1000; // pixels per second
        mouseSpeedSamples.push(speed);
        // keep last 50 samples
        if (mouseSpeedSamples.length > 50) {
          mouseSpeedSamples.shift();
        }
      }
    }
    lastX = e.clientX;
    lastY = e.clientY;
    lastMouseTime = now;
  };

  const handlePaste = () => {
    if (!isRunning) return;
    pasteCount++;
    lastActiveTime = Date.now();
  };

  const handleFocus = (e: FocusEvent) => {
    if (!isRunning) return;
    const target = e.target as HTMLElement;
    if (target && ['INPUT', 'SELECT', 'TEXTAREA'].includes(target.tagName)) {
      focusSwitchCount++;
      lastActiveTime = Date.now();
    }
  };

  const handleInput = (e: Event) => {
    if (!isRunning) return;
    const target = e.target as HTMLInputElement;
    if (target && target.tagName === 'INPUT' && (target.placeholder === '18500' || target.name === 'amount' || target.id === 'amount' || target.getAttribute('placeholder')?.includes('18500'))) {
      amountEditCount++;
    }
  };

  return {
    start() {
      if (isRunning) return;
      isRunning = true;
      startedAt = Date.now();
      lastActiveTime = Date.now();
      lastKeyTime = 0;
      lastMouseTime = 0;

      // Add global listeners with capture phase to ensure coverage
      window.addEventListener('keydown', handleKeyDown, true);
      window.addEventListener('mousemove', handleMouseMove, true);
      window.addEventListener('paste', handlePaste, true);
      window.addEventListener('focus', handleFocus, true);
      window.addEventListener('input', handleInput, true);
    },
    stop() {
      if (!isRunning) return;
      isRunning = false;
      window.removeEventListener('keydown', handleKeyDown, true);
      window.removeEventListener('mousemove', handleMouseMove, true);
      window.removeEventListener('paste', handlePaste, true);
      window.removeEventListener('focus', handleFocus, true);
      window.removeEventListener('input', handleInput, true);
    },
    recordAmountEdit() {
      amountEditCount++;
    },
    recordFocusSwitch() {
      focusSwitchCount++;
    },
    recordPaste() {
      pasteCount++;
    },
    snapshot(): BehaviorFeatures {
      // Calculate averages and stats
      const avgKeyInterval = keyIntervals.length > 0
        ? Math.round(keyIntervals.reduce((sum, val) => sum + val, 0) / keyIntervals.length)
        : 0;

      // Calculate variance
      let typingVariance = 0;
      if (keyIntervals.length > 0) {
        const mean = avgKeyInterval;
        const sumSq = keyIntervals.reduce((sum, val) => sum + (val - mean) ** 2, 0);
        typingVariance = Math.round(sumSq / keyIntervals.length);
      }

      const backspaceRate = totalKeystrokes > 0
        ? Number((backspaceCount / totalKeystrokes).toFixed(2))
        : 0;

      const avgMouseSpeed = mouseSpeedSamples.length > 0
        ? Math.round(mouseSpeedSamples.reduce((sum, val) => sum + val, 0) / mouseSpeedSamples.length)
        : 950; // baseline default

      // Confirmation delay = elapsed seconds since tracking began
      const confirmationDelay = Math.round((Date.now() - startedAt) / 1000);

      // Hesitation delay: either the longest period of inactivity or confirmation delay fraction
      const timeSinceLastAction = (Date.now() - lastActiveTime) / 1000;
      const hesitationDelay = Math.max(maxHesitationDelay, timeSinceLastAction, confirmationDelay / 3);

      return {
        avg_key_interval: avgKeyInterval,
        typing_variance: typingVariance,
        backspace_rate: backspaceRate,
        mouse_speed: avgMouseSpeed,
        confirmation_delay: confirmationDelay,
        amount_edit_count: amountEditCount,
        focus_switch_count: focusSwitchCount,
        paste_count: pasteCount,
        hesitation_delay: Number(hesitationDelay.toFixed(1))
      };
    }
  };
}
