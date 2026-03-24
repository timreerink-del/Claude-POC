/**
 * Peppercorn Design System — Gradient Tokens
 * Extracted from Figma paint styles
 * For use with expo-linear-gradient <LinearGradient />
 */

export const gradients = {
  /** Primary brand gradient: blue → lila (diagonal) */
  primaryBrand: {
    colors: ['#D6E4FF', '#EBE0FF'] as const,
    start: { x: 0, y: 0 },
    end: { x: 1, y: 1 },
  },

  /** Neutral card background: secondary → white (top to bottom) */
  cardNeutral: {
    colors: ['#F7F5F0', '#FFFFFF'] as const,
    start: { x: 0, y: 0 },
    end: { x: 0, y: 1 },
  },

  /** Happy/vibrant card: blue → pink → lila (diagonal) */
  cardHappy: {
    colors: ['#D6E4FF', '#FFD6E7', '#EBE0FF'] as const,
    locations: [0, 0.5, 1] as const,
    start: { x: 0, y: 0 },
    end: { x: 1, y: 1 },
  },

  /** Hero section radial blob: blue → lila → transparent */
  heroBlob: {
    colors: ['#D6E4FF', '#EBE0FF', 'transparent'] as const,
    locations: [0, 0.5, 1] as const,
  },

  /** Shadow color used across elevation levels */
  shadowColor: 'rgba(10, 42, 87, 0.08)',
} as const;

export const shadows = {
  card: {
    shadowColor: '#0A2A57',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
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
