import { create } from "zustand";
import { persist } from "zustand/middleware";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface AuthUser {
  email:     string;
  fullName:  string;
  companyId: number;
}

interface AuthState {
  accessToken:    string | null;
  refreshToken:   string | null;
  user:           AuthUser | null;

  setAuth:        (tokens: { accessToken: string; refreshToken: string }, user: AuthUser) => void;
  setAccessToken: (token: string) => void;
  clearAuth:      () => void;
}

// ─── Store ────────────────────────────────────────────────────────────────────

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      accessToken:  null,
      refreshToken: null,
      user:         null,

      setAuth: ({ accessToken, refreshToken }, user) =>
        set({ accessToken, refreshToken, user }),

      setAccessToken: (accessToken) =>
        set({ accessToken }),

      clearAuth: () =>
        set({ accessToken: null, refreshToken: null, user: null }),
    }),
    {
      name: "cashpilot_auth",
      partialize: (state) => ({
        accessToken:  state.accessToken,
        refreshToken: state.refreshToken,
        user:         state.user,
      }),
    }
  )
);