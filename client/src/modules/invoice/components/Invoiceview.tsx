import { useState } from 'react';
import { Button } from '../../../components/ui/Button';
import { InvoiceStatusBadge } from './Invoicestatusbadge';
import type { Invoice, InvoiceStatus } from '../Invoicetypes';
import { useAuthStore } from '../../auth/store/authStore';

interface InvoiceViewProps {
  invoice:      Invoice;
  onEdit:       () => void;
  onDelete:     () => void;
  onClose:      () => void;
  onIssue:      (id: number) => Promise<boolean>;
  onSend:       (id: number) => Promise<boolean>;
  onPay:        () => void;
  onCancel:     (id: number) => Promise<boolean>;
}

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col gap-0.5">
      <span className="field-label">{label}</span>
      <span className="font-sans text-sm text-dark">{value || '—'}</span>
    </div>
  );
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-GB', {
    day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit',
  });
}

// ─── Status action guards ─────────────────────────────────────────────────────

const canIssue  = (s: InvoiceStatus) => s === 'DRAFT';
const canSend   = (s: InvoiceStatus) => s === 'ISSUED';
const canPay    = (s: InvoiceStatus) => !['PAID', 'CANCELLED', 'VOIDED'].includes(s);
const canCancel = (s: InvoiceStatus) => !['PAID', 'CANCELLED', 'VOIDED'].includes(s);
const canEdit   = (s: InvoiceStatus) => s === 'DRAFT';
const canDelete = (s: InvoiceStatus) => s === 'DRAFT';

// ─── Component ────────────────────────────────────────────────────────────────

export function InvoiceView({
  invoice, onEdit, onDelete, onClose, onIssue, onSend, onPay, onCancel,
}: InvoiceViewProps) {
  const { user } = useAuthStore();
  const currency  = user?.company?.currency ?? '';
  const [busy, setBusy] = useState<string | null>(null);

  async function handle(key: string, fn: () => Promise<boolean>) {
    setBusy(key);
    await fn();
    setBusy(null);
  }

  return (
    <div className="flex flex-col gap-5">

      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="font-mono text-xs text-neutral-text-muted">#{invoice.number}</span>
            <InvoiceStatusBadge status={invoice.status} size="md" />
          </div>
          <h3 className="font-display text-lg font-light text-dark">{invoice.title}</h3>
          {invoice.description && (
            <p className="font-sans text-xs text-neutral-text-muted mt-0.5">{invoice.description}</p>
          )}
        </div>
        <div className="text-right">
          <p className="font-mono text-2xl font-semibold text-dark">
            {currency} {invoice.amount.toLocaleString('en', { minimumFractionDigits: 2 })}
          </p>
          <p className="font-sans text-xs text-neutral-text-muted mt-0.5">
            {invoice.customer ? invoice.customer.name : 'Internal expense'}
          </p>
        </div>
      </div>

      {/* Details grid */}
      <div className="info-zone grid grid-cols-2 gap-4">
        <Field label="Issue date" value={formatDate(invoice.issuedAt)} />
        <Field label="Due date"   value={formatDate(invoice.dueAt)} />
        <Field label="Customer"   value={invoice.customer?.name ?? 'Internal'} />
        <Field label="Created"    value={formatDate(invoice.dateOf)} />
      </div>

      {/* ── Status transition actions ──────────────────────────────────────── */}
      <div className="flex flex-wrap gap-2">
        {canIssue(invoice.status) && (
          <Button
            variant="secondary"
            size="sm"
            loading={busy === 'issue'}
            onClick={() => handle('issue', () => onIssue(invoice.id))}
          >
            Issue invoice
          </Button>
        )}
        {canSend(invoice.status) && (
          <Button
            variant="secondary"
            size="sm"
            loading={busy === 'send'}
            onClick={() => handle('send', () => onSend(invoice.id))}
          >
            Mark as sent
          </Button>
        )}
        {canPay(invoice.status) && (
          <Button variant="primary" size="sm" onClick={onPay}>
            Record payment
          </Button>
        )}
        {canCancel(invoice.status) && (
          <Button
            variant="muted"
            size="sm"
            loading={busy === 'cancel'}
            onClick={() => handle('cancel', () => onCancel(invoice.id))}
          >
            Cancel
          </Button>
        )}
      </div>

      {/* ── Bottom controls ────────────────────────────────────────────────── */}
      <div className="flex gap-2 pt-1 border-t border-dark/[0.06]">
        {canDelete(invoice.status) && (
          <Button variant="danger" size="sm" onClick={onDelete}>Delete</Button>
        )}
        <Button variant="outline" size="sm" onClick={onClose}>Close</Button>
        {canEdit(invoice.status) && (
          <Button variant="primary" size="sm" className="ml-auto" onClick={onEdit}>
            Edit
          </Button>
        )}
      </div>
    </div>
  );
}