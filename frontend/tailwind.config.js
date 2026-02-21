/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        risk: {
          normal: '#22C55E',
          caution: '#EAB308',
          warning: '#F97316',
          danger: '#EF4444',
        },
      },
    },
  },
  plugins: [],
};
