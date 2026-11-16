// Advertise-form Worker — captures "list your stay" enquiries from the site's
// /advertise page. SEPARATE from the main `temple` static-assets site (like the
// push Worker) so it can never break the site deploy. Mounted on the site's own
// origin via a route (temples.dsquaregee.com/api/advertise), so the browser
// posts same-origin — no CORS, and the strict site CSP (connect-src 'self') is
// satisfied with no change.
//
//   POST /api/advertise            { name, listing, place, url, email, phone?, message? }
//                                  → store in KV, optionally email support@
//   GET  /api/advertise?token=...  → list recent submissions (owner only)
//
// Durable store is KV; email (via Resend) is best-effort and only runs when
// RESEND_API_KEY is set. No third-party form service, no Google.

interface Env {
  SUBMISSIONS: KVNamespace;
  // Optional: where enquiries are emailed, and the Resend key that sends them.
  NOTIFY_TO?: string;
  RESEND_API_KEY?: string;
  RESEND_FROM?: string;
  // Required to read submissions back via GET.
  ADMIN_TOKEN?: string;
}

const PREFIX = 'sub:';
const MAX_BODY = 16 * 1024; // 16 KB is plenty for a contact form
const MAX_FIELD = 2000;
const FIELDS = ['name', 'listing', 'place', 'url', 'email', 'phone', 'message'] as const;
const REQUIRED = ['name', 'listing', 'place', 'url', 'email'] as const;

const json = (body: unknown, status = 200): Response =>
  new Response(JSON.stringify(body), {
    status,
    headers: { 'content-type': 'application/json', 'cache-control': 'no-store' },
  });

function clean(v: unknown): string {
  return typeof v === 'string' ? v.trim().slice(0, MAX_FIELD) : '';
}

function validEmail(s: string): boolean {
  return /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(s);
}

function validUrl(s: string): boolean {
  try {
    const u = new URL(s);
    return u.protocol === 'http:' || u.protocol === 'https:';
  } catch {
    return false;
  }
}

async function notify(env: Env, rec: Record<string, string>): Promise<void> {
  if (!env.RESEND_API_KEY || !env.NOTIFY_TO) return;
  const lines = FIELDS.filter((f) => rec[f]).map((f) => `${f}: ${rec[f]}`).join('\n');
  try {
    await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        authorization: `Bearer ${env.RESEND_API_KEY}`,
        'content-type': 'application/json',
      },
      body: JSON.stringify({
        from: env.RESEND_FROM || 'Temple <onboarding@resend.dev>',
        to: [env.NOTIFY_TO],
        reply_to: rec.email,
        subject: `Stay listing: ${rec.listing} (${rec.place})`,
        text: `New stay-listing enquiry from the Temple site:\n\n${lines}\n`,
      }),
    });
  } catch {
    // Best-effort: the submission is already saved in KV regardless.
  }
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);
    if (!url.pathname.replace(/\/$/, '').endsWith('/api/advertise')) {
      return json({ error: 'not found' }, 404);
    }

    // Owner read-back: GET with the admin token lists recent submissions.
    if (request.method === 'GET') {
      const token = url.searchParams.get('token') || '';
      if (!env.ADMIN_TOKEN || token !== env.ADMIN_TOKEN) return json({ error: 'forbidden' }, 403);
      const list = await env.SUBMISSIONS.list({ prefix: PREFIX, limit: 200 });
      const items = await Promise.all(
        list.keys.map(async (k) => JSON.parse((await env.SUBMISSIONS.get(k.name)) || '{}')),
      );
      items.sort((a, b) => (a.at < b.at ? 1 : -1));
      return json({ count: items.length, items });
    }

    if (request.method !== 'POST') return json({ error: 'method not allowed' }, 405);

    const raw = await request.text();
    if (raw.length > MAX_BODY) return json({ error: 'too large' }, 413);
    let data: Record<string, unknown>;
    try {
      data = JSON.parse(raw);
    } catch {
      return json({ error: 'bad json' }, 400);
    }

    // Honeypot: a bot that filled the hidden field. Accept silently, store nothing.
    if (clean(data.company)) return json({ ok: true });

    const rec: Record<string, string> = { at: new Date().toISOString() };
    for (const f of FIELDS) rec[f] = clean(data[f]);
    for (const f of REQUIRED) {
      if (!rec[f]) return json({ error: `missing ${f}` }, 400);
    }
    if (!validEmail(rec.email)) return json({ error: 'bad email' }, 400);
    if (!validUrl(rec.url)) return json({ error: 'bad url' }, 400);
    rec.ip = request.headers.get('cf-connecting-ip') || '';
    rec.ua = (request.headers.get('user-agent') || '').slice(0, 300);

    const key = `${PREFIX}${Date.now()}:${crypto.randomUUID().slice(0, 8)}`;
    await env.SUBMISSIONS.put(key, JSON.stringify(rec));
    await notify(env, rec);

    return json({ ok: true });
  },
};
