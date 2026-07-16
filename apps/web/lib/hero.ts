import { colorForTemple, type Temple } from '@temple/core';

export interface ResolvedHero {
  src: string;
  color: string;
  alt: string;
  sources?: { avif?: string; webp?: string };
  credit?: string;
}

// Resolve a temple's hero: real image when content provides one, otherwise the
// deterministic generated placeholder (see apps/web/scripts/gen-heroes.mjs).
export function heroFor(temple: Temple): ResolvedHero {
  if (temple.hero) {
    return {
      src: temple.hero.src,
      color: temple.hero.color,
      alt: temple.hero.alt,
      sources: temple.hero.sources,
      credit: temple.hero.credit,
    };
  }
  return {
    src: `/heroes/${temple.id}.svg`,
    color: colorForTemple(temple.id),
    alt: `${temple.name} — decorative temple silhouette`,
  };
}
