import type { IResolvers } from '@graphql-tools/utils'
import { Query } from './query'
import * as scalars from './scalars'
import * as types from './types'

export const resolvers: IResolvers = {
  ...scalars,
  ...types,
  Query,
}
