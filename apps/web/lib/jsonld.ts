import { SITE_URL } from './site';

// Absolute URL for a locale-relative path (trailing-slash form, matching the
// site's canonical URLs). JSON-LD should always use absolute URLs.
export function absUrl(path: string): string {
  return `${SITE_URL}/${path}`;
}

export interface Crumb {
  name: string;
  path: string;
}

// A schema.org BreadcrumbList for a page's ancestry (Home ▸ … ▸ current). Helps
// Google render breadcrumb rich results and understand site structure.
export function breadcrumbList(items: Crumb[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((crumb, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: crumb.name,
      item: absUrl(crumb.path),
    })),
  };
}

// A CollectionPage whose mainEntity is an ordered ItemList of the entries on a
// listing page (Discover, Yatra). Gives Google the members of each hub page and
// their canonical URLs.
export function collectionPage(opts: {
  name: string;
  url: string;
  items: Crumb[];
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: opts.name,
    url: opts.url,
    mainEntity: {
      '@type': 'ItemList',
      numberOfItems: opts.items.length,
      itemListElement: opts.items.map((item, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        name: item.name,
        url: absUrl(item.path),
      })),
    },
  };
}
