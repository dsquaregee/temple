import type { Metadata, Viewport } from 'next';
import { LOCALES, t, type Locale } from '@temple/core';
import TabBar from '../../components/TabBar';
import RegisterSW from '../../components/RegisterSW';
import '../globals.css';

export function generateStaticParams() {
  return LOCALES.map((locale) => ({ locale }));
}

export const dynamicParams = false;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = (await params) as { locale: Locale };
  const s = t(locale);
  return {
    title: { default: s.appName, template: `%s · ${s.appName}` },
    description: s.tagline,
  };
}

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#FAF6EE' },
    { media: '(prefers-color-scheme: dark)', color: '#171310' },
  ],
};

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = (await params) as { locale: Locale };
  return (
    <html lang={locale}>
      <head>
        <link rel="manifest" href="/manifest.webmanifest" />
      </head>
      <body>
        <main>{children}</main>
        <TabBar locale={locale} />
        <RegisterSW />
      </body>
    </html>
  );
}
