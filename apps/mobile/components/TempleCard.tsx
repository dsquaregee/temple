import { Pressable, Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import type { Temple } from '@temple/core';
import { t } from '@temple/core';
import { useLocale } from '../lib/locale';
import { usePalette, radius } from '../lib/theme';

export function Chip({ label, highlight }: { label: string; highlight?: boolean }) {
  const palette = usePalette();
  return (
    <View
      style={{
        backgroundColor: highlight ? palette.accentTurmeric : palette.bgSunken,
        borderRadius: radius.chip,
        paddingHorizontal: 8,
        paddingVertical: 3,
      }}
    >
      <Text
        style={{
          fontSize: 12,
          color: highlight ? '#2B2118' : palette.inkBody,
          fontWeight: highlight ? '600' : '400',
        }}
      >
        {label}
      </Text>
    </View>
  );
}

export default function TempleCard({ temple }: { temple: Temple }) {
  const palette = usePalette();
  const router = useRouter();
  const { locale } = useLocale();
  const s = t(locale);

  return (
    <Pressable
      accessibilityRole="button"
      onPress={() => router.push({ pathname: '/temple/[id]', params: { id: temple.id } })}
      style={{
        backgroundColor: palette.bgRaised,
        borderColor: palette.line,
        borderWidth: 1,
        borderRadius: radius.card,
        padding: 16,
        gap: 4,
      }}
    >
      <View style={{ flexDirection: 'row', gap: 6, flexWrap: 'wrap', marginBottom: 4 }}>
        <Chip label={temple.location.city} />
        <Chip label={temple.dynasty} />
        {temple.unesco && <Chip label={s.labels.unesco} highlight />}
      </View>
      <Text style={{ fontSize: 17, fontWeight: '600', color: palette.inkStrong }}>
        {temple.name}
      </Text>
      <Text style={{ fontSize: 14, color: palette.inkMuted }}>{temple.nativeName}</Text>
      <Text style={{ fontSize: 13, color: palette.inkMuted }} numberOfLines={3}>
        {temple.summary}
      </Text>
    </Pressable>
  );
}
