import graphql from '@rollup/plugin-graphql'
import { sveltekit } from '@sveltejs/kit/vite'
import houdini from 'houdini/vite'
// import codegen from 'vite-plugin-graphql-codegen'
import watchAndRun from 'vite-plugin-watch-and-run'
import svelteSVG from 'vite-plugin-svelte-svg'
import { defineConfig } from 'vitest/config'

export default defineConfig({
  plugins: [
    graphql(),
    svelteSVG({
      requireSuffix: false,
      svgoConfig: {},
    }),
    houdini(),
    sveltekit(),
    // graphql-codegen doesn't work properly for schema files unfortunately
    // codegen({
    //   configFilePathOverride: './codegen.cjs',
    //   matchOnSchemas: true,
    // }),
    watchAndRun([
      {
        name: 'graphql-codegen',
        watchKind: ['add', 'change', 'unlink'],
        watch: 'src/lib/client/graphql/**/*.graphql',
        run: 'npm run codegen',
        delay: 250,
      },
    ]),
    watchAndRun([
      {
        name: 'graphql-schema-codegen',
        watchKind: ['change'],
        watch: 'src/lib/server/graphql/schema.graphql',
        run: 'npm run codegen',
        delay: 250,
      },
    ]),
  ],
  test: {
    include: ['src/**/*.{test,spec}.{js,ts}'],
  },
})
