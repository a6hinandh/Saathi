import { create } from 'zustand';

interface AuthState {
  customerId: string;
  loggedIn: boolean;
  setCustomerId: (value: string) => void;
  setLoggedIn: (value: boolean) => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  customerId: 'CUST-10021',
  loggedIn: true,
  setCustomerId: (value) => set({ customerId: value }),
  setLoggedIn: (value) => set({ loggedIn: value })
}));
