import type { Resolver } from '$lib/server/graphql/types'
import type { Movie, OmdbMovie } from '$lib/types/graphql.generated'
import { fallbacks } from '$lib/server/omdb/fallbacks'
import { fetchOMDBJson } from '$lib/server/omdb'

interface OMDBMovieJson {
  imdbId: string
  response?: string
}

export const omdb = (async ({ imdbId }, _args, { fetch }) => {
  if (!imdbId) return null

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
}) satisfies Resolver<unknown, OmdbMovie | null, Movie>
