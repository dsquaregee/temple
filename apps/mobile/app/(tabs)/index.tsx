import { Pressable, ScrollView, Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import { t } from '@temple/core';
import { getCircuits, getTemples } from '@temple/content';
import TempleCard from '../../components/TempleCard';
import CircuitCard from '../../components/CircuitCard';
import { useLocale } from '../../lib/locale';
import { usePalette, radius } from '../../lib/theme';

export default function Home() {
  const palette = usePalette();
  const router = useRouter();
  const { locale } = useLocale();
  const s = t(locale);
  const temples = getTemples(locale);
  const circuits = getCircuits(locale);
  const featured = temples[new Date().getDate() % temples.length] ?? temples[0];

  return (
    <ScrollView contentContainerStyle={{ padding: 20, gap: 12 }}>
      <Text style={{ fontSize: 13, color: palette.inkMuted }}>{s.tagline}</Text>

      {featured && (
        <>
          <Text
            style={{
              fontSize: 12,
              textTransform: 'uppercase',
              letterSpacing: 0.5,
              color: palette.inkMuted,
              marginTop: 8,
            }}
          >
            {s.labels.templeOfTheDay}
          </Text>
          <Pressable
            accessibilityRole="button"
            onPress={() =>
              router.push({ pathname: '/temple/[id]', params: { id: featured.id } })
            }
            style={{
              backgroundColor: '#3C2414',
              borderRadius: radius.card,
              padding: 20,
              gap: 6,
            }}
          >
            <Text style={{ fontSize: 22, fontWeight: '700', color: '#FFF7E8' }}>
              {featured.name}
            </Text>
            <Text style={{ fontSize: 14, color: '#E8CFA4' }}>{featured.nativeName}</Text>
            <Text style={{ fontSize: 13, color: '#FFF7E8' }} numberOfLines={4}>
              {featured.summary}
            </Text>
          </Pressable>
        </>
      )}

      <Text style={{ fontSize: 19, fontWeight: '600', color: palette.inkStrong, marginTop: 12 }}>
        {s.labels.circuits}
      </Text>
      <View style={{ gap: 12 }}>
        {circuits.map((circuit) => (
          <CircuitCard key={circuit.id} circuit={circuit} />
        ))}
      </View>

      <Text style={{ fontSize: 19, fontWeight: '600', color: palette.inkStrong, marginTop: 12 }}>
        {s.labels.allTemples}
      </Text>
      <View style={{ gap: 12 }}>
        {temples.map((temple) => (
          <TempleCard key={temple.id} temple={temple} />
        ))}
      </View>
    </ScrollView>
  );
}
