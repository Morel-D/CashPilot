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

// ─── Request interceptor — inject access token ────────────────────────────────

apiClient.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const { accessToken } = getStore();
  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }
  return config;
});

// ─── Refresh logic ────────────────────────────────────────────────────────────

let isRefreshing        = false;
let refreshQueue: Array<(token: string) => void> = [];

function processQueue(newToken: string) {
  refreshQueue.forEach((resolve) => resolve(newToken));
  refreshQueue = [];
}

async function silentRefresh(): Promise<string> {
  const { refreshToken, setAccessToken, clearAuth } = getStore();

  if (!refreshToken) {
    clearAuth();
    window.location.href = "/login";
    return Promise.reject(new Error("NO_REFRESH_TOKEN"));
  }

  try {
    const res = await axios.post<ApiResponse<{ accessToken: string }>>(
      `${import.meta.env.VITE_API_BASE_URL ?? "http://localhost:8080"}/api/auth/refresh`,
      { refreshToken }
    );

    const newAccessToken = res.data.data?.accessToken;

    if (!res.data.success || !newAccessToken) {
      throw new Error(res.data.message ?? "REFRESH_FAILED");
    }

    setAccessToken(newAccessToken);
    return newAccessToken;
  } catch {
    clearAuth();
    window.location.href = "/login";
    return Promise.reject(new Error("REFRESH_FAILED"));
  }
}

// ─── Response interceptor ─────────────────────────────────────────────────────

apiClient.interceptors.response.use(
  (response: AxiosResponse) => {
    const correlationId = extractCorrelationId(response.data);
    if (correlationId) {
      (response as any)._correlationId = correlationId;
    }
    return response;
  },
  async (err) => {
    const originalRequest = err.config as InternalAxiosRequestConfig & {
      _retry?: boolean;
    };

    const isAuthEndpoint = originalRequest?.url?.includes("/api/auth/");
    const status         = err.response?.status as number | undefined;
    const message        = (err.response?.data as ApiResponse)?.message ?? err.message ?? "Unknown error";

    // ── 401 on a protected route → try silent refresh ──────────────────────
    if (status === 401 && !isAuthEndpoint && !originalRequest._retry) {
      if (isRefreshing) {
        // Queue the request until the ongoing refresh finishes
        return new Promise((resolve) => {
          refreshQueue.push((token: string) => {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            resolve(apiClient(originalRequest));
          });
        });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const newToken = await silentRefresh();
        processQueue(newToken);
        originalRequest.headers.Authorization = `Bearer ${newToken}`;
        return apiClient(originalRequest);
      } finally {
        isRefreshing = false;
      }
    }

    // ── Refresh token itself is expired ────────────────────────────────────
    if (
      message === "REFRESH_TOKEN_EXPIRED" ||
      message === "token_error"
    ) {
      getStore().clearAuth();
      window.location.href = "/login";
    }

    // ── Attach correlationId to the error ──────────────────────────────────
    const correlationId = extractCorrelationId(err.response);
    const error = new Error(message) as Error & { correlationId?: string };
    error.correlationId = correlationId;

    return Promise.reject(error);
  }
);

export default apiClient;