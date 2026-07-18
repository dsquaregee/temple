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
