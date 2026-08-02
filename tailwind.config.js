/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,ts}",
  ],
  theme: {
    extend: {
      colors: {
        accent: '#7342E2',
        dark: '#192837',
        pill: '#F2F2EE',
        sheet: '#CFC8C5',
      },
      fontFamily: {
        heading: ['"Helvetica Now Display Bold"', 'Helvetica', 'Arial', 'sans-serif'],
        body: ['Inter', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
