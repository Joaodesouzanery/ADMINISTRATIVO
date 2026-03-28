/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        navy: {
          DEFAULT: '#0D1B3E',
          50:  '#E8EBF3',
          100: '#C5CCDF',
          200: '#9AAAC8',
          300: '#6E87B1',
          400: '#4E6B9E',
          500: '#2E4F8B',
          600: '#1F3872',
          700: '#162C5C',
          800: '#0D1B3E',
          900: '#070E22',
        },
        cyan: {
          DEFAULT: '#64D4E8',
          50:  '#F0FBFD',
          100: '#D6F4F9',
          200: '#AAEAF4',
          300: '#7DDEEE',
          400: '#64D4E8',
          500: '#3DC5DC',
          600: '#1AAFC8',
          700: '#1490A8',
          800: '#0E6D7F',
          900: '#084A56',
        },
        surface: {
          DEFAULT: '#EBF6FA',
          secondary: '#F0F9FB',
          card: '#F7FCFD',
        },
        atlantico: {
          success: '#22C55E',
          warning: '#F59E0B',
          danger:  '#EF4444',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        card:    '0 1px 3px rgba(13,27,62,0.08), 0 1px 2px rgba(13,27,62,0.04)',
        sidebar: '2px 0 12px rgba(13,27,62,0.18)',
        modal:   '0 20px 60px rgba(13,27,62,0.20)',
        kpi:     '0 4px 16px rgba(100,212,232,0.15)',
      },
    },
  },
  plugins: [],
}
