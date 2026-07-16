import { router, useLocalSearchParams } from 'expo-router';
import { Text, View } from 'react-native';
import { t } from '@temple/core';
import { getTemples } from '@temple/content';
import { asLocale } from '@/lib/locale';
import { useTheme } from '@/lib/theme';
import { Card, NativeName, Screen, Title } from '@/components/ui';

export default function ListenScreen() {
  const { locale: raw } = useLocalSearchParams<{ locale: string }>();
  const locale = asLocale(raw);
  const ui = t(locale);
  const { colors } = useTheme();
  const temples = getTemples(locale);
  const anyAudio = temples.some((tp) => tp.audio);

  return (
    <Screen>
      <Title>{ui.tabs.listen}</Title>

      {!anyAudio && (
        <View
          style={{
            borderColor: colors.line,
            borderWidth: 0.5,
            borderStyle: 'dashed',
            borderRadius: 12,
            padding: 16,
            marginVertical: 12,
          }}
        >
          <Text style={{ color: colors.inkStrong, fontWeight: '600', marginBottom: 4 }}>
            ♪ {ui.tabs.listen}
          </Text>
          <Text style={{ color: colors.inkMuted, fontSize: 14 }}>
            {ui.labels.listenComingSoon}
          </Text>
        </View>
      )}

      {temples.map((tp) => (
        <Card key={tp.id} onPress={() => router.push(`/${locale}/temples/${tp.id}`)}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
            <View style={{ flexShrink: 1 }}>
              <Text style={{ color: colors.inkStrong, fontSize: 18, fontWeight: '600' }}>
                {tp.name}
              </Text>
              <NativeName>{tp.nativeName}</NativeName>
            </View>
            <Text
              style={{
                color: tp.audio ? colors.accentLeaf : colors.inkMuted,
                fontSize: 16,
              }}
            >
              {tp.audio ? '▶' : '···'}
            </Text>
          </View>
        </Card>
      ))}
      <View style={{ height: 8 }} />
    </Screen>
  );
}
