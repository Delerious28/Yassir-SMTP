export default function CampaignLeadsPage({ params }: { params: { id: string } }) {
  return (
    <div className="space-y-6">
      <div className="glass-panel border border-white/5 p-6 shadow-brand-strong">
        <p className="text-xs uppercase tracking-[0.25em] text-cyan-200">Campaign leads</p>
        <h1 className="text-2xl font-semibold text-white">{decodeURIComponent(params.id)}</h1>
        <p className="text-sm text-slate-300">Dedupe by email, require opt-in, and stop sequences on reply/bounce/unsubscribe.</p>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <div className="lg:col-span-2 glass-panel border border-white/5 p-5 shadow-glow space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs uppercase tracking-widest text-cyan-200">Attached leads</p>
              <h2 className="text-xl font-semibold text-white">Per-lead safeguards</h2>
            </div>
            <span className="pill">No BCC</span>
          </div>
          <div className="rounded-xl border border-white/5 bg-white/5 p-4 text-sm text-slate-300">
            lead@example.com • opt_in • stops on reply
          </div>
          <div className="rounded-xl border border-white/5 bg-white/5 p-4 text-sm text-slate-300">
            partner@example.com • replied • future steps cancelled
          </div>
        </div>
        <div className="glass-panel border border-white/5 p-5 space-y-3">
          <p className="text-sm text-slate-200">Add new lead</p>
          <input
            placeholder="email@company.com"
            className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white placeholder:text-slate-500 focus:border-cyan-300/60 focus:outline-none"
          />
          <button className="w-full rounded-lg border border-cyan-400/40 bg-cyan-500/20 px-4 py-2 text-sm font-semibold text-white shadow-glow transition hover:scale-105">
            Attach to campaign
          </button>
          <p className="text-xs text-slate-400">Suppression entries automatically excluded.</p>
        </div>
      </div>
    </div>
  );
}
