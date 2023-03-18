<script lang="ts">
  import type { PageData } from './$houdini'
  import { Items } from '$lib/components/Items'
  import { baseUrlStore, itemsStorePaginated } from '$lib/stores'
  import DebugData from '$lib/components/DebugData.svelte'

  export let data: PageData

  const { Configuration, SortedMovies } = data

  const baseUrl = baseUrlStore(Configuration)
  const { errors, fetching, items, pagination } = itemsStorePaginated(
    Configuration,
    SortedMovies,
    (data) => data.sortedMovies,
    (
      {
        id,
        title,
        releaseDate,
        voteAverage,
        voteCount,
        posterPath,
        movie: { omdb },
      },
      images,
    ) => ({
      id,
      title,
      date: releaseDate ?? undefined,
      ratings: {
        ...(omdb?.numericalRatings && {
          rottentomatoes: omdb.numericalRatings.rottenTomatoesScore
            ? {
                label: 'Rotten Tomatoes',
                value: omdb.numericalRatings.rottenTomatoesScore,
              }
            : undefined,
          metacritic: omdb.numericalRatings.metascore
            ? {
                label: 'Metacritic',
                value: omdb.numericalRatings.metascore,
              }
            : undefined,
          imdb: omdb.numericalRatings.imdbRating
            ? {
                label: 'IMDB',
                value: omdb.numericalRatings.imdbRating * 10,
                description: `${omdb.numericalRatings.imdbVotes} votes`,
              }
            : undefined,
        }),
        tmdb: {
          label: 'TMDB',
          value: voteAverage * 10,
          description: `${voteCount} votes`,
        },
      },
      url: `/movie/${id}`,
      image: posterPath
        ? {
            src: posterPath,
            widths: images.posterSizes,
          }
        : undefined,
    }),
  )
</script>

<Items
  {baseUrl}
  {errors}
  {fetching}
  {items}
  {pagination}
  itemType="movies"
  filterable
/>
<DebugData store={SortedMovies} />
