import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./src/**/*.{ts,tsx}', './pages/**/*.{ts,tsx}', './components/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        bank: {
          50: '#eaf2ff',
          100: '#cfe1ff',
          200: '#a6c8ff',
          300: '#6ea4ff',
          400: '#376ff2',
          500: '#163f9f',
          600: '#0d2e73',
          700: '#0a245b',
          800: '#081d48',
          900: '#061634'
        },
        fraud: {
          safe: '#16a34a',
          warn: '#f59e0b',
          step: '#d97706',
          block: '#dc2626'
        }
      },
      boxShadow: {
        glow: '0 0 0 1px rgba(84, 125, 255, 0.15), 0 18px 50px rgba(6, 22, 52, 0.28)'
      },
      backgroundImage: {
        'bank-gradient': 'linear-gradient(135deg, #061634 0%, #0a245b 55%, #163f9f 100%)'
      }
    }
  },
  plugins: []
};

export default config;
