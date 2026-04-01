/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        relief: {
          primary: '#e11d48', // rose-600
          secondary: '#4b5563', // gray-600
          accent: '#10b981' // emerald-500
        }
      },
      fontFamily: {
        display: ['Outfit', 'sans-serif'],
        main: ['Inter', 'sans-serif'],
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'glow': 'glow 2.5s ease-in-out infinite',
        'float': 'float 3.5s ease-in-out infinite',
        'slideIn': 'slideIn 0.6s ease-out',
        'fadeIn': 'fadeIn 0.8s ease-out',
      },
      keyframes: {
        glow: {
          '0%, 100%': { opacity: '1', boxShadow: '0 0 20px rgba(225, 29, 72, 0.3)' },
          '50%': { opacity: '0.8', boxShadow: '0 0 40px rgba(225, 29, 72, 0.5)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        slideIn: {
          '0%': { opacity: '0', transform: 'translateX(-20px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
      },
      backdropBlur: {
        xs: '2px',
      },
      boxShadow: {
        'glow-rose': '0 0 40px rgba(220, 38, 38, 0.3)',
        'glow-rose-lg': '0 0 60px rgba(220, 38, 38, 0.4)',
        'glow-red': '0 0 40px rgba(220, 38, 38, 0.3)',
        'glow-red-lg': '0 0 60px rgba(220, 38, 38, 0.4)',
        'inner-glow': 'inset 0 0 20px rgba(220, 38, 38, 0.05)',
      },
      gradientColorStops: {
        'gradient-rose': 'var(--gradient-rose)',
      }
    },
  },
  plugins: [],
}
