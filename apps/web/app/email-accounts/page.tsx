export default function EmailAccountsPage() {
  return (
    <div className="space-y-6">
      <div className="glass-panel border border-white/5 p-6 shadow-brand-strong">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.25em] text-cyan-200">Accounts</p>
            <h1 className="text-2xl font-semibold text-white">SMTP + IMAP credentials</h1>
            <p className="text-sm text-slate-300">Daily send limits, jitter, and consent checks are applied automatically.</p>
          </div>
          <button className="rounded-xl border border-cyan-400/50 bg-cyan-500/20 px-4 py-2 text-sm font-semibold text-white shadow-glow transition hover:scale-105">
            + Add account
          </button>
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        {[1, 2, 3].map((idx) => (
          <div key={idx} className="glass-panel border border-white/5 p-5 shadow-glow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-300">Account {idx}</p>
                <p className="text-lg font-semibold text-white">smtp{idx}@example.com</p>
              </div>
              <span className="pill border border-emerald-400/30 text-emerald-100">Enabled</span>
            </div>
            <div className="mt-4 grid grid-cols-2 gap-3 text-sm text-slate-300">
              <div>
                <p className="text-xs uppercase text-slate-400">Daily cap</p>
                <p className="text-white">50</p>
              </div>
              <div>
                <p className="text-xs uppercase text-slate-400">Min gap</p>
                <p className="text-white">7 min + jitter</p>
              </div>
              <div>
                <p className="text-xs uppercase text-slate-400">SMTP</p>
                <p className="text-white">TLS 587</p>
              </div>
              <div>
                <p className="text-xs uppercase text-slate-400">IMAP</p>
                <p className="text-white">SSL 993</p>
              </div>
            </div>
            <div className="mt-4 flex items-center justify-between">
              <button className="rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white transition hover:border-cyan-300/40 hover:text-cyan-100">
                Edit limits
              </button>
              <button className="rounded-lg border border-cyan-400/40 bg-cyan-500/20 px-3 py-2 text-sm text-white shadow-glow transition hover:scale-105">
                Test SMTP + IMAP
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
