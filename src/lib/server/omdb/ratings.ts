import type { Movie } from '$lib/types/graphql.generated'

export interface OMDBMovie {
  imdbId: string
  metascore?: string
  imdbRating?: string
  imdbVotes?: string
  ratings?: {
    source: string
    value: string
  }[]
}

type OMDBRatings = Movie['omdb']

export function ratingsFromMovie({
  imdbId: id,
  metascore,
  imdbRating,
  imdbVotes,
  ratings,
}: OMDBMovie): OMDBRatings {
  if (!id) return

  const rtRating = ratings?.find(({ source }) => source === 'Rotten Tomatoes')

  return {
    id,
    metascore: toNumber(metascore),
    imdbRating: toNumber(imdbRating),
    imdbVotes: toNumber(imdbVotes?.replaceAll(',', '')),
    rottenTomatoesScore: toNumber(rtRating?.value?.replace('%', '')),
  }
}

export function toNumber(input?: string) {
  try {
    if (!input) return

    const value = Number(input)
    if (isNaN(value)) return

    return value
  } catch {
    // do nothing
  }
}
