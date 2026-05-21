import { useEffect } from 'react';
import { useSessionStore } from '@/store/sessionStore';

export function useSession() {
  const sessionId = useSessionStore((state) => state.sessionId);
  const setSessionId = useSessionStore((state) => state.setSessionId);

  useEffect(() => {
    if (!sessionId) {
      setSessionId(`sess_${Math.random().toString(36).slice(2, 8)}`);
    }
  }, [sessionId, setSessionId]);

  return { sessionId };
}
