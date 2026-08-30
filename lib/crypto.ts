import { createCipheriv, createDecipheriv, randomBytes, timingSafeEqual } from 'node:crypto';

/**
 * Authenticated encryption for credentials we hold on a user's behalf.
 *
 * Stored form is `v1:<iv>:<tag>:<ciphertext>`, all base64. The version prefix
 * lets us rotate the scheme later, and lets `decryptSecret` pass through rows
 * written before this landed instead of failing on them.
 *
 * The key lives in the environment, never in the database, so a dump of the
 * database on its own does not yield usable tokens.
 */

const VERSION = 'v1';
const ALGO = 'aes-256-gcm';
const IV_BYTES = 12;

function key(): Buffer {
  const raw = process.env.TOKEN_ENCRYPTION_KEY;
  if (!raw) {
    throw new Error(
      'TOKEN_ENCRYPTION_KEY is not set. Generate one with ' +
        '`openssl rand -base64 32` and set it before connecting an account.',
    );
  }
  const k = Buffer.from(raw, 'base64');
  if (k.length !== 32) {
    throw new Error(
      `TOKEN_ENCRYPTION_KEY must decode to 32 bytes, got ${k.length}. ` +
        'Generate one with `openssl rand -base64 32`.',
    );
  }
  return k;
}

export function isEncrypted(stored: string): boolean {
  return typeof stored === 'string' && stored.startsWith(`${VERSION}:`);
}

export function encryptSecret(plaintext: string): string {
  const iv = randomBytes(IV_BYTES);
  const cipher = createCipheriv(ALGO, key(), iv);
  const ciphertext = Buffer.concat([cipher.update(plaintext, 'utf8'), cipher.final()]);
  return [
    VERSION,
    iv.toString('base64'),
    cipher.getAuthTag().toString('base64'),
    ciphertext.toString('base64'),
  ].join(':');
}

export function decryptSecret(stored: string): string {
  // Rows written before this shipped are plaintext. Return them so existing
  // connections keep working; they are re-encrypted on the next write.
  if (!isEncrypted(stored)) return stored;

  const [, ivB64, tagB64, ctB64] = stored.split(':');
  if (!ivB64 || !tagB64 || !ctB64) {
    throw new Error('Stored credential is malformed and cannot be decrypted.');
  }

  const decipher = createDecipheriv(ALGO, key(), Buffer.from(ivB64, 'base64'));
  decipher.setAuthTag(Buffer.from(tagB64, 'base64'));
  return Buffer.concat([
    decipher.update(Buffer.from(ctB64, 'base64')),
    decipher.final(),
  ]).toString('utf8');
}

/** Constant-time compare, for webhook tokens and the cron secret. */
export function safeEqual(a: string, b: string): boolean {
  const ab = Buffer.from(a);
  const bb = Buffer.from(b);
  if (ab.length !== bb.length) return false;
  return timingSafeEqual(ab, bb);
}
