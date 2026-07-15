import { t, type Locale } from '@temple/core';
import { LangSwitch } from './LangSwitch';
import { TabBar } from './TabBar';

type Tab = 'home' | 'discover' | 'yatra' | 'listen';

// Shared per-page frame: top bar (brand + language switch) and the bottom
// tab bar. `pathSuffix` lets the language switch preserve the current content.
export function PageChrome({
  locale,
  active,
  pathSuffix = '',
  children,
}: {
  locale: Locale;
  active: Tab;
  pathSuffix?: string;
  children: React.ReactNode;
}) {
  const ui = t(locale);
  return (
    <>
      <div className="shell">
        <header className="topbar">
          <a className="brand" href={`/${locale}/`}>
            {ui.appName}
          </a>
          <LangSwitch locale={locale} pathSuffix={pathSuffix} />
        </header>
        <main>{children}</main>
      </div>
      <TabBar locale={locale} active={active} />
    </>
  );
}
