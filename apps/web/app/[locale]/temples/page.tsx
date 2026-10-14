import type { Metadata } from 'next';
import { t, type Locale } from '@temple/core';
import { LOCALES } from '@/lib/locales';
import { DiscoverListing } from '@/components/DiscoverListing';

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

export default function DiscoverPage({ params }: { params: { locale: Locale } }) {
  return <DiscoverListing locale={params.locale} page={1} />;
}
