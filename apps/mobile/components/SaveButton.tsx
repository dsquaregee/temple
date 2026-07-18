import { Pressable, StyleSheet, Text } from 'react-native';
import { t, type Locale } from '@temple/core';
import { MIN_TOUCH, radius, useTheme } from '@/lib/theme';
import { useFavorites } from '@/lib/favorites';

// Save/Saved toggle for a temple. Star + label; 48dp target.
export function SaveButton({ locale, id }: { locale: Locale; id: string }) {
  const { has, toggle } = useFavorites();
  const { colors } = useTheme();
  const f = t(locale).favorites;
  const saved = has(id);
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ selected: saved }}
      onPress={() => toggle(id)}
      style={({ pressed }) => [
        styles.btn,
        {
          backgroundColor: saved ? colors.accentTurmeric : colors.bgRaised,
          borderColor: saved ? colors.accentTurmeric : colors.line,
          opacity: pressed ? 0.8 : 1,
        },
      ]}
    >
      <Text
        style={{
          color: saved ? '#17130F' : colors.inkBody,
          fontSize: 14,
          fontWeight: saved ? '600' : '400',
        }}
      >
        {(saved ? '★  ' : '☆  ') + (saved ? f.saved : f.save)}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  btn: {
    minHeight: MIN_TOUCH,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
    borderRadius: radius.pill,
    borderWidth: StyleSheet.hairlineWidth,
    alignSelf: 'flex-start',
    marginTop: 12,
  },
});
