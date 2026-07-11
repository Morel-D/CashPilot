import { useState, useEffect } from 'react';
import { Input } from '../../../components/ui/Input';
import { Select } from '../../../components/ui/Select';
import { Button } from '../../../components/ui/Button';
import { validateCreateInvoice, type InvoiceFormErrors } from '../utils/Invoicevalidation';
import { customerApi } from '../../customers/api/Customerapi';
import type { Customer } from '../../customers/Customertypes';
import type { CreateInvoiceRequest, Invoice, InvoiceSource } from '../Invoicetypes';

interface InvoiceFormProps {
  initial?:  Partial<Invoice>;
  onSubmit:  (data: CreateInvoiceRequest) => Promise<boolean>;
  onCancel:  () => void;
  loading:   boolean;
  mode:      'create' | 'edit';
}

// ─── Date/time helpers ────────────────────────────────────────────────────────

function toDatetimeLocal(iso?: string): string {
  if (!iso) return '';
  // "2026-06-26T09:15:44" → input[datetime-local] format
  return iso.slice(0, 16);
}

function toISOString(local: string): string {
  if (!local) return '';
  return new Date(local).toISOString();
}

const PAYMENT_SOURCES: { value: InvoiceSource; label: string }[] = [
  { value: 'customer', label: 'Customer invoice' },
  { value: 'internal', label: 'Internal expense' },
];

const EMPTY: CreateInvoiceRequest = {
  number:      '',
  title:       '',
  description: '',
  amount:      0,
  issuedAt:    '',
  dueAt:       '',
  customerId:  null,
};

export function InvoiceForm({ initial, onSubmit, onCancel, loading, mode }: InvoiceFormProps) {
  const [source,  setSource]  = useState<InvoiceSource>(initial?.customer ? 'customer' : 'internal');
  const [form,    setForm]    = useState<CreateInvoiceRequest>({
    number:      initial?.number      ?? EMPTY.number,
    title:       initial?.title       ?? EMPTY.title,
    description: initial?.description ?? EMPTY.description,
    amount:      initial?.amount      ?? EMPTY.amount,
    issuedAt:    toDatetimeLocal(initial?.issuedAt),
    dueAt:       toDatetimeLocal(initial?.dueAt),
    customerId:  initial?.customer?.id ?? null,
  });
  const [errors,    setErrors]    = useState<InvoiceFormErrors>({});
  const [customers, setCustomers] = useState<Customer[] | null>([]);

useEffect(() => {
  if (source !== 'customer') return;
  let cancelled = false;

  customerApi.getAll({ size: 100 })
    .then((res) => {
      if (cancelled) return;
      if (res.data.success && res.data.data) setCustomers(res.data.data.content);
    })
    .catch(() => { if (!cancelled) setCustomers([]); });

  return () => { cancelled = true; };
}, [source]);

const loadingCustomers = source === 'customer' && customers === null;

  function onChange(field: keyof CreateInvoiceRequest) {
    return (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
      const value = field === 'amount'
        ? parseFloat(e.target.value) || 0
        : field === 'customerId'
        ? parseInt(e.target.value) || null
        : e.target.value;
      setForm((prev) => ({ ...prev, [field]: value }));
      if (errors[field]) setErrors((prev) => ({ ...prev, [field]: undefined }));
    };
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const payload: CreateInvoiceRequest = {
      ...form,
      issuedAt:   toISOString(form.issuedAt),
      dueAt:      toISOString(form.dueAt),
      customerId: source === 'customer' ? form.customerId : null,
    };
    const errs = validateCreateInvoice(payload);
    if (Object.keys(errs).length) { setErrors(errs); return; }
    await onSubmit(payload);
  }

  const customerOptions = (customers ?? []).map((c) => ({ value: String(c.id), label: c.name }));

  return (
    <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-4">

      {/* Source toggle */}
      <div className="flex gap-2 p-1 bg-neutral-bg-soft rounded-lg">
        {PAYMENT_SOURCES.map((s) => (
          <button
            key={s.value}
            type="button"
            onClick={() => {
              setSource(s.value);
              setForm((p) => ({ ...p, customerId: null }));
            }}
            className={[
              'flex-1 py-2 rounded-md font-sans text-xs font-medium transition-all duration-150',
              source === s.value
                ? 'bg-white text-dark shadow-card'
                : 'text-neutral-text-muted hover:text-dark',
            ].join(' ')}
          >
            {s.label}
          </button>
        ))}
      </div>

      {/* Customer select — only when source = customer */}
      {source === 'customer' && (
        <Select
          label="Customer"
          placeholder={loadingCustomers ? 'Loading…' : 'Select a customer'}
          options={customerOptions}
          value={form.customerId ? String(form.customerId) : ''}
          onChange={onChange('customerId')}
          error={errors.customerId ? String(errors.customerId) : undefined}
          required
        />
      )}

      {/* Two-column row */}
      <div className="grid grid-cols-2 gap-3">
        <Input
          label="Invoice number"
          placeholder="INV-0001"
          value={form.number}
          onChange={onChange('number')}
          error={errors.number}
          showRequired
        />
        <Input
          label={`Amount (${source === 'internal' ? 'expense' : 'invoice'})`}
          type="number"
          min="0"
          step="0.01"
          placeholder="0.00"
          value={form.amount || ''}
          onChange={onChange('amount')}
          error={errors.amount ? String(errors.amount) : undefined}
          showRequired
        />
      </div>

      <Input
        label="Title"
        placeholder="Web development services"
        value={form.title}
        onChange={onChange('title')}
        error={errors.title}
        showRequired
      />

      {/* Description textarea */}
      <div className="flex flex-col gap-1.5">
        <label className="font-sans text-xs font-medium text-dark/70">Description</label>
        <textarea
          rows={2}
          placeholder="Optional details…"
          value={form.description}
          onChange={onChange('description')}
          className="w-full rounded-lg bg-white border border-dark/15 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none font-sans text-sm text-dark placeholder:text-neutral-text-muted/70 px-3.5 py-2.5 resize-none transition-all duration-150"
        />
      </div>

      {/* Date row */}
      <div className="grid grid-cols-2 gap-3">
        <Input
          label="Issue date"
          type="datetime-local"
          value={form.issuedAt}
          onChange={onChange('issuedAt')}
          error={errors.issuedAt ? String(errors.issuedAt) : undefined}
          showRequired
        />
        <Input
          label="Due date"
          type="datetime-local"
          value={form.dueAt}
          onChange={onChange('dueAt')}
          error={errors.dueAt ? String(errors.dueAt) : undefined}
          showRequired
        />
      </div>

      <div className="flex gap-3 pt-1">
        <Button type="button" variant="outline" size="md" onClick={onCancel} className="w-24">
          Cancel
        </Button>
        <Button type="submit" variant="primary" size="md" fullWidth loading={loading}>
          {loading
            ? mode === 'create' ? 'Creating…' : 'Saving…'
            : mode === 'create' ? 'Create invoice' : 'Save changes'}
        </Button>
      </div>
    </form>
  );
}