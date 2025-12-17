'use client';

import { useParams } from 'next/navigation';
import { FormEvent, useEffect, useState } from 'react';
import { apiFetch } from '../../../../lib/api';

type Step = {
  id: string;
  stepNumber: number;
  subjectTemplate: string;
  bodyTemplate: string;
  waitDaysAfterPrev: number;
  stopOnReply: boolean;
};

export default function SequencePage() {
  const params = useParams<{ id: string }>();
  const [steps, setSteps] = useState<Step[]>([]);
  const [message, setMessage] = useState<string | null>(null);

  const load = () =>
    apiFetch<Step[]>(`/api/campaigns/${params.id}/sequence-steps`)
      .then(setSteps)
      .catch((err) => setMessage(err.message));

  useEffect(() => {
    load();
  }, []);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    try {
      await apiFetch(`/api/campaigns/${params.id}/sequence-steps`, {
        method: 'POST',
        body: JSON.stringify({
          stepNumber: Number(form.get('stepNumber')),
          subjectTemplate: form.get('subjectTemplate'),
          bodyTemplate: form.get('bodyTemplate'),
          waitDaysAfterPrev: Number(form.get('waitDaysAfterPrev') || 0),
          stopOnReply: (form.get('stopOnReply') as string) === 'true'
        })
      });
      e.currentTarget.reset();
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
            <p className="text-xs uppercase tracking-[0.2em] text-cyan-200">Sequence</p>
            <h1 className="text-2xl font-semibold text-white">Steps</h1>
          </div>
          <span className="pill">Live templates</span>
        </div>
        <form className="mt-4 grid gap-3" onSubmit={handleSubmit}>
          <input className="input" name="stepNumber" placeholder="Step number" required />
          <input className="input" name="subjectTemplate" placeholder="Subject (supports {{first_name}})" required />
          <textarea className="input" name="bodyTemplate" placeholder="HTML body" required />
          <input className="input" name="waitDaysAfterPrev" placeholder="Wait days after previous" defaultValue={0} />
          <select className="input" name="stopOnReply" defaultValue="true">
            <option value="true">Stop on reply</option>
            <option value="false">Always send</option>
          </select>
          <button className="btn" type="submit">
            Save step
          </button>
        </form>
        {message && <p className="mt-2 text-sm text-rose-300">{message}</p>}
      </div>

      <div className="grid gap-3 md:grid-cols-2">
        {steps.map((step) => (
          <div key={step.id} className="rounded-2xl border border-white/5 bg-white/5 p-4">
            <div className="flex items-center justify-between">
              <p className="text-lg font-semibold text-white">Step {step.stepNumber}</p>
              <span className="pill">Wait {step.waitDaysAfterPrev}d</span>
            </div>
            <p className="text-sm text-slate-200">{step.subjectTemplate}</p>
            <p className="text-xs text-slate-400">{step.bodyTemplate}</p>
            <p className="text-xs text-emerald-300">Stop on reply: {step.stopOnReply ? 'Yes' : 'No'}</p>
          </div>
        ))}
        {!steps.length && <p className="text-slate-400">Add at least one step to send.</p>}
      </div>
    </div>
  );
}
