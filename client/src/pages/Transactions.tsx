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
 
        {/* Total in */}
        <div className="card flex flex-col gap-1.5">
          <div className="flex items-center gap-1.5">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="size-3 text-emerald-500">
              <path fillRule="evenodd" d="M8 14a.75.75 0 0 1-.75-.75V4.56L4.03 7.78a.75.75 0 0 1-1.06-1.06l4.5-4.5a.75.75 0 0 1 1.06 0l4.5 4.5a.75.75 0 0 1-1.06 1.06L8.75 4.56v8.69A.75.75 0 0 1 8 14Z" clipRule="evenodd" />
            </svg>
            <span className="field-label">Total in</span>
          </div>
          <span className="amount text-xl font-semibold text-dark">
            {currency} {totals.credit.toLocaleString('en', { minimumFractionDigits: 2 })}
          </span>
          <span className="font-sans text-xs text-neutral-text-muted">This page</span>
        </div>
 
        {/* Total out */}
        <div className="card flex flex-col gap-1.5">
          <div className="flex items-center gap-1.5">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="size-3 text-red-500">
              <path fillRule="evenodd" d="M8 2a.75.75 0 0 1 .75.75v8.69l3.22-3.22a.75.75 0 1 1 1.06 1.06l-4.5 4.5a.75.75 0 0 1-1.06 0l-4.5-4.5a.75.75 0 0 1 1.06-1.06l3.22 3.22V2.75A.75.75 0 0 1 8 2Z" clipRule="evenodd" />
            </svg>
            <span className="field-label">Total out</span>
          </div>
          <span className="amount text-xl font-semibold text-dark">
            {currency} {totals.debit.toLocaleString('en', { minimumFractionDigits: 2 })}
          </span>
          <span className="font-sans text-xs text-neutral-text-muted">This page</span>
        </div>
 
        {/* Net */}
        <div className="card flex flex-col gap-1.5">
          <span className="field-label">Net</span>
          <span className="amount text-xl font-semibold text-dark">
            {totals.credit - totals.debit >= 0 ? '+' : '−'} {currency} {Math.abs(totals.credit - totals.debit).toLocaleString('en', { minimumFractionDigits: 2 })}
          </span>
          <span className="font-sans text-xs text-neutral-text-muted">This page</span>
        </div>
 
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
 
      {/* Table */}
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
          onSelect={(t) => selectTransaction(t)}
          onPage={(p) => setCurrentPage(p)}
        />
      )}
 
      {/* Detail modal */}
      {selected && (
        <TransactionDetail
          transaction={selected}
          onClose={() => selectTransaction(null)}
        />
      )}
 
    </div>
  );
}
 