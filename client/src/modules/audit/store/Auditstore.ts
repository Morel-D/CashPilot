import { create } from 'zustand';
import type { AuditLog, AuditAction } from '../Audittypes';
import type { Page } from '../../../types/page';

interface AuditState {
  page:       Page<AuditLog> | null;
  loading:    boolean;
  error:      string | null;
  selected:   AuditLog | null;

  // Active filters
  actionFilter:     AuditAction | null;
  entityTypeFilter: string | null;
  searchQuery:      string;

  setPage:            (page: Page<AuditLog>) => void;
  setLoading:         (v: boolean) => void;
  setError:           (e: string | null) => void;
  setSelected:        (a: AuditLog | null) => void;
  setActionFilter:    (f: AuditAction | null) => void;
  setEntityTypeFilter:(f: string | null) => void;
  setSearchQuery:     (q: string) => void;
}

export const useAuditStore = create<AuditState>()((set) => ({
  page:              null,
  loading:           false,
  error:             null,
  selected:          null,
  actionFilter:      null,
  entityTypeFilter:  null,
  searchQuery:       '',

  setPage:             (page)             => set({ page }),
  setLoading:          (loading)          => set({ loading }),
  setError:            (error)            => set({ error }),
  setSelected:         (selected)         => set({ selected }),
  setActionFilter:     (actionFilter)     => set({ actionFilter }),
  setEntityTypeFilter: (entityTypeFilter) => set({ entityTypeFilter }),
  setSearchQuery:      (searchQuery)      => set({ searchQuery }),
}));