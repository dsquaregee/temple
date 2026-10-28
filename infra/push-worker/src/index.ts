// Festival-reminder push Worker.
//
//   POST /subscribe    { subscription, locale }  → store in KV
//   POST /unsubscribe  { endpoint }              → remove from KV
//   (scheduled, daily) → for each festival within LEAD_DAYS, send a VAPID-signed
//                        payload-free push to every stored subscription, once.
//
// Payload-free: the browser's service worker shows the notification text (see
// apps/web/public/sw.js). This Worker only needs to authorize the push with a
// VAPID JWT — no payload encryption.

import FESTIVAL_DATES from './festival-dates.json';
import { dueFestivals, isoDay, type FestivalDates } from './due.ts';
import { vapidJwk, vapidAuthHeader } from './vapid.ts';
import { isTrackable, totalKey, dayKey, TRACKABLE } from './stats.ts';

interface Env {
  SUBS: KVNamespace;
  VAPID_PUBLIC: string;
  VAPID_PRIVATE_D: string;
  VAPID_SUBJECT: string;
  ALLOW_ORIGIN: string;
  LEAD_DAYS: string;
}

interface PushSubscriptionJSON {
  endpoint: string;
  keys?: { p256dh?: string; auth?: string };
}

const SUB_PREFIX = 'sub:';
const SENT_PREFIX = 'sent:';
const SENT_TTL = 60 * 60 * 24 * 40; // keep dedup markers ~40 days

async function sha256Hex(input: string): Promise<string> {
  const digest = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(input));
  return [...new Uint8Array(digest)].map((b) => b.toString(16).padStart(2, '0')).join('');
}

function cors(env: Env): Record<string, string> {
  return {
    'Access-Control-Allow-Origin': env.ALLOW_ORIGIN,
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'content-type',
  };
}

async function handleSubscribe(req: Request, env: Env): Promise<Response> {
  let body: { subscription?: PushSubscriptionJSON; locale?: string };
  try {
    body = await req.json();
  } catch {
    return new Response('bad json', { status: 400, headers: cors(env) });
  }
  const sub = body.subscription;
  if (!sub || typeof sub.endpoint !== 'string') {
    return new Response('missing subscription', { status: 400, headers: cors(env) });
  }
  const id = await sha256Hex(sub.endpoint);
  await env.SUBS.put(
    SUB_PREFIX + id,
    JSON.stringify({ endpoint: sub.endpoint, keys: sub.keys, locale: body.locale ?? 'en' }),
  );
  return new Response(JSON.stringify({ ok: true }), {
    status: 201,
    headers: { 'content-type': 'application/json', ...cors(env) },
  });
}

async function handleUnsubscribe(req: Request, env: Env): Promise<Response> {
  let body: { endpoint?: string };
  try {
    body = await req.json();
  } catch {
    return new Response('bad json', { status: 400, headers: cors(env) });
  }
  if (!body.endpoint) return new Response('missing endpoint', { status: 400, headers: cors(env) });
  await env.SUBS.delete(SUB_PREFIX + (await sha256Hex(body.endpoint)));
  return new Response(JSON.stringify({ ok: true }), {
    status: 200,
    headers: { 'content-type': 'application/json', ...cors(env) },
  });
}

// Record a feature-usage event (fire-and-forget beacon from the site). Silently
// ignores anything not on the whitelist, so the store can only hold known counters.
async function handleEvent(req: Request, env: Env): Promise<Response> {
  let name: unknown;
  try {
    name = JSON.parse(await req.text())?.name;
  } catch {
    return new Response(null, { status: 204, headers: cors(env) });
  }
  if (!isTrackable(name)) return new Response(null, { status: 204, headers: cors(env) });
  const day = isoDay(new Date());
  for (const key of [totalKey(name), dayKey(name, day)]) {
    const cur = Number(await env.SUBS.get(key)) || 0;
    await env.SUBS.put(key, String(cur + 1));
  }
  return new Response(null, { status: 204, headers: cors(env) });
}

// Aggregate counts for the owner: per-event total + the last 14 days.
async function handleStats(env: Env): Promise<Response> {
  const today = Date.now();
  const out: Record<string, { total: number; days: Record<string, number> }> = {};
  for (const name of TRACKABLE) {
    const total = Number(await env.SUBS.get(totalKey(name))) || 0;
    const days: Record<string, number> = {};
    for (let i = 0; i < 14; i++) {
      const d = isoDay(new Date(today - i * 86400000));
      days[d] = Number(await env.SUBS.get(dayKey(name, d))) || 0;
    }
    out[name] = { total, days };
  }
  return new Response(JSON.stringify(out, null, 2), {
    status: 200,
    headers: { 'content-type': 'application/json', ...cors(env) },
  });
}

// Send one payload-free push. Returns true if the subscription should be dropped
// (gone / expired).
async function sendOne(endpoint: string, env: Env, jwk: JsonWebKey): Promise<boolean> {
  const auth = await vapidAuthHeader(endpoint, env.VAPID_PUBLIC, jwk, env.VAPID_SUBJECT);
  const res = await fetch(endpoint, {
    method: 'POST',
    headers: { Authorization: auth, TTL: '86400' },
  });
  return res.status === 404 || res.status === 410;
}

async function runScheduled(env: Env): Promise<void> {
  const leadDays = Number(env.LEAD_DAYS || '3');
  const today = isoDay(new Date());
  const due = dueFestivals(FESTIVAL_DATES as FestivalDates, today, leadDays);
  if (due.length === 0) return;

  // Only festivals not yet notified for this observance.
  const toSend: { key: string; date: string }[] = [];
  for (const f of due) {
    const marker = `${SENT_PREFIX}${f.key}:${f.date}`;
    if (!(await env.SUBS.get(marker))) toSend.push(f);
  }
  if (toSend.length === 0) return;

  const jwk = vapidJwk(env.VAPID_PUBLIC, env.VAPID_PRIVATE_D);

  // Collect all subscriptions once (KV list may paginate).
  const endpoints: { key: string; endpoint: string }[] = [];
  let cursor: string | undefined;
  do {
    const page = await env.SUBS.list({ prefix: SUB_PREFIX, cursor });
    for (const k of page.keys) {
      const raw = await env.SUBS.get(k.name);
      if (!raw) continue;
      try {
        const parsed = JSON.parse(raw) as { endpoint: string };
        if (parsed.endpoint) endpoints.push({ key: k.name, endpoint: parsed.endpoint });
      } catch {
        /* skip malformed */
      }
    }
    cursor = page.list_complete ? undefined : page.cursor;
  } while (cursor);

  // One tickle per subscription (festivals are coalesced by the fixed SW tag).
  for (const { key, endpoint } of endpoints) {
    try {
      const gone = await sendOne(endpoint, env, jwk);
      if (gone) await env.SUBS.delete(key);
    } catch {
      /* transient; next run retries */
    }
  }

  // Mark each due festival as notified so later runs within the window don't repeat.
  for (const f of toSend) {
    await env.SUBS.put(`${SENT_PREFIX}${f.key}:${f.date}`, '1', { expirationTtl: SENT_TTL });
  }
}

export default {
  async fetch(req: Request, env: Env): Promise<Response> {
    const url = new URL(req.url);
    if (req.method === 'OPTIONS') return new Response(null, { status: 204, headers: cors(env) });
    if (req.method === 'POST' && url.pathname === '/subscribe') return handleSubscribe(req, env);
    if (req.method === 'POST' && url.pathname === '/unsubscribe') return handleUnsubscribe(req, env);
    if (req.method === 'POST' && url.pathname === '/event') return handleEvent(req, env);
    if (req.method === 'GET' && url.pathname === '/stats') return handleStats(env);
    if (url.pathname === '/health') return new Response('ok', { headers: cors(env) });
    return new Response('not found', { status: 404, headers: cors(env) });
  },

  async scheduled(_event: ScheduledEvent, env: Env, ctx: ExecutionContext): Promise<void> {
    ctx.waitUntil(runScheduled(env));
  },
};
