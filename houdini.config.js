/// <references types="houdini-svelte">

/** @type {import('houdini').ConfigFile} */
const config = {
  schemaPath: 'src/lib/server/graphql/schema.graphql',
  plugins: {
    'houdini-svelte': {
      client: 'src/lib/client/graphql/client.ts',
    },
  },
}

export default config
