const plugin = require('tailwindcss/plugin')

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{html,js,svelte,ts}'],
  daisyui: {
    themes: ['dark', 'light'],
  },
  darkMode: 'class',
  plugins: [
    require('tailwindcss-animate'),
    // hack to address tailwindcss-animate class name overlap
    // see: https://github.com/jamiebuilds/tailwindcss-animate/issues/13
    plugin(({ matchUtilities, theme }) => {
      matchUtilities(
        { 'animate-duration': (value) => ({ animationDuration: value }) },
        {
          values: Object.fromEntries(
            Object.entries(theme('animationDuration')).filter(
              ([key]) => key !== 'DEFAULT',
            ),
          ),
        },
      )

      matchUtilities(
        { 'animate-delay': (value) => ({ animationDelay: value }) },
        { values: theme('animationDelay') },
      )
    }),
    require('daisyui'),
  ],
  theme: {
    extend: {
      screens: {
        '2xl': '1600px',
      },
    },
  },
  safelist: [
    ...Array.from({ length: 100 }).map(
      (_, i) => `animate-delay-[${(i % 10) * 25}ms]`,
    ),
  ],
}
