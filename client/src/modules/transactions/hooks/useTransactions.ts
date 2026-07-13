import { useCallback } from 'react';
import { transactionApi } from '../api/Transactionapi';
import { useTransactionStore } from '../store/Transactionstore';
import { toastError } from '../../../utils/widgets/toast/Toaststore';
import type { TransactionPageParams, TransactionType } from '../Transactiontypes';

export function useTransactions() {
  const {
    page, loading, error, selected, typeFilter,
    setPage, setLoading, setError, setSelected, setTypeFilter,
  } = useTransactionStore();
 
  const fetchTransactions = useCallback(async (params: TransactionPageParams = {}) => {
    setLoading(true);
    setError(null);
    try {
      const res = params.type
        ? await transactionApi.getByType(params.type, params)
        : await transactionApi.getAll(params);
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
 
  function selectTransaction(t: ReturnType<typeof useTransactionStore.getState>['selected']) {
    setSelected(t);
  }
 
  function changeTypeFilter(f: TransactionType | null) {
    setTypeFilter(f);
    setSelected(null);
  }
 
  return {
    page, loading, error, selected, typeFilter,
    fetchTransactions,
    selectTransaction,
    changeTypeFilter,
  };
}