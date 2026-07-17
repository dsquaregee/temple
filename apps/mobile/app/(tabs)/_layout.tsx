import { Tabs } from 'expo-router';
import { Text } from 'react-native';
import { t } from '@temple/core';
import { useLocale } from '../../lib/locale';
import { usePalette } from '../../lib/theme';

function Glyph({ symbol, color }: { symbol: string; color: string }) {
  return <Text style={{ fontSize: 18, color }}>{symbol}</Text>;
}

export default function TabsLayout() {
  const palette = usePalette();
  const { locale } = useLocale();
  const s = t(locale);

  return (
    <Tabs
      screenOptions={{
        headerStyle: { backgroundColor: palette.bgBase },
        headerTintColor: palette.inkStrong,
        headerShadowVisible: false,
        sceneStyle: { backgroundColor: palette.bgBase },
        tabBarStyle: {
          backgroundColor: palette.bgRaised,
          borderTopColor: palette.line,
          height: 60,
        },
        tabBarActiveTintColor: palette.accentVermilion,
        tabBarInactiveTintColor: palette.inkMuted,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: s.tabs.home,
          headerTitle: s.appName,
          tabBarIcon: ({ color }) => <Glyph symbol="⌂" color={color} />,
        }}
      />
      <Tabs.Screen
        name="discover"
        options={{
          title: s.tabs.discover,
          tabBarIcon: ({ color }) => <Glyph symbol="☸" color={color} />,
        }}
      />
      <Tabs.Screen
        name="yatra"
        options={{
          title: s.tabs.yatra,
          tabBarIcon: ({ color }) => <Glyph symbol="➶" color={color} />,
        }}
      />
      <Tabs.Screen
        name="listen"
        options={{
          title: s.tabs.listen,
          tabBarIcon: ({ color }) => <Glyph symbol="♪" color={color} />,
        }}
      />
    </Tabs>
  );
}
