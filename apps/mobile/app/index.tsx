import { Pressable, Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import { LOCALES, strings, type Locale } from '@temple/core';
import { useLocale } from '../lib/locale';
import { usePalette, radius } from '../lib/theme';

// Onboarding screen 1: language picker — native scripts lead, English gloss
// below (design rule). Anonymous browsing; no sign-in gate.
const GLOSS: Record<Locale, string> = {
  en: 'English',
  ta: 'Tamil',
  te: 'Telugu',
  kn: 'Kannada',
  ml: 'Malayalam',
  hi: 'Hindi',
};

export default function LanguagePicker() {
  const palette = usePalette();
  const router = useRouter();
  const { setLocale } = useLocale();

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: palette.bgBase,
        justifyContent: 'center',
        padding: 20,
        gap: 10,
      }}
    >
      <Text
        style={{
          fontSize: 24,
          fontWeight: '600',
          color: palette.inkStrong,
          marginBottom: 12,
        }}
      >
        Temple
      </Text>
      {LOCALES.map((locale) => (
        <Pressable
          key={locale}
          accessibilityRole="button"
          onPress={() => {
            setLocale(locale);
            router.replace('/(tabs)');
          }}
          style={{
            minHeight: 48,
            backgroundColor: palette.bgRaised,
            borderColor: palette.line,
            borderWidth: 1,
            borderRadius: radius.card,
            paddingHorizontal: 16,
            paddingVertical: 12,
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <Text style={{ fontSize: 19, fontWeight: '600', color: palette.inkStrong }}>
            {strings[locale].labels.languageName}
          </Text>
          <Text style={{ fontSize: 13, color: palette.inkMuted }}>
            {GLOSS[locale]}
          </Text>
        </Pressable>
      ))}
    </View>
  );
}
