import { useEffect } from 'react';
import { useAuthStore } from '../modules/auth/store/authStore';
import { useDashboard } from '../modules/dashboard/hooks/Usedashboard';
import type { RecentTransaction, PendingInvoice } from '../modules/dashboard/Dashboardtypes';

// ─── Stat card ────────────────────────────────────────────────────────────────

interface StatCardProps {
  label:   string;
  value:   string;
  note:    string;
  loading: boolean;
  icon:    React.ReactNode;
  accent?: 'default' | 'warning' | 'danger';
}

function StatCard({ label, value, note, loading, icon, accent = 'default' }: StatCardProps) {
  const iconColor = { default: 'text-neutral-text-muted/50', warning: 'text-amber-400', danger: 'text-red-400' }[accent];
  return (
    <div className="card flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <span className="field-label">{label}</span>
        <span className={iconColor}>{icon}</span>
      </div>
      <div>
        {loading ? (
          <div className="flex items-center gap-1 h-8">
            {[0,1,2].map((i) => (
              <div key={i} className="size-1.5 rounded-full bg-dark/15 animate-pulse"
                style={{ animationDelay: `${i * 150}ms`, animationDuration: '900ms' }} />
            ))}
          </div>
        ) : (
          <p className="amount text-2xl font-semibold text-dark">{value}</p>
        )}
        <p className="font-sans text-xs text-neutral-text-muted mt-0.5">{note}</p>
      </div>
    </div>
  );
}

// ─── Recent transactions panel ────────────────────────────────────────────────

function RecentTransactionsPanel({
  items, loading, currency,
}: { items: RecentTransaction[]; loading: boolean; currency: string }) {
  if (loading) return (
    <div className="flex items-center justify-center py-10">
      <div className="flex items-center gap-1">
        {[0,1,2].map((i) => (
          <div key={i} className="size-1.5 rounded-full bg-dark/15 animate-pulse"
            style={{ animationDelay: `${i * 150}ms`, animationDuration: '900ms' }} />
        ))}
      </div>
    </div>
  );

  if (items.length === 0) return (
    <div className="info-zone flex flex-col items-center justify-center py-8 gap-1.5">
      <p className="font-sans text-sm text-neutral-text-muted">No recent transactions.</p>
    </div>
  );

  return (
    <div className="flex flex-col divide-y divide-dark/[0.04]">
      {items.map((t) => {
        const isCredit = t.type === 'CREDIT';
        return (
          <div key={t.id} className="flex items-center justify-between py-3 first:pt-0 last:pb-0">
            <div className="flex items-center gap-3 min-w-0">
              {/* Type dot */}
              <div className={`size-1.5 rounded-full shrink-0 ${isCredit ? 'bg-emerald-500' : 'bg-red-400'}`} />
              <div className="min-w-0">
                <p className="font-sans text-xs font-medium text-dark truncate">
                  {t.description ?? (isCredit ? 'Payment received' : 'Payment sent')}
                </p>
                {t.invoiceNumber && (
                  <p className="font-mono text-[10px] text-neutral-text-muted">
                    {t.invoiceNumber}
                  </p>
                )}
              </div>
            </div>
            <div className="text-right shrink-0 ml-4">
              <p className={`font-mono text-xs font-semibold ${isCredit ? 'text-emerald-600' : 'text-red-500'}`}>
                {isCredit ? '+' : '-'}{currency} {t.amount.toLocaleString('en', { minimumFractionDigits: 2 })}
              </p>
              <p className="font-sans text-[10px] text-neutral-text-muted mt-0.5">
                {new Date(t.occurredAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
}

// ─── Pending invoices panel ───────────────────────────────────────────────────

function PendingInvoicesPanel({
  items, loading, currency,
}: { items: PendingInvoice[]; loading: boolean; currency: string }) {
  if (loading) return (
    <div className="flex items-center justify-center py-10">
      <div className="flex items-center gap-1">
        {[0,1,2].map((i) => (
          <div key={i} className="size-1.5 rounded-full bg-dark/15 animate-pulse"
            style={{ animationDelay: `${i * 150}ms`, animationDuration: '900ms' }} />
        ))}
      </div>
    </div>
  );

  if (items.length === 0) return (
    <div className="info-zone flex flex-col items-center justify-center py-8 gap-1.5">
      <p className="font-sans text-sm text-neutral-text-muted">No pending invoices.</p>
    </div>
  );

  return (
    <div className="flex flex-col divide-y divide-dark/[0.04]">
      {items.map((inv) => {
        const isOverdue = new Date(inv.dueAt) < new Date();
        return (
          <div key={inv.id} className="flex items-center justify-between py-3 first:pt-0 last:pb-0">
            <div className="min-w-0">
              <p className="font-sans text-xs font-medium text-dark truncate">{inv.title}</p>
              <div className="flex items-center gap-1.5 mt-0.5">
                <span className="font-mono text-[10px] text-neutral-text-muted">{inv.number}</span>
                {inv.customerName && (
                  <>
                    <span className="text-dark/20 text-[10px]">·</span>
                    <span className="font-sans text-[10px] text-neutral-text-muted truncate">{inv.customerName}</span>
                  </>
                )}
              </div>
            </div>
            <div className="text-right shrink-0 ml-4">
              <p className="font-mono text-xs font-semibold text-dark">
                {currency} {inv.amount.toLocaleString('en', { minimumFractionDigits: 2 })}
              </p>
              <p className={`font-sans text-[10px] mt-0.5 ${isOverdue ? 'text-red-500' : 'text-neutral-text-muted'}`}>
                Due {new Date(inv.dueAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function DashboardPage() {
  const { user } = useAuthStore();
  const {
    metrics,            loadingMetrics,
    recentTransactions, loadingTransactions,
    pendingInvoices,    loadingInvoices,
    fetchAll,
  } = useDashboard();

  const currency  = user?.company?.currency ?? '';
  const firstName = user?.fullName?.split(' ')[0] ?? 'there';

  useEffect(() => { fetchAll(); }, []);

  function fmt(n: number) {
    return `${currency} ${n.toLocaleString('en', { minimumFractionDigits: 2 })}`;
  }

  const STATS: StatCardProps[] = [
    {
      label: 'Revenue today', value: fmt(metrics?.revenueToday ?? 0),
      note: 'Payments received today', loading: loadingMetrics, accent: 'default',
      icon: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-4"><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18.75a60.07 60.07 0 0 1 15.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 0 1 3 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-.375m1.5-1.5H21a.75.75 0 0 0-.75.75v.75m0 0H3.75m0 0h-.375a1.125 1.125 0 0 1-1.125-1.125V15m1.5 1.5v-.75A.75.75 0 0 0 3 15h-.75M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Zm3 0h.008v.008H18V10.5Zm-12 0h.008v.008H6V10.5Z" /></svg>,
    },
    {
      label: 'Outstanding', value: fmt(metrics?.outstandingAmount ?? 0),
      note: 'Issued & sent, unpaid', loading: loadingMetrics, accent: 'warning',
      icon: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-4"><path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" /></svg>,
    },
    {
      label: 'Overdue invoices', value: String(metrics?.overdueInvoices ?? 0),
      note: 'Past due date', loading: loadingMetrics,
      accent: (metrics?.overdueInvoices ?? 0) > 0 ? 'danger' : 'default',
      icon: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-4"><path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z" /></svg>,
    },
    {
      label: 'Total customers', value: String(metrics?.totalCustomers ?? 0),
      note: 'Active accounts', loading: loadingMetrics, accent: 'default',
      icon: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-4"><path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 0 0 2.625.372 9.337 9.337 0 0 0 4.121-.952 4.125 4.125 0 0 0-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 0 1 8.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0 1 11.964-3.07M12 6.375a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0Zm8.25 2.25a2.625 2.625 0 1 1-5.25 0 2.625 2.625 0 0 1 5.25 0Z" /></svg>,
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

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {STATS.map((s) => <StatCard key={s.label} {...s} />)}
      </div>

      {/* Bottom row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">

        <div className="card flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <h3 className="font-display text-sm font-light text-dark">Recent Transactions</h3>
            <span className="field-label">Latest activity</span>
          </div>
          <RecentTransactionsPanel
            items={recentTransactions}
            loading={loadingTransactions}
            currency={currency}
          />
        </div>

        <div className="card flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <h3 className="font-display text-sm font-light text-dark">Pending Invoices</h3>
            <span className="field-label">Awaiting payment</span>
          </div>
          <PendingInvoicesPanel
            items={pendingInvoices}
            loading={loadingInvoices}
            currency={currency}
          />
        </div>

      </div>

    </div>
  );
}