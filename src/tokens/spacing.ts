/**
 * Peppercorn Design System — Spacing, Radius & Size Tokens
 * Source: Figma Peppercorn Spacing (33:3454), Radius (33:3462), Sizes (33:3469)
 */

export const spacing = {
  xxs: 4,
  xs: 8,
  s: 12,
  m: 16,
  l: 20,
  xl: 24,
  xxl: 32,
} as const;

export const radius = {
  s: 8,
  m: 12,
  l: 16,
  xl: 20,
  pill: 999,
} as const;

export const sizes = {
  iconSm: 14,
  iconInline: 16,
  icon: 24,
  iconLg: 32,
  avatar: 40,
  touchMin: 44,
  btnH: 48,
  inputH: 56,
  cardW: 280,
  cardWWide: 320,
  cardThumb: 100,
  cardImage: 140,
  cardImageSm: 90,
  badgeH: 20,
} as const;

export const typography = {
  xs:   { fontSize: 10, lineHeight: 15 },
  sm:   { fontSize: 13, lineHeight: 20 },
  base: { fontSize: 15, lineHeight: 23 },
  lg:   { fontSize: 18, lineHeight: 27 },
  xl:   { fontSize: 22, lineHeight: 33 },
  '2xl': { fontSize: 26, lineHeight: 39 },
  '3xl': { fontSize: 31, lineHeight: 47 },
  '4xl': { fontSize: 45, lineHeight: 68 },
} as const;
