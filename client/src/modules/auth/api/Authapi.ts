
import apiClient from '../../../utils/Axios';
import type { AuthResponse, LoginRequest, MeResponse, RegisterRequest } from '../AuthTypes';


export const authApi = {
  register: (body: RegisterRequest) =>
    apiClient.post<AuthResponse>('/api/auth/register', body),

  login: (body: LoginRequest) =>
    apiClient.post<AuthResponse>('/api/auth/login', body),

  // GET — uses Authorization header (accessToken injected by interceptor)
  me: () =>
    apiClient.get<MeResponse>('/api/auth/refresh'),
};