import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { t, type Locale } from '@temple/core';
import {
  getCircuit,
  getTemple,
  getTemples,
} from '@temple/content';
import { LOCALES } from '@/lib/locales';
import { absUrl, breadcrumbList } from '@/lib/jsonld';
import { PageChrome } from '@/components/PageChrome';
import { JsonLd } from '@/components/JsonLd';
import { TempleCard } from '@/components/cards';
import { TempleHero } from '@/components/TempleHero';
import { AudioStory } from '@/components/AudioStory';
import { VideoStory } from '@/components/VideoStory';

export const dynamicParams = false;

export function generateStaticParams() {
  return LOCALES.flatMap((locale) =>
    getTemples(locale).map((temple) => ({ locale, id: temple.id }))
  );
}

export function generateMetadata({
  params,
}: {
  params: { locale: Locale; id: string };
}): Metadata {
  const temple = getTemple(params.locale, params.id);
  if (!temple) return {};
  return {
    title: temple.name,
    description: temple.summary,
    alternates: {
      canonical: `/${params.locale}/temples/${temple.id}/`,
      languages: Object.fromEntries(
        LOCALES.map((l) => [l, `/${l}/temples/${temple.id}/`])
      ),
    },
    openGraph: {
      title: temple.name,
      description: temple.summary,
      type: 'article',
    },
  };
}

export default function TempleDetail({
  params,
}: {
  params: { locale: Locale; id: string };
}) {
  const { locale, id } = params;
  const temple = getTemple(locale, id);
  if (!temple) notFound();
  const ui = t(locale);

  // Related: fellow stops on shared circuits, then others of the same dynasty.
  const related = getTemples(locale)
    .filter((other) => other.id !== temple.id)
    .filter(
      (other) =>
        other.circuits.some((c) => temple.circuits.includes(c)) ||
        other.dynasty === temple.dynasty
    )
    .slice(0, 4);

  const memberCircuits = temple.circuits
    .map((c) => getCircuit(locale, c))
    .filter((c): c is NonNullable<typeof c> => Boolean(c));

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'HinduTemple',
    name: temple.name,
    alternateName: temple.nativeName,
    description: temple.summary,
    url: absUrl(`${locale}/temples/${temple.id}/`),
    ...(temple.hero?.src ? { image: temple.hero.src } : {}),
    address: {
      '@type': 'PostalAddress',
      addressLocality: temple.location.city,
      addressRegion: temple.location.state,
      addressCountry: 'IN',
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: temple.location.lat,
      longitude: temple.location.lng,
    },
  };

  const breadcrumbs = breadcrumbList([
    { name: ui.tabs.home, path: `${locale}/` },
    { name: ui.tabs.discover, path: `${locale}/temples/` },
    { name: temple.name, path: `${locale}/temples/${temple.id}/` },
  ]);

  const sections: { key: keyof typeof ui.sections; body: string }[] = [
    { key: 'history', body: temple.sections.history },
    { key: 'architecture', body: temple.sections.architecture },
    { key: 'legends', body: temple.sections.legends },
    { key: 'festivals', body: temple.sections.festivals },
    { key: 'experience', body: temple.sections.experience },
  ];

  const visitTiles: { k: string; v: string }[] = [
    { k: ui.visit.timings, v: temple.visit.timings },
    { k: ui.visit.dressCode, v: temple.visit.dressCode },
    { k: ui.visit.photography, v: temple.visit.photography },
    { k: ui.visit.gettingThere, v: temple.visit.gettingThere },
  ];

  return (
    <PageChrome
      locale={locale}
      active="discover"
      pathSuffix={`temples/${temple.id}/`}
    >
      <JsonLd data={jsonLd} />
      <JsonLd data={breadcrumbs} />

      <TempleHero
        temple={temple}
        eyebrow={temple.unesco ? ui.labels.unesco : undefined}
      >
        <h1>{temple.name}</h1>
        <p className="native">{temple.nativeName}</p>
      </TempleHero>

      <div className="orient">
        <div>
          <div className="k">{ui.labels.deity}</div>
          <div className="v">{temple.deity}</div>
        </div>
        <div>
          <div className="k">{ui.labels.dynasty}</div>
          <div className="v">{temple.dynasty}</div>
        </div>
        <div>
          <div className="k">{ui.labels.period}</div>
          <div className="v">{temple.period}</div>
        </div>
        <div>
          <div className="k">{ui.labels.style}</div>
          <div className="v">{temple.style}</div>
        </div>
      </div>

      {memberCircuits.length > 0 && (
        <div className="chips">
          {memberCircuits.map((c) => (
            <a key={c.id} className="chip accent" href={`/${locale}/yatra/${c.id}/`}>
              {c.name}
            </a>
          ))}
        </div>
      )}

      <AudioStory temple={temple} ui={ui} />

      <VideoStory temple={temple} ui={ui} />

      <section className="section" aria-labelledby="why-h">
        <h2 id="why-h">{ui.labels.whyItMatters}</h2>
        <p className="lead">{temple.summary}</p>
      </section>

      {sections.map((s) => (
        <section className="section" key={s.key} aria-label={ui.sections[s.key]}>
          <h2>{ui.sections[s.key]}</h2>
          <p>{s.body}</p>
        </section>
      ))}

      <section className="section" aria-labelledby="visit-h">
        <h2 id="visit-h">{ui.visit.heading}</h2>
        <div className="tiles">
          {visitTiles.map((tile) => (
            <div className="tile" key={tile.k}>
              <div className="k">{tile.k}</div>
              <div className="v">{tile.v}</div>
            </div>
          ))}
        </div>
      </section>

      <div className="callout">
        <div className="k">{ui.labels.supportTemple}</div>
        <div className="n">{ui.labels.supportNote}</div>
      </div>

      {related.length > 0 && (
        <section className="section" aria-labelledby="related-h">
          <h2 id="related-h">{ui.labels.relatedTemples}</h2>
          <div className="grid">
            {related.map((other) => (
              <TempleCard key={other.id} locale={locale} temple={other} />
            ))}
          </div>
        </section>
      )}
    </PageChrome>
  );
}
