import { Outlet, NavLink, useLocation } from 'react-router-dom';
import { useAuthStore } from '../modules/auth/store/authStore';

// ─── Nav items ────────────────────────────────────────────────────────────────

const NAV = [
  {
    label: 'Dashboard',
    path:  '/',
    exact: true,
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-4">
        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 0 1 6 3.75h2.25A2.25 2.25 0 0 1 10.5 6v2.25a2.25 2.25 0 0 1-2.25 2.25H6a2.25 2.25 0 0 1-2.25-2.25V6ZM3.75 15.75A2.25 2.25 0 0 1 6 13.5h2.25a2.25 2.25 0 0 1 2.25 2.25V18a2.25 2.25 0 0 1-2.25 2.25H6A2.25 2.25 0 0 1 3.75 18v-2.25ZM13.5 6a2.25 2.25 0 0 1 2.25-2.25H18A2.25 2.25 0 0 1 20.25 6v2.25A2.25 2.25 0 0 1 18 10.5h-2.25a2.25 2.25 0 0 1-2.25-2.25V6ZM13.5 15.75a2.25 2.25 0 0 1 2.25-2.25H18a2.25 2.25 0 0 1 2.25 2.25V18A2.25 2.25 0 0 1 18 20.25h-2.25A2.25 2.25 0 0 1 13.5 18v-2.25Z" />
      </svg>
    ),
  },
  {
    label: 'Customers',
    path:  '/customers',
    exact: false,
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-4">
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 0 0 2.625.372 9.337 9.337 0 0 0 4.121-.952 4.125 4.125 0 0 0-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 0 1 8.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0 1 11.964-3.07M12 6.375a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0Zm8.25 2.25a2.625 2.625 0 1 1-5.25 0 2.625 2.625 0 0 1 5.25 0Z" />
      </svg>
    ),
  },
  {
    label: 'Invoices',
    path:  '/invoices',
    exact: false,
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className="size-4">
        <path stroke-linecap="round" stroke-linejoin="round" d="m9 14.25 6-6m4.5-3.493V21.75l-3.75-1.5-3.75 1.5-3.75-1.5-3.75 1.5V4.757c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0 1 11.186 0c1.1.128 1.907 1.077 1.907 2.185ZM9.75 9h.008v.008H9.75V9Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm4.125 4.5h.008v.008h-.008V13.5Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" />
      </svg>
    ),
  },
  {
    label: 'Transactions',
    path:  '/transactions',
    exact: false,
    icon: (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className="size-4">
      <path stroke-linecap="round" stroke-linejoin="round" d="M3 7.5 7.5 3m0 0L12 7.5M7.5 3v13.5m13.5 0L16.5 21m0 0L12 16.5m4.5 4.5V7.5" />
    </svg>
    ),
  },
    {
    label: 'Audit',
    path:  '/audit',
    exact: false,
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className="size-6">
        <path stroke-linecap="round" stroke-linejoin="round" d="M3.75 12h16.5m-16.5 3.75h16.5M3.75 19.5h16.5M5.625 4.5h12.75a1.875 1.875 0 0 1 0 3.75H5.625a1.875 1.875 0 0 1 0-3.75Z" />
      </svg>
    ),
  },
];

// ─── Page title map ───────────────────────────────────────────────────────────

const PAGE_TITLES: Record<string, string> = {
  '/':          'Dashboard',
  '/customers': 'Customers',
  '/invoices': 'Invoices',
  '/transactions': 'Transactions',
  '/audit': 'Audit',

};

// ─── Helpers ─────────────────────────────────────────────────────────────────

function initials(name: string) {
  return name.split(' ').slice(0, 2).map((n) => n[0]).join('').toUpperCase();
}

// ─── Component ────────────────────────────────────────────────────────────────

const AppLayout = () => {
  const { user, clearAuth } = useAuthStore();
  const location            = useLocation();
  const pageTitle           = PAGE_TITLES[location.pathname] ?? 'CashPilot';

  return (
    <div className="flex h-screen bg-neutral-bg-soft overflow-hidden">

      {/* ── Sidebar ──────────────────────────────────────────────────────── */}
      <aside className="flex flex-col w-56 shrink-0 bg-dark h-full border-r border-white/5">

        {/* Logo */}
        <div className="flex items-center h-16 px-5 shrink-0 border-b border-white/5">
          <span className="font-display text-lg font-light text-white">
            Cash<span className="text-primary">Pilot</span>
          </span>
        </div>

        {/* Workspace badge */}
        {user?.company && (
          <div className="mx-3 mt-4 px-3 py-2.5 rounded-lg bg-white/5 border border-white/6 shrink-0">
            <p className="font-sans text-[9px] font-semibold uppercase tracking-widest text-white/25 mb-1">
              Workspace
            </p>
            <p className="font-sans text-xs font-medium text-white/75 truncate">
              {user.company.name}
            </p>
            <p className="font-mono text-[10px] text-white/30 mt-0.5">
              {user.company.currency}
            </p>
          </div>
        )}

        {/* Nav */}
        <nav className="flex-1 flex flex-col gap-0.5 px-3 mt-5 overflow-y-auto">
          <p className="font-sans text-[9px] font-semibold uppercase tracking-widest text-white/20 px-2 mb-2">
            Menu
          </p>

          {NAV.map(({ label, path, exact, icon }) => (
            <NavLink
              key={path}
              to={path}
              end={exact}
              className={({ isActive }) =>
                [
                  'group flex items-center gap-2.5 px-3 py-2.5 rounded-lg',
                  'font-sans text-sm transition-all duration-150',
                  isActive
                    ? 'bg-primary/15 text-primary font-medium'
                    : 'text-white/40 hover:text-white/75 hover:bg-white/5',
                ].join(' ')
              }
            >
              {({ isActive }) => (
                <>
                  <span className={isActive ? 'text-primary' : 'text-white/35 group-hover:text-white/60'}>
                    {icon}
                  </span>
                  <span className="flex-1">{label}</span>
                  {isActive && (
                    <span className="size-1.5 rounded-full bg-primary shrink-0" />
                  )}
                </>
              )}
            </NavLink>
          ))}
        </nav>

        {/* User footer */}
        <div className="shrink-0 p-3 border-t border-white/5">
          <div className="flex items-center gap-2.5 px-2 py-1.5">
            <div className="flex items-center justify-center size-7 rounded-full bg-primary/20 shrink-0">
              <span className="font-sans text-[10px] font-semibold text-primary">
                {user?.fullName ? initials(user.fullName) : '?'}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-sans text-xs font-medium text-white/75 truncate leading-none">
                {user?.fullName ?? '—'}
              </p>
              <p className="font-sans text-[10px] text-white/30 truncate mt-0.5">
                {user?.email ?? '—'}
              </p>
            </div>
            <button
              onClick={clearAuth}
              title="Sign out"
              className="shrink-0 text-white/20 hover:text-red-400 transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-4">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0 0 13.5 3h-6a2.25 2.25 0 0 0-2.25 2.25v13.5A2.25 2.25 0 0 0 7.5 21h6a2.25 2.25 0 0 0 2.25-2.25V15m3 0 3-3m0 0-3-3m3 3H9" />
              </svg>
            </button>
          </div>
        </div>
      </aside>

      {/* ── Main ─────────────────────────────────────────────────────────── */}
      <div className="flex flex-col flex-1 min-w-0 overflow-hidden">

        {/* Appbar */}
        <header className="flex items-center justify-between h-16 px-6 bg-white border-b border-dark/[0.06] shrink-0">
          <h1 className="font-display text-lg font-light text-dark">
            {pageTitle}
          </h1>

          <div className="flex items-center gap-3">
            {user?.company?.currency && (
              <span className="font-mono text-[11px] text-neutral-text-muted bg-neutral-bg-soft border border-dark/8 px-2.5 py-1 rounded-md">
                {user.company.currency}
              </span>
            )}
            <div className="flex items-center gap-2.5">
              <div className="flex items-center justify-center size-8 rounded-full bg-primary shrink-0">
                <span className="font-sans text-xs font-semibold text-white">
                  {user?.fullName ? initials(user.fullName) : '?'}
                </span>
              </div>
              <div className="hidden sm:block leading-none">
                <p className="font-sans text-xs font-medium text-dark">
                  {user?.fullName ?? '—'}
                </p>
                <p className="font-sans text-[10px] text-neutral-text-muted mt-0.5">
                  {user?.company?.name ?? '—'}
                </p>
              </div>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto p-6">
          <Outlet />
        </main>
      </div>

    </div>
  );
};

export default AppLayout;