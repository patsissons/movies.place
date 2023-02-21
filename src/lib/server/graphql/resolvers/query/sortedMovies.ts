import type { Resolver } from '$lib/server/graphql/types'
import { fetchJson, JsonError } from '$lib/server/tmdb'
import type {
  MovieListResultsPage,
  QuerySortedMoviesArgs,
} from '$lib/types/graphql.generated'
import { GraphQLError } from 'graphql'

export const sortedMovies = (async (
  _source,
  { sort, page, region },
  { fetch },
) => {
  try {
    return await fetchJson<MovieListResultsPage>(
      fetch,
      'movie',
      (sort || 'POPULAR').toLowerCase(),
      { page, region },
    )
  } catch (error) {
    if (error instanceof JsonError) {
      throw new GraphQLError(error.message)
    }

    throw error
  }
}) satisfies Resolver<
  QuerySortedMoviesArgs,
  Promise<MovieListResultsPage>,
  never
>
