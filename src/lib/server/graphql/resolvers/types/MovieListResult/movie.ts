import type { Resolver } from '$lib/server/graphql/types'
import type { Movie, MovieListResult } from '$lib/types/graphql.generated'
import { movie as movieQuery } from '$lib/server/graphql/resolvers/query/movie'

export const movie = (async ({ id }, _args, context) => {
  return await movieQuery(undefined, { id }, context)
}) satisfies Resolver<unknown, Movie, MovieListResult>
