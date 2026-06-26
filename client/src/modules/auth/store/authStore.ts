import { create } from "zustand";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface AuthCompany {
  id:          number;
  uid:         number;
  name:        string;
  currency:    string;
  description: string | null;
  notice:      string | null;
  status:      string;
  dateOf:      string;
  updateOf:    string;
}

export interface AuthUser {
  email:    string;
  fullName: string;
  company:  AuthCompany;
}

interface AuthState {
  accessToken: string | null;
  user:        AuthUser | null;

  setAccessToken: (token: string) => void;
  setUser:        (user: AuthUser) => void;
  clearAuth:      () => void;
}

// ─── Constants ────────────────────────────────────────────────────────────────

const AT_KEY = 'cashpilot_at';

// ─── Store ────────────────────────────────────────────────────────────────────

export const useAuthStore = create<AuthState>()((set) => ({
  accessToken: localStorage.getItem(AT_KEY),
  user:        null,

  setAccessToken: (token) => {
    localStorage.setItem(AT_KEY, token);
    set({ accessToken: token });
  },

  setUser: (user) => set({ user }),

  clearAuth: () => {
    localStorage.removeItem(AT_KEY);
    set({ accessToken: null, user: null });
  },
}));