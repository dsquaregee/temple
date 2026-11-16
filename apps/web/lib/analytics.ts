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
  | 'festival_cal'
  | 'install'
  | 'stay_hillview_ground'
  | 'stay_hillview_top';

// Click counters for featured stay listings. Only these ids are counted, so the
// beacon keyspace stays bounded even though the id comes from content.
const STAY_EVENTS: Record<string, TrackEvent> = {
  hillview_ground: 'stay_hillview_ground',
  hillview_top: 'stay_hillview_top',
};

export function trackStay(trackId: string | undefined): void {
  if (trackId && STAY_EVENTS[trackId]) track(STAY_EVENTS[trackId]);
}

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
