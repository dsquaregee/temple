'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import type { Locale } from '@temple/core';
import { t } from '@temple/core';

const GLYPHS = { home: '⌂', discover: '☸', yatra: '➶', listen: '♪' } as const;

export default function TabBar({ locale }: { locale: Locale }) {
  const pathname = usePathname();
  const tabs = t(locale).tabs;
  const items = [
    { key: 'home', href: `/${locale}`, label: tabs.home },
    { key: 'discover', href: `/${locale}/temples`, label: tabs.discover },
    { key: 'yatra', href: `/${locale}/yatra`, label: tabs.yatra },
    { key: 'listen', href: `/${locale}/listen`, label: tabs.listen },
  ] as const;

  function isActive(href: string) {
    const path = pathname.replace(/\/$/, '');
    return href === `/${locale}` ? path === `/${locale}` : path.startsWith(href);
  }

  return (
    <nav className="tabbar" aria-label="Primary">
      {items.map((item) => (
        <Link
          key={item.key}
          href={item.href}
          aria-current={isActive(item.href) ? 'page' : undefined}
        >
          <span className="glyph" aria-hidden>
            {GLYPHS[item.key]}
          </span>
          {item.label}
        </Link>
      ))}
    </nav>
  );
}
