import { describe, expect, it } from 'vitest';
import { SITE_URL } from './site';
import { absUrl, breadcrumbList, collectionPage } from './jsonld';

describe('absUrl', () => {
  it('prefixes a locale-relative path with the site origin', () => {
    expect(absUrl('en/temples')).toBe(`${SITE_URL}/en/temples`);
  });
});

describe('breadcrumbList', () => {
  it('builds a schema.org BreadcrumbList with 1-based positions and absolute URLs', () => {
    const ld = breadcrumbList([
      { name: 'Home', path: 'en' },
      { name: 'Discover', path: 'en/temples' },
      { name: 'Brihadeeswarar', path: 'en/temples/brihadeeswarar' },
    ]);
    expect(ld['@type']).toBe('BreadcrumbList');
    expect(ld.itemListElement).toHaveLength(3);
    expect(ld.itemListElement[0]).toMatchObject({
      position: 1,
      name: 'Home',
      item: `${SITE_URL}/en`,
    });
    expect(ld.itemListElement[2].position).toBe(3);
    expect(ld.itemListElement[2].item).toBe(`${SITE_URL}/en/temples/brihadeeswarar`);
  });
});

describe('collectionPage', () => {
  it('builds an ItemList whose numberOfItems matches the entries', () => {
    const ld = collectionPage({
      name: 'Discover',
      url: `${SITE_URL}/en/temples`,
      items: [
        { name: 'A', path: 'en/temples/a' },
        { name: 'B', path: 'en/temples/b' },
      ],
    });
    expect(ld['@type']).toBe('CollectionPage');
    expect(ld.mainEntity.numberOfItems).toBe(2);
    expect(ld.mainEntity.itemListElement[1]).toMatchObject({
      position: 2,
      name: 'B',
      url: `${SITE_URL}/en/temples/b`,
    });
  });
});
