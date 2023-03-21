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
        movie: {
          externalIds: { imdbId },
        },
      },
      images,
    ) => ({
      id,
      imdbId: imdbId ?? undefined,
      title,
      date: releaseDate ?? undefined,
      tmdbRating: {
        label: 'TMDB',
        value: voteAverage * 10,
        description: `${voteCount} votes`,
        disabled: voteCount === 0,
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
