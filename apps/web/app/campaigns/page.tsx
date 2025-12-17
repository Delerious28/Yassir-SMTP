'use client';

import Link from 'next/link';
import { FormEvent, useEffect, useState } from 'react';
import { apiFetch } from '../../lib/api';

type Campaign = {
  id: string;
  name: string;
  description?: string;
  campaignDailyLimit: number;
  active: boolean;
};

export default function CampaignsPage() {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [message, setMessage] = useState<string | null>(null);

  const load = () =>
    apiFetch<Campaign[]>('/api/campaigns')
      .then(setCampaigns)
      .catch((err) => setMessage(err.message));

  useEffect(() => {
    load();
  }, []);

  const handleCreate = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    try {
      await apiFetch('/api/campaigns', {
        method: 'POST',
        body: JSON.stringify({
          name: form.get('name'),
          description: form.get('description') || undefined,
          campaignDailyLimit: Number(form.get('campaignDailyLimit') || 200),
          active: false
        })
      });
      e.currentTarget.reset();
      load();
    } catch (err: any) {
      setMessage(err.message);
    }
  };

  const start = async (id: string) => {
    await apiFetch(`/api/campaigns/${id}/start`, { method: 'POST' });
    load();
  };

  const stop = async (id: string) => {
    await apiFetch(`/api/campaigns/${id}/stop`, { method: 'POST' });
    load();
  };

  return (
    <div className="space-y-6">
      <div className="glass-panel border border-white/5 p-6 shadow-brand-strong">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-cyan-200">Campaigns</p>
            <h1 className="text-2xl font-semibold text-white">Sequences</h1>
          </div>
          <span className="pill">Planner ready</span>
        </div>
        <form className="mt-4 grid gap-3 md:grid-cols-3" onSubmit={handleCreate}>
          <input className="input" name="name" placeholder="Campaign name" required />
          <input className="input" name="description" placeholder="Description" />
          <input className="input" name="campaignDailyLimit" placeholder="Daily limit" defaultValue={200} />
          <button className="btn md:col-span-3" type="submit">
            Create campaign
          </button>
        </form>
        {message && <p className="mt-2 text-sm text-rose-300">{message}</p>}
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {campaigns.map((campaign) => (
          <div key={campaign.id} className="rounded-2xl border border-white/5 bg-white/5 p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-lg font-semibold text-white">{campaign.name}</p>
                <p className="text-sm text-slate-400">{campaign.description}</p>
              </div>
              <span className="pill">{campaign.active ? 'Active' : 'Stopped'}</span>
            </div>
            <p className="text-xs text-slate-400">Daily limit {campaign.campaignDailyLimit}</p>
            <div className="mt-3 flex gap-3 text-sm">
              <Link className="btn" href={`/campaigns/${campaign.id}/sequence`}>
                Edit steps
              </Link>
              <Link className="btn" href={`/campaigns/${campaign.id}/leads`}>
                Attach leads
              </Link>
              {campaign.active ? (
                <button className="btn" onClick={() => stop(campaign.id)} type="button">
                  Stop
                </button>
              ) : (
                <button className="btn" onClick={() => start(campaign.id)} type="button">
                  Start
                </button>
              )}
            </div>
          </div>
        ))}
        {!campaigns.length && <p className="text-slate-400">Create a campaign to begin.</p>}
      </div>
    </div>
  );
}
