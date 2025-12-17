export default function UniboxPage() {
  return (
    <div className="space-y-6">
      <div className="glass-panel border border-white/5 p-6 shadow-brand-strong">
        <p className="text-xs uppercase tracking-[0.25em] text-cyan-200">Unibox</p>
        <h1 className="text-2xl font-semibold text-white">Inbound + outbound threads</h1>
        <p className="text-sm text-slate-300">IMAP replies mark consent as replied and cancel pending sends automatically.</p>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-3">
          {[1, 2, 3].map((thread) => (
            <div key={thread} className="glass-panel border border-white/5 p-4 shadow-glow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-300">lead{thread}@example.com</p>
                  <p className="text-lg font-semibold text-white">Re: Product walkthrough</p>
                </div>
                <span className="pill">Replied</span>
              </div>
              <p className="mt-2 text-sm text-slate-300">Thanks for the details—can we schedule something next week?</p>
            </div>
          ))}
        </div>
        <div className="glass-panel border border-white/5 p-5 space-y-4">
          <div>
            <p className="text-xs uppercase tracking-widest text-cyan-200">Search + filters</p>
            <h3 className="text-lg font-semibold text-white">Thread controls</h3>
          </div>
          <input
            placeholder="Search subject or lead"
            className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white placeholder:text-slate-500 focus:border-cyan-300/60 focus:outline-none"
          />
          <div className="space-y-2 text-sm text-slate-300">
            <label className="flex items-center justify-between rounded-lg border border-white/5 bg-white/5 px-3 py-2">
              <span>Only replies</span>
              <input type="checkbox" defaultChecked className="accent-cyan-400" />
            </label>
            <label className="flex items-center justify-between rounded-lg border border-white/5 bg-white/5 px-3 py-2">
              <span>Bounces/DSN</span>
              <input type="checkbox" className="accent-cyan-400" />
            </label>
          </div>
        </div>
      </div>
    </div>
  );
}
