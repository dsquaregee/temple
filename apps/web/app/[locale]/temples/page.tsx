import type { Metadata } from 'next';
import { t, type Locale } from '@temple/core';
import { LOCALES } from '@/lib/locales';
import { pageAlternates } from '@/lib/seo';
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
    alternates: pageAlternates(params.locale, (l) => `/${l}/temples/`),
  };
}

export default function DiscoverPage({ params }: { params: { locale: Locale } }) {
  return <DiscoverListing locale={params.locale} page={1} />;
}
