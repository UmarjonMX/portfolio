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
        background: '#FAF8F4',
        'background-dark': '#1C1C1D',
        'primary-text': '#1C1C1C',
        'primary-text-dark': '#FAFAFA',
        accent: '#E07A5F',
        'card-bg-light': '#FFFFFF',
        'card-bg-dark': '#242426',
        'border-light': 'rgba(28, 28, 28, 0.1)',
        'border-dark': 'rgba(250, 250, 250, 0.1)',
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
