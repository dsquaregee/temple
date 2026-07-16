import { router, useLocalSearchParams } from 'expo-router';
import { Pressable, Text, View } from 'react-native';
import { colorForTemple, t } from '@temple/core';
import { getCircuit, getTemple, getTemples } from '@temple/content';
import { asLocale } from '@/lib/locale';
import { useTheme } from '@/lib/theme';
import {
  Body,
  Card,
  Chip,
  Hero,
  Lead,
  Muted,
  NativeName,
  Screen,
  SectionHeading,
  Tile,
} from '@/components/ui';

export default function TempleDetailScreen() {
  const params = useLocalSearchParams<{ locale: string; id: string }>();
  const locale = asLocale(params.locale);
  const id = Array.isArray(params.id) ? params.id[0] : params.id;
  const ui = t(locale);
  const { colors } = useTheme();
  const temple = id ? getTemple(locale, id) : undefined;

  if (!temple) {
    return (
      <Screen>
        <Muted>Not found.</Muted>
      </Screen>
    );
  }

  const memberCircuits = temple.circuits
    .map((c) => getCircuit(locale, c))
    .filter((c): c is NonNullable<typeof c> => Boolean(c));

  const related = getTemples(locale)
    .filter((o) => o.id !== temple.id)
    .filter(
      (o) =>
        o.circuits.some((c) => temple.circuits.includes(c)) ||
        o.dynasty === temple.dynasty
    )
    .slice(0, 4);

  const sections: { label: string; body: string }[] = [
    { label: ui.sections.history, body: temple.sections.history },
    { label: ui.sections.architecture, body: temple.sections.architecture },
    { label: ui.sections.legends, body: temple.sections.legends },
    { label: ui.sections.festivals, body: temple.sections.festivals },
    { label: ui.sections.experience, body: temple.sections.experience },
  ];

  const orient: { k: string; v: string }[] = [
    { k: ui.labels.deity, v: temple.deity },
    { k: ui.labels.dynasty, v: temple.dynasty },
    { k: ui.labels.period, v: temple.period },
    { k: ui.labels.style, v: temple.style },
  ];

  const visit: { k: string; v: string }[] = [
    { k: ui.visit.timings, v: temple.visit.timings },
    { k: ui.visit.dressCode, v: temple.visit.dressCode },
    { k: ui.visit.photography, v: temple.visit.photography },
    { k: ui.visit.gettingThere, v: temple.visit.gettingThere },
  ];

  return (
    <Screen>
      <Pressable onPress={() => router.back()} style={{ paddingVertical: 8 }}>
        <Text style={{ color: colors.accentVermilion, fontSize: 16 }}>‹ {ui.tabs.discover}</Text>
      </Pressable>

      <Hero color={colorForTemple(temple.id)}>
        {temple.unesco && (
          <Text style={{ color: '#fff', opacity: 0.9, fontSize: 12, letterSpacing: 1 }}>
            {ui.labels.unesco.toUpperCase()}
          </Text>
        )}
        <Text style={{ color: '#fff', fontSize: 24, fontWeight: '700', marginTop: 6 }}>
          {temple.name}
        </Text>
        <Text style={{ color: '#fff', opacity: 0.95, marginTop: 4 }}>
          {temple.nativeName}
        </Text>
      </Hero>

      <View
        style={{
          flexDirection: 'row',
          flexWrap: 'wrap',
          backgroundColor: colors.bgRaised,
          borderColor: colors.line,
          borderWidth: 0.5,
          borderRadius: 12,
          padding: 14,
        }}
      >
        {orient.map((o) => (
          <View key={o.k} style={{ width: '50%', paddingVertical: 6 }}>
            <Text style={{ color: colors.inkMuted, fontSize: 12 }}>{o.k}</Text>
            <Text style={{ color: colors.inkStrong, fontSize: 15 }}>{o.v}</Text>
          </View>
        ))}
      </View>

      {memberCircuits.length > 0 && (
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', marginTop: 12 }}>
          {memberCircuits.map((c) => (
            <Pressable key={c.id} onPress={() => router.push(`/${locale}/yatra/${c.id}`)}>
              <Chip accent>{c.name}</Chip>
            </Pressable>
          ))}
        </View>
      )}

      <SectionHeading>{ui.labels.whyItMatters}</SectionHeading>
      <Lead>{temple.summary}</Lead>

      {sections.map((s) => (
        <View key={s.label}>
          <SectionHeading>{s.label}</SectionHeading>
          <Body>{s.body}</Body>
        </View>
      ))}

      <SectionHeading>{ui.visit.heading}</SectionHeading>
      {visit.map((v) => (
        <Tile key={v.k} label={v.k} value={v.v} />
      ))}

      <View
        style={{
          borderColor: colors.line,
          borderWidth: 0.5,
          borderStyle: 'dashed',
          borderRadius: 12,
          padding: 16,
          marginTop: 18,
        }}
      >
        <Text style={{ color: colors.inkStrong, fontWeight: '600' }}>
          {ui.labels.supportTemple}
        </Text>
        <Text style={{ color: colors.inkMuted, fontSize: 14, marginTop: 4 }}>
          {ui.labels.supportNote}
        </Text>
      </View>

      {related.length > 0 && (
        <>
          <SectionHeading>{ui.labels.relatedTemples}</SectionHeading>
          {related.map((o) => (
            <Card key={o.id} onPress={() => router.push(`/${locale}/temples/${o.id}`)}>
              <Text style={{ color: colors.inkStrong, fontSize: 18, fontWeight: '600' }}>
                {o.name}
              </Text>
              <NativeName>{o.nativeName}</NativeName>
              <Muted>
                {o.location.city}, {o.location.state}
              </Muted>
            </Card>
          ))}
        </>
      )}
    </Screen>
  );
}
