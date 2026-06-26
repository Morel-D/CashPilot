import axios, {
  type AxiosResponse,
  type InternalAxiosRequestConfig,
} from "axios";
import { useAuthStore } from "../modules/auth/store/authStore";

// ─── API Response shape ───────────────────────────────────────────────────────

export interface ApiResponse<T = unknown> {
  success:   boolean;
  data:      T | null;
  message:   string;
  errors:    string[] | null;
  timestamp: string;
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

function getStore() {
  return useAuthStore.getState();
}

function extractCorrelationId(response?: {
  headers?: Record<string, string>;
  data?:    { correlationId?: string };
}): string | undefined {
  if (!response) return undefined;
  return (
    response.headers?.["x-correlation-id"] ??
    response.headers?.["X-Correlation-Id"] ??
    response.data?.correlationId
  );
}

// ─── Axios instance ───────────────────────────────────────────────────────────

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL ?? "http://localhost:8080",
  headers: { "Content-Type": "application/json" },
  timeout: 60_000,
});

// ─── Dev logger — comment/uncomment the block below to toggle ─────────────────
/*
apiClient.interceptors.request.use((config) => {
  console.group(`[API] ▶ ${config.method?.toUpperCase()} ${config.url}`);
  if (config.params) console.log('Params  :', config.params);
  if (config.data)   console.log('Body    :', typeof config.data === 'string' ? JSON.parse(config.data) : config.data);
  console.log('Headers :', config.headers);
  console.groupEnd();
  return config;
});

apiClient.interceptors.response.use(
  (response) => {
    console.group(`[API] ✅ ${response.status} ${response.config.method?.toUpperCase()} ${response.config.url}`);
    console.log('Data    :', response.data);
    console.groupEnd();
    return response;
  },
  (err) => {
    console.group(`[API] ❌ ${err.response?.status ?? 'ERR'} ${err.config?.method?.toUpperCase()} ${err.config?.url}`);
    console.log('Message :', err.response?.data?.message ?? err.message);
    console.log('Response:', err.response?.data);
    console.groupEnd();
    return Promise.reject(err);
  }
);
*/
// ─────────────────────────────────────────────────────────────────────────────

// ─── Request interceptor — inject access token ────────────────────────────────

apiClient.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const { accessToken } = getStore();
  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }
  return config;
});

// ─── Response interceptor ─────────────────────────────────────────────────────

apiClient.interceptors.response.use(
  (response: AxiosResponse) => {
    const correlationId = extractCorrelationId(response.data);
    if (correlationId) {
      (response as any)._correlationId = correlationId;
    }
    return response;
  },
  (err) => {
    const isAuthEndpoint = err.config?.url?.includes("/api/auth/");
    const status         = err.response?.status as number | undefined;
    const message        = (err.response?.data as ApiResponse)?.message ?? err.message ?? "Unknown error";

    // 401 on a protected route → token invalid or expired → logout
    if (status === 401 && !isAuthEndpoint) {
      getStore().clearAuth();
      window.location.href = "/login";
    }

    const correlationId = extractCorrelationId(err.response);
    const error = new Error(message) as Error & { correlationId?: string };
    error.correlationId = correlationId;

    return Promise.reject(error);
  }
);

export default apiClient;