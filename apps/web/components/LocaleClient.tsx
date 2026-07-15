'use client';

import { useEffect } from 'react';
import type { Locale } from '@temple/core';

// The root <html> is emitted with lang="en" (App Router requires <html> in
// the root layout, which cannot read the locale param). This corrects the
// document language for assistive tech on localized pages, and registers the
// PWA service worker once. hreflang alternates in <head> carry the SEO signal.
export function LocaleClient({ locale }: { locale: Locale }) {
  useEffect(() => {
    if (document.documentElement.lang !== locale) {
      document.documentElement.lang = locale;
    }
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/sw.js').catch(() => {
        /* registration is best-effort; the app works without it */
      });
    }
  }, [locale]);
  return null;
}
