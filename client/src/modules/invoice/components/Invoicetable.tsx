import { InvoiceStatusBadge } from './Invoicestatusbadge';
import { Button } from '../../../components/ui/Button';
import type { Invoice } from '../Invoicetypes';
import { useAuthStore } from '../../auth/store/authStore';
import type { Page } from '../../../types/page';

interface InvoiceTableProps {
  page:     Page<Invoice>;
  onView:   (i: Invoice) => void;
  onEdit:   (i: Invoice) => void;
  onDelete: (i: Invoice) => void;
  onPage:   (page: number) => void;
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-GB', {
    day: 'numeric', month: 'short', year: 'numeric',
  });
}

export function InvoiceTable({ page, onView, onEdit, onDelete, onPage }: InvoiceTableProps) {
  const { user }  = useAuthStore();
  const currency  = user?.company?.currency ?? '';
  const { content, number, totalPages, totalElements, size } = page;
  const from = number * size + 1;
  const to   = Math.min(from + content.length - 1, totalElements);

  return (
    <div className="card p-0 overflow-hidden flex flex-col">

      {/* ── Mobile: card list ─────────────────────────────────────────────── */}
      <div className="md:hidden divide-y divide-dark/[0.04]">
        {content.map((inv) => (
          <div
            key={inv.id}
            className="flex items-start justify-between px-4 py-3 hover:bg-neutral-bg-soft transition-colors cursor-pointer gap-3"
            onClick={() => onView(inv)}
          >
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2 mb-0.5">
                <span className="font-mono text-[10px] text-neutral-text-muted shrink-0">{inv.number}</span>
                <InvoiceStatusBadge status={inv.status} />
              </div>
              <p className="font-sans text-sm font-medium text-dark truncate">{inv.title}</p>
              <p className="font-sans text-xs text-neutral-text-muted mt-0.5">
                {inv.customer?.name ?? <span className="italic">Internal</span>}
                {' · '}Due {formatDate(inv.dueAt)}
              </p>
            </div>
            <div className="text-right shrink-0">
              <p className="font-mono text-sm font-semibold text-dark">
                {currency} {inv.amount.toLocaleString('en', { minimumFractionDigits: 2 })}
              </p>
              {inv.status === 'DRAFT' && (
                <div
                  className="flex items-center justify-end gap-1 mt-1"
                  onClick={(e) => e.stopPropagation()}
                >
                  <button
                    onClick={() => onEdit(inv)}
                    className="p-1 rounded text-neutral-text-muted hover:text-dark hover:bg-dark/5 transition-colors"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-3.5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125" />
                    </svg>
                  </button>
                  <button
                    onClick={() => onDelete(inv)}
                    className="p-1 rounded text-neutral-text-muted hover:text-red-500 hover:bg-red-500/5 transition-colors"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-3.5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                    </svg>
                  </button>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* ── Desktop: full table ───────────────────────────────────────────── */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b border-dark/[0.06]">
              {['Number', 'Title', 'Customer', 'Amount', 'Due date', 'Status', ''].map((h) => (
                <th key={h} className="px-4 py-3 font-sans text-[11px] font-semibold uppercase tracking-wider text-neutral-text-muted whitespace-nowrap">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-dark/[0.04]">
            {content.map((inv) => (
              <tr
                key={inv.id}
                className="group hover:bg-neutral-bg-soft transition-colors cursor-pointer"
                onClick={() => onView(inv)}
              >
                <td className="px-4 py-3 font-mono text-xs text-neutral-text-muted">{inv.number}</td>
                <td className="px-4 py-3">
                  <p className="font-sans text-sm font-medium text-dark">{inv.title}</p>
                  {inv.description && (
                    <p className="font-sans text-xs text-neutral-text-muted truncate max-w-[200px]">{inv.description}</p>
                  )}
                </td>
                <td className="px-4 py-3 font-sans text-sm text-neutral-text-muted">
                  {inv.customer?.name ?? <span className="italic text-xs">Internal</span>}
                </td>
                <td className="px-4 py-3 font-mono text-sm text-dark font-medium whitespace-nowrap">
                  {currency} {inv.amount.toLocaleString('en', { minimumFractionDigits: 2 })}
                </td>
                <td className="px-4 py-3 font-sans text-xs text-neutral-text-muted whitespace-nowrap">
                  {formatDate(inv.dueAt)}
                </td>
                <td className="px-4 py-3">
                  <InvoiceStatusBadge status={inv.status} />
                </td>
                <td className="px-4 py-3">
                  <div
                    className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={(e) => e.stopPropagation()}
                  >
                    {inv.status === 'DRAFT' && (
                      <>
                        <button onClick={() => onEdit(inv)} title="Edit" className="p-1.5 rounded-md text-neutral-text-muted hover:text-dark hover:bg-dark/5 transition-colors">
                          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-3.5">
                            <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125" />
                          </svg>
                        </button>
                        <button onClick={() => onDelete(inv)} title="Delete" className="p-1.5 rounded-md text-neutral-text-muted hover:text-red-500 hover:bg-red-500/5 transition-colors">
                          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-3.5">
                            <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                          </svg>
                        </button>
                      </>
                    )}
                  </div>
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