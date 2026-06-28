import type { InvoiceStatus } from '../Invoicetypes';

interface Props { status: InvoiceStatus; size?: 'sm' | 'md'; }

const CONFIG: Record<InvoiceStatus, { label: string; classes: string }> = {
  DRAFT:          { label: 'Draft',          classes: 'bg-neutral-bg-soft text-neutral-text-muted border-dark/10'    },
  ISSUED:         { label: 'Issued',         classes: 'bg-primary/10 text-primary border-primary/20'                },
  SENT:           { label: 'Sent',           classes: 'bg-blue-50 text-blue-600 border-blue-200'                    },
  PARTIALLY_PAID: { label: 'Partial',        classes: 'bg-amber-50 text-amber-600 border-amber-200'                 },
  PAID:           { label: 'Paid',           classes: 'bg-emerald-50 text-emerald-600 border-emerald-200'           },
  OVERDUE:        { label: 'Overdue',        classes: 'bg-red-50 text-red-600 border-red-200'                       },
  CANCELLED:      { label: 'Cancelled',      classes: 'bg-neutral-bg-soft text-neutral-text-muted border-dark/10'   },
  VOIDED:         { label: 'Voided',         classes: 'bg-neutral-bg-soft text-neutral-text-muted border-dark/10'   },
};

export function InvoiceStatusBadge({ status, size = 'sm' }: Props) {
  const { label, classes } = CONFIG[status] ?? CONFIG.DRAFT;
  return (
    <span className={[
      'inline-flex items-center border rounded-full font-sans font-medium',
      size === 'sm' ? 'text-[10px] px-2 py-0.5' : 'text-xs px-2.5 py-1',
      classes,
    ].join(' ')}>
      {label}
    </span>
  );
}