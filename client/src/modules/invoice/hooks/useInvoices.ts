import { useCallback } from 'react';
import { invoiceApi } from '../api/Invoiceapi';
import { useInvoiceStore } from '../store/Invoicestore';
import { toastFromResponse, toastError } from '../../../utils/widgets/toast/Toaststore';
import type {
  CreateInvoiceRequest,
  UpdateInvoiceRequest,
  PayInvoiceRequest,
  InvoicePageParams,
} from '../Invoicetypes';
 
export function useInvoices() {
  const {
    page, loading, error, selected, modal, statusFilter, searchQuery,
    setPage, setLoading, setError,
    setStatusFilter, setSearchQuery, openModal, closeModal,
    addInvoice, updateInvoice, removeInvoice,
  } = useInvoiceStore();
 
  // ── Fetch ──────────────────────────────────────────────────────────────────
 
  const fetchInvoices = useCallback(async (params: InvoicePageParams = {}) => {
    setLoading(true);
    setError(null);
    try {
      // Route to the correct endpoint based on whether a status filter is active
      const res = params.status
        ? await invoiceApi.getByStatus(params.status, params)
        : await invoiceApi.getAll(params);
      const body = res.data;
      if (body.success && body.data) {
        setPage(body.data);
      } else {
        setError(body.message);
        toastFromResponse({ success: false, message: body.message, timestamp: body.timestamp });
      }
    } catch (err: unknown) {
      const e = err as Error & { correlationId?: string };
      setError(e.message);
      toastError(e.message, e.correlationId);
    } finally {
      setLoading(false);
    }
  }, []);
 
  // ── Search by title or customer name ───────────────────────────────────────
 
  const searchInvoices = useCallback(async (query: string, params: InvoicePageParams = {}): Promise<void> => {
    setLoading(true);
    setError(null);
    try {
      const res  = await invoiceApi.search(query, params);
      const body = res.data;
      if (body.success && body.data) {
        setPage(body.data);
      } else {
        setError(body.message);
        toastFromResponse({ success: false, message: body.message, timestamp: body.timestamp });
      }
    } catch (err: unknown) {
      const e = err as Error & { correlationId?: string };
      setError(e.message);
      toastError(e.message, e.correlationId);
    } finally {
      setLoading(false);
    }
  }, []);
 
  // ── Create ─────────────────────────────────────────────────────────────────
 
  const createInvoice = useCallback(async (data: CreateInvoiceRequest): Promise<boolean> => {
    try {
      const res  = await invoiceApi.create(data);
      const body = res.data;
      toastFromResponse({ success: body.success, message: body.message, timestamp: body.timestamp });
      if (body.success && body.data) {
        addInvoice(body.data);
        closeModal();
        return true;
      }
      return false;
    } catch (err: unknown) {
      const e = err as Error & { correlationId?: string };
      toastError(e.message, e.correlationId);
      return false;
    }
  }, []);
 
  // ── Edit ───────────────────────────────────────────────────────────────────
 
  const editInvoice = useCallback(async (id: number, data: UpdateInvoiceRequest): Promise<boolean> => {
    try {
      const res  = await invoiceApi.update(id, data);
      const body = res.data;
      toastFromResponse({ success: body.success, message: body.message, timestamp: body.timestamp });
      if (body.success && body.data) {
        updateInvoice(body.data);
        closeModal();
        return true;
      }
      return false;
    } catch (err: unknown) {
      const e = err as Error & { correlationId?: string };
      toastError(e.message, e.correlationId);
      return false;
    }
  }, []);
 
  // ── Delete ─────────────────────────────────────────────────────────────────
 
  const deleteInvoice = useCallback(async (id: number): Promise<boolean> => {
    try {
      const res  = await invoiceApi.delete(id);
      const body = res.data;
      toastFromResponse({ success: body.success, message: body.message, timestamp: body.timestamp });
      if (body.success) {
        removeInvoice(id);
        closeModal();
        return true;
      }
      return false;
    } catch (err: unknown) {
      const e = err as Error & { correlationId?: string };
      toastError(e.message, e.correlationId);
      return false;
    }
  }, []);
 
  // ── Issue (DRAFT → ISSUED) ─────────────────────────────────────────────────
 
  const issueInvoice = useCallback(async (id: number): Promise<boolean> => {
    try {
      const res  = await invoiceApi.issue(id);
      const body = res.data;
      toastFromResponse({ success: body.success, message: body.message, timestamp: body.timestamp });
      if (body.success && body.data) { updateInvoice(body.data); return true; }
      return false;
    } catch (err: unknown) {
      const e = err as Error & { correlationId?: string };
      toastError(e.message, e.correlationId);
      return false;
    }
  }, []);
 
  // ── Send (ISSUED → SENT) ───────────────────────────────────────────────────
 
  const sendInvoice = useCallback(async (id: number): Promise<boolean> => {
    try {
      const res  = await invoiceApi.send(id);
      const body = res.data;
      toastFromResponse({ success: body.success, message: body.message, timestamp: body.timestamp });
      if (body.success && body.data) { updateInvoice(body.data); return true; }
      return false;
    } catch (err: unknown) {
      const e = err as Error & { correlationId?: string };
      toastError(e.message, e.correlationId);
      return false;
    }
  }, []);
 
  // ── Pay ────────────────────────────────────────────────────────────────────
 
  const payInvoice = useCallback(async (
    id: number,
    data: PayInvoiceRequest
  ): Promise<boolean> => {
    try {
      const res  = await invoiceApi.pay(id, data);
      const body = res.data;
      toastFromResponse({ success: body.success, message: body.message, timestamp: body.timestamp });
      if (body.success && body.data) {
        updateInvoice(body.data);
        closeModal();
        return true;
      }
      return false;
    } catch (err: unknown) {
      const e = err as Error & { correlationId?: string };
      toastError(e.message, e.correlationId);
      return false;
    }
  }, []);
 
  // ── Cancel ─────────────────────────────────────────────────────────────────
 
  const cancelInvoice = useCallback(async (id: number): Promise<boolean> => {
    try {
      const res  = await invoiceApi.cancel(id);
      const body = res.data;
      toastFromResponse({ success: body.success, message: body.message, timestamp: body.timestamp });
      if (body.success && body.data) { updateInvoice(body.data); return true; }
      return false;
    } catch (err: unknown) {
      const e = err as Error & { correlationId?: string };
      toastError(e.message, e.correlationId);
      return false;
    }
  }, []);
 
  return {
    // state
    page, loading, error, selected, modal, statusFilter, searchQuery,
    setStatusFilter, setSearchQuery,
    // actions
    fetchInvoices,
    searchInvoices,
    createInvoice,
    editInvoice,
    deleteInvoice,
    issueInvoice,
    sendInvoice,
    payInvoice,
    cancelInvoice,
    openModal,
    closeModal,
  };
}