import type { ApiResponse } from '../../utils/Axios';

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

export interface RefreshRequest {
  refreshToken: string;
}

// ─── Auth data payload (inside ApiResponse.data) ──────────────────────────────

export interface AuthData {
  accessToken:  string;
  refreshToken: string;
  email:        string;
  companyId:    number;
  fullName:     string;
}

// ─── Full typed API responses ─────────────────────────────────────────────────

export type AuthResponse    = ApiResponse<AuthData>;
export type RefreshResponse = ApiResponse<{ accessToken: string }>;

// ─── Register form — split into 2 steps ──────────────────────────────────────

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