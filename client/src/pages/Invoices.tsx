import { useEffect, useState } from 'react';
import { useInvoices } from '../modules/invoice/hooks/Useinvoices';
import { InvoiceTable } from '../modules/invoice/components/Invoicetable';
import { InvoiceForm } from '../modules/invoice/components/Invoiceform';
import { InvoiceView } from '../modules/invoice/components/Invoiceview';
import { InvoicePayForm } from '../modules/invoice/components/Invoicepayform';
import { CustomerDeleteConfirm } from '../modules/customers/components/Customerdeleteconfirm';
import { Modal } from '../components/ui/Modal';
import { Button } from '../components/ui/Button';
import { Loader } from '../components/ui/Loader';
import type { InvoiceStatus } from '../modules/invoice/Invoicetypes';

const PAGE_SIZE = 10;

const STATUS_FILTERS: { value: InvoiceStatus | null; label: string }[] = [
  { value: null,           label: 'All'       },
  { value: 'DRAFT',        label: 'Draft'     },
  { value: 'ISSUED',       label: 'Issued'    },
  { value: 'SENT',         label: 'Sent'      },
  { value: 'PARTIALLY_PAID', label: 'Partial' },
  { value: 'PAID',         label: 'Paid'      },
  { value: 'OVERDUE',      label: 'Overdue'   },
  { value: 'CANCELLED',    label: 'Cancelled' },
];

export default function InvoicesPage() {
  const {
    page, loading, selected, modal, statusFilter,
    setStatusFilter,
    fetchInvoices, createInvoice, editInvoice, deleteInvoice,
    issueInvoice, sendInvoice, payInvoice, cancelInvoice,
    openModal, closeModal,
  } = useInvoices();

  const [actionLoading, setActionLoading] = useState(false);
  const [currentPage,   setCurrentPage]   = useState(0);

  function load(p = currentPage, status = statusFilter) {
    fetchInvoices({ page: p, size: PAGE_SIZE, ...(status ? { status } : {}) });
  }

  useEffect(() => { load(); }, [currentPage, statusFilter]);

  function handleFilterChange(status: InvoiceStatus | null) {
    setStatusFilter(status);
    setCurrentPage(0);
  }

  async function handleCreate(data: Parameters<typeof createInvoice>[0]) {
    setActionLoading(true);
    await createInvoice(data);
    setActionLoading(false);
    load(currentPage);
    return true;
  }

  async function handleEdit(data: Parameters<typeof editInvoice>[1]) {
    if (!selected) return false;
    setActionLoading(true);
    const ok = await editInvoice(selected.id, data);
    setActionLoading(false);
    return ok;
  }

  async function handleDelete() {
    if (!selected) return;
    setActionLoading(true);
    await deleteInvoice(selected.id);
    setActionLoading(false);
    if (page && page.content.length === 1 && currentPage > 0) {
      setCurrentPage((p) => p - 1);
    } else {
      load(currentPage);
    }
  }

  async function handlePay(paidAmount: number, paymentMethod: string) {
    if (!selected) return false;
    setActionLoading(true);
    const ok = await payInvoice(selected.id, { paidAmount, paymentMethod });
    setActionLoading(false);
    return ok;
  }

  return (
    <div className="flex flex-col gap-6 max-w-6xl">

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-display text-2xl font-light text-dark">Invoices</h2>
          <p className="font-sans text-sm text-neutral-text-muted mt-0.5">
            {page ? `${page.totalElements} invoice${page.totalElements !== 1 ? 's' : ''}` : 'Manage your invoices.'}
          </p>
        </div>
        <Button variant="primary" size="md" onClick={() => openModal('create')}>
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="size-4">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
          </svg>
          New invoice
        </Button>
      </div>

      {/* Status filter tabs */}
      <div className="flex items-center gap-1.5 flex-wrap">
        {STATUS_FILTERS.map(({ value, label }) => (
          <button
            key={String(value)}
            onClick={() => handleFilterChange(value)}
            className={[
              'font-sans text-xs font-medium px-3 py-1.5 rounded-lg border transition-all duration-150',
              statusFilter === value
                ? 'bg-dark text-white border-dark'
                : 'bg-white text-neutral-text-muted border-dark/10 hover:text-dark hover:border-dark/20',
            ].join(' ')}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Content */}
      {loading && !page ? (
        <div className="flex justify-center py-20"><Loader /></div>
      ) : !page || page.content.length === 0 ? (
        <div className="card flex flex-col items-center justify-center py-20 gap-4 text-center">
          <div className="flex items-center justify-center size-14 rounded-2xl bg-primary/8 text-primary">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.25} stroke="currentColor" className="size-7">
              <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" />
            </svg>
          </div>
          <div>
            <h3 className="font-display text-base font-light text-dark">
              {statusFilter ? `No ${statusFilter.toLowerCase()} invoices` : 'No invoices yet'}
            </h3>
            <p className="font-sans text-sm text-neutral-text-muted mt-1 max-w-xs">
              {statusFilter
                ? 'Try a different filter or create a new invoice.'
                : 'Create your first invoice to start tracking payments.'}
            </p>
          </div>
          {!statusFilter && (
            <Button variant="primary" size="md" onClick={() => openModal('create')}>
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="size-4">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
              </svg>
              New invoice
            </Button>
          )}
        </div>
      ) : (
        <InvoiceTable
          page={page}
          onView={(i)   => openModal('view', i)}
          onEdit={(i)   => openModal('edit', i)}
          onDelete={(i) => openModal('delete', i)}
          onPage={(p)   => setCurrentPage(p)}
        />
      )}

      {/* ── Modals ─────────────────────────────────────────────────────────── */}

      {modal === 'create' && (
        <Modal title="New invoice" onClose={closeModal} size="lg">
          <InvoiceForm mode="create" loading={actionLoading} onSubmit={handleCreate} onCancel={closeModal} />
        </Modal>
      )}

      {modal === 'edit' && selected && (
        <Modal title="Edit invoice" onClose={closeModal} size="lg">
          <InvoiceForm mode="edit" initial={selected} loading={actionLoading} onSubmit={handleEdit} onCancel={closeModal} />
        </Modal>
      )}

      {modal === 'view' && selected && (
        <Modal title="Invoice details" onClose={closeModal} size="lg">
          <InvoiceView
            invoice={selected}
            onEdit={()    => openModal('edit', selected)}
            onDelete={()  => openModal('delete', selected)}
            onClose={closeModal}
            onIssue={issueInvoice}
            onSend={sendInvoice}
            onPay={() => openModal('pay', selected)}
            onCancel={cancelInvoice}
          />
        </Modal>
      )}

      {modal === 'pay' && selected && (
        <Modal title="Record payment" onClose={closeModal} size="md">
          <InvoicePayForm
            invoice={selected}
            loading={actionLoading}
            onSubmit={handlePay}
            onCancel={closeModal}
          />
        </Modal>
      )}

      {modal === 'delete' && selected && (
        <Modal title="Delete invoice" onClose={closeModal} size="sm">
          <CustomerDeleteConfirm
            customer={{ id: selected.id, name: selected.title, email: '', phone: '' }}
            loading={actionLoading}
            onConfirm={handleDelete}
            onCancel={closeModal}
          />
        </Modal>
      )}

    </div>
  );
}