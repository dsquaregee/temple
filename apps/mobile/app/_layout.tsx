import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { LocaleProvider } from '../lib/locale';
import { usePalette } from '../lib/theme';

export default function RootLayout() {
  const palette = usePalette();
  return (
    <LocaleProvider>
      <StatusBar style="auto" />
      <Stack
        screenOptions={{
          headerStyle: { backgroundColor: palette.bgBase },
          headerTintColor: palette.inkStrong,
          headerShadowVisible: false,
          contentStyle: { backgroundColor: palette.bgBase },
        }}
      >
        <Stack.Screen name="index" options={{ headerShown: false }} />
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      </Stack>
    </LocaleProvider>
  );
}
