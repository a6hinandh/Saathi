import { create } from 'zustand';

interface SessionState {
  sessionId: string;
  setSessionId: (value: string) => void;
}

export const useSessionStore = create<SessionState>((set) => ({
  sessionId: 'sess_91ad',
  setSessionId: (value) => set({ sessionId: value })
}));
