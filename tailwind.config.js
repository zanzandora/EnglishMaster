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
          redLight_fade: 'rgba(255,103,103,.55)',
          menuBtnHover: 'rgba(255,229,225,.45)',
        },
        secondary: {
          lavender: 'rgb(207,206,255)',
          lavender_fade: 'rgba(207,206,255,.35)',
          aquamarine: 'rgb(125,249,255)',
          paleturquoise: 'rgb(195,235,250)',
          male: '#2daae2',
          female: '#e71873',
        },
      },
    },
  },
  plugins: [],
};
