/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        velorix: {
          dark: {
            DEFAULT: '#121212',
            card: '#1A1A1A',
            muted: '#2A2A2A',
            border: '#333333'
          },
          red: {
            DEFAULT: '#D32F2F',
            hover: '#FF1744',
            light: '#FFEBEE'
          },
          light: {
            DEFAULT: '#FCFCFC',
            bg: '#F5F5F7',
            card: '#FFFFFF',
            border: '#E5E5E5'
          }
        }
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        display: ['Outfit', 'sans-serif'],
      },
      boxShadow: {
        'premium': '0 10px 30px -10px rgba(0, 0, 0, 0.05)',
        'premium-hover': '0 20px 40px -15px rgba(211, 47, 47, 0.1)',
        'glass': '0 8px 32px 0 rgba(0, 0, 0, 0.04)',
      },
      backdropBlur: {
        'xs': '2px',
      }
    },
  },
  plugins: [],
}
