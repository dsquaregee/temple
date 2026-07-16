import type { Metadata } from 'next';
import { t, type Locale } from '@temple/core';
import { LOCALES } from '@/lib/locales';
import { PageChrome } from '@/components/PageChrome';

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
    title: ui.tabs.listen,
    alternates: {
      canonical: `/${params.locale}/listen/`,
      languages: Object.fromEntries(LOCALES.map((l) => [l, `/${l}/listen/`])),
    },
  };
}

export default function ListenPage({ params }: { params: { locale: Locale } }) {
  const { locale } = params;
  const ui = t(locale);
  return (
    <PageChrome locale={locale} active="listen" pathSuffix="listen/">
      <div className="pagehead">
        <h1>{ui.tabs.listen}</h1>
      </div>
      <div className="callout">
        <div className="k">♪ {ui.tabs.listen}</div>
        <div className="n">{ui.labels.listenComingSoon}</div>
      </div>
    </PageChrome>
  );
}
