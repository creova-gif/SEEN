/**
 * SEEN by Creova — design tokens
 * Ported from src/styles/theme.css (web) for use in React Native StyleSheet.
 * Dark-only. All colors are hex/rgba (RN doesn't support oklch).
 */
export const colors = {
  background: '#000000',
  surface: '#0a0a0a',
  surfaceElevated: '#141414',

  textPrimary: '#ffffff',
  textSecondary: 'rgba(255,255,255,0.8)',
  textMuted: 'rgba(255,255,255,0.5)',
  textFaint: 'rgba(255,255,255,0.3)',

  border: 'rgba(255,255,255,0.1)',
  borderStrong: 'rgba(255,255,255,0.2)',

  accent: '#ffffff',
  amber: '#f59e0b',
  violet: '#8b5cf6',
  emerald: '#10b981',
  crimson: '#d4183d',
} as const;

export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  '2xl': 32,
  '3xl': 48,
  '4xl': 64,
} as const;

export const radius = {
  sm: 6,
  md: 10,
  lg: 16,
  xl: 24,
  full: 999,
} as const;

export const typography = {
  displayLarge: { fontSize: 32, fontWeight: '300' as const, letterSpacing: 2 },
  display:      { fontSize: 24, fontWeight: '400' as const, letterSpacing: 1.5 },
  title:        { fontSize: 18, fontWeight: '500' as const, letterSpacing: 0.5 },
  body:         { fontSize: 15, fontWeight: '400' as const, letterSpacing: 0.2 },
  caption:      { fontSize: 12, fontWeight: '400' as const, letterSpacing: 1, textTransform: 'uppercase' as const },
  micro:        { fontSize: 10, fontWeight: '500' as const, letterSpacing: 2, textTransform: 'uppercase' as const },
} as const;
