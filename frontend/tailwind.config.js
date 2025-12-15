/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'vinilo-red': '#8B1A1A', 
        'vinilo-black': '#1a1a1a',
        'vinilo-gray': '#f4f4f4',
      },
      fontFamily: {
        serif: ['"Noto Serif"', 'serif'], 
        sans: ['"Inter"', 'sans-serif'],
      },
      keyframes: {
        heartBeat: {
          '0%, 100%': { transform: 'scale(1)' },
          '25%': { transform: 'scale(1.3)' },
          '50%': { transform: 'scale(0.9)' },
          '75%': { transform: 'scale(1.1)' },
        }
      },
      animation: {
        'heart-beat': 'heartBeat 0.4s ease-in-out',
      }
    },
  },
  plugins: [],
}