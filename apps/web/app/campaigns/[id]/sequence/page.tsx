const steps = [
  { step: 1, subject: 'Intro with value', wait: 0 },
  { step: 2, subject: 'Soft follow-up', wait: 3 },
  { step: 3, subject: 'Consent-friendly nudge', wait: 7 },
];

export default function CampaignSequencePage({ params }: { params: { id: string } }) {
  return (
    <div className="space-y-6">
      <div className="glass-panel border border-white/5 p-6 shadow-brand-strong">
        <p className="text-xs uppercase tracking-[0.25em] text-cyan-200">Sequence</p>
        <h1 className="text-2xl font-semibold text-white">{decodeURIComponent(params.id)} steps</h1>
        <p className="text-sm text-slate-300">No BCC, per-lead send safety, and automatic stop on reply or bounce.</p>
      </div>

      <div className="space-y-4">
        {steps.map((item) => (
          <div key={item.step} className="glass-panel border border-white/5 p-5 shadow-glow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs uppercase tracking-widest text-cyan-200">Step {item.step}</p>
                <p className="text-lg font-semibold text-white">{item.subject}</p>
              </div>
              <span className="pill">Wait {item.wait} days</span>
            </div>
            <div className="mt-3 grid gap-3 sm:grid-cols-2">
              <label className="rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-slate-300">
                Subject template
              </label>
              <label className="rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-slate-300">
                HTML body template
              </label>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
