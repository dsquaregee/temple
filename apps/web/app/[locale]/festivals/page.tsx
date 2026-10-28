import type { Metadata } from 'next';
import {
  currentTamilMonthKey,
  formatFestivalDate,
  nextFestivalDate,
  t,
  type Locale,
} from '@temple/core';
import { getFestivalCalendar } from '@temple/content';
import { LOCALES } from '@/lib/locales';
import { absUrl, breadcrumbList, collectionPage } from '@/lib/jsonld';
import { PageChrome } from '@/components/PageChrome';
import { JsonLd } from '@/components/JsonLd';
import { FestivalsNow } from '@/components/FestivalsNow';
import { RemindMe } from '@/components/RemindMe';

export const dynamicParams = false;

export function generateStaticParams() {
  return LOCALES.map((locale) => ({ locale }));
}

export function generateMetadata({
  params,
}: {
  params: { locale: Locale };
}): Metadata {
  const ui = t(params.locale);
  return {
    title: ui.festivals.title,
    description: ui.festivals.intro,
    alternates: {
      canonical: `/${params.locale}/festivals/`,
      languages: Object.fromEntries(LOCALES.map((l) => [l, `/${l}/festivals/`])),
    },
  };
}

export default function FestivalCalendar({
  params,
}: {
  params: { locale: Locale };
}) {
  const { locale } = params;
  const ui = t(locale);
  const calendar = getFestivalCalendar(locale);

  const breadcrumbs = breadcrumbList([
    { name: ui.tabs.home, path: `${locale}/` },
    { name: ui.festivals.title, path: `${locale}/festivals/` },
  ]);
  const listing = collectionPage({
    name: ui.festivals.title,
    url: absUrl(`${locale}/festivals/`),
    items: calendar.flatMap((m) =>
      m.festivals.map((f) => ({
        name: f.festival.name,
        path: `${locale}/festivals/${f.festival.key}/`,
      }))
    ),
  });

  return (
    <PageChrome locale={locale} active="festivals" pathSuffix="festivals/">
      <JsonLd data={listing} />
      <JsonLd data={breadcrumbs} />

      <div className="hero">
        <h1>{ui.festivals.title}</h1>
      </div>
      <section className="section">
        <p className="lead">{ui.festivals.intro}</p>
        <div className="actions">
          <RemindMe locale={locale} />
        </div>
      </section>

      <FestivalsNow
        locale={locale}
        months={calendar.map((m) => ({
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
        }))}
        initialMonthKey={currentTamilMonthKey(new Date())}
      />

      {calendar.map((m) => (
        <section className="section" key={m.month.key} aria-label={m.month.name}>
          <h2>
            {m.month.name} · {m.month.gregorian}
          </h2>
          <div className="stops stops--explicit">
            {m.festivals.map((f) => (
              <a
                key={f.festival.key}
                className="card"
                href={`/${locale}/festivals/${f.festival.key}/`}
              >
                <h3>{f.festival.name}</h3>
                <div className="meta">
                  {f.temples.length} {ui.festivals.temples}
                </div>
              </a>
            ))}
          </div>
        </section>
      ))}
    </PageChrome>
  );
}
