export default function LeadsPage() {
  return (
    <div className="space-y-6">
      <div className="glass-panel border border-white/5 p-6 shadow-brand-strong">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.25em] text-cyan-200">Lead intelligence</p>
            <h1 className="text-2xl font-semibold text-white">Consent-first lists</h1>
            <p className="text-sm text-slate-300">Unknown consent is blocked automatically; bounces and complaints stay suppressed.</p>
          </div>
          <div className="flex items-center gap-2">
            <button className="rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm text-white transition hover:border-cyan-300/40">
              Paste emails
            </button>
            <button className="rounded-xl border border-cyan-400/40 bg-cyan-500/20 px-4 py-2 text-sm font-semibold text-white shadow-glow hover:scale-105">
              Upload CSV
            </button>
          </div>
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <div className="lg:col-span-2 glass-panel border border-white/5 p-5 shadow-glow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs uppercase tracking-widest text-cyan-200">Recent imports</p>
              <h2 className="text-xl font-semibold text-white">Lead rollups</h2>
            </div>
            <span className="pill">MX heuristics</span>
          </div>
          <div className="mt-4 overflow-hidden rounded-xl border border-white/5">
            <table className="w-full text-left text-sm">
              <thead className="bg-white/5 text-slate-300 uppercase text-xs tracking-wide">
                <tr>
                  <th className="px-4 py-3">Email</th>
                  <th className="px-4 py-3">Consent</th>
                  <th className="px-4 py-3">Provider</th>
                  <th className="px-4 py-3">Tags</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {[1, 2, 3, 4].map((row) => (
                  <tr key={row} className="hover:bg-white/5">
                    <td className="px-4 py-3 text-white">lead{row}@example.com</td>
                    <td className="px-4 py-3 text-emerald-200">opt_in</td>
                    <td className="px-4 py-3 text-slate-200">google</td>
                    <td className="px-4 py-3 text-slate-300">welcome, product</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        <div className="glass-panel border border-white/5 p-5 space-y-4">
          <div>
            <p className="text-xs uppercase tracking-widest text-cyan-200">Filters</p>
            <h3 className="text-lg font-semibold text-white">Consent + tags</h3>
          </div>
          <div className="space-y-3 text-sm text-slate-300">
            <label className="flex items-center justify-between rounded-lg border border-white/5 bg-white/5 px-3 py-2">
              <span>Only opt-in</span>
              <input type="checkbox" defaultChecked className="accent-cyan-400" />
            </label>
            <label className="flex items-center justify-between rounded-lg border border-white/5 bg-white/5 px-3 py-2">
              <span>Exclude unsubscribed</span>
              <input type="checkbox" defaultChecked className="accent-cyan-400" />
            </label>
            <label className="flex items-center justify-between rounded-lg border border-white/5 bg-white/5 px-3 py-2">
              <span>Exclude bounced/complaints</span>
              <input type="checkbox" defaultChecked className="accent-cyan-400" />
            </label>
          </div>
          <div className="rounded-xl border border-cyan-400/30 bg-cyan-500/10 px-4 py-3 text-sm text-cyan-100 shadow-glow">
            Suppression is enforced globally—no message is sent without opt-in status.
          </div>
        </div>
      </div>
    </div>
  );
}
