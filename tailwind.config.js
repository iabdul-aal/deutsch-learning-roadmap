/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        german: {
          gold: '#FFCC00',
          red: '#DD0000',
          black: '#000000',
          dark: '#0F172A',
          card: '#1E293B',
          accent: '#38BDF8',
          emerald: '#10B981'
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        arabic: ['Cairo', 'Noto Sans Arabic', 'sans-serif']
      }
    },
  },
  plugins: [],
}
