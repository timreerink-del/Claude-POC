/**
 * Peppercorn Design System — Complete Token Set
 * Source: Figma DMP x Claude POC (amLMUl0QJ1LCFErsiE4hkg)
 * Post-WCAG AA audit values
 */

// ── Colors ──────────────────────────────────────────────
export const colors = {
  // Core brand
  primary: '#0058E0',
  primaryPressed: '#0041AB',
  primaryContrast: '#0A2A57',
  primaryForeground: '#FFFFFF',

  // Surfaces
  background: '#FAF9F6',
  foreground: '#19160D',
  card: '#FFFFFF',
  cardForeground: '#19160D',
  secondary: '#F7F5F0',
  secondaryForeground: '#19160D',
  tertiary: '#EEF6FF',
  muted: '#F7F5F0',
  mutedForeground: '#555048',

  // Semantic
  destructive: '#DC2626',
  border: '#888276',
  input: '#E8E5DC',
  ring: '#4D90FE',

  // Text
  text: '#19160D',
  textMuted: '#555048',
  textOnPrimary: '#FFFFFF',

  // Icon
  icon: '#726F68',

  // Interactive
  hover: '#0558D6',
  focusRing: '#4D90FE',
  disabled: '#E8E5DC',

  // Status: Success
  successSurface: '#C6F6D5',
  successText: '#166534',
  successIcon: '#16A34A',

  // Status: Error
  errorSurface: '#FFD8D8',
  errorText: '#991B1B',
  errorIcon: '#DC2626',

  // Status: Warning
  warningSurface: '#FFECB3',
  warningText: '#92400E',
  warningIcon: '#D97706',

  // Status: Info
  infoSurface: '#D6E4FF',
  infoText: '#1E40AF',
  infoIcon: '#2563EB',

  // Gradient primitives
  gradientBlue: '#D6E4FF',
  gradientPink: '#FFD6E7',
  gradientCoral: '#FFD8D8',
  gradientMint: '#C6F6D5',
  gradientYellow: '#FFECB3',
  gradientLila: '#EBE0FF',

  white: '#FFFFFF',
  transparent: 'transparent',
} as const;

export type ColorToken = keyof typeof colors;

// ── Spacing ─────────────────────────────────────────────
export const spacing = {
  xxs: 4,
  xs: 8,
  s: 12,
  m: 16,
  l: 20,
  xl: 24,
  xxl: 32,
} as const;

export type SpacingToken = keyof typeof spacing;

// ── Border Radius ───────────────────────────────────────
export const radius = {
  s: 8,
  m: 12,
  l: 16,
  xl: 20,
  pill: 999,
} as const;

export type RadiusToken = keyof typeof radius;

// ── Typography ──────────────────────────────────────────
export const fontFamilies = {
  regular: 'NotoSans_400Regular',
  medium: 'NotoSans_500Medium',
  semibold: 'NotoSans_600SemiBold',
} as const;

export const typeScale = {
  xs:   { fontSize: 10, lineHeight: 15 },
  sm:   { fontSize: 13, lineHeight: 20 },
  base: { fontSize: 15, lineHeight: 23 },
  lg:   { fontSize: 18, lineHeight: 27 },
  xl:   { fontSize: 22, lineHeight: 33 },
  '2xl': { fontSize: 26, lineHeight: 39 },
  '3xl': { fontSize: 31, lineHeight: 47 },
  '4xl': { fontSize: 45, lineHeight: 68 },
} as const;

export type TypeScaleToken = keyof typeof typeScale;

// ── Typography Presets ─────────────────────────────────
// Change one preset → every screen updates.
// Headings: medium weight, Abyss blue (#0A2A57)
// Body/labels: inherit color from parent (set explicitly where needed)

export const typography = {
  // ─ Headings (medium · abyss blue) ─
  h1:  { fontFamily: fontFamilies.medium, ...typeScale['3xl'], color: '#0A2A57' },
  h2:  { fontFamily: fontFamilies.medium, ...typeScale['2xl'], color: '#0A2A57' },
  h3:  { fontFamily: fontFamilies.medium, ...typeScale.xl,     color: '#0A2A57' },
  h4:  { fontFamily: fontFamilies.medium, ...typeScale.lg,     color: '#0A2A57' },
  h5:  { fontFamily: fontFamilies.medium, ...typeScale.base,   color: '#0A2A57' },

  // ─ Body ─
  body:      { fontFamily: fontFamilies.regular, ...typeScale.base },
  bodySmall: { fontFamily: fontFamilies.regular, ...typeScale.sm },

  // ─ Labels (medium weight) ─
  label:      { fontFamily: fontFamilies.medium, ...typeScale.sm },
  labelSmall: { fontFamily: fontFamilies.medium, ...typeScale.xs },

  // ─ Emphasis (semibold — rates, values, badges) ─
  emphasis:      { fontFamily: fontFamilies.semibold, ...typeScale.base },
  emphasisLarge: { fontFamily: fontFamilies.semibold, ...typeScale.lg },
  emphasisSmall: { fontFamily: fontFamilies.semibold, ...typeScale.sm },

  // ─ Caption ─
  caption: { fontFamily: fontFamilies.regular, ...typeScale.xs },

  // ─ Navigation ─
  nav: { fontFamily: fontFamilies.medium, ...typeScale.xs },
} as const;

export type TypographyToken = keyof typeof typography;

// ── Shadows (React Native style objects) ────────────────
export const shadows = {
  card: {
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  dropdown: {
    shadowColor: '#0A2A57',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.12,
    shadowRadius: 24,
    elevation: 8,
  },
  modal: {
    shadowColor: '#0A2A57',
    shadowOffset: { width: 0, height: 16 },
    shadowOpacity: 0.18,
    shadowRadius: 48,
    elevation: 16,
  },
} as const;

export type ShadowToken = keyof typeof shadows;

// ── Sizes ───────────────────────────────────────────────
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

// ── Gradients (for expo-linear-gradient) ────────────────
export const gradients = {
  primaryBrand: {
    colors: ['#D6E4FF', '#EBE0FF'] as readonly string[],
    start: { x: 0, y: 0 },
    end: { x: 1, y: 1 },
  },
  cardNeutral: {
    colors: ['#F7F5F0', '#FFFFFF'] as readonly string[],
    start: { x: 0, y: 0 },
    end: { x: 0, y: 1 },
  },
  cardHappy: {
    colors: ['#D6E4FF', '#FFD6E7', '#EBE0FF'] as readonly string[],
    locations: [0, 0.5, 1] as readonly number[],
    start: { x: 0, y: 0 },
    end: { x: 1, y: 1 },
  },
  heroBlob: {
    colors: ['#D6E4FF', '#EBE0FF', 'transparent'] as readonly string[],
    locations: [0, 0.5, 1] as readonly number[],
  },
  primaryButton: {
    colors: ['#0058E0', '#0041AB'] as readonly string[],
    start: { x: 0, y: 0 },
    end: { x: 1, y: 0 },
  },
} as const;
