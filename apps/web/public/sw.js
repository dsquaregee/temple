/* Minimal hand-rolled service worker (no SW libs, by design):
   - precache the app shell (language picker + locale homes)
   - stale-while-revalidate for pages
   - cache-first for images and static assets */

const VERSION = 'v1';
const SHELL_CACHE = `shell-${VERSION}`;
const PAGE_CACHE = `pages-${VERSION}`;
const ASSET_CACHE = `assets-${VERSION}`;

const LOCALES = ['en', 'ta', 'te', 'kn', 'ml', 'hi'];
const SHELL = ['/', ...LOCALES.map((l) => `/${l}/`)];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(SHELL_CACHE).then((cache) => cache.addAll(SHELL))
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  const keep = [SHELL_CACHE, PAGE_CACHE, ASSET_CACHE];
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(keys.filter((k) => !keep.includes(k)).map((k) => caches.delete(k)))
      )
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  const { request } = event;
  if (request.method !== 'GET') return;
  const url = new URL(request.url);
  if (url.origin !== self.location.origin) return;

  if (request.destination === 'image' || url.pathname.startsWith('/_next/static/')) {
    // Cache-first: hashed assets and images never change under the same URL.
    event.respondWith(
      caches.open(ASSET_CACHE).then(async (cache) => {
        const hit = await cache.match(request);
        if (hit) return hit;
        const res = await fetch(request);
        if (res.ok) cache.put(request, res.clone());
        return res;
      })
    );
    return;
  }

  if (request.mode === 'navigate') {
    // Stale-while-revalidate: instant paint from cache, refresh in background.
    event.respondWith(
      caches.open(PAGE_CACHE).then(async (cache) => {
        const cached = await caches.match(request);
        const network = fetch(request)
          .then((res) => {
            if (res.ok) cache.put(request, res.clone());
            return res;
          })
          .catch(() => cached);
        return cached || network;
      })
    );
  }
});
