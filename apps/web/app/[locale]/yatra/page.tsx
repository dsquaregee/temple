import type { Metadata } from 'next';
import { t, type Locale } from '@temple/core';
import { getCircuits } from '@temple/content';
import { LOCALES } from '@/lib/locales';
import { pageAlternates } from '@/lib/seo';
import { absUrl, breadcrumbList, collectionPage } from '@/lib/jsonld';
import { PageChrome } from '@/components/PageChrome';
import { JsonLd } from '@/components/JsonLd';
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
    alternates: pageAlternates(params.locale, (l) => `/${l}/yatra/`),
  };
}

export default function YatraPage({ params }: { params: { locale: Locale } }) {
  const { locale } = params;
  const ui = t(locale);
  const circuits = getCircuits(locale);

  const collectionJsonLd = collectionPage({
    name: ui.tabs.yatra,
    url: absUrl(`${locale}/yatra/`),
    items: circuits.map((c) => ({
      name: c.name,
      path: `${locale}/yatra/${c.id}/`,
    })),
  });
  const breadcrumbs = breadcrumbList([
    { name: ui.tabs.home, path: `${locale}/` },
    { name: ui.tabs.yatra, path: `${locale}/yatra/` },
  ]);

  return (
    <PageChrome locale={locale} active="yatra" pathSuffix="yatra/">
      <JsonLd data={collectionJsonLd} />
      <JsonLd data={breadcrumbs} />
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
