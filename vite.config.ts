import graphql from '@rollup/plugin-graphql'
import { sveltekit } from '@sveltejs/kit/vite'
import codegen from 'vite-plugin-graphql-codegen'
import { defineConfig } from 'vitest/config'

export default defineConfig({
  plugins: [
    graphql(),
    sveltekit(),
    codegen({
      configFilePathOverride: './codegen.cjs',
      matchOnSchemas: true,
    }),
  ],
  test: {
    include: ['src/**/*.{test,spec}.{js,ts}'],
  },
})
