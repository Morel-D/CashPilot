import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { AuthUser } from "../AuthTypes";


interface AuthState {
  accessToken:  string | null;
  refreshToken: string | null;
  user:         AuthUser | null;

  // Actions
  setAuth:      (tokens: { accessToken: string; refreshToken: string }, user: AuthUser) => void;
  setAccessToken: (token: string) => void;
  clearAuth:    () => void;
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

      // Called silently by the refresh interceptor
      setAccessToken: (accessToken) =>
        set({ accessToken }),

      clearAuth: () =>
        set({ accessToken: null, refreshToken: null, user: null }),
    }),
    {
      name: "cashpilot_auth", // localStorage key
      // Only persist tokens + user — nothing transient
      partialize: (state) => ({
        accessToken:  state.accessToken,
        refreshToken: state.refreshToken,
        user:         state.user,
      }),
    }
  )
);