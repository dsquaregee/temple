'use client';

import { useCallback, useEffect, useState } from 'react';
import { firebaseConfig } from './firebase';
import { createFavoritesSync } from './favorites-sync';

// Anonymous, on-device "saved temples". No account required (design: sign-in is
// deferred until a feature truly needs it) — favorites live in localStorage and
// sync across every component instance and browser tab.
//
// When Firebase is configured (NEXT_PUBLIC_FIREBASE_* env vars present), an
// optional sync layer additionally mirrors saves to the user's Firestore doc
// under an anonymous auth uid, so saves follow the devotee across devices.
// Without that config the hook behaves exactly as before — localStorage only.
const KEY = 'temple:saved:v1';
const EVENT = 'temple:saved-change';

function read(): string[] {
  try {
    const raw = localStorage.getItem(KEY);
    const arr = raw ? JSON.parse(raw) : [];
    return Array.isArray(arr) ? arr.filter((x) => typeof x === 'string') : [];
  } catch {
    return [];
  }
}

function write(ids: string[]): void {
  try {
    localStorage.setItem(KEY, JSON.stringify(ids));
  } catch {
    // Storage blocked (private mode / quota): the change still applies for this
    // session via the event below; it just won't persist.
  }
  window.dispatchEvent(new Event(EVENT));
}

// Two id lists represent the same set of saves (order-insensitive). Used to
// avoid redundant writes and feedback loops between local and remote.
export function sameFavorites(a: string[], b: string[]): boolean {
  if (a.length !== b.length) return false;
  const set = new Set(a);
  return b.every((id) => set.has(id));
}

// Merge local and remote saves the first time a user's two sources meet: keep
// everything either side had (union), local order first. This never loses a
// save that existed on either device when cross-device sync first kicks in.
export function mergeFavorites(local: string[], remote: string[]): string[] {
  const merged = [...local];
  for (const id of remote) if (!merged.includes(id)) merged.push(id);
  return merged;
}

export function useFavorites() {
  const [ids, setIds] = useState<string[]>([]);
  // `ready` guards against a hydration flash: server and first client render
  // both start empty, then we load real state after mount.
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const sync = () => setIds(read());
    sync();
    setReady(true);
    window.addEventListener(EVENT, sync); // same tab, other instances
    window.addEventListener('storage', sync); // other tabs
    return () => {
      window.removeEventListener(EVENT, sync);
      window.removeEventListener('storage', sync);
    };
  }, []);

  // Optional cross-device sync. No-op unless Firebase is configured. Kept in a
  // separate effect so the localStorage path above is entirely independent.
  useEffect(() => {
    const config = firebaseConfig();
    if (!config) return;

    let disposed = false;
    let teardown = () => {};

    (async () => {
      const sync = await createFavoritesSync(config);
      if (disposed) {
        sync.dispose();
        return;
      }

      // First contact: union whatever this device has with whatever the
      // account already had, and settle both sides on the merged set.
      const remote = await sync.readOnce();
      const merged = mergeFavorites(read(), remote);
      if (!sameFavorites(merged, read())) write(merged);
      if (!sameFavorites(merged, remote)) await sync.write(merged);

      // Remote → local: another device changed the saves.
      const unsubscribe = sync.subscribe((remoteIds) => {
        if (!sameFavorites(remoteIds, read())) write(remoteIds);
      });
      // Local → remote: this device toggled a save.
      const onLocal = () => sync.write(read());
      window.addEventListener(EVENT, onLocal);

      teardown = () => {
        unsubscribe();
        window.removeEventListener(EVENT, onLocal);
        sync.dispose();
      };
    })().catch(() => {
      // Sync is best-effort; failures leave the local-only experience intact.
    });

    return () => {
      disposed = true;
      teardown();
    };
  }, []);

  const toggle = useCallback((id: string) => {
    const cur = read();
    write(cur.includes(id) ? cur.filter((x) => x !== id) : [...cur, id]);
  }, []);

  const has = useCallback((id: string) => ids.includes(id), [ids]);

  return { ids, ready, has, toggle };
}
