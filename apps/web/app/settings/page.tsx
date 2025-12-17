export default function SettingsPage() {
  return (
    <div className="space-y-6">
      <div className="glass-panel border border-white/5 p-6 shadow-brand-strong">
        <p className="text-xs uppercase tracking-[0.25em] text-cyan-200">Settings</p>
        <h1 className="text-2xl font-semibold text-white">Defaults & security</h1>
        <p className="text-sm text-slate-300">Master key encryption status and throttling policies that apply across campaigns.</p>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <div className="glass-panel border border-white/5 p-5 space-y-3">
          <p className="text-sm text-slate-200">Master key</p>
          <div className="rounded-xl border border-emerald-400/30 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-100 shadow-glow">
            AES-256-GCM active • Secrets protected at rest
          </div>
          <button className="rounded-lg border border-white/10 bg-white/5 px-4 py-2 text-sm text-white transition hover:border-cyan-300/40">
            Rotate key
          </button>
        </div>
        <div className="glass-panel border border-white/5 p-5 space-y-3">
          <p className="text-sm text-slate-200">Send pacing</p>
          <div className="grid grid-cols-2 gap-3 text-sm text-slate-300">
            <label className="rounded-lg border border-white/10 bg-white/5 px-3 py-2">Daily campaign cap: 200</label>
            <label className="rounded-lg border border-white/10 bg-white/5 px-3 py-2">Min gap: 7m</label>
            <label className="rounded-lg border border-white/10 bg-white/5 px-3 py-2">Jitter: 0-5m</label>
            <label className="rounded-lg border border-white/10 bg-white/5 px-3 py-2">Retries: 5</label>
          </div>
          <p className="text-xs text-slate-400">Applies to new campaigns; existing ones keep their configured limits.</p>
        </div>
      </div>
    </div>
  );
}
