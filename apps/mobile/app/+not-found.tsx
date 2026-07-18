import { Link } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { fonts, radius, useTheme } from '@/lib/theme';

// Fallback for any unmatched route. Locale is unknown here, so the copy is
// kept short and English, with a single clear way back to the language picker.
export default function NotFound() {
  const { colors } = useTheme();
  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: colors.bgBase }]}>
      <View style={styles.wrap}>
        <Text style={[styles.code, { color: colors.accentVermilion }]}>404</Text>
        <Text style={[styles.brand, { color: colors.inkStrong }]}>Temple</Text>
        <Text style={[styles.sub, { color: colors.inkMuted }]}>
          This page could not be found.
        </Text>
        <Link href="/" replace asChild>
          <Pressable
            style={({ pressed }) => [
              styles.button,
              { backgroundColor: colors.accentTurmeric, opacity: pressed ? 0.8 : 1 },
            ]}
          >
            <Text style={styles.buttonText}>Choose your language</Text>
          </Pressable>
        </Link>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  wrap: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 24 },
  code: { fontFamily: fonts.display, fontSize: 15, letterSpacing: 2, marginBottom: 4 },
  brand: { fontFamily: fonts.display, fontSize: 34, fontWeight: '700' },
  sub: { textAlign: 'center', marginTop: 6, marginBottom: 28 },
  button: {
    minHeight: 48,
    justifyContent: 'center',
    paddingHorizontal: 22,
    borderRadius: radius.pill,
  },
  buttonText: { color: '#17130F', fontSize: 15, fontWeight: '600' },
});
