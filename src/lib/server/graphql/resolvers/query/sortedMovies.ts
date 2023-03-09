import { GraphQLError } from 'graphql'
import type { Resolver } from '$lib/server/graphql/types'
import { fetchTMDBJson } from '$lib/server/tmdb'
import type {
  MovieListResultsPage,
  QuerySortedMoviesArgs,
} from '$lib/types/graphql.generated'
import { fallbacks } from '$lib/server/tmdb/fallbacks'
import { JsonError } from '$lib/server/fetchJson'

export const sortedMovies = (async (
  _source,
  { sort, page, region },
  { fetch },
) => {
  try {
    return fetchTMDBJson<MovieListResultsPage>(
      fetch,
      'movie',
      (sort || 'POPULAR').toLowerCase(),
      { page, region },
      { fallbackUrl: fallbacks.sortedMovies },
    )
  } catch (error) {
    if (error instanceof JsonError) {
      throw new GraphQLError(error.message)
    }

    throw error
  }
}) satisfies Resolver<QuerySortedMoviesArgs, MovieListResultsPage, unknown>
