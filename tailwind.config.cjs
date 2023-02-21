// const { fontFamily } = require('tailwindcss/defaultTheme')

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{html,js,svelte,ts}'],
  daisyui: {
    themes: ['dark', 'light'],
  },
  darkMode: 'class',
  plugins: [require('daisyui')],
  theme: {
    extend: {
      screens: {
        '2xl': '1600px',
      },
    },
  },
}
