import { t, type Locale } from '@temple/core';

type Tab = 'home' | 'discover' | 'yatra' | 'festivals' | 'listen';

const GLYPHS: Record<Tab, string> = {
  home: '⌂',
  discover: '☖',
  yatra: '⟿',
  festivals: '✦',
  listen: '♪',
};

// Server-rendered bottom navigation mirroring the tab IA.
export function TabBar({ locale, active }: { locale: Locale; active: Tab }) {
  const ui = t(locale);
  const items: { key: Tab; href: string; label: string }[] = [
    { key: 'home', href: `/${locale}/`, label: ui.tabs.home },
    { key: 'discover', href: `/${locale}/temples/`, label: ui.tabs.discover },
    { key: 'yatra', href: `/${locale}/yatra/`, label: ui.tabs.yatra },
    { key: 'festivals', href: `/${locale}/festivals/`, label: ui.tabs.festivals },
    { key: 'listen', href: `/${locale}/listen/`, label: ui.tabs.listen },
  ];
  return (
    <nav className="tabbar" aria-label={ui.appName}>
      {items.map((it) => (
        <a
          key={it.key}
          href={it.href}
          aria-current={it.key === active ? 'page' : undefined}
        >
          <span className="glyph" aria-hidden="true">
            {GLYPHS[it.key]}
          </span>
          <span>{it.label}</span>
        </a>
      ))}
    </nav>
  );
}
