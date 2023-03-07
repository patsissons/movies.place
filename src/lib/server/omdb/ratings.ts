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
  const rtRating = ratings?.find(({ source }) => source === 'Rotten Tomatoes')

  return {
    id,
    metascore: metascore ? Number(metascore) : undefined,
    imdbRating: imdbRating ? Number(imdbRating) : undefined,
    imdbVotes: imdbVotes ? Number(imdbVotes.replaceAll(',', '')) : undefined,
    rottenTomatoesScore: rtRating
      ? Number(rtRating.value.replace('%', ''))
      : undefined,
  }
}

// "Ratings": [
//   { "Source": "Internet Movie Database", "Value": "8.3/10" },
//   { "Source": "Rotten Tomatoes", "Value": "96%" },
//   { "Source": "Metacritic", "Value": "78/100" }
// ],
// "Metascore": "78",
// "imdbRating": "8.3",
// "imdbVotes": "538,106",
// "imdbID": "tt1745960",
