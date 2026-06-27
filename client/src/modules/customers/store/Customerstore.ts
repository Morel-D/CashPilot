import { create } from 'zustand';
import type { Customer, Page } from '../Customertypes';

interface CustomerState {
  // List
  page:      Page<Customer> | null;
  loading:   boolean;
  error:     string | null;

  // Selected (for view / edit)
  selected:  Customer | null;

  // Modal state
  modal: 'create' | 'edit' | 'delete' | 'view' | null;

  // Actions
  setPage:     (page: Page<Customer>) => void;
  setLoading:  (v: boolean) => void;
  setError:    (e: string | null) => void;
  setSelected: (c: Customer | null) => void;
  openModal:   (mode: CustomerState['modal'], customer?: Customer) => void;
  closeModal:  () => void;

  // Optimistic updates
  addCustomer:    (c: Customer) => void;
  updateCustomer: (c: Customer) => void;
  removeCustomer: (id: number) => void;
}

export const useCustomerStore = create<CustomerState>()((set) => ({
  page:     null,
  loading:  false,
  error:    null,
  selected: null,
  modal:    null,

  setPage:     (page)    => set({ page }),
  setLoading:  (loading) => set({ loading }),
  setError:    (error)   => set({ error }),
  setSelected: (selected) => set({ selected }),

  openModal: (modal, customer = undefined) =>
    set({ modal, selected: customer ?? null }),

  closeModal: () => set({ modal: null, selected: null }),

  addCustomer: (c) =>
    set((s) => {
      if (!s.page) return {};
      return {
        page: {
          ...s.page,
          content:       [c, ...s.page.content],
          totalElements: s.page.totalElements + 1,
        },
      };
    }),

  updateCustomer: (c) =>
    set((s) => {
      if (!s.page) return {};
      return {
        page: {
          ...s.page,
          content: s.page.content.map((x) => (x.id === c.id ? c : x)),
        },
      };
    }),

  removeCustomer: (id) =>
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