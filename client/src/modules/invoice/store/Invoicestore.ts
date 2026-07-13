import { create } from 'zustand';
import type { Invoice, InvoiceStatus } from '../Invoicetypes';
import type { Page } from '../../../types/page';

type ModalMode = 'create' | 'edit' | 'view' | 'delete' | 'pay' | null;
 
interface InvoiceState {
  page:      Page<Invoice> | null;
  loading:   boolean;
  error:     string | null;
  selected:  Invoice | null;
  modal:     ModalMode;
 
  // Active filters
  statusFilter:  InvoiceStatus | null;
  searchQuery:   string;
 
  // Actions
  setPage:          (page: Page<Invoice>) => void;
  setLoading:       (v: boolean) => void;
  setError:         (e: string | null) => void;
  setSelected:      (i: Invoice | null) => void;
  setStatusFilter:  (s: InvoiceStatus | null) => void;
  setSearchQuery:   (q: string) => void;
  openModal:        (mode: ModalMode, invoice?: Invoice) => void;
  closeModal:       () => void;
 
  // Optimistic updates
  addInvoice:       (i: Invoice) => void;
  updateInvoice:    (i: Invoice) => void;
  removeInvoice:    (id: number) => void;
}
 
export const useInvoiceStore = create<InvoiceState>()((set) => ({
  page:         null,
  loading:      false,
  error:        null,
  selected:     null,
  modal:        null,
  statusFilter:  null,
  searchQuery:   '',
 
  setPage:         (page)         => set({ page }),
  setLoading:      (loading)      => set({ loading }),
  setError:        (error)        => set({ error }),
  setSelected:     (selected)     => set({ selected }),
  setStatusFilter: (statusFilter) => set({ statusFilter }),
  setSearchQuery:  (searchQuery)  => set({ searchQuery }),
 
  openModal: (modal, invoice) =>
    set({ modal, selected: invoice ?? null }),
 
  closeModal: () => set({ modal: null, selected: null }),
 
  addInvoice: (i) =>
    set((s) => {
      if (!s.page) return {};
      return {
        page: {
          ...s.page,
          content:       [i, ...s.page.content],
          totalElements: s.page.totalElements + 1,
        },
      };
    }),
 
  updateInvoice: (i) =>
    set((s) => {
      if (!s.page) return {};
      // Also update selected if it's the same invoice (e.g. view modal open)
      return {
        page: {
          ...s.page,
          content: s.page.content.map((x) => (x.id === i.id ? i : x)),
        },
        selected: s.selected?.id === i.id ? i : s.selected,
      };
    }),
 
  removeInvoice: (id) =>
    set((s) => {
      if (!s.page) return {};
      return {
        page: {
          ...s.page,
          content:       s.page.content.filter((x) => x.id !== id),
          totalElements: s.page.totalElements - 1,
        },
      };
    }),
}));