import { useState, useCallback } from 'react';
import { dashboardApi } from '../api/Dashboardapi';
import { toastError } from '../../../utils/widgets/toast/Toaststore';
import type { DashboardMetrics, PendingInvoice, RecentTransaction } from '../Dashboardtypes';

export function useDashboard() {
  const [metrics,              setMetrics]              = useState<DashboardMetrics | null>(null);
  const [recentTransactions,   setRecentTransactions]   = useState<RecentTransaction[]>([]);
  const [pendingInvoices,      setPendingInvoices]      = useState<PendingInvoice[]>([]);
  const [loadingMetrics,       setLoadingMetrics]       = useState(false);
  const [loadingTransactions,  setLoadingTransactions]  = useState(false);
  const [loadingInvoices,      setLoadingInvoices]      = useState(false);
 
  // Each fetcher is independent — one failing doesn't block the others
 
  const fetchMetrics = useCallback(async () => {
    setLoadingMetrics(true);
    try {
      const res  = await dashboardApi.getMetrics();
      const body = res.data;
      if (body.success && body.data) setMetrics(body.data);
      else toastError(body.message);
    } catch (err: unknown) {
      const e = err as Error & { correlationId?: string };
      toastError(e.message, e.correlationId);
    } finally {
      setLoadingMetrics(false);
    }
  }, []);
 
  const fetchRecentTransactions = useCallback(async () => {
    setLoadingTransactions(true);
    try {
      const res  = await dashboardApi.getRecentTransactions();
      const body = res.data;
      if (body.success && body.data) setRecentTransactions(body.data);
      else toastError(body.message);
    } catch (err: unknown) {
      const e = err as Error & { correlationId?: string };
      toastError(e.message, e.correlationId);
    } finally {
      setLoadingTransactions(false);
    }
  }, []);
 
  const fetchPendingInvoices = useCallback(async () => {
    setLoadingInvoices(true);
    try {
      const res  = await dashboardApi.getPendingInvoices();
      const body = res.data;
      if (body.success && body.data) setPendingInvoices(body.data);
      else toastError(body.message);
    } catch (err: unknown) {
      const e = err as Error & { correlationId?: string };
      toastError(e.message, e.correlationId);
    } finally {
      setLoadingInvoices(false);
    }
  }, []);
 
  // Fire all three in parallel
  const fetchAll = useCallback(() => {
    fetchMetrics();
    fetchRecentTransactions();
    fetchPendingInvoices();
  }, [fetchMetrics, fetchRecentTransactions, fetchPendingInvoices]);
 
  return {
    metrics,            loadingMetrics,
    recentTransactions, loadingTransactions,
    pendingInvoices,    loadingInvoices,
    fetchAll,
  };
}
 