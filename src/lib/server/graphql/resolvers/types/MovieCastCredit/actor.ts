import type { Resolver } from '$lib/server/graphql/types'
import type { Person, MovieCastCredit } from '$lib/types/graphql.generated'
import { person as personQuery } from '$lib/server/graphql/resolvers/query/person'

export const actor = (async ({ id }, _args, context) => {
  return await personQuery(undefined, { id }, context)
}) satisfies Resolver<unknown, Person, MovieCastCredit>
