import { useState } from 'react'

function App() {
  const [count, setCount] = useState(0)

  return (
    <div className="min-h-screen bg-neutral-bg-soft font-sans p-10 space-y-10">

      {/* ── Header ───────────────────────────────────────────────── */}
      <header className="flex items-center justify-between">
        <h1 className="font-display text-4xl font-extrabold text-dark">
          Cash<span className="text-primary">Pilot</span>
        </h1>
        <span className="field-label">Design Token Smoke Test</span>
      </header>

      {/* ── Colors ───────────────────────────────────────────────── */}
      <section className="card space-y-4">
        <h2 className="font-display text-2xl font-bold text-dark">Colors</h2>
        <div className="flex flex-wrap gap-4">
          {[
            { bg: 'bg-primary',            label: 'primary',          hex: '#6F84FF' },
            { bg: 'bg-dark',               label: 'dark',             hex: '#020526' },
            { bg: 'bg-neutral-white border border-dark/10', label: 'white', hex: '#FFFFFF' },
            { bg: 'bg-neutral-bg-soft border border-dark/10', label: 'bg-soft', hex: '#F7F8FA' },
            { bg: 'bg-neutral-text-muted', label: 'text-muted',       hex: '#9A9B9E' },
          ].map(({ bg, label, hex }) => (
            <div key={label} className="flex flex-col items-center gap-2">
              <div className={`w-16 h-16 rounded-xl ${bg}`} />
              <span className="field-label">{label}</span>
              <span className="font-mono text-xs text-neutral-text-muted">{hex}</span>
            </div>
          ))}
        </div>
      </section>

      {/* ── Typography ───────────────────────────────────────────── */}
      <section className="card space-y-3">
        <h2 className="font-display text-2xl font-bold text-dark">Typography</h2>

        <p className="font-display text-5xl font-extrabold text-dark leading-tight">
          Display — Sora
        </p>
        <p className="font-sans text-base text-neutral-text-muted">
          Body — Inter. Use for paragraphs, labels, and UI copy across the platform.
        </p>
        <p className="font-mono text-base text-dark">
          Mono — JetBrains Mono · $1,240,500.00 · TXN-00482
        </p>
      </section>

      {/* ── Buttons ──────────────────────────────────────────────── */}
      <section className="card space-y-4">
        <h2 className="font-display text-2xl font-bold text-dark">Buttons</h2>
        <div className="flex flex-wrap gap-4 items-center">
          <button className="btn-primary">Primary Action</button>
          <button className="btn-dark">Dark Action</button>
          <button className="btn-ghost">Ghost / Outline</button>
          <button className="btn-primary" disabled>Disabled</button>
        </div>

        {/* Counter — replaces the default Vite one */}
        <div className="info-zone flex items-center gap-6">
          <span className="field-label">Interactive counter</span>
          <button
            className="btn-primary"
            onClick={() => setCount(c => c + 1)}
          >
            Count is{' '}
            <span className="font-mono font-semibold">{count}</span>
          </button>
          <button className="btn-ghost" onClick={() => setCount(0)}>
            Reset
          </button>
        </div>
      </section>

      {/* ── Info Zone + Amount ───────────────────────────────────── */}
      <section className="card space-y-4">
        <h2 className="font-display text-2xl font-bold text-dark">
          Info Zone &amp; Amount
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            { label: 'Total Balance',     value: '$4,820,300.00' },
            { label: 'Pending Invoices',  value: '$128,750.00'   },
            { label: 'Outgoing Payments', value: '$93,400.00'    },
          ].map(({ label, value }) => (
            <div key={label} className="info-zone space-y-1">
              <span className="field-label">{label}</span>
              <p className="amount text-2xl font-bold">{value}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Shadows ──────────────────────────────────────────────── */}
      <section className="card space-y-4">
        <h2 className="font-display text-2xl font-bold text-dark">Shadows</h2>
        <div className="flex flex-wrap gap-6 items-end">
          <div className="w-32 h-20 bg-white rounded-xl shadow-card flex items-center justify-center">
            <span className="field-label">card</span>
          </div>
          <div className="w-32 h-20 bg-white rounded-xl shadow-card-hover flex items-center justify-center">
            <span className="field-label">card-hover</span>
          </div>
          <div className="w-32 h-20 bg-primary rounded-xl shadow-primary flex items-center justify-center">
            <span className="text-xs font-medium text-white">primary</span>
          </div>
        </div>
      </section>

    </div>
  )
}

export default App