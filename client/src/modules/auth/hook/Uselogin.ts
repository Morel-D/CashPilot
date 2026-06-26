import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import type { LoginRequest } from '../AuthTypes';
import { toastError, toastFromResponse } from '../../../utils/widgets/toast/Toaststore';
import { authApi } from '../api/Authapi';

export function useLogin() {
  const [loading, setLoading]       = useState(false);
  const { setAccessToken, setUser, clearAuth } = useAuthStore();
  const navigate                    = useNavigate();

  async function login(body: LoginRequest) {
    setLoading(true);
    try {
      // 1 — Login → get accessToken
      const res  = await authApi.login(body);
      const data = res.data;

      if (!data.success || !data.data?.accessToken) {
        toastFromResponse({ success: false, message: data.message, timestamp: data.timestamp });
        return;
      }

      // 2 — Store accessToken (interceptor will attach it to next request)
      setAccessToken(data.data.accessToken);

      // 3 — Fetch user info via GET /api/auth/refresh
      const meRes  = await authApi.me();
      const meData = meRes.data;

      if (!meData.success || !meData.data) {
        toastFromResponse({ success: false, message: meData.message, timestamp: meData.timestamp });
        clearAuth();
        return;
      }

      setUser(meData.data);
      toastFromResponse({ success: true, message: data.message, timestamp: data.timestamp });
      navigate('/');

    } catch (err: unknown) {
      const e = err as Error & { correlationId?: string };
      toastError(e.message ?? 'Login failed.', e.correlationId);
      clearAuth();
    } finally {
      setLoading(false);
    }
  }

  return { login, loading };
}