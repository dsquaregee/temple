import { ScrollView, Text, View } from 'react-native';
import { t } from '@temple/core';
import { getTemples } from '@temple/content';
import { useLocale } from '../../lib/locale';
import { usePalette, radius } from '../../lib/theme';

export default function Listen() {
  const palette = usePalette();
  const { locale } = useLocale();
  const s = t(locale);
  const temples = getTemples(locale);

  return (
    <ScrollView contentContainerStyle={{ padding: 20, gap: 12 }}>
      <View
        style={{
          backgroundColor: palette.bgRaised,
          borderColor: palette.line,
          borderWidth: 1,
          borderRadius: radius.card,
          padding: 16,
        }}
      >
        <Text style={{ fontSize: 14, color: palette.inkBody }}>
          {s.labels.listenComingSoon}
        </Text>
      </View>
      {temples.map((temple) => (
        <View
          key={temple.id}
          style={{
            backgroundColor: palette.bgRaised,
            borderColor: palette.line,
            borderWidth: 1,
            borderRadius: radius.card,
            padding: 16,
            opacity: 0.6,
            gap: 2,
          }}
        >
          <Text style={{ fontSize: 13, color: palette.inkMuted }}>♪</Text>
          <Text style={{ fontSize: 16, fontWeight: '600', color: palette.inkStrong }}>
            {temple.name}
          </Text>
          <Text style={{ fontSize: 13, color: palette.inkMuted }}>
            {temple.location.city}
          </Text>
        </View>
      ))}
    </ScrollView>
  );
}
