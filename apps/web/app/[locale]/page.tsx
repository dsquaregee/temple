import type { Metadata } from 'next';
import { epochDay, indexOfDay, t, type Locale } from '@temple/core';
import { getCircuits, getTemples } from '@temple/content';
import { LOCALES } from '@/lib/locales';
import { SITE_URL } from '@/lib/site';
import { absUrl } from '@/lib/jsonld';
import { heroFor } from '@/lib/hero';
import { PageChrome } from '@/components/PageChrome';
import { JsonLd } from '@/components/JsonLd';
import { type FeaturedTemple } from '@/components/DailyFeatured';
import { HomeHighlights } from '@/components/HomeHighlights';
import { SavableTempleCard } from '@/components/SavableTempleCard';
import { CircuitCard } from '@/components/cards';

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

      <section className="section" aria-labelledby="circuits-h">
        <h2 id="circuits-h">{ui.labels.circuits}</h2>
        <div className="grid">
          {circuits.map((c) => (
            <CircuitCard key={c.id} locale={locale} circuit={c} />
          ))}
        </div>
      </section>

      <section className="section" aria-labelledby="temples-h">
        <h2 id="temples-h">{ui.labels.allTemples}</h2>
        <div className="grid">
          {temples.map((temple) => (
            <SavableTempleCard key={temple.id} locale={locale} temple={temple} />
          ))}
        </div>
      </section>
    </PageChrome>
  );
}
