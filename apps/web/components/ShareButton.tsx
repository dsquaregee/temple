'use client';

import { useState } from 'react';
import { t, type Locale } from '@temple/core';
import { track } from '@/lib/analytics';

// Share the current page via the device's native share sheet (Web Share API) —
// the way links spread on WhatsApp/Telegram. Falls back to copying the link to
// the clipboard where Web Share isn't available (most desktop browsers). The
// per-page OpenGraph card gives the shared link a rich preview.
export function ShareButton({
  locale,
  title,
  url,
}: {
  locale: Locale;
  title: string;
  url?: string;
}) {
  const ui = t(locale).labels;
  const [copied, setCopied] = useState(false);

  async function share() {
    const shareUrl = url || (typeof window !== 'undefined' ? window.location.href : '');
    if (!shareUrl) return;
    if (typeof navigator !== 'undefined' && navigator.share) {
      try {
        await navigator.share({ title, url: shareUrl });
        track('share');
        return;
      } catch {
        return; // user cancelled, or share failed — don't also copy
      }
    }
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      track('share');
      setTimeout(() => setCopied(false), 2000);
    } catch {
      /* clipboard blocked — nothing more we can do */
    }
  }

  return (
    <button type="button" className="sharebtn" onClick={share}>
      <span aria-hidden="true">↗</span> {copied ? ui.shareCopied : ui.share}
    </button>
  );
}
