import type { Transaction } from '../Transactiontypes';
import { TransactionTypeBadge } from './Transactiontypebadge';
import { Button } from '../../../components/ui/Button';
import { useAuthStore } from '../../auth/store/authStore';
import type { Page } from '../../../types/page';

interface TransactionTableProps {
  page:     Page<Transaction>;
  selected: Transaction | null;
  onSelect: (t: Transaction) => void;
  onPage:   (page: number) => void;
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-GB', {
    day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit',
  });
}

function formatDateShort(iso: string) {
  return new Date(iso).toLocaleDateString('en-GB', {
    day: 'numeric', month: 'short',
  });
}

export function TransactionTable({ page, selected, onSelect, onPage }: TransactionTableProps) {
  const { user }  = useAuthStore();
  const currency  = user?.company?.currency ?? '';
  const { content, number, totalPages, totalElements, size } = page;
  const from = number * size + 1;
  const to   = Math.min(from + content.length - 1, totalElements);

  return (
    <div className="card p-0 overflow-hidden flex flex-col">

      {/* ── Mobile: card list ─────────────────────────────────────────────── */}
      <div className="md:hidden divide-y divide-dark/[0.04]">
        {content.map((t) => {
          const isCredit   = t.type === 'CREDIT';
          const isSelected = selected?.uid === t.uid;
          return (
            <div
              key={t.uid}
              onClick={() => onSelect(t)}
              className={[
                'flex items-center justify-between px-4 py-3 cursor-pointer transition-colors gap-3',
                isSelected ? 'bg-primary/5' : 'hover:bg-neutral-bg-soft',
              ].join(' ')}
            >
              <div className="flex items-center gap-2.5 min-w-0">
                {/* Credit/debit dot */}
                <div className={`size-1.5 rounded-full shrink-0 ${isCredit ? 'bg-emerald-500' : 'bg-red-400'}`} />
                <div className="min-w-0">
                  <p className="font-sans text-xs font-medium text-dark truncate">
                    {t.description ?? (isCredit ? 'Payment received' : 'Payment sent')}
                  </p>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <TransactionTypeBadge type={t.type} />
                    {t.invoiceNumber && (
                      <span className="font-mono text-[10px] text-neutral-text-muted">{t.invoiceNumber}</span>
                    )}
                    <span className="font-sans text-[10px] text-neutral-text-muted">{formatDateShort(t.occurredAt)}</span>
                  </div>
                </div>
              </div>
              <span className={`font-mono text-sm font-semibold shrink-0 ${isCredit ? 'text-emerald-600' : 'text-red-500'}`}>
                {isCredit ? '+' : '-'}{currency} {t.amount.toLocaleString('en', { minimumFractionDigits: 2 })}
              </span>
            </div>
          );
        })}
      </div>

      {/* ── Desktop: full table ───────────────────────────────────────────── */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b border-dark/[0.06]">
              {['Type', 'Description', 'Customer', 'Invoice', 'Date', 'Amount'].map((h) => (
                <th key={h} className={[
                  'px-4 py-3 font-sans text-[11px] font-semibold uppercase tracking-wider text-neutral-text-muted whitespace-nowrap',
                  h === 'Amount' ? 'text-right' : '',
                ].join(' ')}>
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-dark/[0.04]">
            {content.map((t) => {
              const isCredit   = t.type === 'CREDIT';
              const isSelected = selected?.uid === t.uid;
              return (
                <tr
                  key={t.uid}
                  onClick={() => onSelect(t)}
                  className={[
                    'cursor-pointer transition-colors',
                    isSelected ? 'bg-primary/5' : 'hover:bg-neutral-bg-soft',
                  ].join(' ')}
                >
                  <td className="px-4 py-3"><TransactionTypeBadge type={t.type} /></td>
                  <td className="px-4 py-3 font-sans text-sm text-dark max-w-50 truncate">
                    {t.description ?? '—'}
                  </td>
                  <td className="px-4 py-3 font-sans text-sm text-neutral-text-muted">
                    {t.customerName ?? <span className="text-xs italic">Internal</span>}
                  </td>
                  <td className="px-4 py-3 font-mono text-xs text-neutral-text-muted">
                    {t.invoiceNumber ?? '—'}
                  </td>
                  <td className="px-4 py-3 font-sans text-xs text-neutral-text-muted whitespace-nowrap">
                    {formatDate(t.occurredAt)}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <span className={`font-mono text-sm font-semibold ${isCredit ? 'text-emerald-600' : 'text-red-500'}`}>
                      {isCredit ? '+' : '-'}{currency} {t.amount.toLocaleString('en', { minimumFractionDigits: 2 })}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between px-4 py-3 border-t border-dark/[0.06]">
        <span className="font-sans text-xs text-neutral-text-muted">{from}–{to} of {totalElements}</span>
        <div className="flex items-center gap-1">
          <Button variant="outline" size="sm" disabled={number === 0} onClick={() => onPage(number - 1)}>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="size-3.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" />
            </svg>
          </Button>
          <span className="font-mono text-xs text-dark px-2">{number + 1} / {totalPages}</span>
          <Button variant="outline" size="sm" disabled={number + 1 >= totalPages} onClick={() => onPage(number + 1)}>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="size-3.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
            </svg>
          </Button>
        </div>
      </div>
    </div>
  );
}