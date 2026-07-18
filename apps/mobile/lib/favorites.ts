import { useCallback, useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Anonymous, on-device "saved temples" for mobile (mirrors the web hook). A
// module-level cache + listener set keeps every mounted component in sync; the
// AsyncStorage read/write is async but the UI updates from the cache instantly.
const KEY = 'temple:saved:v1';

let cache: string[] | null = null;
const listeners = new Set<() => void>();

function emit() {
  for (const l of listeners) l();
}

async function ensureLoaded(): Promise<void> {
  if (cache) return;
  try {
    const raw = await AsyncStorage.getItem(KEY);
    const arr = raw ? JSON.parse(raw) : [];
    cache = Array.isArray(arr) ? arr.filter((x) => typeof x === 'string') : [];
  } catch {
    cache = [];
  }
}

function persist(ids: string[]) {
  cache = ids;
  emit();
  AsyncStorage.setItem(KEY, JSON.stringify(ids)).catch(() => {
    // Best-effort; the change still applies in-memory for this session.
  });
}

export function useFavorites() {
  const [ids, setIds] = useState<string[]>(cache ?? []);
  const [ready, setReady] = useState(cache != null);

  useEffect(() => {
    let active = true;
    const sync = () => setIds(cache ?? []);
    listeners.add(sync);
    ensureLoaded().then(() => {
      if (!active) return;
      setIds(cache ?? []);
      setReady(true);
    });
    return () => {
      active = false;
      listeners.delete(sync);
    };
  }, []);

  const toggle = useCallback((id: string) => {
    const cur = cache ?? [];
    persist(cur.includes(id) ? cur.filter((x) => x !== id) : [...cur, id]);
  }, []);

  const has = useCallback((id: string) => ids.includes(id), [ids]);

  return { ids, ready, has, toggle };
}
