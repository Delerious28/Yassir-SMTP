import { describe, expect, it } from 'vitest';
import { normalizeEmail, computeJitterDelay, encryptSecret, decryptSecret } from '@yassir/shared';

describe('email normalization', () => {
  it('lowercases and trims', () => {
    expect(normalizeEmail(' Test@Example.Com ')).toBe('test@example.com');
  });
});

describe('encryption', () => {
  it('roundtrips data', () => {
    process.env.MASTER_KEY = Buffer.alloc(32, 1).toString('base64');
    const cipher = encryptSecret('secret');
    expect(decryptSecret(cipher)).toBe('secret');
  });
});

describe('scheduler', () => {
  it('computes gap with jitter', () => {
    const value = computeJitterDelay(1, 0);
    expect(value).toBe(60000);
  });
});
