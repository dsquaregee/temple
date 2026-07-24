import { colorForTemple, type Temple } from '@temple/core';

export interface ResolvedHero {
  src: string;
  color: string;
  alt: string;
  sources?: { avif?: string; webp?: string };
  credit?: string;
}

// The deterministic generated placeholder hero (see gen-heroes.mjs). Derivable
// entirely from a temple's id + name, so client code can reconstruct it without
// the server serializing a hero object per temple into the page payload.
export function placeholderHero(id: string, name: string): ResolvedHero {
  return {
    src: `/heroes/${id}.svg`,
    color: colorForTemple(id),
    alt: `${name} — decorative temple silhouette`,
  };
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
  return placeholderHero(temple.id, temple.name);
}
