// Single source of truth for the production origin. Kept in sync with
// `metadataBase` in app/layout.tsx and the per-page canonical / hreflang URLs;
// the sitemap and robots routes build their absolute URLs from here.
export const SITE_URL = 'https://temples.dsquaregee.com';

// Owner's YouTube channel (Carnatic music, handle: DeeSqrGee).
export const YOUTUBE_CHANNEL = 'https://www.youtube.com/@DeeSqrGee';

// Owner's YouTube playlists (channel-growth target — a playlist auto-advances,
// so it earns more watch-time than a channel landing). Titles/blurbs are the
// playlist names, kept in English like the DeeSqrGee handle. Ordered devotional
// first to match the reverent tone. The Listen tab lists all of these; temple
// pages link only the deity-music one (TEMPLE_MUSIC_PLAYLIST).
// The high-energy electronic playlist sits last, after the devotional ones.
export const PLAYLISTS = [
  {
    id: 'devotional-fusion',
    title: 'Devotional Fusion',
    blurb: 'Sacred chants & deity music',
    url: 'https://www.youtube.com/playlist?list=PLWAPRXFPrd6I1iVA9UnDlfpwWXxhaEKWR',
  },
  {
    id: 'carnatic-fusion',
    title: 'Carnatic Fusion',
    blurb: 'Veena, saxophone & sitar instrumentals',
    url: 'https://www.youtube.com/playlist?list=PLWAPRXFPrd6KEJIfZEu0qZd2PZpkXDCRA',
  },
  {
    id: 'carnatic-lofi-rap',
    title: 'Carnatic Lofi Rap',
    blurb: 'Myths, saints & filter coffee',
    url: 'https://www.youtube.com/playlist?list=PLO6GUlUmLDeM',
  },
  {
    id: 'originals',
    title: 'DeeSqrGee Originals',
    blurb: 'Vocal tracks & story songs',
    url: 'https://www.youtube.com/playlist?list=PLefZMVNBCzME',
  },
  {
    id: 'midnight-fusion',
    title: 'Midnight Fusion',
    blurb: 'Chill Indian instrumentals for sleep & study',
    url: 'https://www.youtube.com/playlist?list=PLWAPRXFPrd6Lj494xzj7UCBgodcKXOVPl',
  },
  {
    id: 'psytrance',
    title: 'Dark Psytrance & Indian Electronic',
    blurb: 'High-energy Indian electronic',
    url: 'https://www.youtube.com/playlist?list=PLWAPRXFPrd6I0AXNq3NbFn06IvRIskRCJ',
  },
] as const;

// Temple pages link the deity-music playlist — most on-theme for a kshetra page.
export const TEMPLE_MUSIC_PLAYLIST =
  PLAYLISTS.find((p) => p.id === 'devotional-fusion')?.url ?? YOUTUBE_CHANNEL;

// Owner's social presence (handle: DeeSqrGee). Single source of truth for the
// site footer links and the Organization `sameAs` in the home-page JSON-LD, so
// the two never drift. Plain outbound links — no embeds, no third-party scripts,
// so no CSP/perf impact. YouTube leads (the Carnatic music channel).
export const SOCIAL = [
  { name: 'YouTube', url: YOUTUBE_CHANNEL },
  { name: 'Instagram', url: 'https://www.instagram.com/deesqrgee/' },
  { name: 'TikTok', url: 'https://www.tiktok.com/@deesqrgee' },
  { name: 'Facebook', url: 'https://www.facebook.com/profile.php?id=61575479384930' },
] as const;
