import './globals.css';
import Link from 'next/link';
import { ReactNode } from 'react';

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen">
        <nav className="bg-white shadow px-4 py-3 flex gap-4">
          <Link href="/dashboard">Dashboard</Link>
          <Link href="/email-accounts">Email Accounts</Link>
          <Link href="/leads">Leads</Link>
          <Link href="/campaigns">Campaigns</Link>
          <Link href="/unibox">Unibox</Link>
          <Link href="/settings">Settings</Link>
        </nav>
        <main className="p-6">{children}</main>
      </body>
    </html>
  );
}
