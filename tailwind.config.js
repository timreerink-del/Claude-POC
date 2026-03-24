/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./App.{js,jsx,ts,tsx}', './src/**/*.{js,jsx,ts,tsx}'],
  presets: [require('nativewind/preset')],
  theme: {
    extend: {
      colors: {
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

        // States
        disabled: '#E8E5DC',
        hover: '#0558D6',
        focusRing: '#4D90FE',

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

        // Gradient primitives
        gradientBlue: '#D6E4FF',
        gradientPink: '#FFD6E7',
        gradientCoral: '#FFD8D8',
        gradientMint: '#C6F6D5',
        gradientYellow: '#FFECB3',
        gradientLila: '#EBE0FF',

        white: '#FFFFFF',
      },
      spacing: {
        xxs: '4px',
        xs: '8px',
        s: '12px',
        m: '16px',
        l: '20px',
        xl: '24px',
        xxl: '32px',
      },
      borderRadius: {
        sm: '8px',
        DEFAULT: '12px',
        md: '12px',
        lg: '16px',
        xl: '20px',
        full: '999px',
      },
      fontSize: {
        xs: ['10px', { lineHeight: '15px' }],
        sm: ['13px', { lineHeight: '20px' }],
        base: ['15px', { lineHeight: '23px' }],
        lg: ['18px', { lineHeight: '27px' }],
        xl: ['22px', { lineHeight: '33px' }],
        '2xl': ['26px', { lineHeight: '39px' }],
        '3xl': ['31px', { lineHeight: '47px' }],
        '4xl': ['45px', { lineHeight: '68px' }],
      },
      fontFamily: {
        sans: ['NotoSans_400Regular', '"Noto Sans"', 'sans-serif'],
        'sans-medium': ['NotoSans_500Medium', '"Noto Sans"', 'sans-serif'],
        'sans-semibold': ['NotoSans_600SemiBold', '"Noto Sans"', 'sans-serif'],
      },
      boxShadow: {
        card: '0 2px 8px rgba(10, 42, 87, 0.08)',
        dropdown: '0 8px 24px rgba(10, 42, 87, 0.12)',
        modal: '0 16px 48px rgba(10, 42, 87, 0.18)',
      },
    },
  },
  plugins: [],
};
