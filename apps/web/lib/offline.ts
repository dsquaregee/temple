'use client';

import { useCallback, useEffect, useState } from 'react';

// Scoped offline download. A page (temple) or a manifest (circuit) lists the
// resources — its HTML, narration audio and hero image — and this stores them in
// a persistent Cache API bucket (`temple-offline`) that the service worker serves
// first and never purges on version bumps. No account, same on-device model as
// saved temples. Cross-origin media (audio/media.dsquaregee.com) is fetched
// no-cors and stored as an opaque response, which <audio>/<img> can still replay.

const CACHE = 'temple-offline';
const KEY = 'temple:offline:v1'; // localStorage: { [key]: string[] of urls }
const EVENT = 'temple:offline-change';

type Store = Record<string, string[]>;

function read(): Store {
  try {
    const raw = localStorage.getItem(KEY);
    const obj = raw ? JSON.parse(raw) : {};
    return obj && typeof obj === 'object' ? (obj as Store) : {};
  } catch {
    return {};
  }
}

function write(store: Store): void {
  try {
    localStorage.setItem(KEY, JSON.stringify(store));
  } catch {
    // Storage blocked/full: the change still applies this session via the event.
  }
  window.dispatchEvent(new Event(EVENT));
}

const supported = () =>
  typeof window !== 'undefined' && 'caches' in window;

async function cacheOne(cache: Cache, url: string): Promise<void> {
  const u = new URL(url, window.location.origin);
  if (u.origin === window.location.origin) {
    await cache.add(u.pathname + u.search); // same-origin page/asset (CORS-safe)
  } else {
    // Cross-origin media: no-cors → opaque response, replayable by media/img.
    const res = await fetch(u.href, { mode: 'no-cors' });
    await cache.put(u.href, res);
  }
}

export type OfflineStatus = 'idle' | 'busy' | 'done';

// Manage offline download for one key (e.g. a temple id or `circuit:<id>`).
export function useOffline(key: string) {
  const [ready, setReady] = useState(false);
  const [downloaded, setDownloaded] = useState(false);
  const [status, setStatus] = useState<OfflineStatus>('idle');
  const [progress, setProgress] = useState(0); // 0..1 during a download

  useEffect(() => {
    const sync = () => setDownloaded(Boolean(read()[key]));
    sync();
    setReady(true);
    window.addEventListener(EVENT, sync);
    window.addEventListener('storage', sync);
    return () => {
      window.removeEventListener(EVENT, sync);
      window.removeEventListener('storage', sync);
    };
  }, [key]);

  const download = useCallback(
    async (urls: string[]) => {
      if (!supported() || urls.length === 0) return;
      setStatus('busy');
      setProgress(0);
      try {
        const cache = await caches.open(CACHE);
        let done = 0;
        // Sequential-ish but lightly batched so a phone isn't overwhelmed; a
        // single failed resource doesn't abort the rest.
        for (const url of urls) {
          try {
            await cacheOne(cache, url);
          } catch {
            // skip a resource that won't fetch (e.g. offline mid-download)
          }
          done += 1;
          setProgress(done / urls.length);
        }
        const store = read();
        store[key] = urls;
        write(store);
      } finally {
        setStatus('done');
      }
    },
    [key]
  );

  const remove = useCallback(async () => {
    if (!supported()) return;
    setStatus('busy');
    try {
      const store = read();
      const urls = store[key] ?? [];
      const cache = await caches.open(CACHE);
      for (const url of urls) {
        try {
          const u = new URL(url, window.location.origin);
          await cache.delete(
            u.origin === window.location.origin ? u.pathname + u.search : u.href
          );
        } catch {
          /* ignore */
        }
      }
      delete store[key];
      write(store);
    } finally {
      setStatus('idle');
    }
  }, [key]);

  return { ready, downloaded, status, progress, download, remove, supported: supported() };
}
