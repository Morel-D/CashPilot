import type { ApiResponse } from '../../utils/Axios';
import type { AuthUser, AuthCompany } from './store/authStore';

// ─── Re-export for convenience ────────────────────────────────────────────────

export type { AuthUser, AuthCompany };

// ─── Requests ─────────────────────────────────────────────────────────────────

export interface RegisterRequest {
  fullName:    string;
  email:       string;
  password:    string;
  phone:       string;
  companyName: string;
  currency:    string;
}

export interface LoginRequest {
  email:    string;
  password: string;
}

// ─── Response payloads ────────────────────────────────────────────────────────

export interface AuthTokenData {
  accessToken:  string;
  refreshToken: string;
}

// ─── Full typed API responses ─────────────────────────────────────────────────

export type AuthResponse    = ApiResponse<AuthTokenData>;
export type MeResponse      = ApiResponse<AuthUser>;

// ─── Register form steps ──────────────────────────────────────────────────────

export interface RegisterStep1 {
  fullName: string;
  email:    string;
  password: string;
  phone:    string;
}

export interface RegisterStep2 {
  companyName: string;
  currency:    string;
}