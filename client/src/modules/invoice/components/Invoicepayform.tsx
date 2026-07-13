import { useState } from 'react';
import { Input } from '../../../components/ui/Input';
import { Select } from '../../../components/ui/Select';
import { Button } from '../../../components/ui/Button';
import { InvoiceStatusBadge } from './Invoicestatusbadge';
import { validatePayInvoice, type PayFormErrors } from '../utils/Invoicevalidation';
import type { Invoice, PayInvoiceRequest } from '../Invoicetypes';
import { useAuthStore } from '../../auth/store/authStore';

const PAYMENT_METHODS = [
  { value: 'BANK_TRANSFER',  label: 'Bank transfer'   },
  { value: 'MOBILE_MONEY',   label: 'Mobile money'    },
  { value: 'CASH',           label: 'Cash'            },
  { value: 'CHEQUE',         label: 'Cheque'          },
  { value: 'CARD',           label: 'Card'            },
  { value: 'OTHER',          label: 'Other'           },
];

interface InvoicePayFormProps {
  invoice:   Invoice;
  onSubmit:  (data: PayInvoiceRequest) => Promise<boolean>;
  onCancel:  () => void;
  loading:   boolean;
}

export function InvoicePayForm({ invoice, onSubmit, onCancel, loading }: InvoicePayFormProps) {
  const { user }  = useAuthStore();
  const currency  = user?.company?.currency ?? '';

  const [form, setForm]     = useState({ paidAmount: invoice.amount, paymentMethod: '' });
  const [errors, setErrors] = useState<PayFormErrors>({});

  function onChange(field: 'paidAmount' | 'paymentMethod') {
    return (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
      const val = field === 'paidAmount' ? parseFloat(e.target.value) || 0 : e.target.value;
      setForm((p) => ({ ...p, [field]: val }));
      if (errors[field]) setErrors((p) => ({ ...p, [field]: undefined }));
    };
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const errs = validatePayInvoice(form);
    if (Object.keys(errs).length) { setErrors(errs); return; }
    await onSubmit({
      paidAmount: form.paidAmount, paymentMethod: form.paymentMethod,
      invoiceId: 0
    });
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-4">

      {/* Invoice summary */}
      <div className="info-zone flex items-center justify-between">
        <div>
          <p className="font-mono text-xs text-neutral-text-muted">#{invoice.number}</p>
          <p className="font-sans text-sm font-medium text-dark">{invoice.title}</p>
        </div>
        <div className="text-right">
          <p className="font-mono text-lg font-semibold text-dark">
            {currency} {invoice.amount.toLocaleString('en', { minimumFractionDigits: 2 })}
          </p>
          <InvoiceStatusBadge status={invoice.status} />
        </div>
      </div>

      <Input
        label="Amount paid"
        type="number"
        min="0.01"
        step="0.01"
        value={form.paidAmount || ''}
        onChange={onChange('paidAmount')}
        error={errors.paidAmount}
        hint={`Full amount: ${currency} ${invoice.amount.toLocaleString('en', { minimumFractionDigits: 2 })}`}
        showRequired
      />

      <Select
        label="Payment method"
        options={PAYMENT_METHODS}
        placeholder="Select a method"
        value={form.paymentMethod}
        onChange={onChange('paymentMethod')}
        error={errors.paymentMethod}
        required
      />

      <div className="flex gap-3 pt-1">
        <Button type="button" variant="outline" size="md" onClick={onCancel} className="w-24">
          Cancel
        </Button>
        <Button type="submit" variant="primary" size="md" fullWidth loading={loading}>
          {loading ? 'Recording…' : 'Record payment'}
        </Button>
      </div>
    </form>
  );
}