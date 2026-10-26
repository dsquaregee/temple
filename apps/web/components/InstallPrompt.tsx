'use client';

import { useEffect, useState } from 'react';
import { t, type Locale } from '@temple/core';

// A one-tap "Install" banner for visitors who haven't added the PWA yet.
// On Chrome/Edge/Android it uses the browser's beforeinstallprompt event to
// trigger the real native install dialog in one click; on iOS Safari (which has
// no programmatic install) it shows the short "Share → Add to Home Screen"
// instruction instead. It hides itself once the app is installed/standalone,
// and a dismissal is remembered (14 days) so it never nags.

type BeforeInstallPromptEvent = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
};

const DISMISS_KEY = 'temple.install.dismissed';
const DISMISS_DAYS = 14;

function isStandalone(): boolean {
  if (typeof window === 'undefined') return false;
  try {
    return (
      window.matchMedia('(display-mode: standalone)').matches ||
      // iOS Safari
      (window.navigator as unknown as { standalone?: boolean }).standalone === true
    );
  } catch {
    return false;
  }
}

function recentlyDismissed(): boolean {
  try {
    const raw = localStorage.getItem(DISMISS_KEY);
    if (!raw) return false;
    const ts = Number(raw);
    if (!Number.isFinite(ts)) return false;
    return Date.now() - ts < DISMISS_DAYS * 24 * 60 * 60 * 1000;
  } catch {
    return false;
  }
}

export function InstallPrompt({ locale }: { locale: Locale }) {
  const ui = t(locale).install;
  const [deferred, setDeferred] = useState<BeforeInstallPromptEvent | null>(null);
  const [ios, setIos] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (isStandalone() || recentlyDismissed()) return;

    const onBeforeInstall = (e: Event) => {
      // Stop Chrome's mini-infobar; we present our own button instead.
      e.preventDefault();
      setDeferred(e as BeforeInstallPromptEvent);
      setOpen(true);
    };
    const onInstalled = () => {
      setOpen(false);
      setDeferred(null);
      try {
        localStorage.removeItem(DISMISS_KEY);
      } catch {
        /* storage may be unavailable */
      }
    };

    window.addEventListener('beforeinstallprompt', onBeforeInstall);
    window.addEventListener('appinstalled', onInstalled);

    // iOS Safari never fires beforeinstallprompt — offer the manual path.
    const ua = window.navigator.userAgent;
    const isIos = /iphone|ipad|ipod/i.test(ua);
    const isWebkit = /safari/i.test(ua) && !/crios|fxios|edgios/i.test(ua);
    if (isIos && isWebkit) {
      setIos(true);
      setOpen(true);
    }

    return () => {
      window.removeEventListener('beforeinstallprompt', onBeforeInstall);
      window.removeEventListener('appinstalled', onInstalled);
    };
  }, []);

  if (!open) return null;

  const dismiss = () => {
    setOpen(false);
    try {
      localStorage.setItem(DISMISS_KEY, String(Date.now()));
    } catch {
      /* storage may be unavailable */
    }
  };

  const install = async () => {
    if (!deferred) return;
    try {
      await deferred.prompt();
      const choice = await deferred.userChoice;
      if (choice.outcome === 'accepted') setOpen(false);
      else dismiss();
    } catch {
      setOpen(false);
    }
    setDeferred(null);
  };

  return (
    <div className="installbar" role="region" aria-label={ui.title}>
      <div className="installbar__text">
        <strong className="installbar__title">{ui.title}</strong>
        <span className="installbar__body">{ios ? ui.iosHint : ui.body}</span>
      </div>
      <div className="installbar__actions">
        {!ios && (
          <button type="button" className="installbar__cta" onClick={install}>
            {ui.action}
          </button>
        )}
        <button
          type="button"
          className="installbar__dismiss"
          onClick={dismiss}
          aria-label={ui.dismiss}
        >
          {ui.dismiss}
        </button>
      </div>
    </div>
  );
}
