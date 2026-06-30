import { useAuthStore } from '../modules/auth/store/authStore';

// ─── Stat card ────────────────────────────────────────────────────────────────

function StatCard({
  label,
  value,
  note,
  icon,
}: {
  label: string;
  value: string;
  note:  string;
  icon:  React.ReactNode;
}) {
  return (
    <div className="card flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <span className="field-label">{label}</span>
        <span className="text-neutral-text-muted/50">{icon}</span>
      </div>
      <div>
        <p className="amount text-2xl font-semibold text-dark">{value}</p>
        <p className="font-sans text-xs text-neutral-text-muted mt-0.5">{note}</p>
      </div>
    </div>
  );
}

// ─── Empty state ──────────────────────────────────────────────────────────────

function EmptyState({ label }: { label: string }) {
  return (
    <div className="info-zone flex flex-col items-center justify-center py-12 gap-2">
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1} stroke="currentColor" className="size-8 text-neutral-text-muted/30">
        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 12h16.5m-16.5 3.75h16.5M3.75 19.5h16.5M5.625 4.5h12.75a1.875 1.875 0 0 1 0 3.75H5.625a1.875 1.875 0 0 1 0-3.75Z" />
      </svg>
      <p className="font-sans text-sm text-neutral-text-muted">{label}</p>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function DashboardPage() {
  const { user } = useAuthStore();
  const currency = user?.company?.currency ?? '';
  const firstName = user?.fullName?.split(' ')[0] ?? 'there';

  const STATS = [
    {
      label: 'Total Balance',
      value: `${currency} —`,
      note:  'Across all accounts',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-4">
          <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18.75a60.07 60.07 0 0 1 15.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 0 1 3 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-.375m1.5-1.5H21a.75.75 0 0 0-.75.75v.75m0 0H3.75m0 0h-.375a1.125 1.125 0 0 1-1.125-1.125V15m1.5 1.5v-.75A.75.75 0 0 0 3 15h-.75M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Zm3 0h.008v.008H18V10.5Zm-12 0h.008v.008H6V10.5Z" />
        </svg>
      ),
    },
    {
      label: 'Pending Invoices',
      value: `${currency} —`,
      note:  'Awaiting payment',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-4">
          <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" />
        </svg>
      ),
    },
    {
      label: 'Outgoing Payments',
      value: `${currency} —`,
      note:  'This month',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-4">
          <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6 9 12.75l4.286-4.286a11.948 11.948 0 0 1 4.306 6.43l.776 2.898m0 0 3.182-5.511m-3.182 5.51-5.511-3.181" />
        </svg>
      ),
    },
    {
      label: 'Received',
      value: `${currency} —`,
      note:  'This month',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-4">
          <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18 9 11.25l4.306 4.307a11.95 11.95 0 0 1 5.814-5.519l2.74-1.22m0 0-5.94-2.281m5.94 2.28-2.28 5.941" />
        </svg>
      ),
    },
  ];

  return (
    <div className="flex flex-col gap-6">

      {/* Welcome */}
      <div className="flex items-end justify-between">
        <div>
          <h2 className="font-display text-2xl font-light text-dark">
            Good morning, {firstName}.
          </h2>
          <p className="font-sans text-sm text-neutral-text-muted mt-0.5">
            Here's what's happening with{' '}
            <span className="text-dark font-medium">{user?.company?.name ?? 'your company'}</span>{' '}
            today.
          </p>
        </div>
        <span className="font-mono text-xs text-neutral-text-muted bg-white border border-dark/8 px-3 py-1.5 rounded-lg">
          {new Date().toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' })}
        </span>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {STATS.map((s) => <StatCard key={s.label} {...s} />)}
      </div>

      {/* Bottom row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">

        {/* Recent transactions */}
        <div className="card flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <h3 className="font-display text-sm font-light text-dark">Recent Transactions</h3>
            <span className="field-label">Last 30 days</span>
          </div>
          <EmptyState label="No transactions yet." />
        </div>

        {/* Pending invoices */}
        <div className="card flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <h3 className="font-display text-sm font-light text-dark">Pending Invoices</h3>
            <span className="field-label">Unpaid</span>
          </div>
          <EmptyState label="No pending invoices." />
        </div>

      </div>
    </div>
  );
}