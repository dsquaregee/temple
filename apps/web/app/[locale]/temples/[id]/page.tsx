import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import {
  FESTIVAL_BY_KEY,
  MONTH_BY_KEY,
  nextFestivalDate,
  t,
  type Locale,
} from '@temple/core';
import {
  getCircuit,
  getTemple,
  getTemples,
  festivalKeysForTemple,
} from '@temple/content';
import { LOCALES } from '@/lib/locales';
import { absUrl, breadcrumbList } from '@/lib/jsonld';
import { PageChrome } from '@/components/PageChrome';
import { JsonLd } from '@/components/JsonLd';
import { SaveButton } from '@/components/SaveButton';
import { OfflineButton } from '@/components/OfflineButton';
import { ShareButton } from '@/components/ShareButton';
import { SavableTempleCard } from '@/components/SavableTempleCard';
import { TempleHero } from '@/components/TempleHero';
import { AudioStory } from '@/components/AudioStory';
import { VideoStory } from '@/components/VideoStory';
import { MusicCta } from '@/components/MusicCta';
import { TEMPLE_MUSIC_PLAYLIST } from '@/lib/site';

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
  const og = temple.hero?.og;
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
      ...(og
        ? { images: [{ url: og, width: 1200, height: 630, alt: temple.name }] }
        : {}),
    },
    ...(og
      ? {
          twitter: {
            card: 'summary_large_image',
            title: temple.name,
            description: temple.summary,
            images: [og],
          },
        }
      : {}),
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

  // Related temples, ranked by how much they share with this one: the same deity
  // (a devotee of Shiva/Murugan/Vishnu wants the next shrine to the same god),
  // then shared pilgrimage circuits, then being in the same town/region, then the
  // same dynasty. Scoring beats catalog order so the picks are genuinely relevant.
  const related = getTemples(locale)
    .filter((other) => other.id !== temple.id)
    .map((other) => {
      let score = 0;
      if (other.deity === temple.deity) score += 5;
      score += other.circuits.filter((c) => temple.circuits.includes(c)).length * 3;
      if (other.location.city === temple.location.city) score += 3;
      else if (other.location.state === temple.location.state) score += 1;
      if (other.dynasty === temple.dynasty) score += 1;
      return { other, score };
    })
    .filter((x) => x.score > 0)
    .sort((a, b) => b.score - a.score || a.other.name.localeCompare(b.other.name, locale))
    .slice(0, 6)
    .map((x) => x.other);

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

  // FAQPage from existing per-temple data — eligible for Google FAQ rich results
  // and answers the questions people actually search for a temple.
  const faqJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      { q: ui.faq.deityQ, a: temple.deity },
      { q: ui.faq.festivalsQ, a: temple.sections.festivals },
      { q: ui.faq.reachQ, a: temple.visit.gettingThere },
    ].map(({ q, a }) => ({
      '@type': 'Question',
      name: q.replace('{name}', temple.name),
      acceptedAnswer: { '@type': 'Answer', text: a },
    })),
  };

  // Event rich-result data: festivals this temple celebrates that have a known
  // upcoming date (India observance, Drik Panchang). Each becomes a dated Event
  // at the temple — "Maha Shivaratri at <Temple>, 6 Mar 2027". Festivals with no
  // upcoming date are omitted (never faked).
  const eventNodes = festivalKeysForTemple(temple.id)
    .map((key) => {
      const festival = FESTIVAL_BY_KEY[key];
      const date = festival ? nextFestivalDate(key) : undefined;
      if (!festival || !date) return null;
      const month = MONTH_BY_KEY[festival.month];
      return {
        '@type': 'Event',
        name: `${festival.name} at ${temple.name}`,
        startDate: date,
        eventAttendanceMode: 'https://schema.org/OfflineEventAttendanceMode',
        eventStatus: 'https://schema.org/EventScheduled',
        location: {
          '@type': 'Place',
          name: temple.name,
          address: {
            '@type': 'PostalAddress',
            addressLocality: temple.location.city,
            addressRegion: temple.location.state,
            addressCountry: 'IN',
          },
        },
        ...(temple.hero?.src ? { image: temple.hero.src } : {}),
        url: absUrl(`${locale}/festivals/${festival.key}/`),
        description: `${festival.name}${month ? ` (${month.name})` : ''} at ${temple.name}, ${temple.location.city}.`,
        isAccessibleForFree: true,
      };
    })
    .filter((e): e is NonNullable<typeof e> => Boolean(e));
  const eventsJsonLd =
    eventNodes.length > 0
      ? { '@context': 'https://schema.org', '@graph': eventNodes }
      : null;

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
      <JsonLd data={faqJsonLd} />
      {eventsJsonLd && <JsonLd data={eventsJsonLd} />}

      <TempleHero
        temple={temple}
        eyebrow={temple.unesco ? ui.labels.unesco : undefined}
      >
        <h1>{temple.name}</h1>
        <p className="native">{temple.nativeName}</p>
      </TempleHero>

      <div className="actions">
        <SaveButton locale={locale} id={temple.id} />
        <ShareButton locale={locale} title={temple.name} url={absUrl(`${locale}/temples/${temple.id}/`)} />
        <OfflineButton
          locale={locale}
          downloadKey={`temple:${temple.id}`}
          resources={[
            `/${locale}/temples/${temple.id}/`,
            ...(temple.audio?.storyUrl ? [temple.audio.storyUrl] : []),
            ...(temple.hero?.src ? [temple.hero.src] : []),
          ]}
        />
      </div>

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

      <MusicCta locale={locale} href={TEMPLE_MUSIC_PLAYLIST} />

      <section className="section" aria-labelledby="why-h">
        <h2 id="why-h">{ui.labels.whyItMatters}</h2>
        <p className="lead">{temple.summary}</p>
      </section>

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

      {sections.map((s) => (
        <section className="section" key={s.key} aria-label={ui.sections[s.key]}>
          <h2>{ui.sections[s.key]}</h2>
          <p>{s.body}</p>
        </section>
      ))}

      {related.length > 0 && (
        <section className="section" aria-labelledby="related-h">
          <h2 id="related-h">{ui.labels.relatedTemples}</h2>
          <div className="grid">
            {related.map((other) => (
              <SavableTempleCard key={other.id} locale={locale} temple={other} />
            ))}
          </div>
        </section>
      )}
    </PageChrome>
  );
}
