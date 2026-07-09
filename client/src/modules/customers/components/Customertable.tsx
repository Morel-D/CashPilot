import type { Customer } from '../Customertypes';
import { Button } from '../../../components/ui/Button';
import type { Page } from '../../../types/page';

interface CustomerTableProps {
  page:     Page<Customer>;
  onView:   (c: Customer) => void;
  onEdit:   (c: Customer) => void;
  onDelete: (c: Customer) => void;
  onPage:   (page: number) => void;
}

function initials(name: string) {
  return name.split(' ').slice(0, 2).map((n) => n[0]).join('').toUpperCase();
}

export function CustomerTable({ page, onView, onEdit, onDelete, onPage }: CustomerTableProps) {
  const { content, number, totalPages, totalElements, size } = page;
  const from = number * size + 1;
  const to   = Math.min(from + content.length - 1, totalElements);

  return (
    <div className="card p-0 overflow-hidden flex flex-col">

      {/* ── Mobile: card list ─────────────────────────────────────────────── */}
      <div className="md:hidden divide-y divide-dark/[0.04]">
        {content.map((c) => (
          <div
            key={c.id}
            className="flex items-center justify-between px-4 py-3 hover:bg-neutral-bg-soft transition-colors cursor-pointer"
            onClick={() => onView(c)}
          >
            <div className="flex items-center gap-3 min-w-0">
              <div className="flex items-center justify-center size-8 rounded-full bg-primary/10 shrink-0">
                <span className="font-sans text-[11px] font-semibold text-primary">
                  {initials(c.name)}
                </span>
              </div>
              <div className="min-w-0">
                <p className="font-sans text-sm font-medium text-dark truncate">{c.name}</p>
                <p className="font-sans text-xs text-neutral-text-muted truncate">{c.email}</p>
              </div>
            </div>
            {/* Inline actions */}
            <div
              className="flex items-center gap-1 shrink-0 ml-2"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => onEdit(c)}
                className="p-1.5 rounded-md text-neutral-text-muted hover:text-dark hover:bg-dark/5 transition-colors"
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-3.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125" />
                </svg>
              </button>
              <button
                onClick={() => onDelete(c)}
                className="p-1.5 rounded-md text-neutral-text-muted hover:text-red-500 hover:bg-red-500/5 transition-colors"
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-3.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                </svg>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* ── Desktop: full table ───────────────────────────────────────────── */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b border-dark/[0.06]">
              {['Customer', 'Email', 'Phone', ''].map((h) => (
                <th key={h} className="px-4 py-3 font-sans text-[11px] font-semibold uppercase tracking-wider text-neutral-text-muted">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-dark/[0.04]">
            {content.map((c) => (
              <tr
                key={c.id}
                className="group hover:bg-neutral-bg-soft transition-colors cursor-pointer"
                onClick={() => onView(c)}
              >
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <div className="flex items-center justify-center size-7 rounded-full bg-primary/10 shrink-0">
                      <span className="font-sans text-[10px] font-semibold text-primary">
                        {initials(c.name)}
                      </span>
                    </div>
                    <span className="font-sans text-sm font-medium text-dark">{c.name}</span>
                  </div>
                </td>
                <td className="px-4 py-3 font-sans text-sm text-neutral-text-muted">{c.email}</td>
                <td className="px-4 py-3 font-mono text-xs text-neutral-text-muted">{c.phone}</td>
                <td className="px-4 py-3">
                  <div
                    className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <button
                      onClick={() => onEdit(c)}
                      title="Edit"
                      className="p-1.5 rounded-md text-neutral-text-muted hover:text-dark hover:bg-dark/5 transition-colors"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-3.5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125" />
                      </svg>
                    </button>
                    <button
                      onClick={() => onDelete(c)}
                      title="Delete"
                      className="p-1.5 rounded-md text-neutral-text-muted hover:text-red-500 hover:bg-red-500/5 transition-colors"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-3.5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                      </svg>
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between px-4 py-3 border-t border-dark/[0.06]">
        <span className="font-sans text-xs text-neutral-text-muted">
          {from}–{to} of {totalElements}
        </span>
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