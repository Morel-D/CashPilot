import type { AuditAction } from '../Audittypes';

const CONFIG: Record<string, string> = {
  CREATE:        'bg-emerald-50 text-emerald-700 border-emerald-200',
  UPDATE:        'bg-primary/10 text-primary border-primary/20',
  DELETE:        'bg-red-50 text-red-600 border-red-200',
  LOGIN:         'bg-neutral-bg-soft text-neutral-text-muted border-dark/10',
  LOGOUT:        'bg-neutral-bg-soft text-neutral-text-muted border-dark/10',
  REGISTER:      'bg-emerald-50 text-emerald-700 border-emerald-200',
  STATUS_CHANGE: 'bg-amber-50 text-amber-600 border-amber-200',
  PAYMENT:       'bg-blue-50 text-blue-600 border-blue-200',
};

export function AuditActionBadge({ action }: { action: AuditAction }) {
  const classes = CONFIG[action] ?? 'bg-neutral-bg-soft text-neutral-text-muted border-dark/10';
  return (
    <span className={`inline-flex items-center border rounded-full font-sans text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 ${classes}`}>
      {action.replace(/_/g, ' ')}
    </span>
  );
}