/* Minimal hand-rolled service worker (no libraries — performance budget).
   - Precache the app shell + manifest/icon.
   - Navigations: stale-while-revalidate (instant load, refresh in background).
   - Same-origin static assets: cache-first.
   Content pages are static HTML served from the CDN; the SW just makes repeat
   visits and flaky-network reads resilient. */
// Bump this on any change that must invalidate every client's cache — the
// `activate` handler below deletes caches whose names don't match the current
// VERSION, so a bump purges all prior precached/runtime pages on next visit.
// v3: force returning visitors off the pre-migration (temple-502523) caches so
// same-origin pages aren't served stale after the temples2 cutover.
// v4: purge pages cached before the Listen-tab playlist hub shipped, so
// returning visitors don't keep seeing the old single-channel music card.
// v5: purge pages cached before the English narration pronunciation fixes
// (authentic Tamil zh + REV v4 audio/video), so returning visitors' cached
// pages stop pointing at the old audio/video URLs.
// v6: v4 video URLs landed after the v5 bump (the earlier media commit was
// rejected mid-run), so bump again to push the new video narration to users.
// v7: Cloudflare Web Analytics beacon added (+ CSP allowance), so purge pages
// cached before it so returning visitors load the beacon too.
// v8: 90 new Divya Desams (audio, photos, videos, regional circuit pages) —
// purge cached pages so returning visitors see the new media and maps.
// v18: 12 Maha Shakti Peethas added (audio ×6 locales for all, real hero/video
// for the 5/4 with qualifying CC photos) — purge so returning visitors load the
// new temples' media and the Shakti Peethas circuit pages.
// v19: Festival calendar shipped (new Festivals tab + /festivals/ pages) and the
// Discover search index now includes festival names — purge so returning
// visitors get the new tab/pages and the updated /search/<locale>.json instead
// of the stale-while-revalidate cached copies.
// v20: "Festivals this month" strip added to Home and the Festivals tab —
// purge so returning visitors get the new home/festivals pages rather than the
// stale-while-revalidate cached copies.
// v21: festival observance dates (Drik Panchang) added — upcoming dates now show
// on Home/Festivals and temple pages carry festival Event structured data. Purge
// so returning visitors get the dated pages.
// v22: festival date table extended through 2029 (Drik Panchang) — purge so
// returning visitors get the refreshed upcoming dates and Event data.
// v23: scoped offline download (per-temple / per-circuit) — a persistent
// `temple-offline` cache the user fills on demand; it survives version bumps and
// is served first, including the cross-origin narration audio / hero media.
// v24: Discover "Near me" — ranks temples by distance from the device using a
// new locale-independent /geo/coords.json. Purge so returning visitors get the
// new Discover control and the coords file instead of the stale-cached pages.
// v25: festival reminders — "Add to calendar" (.ics) on festival pages, and Web
// Push handlers (push / notificationclick) so festival alerts open the Festivals
// page. Purge so returning visitors get the new pages and SW handlers.
// v26: festival push reminders enabled (push Worker live) — the Festivals tab now
// renders the "Remind me" opt-in. Purge so returning visitors get the toggle.
// v27: Discover "Near me" now shows a permission explainer + unblock help and
// remembers the last location — purge so returning visitors get the new flow.
// v28: "Near me" adds a choose-a-city fallback (rank by distance from a city when
// GPS is unavailable) — purge so returning visitors get it.
// v29: "Near me" promoted to a prominent CTA on Home + top of Discover, and the
// blocked-location help adapts to installed-app vs browser — purge for the new UI.
// v30: Discover filters redesigned as a collapsible accordion with removable
// active-filter chips; blocked-location panel leads with the city picker — purge.
// v31: corrected the blocked-location browser help (Android/desktop accurate,
// no more "address-bar lock icon") — purge so visitors get the right steps.
const VERSION = 'v31';
const SHELL = `temple-shell-${VERSION}`;
const RUNTIME = `temple-runtime-${VERSION}`;
// Version-INDEPENDENT: holds content the user explicitly downloaded for offline
// use. Never purged on activate, so a bumped service worker can't wipe a
// pilgrim's saved circuit. Managed from the page via the Cache API.
const OFFLINE = 'temple-offline';
// Cross-origin hosts that serve downloadable media (narration audio, hero
// photos). Requests to these are served from the OFFLINE cache when present.
const MEDIA_HOSTS = ['audio.dsquaregee.com', 'media.dsquaregee.com'];
const PRECACHE = ['/', '/offline/', '/manifest.webmanifest', '/icon.svg'];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(SHELL).then((cache) => cache.addAll(PRECACHE)).then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(
          keys
            .filter((k) => k !== SHELL && k !== RUNTIME && k !== OFFLINE)
            .map((k) => caches.delete(k))
        )
      )
      .then(() => self.clients.claim())
  );
});

// --- Festival push reminders -------------------------------------------------
// Payload-free Web Push: the push Worker sends a tickle near each festival; we
// show a localized notification that opens the Festivals page. The locale is
// remembered in a cache entry the opt-in writes (the push event carries no
// data), defaulting to English.
const PUSH_LOCALE_KEY = '/__push-locale';
const PUSH_TEXT = {
  en: { title: 'Temple festivals', body: 'An upcoming festival — tap for the dates.' },
  ta: { title: 'கோயில் விழாக்கள்', body: 'வரவிருக்கும் விழா — தேதிகளைக் காண தட்டவும்.' },
  te: { title: 'ఆలయ పండుగలు', body: 'రాబోయే పండుగ — తేదీల కోసం నొక్కండి.' },
  kn: { title: 'ದೇವಾಲಯ ಹಬ್ಬಗಳು', body: 'ಮುಂಬರುವ ಹಬ್ಬ — ದಿನಾಂಕಗಳಿಗೆ ಟ್ಯಾಪ್ ಮಾಡಿ.' },
  ml: { title: 'ക്ഷേത്ര ഉത്സവങ്ങൾ', body: 'വരാനിരിക്കുന്ന ഉത്സവം — തീയതികൾക്കായി ടാപ്പ് ചെയ്യുക.' },
  hi: { title: 'मंदिर उत्सव', body: 'आगामी उत्सव — तिथियों के लिए टैप करें।' },
};

self.addEventListener('message', (event) => {
  const data = event.data;
  if (data && data.type === 'push-locale' && typeof data.locale === 'string') {
    event.waitUntil(
      caches
        .open(OFFLINE)
        .then((cache) => cache.put(PUSH_LOCALE_KEY, new Response(data.locale)))
        .catch(() => {})
    );
  }
});

async function pushLocale() {
  try {
    const cache = await caches.open(OFFLINE);
    const hit = await cache.match(PUSH_LOCALE_KEY);
    if (hit) {
      const loc = (await hit.text()).trim();
      if (PUSH_TEXT[loc]) return loc;
    }
  } catch (_) {
    /* fall through to default */
  }
  return 'en';
}

self.addEventListener('push', (event) => {
  event.waitUntil(
    (async () => {
      const loc = await pushLocale();
      const text = PUSH_TEXT[loc] || PUSH_TEXT.en;
      await self.registration.showNotification(text.title, {
        body: text.body,
        icon: '/icon.svg',
        badge: '/icon.svg',
        tag: 'temple-festival',
        data: { url: `/${loc}/festivals/` },
      });
    })()
  );
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  const target = (event.notification.data && event.notification.data.url) || '/';
  event.waitUntil(
    self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clients) => {
      for (const client of clients) {
        if ('focus' in client) {
          client.navigate(target).catch(() => {});
          return client.focus();
        }
      }
      return self.clients.openWindow(target);
    })
  );
});

self.addEventListener('fetch', (event) => {
  const { request } = event;
  if (request.method !== 'GET') return;
  const url = new URL(request.url);
  const sameOrigin = url.origin === self.location.origin;
  const isMedia = MEDIA_HOSTS.includes(url.hostname);
  if (!sameOrigin && !isMedia) return;

  // Downloaded cross-origin media (narration audio, hero photos): serve from the
  // offline cache when it was explicitly downloaded, else go to the network.
  if (isMedia) {
    event.respondWith(
      caches.open(OFFLINE).then(async (cache) => {
        const hit = await cache.match(request, { ignoreVary: true });
        return hit || fetch(request);
      })
    );
    return;
  }

  // Navigations → offline download first, then stale-while-revalidate.
  if (request.mode === 'navigate') {
    event.respondWith(
      (async () => {
        const offline = await caches.open(OFFLINE);
        const downloaded = await offline.match(request, { ignoreVary: true });
        if (downloaded) return downloaded;
        const cache = await caches.open(RUNTIME);
        const cached = await cache.match(request);
        const network = fetch(request)
          .then((res) => {
            if (res && res.ok) cache.put(request, res.clone());
            return res;
          })
          // Offline and never-visited: show the branded offline page rather
          // than a browser error. Precached in SHELL, so it's always available.
          .catch(() => cached || caches.match('/offline/'));
        return cached || network;
      })()
    );
    return;
  }

  // Same-origin static assets → offline download first, then cache-first.
  if (/\.(?:js|css|svg|png|jpg|jpeg|avif|webp|woff2?|json)$/.test(url.pathname)) {
    event.respondWith(
      (async () => {
        const offline = await caches.open(OFFLINE);
        const downloaded = await offline.match(request, { ignoreVary: true });
        if (downloaded) return downloaded;
        const cache = await caches.open(RUNTIME);
        const cached = await cache.match(request);
        if (cached) return cached;
        const res = await fetch(request);
        if (res && res.ok) cache.put(request, res.clone());
        return res;
      })()
    );
  }
});
