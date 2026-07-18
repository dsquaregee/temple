import { router, useLocalSearchParams } from 'expo-router';
import { Text, View } from 'react-native';
import { colorForTemple, epochDay, indexOfDay, t } from '@temple/core';
import { getCircuits, getTemples } from '@temple/content';
import { asLocale } from '@/lib/locale';
import { useTheme } from '@/lib/theme';
import { useFavorites } from '@/lib/favorites';
import {
  Card,
  Hero,
  Muted,
  NativeName,
  Screen,
  SectionHeading,
} from '@/components/ui';

export default function HomeScreen() {
  const { locale: raw } = useLocalSearchParams<{ locale: string }>();
  const locale = asLocale(raw);
  const ui = t(locale);
  const { colors } = useTheme();
  const temples = getTemples(locale);
  const circuits = getCircuits(locale);
  // Temple of the day: rotates daily, picked at runtime on the device.
  const featured = temples[indexOfDay(temples.length, epochDay(new Date()))];

  const { ids: savedIds, ready: favReady } = useFavorites();
  const saved = favReady ? temples.filter((tp) => savedIds.includes(tp.id)) : [];

  return (
    <Screen>
      {featured && (
        <Card onPress={() => router.push(`/${locale}/temples/${featured.id}`)}>
          <Hero color={colorForTemple(featured.id)}>
            <Text style={{ color: '#fff', opacity: 0.9, fontSize: 12, letterSpacing: 1 }}>
              {ui.labels.templeOfTheDay.toUpperCase()}
            </Text>
            <Text style={{ color: '#fff', fontSize: 24, fontWeight: '700', marginTop: 6 }}>
              {featured.name}
            </Text>
            <Text style={{ color: '#fff', opacity: 0.95, marginTop: 4 }}>
              {featured.location.city}, {featured.location.state}
            </Text>
          </Hero>
        </Card>
      )}

      {saved.length > 0 && (
        <>
          <SectionHeading>{ui.favorites.savedTitle}</SectionHeading>
          {saved.map((tp) => (
            <Card key={tp.id} onPress={() => router.push(`/${locale}/temples/${tp.id}`)}>
              <Text style={{ color: colors.inkStrong, fontSize: 18, fontWeight: '600' }}>
                {tp.name}
              </Text>
              <NativeName>{tp.nativeName}</NativeName>
              <Muted>
                {tp.location.city}, {tp.location.state}
              </Muted>
            </Card>
          ))}
        </>
      )}

      <SectionHeading>{ui.labels.circuits}</SectionHeading>
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

      <SectionHeading>{ui.labels.allTemples}</SectionHeading>
      {temples.map((tp) => (
        <Card key={tp.id} onPress={() => router.push(`/${locale}/temples/${tp.id}`)}>
          <Text style={{ color: colors.inkStrong, fontSize: 18, fontWeight: '600' }}>
            {tp.name}
          </Text>
          <NativeName>{tp.nativeName}</NativeName>
          <Muted>
            {tp.location.city}, {tp.location.state} · {tp.dynasty}
          </Muted>
        </Card>
      ))}
      <View style={{ height: 8 }} />
    </Screen>
  );
}
