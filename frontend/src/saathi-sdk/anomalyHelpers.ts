export function normalizeInterval(value: number) {
  return Math.max(0, Math.min(1000, value));
}

export function calculateVariance(values: number[]) {
  if (values.length === 0) return 0;
  const mean = values.reduce((sum, current) => sum + current, 0) / values.length;
  return values.reduce((sum, current) => sum + (current - mean) ** 2, 0) / values.length;
}
