# "Stay nearby" sponsored listings + the advertise form

Monetizes the temple **Stay nearby** slot: advertisers (homestays, guest houses,
hotels near a temple) submit an enquiry on `/advertise`, you take payment offline
(GPay/UPI), and you publish their listing in that temple's Stay section — marked
**Sponsored** — for an agreed period. Lapsed listings drop off automatically.

Two halves:

1. **App side** (already live via the normal static deploy): the `/advertise`
   page + form, the "List your stay here" links, the `Sponsored` label, and
   build-time expiry. Nothing to configure.
2. **Capture side** (one-time, below): a small Cloudflare Worker that receives
   the form and stores it. Until it's deployed, the form falls back to a mailto
   to `support@dsquaregee.com`, so the page is never a dead end.

---

## Publishing a paid listing

Add an entry to the temple's content JSON (all nine locales — same `stay` array),
with `sponsored: true` and an `until` date:

```jsonc
"stay": [
  {
    "name": "Hill View Homestay — Ground floor",
    "url": "https://airbnb.com/h/hvhs"
  },
  {
    "name": "Some Paid Homestay",
    "url": "https://airbnb.com/h/xxxx",
    "sponsored": true,       // renders the "Sponsored" label
    "until": "2027-03-01"    // hidden from this date, at the next build
  }
]
```

`until` is applied **at build time** (`activeStays()` in `packages/core/src/stay.ts`),
so a lapsed listing comes down on the next deploy. To guarantee same-day expiry
without a content change, trigger a rebuild on/after that date (e.g. a scheduled
Cloudflare deploy or a manual re-deploy). Then bump the service worker `VERSION`
as usual.

Keep it to a few per temple, relevant and family-safe. The owner's own listings
leave `sponsored` unset (no label).

---

## One-time: deploy the capture Worker

The Worker is **separate** from the main site (like `infra/push-worker`), so it
can never break the site. It mounts on the site's own origin at
`temples.dsquaregee.com/api/advertise`, so the browser posts **same-origin** — no
CORS, and the site CSP (`connect-src 'self'`) needs no change.

From `infra/advertise-worker/`:

```bash
npm install

# 1. Create the KV store and paste the printed id into wrangler.jsonc (SUBMISSIONS)
npx wrangler kv namespace create SUBMISSIONS

# 2. A token so only you can read submissions back
npx wrangler secret put ADMIN_TOKEN

# 3. (optional) email notifications via Resend — else submissions live in KV only
npx wrangler secret put RESEND_API_KEY
#    and set RESEND_FROM in wrangler.jsonc to a verified sender on dsquaregee.com

# 4. Deploy (the route in wrangler.jsonc binds /api/advertise on the live zone)
npx wrangler deploy
```

The zone `dsquaregee.com` must be on the same Cloudflare account. If you'd rather
use the `*.workers.dev` URL instead of the route, drop `routes` from
`wrangler.jsonc`, point `ENDPOINT` in `apps/web/components/AdvertiseForm.tsx` at
that URL, and add it to the site CSP `connect-src` **and** `form-action` in
`apps/web/public/_headers`.

### Reading submissions

Durable store is KV. Fetch recent ones with your token:

```bash
curl "https://temples.dsquaregee.com/api/advertise?token=YOUR_ADMIN_TOKEN"
```

(or `npx wrangler kv key list --binding SUBMISSIONS` from the worker dir). With
`RESEND_API_KEY` set, each enquiry is also emailed to `NOTIFY_TO`
(`support@dsquaregee.com`).

---

## Notes

- **Disclosure**: paid listings always show "Sponsored" (ASCI/advertising norms,
  and it keeps the catalog trustworthy). Don't remove it.
- **Spam**: the form has a honeypot; the Worker validates and size-caps input.
  Turn on Cloudflare Bot Fight / rate limiting for the route if abuse appears.
- **Compliance**: a US entity taking ad revenue from Indian advertisers via
  GPay/UPI has tax/reporting (and possibly GST/FEMA) implications — confirm with
  an accountant before scaling. This file is operational guidance, not legal or
  tax advice.
