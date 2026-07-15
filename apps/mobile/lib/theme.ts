import { useColorScheme } from 'react-native';
import { tokens } from '@temple/core';

export type ThemeColors = Record<keyof typeof tokens.color.light, string>;

// Resolve the palette (packages/core tokens) for the current OS color scheme.
export function useTheme(): { colors: ThemeColors; dark: boolean } {
  const scheme = useColorScheme();
  const dark = scheme === 'dark';
  return { colors: dark ? tokens.color.dark : tokens.color.light, dark };
}

export const radius = tokens.radius;
export const space = tokens.space;
export const MIN_TOUCH = tokens.minTouchTarget;

// System font stacks (no bundled web fonts — matches the perf budget).
export const fonts = tokens.font;
