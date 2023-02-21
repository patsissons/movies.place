/** @type {import('graphql-config').IGraphQLConfig} */
module.exports = {
  schema: [
    './src/lib/server/graphql/schema.graphql',
    './$houdini/graphql/schema.graphql',
  ],
  documents: [
    './src/lib/client/graphql/**/*.graphql',
    '**/*.svelte',
    './$houdini/graphql/documents.gql',
  ],
}
