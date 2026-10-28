# Festival reminders — operations

Two reminder paths ship with the festival calendar:

1. **Add to calendar (.ics)** — live, no backend. A button on every festival page
   downloads a one-event `.ics` for the festival's next observance (with a
   one-day-before alarm). The visitor's own calendar app then reminds them. Works
   on every platform. Nothing to operate.

2. **Web Push ("Remind me")** — a "🔕 Remind me" toggle on the Festivals tab that
   subscribes the browser to push, so the app can alert the devotee a few days
   before each festival **even when the app is closed**. This needs a small
   backend (below). It ships **dormant** (`apps/web/lib/push-config.ts` →
   `enabled: false`), so the toggle does not appear until you turn it on.

---

## Web Push: one-time setup (≈5 minutes)

The push backend is a **separate** Cloudflare Worker (`infra/push-worker/`). It is
independent of the main `temple` site Worker, so none of this can break the live
site. It stores subscriptions in a KV namespace and, on a daily cron, sends a
VAPID-signed "tickle" to every subscriber for festivals coming up within the lead
window. The browser's service worker shows the notification (payload-free — no
message content crosses the wire, so there is no payload encryption to manage).

### Prerequisites

- Wrangler + a logged-in Cloudflare account: `cd infra/push-worker && npm install && npx wrangler login`

### Step 1 — Create the KV namespace

```
cd infra/push-worker
npx wrangler kv namespace create SUBS
```

Copy the printed `id` into `infra/push-worker/wrangler.jsonc`, replacing
`REPLACE_WITH_KV_NAMESPACE_ID`.

### Step 2 — Set the VAPID private key (secret)

The public key is already committed (in `wrangler.jsonc` and
`apps/web/lib/push-config.ts`). Set its private counterpart as a secret — ask
Claude for the value generated on 2026-10-28 (`VAPID_PRIVATE_D`), or generate a
fresh pair (see "Rotating keys" below) and update the public key in both files.

```
npx wrangler secret put VAPID_PRIVATE_D
# paste the base64url private scalar `d` when prompted
```

### Step 3 — Deploy the Worker

```
npx wrangler deploy
```

This publishes `temple-push` with its daily cron (`30 2 * * *` ≈ 08:00 IST).

### Step 4 — Route it at `push.dsquaregee.com` (recommended)

In the Cloudflare dashboard → Workers & Pages → `temple-push` → **Triggers** →
**Custom Domains**, add `push.dsquaregee.com`. (The site's CSP and
`push-config.ts` already expect this origin.)

If you instead keep the default `temple-push.<your-subdomain>.workers.dev` URL,
update `endpoint` in `apps/web/lib/push-config.ts` **and** the
`connect-src` entry in `apps/web/public/_headers` to that URL.

### Step 5 — Turn the toggle on

Flip `enabled: false` → `true` in `apps/web/lib/push-config.ts`, commit, and let
the site redeploy. The "Remind me" toggle now appears on the Festivals tab.
(Claude can do this step in a one-line PR once steps 1–4 are confirmed.)

### Verify

- `curl https://push.dsquaregee.com/health` → `ok`
- On the live site, open the Festivals tab, tap **Remind me**, allow
  notifications. The subscription is stored in KV
  (`npx wrangler kv key list --binding SUBS`).
- Force a send without waiting for a festival:
  `npx wrangler dev --test-scheduled` then
  `curl "http://localhost:8787/__scheduled?cron=30+2+*+*+*"` — or temporarily
  widen `LEAD_DAYS` in `wrangler.jsonc`.

---

## Platform notes

- **Android / desktop Chrome, Edge, Firefox** — full support.
- **iPhone / iPad (Safari)** — Web Push works **only if the user has installed the
  PWA** ("Share → Add to Home Screen", iOS 16.4+). In a normal Safari tab the
  "Remind me" toggle will request permission but iOS will not deliver pushes until
  it is installed. The `.ics` "Add to calendar" path has no such limit, which is
  why both ship.

## Keeping festival dates in sync

The Worker ships its own `src/festival-dates.json` (it is deployed separately and
can't import the web bundle). A test
(`infra/push-worker/test/dates-sync.test.ts`) fails if it drifts from core
`FESTIVAL_DATES`. When the `refresh-festival-dates` routine updates core, update
this file to match and redeploy the Worker.

## Rotating keys

Generate a new pair:

```
node -e 'const{generateKeyPairSync}=require("crypto");const{publicKey,privateKey}=generateKeyPairSync("ec",{namedCurve:"prime256v1"});const d=publicKey.export({type:"spki",format:"der"});const p=d.subarray(d.length-65);const b=x=>Buffer.from(x).toString("base64url");console.log("PUBLIC",b(p));console.log("PRIVATE_D",privateKey.export({format:"jwk"}).d)'
```

Put `PUBLIC` in `wrangler.jsonc` (`VAPID_PUBLIC`) and
`apps/web/lib/push-config.ts` (`vapidPublicKey`); set `PRIVATE_D` as the secret.
Rotating invalidates existing subscriptions — users re-enable on next visit.
