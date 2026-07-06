import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Input } from '../../../components/ui/Input';
import { Select } from '../../../components/ui/Select';
import { Button } from '../../../components/ui/Button';
import { useRegister } from '../hooks/useRegister';
import type { RegisterStep1, RegisterStep2 } from '../AuthTypes';

// ─── Currency options ─────────────────────────────────────────────────────────

const CURRENCIES = [
  { value: 'XAF', label: 'XAF — Central African Franc' },
  { value: 'USD', label: 'USD — US Dollar' },
  { value: 'EUR', label: 'EUR — Euro' },
  { value: 'GBP', label: 'GBP — British Pound' },
  { value: 'NGN', label: 'NGN — Nigerian Naira' },
  { value: 'GHS', label: 'GHS — Ghanaian Cedi' },
  { value: 'KES', label: 'KES — Kenyan Shilling' },
  { value: 'ZAR', label: 'ZAR — South African Rand' },
];

// ─── Step 1 defaults ──────────────────────────────────────────────────────────

const STEP1_DEFAULT: RegisterStep1 = {
  fullName: '',
  email:    '',
  password: '',
  phone:    '',
};

const STEP2_DEFAULT: RegisterStep2 = {
  companyName: '',
  currency:    'XAF',
};

// ─── Icons ────────────────────────────────────────────────────────────────────

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
const BuildingIcon = (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-4">
    <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 21h16.5M4.5 3h15M5.25 3v18m13.5-18v18M9 6.75h1.5m-1.5 3h1.5m-1.5 3h1.5m3-6H15m-1.5 3H15m-1.5 3H15M9 21v-3.375c0-.621.504-1.125 1.125-1.125h3.75c.621 0 1.125.504 1.125 1.125V21" />
  </svg>
);

// ─── Validation ───────────────────────────────────────────────────────────────

function validateStep1(data: RegisterStep1): Partial<RegisterStep1> {
  const errors: Partial<RegisterStep1> = {};
  if (!data.fullName.trim())          errors.fullName = 'Full name is required.';
  if (!data.email.includes('@'))      errors.email    = 'Enter a valid email address.';
  if (data.password.length < 8)       errors.password = 'Password must be at least 8 characters.';
  if (!data.phone.trim())             errors.phone    = 'Phone number is required.';
  return errors;
}

function validateStep2(data: RegisterStep2): Partial<RegisterStep2> {
  const errors: Partial<RegisterStep2> = {};
  if (!data.companyName.trim()) errors.companyName = 'Company name is required.';
  if (!data.currency)           errors.currency    = 'Select a currency.';
  return errors;
}

// ─── Component ────────────────────────────────────────────────────────────────

export function RegisterForm() {
  const [step, setStep]     = useState<1 | 2>(1);
  const [step1, setStep1]   = useState<RegisterStep1>(STEP1_DEFAULT);
  const [step2, setStep2]   = useState<RegisterStep2>(STEP2_DEFAULT);
  const [errors1, setErrors1] = useState<Partial<RegisterStep1>>({});
  const [errors2, setErrors2] = useState<Partial<RegisterStep2>>({});
  const [leaving, setLeaving] = useState(false);

  const { register, loading } = useRegister();

  // ── Step transition ─────────────────────────────────────────────────────────

  function goToStep2() {
    const errs = validateStep1(step1);
    if (Object.keys(errs).length) { setErrors1(errs); return; }
    setErrors1({});
    setLeaving(true);
    setTimeout(() => { setStep(2); setLeaving(false); }, 220);
  }

  function goBack() {
    setLeaving(true);
    setTimeout(() => { setStep(1); setLeaving(false); }, 220);
  }

  // ── Submit ──────────────────────────────────────────────────────────────────

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const errs = validateStep2(step2);
    if (Object.keys(errs).length) { setErrors2(errs); return; }
    setErrors2({});
    await register(step1, step2);
  }

  // ── Shared input change helpers ─────────────────────────────────────────────

  function onStep1Change(field: keyof RegisterStep1) {
    return (e: React.ChangeEvent<HTMLInputElement>) => {
      setStep1((prev) => ({ ...prev, [field]: e.target.value }));
      if (errors1[field]) setErrors1((prev) => ({ ...prev, [field]: undefined }));
    };
  }

  function onStep2Change(field: keyof RegisterStep2) {
    return (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
      setStep2((prev) => ({ ...prev, [field]: e.target.value }));
      if (errors2[field]) setErrors2((prev) => ({ ...prev, [field]: undefined }));
    };
  }

  return (
    <div className="w-full">

      {/* ── Step indicator ─────────────────────────────────────────────────── */}
      <div className="flex items-center gap-3 mb-8">
        {[1, 2].map((s) => (
          <div key={s} className="flex items-center gap-3">
            <div className={[
              'flex items-center justify-center w-7 h-7 rounded-full text-xs font-semibold font-sans transition-all duration-300',
              step === s
                ? 'bg-primary text-white shadow-primary'
                : step > s
                ? 'bg-primary/15 text-primary'
                : 'bg-neutral-bg-soft text-neutral-text-muted',
            ].join(' ')}>
              {step > s ? (
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="size-3.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                </svg>
              ) : s}
            </div>
            <span className={`font-sans text-xs font-medium ${step === s ? 'text-dark' : 'text-neutral-text-muted'}`}>
              {s === 1 ? 'Your info' : 'Company'}
            </span>
            {s === 1 && (
              <div className={`h-px w-8 transition-colors duration-300 ${step === 2 ? 'bg-primary/40' : 'bg-dark/10'}`} />
            )}
          </div>
        ))}
      </div>

      {/* ── Sliding panel ──────────────────────────────────────────────────── */}
      <div
        className={`transition-all duration-220 ease-in-out ${
          leaving ? 'opacity-0 translate-x-3' : 'opacity-100 translate-x-0'
        }`}
      >
        {/* STEP 1 — Personal info */}
        {step === 1 && (
          <div className="flex flex-col gap-4">
            <Input
              label="Full name"
              placeholder="Tchaptche Morel"
              value={step1.fullName}
              onChange={onStep1Change('fullName')}
              error={errors1.fullName}
              leftIcon={UserIcon}
              showRequired
            />
            <Input
              label="Email address"
              type="email"
              placeholder="you@company.com"
              value={step1.email}
              onChange={onStep1Change('email')}
              error={errors1.email}
              leftIcon={EmailIcon}
              showRequired
            />
            <Input
              label="Password"
              type="password"
              placeholder="Min. 8 characters"
              value={step1.password}
              onChange={onStep1Change('password')}
              error={errors1.password}
              showRequired
            />
            <Input
              label="Phone number"
              type="tel"
              placeholder="+237 655 000 000"
              value={step1.phone}
              onChange={onStep1Change('phone')}
              error={errors1.phone}
              leftIcon={PhoneIcon}
              showRequired
            />

            <Button
              variant="primary"
              size="md"
              fullWidth
              onClick={goToStep2}
              className="mt-2"
            >
              Continue
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="size-4">
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
              </svg>
            </Button>
          </div>
        )}

        {/* STEP 2 — Company info */}
        {step === 2 && (
          <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-4">
            <Input
              label="Company name"
              placeholder="Kora Inc."
              value={step2.companyName}
              onChange={onStep2Change('companyName')}
              error={errors2.companyName}
              leftIcon={BuildingIcon}
              showRequired
            />
            <Select
              label="Base currency"
              options={CURRENCIES}
              value={step2.currency}
              onChange={onStep2Change('currency')}
              error={errors2.currency}
              required
            />

            <div className="flex gap-3 mt-2">
              <Button
                type="button"
                variant="outline"
                size="md"
                onClick={goBack}
                className="w-28"
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="size-4">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" />
                </svg>
                Back
              </Button>
              <Button
                type="submit"
                variant="primary"
                size="md"
                fullWidth
                loading={loading}
              >
                {loading ? 'Creating account…' : 'Create account'}
              </Button>
            </div>
          </form>
        )}
      </div>

      {/* ── Footer link ────────────────────────────────────────────────────── */}
      <p className="mt-6 text-center font-sans text-sm text-neutral-text-muted">
        Already have an account?{' '}
        <Link to="/login" className="text-primary font-medium hover:text-primary-600 transition-colors">
          Sign in
        </Link>
      </p>
    </div>
  );
}