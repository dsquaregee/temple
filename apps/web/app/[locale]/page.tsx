import type { Metadata } from 'next';
import {
  currentTamilMonthKey,
  epochDay,
  formatFestivalDate,
  indexOfDay,
  nextFestivalDate,
  t,
  type Locale,
} from '@temple/core';
import { getCircuits, getFestivalCalendar, getTemples } from '@temple/content';
import { FestivalsNow } from '@/components/FestivalsNow';
import { LOCALES } from '@/lib/locales';
import { SITE_URL, SOCIAL } from '@/lib/site';
import { absUrl } from '@/lib/jsonld';
import { heroFor } from '@/lib/hero';
import { PageChrome } from '@/components/PageChrome';
import { JsonLd } from '@/components/JsonLd';
import { type FeaturedTemple } from '@/components/DailyFeatured';
import { HomeHighlights } from '@/components/HomeHighlights';
import { SavableTempleCard } from '@/components/SavableTempleCard';
import { CircuitCard } from '@/components/cards';

const LAUNCH_CORE = new Set([
  'brihadeeswarar', 'gangaikonda-cholapuram', 'airavatesvara', 'ekambareswarar',
  'jambukeswarar', 'arunachaleswarar', 'srikalahasti', 'nataraja-chidambaram',
  'meenakshi-madurai', 'ramanathaswamy-rameswaram', 'ranganathaswamy-srirangam',
  'venkateswara-tirumala',
]);

export function generateStaticParams() {
  return LOCALES.map((locale) => ({ locale }));
}

export function generateMetadata({
  params,
}: {
  params: { locale: Locale };
}): Metadata {
  const ui = t(params.locale);
  const langAlternates = Object.fromEntries(
    LOCALES.map((l) => [l, `/${l}/`])
  );
  return {
    title: `${ui.appName} — ${ui.tagline}`,
    description: ui.tagline,
    alternates: { canonical: `/${params.locale}/`, languages: langAlternates },
  };
}

export default function HomePage({ params }: { params: { locale: Locale } }) {
  const { locale } = params;
  const ui = t(locale);
  const temples = getTemples(locale);
  const circuits = getCircuits(locale);
  // Compact festival-by-month summary for the "what's on now" strip.
  const festivalMonths = getFestivalCalendar(locale).map((m) => ({
    key: m.month.key,
    name: m.month.name,
    gregorian: m.month.gregorian,
    festivals: m.festivals.map((f) => {
      const d = nextFestivalDate(f.festival.key, new Date());
      return {
        key: f.festival.key,
        name: f.festival.name,
        count: f.temples.length,
        ...(d ? { date: formatFestivalDate(d) } : {}),
      };
    }),
  }));
  // Home shelf: the editorial launch core (see CLAUDE.md), in catalog order.
  const shelf = temples.filter((tp) => LAUNCH_CORE.has(tp.id));

  // "Temple of the day": a compact per-temple projection for the client hero,
  // which re-picks for the visitor's actual day. `initialIndex` is the
  // build-day pick the server renders (kept small — no section prose).
  // `hero` is attached only for temples with a real content image; placeholder
  // heroes are derived on the client (see `placeholderHero`), keeping the ~90%
  // of hero objects that are generated silhouettes out of the page payload.
  const featuredTemples: FeaturedTemple[] = temples.map((tp) => ({
    id: tp.id,
    name: tp.name,
    nativeName: tp.nativeName,
    city: tp.location.city,
    state: tp.location.state,
    ...(tp.hero ? { hero: heroFor(tp) } : {}),
  }));
  const initialIndex = indexOfDay(featuredTemples.length, epochDay(new Date()));

  const orgId = `${SITE_URL}/#org`;
  const websiteJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: ui.appName,
    alternateName: 'Temple — the great temples of South India',
    url: absUrl(`${locale}/`),
    inLanguage: locale,
    publisher: { '@id': orgId },
    // Sitelinks searchbox → the Discover tab reads the ?q= query on load.
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: absUrl(`${locale}/temples/?q={search_term_string}`),
      },
      'query-input': 'required name=search_term_string',
    },
  };
  const organizationJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    '@id': orgId,
    name: 'dsquaregee',
    url: SITE_URL,
    logo: absUrl('icon.svg'),
    // Ties the site to its social channels in Google's entity graph.
    sameAs: SOCIAL.map((s) => s.url),
  };

  return (
    <PageChrome locale={locale} active="home">
      <JsonLd data={websiteJsonLd} />
      <JsonLd data={organizationJsonLd} />
      <HomeHighlights
        locale={locale}
        eyebrow={ui.labels.templeOfTheDay}
        temples={featuredTemples}
        initialIndex={initialIndex}
      />

      <section className="section">
        <a className="nearme-cta" href={`/${locale}/temples/?near=1`}>
          <span aria-hidden="true">📍</span> {ui.discover.templesNearYou}
        </a>
      </section>

      <FestivalsNow
        locale={locale}
        months={festivalMonths}
        initialMonthKey={currentTamilMonthKey(new Date())}
      />
      <section className="section">
        <a className="browse-all" href={`/${locale}/festivals/`}>
          {ui.festivals.title} →
        </a>
      </section>

      <section className="section" aria-labelledby="circuits-h">
        <h2 id="circuits-h">{ui.labels.circuits}</h2>
        <div className="grid">
          {circuits.map((c) => (
            <CircuitCard key={c.id} locale={locale} circuit={c} />
          ))}
        </div>
      </section>

      {/* A curated shelf rather than the whole catalog: every card here is a
          client component (serialized twice — HTML + flight data), so listing
          all temples made Home the heaviest page as the catalog grew past 150.
          The full, searchable list lives on the Discover tab. */}
      <section className="section" aria-labelledby="temples-h">
        <h2 id="temples-h">{ui.labels.allTemples}</h2>
        <div className="grid">
          {shelf.map((temple) => (
            <SavableTempleCard key={temple.id} locale={locale} temple={temple} />
          ))}
        </div>
        <a className="browse-all" href={`/${locale}/temples/`}>
          {ui.tabs.discover} · {temples.length} →
        </a>
      </section>
    </PageChrome>
  );
}
