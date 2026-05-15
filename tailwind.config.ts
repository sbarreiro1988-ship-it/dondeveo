import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        dv: {
          bg: '#111111',
          card: '#1c1c1c',
          'card-hover': '#252525',
          accent: '#00d4aa',
          'accent-dark': '#00b894',
          border: 'rgba(255,255,255,0.08)',
          muted: '#8a8a9a',
        },
      },
      backgroundImage: {
        'hero-gradient': 'linear-gradient(to right, #0a0a14 35%, transparent 70%)',
        'card-gradient': 'linear-gradient(to top, rgba(0,0,0,0.9) 0%, rgba(0,0,0,0.4) 50%, transparent 100%)',
      },
      animation: {
        'pulse-live': 'pulse 1.5s cubic-bezier(0.4,0,0.6,1) infinite',
        'fade-in': 'fadeIn 0.4s ease-in-out',
        'slide-up': 'slideUp 0.3s ease-out',
      },
      keyframes: {
        fadeIn: { '0%': { opacity: '0' }, '100%': { opacity: '1' } },
        slideUp: { '0%': { opacity: '0', transform: 'translateY(12px)' }, '100%': { opacity: '1', transform: 'translateY(0)' } },
      },
    },
  },
  plugins: [],
};

export default config;
