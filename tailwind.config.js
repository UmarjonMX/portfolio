/** @type {import('tailwindcss').Config} */
export default {
  darkMode: "class",
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: '#F6F0F0',
        'background-dark': '#212121',
        'primary-text': '#1C1C1C', 
        'primary-text-dark': '#FAFAFA',
        accent: '#08CB00',
        'glass-light': 'rgba(246, 240, 240, 0.75)',
        'glass-dark': 'rgba(33, 33, 33, 0.75)',
        'border-light': 'rgba(0, 0, 0, 0.08)',
        'border-dark': 'rgba(255, 255, 255, 0.08)',
      },
      keyframes: {
        fadeInUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        }
      },
      animation: {
        fadeInUp: 'fadeInUp 0.7s ease-out forwards',
      },
      fontFamily: {
        sans: [
          'FunnelDisplay',
          'Avenis',
          'BaseNeue',
          'Inter',
          '-apple-system',
          'BlinkMacSystemFont',
          'sans-serif',
        ],
        funnel: ['FunnelDisplay', 'sans-serif'],
        avenis: ['Avenis', 'sans-serif'],
        base: ['BaseNeue', 'sans-serif'],
        martian: ['MartianMono', 'monospace'],
      },
    },
  },
  plugins: [],
}
