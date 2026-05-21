export function mapRiskToAction(score: number) {
  if (score <= 30) {
    return { risk_level: 'LOW', action: 'ALLOW' };
  }
  if (score <= 60) {
    return { risk_level: 'MEDIUM', action: 'WARNING' };
  }
  if (score <= 80) {
    return { risk_level: 'HIGH', action: 'STEP_UP' };
  }
  return { risk_level: 'CRITICAL', action: 'BLOCK' };
}
