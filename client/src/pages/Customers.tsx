import { useEffect, useState } from 'react';
import { useCustomers } from '../modules/customers/hooks/useCustomers';
import { CustomerTable } from '../modules/customers/components/Customertable';
import { CustomerForm } from '../modules/customers/components/Customerform';
import { CustomerView } from '../modules/customers/components/Customerview';
import { CustomerDeleteConfirm } from '../modules/customers/components/Customerdeleteconfirm';
import { Modal } from '../components/ui/Modal';
import { Button } from '../components/ui/Button';
import { Loader } from '../components/ui/Loader';

const PAGE_SIZE = 10;

export default function CustomersPage() {
  const {
    page, loading, selected, modal,
    fetchCustomers, createCustomer, editCustomer, deleteCustomer,
    openModal, closeModal,
  } = useCustomers();

  const [actionLoading, setActionLoading] = useState(false);
  const [currentPage,   setCurrentPage]   = useState(0);

  useEffect(() => {
    fetchCustomers({ page: currentPage, size: PAGE_SIZE });
  }, [currentPage]);

  async function handleCreate(data: Parameters<typeof createCustomer>[0]) {
    setActionLoading(true);
    await createCustomer(data);
    setActionLoading(false);
    fetchCustomers({ page: currentPage, size: PAGE_SIZE });
    return true;
  }

  async function handleEdit(data: Parameters<typeof editCustomer>[1]) {
    if (!selected) return false;
    setActionLoading(true);
    const ok = await editCustomer(selected.id, data);
    setActionLoading(false);
    return ok;
  }

  async function handleDelete() {
    if (!selected) return;
    setActionLoading(true);
    await deleteCustomer(selected.id);
    setActionLoading(false);
    if (page && page.content.length === 1 && currentPage > 0) {
      setCurrentPage((p) => p - 1);
    } else {
      fetchCustomers({ page: currentPage, size: PAGE_SIZE });
    }
  }

  return (
    <div className="flex flex-col gap-4 md:gap-6">

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-display text-xl md:text-2xl font-light text-dark">Customers</h2>
          <p className="font-sans text-xs md:text-sm text-neutral-text-muted mt-0.5">
            {page
              ? `${page.totalElements} customer${page.totalElements !== 1 ? 's' : ''}`
              : 'Manage your customer accounts.'}
          </p>
        </div>
        <Button variant="primary" size="sm" onClick={() => openModal('create')}>
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="size-3.5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
          </svg>
          <span className="hidden sm:inline">Add customer</span>
          <span className="sm:hidden">Add</span>
        </Button>
      </div>

      {/* Content */}
      {loading && !page ? (
        <div className="flex justify-center py-20"><Loader /></div>
      ) : !page || page.content.length === 0 ? (
        <div className="card flex flex-col items-center justify-center py-16 gap-4 text-center">
          <div className="flex items-center justify-center size-12 rounded-2xl bg-primary/8 text-primary">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.25} stroke="currentColor" className="size-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 0 0 2.625.372 9.337 9.337 0 0 0 4.121-.952 4.125 4.125 0 0 0-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 0 1 8.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0 1 11.964-3.07M12 6.375a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0Zm8.25 2.25a2.625 2.625 0 1 1-5.25 0 2.625 2.625 0 0 1 5.25 0Z" />
            </svg>
          </div>
          <div>
            <h3 className="font-display text-base font-light text-dark">No customers yet</h3>
            <p className="font-sans text-sm text-neutral-text-muted mt-1 max-w-xs">
              Add your first customer to start tracking invoices and payments.
            </p>
          </div>
          <Button variant="primary" size="md" onClick={() => openModal('create')}>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="size-4">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
            </svg>
            Add customer
          </Button>
        </div>
      ) : (
        <CustomerTable
          page={page}
          onView={(c)   => openModal('view', c)}
          onEdit={(c)   => openModal('edit', c)}
          onDelete={(c) => openModal('delete', c)}
          onPage={setCurrentPage}
        />
      )}

      {/* Modals */}
      {modal === 'create' && (
        <Modal title="New customer" onClose={closeModal} size="md">
          <CustomerForm mode="create" loading={actionLoading} onSubmit={handleCreate} onCancel={closeModal} />
        </Modal>
      )}
      {modal === 'edit' && selected && (
        <Modal title="Edit customer" onClose={closeModal} size="md">
          <CustomerForm mode="edit" initial={selected} loading={actionLoading} onSubmit={handleEdit} onCancel={closeModal} />
        </Modal>
      )}
      {modal === 'view' && selected && (
        <Modal title="Customer details" onClose={closeModal} size="md">
          <CustomerView customer={selected} onEdit={() => openModal('edit', selected)} onDelete={() => openModal('delete', selected)} onClose={closeModal} />
        </Modal>
      )}
      {modal === 'delete' && selected && (
        <Modal title="Delete customer" onClose={closeModal} size="sm">
          <CustomerDeleteConfirm customer={selected} loading={actionLoading} onConfirm={handleDelete} onCancel={closeModal} />
        </Modal>
      )}

    </div>
  );
}