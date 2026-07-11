import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { useAuthStore } from "../modules/auth/store/authStore";
import { authApi } from "../modules/auth/api/Authapi";
import { Loader } from "../components/ui/Loader";


export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { accessToken, user, setUser, clearAuth } = useAuthStore();

  // On page reload: accessToken is in memory from localStorage,
  // but user is null (memory only) — need to rehydrate
  const [checking, setChecking] = useState(!!accessToken && !user);

  useEffect(() => {
    if (!accessToken || user) return;

    // Token exists but no user in memory → validate token + fetch user
    authApi.me()
      .then((res) => {
        const body = res.data;
        if (body.success && body.data) {
          setUser(body.data);
        } else {
          clearAuth();
        }
      })
      .catch(() => clearAuth())
      .finally(() => setChecking(false));
    // Intentionally run once on mount only, to rehydrate the session from
  // the in-memory token. Re-running on accessToken/user change would
  // cause an infinite loop since setUser mutates `user` itself.
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // No token at all → login
  if (!accessToken) return <Navigate to="/login" replace />;

  // Token exists, waiting for user rehydration
  if (checking) return <Loader fullScreen />;

  return <>{children}</>;
}