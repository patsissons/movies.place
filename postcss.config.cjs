/** @type {{plugins: import('postcss').AcceptedPlugin[]}} */
module.exports = {
  plugins: [
    require('postcss-preset-env'),
    require('postcss-import'),
    require('tailwindcss'),
    require('autoprefixer'),
  ],
}
