import apiClient from '../../../utils/Axios';
import type {
  LoginRequest,
  RegisterRequest,
  RefreshRequest,
  AuthResponse,
  RefreshResponse,
} from '../AuthTypes';

export const authApi = {
  register: (body: RegisterRequest) =>
    apiClient.post<AuthResponse>('/api/auth/register', body),

  login: (body: LoginRequest) =>
    apiClient.post<AuthResponse>('/api/auth/login', body),

  refresh: (body: RefreshRequest) =>
    apiClient.post<RefreshResponse>('/api/auth/refresh', body),
};