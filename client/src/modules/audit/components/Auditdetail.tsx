import { Modal } from '../../../components/ui/Modal';
import { AuditActionBadge } from './Auditactionbadge';
import type { AuditLog } from '../Audittypes';

interface AuditDetailProps {
  log:     AuditLog;
  onClose: () => void;
}

// ─── User agent parser ────────────────────────────────────────────────────────

interface ParsedUA {
  browser: string;
  os:      string;
  device:  string;
}

function parseUserAgent(ua: string): ParsedUA {
  // Device
  const isMobile  = /Mobile|Android|iPhone|iPad/i.test(ua);
  const isTablet  = /iPad|Tablet/i.test(ua);
  let device = isTablet ? 'Tablet' : isMobile ? 'Mobile' : 'Desktop';

  // Specific device model
  const samsungMatch = ua.match(/;\s*(SM-[A-Z0-9]+)/i);
  const iPhoneMatch  = ua.match(/(iPhone)/i);
  const iPadMatch    = ua.match(/(iPad)/i);
  if (samsungMatch) device = `Samsung ${samsungMatch[1]}`;
  else if (iPhoneMatch) device = 'iPhone';
  else if (iPadMatch)   device = 'iPad';

  // OS
  let os = 'Unknown OS';
  if (/Windows NT 10/i.test(ua))       os = 'Windows 11/10';
  else if (/Windows NT 6\.3/i.test(ua)) os = 'Windows 8.1';
  else if (/Windows NT 6\.1/i.test(ua)) os = 'Windows 7';
  else if (/Windows/i.test(ua))         os = 'Windows';
  else if (/Android (\d+)/i.test(ua)) {
    const m = ua.match(/Android (\d+(\.\d+)?)/i);
    os = m ? `Android ${m[1]}` : 'Android';
  }
  else if (/iPhone OS ([\d_]+)/i.test(ua)) {
    const m = ua.match(/iPhone OS ([\d_]+)/i);
    os = m ? `iOS ${m[1].replace(/_/g, '.')}` : 'iOS';
  }
  else if (/iPad.*OS ([\d_]+)/i.test(ua)) {
    const m = ua.match(/OS ([\d_]+)/i);
    os = m ? `iPadOS ${m[1].replace(/_/g, '.')}` : 'iPadOS';
  }
  else if (/Mac OS X ([\d_]+)/i.test(ua)) {
    const m = ua.match(/Mac OS X ([\d_.]+)/i);
    os = m ? `macOS ${m[1].replace(/_/g, '.')}` : 'macOS';
  }
  else if (/Linux/i.test(ua)) os = 'Linux';

  // Browser
  let browser = 'Unknown browser';
  if (/Edg\/([\d.]+)/i.test(ua)) {
    const m = ua.match(/Edg\/([\d.]+)/i);
    browser = m ? `Edge ${m[1].split('.')[0]}` : 'Edge';
  } else if (/OPR\/([\d.]+)|Opera\/([\d.]+)/i.test(ua)) {
    const m = ua.match(/OPR\/([\d.]+)/i) ?? ua.match(/Opera\/([\d.]+)/i);
    browser = m ? `Opera ${m[1].split('.')[0]}` : 'Opera';
  } else if (/Firefox\/([\d.]+)/i.test(ua)) {
    const m = ua.match(/Firefox\/([\d.]+)/i);
    browser = m ? `Firefox ${m[1].split('.')[0]}` : 'Firefox';
  } else if (/SamsungBrowser\/([\d.]+)/i.test(ua)) {
    const m = ua.match(/SamsungBrowser\/([\d.]+)/i);
    browser = m ? `Samsung Browser ${m[1].split('.')[0]}` : 'Samsung Browser';
  } else if (/Chrome\/([\d.]+)/i.test(ua)) {
    const m = ua.match(/Chrome\/([\d.]+)/i);
    browser = m ? `Chrome ${m[1].split('.')[0]}` : 'Chrome';
  } else if (/Safari\/([\d.]+)/i.test(ua) && /Version\/([\d.]+)/i.test(ua)) {
    const m = ua.match(/Version\/([\d.]+)/i);
    browser = m ? `Safari ${m[1].split('.')[0]}` : 'Safari';
  }

  return { browser, os, device };
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function Row({ label, value }: { label: string; value: string | null | undefined }) {
  if (!value) return null;
  return (
    <div className="flex flex-col gap-0.5 py-2.5 border-b border-dark/[0.05] last:border-0">
      <span className="field-label">{label}</span>
      <span className="font-sans text-xs text-dark break-all">{value}</span>
    </div>
  );
}

function UserAgentRow({ ua }: { ua: string }) {
  const { browser, os, device } = parseUserAgent(ua);
  return (
    <div className="flex flex-col gap-1 py-2.5 border-b border-dark/[0.05]">
      <span className="field-label">Client</span>
      <div className="flex flex-wrap items-center gap-2 mt-0.5">
        {/* Browser */}
        <span className="inline-flex items-center gap-1.5 font-sans text-xs text-dark">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-3.5 text-neutral-text-muted shrink-0">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9.004 9.004 0 0 0 8.716-6.747M12 21a9.004 9.004 0 0 1-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 0 1 7.843 4.582M12 3a8.997 8.997 0 0 0-7.843 4.582m15.686 0A11.953 11.953 0 0 1 12 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0 1 21 12c0 .778-.099 1.533-.284 2.253" />
          </svg>
          {browser}
        </span>

        <span className="text-dark/20 text-xs">·</span>

        {/* OS */}
        <span className="inline-flex items-center gap-1.5 font-sans text-xs text-dark">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-3.5 text-neutral-text-muted shrink-0">
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 17.25v1.007a3 3 0 0 1-.879 2.122L7.5 21h9l-.621-.621A3 3 0 0 1 15 18.257V17.25m6-12V15a2.25 2.25 0 0 1-2.25 2.25H5.25A2.25 2.25 0 0 1 3 15V5.25m18 0A2.25 2.25 0 0 0 18.75 3H5.25A2.25 2.25 0 0 0 3 5.25m18 0H3" />
          </svg>
          {os}
        </span>

        <span className="text-dark/20 text-xs">·</span>

        {/* Device */}
        <span className="inline-flex items-center gap-1.5 font-sans text-xs text-dark">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-3.5 text-neutral-text-muted shrink-0">
            <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 1.5H8.25A2.25 2.25 0 0 0 6 3.75v16.5a2.25 2.25 0 0 0 2.25 2.25h7.5A2.25 2.25 0 0 0 18 20.25V3.75a2.25 2.25 0 0 0-2.25-2.25H13.5m-3 0V3h3V1.5m-3 0h3m-3 18.75h3" />
          </svg>
          {device}
        </span>
      </div>
    </div>
  );
}

function JsonBlock({ label, value }: { label: string; value: string | null }) {
  if (!value) return null;
  let display = value;
  try { display = JSON.stringify(JSON.parse(value), null, 2); } catch { /* raw */ }
  return (
    <div className="flex flex-col gap-1.5">
      <span className="field-label">{label}</span>
      <pre className="font-mono text-[11px] text-dark bg-neutral-bg-soft border border-dark/8 rounded-lg p-3 overflow-x-auto whitespace-pre-wrap break-all max-h-48">
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

// ─── Component ────────────────────────────────────────────────────────────────

export function AuditDetail({ log, onClose }: AuditDetailProps) {
  return (
    <Modal title="Audit log detail" onClose={onClose} size="lg">
      <div className="flex flex-col gap-4">

        {/* Header summary */}
        <div className="info-zone flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div className="flex flex-col gap-1.5">
            <AuditActionBadge action={log.action} />
            <p className="font-sans text-sm font-medium text-dark">
              {log.entityType}
              {log.entityId && (
                <span className="font-mono text-xs text-neutral-text-muted ml-1.5">#{log.entityId}</span>
              )}
            </p>
            {log.description && (
              <p className="font-sans text-xs text-neutral-text-muted">{log.description}</p>
            )}
          </div>
          <div className="sm:text-right">
            <p className="font-sans text-xs font-medium text-dark">{log.username}</p>
            <p className="font-mono text-[10px] text-neutral-text-muted mt-0.5">
              {formatDate(log.timestamp)}
            </p>
          </div>
        </div>

        {/* Meta fields */}
        <div className="flex flex-col">
          <Row label="Log ID"     value={String(log.id)} />
          <Row label="User ID"    value={log.userId} />
          <Row label="Company ID" value={log.companyId} />
          <Row label="IP Address" value={log.ipAddress} />
          {log.userAgent && <UserAgentRow ua={log.userAgent} />}
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