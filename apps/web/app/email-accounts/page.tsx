'use client';

import { FormEvent, useEffect, useState } from 'react';
import { apiFetch } from '../../lib/api';

type Account = {
  id: string;
  name: string;
  smtpHost: string;
  smtpPort: number;
  smtpUser: string;
  smtpSecure: boolean;
  imapHost: string;
  imapPort: number;
  imapUser: string;
  imapSecure: boolean;
  dailySendLimit: number;
  minTimeGapMinutes: number;
  jitterMinutes: number;
  enabled: boolean;
};

const defaults = {
  smtpPort: 587,
  smtpSecure: true,
  imapPort: 993,
  imapSecure: true,
  dailySendLimit: 50,
  minTimeGapMinutes: 7,
  jitterMinutes: 5
};

export default function EmailAccountsPage() {
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const load = () =>
    apiFetch<Account[]>('/api/email-accounts')
      .then(setAccounts)
      .catch((err) => setMessage(err.message));

  useEffect(() => {
    load();
  }, []);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setMessage(null);
    const form = new FormData(e.currentTarget);
    const payload = Object.fromEntries(form.entries());
    try {
      setLoading(true);
      await apiFetch('/api/email-accounts', {
        method: 'POST',
        body: JSON.stringify({
          name: payload.name,
          smtpHost: payload.smtpHost,
          smtpPort: Number(payload.smtpPort || defaults.smtpPort),
          smtpUser: payload.smtpUser,
          smtpPassword: payload.smtpPassword,
          smtpSecure: (payload.smtpSecure as string) === 'true',
          imapHost: payload.imapHost,
          imapPort: Number(payload.imapPort || defaults.imapPort),
          imapUser: payload.imapUser,
          imapPassword: payload.imapPassword,
          imapSecure: (payload.imapSecure as string) === 'true',
          dailySendLimit: Number(payload.dailySendLimit || defaults.dailySendLimit),
          minTimeGapMinutes: Number(payload.minTimeGapMinutes || defaults.minTimeGapMinutes),
          jitterMinutes: Number(payload.jitterMinutes || defaults.jitterMinutes),
          enabled: true
        })
      });
      e.currentTarget.reset();
      setMessage('Account saved');
      load();
    } catch (err: any) {
      setMessage(err.message);
    } finally {
      setLoading(false);
    }
  };

  const testConnection = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setMessage(null);
    const form = new FormData(e.currentTarget);
    try {
      await apiFetch('/api/email-accounts/test', {
        method: 'POST',
        body: JSON.stringify({
          name: 'test',
          smtpHost: form.get('smtpHost'),
          smtpPort: Number(form.get('smtpPort') || defaults.smtpPort),
          smtpUser: form.get('smtpUser'),
          smtpPassword: form.get('smtpPassword'),
          smtpSecure: (form.get('smtpSecure') as string) === 'true',
          imapHost: form.get('imapHost'),
          imapPort: Number(form.get('imapPort') || defaults.imapPort),
          imapUser: form.get('imapUser'),
          imapPassword: form.get('imapPassword'),
          imapSecure: (form.get('imapSecure') as string) === 'true',
          dailySendLimit: defaults.dailySendLimit,
          minTimeGapMinutes: defaults.minTimeGapMinutes,
          jitterMinutes: defaults.jitterMinutes,
          enabled: true
        })
      });
      setMessage('Connection ok');
    } catch (err: any) {
      setMessage(err.message);
    }
  };

  return (
    <div className="space-y-6">
      <div className="glass-panel border border-white/5 p-6 shadow-brand-strong">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-cyan-200">SMTP + IMAP</p>
            <h1 className="text-2xl font-semibold text-white">Email accounts</h1>
          </div>
          <span className="pill">Encrypted at rest</span>
        </div>
        <form className="mt-4 grid gap-4 md:grid-cols-2" onSubmit={handleSubmit}>
          <input className="input" name="name" placeholder="Friendly name" required />
          <input className="input" name="smtpHost" placeholder="SMTP host" required />
          <input className="input" name="smtpPort" placeholder="SMTP port" defaultValue={defaults.smtpPort} required />
          <input className="input" name="smtpUser" placeholder="SMTP user" required />
          <input className="input" name="smtpPassword" placeholder="SMTP password" required />
          <select className="input" name="smtpSecure" defaultValue="true">
            <option value="true">TLS</option>
            <option value="false">STARTTLS/Plain</option>
          </select>
          <input className="input" name="imapHost" placeholder="IMAP host" required />
          <input className="input" name="imapPort" placeholder="IMAP port" defaultValue={defaults.imapPort} required />
          <input className="input" name="imapUser" placeholder="IMAP user" required />
          <input className="input" name="imapPassword" placeholder="IMAP password" required />
          <select className="input" name="imapSecure" defaultValue="true">
            <option value="true">TLS</option>
            <option value="false">Plain</option>
          </select>
          <input className="input" name="dailySendLimit" placeholder="Daily send limit" defaultValue={defaults.dailySendLimit} />
          <input className="input" name="minTimeGapMinutes" placeholder="Min gap minutes" defaultValue={defaults.minTimeGapMinutes} />
          <input className="input" name="jitterMinutes" placeholder="Jitter minutes" defaultValue={defaults.jitterMinutes} />
          <div className="flex items-center gap-3 md:col-span-2">
            <button className="btn" type="submit" disabled={loading}>
              {loading ? 'Saving…' : 'Save account'}
            </button>
            <button className="btn" type="button" onClick={() => load()}>
              Refresh
            </button>
            <button className="btn" type="button" onClick={(ev) => testConnection(ev.currentTarget.form!)}>
              Test connection
            </button>
          </div>
        </form>
        {message && <p className="mt-2 text-sm text-emerald-200">{message}</p>}
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {accounts.map((account) => (
          <div key={account.id} className="rounded-2xl border border-white/5 bg-white/5 p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-white">{account.name}</p>
                <p className="text-xs text-slate-400">{account.smtpUser}</p>
              </div>
              <span className="pill">Limit {account.dailySendLimit}/day</span>
            </div>
            <p className="mt-2 text-xs text-slate-400">
              SMTP {account.smtpHost}:{account.smtpPort} · IMAP {account.imapHost}:{account.imapPort}
            </p>
            <p className="text-xs text-slate-400">Gap {account.minTimeGapMinutes}m · Jitter {account.jitterMinutes}m</p>
            <p className="text-xs text-emerald-300 mt-1">{account.enabled ? 'Enabled' : 'Disabled'}</p>
          </div>
        ))}
        {!accounts.length && <p className="text-slate-400">Connect an account to start sending.</p>}
      </div>
    </div>
  );
}

