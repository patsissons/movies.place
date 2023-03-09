import { JsonError } from '$lib/server/fetchJson'
import type { Resolver } from '$lib/server/graphql/types'
import type { Movie, OmdbRatings } from '$lib/types/graphql.generated'
// import { fallbacks } from '$lib/server/omdb/fallbacks'
import { fetchOMDBJson } from '$lib/server/omdb'
import { ratingsFromMovie, type OMDBMovie } from '$lib/server/omdb/ratings'
import { OMDBError } from '$lib/server/omdb/fetch'

export const omdb = (async ({ imdbId }, _args, { fetch }) => {
  try {
    if (!imdbId) return null

    const omdb = await fetchOMDBJson<OMDBMovie | undefined>(fetch, {
      i: imdbId,
    })

    if (!omdb) return null

    return ratingsFromMovie(omdb) ?? null
  } catch (error) {
    if (error instanceof JsonError || error instanceof OMDBError) {
      return null
    }

    throw error
  }
}) satisfies Resolver<unknown, OmdbRatings | null, Movie>
