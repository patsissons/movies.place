import type { Resolver } from '$lib/server/graphql/types'
import { fetchJson, JsonError } from '$lib/server/tmdb'
import type {
  MovieListResultsPage,
  QueryMoviesArgs,
} from '$lib/types/graphql.generated'
import { GraphQLError } from 'graphql'
import { loadDefaults } from './defaultPayloads'

export const movies = (async (
  _source,
  { query, page, includeAdult, region, year, primaryReleaseYear },
  { fetch },
) => {
  try {
    const { MoviesDefault } = await loadDefaults()
    return await fetchJson<MovieListResultsPage>(
      fetch,
      'search',
      'movie',
      {
        query,
        page,
        include_adult: includeAdult,
        region,
        year,
        primary_release_year: primaryReleaseYear,
      },
      { defaultPayload: MoviesDefault },
    )
  } catch (error) {
    if (error instanceof JsonError) {
      throw new GraphQLError(error.message)
    }

    throw error
  }
}) satisfies Resolver<QueryMoviesArgs, MovieListResultsPage, never>
