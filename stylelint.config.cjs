/** @type {import('stylelint').Config} */
module.exports = {
  extends: [
    'stylelint-config-standard',
    'stylelint-config-recommended-scss',
    'stylelint-config-tailwindcss',
  ],
  plugins: ['stylelint-order'],
  customSyntax: 'postcss-scss',
  rules: {
    // ignore tailwind at rules
    'scss/at-rule-no-unknown': [
      true,
      {
        ignoreAtRules: [
          'tailwind',
          'apply',
          'variants',
          'responsive',
          'screen',
        ],
      },
    ],

    // autoformat properties in a consistent order
    'order/properties-alphabetical-order': true,
  },
  overrides: [
    {
      files: ['*.html', '*.svelte'],
      customSyntax: 'postcss-html',
    },
  ],
}
