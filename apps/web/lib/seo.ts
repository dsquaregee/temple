import { LOCALES } from './locales';

// Build a page's Next.js `alternates` (canonical + hreflang) with an `x-default`
// pointing at English — mirrors `alternatesFor` in sitemap.ts so the in-<head>
// hreflang set and the sitemap stay consistent. `pathFor(locale)` returns the
// locale-relative path (trailing slash, matching `trailingSlash: true`).
export function pageAlternates(
  locale: string,
  pathFor: (locale: string) => string,
): { canonical: string; languages: Record<string, string> } {
  const languages: Record<string, string> = {};
  for (const l of LOCALES) languages[l] = pathFor(l);
  languages['x-default'] = pathFor('en');
  return { canonical: pathFor(locale), languages };
}
