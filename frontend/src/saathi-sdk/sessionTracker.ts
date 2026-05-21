export function createSessionTracker() {
  const sessionId = `sess_${Math.random().toString(36).slice(2, 10)}`;
  const startedAt = Date.now();

  return {
    sessionId,
    startedAt,
    elapsed: () => Date.now() - startedAt
  };
}
