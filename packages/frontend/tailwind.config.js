/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,jsx,ts,tsx}',
    './src/**/*.{js,jsx,ts,tsx}',
  ],
  presets: [require('nativewind/preset')],
  theme: {
    extend: {
      colors: {
        primary: '#DC2626',
        'primary-dark': '#B91C1C',
        'primary-darker': '#991B1B',
        canvas: '#FFFFFF',
        rose: '#FEE2E2',
        crimson: '#991B1B',
      },
    },
  },
  plugins: [],
};
