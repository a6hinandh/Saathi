import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./src/**/*.{ts,tsx}', './pages/**/*.{ts,tsx}', './components/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        bank: {
          50: '#f0f5fa',
          100: '#dbeafe',
          200: '#bfdbfe',
          300: '#93c5fd',
          400: '#3b82f6',
          500: '#1d4ed8',
          600: '#0B2545',
          700: '#134074',
          800: '#1E2A38',
          900: '#081220',
          accent: '#F37021', // Saffron
          gold: '#F4B41A' // Marigold
        },
        fraud: {
          safe: '#10b981',
          warn: '#f59e0b',
          step: '#d97706',
          block: '#ef4444'
        }
      },
      boxShadow: {
        glow: '0 0 0 1px rgba(243, 112, 33, 0.15), 0 18px 50px rgba(8, 18, 32, 0.28)'
      },
      backgroundImage: {
        'bank-gradient': 'linear-gradient(135deg, #081220 0%, #0B2545 55%, #134074 100%)'
      }
    }
  },
  plugins: []
};

export default config;
