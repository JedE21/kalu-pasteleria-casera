import type { Config } from 'tailwindcss';

export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        crema: '#fff8ef',
        lavanda: '#e9d8f0',
        lila: '#c9a4dc',
        morado: '#7d4b98',
        ciruela: '#4c2a57',
        chocolate: '#4b332b',
        cacao: '#2b1c19',
        dorado: '#c79a48',
        rosa: '#d98bab',
      },
      fontFamily: {
        display: ['"Cormorant Garamond"', 'Georgia', 'serif'],
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        glow: '0 24px 80px rgba(125, 75, 152, 0.18)',
      },
    },
  },
  plugins: [],
} satisfies Config;
