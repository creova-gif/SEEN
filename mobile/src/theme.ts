/**
 * SEEN Mobile — Shared design tokens
 * Mirrors the web app's brand: black canvas, green accent glow, minimal type.
 */

export const colors = {
  black: '#000000',
  white: '#FFFFFF',
  whiteFaint: 'rgba(255,255,255,0.05)',
  whiteSoft: 'rgba(255,255,255,0.10)',
  whiteMedium: 'rgba(255,255,255,0.40)',
  whiteStrong: 'rgba(255,255,255,0.70)',
  green: 'rgb(76,175,80)',
  greenGlow: 'rgba(76,175,80,0.4)',
  greenFaint: 'rgba(76,175,80,0.15)',
  greenBorder: 'rgba(76,175,80,0.3)',
} as const;

export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
} as const;

export const radii = {
  sm: 8,
  md: 16,
  lg: 24,
  pill: 999,
} as const;
