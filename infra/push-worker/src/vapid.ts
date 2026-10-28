// VAPID (RFC 8292) request signing for payload-free Web Push, using only the
// Web Crypto API available in the Workers runtime (and in Node 18+ for tests).
// We send no encrypted payload — just a VAPID-authorized tickle — so the only
// crypto needed is an ES256 JWT signed with the application server's P-256 key.

function b64urlFromBytes(bytes: Uint8Array): string {
  let s = '';
  for (const b of bytes) s += String.fromCharCode(b);
  return btoa(s).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

function b64urlFromString(str: string): string {
  return b64urlFromBytes(new TextEncoder().encode(str));
}

function bytesFromB64url(b64url: string): Uint8Array {
  const pad = '='.repeat((4 - (b64url.length % 4)) % 4);
  const b64 = (b64url + pad).replace(/-/g, '+').replace(/_/g, '/');
  const raw = atob(b64);
  const out = new Uint8Array(raw.length);
  for (let i = 0; i < raw.length; i++) out[i] = raw.charCodeAt(i);
  return out;
}

/**
 * Derive the private-key JWK from the public VAPID key (uncompressed P-256
 * point, base64url) and the private scalar `d` (base64url). The public point's
 * x/y halves become the JWK x/y.
 */
export function vapidJwk(publicKeyB64url: string, privateD: string): JsonWebKey {
  const point = bytesFromB64url(publicKeyB64url);
  if (point.length !== 65 || point[0] !== 0x04) {
    throw new Error('VAPID public key must be a 65-byte uncompressed P-256 point');
  }
  return {
    kty: 'EC',
    crv: 'P-256',
    x: b64urlFromBytes(point.slice(1, 33)),
    y: b64urlFromBytes(point.slice(33, 65)),
    d: privateD,
    ext: true,
  };
}

/** The scheme+host of a push endpoint URL — the JWT `aud`. */
export function audienceOf(endpoint: string): string {
  const u = new URL(endpoint);
  return `${u.protocol}//${u.host}`;
}

/**
 * Build an ES256 VAPID JWT for one push endpoint. `now` (ms) is injectable for
 * tests; `exp` defaults to 12h out (the spec caps it at 24h).
 */
export async function buildVapidJwt(
  jwk: JsonWebKey,
  audience: string,
  subject: string,
  now: number = Date.now(),
): Promise<string> {
  const header = b64urlFromString(JSON.stringify({ typ: 'JWT', alg: 'ES256' }));
  const payload = b64urlFromString(
    JSON.stringify({
      aud: audience,
      exp: Math.floor(now / 1000) + 12 * 60 * 60,
      sub: subject,
    }),
  );
  const signingInput = `${header}.${payload}`;
  const key = await crypto.subtle.importKey(
    'jwk',
    jwk,
    { name: 'ECDSA', namedCurve: 'P-256' },
    false,
    ['sign'],
  );
  const sig = await crypto.subtle.sign(
    { name: 'ECDSA', hash: 'SHA-256' },
    key,
    new TextEncoder().encode(signingInput),
  );
  // Web Crypto returns the raw r||s (JOSE) signature — exactly what JWT wants.
  return `${signingInput}.${b64urlFromBytes(new Uint8Array(sig))}`;
}

/** The `Authorization: vapid ...` header value for a given endpoint. */
export async function vapidAuthHeader(
  endpoint: string,
  publicKeyB64url: string,
  jwk: JsonWebKey,
  subject: string,
  now?: number,
): Promise<string> {
  const jwt = await buildVapidJwt(jwk, audienceOf(endpoint), subject, now);
  return `vapid t=${jwt}, k=${publicKeyB64url}`;
}
