import { GraphQLError } from 'graphql'
import type { Resolver } from '$lib/server/graphql/types'
import { fetchJson, JsonError } from '$lib/server/tmdb'
import type {
  MovieListResultsPage,
  QuerySortedMoviesArgs,
} from '$lib/types/graphql.generated'
import { loadDefaults } from './defaultPayloads'

export const sortedMovies = (async (
  _source,
  { sort, page, region },
  { fetch },
) => {
  try {
    const { SortedMoviesDefault } = await loadDefaults()

    return fetchJson<MovieListResultsPage>(
      fetch,
      'movie',
      (sort || 'POPULAR').toLowerCase(),
      { page, region },
      { defaultPayload: SortedMoviesDefault },
    )
  } catch (error) {
    if (error instanceof JsonError) {
      throw new GraphQLError(error.message)
    }

    throw error
  }
}) satisfies Resolver<QuerySortedMoviesArgs, MovieListResultsPage, never>
