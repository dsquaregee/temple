'use client';

import { useEffect, useState } from 'react';
import ReactDOM from 'react-dom';
import { epochDay, indexOfDay, type Locale } from '@temple/core';
import type { ResolvedHero } from '@/lib/hero';

export interface FeaturedTemple {
  id: string;
  name: string;
  nativeName: string;
  city: string;
  state: string;
  hero: ResolvedHero;
}

// "Temple of the day" hero on the Home tab. The server renders `initialIndex`
// (computed from the build date) so the HTML — and the preloaded LCP image —
// are valid immediately; after mount the client re-picks for the visitor's own
// day, so the feature actually rotates daily even between deploys. First client
// render uses `initialIndex` too, so there is no hydration mismatch.
export function DailyFeatured({
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
  const [index, setIndex] = useState(initialIndex);

  useEffect(() => {
    setIndex(indexOfDay(temples.length, epochDay(new Date())));
  }, [temples.length]);

  const temple = temples[index] ?? temples[0];
  if (!temple) return null;
  const { hero } = temple;

  // Preload the featured image as the LCP element (static-export friendly).
  ReactDOM.preload(hero.src, { as: 'image', fetchPriority: 'high' });

  return (
    <a href={`/${locale}/temples/${temple.id}/`} style={{ display: 'block' }}>
      <div className="hero hero--image" style={{ backgroundColor: hero.color }}>
        {hero.sources?.avif || hero.sources?.webp ? (
          <picture>
            {hero.sources.avif && (
              <source srcSet={hero.sources.avif} type="image/avif" />
            )}
            {hero.sources.webp && (
              <source srcSet={hero.sources.webp} type="image/webp" />
            )}
            <img
              className="hero__img"
              src={hero.src}
              alt={hero.alt}
              fetchPriority="high"
            />
          </picture>
        ) : (
          <img
            className="hero__img"
            src={hero.src}
            alt={hero.alt}
            fetchPriority="high"
          />
        )}
        <div className="hero__scrim" />
        <div className="hero__content">
          <span className="eyebrow">{eyebrow}</span>
          <h1>{temple.name}</h1>
          <p>
            {temple.city}, {temple.state}
          </p>
        </div>
        {hero.credit && <span className="hero__credit">{hero.credit}</span>}
      </div>
    </a>
  );
}
