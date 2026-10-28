// Web Push client configuration.
//
// The push backend (subscription store + scheduled sender) is a separate
// Cloudflare Worker — see infra/push-worker/ and docs/push-notifications.md.
// Until that Worker is deployed and `enabled` is flipped to true, the "Remind
// me" opt-in does not render, so the site ships this feature dormant with no
// broken UI. Turning it on is a one-line change + a CSP connect-src entry for
// `endpoint`'s origin (apps/web/public/_headers), then a redeploy.
//
// `vapidPublicKey` is the application server key the browser subscribes with. It
// is a PUBLIC key and safe to ship; its private counterpart lives only as the
// Worker secret VAPID_PRIVATE_D.
export const PUSH = {
  // Live: the push Worker (infra/push-worker) is deployed with its KV namespace
  // and VAPID secret set (2026-10-28).
  enabled: true,
  // The push Worker's base URL (no trailing slash) — the deployed workers.dev URL.
  endpoint: 'https://temple-push.dsquaregee.workers.dev',
  // VAPID public key (P-256 uncompressed point, base64url). Generated 2026-10-28.
  vapidPublicKey: 'BD123nEay6oQMUxDt4KOyNlS8yNIbcNd47wfte25qqsAOK8MahPmjmiI6-etDCZe5aGEsWFWYo8i7CS47GokE0M',
} as const;

// Decode a base64url VAPID key to the Uint8Array pushManager.subscribe() wants.
export function urlBase64ToUint8Array(base64: string): Uint8Array {
  const padding = '='.repeat((4 - (base64.length % 4)) % 4);
  const b64 = (base64 + padding).replace(/-/g, '+').replace(/_/g, '/');
  const raw = atob(b64);
  const out = new Uint8Array(raw.length);
  for (let i = 0; i < raw.length; i++) out[i] = raw.charCodeAt(i);
  return out;
}
