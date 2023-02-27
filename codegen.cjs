/** @type {import('@graphql-codegen/cli').CodegenConfig} */
module.exports = {
  overwrite: true,
  schema: './src/lib/server/graphql/schema.graphql',
  documents: ['./src/lib/client/graphql/**/*.graphql'],
  generates: {
    './src/lib/types/graphql.generated.ts': {
      plugins: ['typescript', 'typescript-document-nodes'],
      config: {
        scalars: {
          BigInt: 'bigint',
          Date: 'Date',
          DateTime: 'Date',
        },
      },
    },
    './src/lib/server/graphql/schema.generated.json': {
      plugins: ['introspection'],
    },
  },
  config: {
    useTypeImports: true,
    enumsAsTypes: true,
  },
}
