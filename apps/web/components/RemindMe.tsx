'use client';

import { useCallback, useEffect, useState } from 'react';
import { t, type Locale } from '@temple/core';
import { PUSH, urlBase64ToUint8Array } from '@/lib/push-config';
import { track } from '@/lib/analytics';

type State = 'idle' | 'busy' | 'active' | 'error';

// Festival push opt-in. Subscribes the browser to Web Push via the app's VAPID
// key and registers the subscription with the push Worker. Payload-free: the
// Worker sends a tickle near each festival, the service worker shows a
// notification that opens the Festivals page. Renders nothing unless the push
// backend is live (PUSH.enabled) and the browser supports Web Push, so it is
// invisible until provisioned (see docs/push-notifications.md).
export function RemindMe({ locale }: { locale: Locale }) {
  const ui = t(locale).festivals;
  const [supported, setSupported] = useState(false);
  const [state, setState] = useState<State>('idle');

  useEffect(() => {
    if (!PUSH.enabled) return;
    const ok =
      typeof window !== 'undefined' &&
      'serviceWorker' in navigator &&
      'PushManager' in window &&
      'Notification' in window;
    setSupported(ok);
    if (!ok) return;
    // Reflect any existing subscription.
    navigator.serviceWorker.ready
      .then((reg) => reg.pushManager.getSubscription())
      .then((sub) => {
        if (sub) setState('active');
      })
      .catch(() => {});
  }, []);

  const subscribe = useCallback(async () => {
    setState('busy');
    try {
      const permission = await Notification.requestPermission();
      if (permission !== 'granted') {
        setState('error');
        return;
      }
      const reg = await navigator.serviceWorker.ready;
      const sub = await reg.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(PUSH.vapidPublicKey),
      });
      const res = await fetch(`${PUSH.endpoint}/subscribe`, {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ subscription: sub, locale }),
      });
      if (!res.ok) throw new Error('subscribe failed');
      // Remember the locale so the (payload-free) push notification is shown in
      // the right language and opens this locale's Festivals page.
      navigator.serviceWorker.controller?.postMessage({ type: 'push-locale', locale });
      track('remind_enable');
      setState('active');
    } catch {
      setState('error');
    }
  }, [locale]);

  const unsubscribe = useCallback(async () => {
    setState('busy');
    try {
      const reg = await navigator.serviceWorker.ready;
      const sub = await reg.pushManager.getSubscription();
      if (sub) {
        await fetch(`${PUSH.endpoint}/unsubscribe`, {
          method: 'POST',
          headers: { 'content-type': 'application/json' },
          body: JSON.stringify({ endpoint: sub.endpoint }),
        }).catch(() => {});
        await sub.unsubscribe();
      }
      setState('idle');
    } catch {
      setState('error');
    }
  }, []);

  if (!PUSH.enabled || !supported) return null;

  const active = state === 'active';
  const label = active
    ? ui.remindActive
    : state === 'error'
      ? ui.remindError
      : ui.remindMe;

  return (
    <button
      type="button"
      className={active ? 'remindbtn is-active' : 'remindbtn'}
      aria-pressed={active}
      disabled={state === 'busy'}
      onClick={active ? unsubscribe : subscribe}
    >
      <span aria-hidden="true">{active ? '🔔' : '🔕'}</span> {label}
    </button>
  );
}
