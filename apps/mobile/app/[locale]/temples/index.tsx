import { router, useLocalSearchParams } from 'expo-router';
import { Text } from 'react-native';
import { t } from '@temple/core';
import { getTemples } from '@temple/content';
import { asLocale } from '@/lib/locale';
import { useTheme } from '@/lib/theme';
import { Card, Muted, NativeName, Screen, Title } from '@/components/ui';

export default function DiscoverScreen() {
  const { locale: raw } = useLocalSearchParams<{ locale: string }>();
  const locale = asLocale(raw);
  const ui = t(locale);
  const { colors } = useTheme();
  const temples = getTemples(locale);

  return (
    <Screen>
      <Title>{ui.tabs.discover}</Title>
      <Muted>
        {temples.length} {ui.labels.allTemples.toLowerCase()}
      </Muted>
      <Text style={{ height: 12 }} />
      {temples.map((tp) => (
        <Card key={tp.id} onPress={() => router.push(`/${locale}/temples/${tp.id}`)}>
          <Text style={{ color: colors.inkStrong, fontSize: 18, fontWeight: '600' }}>
            {tp.name}
          </Text>
          <NativeName>{tp.nativeName}</NativeName>
          <Muted>
            {tp.location.city}, {tp.location.state}
            {tp.unesco ? ` · ${ui.labels.unesco}` : ''}
          </Muted>
        </Card>
      ))}
    </Screen>
  );
}
