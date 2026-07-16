import type { Metadata } from 'next';
import { t, type Locale } from '@temple/core';
import { getTemples } from '@temple/content';
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
  const temples = getTemples(locale);
  const anyAudio = temples.some((tp) => tp.audio);

  return (
    <PageChrome locale={locale} active="listen" pathSuffix="listen/">
      <div className="pagehead">
        <h1>{ui.tabs.listen}</h1>
      </div>

      {!anyAudio && (
        <div className="callout">
          <div className="k">♪ {ui.tabs.listen}</div>
          <div className="n">{ui.labels.listenComingSoon}</div>
        </div>
      )}

      <div className="grid">
        {temples.map((tp) => (
          <a key={tp.id} className="card" href={`/${locale}/temples/${tp.id}/`}>
            <div className="listenrow">
              <div>
                <h3>{tp.name}</h3>
                <div className="native">{tp.nativeName}</div>
              </div>
              <span className={`badge${tp.audio ? ' ready' : ''}`}>
                {tp.audio ? '▶' : '···'}
              </span>
            </div>
          </a>
        ))}
      </div>
    </PageChrome>
  );
}
