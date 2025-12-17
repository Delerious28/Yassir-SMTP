export default function LoginPage() {
  return (
    <div className="mx-auto max-w-xl space-y-6 text-center">
      <div className="glass-panel border border-white/5 p-8 shadow-brand-strong">
        <p className="text-xs uppercase tracking-[0.25em] text-cyan-200">Admin access</p>
        <h1 className="mt-1 text-2xl font-semibold text-white">Secure sign-in</h1>
        <p className="text-sm text-slate-300">JWT-based admin auth keeps API keys and SMTP credentials protected.</p>
        <form className="mt-6 space-y-3 text-left">
          <div>
            <label className="text-sm text-slate-300">Email</label>
            <input
              className="mt-1 w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white placeholder:text-slate-500 focus:border-cyan-300/60 focus:outline-none"
              name="email"
              type="email"
              placeholder="you@example.com"
              required
            />
          </div>
          <div>
            <label className="text-sm text-slate-300">Password</label>
            <input
              className="mt-1 w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white placeholder:text-slate-500 focus:border-cyan-300/60 focus:outline-none"
              name="password"
              type="password"
              placeholder="••••••••"
              required
            />
          </div>
          <button
            className="w-full rounded-xl border border-cyan-400/40 bg-cyan-500/20 px-4 py-2 text-sm font-semibold text-white shadow-glow transition hover:scale-105"
            type="submit"
          >
            Sign in
          </button>
        </form>
      </div>
    </div>
  );
}
