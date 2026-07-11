import type { AuditLog } from '../Audittypes';
import { AuditActionBadge } from './Auditactionbadge';
import { Button } from '../../../components/ui/Button';
import type { Page } from '../../../types/page';

interface AuditTableProps {
  page:     Page<AuditLog>;
  onSelect: (log: AuditLog) => void;
  onPage:   (page: number) => void;
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-GB', {
    day: 'numeric', month: 'short', year: 'numeric',
    hour: '2-digit', minute: '2-digit',
  });
}

function formatDateShort(iso: string) {
  return new Date(iso).toLocaleDateString('en-GB', {
    day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit',
  });
}

export function AuditTable({ page, onSelect, onPage }: AuditTableProps) {
  const { content, number, totalPages, totalElements, size } = page;
  const from = number * size + 1;
  const to   = Math.min(from + content.length - 1, totalElements);

  return (
    <div className="card p-0 overflow-hidden flex flex-col">

      {/* ── Mobile: card list ─────────────────────────────────────────────── */}
      <div className="md:hidden divide-y divide-dark/[0.04]">
        {content.map((log) => (
          <div
            key={log.id}
            onClick={() => onSelect(log)}
            className="flex items-start justify-between px-4 py-3 hover:bg-neutral-bg-soft transition-colors cursor-pointer gap-3"
          >
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2 mb-1">
                <AuditActionBadge action={log.action} />
                <span className="font-sans text-xs font-medium text-dark shrink-0">{log.entityType}</span>
                {log.entityId && (
                  <span className="font-mono text-[10px] text-neutral-text-muted">#{log.entityId}</span>
                )}
              </div>
              <p className="font-sans text-xs text-neutral-text-muted truncate">
                {log.description ?? '—'}
              </p>
            </div>
            <div className="text-right shrink-0">
              <p className="font-sans text-xs font-medium text-dark">{log.username}</p>
              <p className="font-mono text-[10px] text-neutral-text-muted mt-0.5">
                {formatDateShort(log.timestamp)}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* ── Desktop: full table ───────────────────────────────────────────── */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b border-dark/[0.06]">
              {['Action', 'Entity', 'User', 'Description', 'Timestamp', ''].map((h) => (
                <th key={h} className="px-4 py-3 font-sans text-[11px] font-semibold uppercase tracking-wider text-neutral-text-muted whitespace-nowrap">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-dark/[0.04]">
            {content.map((log) => (
              <tr
                key={log.id}
                className="group hover:bg-neutral-bg-soft transition-colors cursor-pointer"
                onClick={() => onSelect(log)}
              >
                <td className="px-4 py-3"><AuditActionBadge action={log.action} /></td>
                <td className="px-4 py-3">
                  <p className="font-sans text-xs font-medium text-dark">{log.entityType}</p>
                  {log.entityId && (
                    <p className="font-mono text-[10px] text-neutral-text-muted">#{log.entityId}</p>
                  )}
                </td>
                <td className="px-4 py-3">
                  <p className="font-sans text-xs font-medium text-dark">{log.username}</p>
                  {log.ipAddress && (
                    <p className="font-mono text-[10px] text-neutral-text-muted">{log.ipAddress}</p>
                  )}
                </td>
                <td className="px-4 py-3 max-w-[220px]">
                  <p className="font-sans text-xs text-neutral-text-muted truncate">{log.description ?? '—'}</p>
                </td>
                <td className="px-4 py-3 font-mono text-[11px] text-neutral-text-muted whitespace-nowrap">
                  {formatDate(log.timestamp)}
                </td>
                <td className="px-4 py-3">
                  <span className="opacity-0 group-hover:opacity-100 transition-opacity font-sans text-[10px] text-primary font-medium">
                    View →
                  </span>
                </td>
              </tr>
            ))}
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