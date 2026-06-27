import { useState } from 'react';
import { Input } from '../../../components/ui/Input';
import { Button } from '../../../components/ui/Button';
import { validateCreateCustomer, validateUpdateCustomer, type CustomerFormErrors } from '../utils/Customervalidation';
import type { Customer, CreateCustomerRequest } from '../Customertypes';

interface CustomerFormProps {
  initial?:  Partial<Customer>;
  onSubmit:  (data: CreateCustomerRequest) => Promise<boolean>;
  onCancel:  () => void;
  loading:   boolean;
  mode:      'create' | 'edit';
}

const EMPTY: CreateCustomerRequest = { name: '', email: '', phone: '' };

const UserIcon = (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-4">
    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
  </svg>
);
const EmailIcon = (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-4">
    <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75" />
  </svg>
);
const PhoneIcon = (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-4">
    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 0 0 2.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 0 1-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 0 0-1.091-.852H4.5A2.25 2.25 0 0 0 2.25 6.75Z" />
  </svg>
);

export function CustomerForm({ initial, onSubmit, onCancel, loading, mode }: CustomerFormProps) {
  const [form, setForm]     = useState<CreateCustomerRequest>({
    name:  initial?.name  ?? EMPTY.name,
    email: initial?.email ?? EMPTY.email,
    phone: initial?.phone ?? EMPTY.phone,
  });
  const [errors, setErrors] = useState<CustomerFormErrors>({});

  function onChange(field: keyof CreateCustomerRequest) {
    return (e: React.ChangeEvent<HTMLInputElement>) => {
      setForm((prev) => ({ ...prev, [field]: e.target.value }));
      if (errors[field]) setErrors((prev) => ({ ...prev, [field]: undefined }));
    };
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const errs = mode === 'create'
      ? validateCreateCustomer(form)
      : validateUpdateCustomer(form);
    if (Object.keys(errs).length) { setErrors(errs); return; }
    await onSubmit(form);
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-4">
      <Input
        label="Full name"
        placeholder="Jean Dupont"
        value={form.name}
        onChange={onChange('name')}
        error={errors.name}
        leftIcon={UserIcon}
        showRequired
      />
      <Input
        label="Email address"
        type="email"
        placeholder="jean@example.com"
        value={form.email}
        onChange={onChange('email')}
        error={errors.email}
        leftIcon={EmailIcon}
        showRequired
      />
      <Input
        label="Phone number"
        type="tel"
        placeholder="+237 699 887 766"
        value={form.phone}
        onChange={onChange('phone')}
        error={errors.phone}
        leftIcon={PhoneIcon}
        showRequired
      />

      <div className="flex gap-3 pt-1">
        <Button type="button" variant="outline" size="md" onClick={onCancel} className="w-24">
          Cancel
        </Button>
        <Button type="submit" variant="primary" size="md" fullWidth loading={loading}>
          {loading
            ? mode === 'create' ? 'Creating…' : 'Saving…'
            : mode === 'create' ? 'Create customer' : 'Save changes'}
        </Button>
      </div>
    </form>
  );
}