'use client';

import { FormEvent, useEffect, useState } from 'react';
import { apiFetch } from '../../lib/api';

type Lead = {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  company?: string;
  tags: string[];
  consentStatus: string;
  providerMatch: string;
};

export default function LeadsPage() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [importText, setImportText] = useState('');
  const [message, setMessage] = useState<string | null>(null);

  const load = () =>
    apiFetch<Lead[]>('/api/leads')
      .then(setLeads)
      .catch((err) => setMessage(err.message));

  useEffect(() => {
    load();
  }, []);

  const handleCreate = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setMessage(null);
    const form = new FormData(e.currentTarget);
    try {
      await apiFetch('/api/leads', {
        method: 'POST',
        body: JSON.stringify({
          email: form.get('email'),
          firstName: form.get('firstName') || undefined,
          lastName: form.get('lastName') || undefined,
          company: form.get('company') || undefined,
          consentStatus: form.get('consentStatus') || 'unknown',
          tags: (form.get('tags') as string)?.split(',').filter(Boolean) || []
        })
      });
      e.currentTarget.reset();
      load();
    } catch (err: any) {
      setMessage(err.message);
    }
  };

  const handleImport = async () => {
    try {
      await apiFetch('/api/leads/import/paste', {
        method: 'POST',
        body: JSON.stringify({ leads: [importText] })
      });
      setImportText('');
      load();
      setMessage('Imported leads');
    } catch (err: any) {
      setMessage(err.message);
    }
  };

  return (
    <div className="space-y-6">
      <div className="glass-panel p-6 border border-white/5 shadow-brand-strong">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-cyan-200">Leads</p>
            <h1 className="text-2xl font-semibold text-white">Consent-aware contacts</h1>
          </div>
          <span className="pill">No consent = no send</span>
        </div>

        <form className="mt-4 grid gap-3 md:grid-cols-2" onSubmit={handleCreate}>
          <input className="input" name="email" placeholder="Email" required />
          <input className="input" name="firstName" placeholder="First name" />
          <input className="input" name="lastName" placeholder="Last name" />
          <input className="input" name="company" placeholder="Company" />
          <select className="input" name="consentStatus" defaultValue="unknown">
            <option value="unknown">Unknown</option>
            <option value="opt_in">Opt-in</option>
            <option value="unsubscribed">Unsubscribed</option>
            <option value="bounced">Bounced</option>
            <option value="complaint">Complaint</option>
            <option value="replied">Replied</option>
          </select>
          <input className="input" name="tags" placeholder="tags (comma separated)" />
          <button className="btn md:col-span-2" type="submit">
            Save lead
          </button>
        </form>
        <div className="mt-4 space-y-2">
          <label className="text-sm text-slate-300">Import (paste emails)</label>
          <textarea
            className="input min-h-[120px]"
            value={importText}
            onChange={(e) => setImportText(e.target.value)}
            placeholder="email1@example.com\nemail2@example.com"
          />
          <button className="btn" type="button" onClick={handleImport}>
            Import
          </button>
        </div>
        {message && <p className="mt-2 text-sm text-emerald-200">{message}</p>}
      </div>

      <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
        {leads.map((lead) => (
          <div key={lead.id} className="rounded-2xl border border-white/5 bg-white/5 p-4">
            <div className="flex items-center justify-between">
              <p className="text-sm font-semibold text-white">{lead.email}</p>
              <span className="pill">{lead.consentStatus}</span>
            </div>
            <p className="text-xs text-slate-400">{lead.firstName} {lead.lastName}</p>
            <p className="text-xs text-slate-400">{lead.company}</p>
            <p className="text-xs text-slate-400">Provider: {lead.providerMatch}</p>
            {lead.tags?.length ? <p className="text-xs text-cyan-200">Tags: {lead.tags.join(', ')}</p> : null}
          </div>
        ))}
        {!leads.length && <p className="text-slate-400">No leads yet.</p>}
      </div>
    </div>
  );
}
