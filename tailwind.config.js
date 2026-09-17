/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        romantic: {
          50: '#fff5f6',
          100: '#ffe9ec',
          200: '#fed3d9',
          300: '#fba9b5',
          400: '#f47185',
          500: '#e11d48',
          600: '#be123c',
          700: '#9f1239',
          800: '#881337',
          900: '#4c0519',
        },
        cream: {
          50: '#fdfcf9',
          100: '#f9f6f0',
          200: '#f3ece0',
          300: '#e8dcce',
          400: '#d7c4af',
        }
      },
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', '"Quicksand"', 'system-ui', '-apple-system', 'sans-serif'],
        cute: ['"Quicksand"', '"Plus Jakarta Sans"', 'sans-serif'],
        serif: ['"Playfair Display"', 'Georgia', 'serif'],
        handwriting: ['"Dancing Script"', 'cursive'],
      },
      animation: {
        'float-slow': 'float 8s ease-in-out infinite',
        'pulse-subtle': 'pulseSubtle 3s ease-in-out infinite',
        'heartbeat': 'heartbeat 1.4s ease-in-out infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-8px)' },
        },
        pulseSubtle: {
          '0%, 100%': { opacity: '0.85', transform: 'scale(1)' },
          '50%': { opacity: '1', transform: 'scale(1.02)' },
        },
        heartbeat: {
          '0%, 100%': { transform: 'scale(1)' },
          '14%': { transform: 'scale(1.08)' },
          '28%': { transform: 'scale(1)' },
          '42%': { transform: 'scale(1.12)' },
          '70%': { transform: 'scale(1)' },
        }
      },
      boxShadow: {
        'stationery': '0 2px 8px -2px rgba(40, 15, 20, 0.05), 0 16px 36px -8px rgba(50, 15, 25, 0.12)',
        'stationery-deep': '0 4px 12px -2px rgba(40, 15, 20, 0.08), 0 24px 48px -12px rgba(50, 15, 25, 0.2)',
        'btn-rose': '0 4px 14px -2px rgba(190, 18, 60, 0.32)',
        'subtle': '0 1px 3px rgba(0, 0, 0, 0.04), 0 1px 2px rgba(0, 0, 0, 0.02)',
      }
    },
  },
  plugins: [],
}

