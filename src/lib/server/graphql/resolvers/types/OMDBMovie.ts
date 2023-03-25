import type { Context } from '$lib/server/graphql/types'
import type { Maybe, OmdbMovie } from '$lib/types/graphql.generated'
import type { IObjectTypeResolver } from '@graphql-tools/utils'

export const OMDBMovie: IObjectTypeResolver<OmdbMovie, Context, unknown> = {
  numericalRatings: ({ id, metascore, imdbRating, imdbVotes, ratings }) => {
    return {
      id,
      metascore: toNumber(metascore),
      imdbRating: toNumber(imdbRating),
      imdbVotes: toNumber(imdbVotes, (value) => value.replaceAll(',', '')),
      rottenTomatoesScore: toNumber(rottenTomatoesScore(), (value) =>
        value.replace('%', ''),
      ),
    }

    function rottenTomatoesScore() {
      if (!ratings) return

      const rating = ratings.find(({ source }) => source === 'Rotten Tomatoes')
      if (!rating) return

      return rating.value
    }

    function toNumber(
      input?: Maybe<string>,
      transform?: (value: string) => string,
    ) {
      try {
        if (!input) return

        const value = transform ? Number(transform(input)) : Number(input)
        if (isNaN(value)) return

        return value
      } catch {
        // do nothing
      }
    }
  },
}
