import { test } from 'node:test';
import assert from 'node:assert/strict';
import { vapidJwk, buildVapidJwt, audienceOf, vapidAuthHeader } from '../src/vapid.ts';

function b64urlToBytes(s: string): Uint8Array {
  const pad = '='.repeat((4 - (s.length % 4)) % 4);
  const b64 = (s + pad).replace(/-/g, '+').replace(/_/g, '/');
  const raw = atob(b64);
  const out = new Uint8Array(raw.length);
  for (let i = 0; i < raw.length; i++) out[i] = raw.charCodeAt(i);
  return out;
}
function bytesToB64url(b: Uint8Array): string {
  let s = '';
  for (const x of b) s += String.fromCharCode(x);
  return btoa(s).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}
function jsonFromB64url(s: string): any {
  return JSON.parse(new TextDecoder().decode(b64urlToBytes(s)));
}

// Build a throwaway VAPID keypair so no real secret is in the test.
async function makeKeys() {
  const kp = await crypto.subtle.generateKey({ name: 'ECDSA', namedCurve: 'P-256' }, true, [
    'sign',
    'verify',
  ]);
  const rawPub = new Uint8Array(await crypto.subtle.exportKey('raw', kp.publicKey)); // 65 bytes
  const privJwk = (await crypto.subtle.exportKey('jwk', kp.privateKey)) as JsonWebKey;
  return { publicB64url: bytesToB64url(rawPub), d: privJwk.d as string, rawPub };
}

test('audienceOf returns scheme + host only', () => {
  assert.equal(audienceOf('https://fcm.googleapis.com/fcm/send/abc123'), 'https://fcm.googleapis.com');
});

test('vapidJwk rejects a malformed public key', () => {
  assert.throws(() => vapidJwk('AAAA', 'd'));
});

test('buildVapidJwt makes a verifiable ES256 JWT with the right claims', async () => {
  const { publicB64url, d, rawPub } = await makeKeys();
  const jwk = vapidJwk(publicB64url, d);
  const now = 1_700_000_000_000;
  const jwt = await buildVapidJwt(jwk, 'https://push.example.com', 'mailto:support@dsquaregee.com', now);

  const [h, p, sig] = jwt.split('.');
  assert.equal(jsonFromB64url(h).alg, 'ES256');
  const payload = jsonFromB64url(p);
  assert.equal(payload.aud, 'https://push.example.com');
  assert.equal(payload.sub, 'mailto:support@dsquaregee.com');
  assert.equal(payload.exp, Math.floor(now / 1000) + 12 * 60 * 60);

  // Verify the signature with the public key (raw r||s, SHA-256).
  const pubKey = await crypto.subtle.importKey(
    'raw',
    rawPub,
    { name: 'ECDSA', namedCurve: 'P-256' },
    false,
    ['verify'],
  );
  const ok = await crypto.subtle.verify(
    { name: 'ECDSA', hash: 'SHA-256' },
    pubKey,
    b64urlToBytes(sig),
    new TextEncoder().encode(`${h}.${p}`),
  );
  assert.ok(ok, 'signature verifies against the public key');
});

test('vapidAuthHeader has the vapid t=,k= shape', async () => {
  const { publicB64url, d } = await makeKeys();
  const jwk = vapidJwk(publicB64url, d);
  const header = await vapidAuthHeader(
    'https://fcm.googleapis.com/fcm/send/x',
    publicB64url,
    jwk,
    'mailto:support@dsquaregee.com',
  );
  assert.match(header, /^vapid t=[\w-]+\.[\w-]+\.[\w-]+, k=/);
  assert.ok(header.endsWith(publicB64url));
});
