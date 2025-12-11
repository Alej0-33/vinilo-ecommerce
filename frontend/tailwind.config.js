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
        sans:['"Inter"', 'sans-serif'],
      }
    },
  },
  plugins: [],
}