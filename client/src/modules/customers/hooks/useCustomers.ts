import { useCallback } from 'react';
import type { CreateCustomerRequest, UpdateCustomerRequest, CustomerPageParams } from '../Customertypes';
import { useCustomerStore } from '../store/Customerstore';
import { customerApi } from '../api/Customerapi';
import { toastError, toastFromResponse } from '../../../utils/widgets/toast/Toaststore';

export function useCustomers() {
  const {
    page, loading, error, selected, modal,
    setPage, setLoading, setError,
    openModal, closeModal,
    addCustomer, updateCustomer, removeCustomer,
  } = useCustomerStore();

  // ── Fetch page ─────────────────────────────────────────────────────────────

  const fetchCustomers = useCallback(async (params: CustomerPageParams = {}) => {
    setLoading(true);
    setError(null);
    try {
      const res  = await customerApi.getAll(params);
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

  const createCustomer = useCallback(async (data: CreateCustomerRequest): Promise<boolean> => {
    try {
      const res  = await customerApi.create(data);
      const body = res.data;
      toastFromResponse({ success: body.success, message: body.message, timestamp: body.timestamp });
      if (body.success && body.data) {
        addCustomer(body.data);
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

  // ── Update ─────────────────────────────────────────────────────────────────

  const editCustomer = useCallback(async (id: number, data: UpdateCustomerRequest): Promise<boolean> => {
    try {
      const res  = await customerApi.update(id, data);
      const body = res.data;
      toastFromResponse({ success: body.success, message: body.message, timestamp: body.timestamp });
      if (body.success && body.data) {
        updateCustomer(body.data);
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

  const deleteCustomer = useCallback(async (id: number): Promise<boolean> => {
    try {
      const res  = await customerApi.delete(id);
      const body = res.data;
      toastFromResponse({ success: body.success, message: body.message, timestamp: body.timestamp });
      if (body.success) {
        removeCustomer(id);
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

  return {
    // state
    page, loading, error, selected, modal,
    // actions
    fetchCustomers,
    createCustomer,
    editCustomer,
    deleteCustomer,
    openModal,
    closeModal,
  };
}