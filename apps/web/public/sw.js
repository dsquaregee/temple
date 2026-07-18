/* Minimal hand-rolled service worker (no libraries — performance budget).
   - Precache the app shell + manifest/icon.
   - Navigations: stale-while-revalidate (instant load, refresh in background).
   - Same-origin static assets: cache-first.
   Content pages are static HTML served from the CDN; the SW just makes repeat
   visits and flaky-network reads resilient. */
const VERSION = 'v2';
const SHELL = `temple-shell-${VERSION}`;
const RUNTIME = `temple-runtime-${VERSION}`;
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
            .filter((k) => k !== SHELL && k !== RUNTIME)
            .map((k) => caches.delete(k))
        )
      )
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  const { request } = event;
  if (request.method !== 'GET') return;
  const url = new URL(request.url);
  if (url.origin !== self.location.origin) return;

  // Navigations → stale-while-revalidate.
  if (request.mode === 'navigate') {
    event.respondWith(
      caches.open(RUNTIME).then(async (cache) => {
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
      })
    );
    return;
  }

  // Static assets → cache-first.
  if (/\.(?:js|css|svg|png|jpg|jpeg|avif|webp|woff2?|json)$/.test(url.pathname)) {
    event.respondWith(
      caches.open(RUNTIME).then(async (cache) => {
        const cached = await cache.match(request);
        if (cached) return cached;
        const res = await fetch(request);
        if (res && res.ok) cache.put(request, res.clone());
        return res;
      })
    );
  }
});
