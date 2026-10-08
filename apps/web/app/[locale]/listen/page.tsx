import type { Metadata } from 'next';
import { buildPlaylist, t, toListenItem, type Locale } from '@temple/core';
import { getTemples } from '@temple/content';
import { LOCALES } from '@/lib/locales';
import { PageChrome } from '@/components/PageChrome';
import { ListenPlayer } from '@/components/ListenPlayer';
import { MusicCta } from '@/components/MusicCta';
import { PLAYLISTS } from '@/lib/site';

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
  // Project to the Listen payload (id/name/audio only) so the client player
  // doesn't serialize the full catalog prose into the page.
  const { ready, upcoming } = buildPlaylist(getTemples(locale).map(toListenItem));

  return (
    <PageChrome locale={locale} active="listen" pathSuffix="listen/">
      <div className="pagehead">
        <h1>{ui.tabs.listen}</h1>
      </div>

      <section className="section" aria-labelledby="music-h">
        <h2 id="music-h">{ui.music.heading}</h2>
        {PLAYLISTS.map((p) => (
          <MusicCta
            key={p.id}
            locale={locale}
            href={p.url}
            title={p.title}
            sub={p.blurb}
          />
        ))}
      </section>

      {ready.length === 0 && (
        <div className="callout">
          <div className="k">♪ {ui.tabs.listen}</div>
          <div className="n">{ui.labels.listenComingSoon}</div>
        </div>
      )}

      <ListenPlayer locale={locale} ui={ui} ready={ready} upcoming={upcoming} />
    </PageChrome>
  );
}
