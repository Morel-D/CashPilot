import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import type { RegisterStep1, RegisterStep2 } from '../AuthTypes';
import { authApi } from '../api/AuthTypes';
import { toastError, toastFromResponse } from '../../../utils/widgets/toast/Toaststore';

export function useRegister() {
  const [loading, setLoading] = useState(false);
  const { setAuth }           = useAuthStore();
  const navigate              = useNavigate();

  async function register(step1: RegisterStep1, step2: RegisterStep2) {
    setLoading(true);
    try {
      const res  = await authApi.register({ ...step1, ...step2 });
      const body = res.data;

      toastFromResponse({
        success:   body.success,
        message:   body.message,
        timestamp: body.timestamp,
      });

      if (body.success && body.data) {
        const { accessToken, refreshToken, email, companyId, fullName } = body.data;
        setAuth({ accessToken, refreshToken }, { email, companyId, fullName });
        navigate('/');
      }
    } catch (err: unknown) {
      const e = err as Error & { correlationId?: string };
      toastError(e.message ?? 'Registration failed.', e.correlationId);
    } finally {
      setLoading(false);
    }
  }

  return { register, loading };
}