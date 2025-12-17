'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { apiFetch } from '../../lib/api';

export default function UnsubscribePage() {
  const params = useSearchParams();
  const email = params.get('email');
  const [status, setStatus] = useState<string>('Processing...');

  useEffect(() => {
    if (!email) {
      setStatus('No email provided');
      return;
    }
    apiFetch('/api/leads/unsubscribe', {
      method: 'POST',
      body: JSON.stringify({ email })
    })
      .then(() => setStatus('You have been unsubscribed.'))
      .catch((err) => setStatus(err.message));
  }, [email]);

  return (
    <div className="mx-auto max-w-xl space-y-4 text-center">
      <div className="glass-panel border border-white/5 p-6 shadow-brand-strong">
        <h1 className="text-2xl font-semibold text-white">Unsubscribe</h1>
        <p className="text-sm text-slate-300">{status}</p>
      </div>
    </div>
  );
}
