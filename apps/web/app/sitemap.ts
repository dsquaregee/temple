import type { MetadataRoute } from 'next';
import { getCircuits, getTemples } from '@temple/content';
import { LOCALES } from '@/lib/locales';
import { SITE_URL } from '@/lib/site';

// Static export: the sitemap is generated once at build into out/sitemap.xml.
export const dynamic = 'force-static';

function abs(path: string): string {
  return `${SITE_URL}/${path}`;
}

// hreflang alternates for a page that exists in every locale. `pathFor(locale)`
// returns the locale-relative path (trailing slash, matching trailingSlash:true
// and the per-page canonical URLs). x-default points at English.
function alternatesFor(pathFor: (locale: string) => string): {
  languages: Record<string, string>;
} {
  const languages: Record<string, string> = {};
  for (const locale of LOCALES) languages[locale] = abs(pathFor(locale));
  languages['x-default'] = abs(pathFor('en'));
  return { languages };
}

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();
  const entries: MetadataRoute.Sitemap = [];

  // Root language picker — hreflang maps each language to its localized home.
  entries.push({
    url: abs(''),
    lastModified,
    changeFrequency: 'monthly',
    priority: 1,
    alternates: alternatesFor((l) => `${l}/`),
  });

  // Per-locale tab pages.
  const tabs = [
    { suffix: '', changeFrequency: 'weekly' as const, priority: 0.9 },
    { suffix: 'temples/', changeFrequency: 'weekly' as const, priority: 0.7 },
    { suffix: 'yatra/', changeFrequency: 'monthly' as const, priority: 0.7 },
    { suffix: 'listen/', changeFrequency: 'monthly' as const, priority: 0.6 },
  ];
  for (const tab of tabs) {
    const alternates = alternatesFor((l) => `${l}/${tab.suffix}`);
    for (const locale of LOCALES) {
      entries.push({
        url: abs(`${locale}/${tab.suffix}`),
        lastModified,
        changeFrequency: tab.changeFrequency,
        priority: tab.priority,
        alternates,
      });
    }
  }

  // Temple detail pages — the catalog's core content. Ids are locale-stable
  // (schema parity), so the English catalog drives the id list for every locale.
  for (const { id } of getTemples('en')) {
    const alternates = alternatesFor((l) => `${l}/temples/${id}/`);
    for (const locale of LOCALES) {
      entries.push({
        url: abs(`${locale}/temples/${id}/`),
        lastModified,
        changeFrequency: 'monthly',
        priority: 0.8,
        alternates,
      });
    }
  }

  // Circuit (Yatra) detail pages.
  for (const { id } of getCircuits('en')) {
    const alternates = alternatesFor((l) => `${l}/yatra/${id}/`);
    for (const locale of LOCALES) {
      entries.push({
        url: abs(`${locale}/yatra/${id}/`),
        lastModified,
        changeFrequency: 'monthly',
        priority: 0.7,
        alternates,
      });
    }
  }

  return entries;
}
