/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        bitcoin: '#f7931a',
        'bitcoin-dark': '#e8851a',
        orange: {
          bitcoin: '#f7931a'
        }
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui'],
      },
      animation: {
        'bitcoin-pulse': 'bitcoin-pulse 2s ease-in-out infinite',
        'slide-up': 'slide-up 0.5s ease-out forwards',
        'fade-in': 'fade-in 0.3s ease-in forwards'
      },
      keyframes: {
        'bitcoin-pulse': {
          '0%, 100%': { 
            transform: 'scale(1)',
            opacity: '1'
          },
          '50%': { 
            transform: 'scale(1.05)',
            opacity: '0.8'
          }
        },
        'slide-up': {
          'from': {
            opacity: '0',
            transform: 'translateY(20px)'
          },
          'to': {
            opacity: '1',
            transform: 'translateY(0)'
          }
        },
        'fade-in': {
          'from': { 
            opacity: '0' 
          },
          'to': { 
            opacity: '1' 
          }
        }
      }
    },
  },
  plugins: [],
}