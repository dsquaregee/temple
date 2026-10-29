import { PUSH } from './push-config';

// Fire-and-forget feature-usage beacon. Sends only an event name — no PII, no
// identifiers — to the app's own Worker (see infra/push-worker), which keeps
// aggregate counters. Uses sendBeacon so it survives navigation; never throws and
// never blocks the UI. If the Worker's /event route isn't deployed yet it simply
// 404s, harmlessly.
export type TrackEvent =
  | 'nearby_city'
  | 'listen_play'
  | 'share'
  | 'offline_download'
  | 'remind_enable'
  | 'festival_cal';

export function track(name: TrackEvent): void {
  try {
    const url = `${PUSH.endpoint}/event`;
    const body = JSON.stringify({ name });
    if (typeof navigator !== 'undefined' && navigator.sendBeacon) {
      navigator.sendBeacon(url, new Blob([body], { type: 'application/json' }));
    } else if (typeof fetch !== 'undefined') {
      fetch(url, {
        method: 'POST',
        body,
        keepalive: true,
        headers: { 'content-type': 'application/json' },
      }).catch(() => {});
    }
  } catch {
    /* analytics must never break the app */
  }
}
