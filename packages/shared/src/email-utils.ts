import dns from 'dns/promises';
import { randomInt } from 'crypto';

export type ProviderMatch = 'google' | 'microsoft' | 'zoho' | 'other';

export function normalizeEmail(email: string): string {
  return email.trim().toLowerCase();
}

export async function guessProvider(email: string): Promise<ProviderMatch> {
  const domain = email.split('@')[1];
  try {
    const mxRecords = await dns.resolveMx(domain);
    const exchanges = mxRecords.map((m) => m.exchange.toLowerCase());
    if (exchanges.some((r) => r.includes('google.com') || r.includes('googlemail.com'))) {
      return 'google';
    }
    if (exchanges.some((r) => r.includes('outlook.com') || r.includes('microsoft.com') || r.includes('office365.com'))) {
      return 'microsoft';
    }
    if (exchanges.some((r) => r.includes('zoho.com'))) {
      return 'zoho';
    }
    return 'other';
  } catch (err) {
    return 'other';
  }
}

export function computeJitterDelay(minGapMinutes: number, jitterMinutes: number): number {
  const gapMs = minGapMinutes * 60 * 1000;
  const jitterMs = randomInt(0, (jitterMinutes || 0) * 60 * 1000 + 1);
  return gapMs + jitterMs;
}
