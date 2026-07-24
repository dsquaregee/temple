'use client';

import { type Locale } from '@temple/core';
import { DailyFeatured, type FeaturedTemple } from './DailyFeatured';
import { SavedTemples } from './SavedTemples';

// Wraps the two Home-tab strips that both need the full temple list: the daily
// featured hero (rotates client-side) and the saved-temples strip (filters to
// favorites client-side). Passing the list to each as a separate server→client
// prop serialized it twice into the page's flight payload — a full second copy
// of every temple's base fields (~18 KB on the localized Home page, and growing
// with the catalog). Crossing the boundary once here and handing the same array
// to both children at runtime serializes it a single time.
export function HomeHighlights({
  locale,
  eyebrow,
  temples,
  initialIndex,
}: {
  locale: Locale;
  eyebrow: string;
  temples: FeaturedTemple[];
  initialIndex: number;
}) {
  return (
    <>
      <DailyFeatured
        locale={locale}
        eyebrow={eyebrow}
        temples={temples}
        initialIndex={initialIndex}
      />
      <SavedTemples locale={locale} temples={temples} />
    </>
  );
}
