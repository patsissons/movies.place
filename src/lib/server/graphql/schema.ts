import { createSchema } from 'graphql-yoga'
import typeDefs from './schema.graphql'
import { resolvers } from './resolvers'
import type { Context } from './types'

export const schema = createSchema<Context>({
  typeDefs,
  resolvers,
})
