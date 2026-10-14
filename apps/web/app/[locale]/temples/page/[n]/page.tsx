import type { Metadata } from 'next';
import { t, type Locale } from '@temple/core';
import { LOCALES } from '@/lib/locales';
import { DiscoverListing, discoverPageCount } from '@/components/DiscoverListing';

// Discover pages 2…N (page 1 is /temples/). Static, so every temple card is
// reachable by plain links without JavaScript.
export function generateStaticParams() {
  return LOCALES.flatMap((locale) =>
    Array.from({ length: discoverPageCount(locale) - 1 }, (_, i) => ({ locale, n: String(i + 2) }))
  );
}

export const dynamicParams = false;

export function generateMetadata({
  params,
}: {
  params: { locale: Locale; n: string };
}): Metadata {
  const ui = t(params.locale);
  const suffix = `temples/page/${params.n}/`;
  return {
    title: `${ui.tabs.discover} — ${ui.discover.page} ${params.n}`,
    description: `${ui.labels.allTemples} — ${ui.tagline}`,
    alternates: {
      canonical: `/${params.locale}/${suffix}`,
      languages: Object.fromEntries(LOCALES.map((l) => [l, `/${l}/${suffix}`])),
    },
  };
}

export default function DiscoverPageN({ params }: { params: { locale: Locale; n: string } }) {
  return <DiscoverListing locale={params.locale} page={Number(params.n)} />;
}
