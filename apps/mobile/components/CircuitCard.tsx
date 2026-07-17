import { Pressable, Text } from 'react-native';
import { useRouter } from 'expo-router';
import type { Circuit } from '@temple/core';
import { t } from '@temple/core';
import { useLocale } from '../lib/locale';
import { usePalette, radius } from '../lib/theme';

export default function CircuitCard({ circuit }: { circuit: Circuit }) {
  const palette = usePalette();
  const router = useRouter();
  const { locale } = useLocale();
  const s = t(locale);

  return (
    <Pressable
      accessibilityRole="button"
      onPress={() => router.push({ pathname: '/yatra/[id]', params: { id: circuit.id } })}
      style={{
        backgroundColor: palette.bgRaised,
        borderColor: palette.line,
        borderWidth: 1,
        borderRadius: radius.card,
        padding: 16,
        gap: 4,
      }}
    >
      <Text style={{ fontSize: 13, color: palette.inkMuted }}>
        {circuit.region} · {circuit.stops.length} {s.labels.stops}
      </Text>
      <Text style={{ fontSize: 17, fontWeight: '600', color: palette.inkStrong }}>
        {circuit.name}
      </Text>
      <Text style={{ fontSize: 14, color: palette.inkMuted }}>{circuit.nativeName}</Text>
      <Text style={{ fontSize: 13, color: palette.inkBody }} numberOfLines={2}>
        {circuit.theme}
      </Text>
    </Pressable>
  );
}
