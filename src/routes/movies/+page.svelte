<script lang="ts">
  import type { PageData } from './$houdini'
  import { Items } from '$lib/components/Items'
  import { baseUrlStore, itemsStorePaginated } from '$lib/stores'
  import dayjs from 'dayjs'
  import DebugData from '$lib/components/DebugData.svelte'

  export let data: PageData

  const { Configuration, SortedMovies } = data

  const baseUrl = baseUrlStore(Configuration)
  const { errors, pagination, items } = itemsStorePaginated(
    Configuration,
    SortedMovies,
    (data) => data.sortedMovies,
    (
      { id, title, releaseDate, voteAverage, voteCount, posterPath },
      images,
    ) => ({
      id,
      title,
      date: releaseDate ?? undefined,
      ratings: {
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

<Items {baseUrl} {errors} {items} {pagination} itemType="movies" filterable />
<DebugData store={SortedMovies} />
