import { Pressable, ScrollView, Text, View } from 'react-native';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import { t } from '@temple/core';
import { getCircuit, getCircuitTemples } from '@temple/content';
import { useLocale } from '../../lib/locale';
import { usePalette, radius } from '../../lib/theme';

export default function CircuitDetail() {
  const palette = usePalette();
  const router = useRouter();
  const { locale } = useLocale();
  const { id } = useLocalSearchParams<{ id: string }>();
  const s = t(locale);
  const circuit = getCircuit(locale, id);

  if (!circuit) return null;
  const stops = getCircuitTemples(locale, circuit);

  return (
    <>
      <Stack.Screen options={{ title: circuit.name, headerBackTitle: '' }} />
      <ScrollView contentContainerStyle={{ padding: 20, gap: 12 }}>
        <View
          style={{
            backgroundColor: '#3C2414',
            borderRadius: radius.card,
            padding: 20,
            gap: 6,
          }}
        >
          <Text style={{ fontSize: 22, fontWeight: '700', color: '#FFF7E8' }}>
            {circuit.name}
          </Text>
          <Text style={{ fontSize: 14, color: '#E8CFA4' }}>{circuit.nativeName}</Text>
          <Text style={{ fontSize: 13, color: '#FFF7E8' }}>
            {circuit.region} · {circuit.stops.length} {s.labels.stops}
          </Text>
        </View>

        <Text style={{ fontSize: 15, lineHeight: 24, color: palette.inkBody }}>
          {circuit.theme}
        </Text>
        <Text style={{ fontSize: 15, lineHeight: 24, color: palette.inkBody }}>
          {circuit.description}
        </Text>

        <Text style={{ fontSize: 19, fontWeight: '600', color: palette.inkStrong, marginTop: 8 }}>
          {s.labels.stops}
        </Text>
        <View style={{ gap: 8, marginBottom: 20 }}>
          {stops.map((temple, i) => (
            <Pressable
              key={temple.id}
              accessibilityRole="button"
              onPress={() =>
                router.push({ pathname: '/temple/[id]', params: { id: temple.id } })
              }
              style={{
                minHeight: 48,
                flexDirection: 'row',
                alignItems: 'center',
                gap: 12,
                backgroundColor: palette.bgRaised,
                borderColor: palette.line,
                borderWidth: 1,
                borderRadius: radius.card,
                padding: 14,
              }}
            >
              <Text
                style={{ fontSize: 17, fontWeight: '700', color: palette.accentTurmeric }}
              >
                {i + 1}
              </Text>
              <View style={{ flex: 1 }}>
                <Text style={{ fontSize: 15, fontWeight: '600', color: palette.inkStrong }}>
                  {temple.name}
                </Text>
                <Text style={{ fontSize: 13, color: palette.inkMuted }}>
                  {temple.location.city}
                </Text>
              </View>
            </Pressable>
          ))}
        </View>
      </ScrollView>
    </>
  );
}
