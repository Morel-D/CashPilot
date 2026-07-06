import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import type { RegisterStep1, RegisterStep2 } from '../AuthTypes';
import { authApi } from '../api/Authapi';
import { toastError, toastFromResponse } from '../../../utils/widgets/toast/Toaststore';

export function useRegister() {
  const [loading, setLoading]              = useState(false);
  const { setAccessToken, setUser, clearAuth } = useAuthStore();
  const navigate                           = useNavigate();

  async function register(step1: RegisterStep1, step2: RegisterStep2) {
    setLoading(true);
    try {
      // 1 — Register → get accessToken
      const res  = await authApi.register({ ...step1, ...step2 });
      const data = res.data;

      if (!data.success || !data.data?.accessToken) {
        toastFromResponse({ success: false, message: data.message, timestamp: data.timestamp });
        return;
      }

      // 2 — Store accessToken
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
      toastError(e.message ?? 'Registration failed.', e.correlationId);
      clearAuth();
    } finally {
      setLoading(false);
    }
  }

  return { register, loading };
}