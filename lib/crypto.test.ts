import { encryptSecret, decryptSecret, isEncrypted, safeEqual } from './crypto.ts';
import assert from 'node:assert';

let pass = 0; const t = (n: string, f: () => void) => {
  try { f(); console.log('  PASS', n); pass++; } catch (e: any) { console.log('  FAIL', n, '-', e.message); process.exitCode = 1; }
};

process.env.TOKEN_ENCRYPTION_KEY = Buffer.alloc(32, 7).toString('base64');

t('round-trips a Slack token', () => {
  const tok = 'fake-provider-token-AAAABBBBCCCCDDDD';
  assert.strictEqual(decryptSecret(encryptSecret(tok)), tok);
});
t('ciphertext does not contain the plaintext', () => {
  const tok = 'fake-provider-token-canary-value';
  assert.ok(!encryptSecret(tok).includes('canary'));
});
t('same input encrypts differently each time (random IV)', () => {
  assert.notStrictEqual(encryptSecret('abc'), encryptSecret('abc'));
});
t('tagged as encrypted', () => {
  assert.ok(isEncrypted(encryptSecret('abc')));
  assert.ok(!isEncrypted('fake-legacy-plaintext'));
});
t('legacy plaintext passes through unchanged', () => {
  assert.strictEqual(decryptSecret('fake-legacy-plaintext'), 'fake-legacy-plaintext');
});
t('tampered ciphertext is rejected', () => {
  const enc = encryptSecret('abc');
  const parts = enc.split(':');
  const b = Buffer.from(parts[3], 'base64'); b[0] ^= 0xff;
  parts[3] = b.toString('base64');
  assert.throws(() => decryptSecret(parts.join(':')));
});
t('wrong key is rejected', () => {
  const enc = encryptSecret('abc');
  process.env.TOKEN_ENCRYPTION_KEY = Buffer.alloc(32, 9).toString('base64');
  assert.throws(() => decryptSecret(enc));
  process.env.TOKEN_ENCRYPTION_KEY = Buffer.alloc(32, 7).toString('base64');
});
t('unicode survives', () => {
  const s = 'tökén-日本語-🔐';
  assert.strictEqual(decryptSecret(encryptSecret(s)), s);
});
t('missing key fails closed', () => {
  const saved = process.env.TOKEN_ENCRYPTION_KEY;
  delete process.env.TOKEN_ENCRYPTION_KEY;
  assert.throws(() => encryptSecret('abc'), /TOKEN_ENCRYPTION_KEY is not set/);
  process.env.TOKEN_ENCRYPTION_KEY = saved;
});
t('wrong key length fails closed', () => {
  const saved = process.env.TOKEN_ENCRYPTION_KEY;
  process.env.TOKEN_ENCRYPTION_KEY = Buffer.alloc(16, 1).toString('base64');
  assert.throws(() => encryptSecret('abc'), /must decode to 32 bytes/);
  process.env.TOKEN_ENCRYPTION_KEY = saved;
});
t('safeEqual behaves', () => {
  assert.ok(safeEqual('abc', 'abc'));
  assert.ok(!safeEqual('abc', 'abd'));
  assert.ok(!safeEqual('abc', 'abcd'));
});
console.log(`\n${pass}/11 passed`);
