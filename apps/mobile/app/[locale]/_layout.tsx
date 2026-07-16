import { Tabs, useLocalSearchParams } from 'expo-router';
import { Text } from 'react-native';
import { t } from '@temple/core';
import { asLocale } from '@/lib/locale';
import { useTheme } from '@/lib/theme';

const GLYPHS = { home: '⌂', discover: '☖', yatra: '⟿', listen: '♪' } as const;

function TabGlyph({ glyph, color }: { glyph: string; color: string }) {
  return <Text style={{ fontSize: 20, color }}>{glyph}</Text>;
}

export default function LocaleTabsLayout() {
  const { locale: raw } = useLocalSearchParams<{ locale: string }>();
  const locale = asLocale(raw);
  const ui = t(locale);
  const { colors } = useTheme();

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.accentVermilion,
        tabBarInactiveTintColor: colors.inkMuted,
        tabBarStyle: {
          backgroundColor: colors.bgRaised,
          borderTopColor: colors.line,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: ui.tabs.home,
          tabBarIcon: ({ color }) => <TabGlyph glyph={GLYPHS.home} color={color} />,
        }}
      />
      <Tabs.Screen
        name="temples"
        options={{
          title: ui.tabs.discover,
          tabBarIcon: ({ color }) => (
            <TabGlyph glyph={GLYPHS.discover} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="yatra"
        options={{
          title: ui.tabs.yatra,
          tabBarIcon: ({ color }) => <TabGlyph glyph={GLYPHS.yatra} color={color} />,
        }}
      />
      <Tabs.Screen
        name="listen"
        options={{
          title: ui.tabs.listen,
          tabBarIcon: ({ color }) => (
            <TabGlyph glyph={GLYPHS.listen} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
