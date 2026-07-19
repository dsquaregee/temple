import type { Metadata } from 'next';
import { t, toCardData, type Locale } from '@temple/core';
import { getCircuits, getTemples } from '@temple/content';
import { LOCALES } from '@/lib/locales';
import { absUrl, breadcrumbList, collectionPage } from '@/lib/jsonld';
import { PageChrome } from '@/components/PageChrome';
import { JsonLd } from '@/components/JsonLd';
import { DiscoverExplorer } from '@/components/DiscoverExplorer';

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
    title: ui.tabs.discover,
    description: `${ui.labels.allTemples} — ${ui.tagline}`,
    alternates: {
      canonical: `/${params.locale}/temples/`,
      languages: Object.fromEntries(LOCALES.map((l) => [l, `/${l}/temples/`])),
    },
  };
}

export default function DiscoverPage({
  params,
}: {
  params: { locale: Locale };
}) {
  const { locale } = params;
  const ui = t(locale);
  const temples = getTemples(locale);
  // Only id + name are needed for the circuit facet chips; the full circuit
  // objects carry prose we don't want to serialize into the page payload.
  const circuits = getCircuits(locale).map((c) => ({ id: c.id, name: c.name }));

  const collectionJsonLd = collectionPage({
    name: ui.tabs.discover,
    url: absUrl(`${locale}/temples/`),
    items: temples.map((tp) => ({
      name: tp.name,
      path: `${locale}/temples/${tp.id}/`,
    })),
  });
  const breadcrumbs = breadcrumbList([
    { name: ui.tabs.home, path: `${locale}/` },
    { name: ui.tabs.discover, path: `${locale}/temples/` },
  ]);

  return (
    <PageChrome locale={locale} active="discover" pathSuffix="temples/">
      <JsonLd data={collectionJsonLd} />
      <JsonLd data={breadcrumbs} />
      <div className="pagehead">
        <h1>{ui.tabs.discover}</h1>
        <p className="muted">
          {temples.length} {ui.labels.allTemples.toLowerCase()}
        </p>
      </div>

      {/* Project to card data so the section/visit prose is not serialized
          into this client component's hydration payload. */}
      <DiscoverExplorer
        locale={locale}
        temples={temples.map(toCardData)}
        circuits={circuits}
      />
    </PageChrome>
  );
}
