import type { ReactNode } from 'react';

/**
 * Shared layout for Login & Register.
 * Left  → brand panel (dark, decorative)
 * Right → form panel (white)
 */
export function AuthLayout({
  title,
  subtitle,
  children,
}: {
  title:    string;
  subtitle: string;
  children: ReactNode;
}) {
  return (
    <div className="min-h-screen flex">

      {/* ── Left — brand panel ─────────────────────────────────────────────── */}
      <div className="hidden lg:flex lg:w-[46%] bg-dark flex-col justify-between p-12 relative overflow-hidden">

        {/* Decorative rings */}
        <div className="absolute -top-24 -left-24 w-96 h-96 rounded-full border border-primary/10" />
        <div className="absolute -top-12 -left-12 w-72 h-72 rounded-full border border-primary/10" />
        <div className="absolute bottom-0 right-0 w-80 h-80 rounded-full border border-primary/5 translate-x-1/3 translate-y-1/3" />

        {/* Glow */}
        <div className="absolute top-1/3 left-1/4 w-64 h-64 bg-primary/10 rounded-full blur-3xl pointer-events-none" />

        {/* Logo */}
        <div className="relative z-10">
          <span className="font-display text-2xl font-light text-white">
            Cash<span className="text-primary">Pilot</span>
          </span>
        </div>

        {/* Center copy */}
        <div className="relative z-10 flex flex-col gap-6">
          <p className="font-display text-4xl font-light text-white leading-snug">
            Treasury & cash <br />
            <span className="text-primary">under control.</span>
          </p>
          <p className="font-sans text-sm text-white/40 max-w-xs leading-relaxed">
            Track invoices, manage payments, and keep every franc accounted for all in one place.
          </p>

          {/* Stats row */}
          {/* <div className="flex gap-8 mt-4">
            {[
              { value: '99.9%', label: 'Uptime' },
              { value: '<1s',   label: 'Response time' },
              { value: 'SOC 2', label: 'Compliant' },
            ].map(({ value, label }) => (
              <div key={label} className="flex flex-col gap-0.5">
                <span className="font-mono text-lg font-medium text-white">{value}</span>
                <span className="font-sans text-xs text-white/40">{label}</span>
              </div>
            ))}
          </div> */}
        </div>

        {/* Bottom tagline */}
        <p className="relative z-10 font-sans text-xs text-white/20">
          © {new Date().getFullYear()} CashPilot. Built for modern finance teams.
        </p>
      </div>

      {/* ── Right — form panel ─────────────────────────────────────────────── */}
      <div className="flex-1 flex flex-col justify-center items-center px-6 py-12 bg-neutral-white">
        <div className="w-full max-w-md">

          {/* Mobile logo */}
          <div className="lg:hidden mb-8">
            <span className="font-display text-2xl font-light text-dark">
              Cash<span className="text-primary">Pilot</span>
            </span>
          </div>

          {/* Heading */}
          <div className="mb-8">
            <h1 className="font-display text-3xl font-light text-dark mb-1.5">
              {title}
            </h1>
            <p className="font-sans text-sm text-neutral-text-muted">
              {subtitle}
            </p>
          </div>

          {/* Form slot */}
          {children}
        </div>
      </div>

    </div>
  );
}