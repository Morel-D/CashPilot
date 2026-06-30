import type { Transaction } from '../Transactiontypes';
import { TransactionTypeBadge } from './Transactiontypebadge';
import { useAuthStore } from '../../auth/store/authStore';

interface TransactionDetailProps {
  transaction: Transaction;
  onClose:     () => void;
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-start justify-between py-3 border-b border-dark/[0.05] last:border-0">
      <span className="font-sans text-xs text-neutral-text-muted w-32 shrink-0">{label}</span>
      <span className="font-sans text-xs text-dark text-right">{value || '—'}</span>
    </div>
  );
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-GB', {
    weekday: 'short', day: 'numeric', month: 'short',
    year: 'numeric', hour: '2-digit', minute: '2-digit',
  });
}

export function TransactionDetail({ transaction: t, onClose }: TransactionDetailProps) {
  const { user }  = useAuthStore();
  const currency  = user?.company?.currency ?? '';
  const isCredit  = t.type === 'CREDIT';

  return (
    <div className="flex flex-col h-full">

      {/* Header */}
      <div className="flex items-center justify-between px-5 py-4 border-b border-dark/[0.06]">
        <h3 className="font-display text-sm font-light text-dark">Transaction detail</h3>
        <button
          onClick={onClose}
          className="text-neutral-text-muted hover:text-dark transition-colors"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="size-4">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      {/* Amount hero */}
      <div className={`px-5 py-6 flex flex-col gap-2 ${isCredit ? 'bg-emerald-50' : 'bg-red-50'}`}>
        <TransactionTypeBadge type={t.type} />
        <p className={`font-mono text-3xl font-semibold ${isCredit ? 'text-emerald-700' : 'text-red-600'}`}>
          {isCredit ? '+' : '-'}{currency} {t.amount.toLocaleString('en', { minimumFractionDigits: 2 })}
        </p>
        {t.description && (
          <p className="font-sans text-xs text-neutral-text-muted">{t.description}</p>
        )}
      </div>

      {/* Details */}
      <div className="flex-1 overflow-y-auto px-5 py-2">
        <Row label="Reference"      value={`#${t.uid}`} />
        <Row label="Date"           value={formatDate(t.occurredAt)} />
        <Row label="Status"         value={t.status} />
        {t.invoiceNumber && (
          <Row label="Invoice"      value={t.invoiceNumber} />
        )}
        {t.customerName && (
          <Row label="Customer"     value={t.customerName} />
        )}
      </div>
    </div>
  );
}