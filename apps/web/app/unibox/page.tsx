'use client';

import { useEffect, useState } from 'react';
import { apiFetch } from '../../lib/api';

type Message = {
  id: string;
  subject: string;
  body: string;
  direction: string;
  inboundLead?: { email: string } | null;
  lead?: { email: string } | null;
};

export default function UniboxPage() {
  const [threads, setThreads] = useState<Message[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    apiFetch<Message[]>('/api/unibox/threads')
      .then(setThreads)
      .catch((err) => setError(err.message));
  }, []);

  return (
    <div className="space-y-6">
      <div className="glass-panel border border-white/5 p-6 shadow-brand-strong">
        <p className="text-xs uppercase tracking-[0.25em] text-cyan-200">Unibox</p>
        <h1 className="text-2xl font-semibold text-white">Inbound + outbound threads</h1>
        <p className="text-sm text-slate-300">IMAP replies mark consent as replied and cancel pending sends automatically.</p>
        {error && <p className="text-sm text-rose-300">{error}</p>}
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-3">
          {threads.map((thread) => (
            <div key={thread.id} className="glass-panel border border-white/5 p-4 shadow-glow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-300">{thread.inboundLead?.email || thread.lead?.email || 'Unknown lead'}</p>
                  <p className="text-lg font-semibold text-white">{thread.subject}</p>
                </div>
                <span className="pill">{thread.direction}</span>
              </div>
              <p className="mt-2 text-sm text-slate-300 line-clamp-3">{thread.body}</p>
            </div>
          ))}
          {!threads.length && <p className="text-slate-400">No messages yet.</p>}
        </div>
        <div className="glass-panel border border-white/5 p-5 space-y-4">
          <div>
            <p className="text-xs uppercase tracking-widest text-cyan-200">Search + filters</p>
            <h3 className="text-lg font-semibold text-white">Thread controls</h3>
          </div>
          <p className="text-sm text-slate-300">Inbound sync runs continuously; replies stop sequences automatically.</p>
        </div>
      </div>
    </div>
  );
}
