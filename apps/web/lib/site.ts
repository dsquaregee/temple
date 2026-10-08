// Single source of truth for the production origin. Kept in sync with
// `metadataBase` in app/layout.tsx and the per-page canonical / hreflang URLs;
// the sitemap and robots routes build their absolute URLs from here.
export const SITE_URL = 'https://temples.dsquaregee.com';

// Owner's social presence (handle: DeeSqrGee). Single source of truth for the
// site footer links and the Organization `sameAs` in the home-page JSON-LD, so
// the two never drift. Plain outbound links — no embeds, no third-party scripts,
// so no CSP/perf impact. YouTube leads (the Carnatic music channel).
export const SOCIAL = [
  { name: 'YouTube', url: 'https://www.youtube.com/@DeeSqrGee' },
  { name: 'Instagram', url: 'https://www.instagram.com/deesqrgee/' },
  { name: 'TikTok', url: 'https://www.tiktok.com/@deesqrgee' },
  { name: 'Facebook', url: 'https://www.facebook.com/profile.php?id=61575479384930' },
] as const;
