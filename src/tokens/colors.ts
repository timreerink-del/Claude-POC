/**
 * Peppercorn Design System — Color Tokens
 * Source: Figma Peppercorn Colors (VariableCollectionId:33:3413)
 * Post-WCAG AA audit values
 */

export const colors = {
  // Core
  primary: '#0058E0',
  primaryPressed: '#0041AB',
  primaryContrast: '#0A2A57',
  primaryForeground: '#FFFFFF',

  background: '#FDFDFC',
  foreground: '#19160D',

  card: '#FFFFFF',
  cardForeground: '#19160D',

  secondary: '#F7F5F0',
  secondaryForeground: '#19160D',

  tertiary: '#EEF6FF',

  muted: '#F7F5F0',
  mutedForeground: '#555048',

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

  // Interactive States
  hover: '#0558D6',
  focusRing: '#4D90FE',
  disabled: '#E8E5DC',

  // Success
  successSurface: '#C6F6D5',
  successText: '#166534',
  successIcon: '#16A34A',

  // Error
  errorSurface: '#FFD8D8',
  errorText: '#991B1B',
  errorIcon: '#DC2626',

  // Warning
  warningSurface: '#FFECB3',
  warningText: '#92400E',
  warningIcon: '#D97706',

  // Info
  infoSurface: '#D6E4FF',
  infoText: '#1E40AF',
  infoIcon: '#2563EB',

  // Gradient Primitives
  gradientBlue: '#D6E4FF',
  gradientPink: '#FFD6E7',
  gradientCoral: '#FFD8D8',
  gradientMint: '#C6F6D5',
  gradientYellow: '#FFECB3',
  gradientLila: '#EBE0FF',

  white: '#FFFFFF',
} as const;
