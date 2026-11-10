/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['DM Sans', 'sans-serif'],
        display: ['Manrope', 'sans-serif'],
      },
      colors: {
        brand: '#6658d3',
        ink: '#202235',
        canvas: '#f7f8fc',
      },
      boxShadow: {
        card: '0 12px 40px rgba(37, 40, 75, .06)',
      },
    },
  },
  plugins: [],
}