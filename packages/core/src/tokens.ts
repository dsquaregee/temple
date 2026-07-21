export const tokens = {
  color: {
    light: {
      bgBase: '#FAF6EE',
      bgRaised: '#FFFFFF',
      bgSunken: '#F1EADC',
      inkStrong: '#2B2118',
      inkBody: '#4A3F33',
      // Darkened from #8A7C6A to clear WCAG AA (4.5:1) for small text on all
      // three light surfaces — captions/meta failed AA on the base/sunken bg.
      inkMuted: '#726550',
      accentTurmeric: '#D98E04',
      accentVermilion: '#B3411F',
      accentLeaf: '#5C7A45',
      line: '#E5DCC9',
    },
    dark: {
      bgBase: '#171310',
      bgRaised: '#211C17',
      bgSunken: '#0F0C0A',
      inkStrong: '#F2EAD9',
      inkBody: '#CFC4B2',
      inkMuted: '#8F8474',
      accentTurmeric: '#E8A62A',
      accentVermilion: '#D65F3B',
      accentLeaf: '#7FA05E',
      line: '#33291F',
    },
  },
  radius: { card: 12, chip: 8, pill: 999 },
  space: (n: number) => n * 4,
  minTouchTarget: 48,
  font: {
    display: "Georgia, 'Noto Serif', serif",
    ui: "system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif",
  },
} as const;
