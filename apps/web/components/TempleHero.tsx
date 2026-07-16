import ReactDOM from 'react-dom';
import { heroFor } from '@/lib/hero';
import type { Temple } from '@temple/core';

// Hero for a temple detail page. The image is the LCP element: it is preloaded
// with high priority and sits on a solid dominant-color background so there is
// zero layout shift while it loads. A scrim keeps the overlaid text legible.
export function TempleHero({
  temple,
  eyebrow,
  children,
}: {
  temple: Temple;
  eyebrow?: string;
  children: React.ReactNode;
}) {
  const hero = heroFor(temple);

  // Emits <link rel="preload" as="image"> into <head> (static export friendly).
  ReactDOM.preload(hero.src, { as: 'image', fetchPriority: 'high' });

  return (
    <div className="hero hero--image" style={{ backgroundColor: hero.color }}>
      {hero.sources?.avif || hero.sources?.webp ? (
        <picture>
          {hero.sources.avif && <source srcSet={hero.sources.avif} type="image/avif" />}
          {hero.sources.webp && <source srcSet={hero.sources.webp} type="image/webp" />}
          <img className="hero__img" src={hero.src} alt={hero.alt} fetchPriority="high" />
        </picture>
      ) : (
        <img className="hero__img" src={hero.src} alt={hero.alt} fetchPriority="high" />
      )}
      <div className="hero__scrim" />
      <div className="hero__content">
        {eyebrow && <span className="eyebrow">{eyebrow}</span>}
        {children}
      </div>
      {hero.credit && <span className="hero__credit">{hero.credit}</span>}
    </div>
  );
}
