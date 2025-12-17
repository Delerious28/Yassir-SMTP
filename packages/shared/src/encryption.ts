import crypto from 'crypto';

const IV_LENGTH = 12;
const AUTH_TAG_LENGTH = 16;

export function getMasterKey(): Buffer {
  const base64 = process.env.MASTER_KEY;
  if (!base64) {
    throw new Error('MASTER_KEY missing');
  }
  const key = Buffer.from(base64, 'base64');
  if (key.length !== 32) {
    throw new Error('MASTER_KEY must be 32 bytes base64');
  }
  return key;
}

export function encryptSecret(plain: string): string {
  const key = getMasterKey();
  const iv = crypto.randomBytes(IV_LENGTH);
  const cipher = crypto.createCipheriv('aes-256-gcm', key, iv);
  const ciphertext = Buffer.concat([cipher.update(plain, 'utf8'), cipher.final()]);
  const authTag = cipher.getAuthTag();
  return Buffer.concat([iv, authTag, ciphertext]).toString('base64');
}

export function decryptSecret(payload: string): string {
  const key = getMasterKey();
  const data = Buffer.from(payload, 'base64');
  const iv = data.subarray(0, IV_LENGTH);
  const authTag = data.subarray(IV_LENGTH, IV_LENGTH + AUTH_TAG_LENGTH);
  const ciphertext = data.subarray(IV_LENGTH + AUTH_TAG_LENGTH);
  const decipher = crypto.createDecipheriv('aes-256-gcm', key, iv);
  decipher.setAuthTag(authTag);
  const plain = Buffer.concat([decipher.update(ciphertext), decipher.final()]).toString('utf8');
  return plain;
}
