import { create } from 'zustand';
import type { Page } from '../../../types/page';
import type { Transaction, TransactionType } from '../Transactiontypes';


interface TransactionState {
  page:       Page<Transaction> | null;
  loading:    boolean;
  error:      string | null;
  selected:   Transaction | null;        // for detail panel
  typeFilter: TransactionType | null;

  setPage:       (page: Page<Transaction>) => void;
  setLoading:    (v: boolean) => void;
  setError:      (e: string | null) => void;
  setSelected:   (t: Transaction | null) => void;
  setTypeFilter: (f: TransactionType | null) => void;
}

export const useTransactionStore = create<TransactionState>()((set) => ({
  page:       null,
  loading:    false,
  error:      null,
  selected:   null,
  typeFilter: null,

  setPage:       (page)       => set({ page }),
  setLoading:    (loading)    => set({ loading }),
  setError:      (error)      => set({ error }),
  setSelected:   (selected)   => set({ selected }),
  setTypeFilter: (typeFilter) => set({ typeFilter }),
}));