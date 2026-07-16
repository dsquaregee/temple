import type { Metadata } from 'next';
import { t, type Locale } from '@temple/core';
import { getCircuits, getTemples } from '@temple/content';
import { LOCALES } from '@/lib/locales';
import { PageChrome } from '@/components/PageChrome';
import { CircuitCard, TempleCard } from '@/components/cards';

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

  return (
    <PageChrome locale={locale} active="home">
      {featured && (
        <a className="hero" href={`/${locale}/temples/${featured.id}/`}>
          <span className="eyebrow">{ui.labels.templeOfTheDay}</span>
          <h1>{featured.name}</h1>
          <p>{featured.location.city}, {featured.location.state}</p>
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
