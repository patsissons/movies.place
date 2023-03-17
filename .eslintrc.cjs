/** @type {import('eslint').ESLint.ConfigData} */
module.exports = {
  root: true,
  extends: [
    'eslint:recommended',
    'plugin:import/recommended',
    'plugin:prettier/recommended',
    'prettier',
  ],
  env: {
    browser: true,
    es2017: true,
    node: true,
  },
  parserOptions: {
    sourceType: 'module',
    ecmaVersion: 2020,
    project: ['./tsconfig.json'],
  },
  settings: {
    'import/extensions': ['.js', '.cjs'],
    'import/resolver': {
      'eslint-import-resolver-custom-alias': {
        alias: {
          $lib: './src/lib',
          $houdini: './$houdini',
        },
        extensions: ['.js', '.ts', '.svelte'],
      },
      typescript: true,
    },
  },
  overrides: [
    {
      files: ['*.ts'],
      extends: [
        'plugin:@typescript-eslint/recommended',
        'plugin:@typescript-eslint/recommended-requiring-type-checking',
      ],
      settings: {
        'import/extensions': ['.ts'],
      },
      plugins: ['@typescript-eslint'],
      parser: '@typescript-eslint/parser',
      rules: {
        // 'import/no-unresolved': 'off',
      },
    },
    {
      files: ['*.svelte'],
      extends: [
        'plugin:@typescript-eslint/recommended',
        'plugin:@typescript-eslint/recommended-requiring-type-checking',
      ],
      processor: 'svelte3/svelte3',
      settings: {
        'svelte3/typescript': () => require('typescript'),
        'import/extensions': ['.svelte'],
      },
      plugins: ['svelte3', '@typescript-eslint'],
      parser: '@typescript-eslint/parser',
    },
    {
      files: ['*.graphql'],
      excludedFiles: ['schema.graphql'],
      extends: 'plugin:@graphql-eslint/schema-recommended',
      // parser: '@graphql-eslint/eslint-plugin',
      parserOptions: {
        schema: './src/lib/server/graphql/schema.graphql',
      },
      // plugins: ['@graphql-eslint'],
      rules: {
        '@graphql-eslint/known-type-names': 'error',
      },
    },
  ],
}
