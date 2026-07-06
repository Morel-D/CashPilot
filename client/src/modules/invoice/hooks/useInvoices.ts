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
    page, loading, error, selected, modal, statusFilter,
    setPage, setLoading, setError,
    setStatusFilter, openModal, closeModal,
    addInvoice, updateInvoice, removeInvoice,
  } = useInvoiceStore();

  // ── Fetch ──────────────────────────────────────────────────────────────────

  const fetchInvoices = useCallback(async (params: InvoicePageParams = {}) => {
    setLoading(true);
    setError(null);
    try {
      const res  = await invoiceApi.getAll(params);
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
    data: Pick<PayInvoiceRequest, 'paidAmount' | 'paymentMethod'>
  ): Promise<boolean> => {
    try {
      console.log("Pay Invoice id --> ", id);
      console.log("Pay Invoice info --> ", data);
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
    page, loading, error, selected, modal, statusFilter,
    setStatusFilter,
    // actions
    fetchInvoices,
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