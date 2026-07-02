import { useCallback } from 'react';
import { auditApi } from '../api/Auditapi';
import { useAuditStore } from '../store/Auditstore';
import { toastError } from '../../../utils/widgets/toast/Toaststore';
import type { AuditAction, AuditPageParams } from '../Audittypes';

export function useAudit() {
  const {
    page, loading, error, selected,
    actionFilter, entityTypeFilter, searchQuery,
    setPage, setLoading, setError, setSelected,
    setActionFilter, setEntityTypeFilter, setSearchQuery,
  } = useAuditStore();

  // ── List with filters ──────────────────────────────────────────────────────

  const fetchAuditLogs = useCallback(async (params: AuditPageParams = {}) => {
    setLoading(true);
    setError(null);
    try {
      const res  = await auditApi.getAll(params);
      const body = res.data;
      if (body.success && body.data) {
        setPage(body.data);
      } else {
        setError(body.message);
      }
    } catch (err: unknown) {
      const e = err as Error & { correlationId?: string };
      setError(e.message);
      toastError(e.message, e.correlationId);
    } finally {
      setLoading(false);
    }
  }, []);

  // ── Search ─────────────────────────────────────────────────────────────────

  const searchAuditLogs = useCallback(async (q: string, page = 0) => {
    setLoading(true);
    setError(null);
    try {
      const res  = await auditApi.search({ q, page, size: 25 });
      const body = res.data;
      if (body.success && body.data) {
        setPage(body.data);
      } else {
        setError(body.message);
      }
    } catch (err: unknown) {
      const e = err as Error & { correlationId?: string };
      setError(e.message);
      toastError(e.message, e.correlationId);
    } finally {
      setLoading(false);
    }
  }, []);

  // ── Detail ─────────────────────────────────────────────────────────────────

  const fetchAuditDetail = useCallback(async (id: number) => {
    try {
      const res  = await auditApi.getById(id);
      const body = res.data;
      if (body.success && body.data) {
        setSelected(body.data);
      }
    } catch (err: unknown) {
      const e = err as Error & { correlationId?: string };
      toastError(e.message, e.correlationId);
    }
  }, []);

  function changeActionFilter(f: AuditAction | null) {
    setActionFilter(f);
  }

  function changeEntityTypeFilter(f: string | null) {
    setEntityTypeFilter(f);
  }

  function changeSearchQuery(q: string) {
    setSearchQuery(q);
  }

  return {
    // state
    page, loading, error, selected,
    actionFilter, entityTypeFilter, searchQuery,
    // actions
    fetchAuditLogs,
    searchAuditLogs,
    fetchAuditDetail,
    changeActionFilter,
    changeEntityTypeFilter,
    changeSearchQuery,
    setSelected,
  };
}