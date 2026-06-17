/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        nursery: {
          50: '#f6f8f5',
          100: '#ecf1eb',
          200: '#d3decb',
          300: '#b9cbb0',
          400: '#9caf88',
          500: '#9caf88', // Sage Green
          600: '#708258', // Soft Olive
          650: '#708258',
          700: '#576644',
          800: '#424d33',
          900: '#2c302e',
          950: '#2c302e',
        },
        accent: {
          light: '#fbf9f1', // Cream background
          sand: '#e8e4d3',
          terracotta: '#708258', // Soft Olive accent
          terracotta_dark: '#576644',
        },
        brand: {
          sage: '#9CAF88',
          olive: '#708258',
          cream: '#FBF9F1',
          charcoal: '#2C302E',
        }
      },
      fontFamily: {
        sans: ['Outfit', 'Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
