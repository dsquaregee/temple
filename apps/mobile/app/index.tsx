import { Link } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LOCALE_LABELS, type Locale } from '@/lib/locale';
import { radius, useTheme, fonts } from '@/lib/theme';

// Onboarding screen 1 (design D4): language picker, native scripts leading.
const ORDER: Locale[] = ['ta', 'te', 'kn', 'ml', 'hi', 'en'];

export default function LanguagePicker() {
  const { colors } = useTheme();
  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: colors.bgBase }]}>
      <View style={styles.wrap}>
        <Text style={[styles.brand, { color: colors.inkStrong }]}>Temple</Text>
        <Text style={[styles.sub, { color: colors.inkMuted }]}>
          Choose your language
        </Text>
        <View style={styles.list}>
          {ORDER.map((loc) => (
            <Link key={loc} href={`/${loc}`} asChild>
              <View
                style={[
                  styles.item,
                  { backgroundColor: colors.bgRaised, borderColor: colors.line },
                ]}
              >
                <Text style={[styles.script, { color: colors.inkStrong }]}>
                  {LOCALE_LABELS[loc].script}
                </Text>
                {LOCALE_LABELS[loc].gloss !== LOCALE_LABELS[loc].script && (
                  <Text style={[styles.gloss, { color: colors.inkMuted }]}>
                    {LOCALE_LABELS[loc].gloss}
                  </Text>
                )}
              </View>
            </Link>
          ))}
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  wrap: { flex: 1, justifyContent: 'center', padding: 24 },
  brand: { fontFamily: fonts.display, fontSize: 34, fontWeight: '700', textAlign: 'center' },
  sub: { textAlign: 'center', marginTop: 6, marginBottom: 28 },
  list: { gap: 10 },
  item: {
    minHeight: 60,
    justifyContent: 'center',
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: radius.card,
    borderWidth: StyleSheet.hairlineWidth,
    marginBottom: 10,
  },
  script: { fontFamily: fonts.display, fontSize: 20 },
  gloss: { fontSize: 13, marginTop: 2 },
});
