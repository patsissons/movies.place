import { JsonError } from '$lib/server/fetchJson'
import type { Resolver } from '$lib/server/graphql/types'
import type { Movie, OmdbMovie } from '$lib/types/graphql.generated'
// import { fallbacks } from '$lib/server/omdb/fallbacks'
import { fetchOMDBJson } from '$lib/server/omdb'
import { OMDBError } from '$lib/server/omdb/fetch'

interface OMDBMovieJson {
  imdbId: string
}

export const omdb = (async ({ imdbId }, _args, { fetch }) => {
  try {
    if (!imdbId) return null

    const omdb = await fetchOMDBJson<OMDBMovieJson>(fetch, {
      i: imdbId,
    })

    if (!omdb) return null

    return {
      ...omdb,
      id: omdb.imdbId,
    }
  } catch (error) {
    if (error instanceof JsonError || error instanceof OMDBError) {
      return null
    }

    throw error
  }
}) satisfies Resolver<unknown, OmdbMovie | null, Movie>
