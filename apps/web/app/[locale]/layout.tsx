import { notFound } from 'next/navigation';
import { LOCALES, isLocale, type Locale } from '@/lib/locales';
import { LocaleClient } from '@/components/LocaleClient';

export const dynamicParams = false;

export function generateStaticParams() {
  return LOCALES.map((locale) => ({ locale }));
}

export default function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { locale: string };
}) {
  if (!isLocale(params.locale)) notFound();
  return (
    <>
      <LocaleClient locale={params.locale as Locale} />
      {children}
    </>
  );
}
