'use client';

import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { apiFetch } from '../../../../lib/api';

type Lead = { id: string; email: string; consentStatus: string };

type CampaignLead = { id: string; lead: Lead; state: string };

export default function CampaignLeadsPage() {
  const params = useParams<{ id: string }>();
  const [leads, setLeads] = useState<Lead[]>([]);
  const [attached, setAttached] = useState<CampaignLead[]>([]);
  const [selected, setSelected] = useState<string[]>([]);
  const [message, setMessage] = useState<string | null>(null);

  const load = async () => {
    try {
      const [allLeads, campaign] = await Promise.all([
        apiFetch<Lead[]>('/api/leads'),
        apiFetch<{ leads: CampaignLead[] }>(`/api/campaigns/${params.id}` as any)
      ]);
      setLeads(allLeads);
      setAttached(campaign.leads || []);
    } catch (err: any) {
      setMessage(err.message);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const toggleSelect = (id: string) => {
    setSelected((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
  };

  const attach = async () => {
    try {
      await apiFetch(`/api/campaigns/${params.id}/leads`, {
        method: 'POST',
        body: JSON.stringify({ leadIds: selected })
      });
      setSelected([]);
      load();
    } catch (err: any) {
      setMessage(err.message);
    }
  };

  return (
    <div className="space-y-6">
      <div className="glass-panel border border-white/5 p-6 shadow-brand-strong">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-cyan-200">Campaign leads</p>
            <h1 className="text-2xl font-semibold text-white">Attach opt-ins</h1>
          </div>
          <span className="pill">Dedupe enforced</span>
        </div>
        <div className="mt-4 grid gap-3 md:grid-cols-2">
          {leads.map((lead) => (
            <label key={lead.id} className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/5 p-3">
              <input
                type="checkbox"
                checked={selected.includes(lead.id)}
                onChange={() => toggleSelect(lead.id)}
                disabled={lead.consentStatus !== 'opt_in'}
              />
              <div>
                <p className="text-sm text-white">{lead.email}</p>
                <p className="text-xs text-slate-400">Consent: {lead.consentStatus}</p>
              </div>
            </label>
          ))}
        </div>
        <button className="btn mt-3" type="button" onClick={attach} disabled={!selected.length}>
          Attach selected
        </button>
        {message && <p className="mt-2 text-sm text-rose-300">{message}</p>}
      </div>

      <div className="grid gap-3 md:grid-cols-2">
        {attached.map((link) => (
          <div key={link.id} className="rounded-2xl border border-white/5 bg-white/5 p-4">
            <p className="text-sm text-white">{link.lead.email}</p>
            <p className="text-xs text-slate-400">State: {link.state}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
