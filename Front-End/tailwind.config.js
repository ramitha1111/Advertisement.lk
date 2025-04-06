/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: '#F87B54',
      },
      fontFamily: {
        'red-hat': ['"Red Hat Display"', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
