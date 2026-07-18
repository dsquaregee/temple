'use client';

import { t, type Locale } from '@temple/core';
import { useFavorites } from '@/lib/favorites';

export interface SavedItem {
  id: string;
  name: string;
  nativeName: string;
  city: string;
  state: string;
}

// "Saved temples" strip on the Home tab. Renders nothing until favorites have
// loaded and at least one exists, so it never shows an empty shell or causes a
// hydration mismatch (server render is empty → null).
export function SavedTemples({
  locale,
  temples,
}: {
  locale: Locale;
  temples: SavedItem[];
}) {
  const { ids, ready } = useFavorites();
  if (!ready || ids.length === 0) return null;
  const saved = temples.filter((tp) => ids.includes(tp.id));
  if (saved.length === 0) return null;
  const ui = t(locale);
  return (
    <section className="section" aria-labelledby="saved-h">
      <h2 id="saved-h">{ui.favorites.savedTitle}</h2>
      <div className="grid">
        {saved.map((tp) => (
          <a key={tp.id} className="card" href={`/${locale}/temples/${tp.id}/`}>
            <h3>{tp.name}</h3>
            <div className="native">{tp.nativeName}</div>
            <div className="meta">
              {tp.city}, {tp.state}
            </div>
          </a>
        ))}
      </div>
    </section>
  );
}
