import type { Metadata } from 'next';
import { t, type Locale } from '@temple/core';
import { getCircuits } from '@temple/content';
import { LOCALES } from '@/lib/locales';
import { PageChrome } from '@/components/PageChrome';
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
  return {
    title: ui.tabs.yatra,
    description: `${ui.labels.circuits} — ${ui.tagline}`,
    alternates: {
      canonical: `/${params.locale}/yatra/`,
      languages: Object.fromEntries(LOCALES.map((l) => [l, `/${l}/yatra/`])),
    },
  };
}

export default function YatraPage({ params }: { params: { locale: Locale } }) {
  const { locale } = params;
  const ui = t(locale);
  const circuits = getCircuits(locale);

  return (
    <PageChrome locale={locale} active="yatra" pathSuffix="yatra/">
      <div className="pagehead">
        <h1>{ui.tabs.yatra}</h1>
        <p className="muted">{ui.labels.circuits}</p>
      </div>
      <div className="grid">
        {circuits.map((c) => (
          <CircuitCard key={c.id} locale={locale} circuit={c} />
        ))}
      </div>
    </PageChrome>
  );
}
