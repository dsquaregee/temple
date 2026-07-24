import { useLocalSearchParams } from 'expo-router';
import { t } from '@temple/core';
import { getTemples } from '@temple/content';
import { asLocale } from '@/lib/locale';
import { ListenPlayer } from '@/components/ListenPlayer';

export default function ListenScreen() {
  const { locale: raw } = useLocalSearchParams<{ locale: string }>();
  const locale = asLocale(raw);
  const ui = t(locale);
  const temples = getTemples(locale);

  return <ListenPlayer locale={locale} ui={ui} temples={temples} />;
}
