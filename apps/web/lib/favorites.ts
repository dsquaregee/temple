'use client';

import { useCallback, useEffect, useState } from 'react';

// Anonymous, on-device "saved temples". No account required (design: sign-in is
// deferred until a feature truly needs it) — favorites live in localStorage and
// sync across every component instance and browser tab.
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

  const toggle = useCallback((id: string) => {
    const cur = read();
    write(cur.includes(id) ? cur.filter((x) => x !== id) : [...cur, id]);
  }, []);

  const has = useCallback((id: string) => ids.includes(id), [ids]);

  return { ids, ready, has, toggle };
}
