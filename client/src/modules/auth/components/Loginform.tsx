import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Input } from '../../../components/ui/Input';
import { Button } from '../../../components/ui/Button';
import { useLogin } from '../hook/Uselogin';
import type { LoginRequest } from '../AuthTypes';

const EmailIcon = (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-4">
    <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75" />
  </svg>
);

function validateLogin(data: LoginRequest): Partial<LoginRequest> {
  const errors: Partial<LoginRequest> = {};
  if (!data.email.includes('@')) errors.email    = 'Enter a valid email address.';
  if (!data.password)            errors.password = 'Password is required.';
  return errors;
}

export function LoginForm() {
  const [form, setForm]     = useState<LoginRequest>({ email: '', password: '' });
  const [errors, setErrors] = useState<Partial<LoginRequest>>({});
  const { login, loading }  = useLogin();

  function onChange(field: keyof LoginRequest) {
    return (e: React.ChangeEvent<HTMLInputElement>) => {
      setForm((prev) => ({ ...prev, [field]: e.target.value }));
      if (errors[field]) setErrors((prev) => ({ ...prev, [field]: undefined }));
    };
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const errs = validateLogin(form);
    if (Object.keys(errs).length) { setErrors(errs); return; }
    await login(form);
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="w-full flex flex-col gap-4">

      <Input
        label="Email address"
        type="email"
        placeholder="you@company.com"
        value={form.email}
        onChange={onChange('email')}
        error={errors.email}
        leftIcon={EmailIcon}
        showRequired
      />

      <Input
        label="Password"
        type="password"
        placeholder="Your password"
        value={form.password}
        onChange={onChange('password')}
        error={errors.password}
        showRequired
      />

      <Button
        type="submit"
        variant="primary"
        size="md"
        fullWidth
        loading={loading}
        className="mt-2"
      >
        {loading ? 'Signing in…' : 'Sign in'}
      </Button>

      <p className="text-center font-sans text-sm text-neutral-text-muted">
        No account yet?{' '}
        <Link to="/register" className="text-primary font-medium hover:text-primary-600 transition-colors">
          Create one
        </Link>
      </p>

    </form>
  );
}