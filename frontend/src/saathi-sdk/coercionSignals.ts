import type { BehaviorFeatures } from '@/lib/types';

export function inferCoercionSignals(features: BehaviorFeatures) {
  const scores = {
    hesitation: Math.min(1, (features.hesitation_delay ?? 0) / 30),
    edits: Math.min(1, features.amount_edit_count / 5),
    focus: Math.min(1, (features.focus_switch_count ?? 0) / 8),
    paste: Math.min(1, (features.paste_count ?? 0) / 2)
  };

  const composite = Number((scores.hesitation * 0.35 + scores.edits * 0.25 + scores.focus * 0.25 + scores.paste * 0.15).toFixed(2));

  return {
    score: composite,
    label: composite > 0.75 ? 'SCAM_GUIDED' : composite > 0.45 ? 'UNCERTAIN' : 'NORMAL'
  };
}
