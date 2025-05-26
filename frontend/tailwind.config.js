export default {
  darkMode: ['class'],
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        background: '#f8fafc',
        surface: '#ffffff',
        primary: {
          DEFAULT: '#6366f1',
          hover: '#4f46e5',
          pressed: '#4338ca',
        },
        text: {
          DEFAULT: '#0f172a',
          muted: '#64748b',
        },
        border: '#e2e8f0',
        accent: '#14b8a6',
        secondary: {
          DEFAULT: '#71717a',
          hover: '#52525b',
          pressed: '#3f3f46',
        },
        warning: {
          DEFAULT: '#f59e0b',
          hover: '#d97706',
          pressed: '#b45309',
        },
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui'],
      },
      keyframes: {
        'caret-blink': {
          '0%,70%,100%': { opacity: '1' },
          '20%,50%': { opacity: '0' },
        },
      },
      animation: {
        'caret-blink': 'caret-blink 1.25s ease-out infinite',
      },
    },
  },
  plugins: [],
};
