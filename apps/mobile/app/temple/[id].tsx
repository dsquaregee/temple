import { ScrollView, Text, View } from 'react-native';
import { Stack, useLocalSearchParams } from 'expo-router';
import { t } from '@temple/core';
import { getTemple } from '@temple/content';
import { Chip } from '../../components/TempleCard';
import { useLocale } from '../../lib/locale';
import { usePalette, radius } from '../../lib/theme';

export default function TempleDetail() {
  const palette = usePalette();
  const { locale } = useLocale();
  const { id } = useLocalSearchParams<{ id: string }>();
  const s = t(locale);
  const temple = getTemple(locale, id);

  if (!temple) return null;

  const sections = [
    { title: s.sections.history, body: temple.sections.history },
    { title: s.sections.architecture, body: temple.sections.architecture },
    { title: s.sections.legends, body: temple.sections.legends },
    { title: s.sections.festivals, body: temple.sections.festivals },
    { title: s.sections.experience, body: temple.sections.experience },
  ];

  const facts = [
    { label: s.visit.timings, body: temple.visit.timings },
    { label: s.visit.dressCode, body: temple.visit.dressCode },
    { label: s.visit.photography, body: temple.visit.photography },
    { label: s.visit.gettingThere, body: temple.visit.gettingThere },
  ];

  return (
    <>
      <Stack.Screen options={{ title: temple.name, headerBackTitle: '' }} />
      <ScrollView contentContainerStyle={{ padding: 20, gap: 12 }}>
        <View
          style={{
            backgroundColor: '#3C2414',
            borderRadius: radius.card,
            padding: 20,
            gap: 6,
          }}
        >
          <Text style={{ fontSize: 24, fontWeight: '700', color: '#FFF7E8' }}>
            {temple.name}
          </Text>
          <Text style={{ fontSize: 15, color: '#E8CFA4' }}>{temple.nativeName}</Text>
          <Text style={{ fontSize: 13, color: '#FFF7E8' }}>
            {temple.location.city}, {temple.location.state} · {temple.period}
          </Text>
        </View>

        <View style={{ flexDirection: 'row', gap: 6, flexWrap: 'wrap' }}>
          <Chip label={temple.deity.split(',')[0] ?? temple.deity} />
          <Chip label={temple.dynasty} />
          <Chip label={temple.style} />
          {temple.unesco && <Chip label={s.labels.unesco} highlight />}
        </View>

        <Text style={{ fontSize: 19, fontWeight: '600', color: palette.inkStrong }}>
          {s.labels.whyItMatters}
        </Text>
        <Text style={{ fontSize: 15, lineHeight: 24, color: palette.inkBody }}>
          {temple.summary}
        </Text>

        {sections.map((section) => (
          <View key={section.title} style={{ gap: 8 }}>
            <Text
              style={{
                fontSize: 19,
                fontWeight: '600',
                color: palette.inkStrong,
                marginTop: 8,
              }}
            >
              {section.title}
            </Text>
            <Text style={{ fontSize: 15, lineHeight: 24, color: palette.inkBody }}>
              {section.body}
            </Text>
          </View>
        ))}

        <Text
          style={{ fontSize: 19, fontWeight: '600', color: palette.inkStrong, marginTop: 8 }}
        >
          {s.visit.heading}
        </Text>
        {facts.map((fact) => (
          <View
            key={fact.label}
            style={{
              backgroundColor: palette.bgRaised,
              borderColor: palette.line,
              borderWidth: 1,
              borderRadius: radius.card,
              padding: 16,
              gap: 4,
            }}
          >
            <Text
              style={{
                fontSize: 12,
                textTransform: 'uppercase',
                letterSpacing: 0.5,
                color: palette.inkMuted,
              }}
            >
              {fact.label}
            </Text>
            <Text style={{ fontSize: 14, lineHeight: 21, color: palette.inkBody }}>
              {fact.body}
            </Text>
          </View>
        ))}

        <View
          style={{
            backgroundColor: palette.bgRaised,
            borderColor: palette.line,
            borderWidth: 1,
            borderRadius: radius.card,
            padding: 16,
            gap: 4,
            marginBottom: 20,
          }}
        >
          <Text style={{ fontSize: 14, fontWeight: '600', color: palette.inkStrong }}>
            {s.labels.supportTemple}
          </Text>
          <Text style={{ fontSize: 13, color: palette.inkMuted }}>
            {s.labels.supportNote}
          </Text>
        </View>
      </ScrollView>
    </>
  );
}
