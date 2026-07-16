import { router, useLocalSearchParams } from 'expo-router';
import { Pressable, Text, View } from 'react-native';
import { t } from '@temple/core';
import { getCircuit, getCircuitTemples } from '@temple/content';
import { asLocale } from '@/lib/locale';
import { useTheme } from '@/lib/theme';
import {
  Card,
  Chip,
  Hero,
  Lead,
  Muted,
  NativeName,
  Screen,
  SectionHeading,
} from '@/components/ui';

export default function CircuitDetailScreen() {
  const params = useLocalSearchParams<{ locale: string; id: string }>();
  const locale = asLocale(params.locale);
  const id = Array.isArray(params.id) ? params.id[0] : params.id;
  const ui = t(locale);
  const { colors } = useTheme();
  const circuit = id ? getCircuit(locale, id) : undefined;

  if (!circuit) {
    return (
      <Screen>
        <Muted>Not found.</Muted>
      </Screen>
    );
  }

  const stops = getCircuitTemples(locale, circuit);

  return (
    <Screen>
      <Pressable onPress={() => router.back()} style={{ paddingVertical: 8 }}>
        <Text style={{ color: colors.accentVermilion, fontSize: 16 }}>‹ {ui.tabs.yatra}</Text>
      </Pressable>

      <Hero>
        <Text style={{ color: '#fff', opacity: 0.9, fontSize: 12, letterSpacing: 1 }}>
          {circuit.region.toUpperCase()}
        </Text>
        <Text style={{ color: '#fff', fontSize: 24, fontWeight: '700', marginTop: 6 }}>
          {circuit.name}
        </Text>
        <Text style={{ color: '#fff', opacity: 0.95, marginTop: 4 }}>
          {circuit.nativeName}
        </Text>
      </Hero>

      <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
        <Chip>
          {stops.length} {ui.labels.stops}
        </Chip>
        <Chip>{circuit.theme}</Chip>
      </View>

      <Lead>{circuit.description}</Lead>

      <SectionHeading>{ui.labels.stops}</SectionHeading>
      {stops.map((tp, i) => (
        <Card key={tp.id} onPress={() => router.push(`/${locale}/temples/${tp.id}`)}>
          <Text style={{ color: colors.accentTurmeric, fontWeight: '700', marginBottom: 2 }}>
            {i + 1}
          </Text>
          <Text style={{ color: colors.inkStrong, fontSize: 18, fontWeight: '600' }}>
            {tp.name}
          </Text>
          <NativeName>{tp.nativeName}</NativeName>
          <Muted>
            {tp.location.city}, {tp.location.state}
          </Muted>
        </Card>
      ))}
    </Screen>
  );
}
