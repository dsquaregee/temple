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
import { CircuitMap } from '@/components/CircuitMap';

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
  // Optional regional groups (large circuits), numbered continuously.
  let running = 0;
  const groups = circuit.groups?.map((g) => {
    const temples = g.stops
      .map((gid) => stops.find((t) => t.id === gid))
      .filter((t): t is (typeof stops)[number] => Boolean(t));
    const offset = running;
    running += temples.length;
    return { name: g.name, temples, offset };
  });

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

      {groups ? null : (
        <CircuitMap
          temples={stops}
          locale={locale}
          title={`${ui.labels.routeMap}: ${circuit.name}`}
          note={ui.labels.routeNote}
          orderLabel={ui.labels.drivingOrder}
        />
      )}

      <Lead>{circuit.description}</Lead>

      {(groups ?? [{ name: ui.labels.stops, temples: stops, offset: 0 }]).map((g) => (
        <View key={g.name}>
          <SectionHeading>{groups ? `${g.name} · ${g.temples.length}` : g.name}</SectionHeading>
          {groups ? (
            <CircuitMap
              temples={g.temples}
              locale={locale}
              title={`${ui.labels.routeMap}: ${circuit.name} — ${g.name}`}
              note={ui.labels.routeNote}
              orderLabel={ui.labels.drivingOrder}
              offset={g.offset}
            />
          ) : null}
          {g.temples.map((tp, i) => (
            <Card key={tp.id} onPress={() => router.push(`/${locale}/temples/${tp.id}`)}>
              <Text style={{ color: colors.accentTurmeric, fontWeight: '700', marginBottom: 2 }}>
                {g.offset + i + 1}
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
        </View>
      ))}
    </Screen>
  );
}
