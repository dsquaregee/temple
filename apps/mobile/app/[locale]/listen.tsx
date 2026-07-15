import { useLocalSearchParams } from 'expo-router';
import { Text, View } from 'react-native';
import { t } from '@temple/core';
import { asLocale } from '@/lib/locale';
import { useTheme } from '@/lib/theme';
import { Screen, Title } from '@/components/ui';

export default function ListenScreen() {
  const { locale: raw } = useLocalSearchParams<{ locale: string }>();
  const locale = asLocale(raw);
  const ui = t(locale);
  const { colors } = useTheme();

  return (
    <Screen>
      <Title>{ui.tabs.listen}</Title>
      <View
        style={{
          borderColor: colors.line,
          borderWidth: 0.5,
          borderStyle: 'dashed',
          borderRadius: 12,
          padding: 16,
          marginTop: 12,
        }}
      >
        <Text style={{ color: colors.inkStrong, fontWeight: '600', marginBottom: 4 }}>
          ♪ {ui.tabs.listen}
        </Text>
        <Text style={{ color: colors.inkMuted, fontSize: 14 }}>
          {ui.labels.listenComingSoon}
        </Text>
      </View>
    </Screen>
  );
}
