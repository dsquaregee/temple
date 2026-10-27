'use client';

import { t, type Locale } from '@temple/core';
import { useOffline } from '@/lib/offline';

// "Download for offline" toggle. Two sources of resources:
//   • `resources` — an inline URL list (a single temple: page + audio + hero).
//   • `manifest`  — a URL to a JSON { resources: string[] } (a circuit: all its
//     stops), fetched on tap so the page payload stays tiny.
// Downloaded content is served by the service worker's persistent offline cache,
// so it survives deploys. No account — on-device, like saved temples.
export function OfflineButton({
  locale,
  downloadKey,
  resources,
  manifest,
  className,
}: {
  locale: Locale;
  downloadKey: string;
  resources?: string[];
  manifest?: string;
  className?: string;
}) {
  const ui = t(locale).offline;
  const { ready, downloaded, status, progress, download, remove, supported } =
    useOffline(downloadKey);

  // Avoid a hydration flash and hide entirely where the Cache API is unavailable.
  if (!ready || !supported) return null;

  const busy = status === 'busy';

  async function onClick() {
    if (busy) return;
    if (downloaded) {
      await remove();
      return;
    }
    let urls = resources ?? [];
    if (manifest) {
      try {
        const res = await fetch(manifest);
        if (res.ok) {
          const data = (await res.json()) as { resources?: string[] };
          urls = Array.isArray(data.resources) ? data.resources : [];
        }
      } catch {
        urls = [];
      }
    }
    await download(urls);
  }

  const label = busy
    ? `${ui.downloading}${progress > 0 ? ` ${Math.round(progress * 100)}%` : ''}`
    : downloaded
      ? ui.available
      : ui.download;

  return (
    <button
      type="button"
      className={`offlinebtn${downloaded ? ' is-downloaded' : ''}${className ? ` ${className}` : ''}`}
      aria-pressed={downloaded}
      aria-label={downloaded ? ui.remove : ui.download}
      disabled={busy}
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        void onClick();
      }}
    >
      <span className="offlinebtn__icon" aria-hidden="true">
        {downloaded ? '⤓✓' : '⤓'}
      </span>
      <span className="offlinebtn__label">{label}</span>
    </button>
  );
}
