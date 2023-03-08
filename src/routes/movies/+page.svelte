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
    ({ id, title, releaseDate, voteAverage, posterPath }, images) => ({
      id,
      title,
      description: dayjs(releaseDate).format('ll'),
      ratings: [{ label: 'TMDB', value: voteAverage * 10 }],
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
  {items}
  {pagination}
  itemType="movies"
  descriptionLabel="Release date"
  filterable
/>
<DebugData store={SortedMovies} />
