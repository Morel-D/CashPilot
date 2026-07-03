import { useState, useCallback } from 'react';
import { dashboardApi } from '../api/Dashboardapi';
import { toastError } from '../../../utils/widgets/toast/Toaststore';
import type { DashboardMetrics } from '../Dashboardtypes';

export function useDashboard() {
  const [metrics, setMetrics] = useState<DashboardMetrics | null>(null);
  const [loading, setLoading] = useState(false);

  const fetchMetrics = useCallback(async () => {
    setLoading(true);
    try {
      const res  = await dashboardApi.getMetrics();
      const body = res.data;
      if (body.success && body.data) {
        setMetrics(body.data);
        // No toast on success — metrics are background data
      } else {
        toastError(body.message);
      }
    } catch (err: unknown) {
      const e = err as Error & { correlationId?: string };
      toastError(e.message ?? 'Failed to load dashboard metrics.', e.correlationId);
    } finally {
      setLoading(false);
    }
  }, []);

  return { metrics, loading, fetchMetrics };
}