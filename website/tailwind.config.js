/** @type {import('tailwindcss').Config} */
export default {
  // Trigger rebuild
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        lavender: {
          light: '#E6D5F5',
          DEFAULT: '#C4A7E7',
          dark: '#9B7EBD'
        },
        mint: {
          light: '#D5F5E6',
          DEFAULT: '#A8E6CF',
          dark: '#7BC9A6'
        },
        peach: {
          light: '#FFE5D9',
          DEFAULT: '#FFB4A2',
          dark: '#FF8B7A'
        },
        sky: {
          light: '#D9E8FF',
          DEFAULT: '#A4CAFE',
          dark: '#6FA3E0'
        },
        rose: {
          light: '#FFD9E8',
          DEFAULT: '#FFB3D1',
          dark: '#FF8BB8'
        },
        cream: '#F5F5F0',
        slate: {
          light: '#9CA3AF',
          DEFAULT: '#6B7280',
        },
      },
      fontFamily: {
        sans: ['Nunito', 'sofia-sans', 'Quicksand', 'system-ui', 'sans-serif'],
      },
      animation: {
        'breathe': 'breathe 8s ease-in-out infinite',
        'wave': 'wave 6s ease-in-out infinite',
        'float': 'float 3s ease-in-out infinite',
        'blob': 'blob 7s infinite',
        'gradient-x': 'gradient-x 15s ease infinite',
      },
      keyframes: {
        breathe: {
          '0%, 100%': { transform: 'scale(1)' },
          '50%': { transform: 'scale(1.1)' },
        },
        wave: {
          '0%, 100%': { transform: 'translateX(0)' },
          '50%': { transform: 'translateX(-20px)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        blob: {
          '0%': { transform: 'translate(0px, 0px) scale(1)' },
          '33%': { transform: 'translate(30px, -50px) scale(1.1)' },
          '66%': { transform: 'translate(-20px, 20px) scale(0.9)' },
          '100%': { transform: 'translate(0px, 0px) scale(1)' },
        },
        'gradient-x': {
          '0%, 100%': {
            'background-size': '200% 200%',
            'background-position': 'left center'
          },
          '50%': {
            'background-size': '200% 200%',
            'background-position': 'right center'
          },
        },
      },
    },
  },
  plugins: [],
};
