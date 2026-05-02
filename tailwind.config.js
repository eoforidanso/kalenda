/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['Playfair Display', 'Georgia', 'serif'],
      },
      colors: {
        teal: {
          50:  '#f0fafa',
          100: '#cceeee',
          200: '#a8dada',
          300: '#7dcece',
          400: '#5bbfbf',
          500: '#4db6ac',
          600: '#3a9e9e',
          700: '#2d8080',
          800: '#1f6060',
          900: '#144040',
        },
        event: {
          teal:    '#a8dada',
          pink:    '#f5b8b8',
          sage:    '#b8d9b0',
          lavender:'#c8b8e8',
          coral:   '#e17055',
          amber:   '#f5d4a0',
        },
        cream: {
          50: '#fdfaf5',
          100: '#faf3e7',
          200: '#f5e6cc',
          300: '#edd5a8',
        },
        slate: {
          850: '#1a2234',
        }
      },
      animation: {
        'float': 'float 6s ease-in-out infinite',
        'slide-up': 'slideUp 0.6s ease-out',
        'fade-in': 'fadeIn 0.8s ease-out',
        'shimmer': 'shimmer 2s linear infinite',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-12px)' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(30px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
      },
      backdropBlur: {
        xs: '2px',
      },
    },
  },
  plugins: [],
}

