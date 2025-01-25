/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './client/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#ff4742',
          light: '#fff',
          dark: '#1E40AF',
          redLight: '#ff6767',
          menuBtnHover: 'rgba(255,229,225,.45)',
        },
        secondary: {
          lavender: '#cfceff',
        },
      },
    },
  },
  plugins: [],
};
