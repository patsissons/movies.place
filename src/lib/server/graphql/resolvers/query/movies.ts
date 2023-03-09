import { JsonError } from '$lib/server/fetchJson'
import type { Resolver } from '$lib/server/graphql/types'
import { fetchTMDBJson } from '$lib/server/tmdb'
import type {
  MovieListResultsPage,
  QueryMoviesArgs,
} from '$lib/types/graphql.generated'
import { GraphQLError } from 'graphql'
import { fallbacks } from '$lib/server/tmdb/fallbacks'

export const movies = (async (
  _source,
  { query, page, includeAdult, region, year, primaryReleaseYear },
  { fetch },
) => {
  try {
    return await fetchTMDBJson<MovieListResultsPage>(
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
      { fallbackUrl: fallbacks.movies },
    )
  } catch (error) {
    if (error instanceof JsonError) {
      throw new GraphQLError(error.message)
    }

    throw error
  }
}) satisfies Resolver<QueryMoviesArgs, MovieListResultsPage, unknown>
