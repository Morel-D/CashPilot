import { useEffect, useRef, useState } from 'react';
import { useAudit } from '../modules/audit/hooks/useAudit';
import { AuditTable } from '../modules/audit/components/Audittable';
import { AuditDetail } from '../modules/audit/components/Auditdetail';
import { AuditActionBadge } from '../modules/audit/components/Auditactionbadge';
import { Loader } from '../components/ui/Loader';
import { Input } from '../components/ui/Input';
import type { AuditAction } from '../modules/audit/Audittypes';

const PAGE_SIZE = 25;

const ACTION_FILTERS: { value: AuditAction | null; label: string }[] = [
  { value: null,            label: 'All'           },
  { value: 'CREATE',        label: 'Create'        },
  { value: 'UPDATE',        label: 'Update'        },
  { value: 'DELETE',        label: 'Delete'        },
  { value: 'LOGIN',         label: 'Login'         },
  { value: 'LOGOUT',        label: 'Logout'        },
  { value: 'STATUS_CHANGE', label: 'Status'        },
  { value: 'PAYMENT',       label: 'Payment'       },
];

const ENTITY_FILTERS = [
  { value: null,       label: 'All'      },
  { value: 'INVOICE',  label: 'Invoice'  },
  { value: 'CUSTOMER', label: 'Customer' },
  { value: 'PAYMENT',  label: 'Payment'  },
  { value: 'USER',     label: 'User'     },
  { value: 'COMPANY',  label: 'Company'  },
];

export default function AuditLogPage() {
  const {
    page, loading, selected,
    actionFilter, entityTypeFilter, searchQuery,
    fetchAuditLogs, searchAuditLogs,
    changeActionFilter, changeEntityTypeFilter, changeSearchQuery,
    setSelected,
  } = useAudit();

  const [currentPage, setCurrentPage] = useState(0);
  const [searchInput, setSearchInput] = useState('');
  const searchTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (searchQuery) {
      searchAuditLogs(searchQuery, currentPage);
    } else {
      fetchAuditLogs({
        page:       currentPage,
        size:       PAGE_SIZE,
        ...(actionFilter     ? { action:     actionFilter     } : {}),
        ...(entityTypeFilter ? { entityType: entityTypeFilter } : {}),
      });
    }
  }, [currentPage, actionFilter, entityTypeFilter, searchQuery]);

  function handleSearchInput(e: React.ChangeEvent<HTMLInputElement>) {
    const val = e.target.value;
    setSearchInput(val);
    if (searchTimeout.current) clearTimeout(searchTimeout.current);
    searchTimeout.current = setTimeout(() => {
      changeSearchQuery(val);
      setCurrentPage(0);
    }, 400);
  }

  function handleActionFilter(f: AuditAction | null) {
    changeActionFilter(f);
    setCurrentPage(0);
  }

  function handleEntityFilter(f: string | null) {
    changeEntityTypeFilter(f);
    setCurrentPage(0);
  }

  function clearAll() {
    handleActionFilter(null);
    handleEntityFilter(null);
    changeSearchQuery('');
    setSearchInput('');
    setCurrentPage(0);
  }

  const isFiltered = !!actionFilter || !!entityTypeFilter || !!searchQuery;

  return (
    <div className="flex flex-col gap-4 md:gap-6">

      {/* Header — search inline on desktop, stacked on mobile */}
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
        <div>
          <h2 className="font-display text-xl md:text-2xl font-light text-dark">Audit Log</h2>
          <p className="font-sans text-xs md:text-sm text-neutral-text-muted mt-0.5">
            {page
              ? `${page.totalElements.toLocaleString()} entr${page.totalElements !== 1 ? 'ies' : 'y'}`
              : 'Full activity trail for your workspace.'}
          </p>
        </div>
        <div className="w-full sm:w-56 md:w-64 shrink-0">
          <Input
            placeholder="Search logs…"
            value={searchInput}
            onChange={handleSearchInput}
            leftIcon={
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-4">
                <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
              </svg>
            }
          />
        </div>
      </div>

      {/* Filters — each group scrolls horizontally on mobile */}
      <div className="flex flex-col gap-3">

        <div className="flex flex-col gap-1.5">
          <span className="field-label">Action</span>
          <div className="flex items-center gap-1.5 overflow-x-auto pb-0.5 scrollbar-none">
            {ACTION_FILTERS.map(({ value, label }) => (
              <button
                key={String(value)}
                onClick={() => handleActionFilter(value)}
                className={[
                  'font-sans text-xs font-medium px-2.5 py-1 rounded-lg border transition-all duration-150 whitespace-nowrap shrink-0',
                  actionFilter === value
                    ? 'bg-dark text-white border-dark'
                    : 'bg-white text-neutral-text-muted border-dark/10 hover:text-dark hover:border-dark/20',
                ].join(' ')}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-1.5">
          <span className="field-label">Entity</span>
          <div className="flex items-center gap-1.5 overflow-x-auto pb-0.5 scrollbar-none">
            {ENTITY_FILTERS.map(({ value, label }) => (
              <button
                key={String(value)}
                onClick={() => handleEntityFilter(value)}
                className={[
                  'font-sans text-xs font-medium px-2.5 py-1 rounded-lg border transition-all duration-150 whitespace-nowrap shrink-0',
                  entityTypeFilter === value
                    ? 'bg-dark text-white border-dark'
                    : 'bg-white text-neutral-text-muted border-dark/10 hover:text-dark hover:border-dark/20',
                ].join(' ')}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

      </div>

      {/* Active filter summary */}
      {isFiltered && (
        <div className="flex items-center gap-2 flex-wrap">
          <span className="font-sans text-xs text-neutral-text-muted">Filtering by:</span>
          {actionFilter && <AuditActionBadge action={actionFilter} />}
          {entityTypeFilter && (
            <span className="font-sans text-xs bg-neutral-bg-soft border border-dark/10 text-dark px-2 py-0.5 rounded-full">
              {entityTypeFilter}
            </span>
          )}
          {searchQuery && (
            <span className="font-sans text-xs bg-neutral-bg-soft border border-dark/10 text-dark px-2 py-0.5 rounded-full">
              "{searchQuery}"
            </span>
          )}
          <button
            onClick={clearAll}
            className="font-sans text-xs text-neutral-text-muted hover:text-red-500 transition-colors"
          >
            Clear all
          </button>
        </div>
      )}

      {/* Content */}
      {loading && !page ? (
        <div className="flex justify-center py-20"><Loader /></div>
      ) : !page || page.content.length === 0 ? (
        <div className="card flex flex-col items-center justify-center py-16 gap-3 text-center">
          <div className="flex items-center justify-center size-12 rounded-2xl bg-primary/8 text-primary">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.25} stroke="currentColor" className="size-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25M9 16.5v.75m3-3v3M15 12v5.25m-4.5-15H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" />
            </svg>
          </div>
          <div>
            <h3 className="font-display text-base font-light text-dark">No audit entries</h3>
            <p className="font-sans text-sm text-neutral-text-muted mt-1">
              {isFiltered ? 'No entries match the current filters.' : 'Activity will appear here as actions are performed.'}
            </p>
          </div>
          {isFiltered && (
            <button
              onClick={clearAll}
              className="font-sans text-xs text-primary hover:text-primary-600 transition-colors"
            >
              Clear filters
            </button>
          )}
        </div>
      ) : (
        <AuditTable
          page={page}
          onSelect={(log) => setSelected(log)}
          onPage={(p) => setCurrentPage(p)}
        />
      )}

      {/* Detail modal */}
      {selected && (
        <AuditDetail
          log={selected}
          onClose={() => setSelected(null)}
        />
      )}

    </div>
  );
}