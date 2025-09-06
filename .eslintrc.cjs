/** @type {import('eslint').ESLint.ConfigData} */
module.exports = {
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:svelte/recommended',
    'plugin:svelte/prettier',
    'plugin:prettier/recommended',
    'prettier',
  ],
  plugins: ['@typescript-eslint'],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    project: ['./tsconfig.json'],
    extraFileExtensions: ['.svelte'],
  },
  overrides: [
    {
      files: ['*.svelte'],
      parser: 'svelte-eslint-parser',
      parserOptions: {
        parser: '@typescript-eslint/parser'
      }
    },
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
