import type { Resolver } from '$lib/server/graphql/types'
import { fetchOMDBJson } from '$lib/server/omdb'
import type {
  OmdbMovie,
  QueryOmdbMovieArgs,
} from '$lib/types/graphql.generated'
import { fallbacks } from '$lib/server/omdb/fallbacks'

interface OMDBMovieJson {
  imdbId: string
  response?: string
}

export const omdbMovie = (async (_source, { imdbId }, { fetch }) => {
  try {
    const omdb = await fetchOMDBJson<OMDBMovieJson>(
      fetch,
      {
        i: imdbId,
      },
      { fallbackUrl: fallbacks.movie },
    )

    if (!omdb) return { id: imdbId, response: 'null' }

    return {
      ...omdb,
      id: imdbId,
      response: omdb.response ?? '',
    }
  } catch (error) {
    if (error instanceof Error) {
      return {
        id: imdbId,
        response: error.message,
      }
    }

    return {
      id: imdbId,
      response: String(error),
    }
  }
}) satisfies Resolver<QueryOmdbMovieArgs, OmdbMovie, unknown>
