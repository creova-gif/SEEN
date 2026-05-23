// SEEN by CREOVA — visual design tokens
// Ported from src/styles/theme.css + the dark Tailwind palette used across screens.

export const colors = {
  background: '#000000',
  backgroundDeep: '#000000',
  surface: 'rgba(255,255,255,0.05)',
  surfaceElevated: 'rgba(255,255,255,0.08)',
  surfaceGlass: 'rgba(0,0,0,0.40)',
  border: 'rgba(255,255,255,0.10)',
  borderSubtle: 'rgba(255,255,255,0.05)',
  borderStrong: 'rgba(255,255,255,0.20)',

  textPrimary: '#ffffff',
  textHigh: 'rgba(255,255,255,0.95)',
  textSecondary: 'rgba(255,255,255,0.70)',
  textMuted: 'rgba(255,255,255,0.60)',
  textFaint: 'rgba(255,255,255,0.40)',
  textWhisper: 'rgba(255,255,255,0.30)',

  // Brand accents (used sparingly per the zip aesthetic)
  violet: '#a78bfa',
  violetDeep: '#7c3aed',
  amber: '#f59e0b',
  emerald: '#10b981',
  rose: '#fb7185',
  blue: '#60a5fa',

  // Semantic tokens ported from the web theme (theme.css)
  primary: '#ffffff',
  primaryForeground: '#030213',
  accent: 'rgba(255,255,255,0.10)',
  accentForeground: '#ffffff',
  destructive: '#d4183d',
  destructiveForeground: '#ffffff',
  muted: 'rgba(255,255,255,0.06)',
  mutedForeground: 'rgba(255,255,255,0.65)',

  // Type-aware accents matched to zip
  music: '#c4b5fd',
  story: '#fbbf24',
  film: '#6ee7b7',
  collection: '#a78bfa',
  archive: '#fcd34d',

  // Gradients (rgba endpoints for LinearGradient)
  scrim: ['transparent', 'rgba(0,0,0,0.40)', '#000000'],
  splashGradient: ['rgba(76,29,149,0.20)', '#000000', 'rgba(30,58,138,0.20)'],
};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  '2xl': 28,
  '3xl': 40,
  '4xl': 56,
};

// Web theme uses --radius: 0.625rem (10px) with sm/md/lg/xl derived from it.
// We keep the looser mobile scale but add semantic aliases that mirror Tailwind.
export const radius = {
  sm: 6,
  md: 10,
  lg: 14,
  xl: 20,
  full: 999,
};

// Font family — Inter loaded via expo-font in _layout.tsx
export const fontFamily = {
  light:    'Inter_300Light',
  regular:  'Inter_400Regular',
  medium:   'Inter_500Medium',
  semibold: 'Inter_600SemiBold',
  fallback: 'System',
};

// Font weight tokens (mirror --font-weight-normal / --font-weight-medium)
export const fontWeight = {
  light:    '300' as const,
  regular:  '400' as const,
  medium:   '500' as const,
  semibold: '600' as const,
};

// Typography matched to the zip's Tailwind classes
export const typography = {
  // Brand wordmark
  brandLg: { fontSize: 36, letterSpacing: -0.5, fontWeight: '300' as const, fontFamily: fontFamily.light },
  brandMd: { fontSize: 18, letterSpacing: -0.3, fontWeight: '400' as const, fontFamily: fontFamily.regular },
  brandEyebrow: { fontSize: 10, letterSpacing: 3.6, fontWeight: '400' as const, fontFamily: fontFamily.regular, textTransform: 'uppercase' as const },

  // Headings (text-xl tracking-tight)
  h1: { fontSize: 28, letterSpacing: 0.2, fontWeight: '300' as const, fontFamily: fontFamily.light,   lineHeight: 34 },
  h2: { fontSize: 20, letterSpacing: -0.2, fontWeight: '400' as const, fontFamily: fontFamily.regular },
  h3: { fontSize: 16, letterSpacing: 0.2, fontWeight: '400' as const, fontFamily: fontFamily.regular, lineHeight: 22 },

  // Body
  body:   { fontSize: 14, letterSpacing: 0.2, lineHeight: 20, fontWeight: '400' as const, fontFamily: fontFamily.regular },
  bodySm: { fontSize: 12, letterSpacing: 0.2, lineHeight: 18, fontWeight: '400' as const, fontFamily: fontFamily.regular },

  // Micro labels — uppercase, wide tracking (matches text-[10px] tracking-widest uppercase)
  micro:   { fontSize: 10, letterSpacing: 2,   fontWeight: '500' as const, fontFamily: fontFamily.medium, textTransform: 'uppercase' as const },
  microSm: { fontSize: 9,  letterSpacing: 1.5, fontWeight: '500' as const, fontFamily: fontFamily.medium, textTransform: 'uppercase' as const },

  // CTAs (border button with wide tracking)
  cta: { fontSize: 13, letterSpacing: 2.5, fontWeight: '500' as const, fontFamily: fontFamily.medium, textTransform: 'uppercase' as const },
};

// iPhone-width mobile container used throughout zip (max-w-[428px])
export const layout = {
  containerMaxWidth: 428,
  headerHeight: 60,
  tabBarHeight: 80,
};
