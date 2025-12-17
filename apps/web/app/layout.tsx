import './globals.css';
import Link from 'next/link';
import { ReactNode } from 'react';

const navItems = [
  { href: '/dashboard', label: 'Dashboard' },
  { href: '/email-accounts', label: 'Email Accounts' },
  { href: '/leads', label: 'Leads' },
  { href: '/campaigns', label: 'Campaigns' },
  { href: '/unibox', label: 'Unibox' },
  { href: '/settings', label: 'Settings' },
];

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className="dark">
      <body className="min-h-screen bg-slate-950 text-slate-100">
        <div className="relative min-h-screen overflow-hidden">
          <div className="pointer-events-none absolute inset-0 opacity-60 animate-gradient-x ambient-gradient" />
          <div className="pointer-events-none absolute -left-16 top-10 h-72 w-72 rounded-full bg-cyan-400/10 blur-3xl" />
          <div className="pointer-events-none absolute right-0 bottom-0 h-96 w-96 rounded-full bg-blue-500/10 blur-3xl" />
          <div className="relative z-10 flex min-h-screen">
            <aside className="hidden md:flex w-64 flex-col gap-6 border-r border-white/5 bg-slate-900/60 backdrop-blur-xl px-5 py-6 shadow-xl shadow-cyan-500/5">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-xl bg-cyan-500/20 border border-cyan-400/30 flex items-center justify-center text-cyan-200 font-bold">
                  YS
                </div>
                <div>
                  <p className="text-sm text-slate-300">Self-hosted</p>
                  <p className="text-lg font-semibold text-white">SMTP Campaigns</p>
                </div>
              </div>
              <div className="space-y-2">
                {navItems.map((item) => (
                  <Link key={item.href} href={item.href} className="nav-link group">
                    <span className="h-6 w-6 rounded-full bg-white/5 border border-white/10 group-hover:border-cyan-400/60 flex items-center justify-center text-xs text-cyan-200">
                      •
                    </span>
                    {item.label}
                  </Link>
                ))}
              </div>
              <div className="mt-auto space-y-3">
                <div className="glass-panel px-4 py-3">
                  <p className="text-xs uppercase text-slate-400">Workers</p>
                  <div className="mt-2 flex items-center justify-between text-sm">
                    <span className="text-slate-200">Send / IMAP</span>
                    <span className="pill">Live</span>
                  </div>
                </div>
                <div className="text-xs text-slate-400">
                  AES-256 secrets protected • SMTP + IMAP only
                </div>
              </div>
            </aside>
            <div className="flex-1 flex flex-col">
              <header className="sticky top-0 z-20 border-b border-white/5 bg-slate-900/70 backdrop-blur-lg px-4 md:px-8 py-4 shadow-lg shadow-cyan-500/5 flex items-center justify-between">
                <div>
                  <p className="text-xs uppercase tracking-widest text-cyan-200">Campaign Control</p>
                  <h1 className="text-xl font-semibold text-white">Deliverability-first automation</h1>
                </div>
                <div className="hidden sm:flex items-center gap-3">
                  <span className="pill">Consent required</span>
                  <span className="pill">IMAP replies tracked</span>
                </div>
              </header>
              <main className="p-4 md:p-8 space-y-8">{children}</main>
            </div>
          </div>
        </div>
      </body>
    </html>
  );
}
