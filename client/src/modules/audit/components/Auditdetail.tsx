import { Modal } from '../../../components/ui/Modal';
import { AuditActionBadge } from './Auditactionbadge';
import type { AuditLog } from '../Audittypes';

interface AuditDetailProps {
  log:     AuditLog;
  onClose: () => void;
}

function Row({ label, value }: { label: string; value: string | null | undefined }) {
  if (!value) return null;
  return (
    <div className="flex flex-col gap-0.5 py-2.5 border-b border-dark/[0.05] last:border-0">
      <span className="field-label">{label}</span>
      <span className="font-sans text-xs text-dark break-all">{value}</span>
    </div>
  );
}

function JsonBlock({ label, value }: { label: string; value: string | null }) {
  if (!value) return null;

  // Try to pretty-print if JSON, otherwise show raw
  let display = value;
  try {
    display = JSON.stringify(JSON.parse(value), null, 2);
  } catch { /* not JSON, use raw */ }

  return (
    <div className="flex flex-col gap-1.5">
      <span className="field-label">{label}</span>
      <pre className="font-mono text-[11px] text-dark bg-neutral-bg-soft border border-dark/8 rounded-lg p-3 overflow-x-auto whitespace-pre-wrap break-all">
        {display}
      </pre>
    </div>
  );
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-GB', {
    weekday: 'short', day: 'numeric', month: 'short',
    year: 'numeric', hour: '2-digit', minute: '2-digit', second: '2-digit',
  });
}

export function AuditDetail({ log, onClose }: AuditDetailProps) {
  return (
    <Modal title="Audit log detail" onClose={onClose} size="lg">
      <div className="flex flex-col gap-4">

        {/* Header summary */}
        <div className="info-zone flex items-center justify-between gap-3">
          <div className="flex flex-col gap-1.5">
            <AuditActionBadge action={log.action} />
            <p className="font-sans text-sm font-medium text-dark">
              {log.entityType}
              {log.entityId && (
                <span className="font-mono text-xs text-neutral-text-muted ml-1.5">
                  #{log.entityId}
                </span>
              )}
            </p>
            {log.description && (
              <p className="font-sans text-xs text-neutral-text-muted">{log.description}</p>
            )}
          </div>
          <div className="text-right shrink-0">
            <p className="font-sans text-xs font-medium text-dark">{log.username}</p>
            <p className="font-mono text-[10px] text-neutral-text-muted mt-0.5">
              {formatDate(log.timestamp)}
            </p>
          </div>
        </div>

        {/* Meta fields */}
        <div className="flex flex-col">
          <Row label="Log ID"      value={String(log.id)} />
          <Row label="User ID"     value={log.userId} />
          <Row label="Company ID"  value={log.companyId} />
          <Row label="IP Address"  value={log.ipAddress} />
          <Row label="User Agent"  value={log.userAgent} />
        </div>

        {/* Value diff */}
        {(log.oldValue || log.newValue) && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <JsonBlock label="Before" value={log.oldValue} />
            <JsonBlock label="After"  value={log.newValue} />
          </div>
        )}

      </div>
    </Modal>
  );
}