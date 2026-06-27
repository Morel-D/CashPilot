import { Button } from '../../../components/ui/Button';
import type { Customer } from '../Customertypes';

interface CustomerViewProps {
  customer: Customer;
  onEdit:   () => void;
  onDelete: () => void;
  onClose:  () => void;
}

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div className="info-zone flex flex-col gap-1">
      <span className="field-label">{label}</span>
      <span className="font-sans text-sm text-dark">{value || '—'}</span>
    </div>
  );
}

export function CustomerView({ customer, onEdit, onDelete, onClose }: CustomerViewProps) {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-3 mb-1">
        <div className="flex items-center justify-center size-10 rounded-full bg-primary/10 text-primary shrink-0">
          <span className="font-sans text-sm font-semibold">
            {customer.name.split(' ').slice(0, 2).map((n) => n[0]).join('').toUpperCase()}
          </span>
        </div>
        <div>
          <p className="font-sans text-sm font-medium text-dark">{customer.name}</p>
          <p className="font-sans text-xs text-neutral-text-muted">ID #{customer.id}</p>
        </div>
      </div>

      <Field label="Email"  value={customer.email} />
      <Field label="Phone"  value={customer.phone} />
      {customer.createdAt && (
        <Field
          label="Created"
          value={new Date(customer.createdAt).toLocaleDateString('en-GB', {
            day: 'numeric', month: 'short', year: 'numeric',
          })}
        />
      )}

      <div className="flex gap-3 pt-1">
        <Button variant="danger"  size="md" onClick={onDelete} className="w-24">Delete</Button>
        <Button variant="outline" size="md" onClick={onClose}  className="w-24">Close</Button>
        <Button variant="primary" size="md" fullWidth onClick={onEdit}>Edit customer</Button>
      </div>
    </div>
  );
}