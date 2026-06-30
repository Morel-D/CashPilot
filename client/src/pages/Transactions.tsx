import { useEffect, useState } from 'react';
import { useTransactions } from '../modules/transactions/hooks/Usetransactions';
import { TransactionTable } from '../modules/transactions/components/Transactiontable';
import { TransactionDetail } from '../modules/transactions/components/Transactiondetail';
import { Loader } from '../components/ui/Loader';
import { useAuthStore } from '../modules/auth/store/authStore';
import type { TransactionType } from '../modules/transactions/Transactiontypes';

const PAGE_SIZE = 20;

const TYPE_FILTERS: { value: TransactionType | null; label: string }[] = [
  { value: null,     label: 'All'    },
  { value: 'CREDIT', label: 'Credit' },
  { value: 'DEBIT',  label: 'Debit'  },
];

export default function TransactionsPage() {
  const { user }  = useAuthStore();
  const currency  = user?.company?.currency ?? '';

  const {
    page, loading, selected, typeFilter,
    fetchTransactions, selectTransaction, changeTypeFilter,
  } = useTransactions();

  const [currentPage, setCurrentPage] = useState(0);

  function load(p = currentPage, type = typeFilter) {
    fetchTransactions({ page: p, size: PAGE_SIZE, ...(type ? { type } : {}) });
  }

  useEffect(() => { load(); }, [currentPage, typeFilter]);

  function handleFilterChange(f: TransactionType | null) {
    changeTypeFilter(f);
    setCurrentPage(0);
  }

  // ── Totals from current page ─────────────────────────────────────────────

  const totals = (page?.content ?? []).reduce(
    (acc, t) => {
      if (t.type === 'CREDIT') acc.credit += t.amount;
      else acc.debit += t.amount;
      return acc;
    },
    { credit: 0, debit: 0 }
  );

  return (
    <div className="flex flex-col gap-6 max-w-7xl">

      {/* Header */}
      <div>
        <h2 className="font-display text-2xl font-light text-dark">Transactions</h2>
        <p className="font-sans text-sm text-neutral-text-muted mt-0.5">
          {page ? `${page.totalElements} transaction${page.totalElements !== 1 ? 's' : ''}` : 'Cash flow overview.'}
        </p>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          {
            label: 'Total in  (this page)',
            value: `+ ${currency} ${totals.credit.toLocaleString('en', { minimumFractionDigits: 2 })}`,
            color: 'text-emerald-600',
            bg:    'bg-emerald-50 border-emerald-100',
          },
          {
            label: 'Total out (this page)',
            value: `- ${currency} ${totals.debit.toLocaleString('en', { minimumFractionDigits: 2 })}`,
            color: 'text-red-500',
            bg:    'bg-red-50 border-red-100',
          },
          {
            label: 'Net (this page)',
            value: `${totals.credit - totals.debit >= 0 ? '+' : '-'} ${currency} ${Math.abs(totals.credit - totals.debit).toLocaleString('en', { minimumFractionDigits: 2 })}`,
            color: totals.credit - totals.debit >= 0 ? 'text-emerald-600' : 'text-red-500',
            bg:    'bg-white border-dark/8',
          },
        ].map(({ label, value, color, bg }) => (
          <div key={label} className={`rounded-xl border p-4 flex flex-col gap-1 ${bg}`}>
            <span className="field-label">{label}</span>
            <span className={`font-mono text-xl font-semibold ${color}`}>{value}</span>
          </div>
        ))}
      </div>

      {/* Filter tabs */}
      <div className="flex items-center gap-1.5">
        {TYPE_FILTERS.map(({ value, label }) => (
          <button
            key={String(value)}
            onClick={() => handleFilterChange(value)}
            className={[
              'font-sans text-xs font-medium px-3 py-1.5 rounded-lg border transition-all duration-150',
              typeFilter === value
                ? 'bg-dark text-white border-dark'
                : 'bg-white text-neutral-text-muted border-dark/10 hover:text-dark hover:border-dark/20',
            ].join(' ')}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Table + Detail panel side by side */}
      <div className="flex gap-4 items-start">

        {/* Table */}
        <div className={`transition-all duration-300 ${selected ? 'flex-1 min-w-0' : 'w-full'}`}>
          {loading && !page ? (
            <div className="flex justify-center py-20"><Loader /></div>
          ) : !page || page.content.length === 0 ? (
            <div className="card flex flex-col items-center justify-center py-20 gap-3 text-center">
              <div className="flex items-center justify-center size-14 rounded-2xl bg-primary/8 text-primary">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.25} stroke="currentColor" className="size-7">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 21 3 16.5m0 0L7.5 12M3 16.5h13.5m0-13.5L21 7.5m0 0L16.5 12M21 7.5H7.5" />
                </svg>
              </div>
              <div>
                <h3 className="font-display text-base font-light text-dark">No transactions</h3>
                <p className="font-sans text-sm text-neutral-text-muted mt-1">
                  {typeFilter ? `No ${typeFilter.toLowerCase()} transactions found.` : 'Transactions will appear here once invoices are processed.'}
                </p>
              </div>
            </div>
          ) : (
            <TransactionTable
              page={page}
              selected={selected}
              onSelect={(t) => selectTransaction(selected?.uid === t.uid ? null : t)}
              onPage={(p) => setCurrentPage(p)}
            />
          )}
        </div>

        {/* Detail panel — slides in when a row is selected */}
        {selected && (
          <div className="w-80 shrink-0 bg-white rounded-xl border border-dark/[0.06] shadow-card overflow-hidden sticky top-0">
            <TransactionDetail
              transaction={selected}
              onClose={() => selectTransaction(null)}
            />
          </div>
        )}
      </div>

    </div>
  );
}