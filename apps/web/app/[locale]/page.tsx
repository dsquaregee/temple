import type { Metadata } from 'next';
import { t, type Locale } from '@temple/core';
import { getCircuits, getTemples } from '@temple/content';
import { LOCALES } from '@/lib/locales';
import { SITE_URL } from '@/lib/site';
import { absUrl } from '@/lib/jsonld';
import { PageChrome } from '@/components/PageChrome';
import { JsonLd } from '@/components/JsonLd';
import { CircuitCard, TempleCard } from '@/components/cards';
import { TempleHero } from '@/components/TempleHero';

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

  // Deterministic "temple of the day": a build-time rotation over the catalog.
  const dayOfYear = Math.floor(
    (Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) / 86400000
  );
  const featured = temples[dayOfYear % temples.length] ?? temples[0];

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
      {featured && (
        <a
          href={`/${locale}/temples/${featured.id}/`}
          style={{ display: 'block' }}
        >
          <TempleHero temple={featured} eyebrow={ui.labels.templeOfTheDay}>
            <h1>{featured.name}</h1>
            <p>
              {featured.location.city}, {featured.location.state}
            </p>
          </TempleHero>
        </a>
      )}

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
            <TempleCard key={temple.id} locale={locale} temple={temple} />
          ))}
        </div>
      </section>
    </PageChrome>
  );
}
