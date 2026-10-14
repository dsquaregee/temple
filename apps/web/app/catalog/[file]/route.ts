import { toCardData, type Locale } from '@temple/core';
import { getTemples } from '@temple/content';
import { LOCALES } from '@/lib/locales';

// The full Discover catalogue for one locale, as card data in the listing's
// featured order: /catalog/<locale>.json. The Discover pages server-render only
// one page of cards each (static, crawlable, works without JS); the client
// fetches this file the first time a visitor searches, filters or re-sorts, so
// facets span the whole catalogue while the page HTML stays flat as the catalogue
// grows. Same projection (toCardData) and order (getTemples) as the pages, so the
// two can never drift.
export const dynamic = 'force-static';

export function generateStaticParams() {
  return LOCALES.map((locale) => ({ file: `${locale}.json` }));
}

export function GET(_req: Request, { params }: { params: { file: string } }) {
  const locale = params.file.replace(/\.json$/, '') as Locale;
  return Response.json(getTemples(locale).map(toCardData));
}
