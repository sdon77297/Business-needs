/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        obsidian: {
          950: '#05080E',
          900: '#080C14',
          850: '#0D1424',
          800: '#131C31',
          700: '#1D2A48',
          600: '#2A3B63',
        },
        gold: {
          50: '#FCF9F2',
          100: '#F7F2E2',
          200: '#EFE3C3',
          300: '#E4D1A0',
          400: '#D5BC7C',
          500: '#C5A880', // Primary Champagne Gold
          600: '#A9895B',
          700: '#8A6D44',
          800: '#6C5434',
        },
        platinum: {
          100: '#F1F5F9',
          200: '#E2E8F0',
          300: '#CBD5E1',
          400: '#94A3B8',
          500: '#64748B',
        }
      },
      fontFamily: {
        serif: ['"Cinzel"', '"Playfair Display"', 'Georgia', 'serif'],
        sans: ['"Plus Jakarta Sans"', 'Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'luxury': '0 10px 30px -10px rgba(0, 0, 0, 0.7), 0 0 1px 1px rgba(197, 168, 128, 0.15)',
        'gold-glow': '0 0 25px -5px rgba(197, 168, 128, 0.3)',
      }
    },
  },
  plugins: [],
}
