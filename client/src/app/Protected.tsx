import { Navigate } from "react-router-dom";
import { useAuthStore } from "../modules/auth/store/authStore";


export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { accessToken, user } = useAuthStore();

  // No token at all → send to login
  if (!accessToken) return <Navigate to="/login" replace />;

  // Token present but user not hydrated yet (edge case on first paint)
  // Zustand's persist middleware is synchronous, so this is almost never hit —
  // but it's a safe guard in case the store hasn't rehydrated yet.
  if (!user) return <Navigate to="/login" replace />;

  return <>{children}</>;
}