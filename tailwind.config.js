/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        display: ['"Fredoka"', 'system-ui', 'sans-serif'],
        sans: ['"Nunito"', 'system-ui', 'sans-serif'],
      },
      colors: {
        felt: {
          50: '#effaf3',
          100: '#d8f3e3',
          200: '#b3e7c9',
          300: '#80d3a8',
          400: '#48b885',
          500: '#229c6a',
          600: '#157d54',
          700: '#126345',
          800: '#114f39',
          900: '#0e4231',
          950: '#052519',
        },
        gold: {
          50: '#fffbeb',
          100: '#fff3c4',
          200: '#fce588',
          300: '#fadb5f',
          400: '#f7c948',
          500: '#efad1f',
          600: '#d98806',
          700: '#b66308',
          800: '#94480d',
          900: '#7a3a0f',
        },
        lucky: {
          50: '#fff1f2',
          100: '#ffe4e6',
          200: '#fecdd3',
          300: '#fda4af',
          400: '#fb6f84',
          500: '#f43f6a',
          600: '#e11d4f',
          700: '#be1142',
          800: '#9f1240',
          900: '#881338',
        },
      },
      boxShadow: {
        coin: 'inset 0 -3px 4px rgba(120,72,0,0.45), inset 0 3px 3px rgba(255,255,255,0.6), 0 3px 6px rgba(0,0,0,0.25)',
        dice: '0 10px 25px rgba(0,0,0,0.28), inset 0 -6px 12px rgba(0,0,0,0.12)',
        pop: '0 8px 24px rgba(0,0,0,0.18)',
      },
      keyframes: {
        popIn: {
          '0%': { transform: 'scale(0) rotate(-25deg)', opacity: '0' },
          '70%': { transform: 'scale(1.15) rotate(6deg)', opacity: '1' },
          '100%': { transform: 'scale(1) rotate(0)', opacity: '1' },
        },
        floatUp: {
          '0%': { transform: 'translateY(6px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        shake: {
          '0%,100%': { transform: 'translateX(0)' },
          '20%': { transform: 'translateX(-6px)' },
          '40%': { transform: 'translateX(6px)' },
          '60%': { transform: 'translateX(-4px)' },
          '80%': { transform: 'translateX(4px)' },
        },
        glow: {
          '0%,100%': { boxShadow: '0 0 0 0 rgba(247,201,72,0.55)' },
          '50%': { boxShadow: '0 0 0 12px rgba(247,201,72,0)' },
        },
        confettiFall: {
          '0%': { transform: 'translateY(-10vh) rotate(0)', opacity: '1' },
          '100%': { transform: 'translateY(110vh) rotate(720deg)', opacity: '0.9' },
        },
        slideInRight: {
          '0%': { transform: 'translateX(40px)', opacity: '0' },
          '100%': { transform: 'translateX(0)', opacity: '1' },
        },
        bannerIn: {
          '0%': { transform: 'translateY(-30px) scale(0.9)', opacity: '0' },
          '60%': { transform: 'translateY(6px) scale(1.03)', opacity: '1' },
          '100%': { transform: 'translateY(0) scale(1)', opacity: '1' },
        },
      },
      animation: {
        popIn: 'popIn 0.4s cubic-bezier(0.34,1.56,0.64,1) both',
        floatUp: 'floatUp 0.3s ease-out both',
        shake: 'shake 0.5s ease-in-out',
        glow: 'glow 1.6s ease-in-out infinite',
        confetti: 'confettiFall linear forwards',
        slideInRight: 'slideInRight 0.4s ease-out both',
        bannerIn: 'bannerIn 0.5s cubic-bezier(0.34,1.56,0.64,1) both',
      },
    },
  },
  plugins: [],
};
