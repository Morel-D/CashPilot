import { Button } from '../../../components/ui/Button';
import type { Customer } from '../Customertypes';

interface CustomerDeleteConfirmProps {
  customer: Customer;
  onConfirm: () => Promise<void>;
  onCancel:  () => void;
  loading:   boolean;
}

export function CustomerDeleteConfirm({ customer, onConfirm, onCancel, loading }: CustomerDeleteConfirmProps) {
  return (
    <div className="flex flex-col gap-5">
      <div className="info-zone flex items-start gap-3">
        <div className="flex items-center justify-center size-8 rounded-full bg-red-500/10 text-red-500 shrink-0 mt-0.5">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="size-4">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z" />
          </svg>
        </div>
        <div>
          <p className="font-sans text-sm font-medium text-dark">
            Delete <span className="text-red-500">{customer.name}</span>?
          </p>
          <p className="font-sans text-xs text-neutral-text-muted mt-0.5">
            This action cannot be undone. All data associated with this customer will be permanently removed.
          </p>
        </div>
      </div>

      <div className="flex gap-3">
        <Button type="button" variant="outline" size="md" onClick={onCancel} className="flex-1">
          Cancel
        </Button>
        <Button
          type="button"
          variant="danger"
          size="md"
          className="flex-1"
          loading={loading}
          onClick={onConfirm}
        >
          {loading ? 'Deleting…' : 'Delete customer'}
        </Button>
      </div>
    </div>
  );
}