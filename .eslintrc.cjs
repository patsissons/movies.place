/** @type {import('eslint').ESLint.ConfigData} */
module.exports = {
  root: true,
  parser: '@typescript-eslint/parser',
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:prettier/recommended',
    'prettier',
  ],
  plugins: ['svelte3', '@typescript-eslint'],
  overrides: [
    { files: ['*.svelte'], processor: 'svelte3/svelte3' },
    {
      files: ['*.ts'],
      extends: [
        'plugin:import/recommended',
        'plugin:@typescript-eslint/recommended-requiring-type-checking',
      ],
      settings: {
        'import/extensions': ['.js', '.ts'],
        'import/resolver': {
          'eslint-import-resolver-custom-alias': {
            alias: {
              $lib: './src/lib',
              $houdini: './$houdini',
            },
            extensions: ['.js', '.ts'],
          },
          typescript: true,
        },
      },
      plugins: ['@typescript-eslint'],
      parser: '@typescript-eslint/parser',
      parserOptions: {
        project: ['./tsconfig.json'],
      },
    },
  ],
  settings: {
    'svelte3/typescript': () => require('typescript'),
  },
  parserOptions: {
    sourceType: 'module',
    ecmaVersion: 2020,
  },
  env: {
    browser: true,
    es2017: true,
    node: true,
  },
}
