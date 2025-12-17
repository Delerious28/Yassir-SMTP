export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <div className="glass-panel p-6 flex flex-col gap-4 border-glow">
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.25em] text-cyan-200">Realtime health</p>
            <h1 className="text-3xl font-bold text-white">Deliverability cockpit</h1>
            <p className="text-sm text-slate-300 mt-1">
              Every send honors consent, suppression, and throttling. SMTP-only outbound with IMAP reply handling keeps you compliant.
            </p>
          </div>
          <div className="hidden lg:flex items-center gap-3">
            <div className="pill border border-cyan-400/30">Send queue stable</div>
            <div className="pill border border-emerald-400/30">IMAP listening</div>
          </div>
        </div>
        <div className="card-grid">
          {[
            { label: 'Sent today', value: '126', accent: 'from-cyan-500/70 to-blue-500/60' },
            { label: 'Queued', value: '42', accent: 'from-amber-400/60 to-orange-500/50' },
            { label: 'Replies', value: '18', accent: 'from-emerald-400/60 to-cyan-400/50' },
            { label: 'Bounces', value: '3', accent: 'from-rose-500/60 to-orange-500/50' },
            { label: 'Stops by consent', value: '11', accent: 'from-fuchsia-500/60 to-violet-500/50' },
            { label: 'Daily capacity left', value: '74%', accent: 'from-sky-400/70 to-cyan-400/60' },
          ].map((stat) => (
            <div
              key={stat.label}
              className="relative overflow-hidden rounded-2xl border border-white/5 bg-slate-900/80 px-4 py-5 shadow-glow"
            >
              <div className={`absolute inset-0 bg-gradient-to-br ${stat.accent} opacity-20 blur-2xl`} />
              <div className="relative flex items-center justify-between">
                <div>
                  <p className="text-xs uppercase tracking-wide text-slate-300/80">{stat.label}</p>
                  <p className="text-3xl font-semibold text-white">{stat.value}</p>
                </div>
                <div className="h-10 w-10 rounded-xl border border-white/10 bg-white/5 flex items-center justify-center text-cyan-200 animate-float">
                  ↺
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="glass-panel p-6 border border-white/5 shadow-brand-strong lg:col-span-2">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs uppercase tracking-widest text-cyan-200">Pipeline</p>
              <h2 className="text-xl font-semibold text-white">Sequence planner</h2>
            </div>
            <span className="pill">Jitter-enabled</span>
          </div>
          <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3].map((phase) => (
              <div key={phase} className="rounded-2xl border border-white/5 bg-white/5 px-4 py-4">
                <div className="flex items-center justify-between text-xs text-slate-300">
                  <span>Step {phase}</span>
                  <span className="text-cyan-200">Wait {phase * 2}d</span>
                </div>
                <p className="mt-2 text-lg font-semibold text-white">Follow-up template {phase}</p>
                <p className="text-sm text-slate-400">Consent-checked, stops on reply or bounce automatically.</p>
              </div>
            ))}
          </div>
        </div>

        <div className="glass-panel p-6 space-y-4 border border-white/5">
          <div>
            <p className="text-xs uppercase tracking-widest text-cyan-200">System status</p>
            <h2 className="text-xl font-semibold text-white">Queues & Workers</h2>
          </div>
          <div className="space-y-3">
            {[
              { label: 'Send queue', status: 'Draining', color: 'text-emerald-300', accent: 'border-emerald-400/40' },
              { label: 'IMAP sync', status: 'Listening', color: 'text-cyan-200', accent: 'border-cyan-400/40' },
              { label: 'Planner', status: 'Scheduling', color: 'text-blue-200', accent: 'border-blue-400/40' },
            ].map((row) => (
              <div
                key={row.label}
                className={`flex items-center justify-between rounded-xl border bg-slate-900/70 px-4 py-3 ${row.accent}`}
              >
                <div>
                  <p className="text-sm text-slate-200">{row.label}</p>
                  <p className="text-xs text-slate-400">Backoff, retries, and consent gates baked in.</p>
                </div>
                <span className={`text-sm font-semibold ${row.color}`}>{row.status}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
