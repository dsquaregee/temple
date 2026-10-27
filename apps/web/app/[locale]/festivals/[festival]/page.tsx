import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import {
  FESTIVAL_BY_KEY,
  MONTH_BY_KEY,
  t,
  type Locale,
} from '@temple/core';
import { getFestivalCalendar, getFestivalTemples } from '@temple/content';
import { LOCALES } from '@/lib/locales';
import { absUrl, breadcrumbList, collectionPage } from '@/lib/jsonld';
import { PageChrome } from '@/components/PageChrome';
import { JsonLd } from '@/components/JsonLd';

export const dynamicParams = false;

// Only festivals that actually have matching temples get a page (ids are
// locale-stable, so the English calendar drives the key list for every locale).
const FESTIVAL_KEYS = getFestivalCalendar('en').flatMap((m) =>
  m.festivals.map((f) => f.festival.key)
);

export function generateStaticParams() {
  return LOCALES.flatMap((locale) =>
    FESTIVAL_KEYS.map((festival) => ({ locale, festival }))
  );
}

export function generateMetadata({
  params,
}: {
  params: { locale: Locale; festival: string };
}): Metadata {
  const festival = FESTIVAL_BY_KEY[params.festival];
  const month = festival ? MONTH_BY_KEY[festival.month] : undefined;
  if (!festival || !month) return {};
  const ui = t(params.locale);
  const count = getFestivalTemples(params.locale, festival.key).length;
  return {
    title: `${festival.name} — ${ui.festivals.title}`,
    description: `${festival.name} (${month.name}, ${month.gregorian}) — ${count} ${ui.festivals.temples}.`,
    alternates: {
      canonical: `/${params.locale}/festivals/${festival.key}/`,
      languages: Object.fromEntries(
        LOCALES.map((l) => [l, `/${l}/festivals/${festival.key}/`])
      ),
    },
  };
}

export default function FestivalDetail({
  params,
}: {
  params: { locale: Locale; festival: string };
}) {
  const { locale } = params;
  const festival = FESTIVAL_BY_KEY[params.festival];
  if (!festival) notFound();
  const month = MONTH_BY_KEY[festival.month];
  if (!month) notFound();
  const ui = t(locale);
  const temples = getFestivalTemples(locale, festival.key);

  const breadcrumbs = breadcrumbList([
    { name: ui.tabs.home, path: `${locale}/` },
    { name: ui.festivals.title, path: `${locale}/festivals/` },
    { name: festival.name, path: `${locale}/festivals/${festival.key}/` },
  ]);
  const listing = collectionPage({
    name: festival.name,
    url: absUrl(`${locale}/festivals/${festival.key}/`),
    items: temples.map((tp) => ({
      name: tp.name,
      path: `${locale}/temples/${tp.id}/`,
    })),
  });

  return (
    <PageChrome
      locale={locale}
      active="home"
      pathSuffix={`festivals/${festival.key}/`}
    >
      <JsonLd data={listing} />
      <JsonLd data={breadcrumbs} />

      <div className="hero">
        <span className="eyebrow">
          {month.name} · {month.gregorian}
        </span>
        <h1>{festival.name}</h1>
      </div>

      <div className="chips">
        <span className="chip">
          {temples.length} {ui.festivals.temples}
        </span>
      </div>

      <section className="section" aria-labelledby="temples-h">
        <h2 id="temples-h">{ui.festivals.temples}</h2>
        <div className="stops stops--explicit">
          {temples.map((temple) => (
            <a
              key={temple.id}
              className="card"
              href={`/${locale}/temples/${temple.id}/`}
            >
              <h3>{temple.name}</h3>
              <div className="native">{temple.nativeName}</div>
              <div className="meta">
                {temple.location.city}, {temple.location.state}
              </div>
            </a>
          ))}
        </div>
      </section>
    </PageChrome>
  );
}
