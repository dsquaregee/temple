import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import {
  FESTIVAL_BY_KEY,
  MONTH_BY_KEY,
  formatFestivalDate,
  nextFestivalDate,
  t,
  type Locale,
} from '@temple/core';
import { getFestivalCalendar, getFestivalTemples } from '@temple/content';
import { LOCALES } from '@/lib/locales';
import { pageAlternates } from '@/lib/seo';
import { absUrl, breadcrumbList, collectionPage } from '@/lib/jsonld';
import { PageChrome } from '@/components/PageChrome';
import { JsonLd } from '@/components/JsonLd';
import { AddToCalendar } from '@/components/AddToCalendar';
import { ShareButton } from '@/components/ShareButton';

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
    alternates: pageAlternates(params.locale, (l) => `/${l}/festivals/${festival.key}/`),
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
  const upcomingIso = nextFestivalDate(festival.key, new Date());
  const upcoming = upcomingIso ? formatFestivalDate(upcomingIso) : undefined;

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

  // Event rich results: one dated Event per participating temple on the next
  // observance. This is the page a festival query should land on, and the date is
  // the verified Drik Panchang value. Capped so the largest festivals (100+
  // temples) don't blow the per-page byte budget; omitted entirely when no
  // upcoming date is known (never faked).
  const eventsJsonLd = upcomingIso
    ? {
        '@context': 'https://schema.org',
        '@graph': temples.slice(0, 25).map((tp) => ({
          '@type': 'Event',
          name: `${festival.name} at ${tp.name}`,
          startDate: upcomingIso,
          eventAttendanceMode: 'https://schema.org/OfflineEventAttendanceMode',
          eventStatus: 'https://schema.org/EventScheduled',
          location: {
            '@type': 'Place',
            name: tp.name,
            address: {
              '@type': 'PostalAddress',
              addressLocality: tp.location.city,
              addressRegion: tp.location.state,
              addressCountry: 'IN',
            },
          },
          url: absUrl(`${locale}/temples/${tp.id}/`),
          description: `${festival.name} (${month.name}) at ${tp.name}, ${tp.location.city}.`,
          isAccessibleForFree: true,
        })),
      }
    : null;

  return (
    <PageChrome
      locale={locale}
      active="festivals"
      pathSuffix={`festivals/${festival.key}/`}
    >
      <JsonLd data={listing} />
      <JsonLd data={breadcrumbs} />
      {eventsJsonLd && <JsonLd data={eventsJsonLd} />}

      <div className="hero">
        <span className="eyebrow">
          {month.name} · {month.gregorian}
        </span>
        <h1>{festival.name}</h1>
      </div>

      <div className="chips">
        {upcoming && <span className="chip accent">{ui.festivals.comingUp}: {upcoming}</span>}
        <span className="chip">
          {temples.length} {ui.festivals.temples}
        </span>
      </div>

      <div className="actions">
        <ShareButton locale={locale} title={festival.name} url={absUrl(`${locale}/festivals/${festival.key}/`)} />
        {upcomingIso && (
          <AddToCalendar
            locale={locale}
            festivalKey={festival.key}
            name={festival.name}
            iso={upcomingIso}
            url={absUrl(`${locale}/festivals/${festival.key}/`)}
            description={`${festival.name} — ${month.name} (${month.gregorian}). ${temples.length} ${ui.festivals.temples}.`}
          />
        )}
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
