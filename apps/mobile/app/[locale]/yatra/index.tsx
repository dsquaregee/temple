import { router, useLocalSearchParams } from 'expo-router';
import { Text } from 'react-native';
import { t } from '@temple/core';
import { getCircuits } from '@temple/content';
import { asLocale } from '@/lib/locale';
import { useTheme } from '@/lib/theme';
import { Card, Muted, NativeName, Screen, Title } from '@/components/ui';

export default function YatraScreen() {
  const { locale: raw } = useLocalSearchParams<{ locale: string }>();
  const locale = asLocale(raw);
  const ui = t(locale);
  const { colors } = useTheme();
  const circuits = getCircuits(locale);

  return (
    <Screen>
      <Title>{ui.tabs.yatra}</Title>
      <Muted>{ui.labels.circuits}</Muted>
      <Text style={{ height: 12 }} />
      {circuits.map((c) => (
        <Card key={c.id} onPress={() => router.push(`/${locale}/yatra/${c.id}`)}>
          <Text style={{ color: colors.inkStrong, fontSize: 18, fontWeight: '600' }}>
            {c.name}
          </Text>
          <NativeName>{c.nativeName}</NativeName>
          <Muted>
            {c.stops.length} {ui.labels.stops} · {c.region}
          </Muted>
        </Card>
      ))}
    </Screen>
  );
}
