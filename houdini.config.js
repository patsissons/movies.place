/// <references types="houdini-svelte">

import { GraphQLBigInt } from 'graphql-scalars'

/** @returns {import('houdini').ScalarSpec} */
function scalar(/** @type {import('graphql').GraphQLScalarType} */ type) {
  return {
    type: type.extensions.codegenScalarType,
    marshal: type.parseValue,
    unmarshal: type.serialize,
  }
}

/** @type {import('houdini').ConfigFile} */
const config = {
  schemaPath: 'src/lib/server/graphql/schema.graphql',
  plugins: {
    'houdini-svelte': {
      client: 'src/lib/client/graphql/client.ts',
    },
  },
  scalars: {
    BigInt: scalar(GraphQLBigInt),
  },
}

export default config
