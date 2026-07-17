import { useColorScheme } from 'react-native';
import { tokens } from '@temple/core';

// Light and dark share keys but have distinct literal hex types under
// `as const`; widen to string so either palette satisfies the return type.
export type Palette = Record<keyof typeof tokens.color.light, string>;

export function usePalette(): Palette {
  const scheme = useColorScheme();
  return scheme === 'dark' ? tokens.color.dark : tokens.color.light;
}

export const radius = tokens.radius;
export const space = tokens.space;
