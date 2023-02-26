import type { Resolver } from '$lib/server/graphql/types'
import { fetchJson, JsonError } from '$lib/server/tmdb'
import type {
  Movie,
  MovieCastCredit,
  QueryMovieArgs,
} from '$lib/types/graphql.generated'
import { GraphQLError } from 'graphql'
import { fallbacks } from './fallbacks'

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
    } = await fetchJson<MoviePayload>(
      fetch,
      'movie',
      id,
      { append_to_response: 'credits' },
      { fallbackUrl: fallbacks.movie },
    )

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
