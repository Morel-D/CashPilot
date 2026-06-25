import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authApi } from '../api/AuthTypes';
import { useAuthStore } from '../store/authStore';
import { toastFromResponse, toastError } from '../../../utils/widgets/toast/Toaststore';
import type { LoginRequest } from '../AuthTypes';

export function useLogin() {
  const [loading, setLoading] = useState(false);
  const { setAuth }           = useAuthStore();
  const navigate              = useNavigate();

  async function login(body: LoginRequest) {
    setLoading(true);
    try {
      const res  = await authApi.login(body);
      const data = res.data;

      toastFromResponse({
        success:   data.success,
        message:   data.message,
        timestamp: data.timestamp,
      });

      if (data.success && data.data) {
        const { accessToken, refreshToken, email, companyId, fullName } = data.data;
        setAuth({ accessToken, refreshToken }, { email, companyId, fullName });
        navigate('/');
      }
    } catch (err: unknown) {
      const e = err as Error & { correlationId?: string };
      toastError(e.message ?? 'Login failed.', e.correlationId);
    } finally {
      setLoading(false);
    }
  }

  return { login, loading };
}