import { JsonError } from '$lib/server/fetchJson'
import type { Resolver } from '$lib/server/graphql/types'
import { fetchTMDBJson } from '$lib/server/tmdb'
import type {
  Movie,
  MovieCastCredit,
  QueryMovieArgs,
} from '$lib/types/graphql.generated'
import { GraphQLError } from 'graphql'
import { fallbacks as tmbdFallbacks } from '$lib/server/tmdb/fallbacks'
import { fetchOMDBJson } from '$lib/server/omdb'
import { ratingsFromMovie, type OMDBMovie } from '$lib/server/omdb/ratings'

interface MoviePayload extends Omit<Movie, 'cast'> {
  credits: {
    cast: MovieCastCredit[]
  }
}

export const movie = (async (_source, { id }, { fetch }) => {
  try {
    const {
      credits: { cast },
      ...payload
    } = await fetchTMDBJson<MoviePayload>(
      fetch,
      'movie',
      id,
      { append_to_response: 'credits' },
      { fallbackUrl: tmbdFallbacks.movie },
    )

    if (payload.imdbId) {
      const omdb = await fetchOMDBJson<OMDBMovie | undefined>(fetch, {
        i: payload.imdbId,
      })

      if (omdb) {
        payload.omdb = ratingsFromMovie(omdb)
      }
    }

    return {
      ...payload,
      cast,
    }
  } catch (error) {
    if (error instanceof JsonError) {
      throw new GraphQLError(error.message)
    }

    throw error
  }
}) satisfies Resolver<QueryMovieArgs, Movie, never>
