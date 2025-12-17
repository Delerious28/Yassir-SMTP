import Link from 'next/link';

const campaigns = [
  { name: 'Q3 Opt-in Nurture', status: 'Active', accounts: 3, limit: 200, progress: 62 },
  { name: 'Reactivation Wave', status: 'Paused', accounts: 2, limit: 120, progress: 28 },
  { name: 'Customer Success Touch', status: 'Draft', accounts: 1, limit: 80, progress: 0 },
];

export default function CampaignsPage() {
  return (
    <div className="space-y-6">
      <div className="glass-panel border border-white/5 p-6 shadow-brand-strong">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.25em] text-cyan-200">Campaigns</p>
            <h1 className="text-2xl font-semibold text-white">Sequence orchestration</h1>
            <p className="text-sm text-slate-300">Round-robin across accounts with consent-aware throttling and reply stops.</p>
          </div>
          <Link
            href="/campaigns/new"
            className="rounded-xl border border-cyan-400/40 bg-cyan-500/20 px-4 py-2 text-sm font-semibold text-white shadow-glow transition hover:scale-105"
          >
            + New campaign
          </Link>
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        {campaigns.map((campaign) => (
          <div key={campaign.name} className="glass-panel border border-white/5 p-5 shadow-glow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-300">{campaign.status}</p>
                <p className="text-lg font-semibold text-white">{campaign.name}</p>
              </div>
              <span className="pill border border-white/10">{campaign.accounts} accounts</span>
            </div>
            <div className="mt-3 text-sm text-slate-300">Daily limit {campaign.limit} • Weighted round robin</div>
            <div className="mt-4 h-2 rounded-full bg-white/5 overflow-hidden">
              <div
                className="h-2 rounded-full bg-gradient-to-r from-cyan-400 via-blue-500 to-emerald-400 animate-gradient-x"
                style={{ width: `${campaign.progress}%` }}
              />
            </div>
            <div className="mt-3 flex items-center justify-between text-xs text-slate-400">
              <span>{campaign.progress}% journeyed</span>
              <Link className="text-cyan-200 hover:text-white" href={`/campaigns/${encodeURIComponent(campaign.name)}/sequence`}>
                View sequence
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
