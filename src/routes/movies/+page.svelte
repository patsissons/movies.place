<script lang="ts">
  import type { PageData } from './$houdini'
  import Errors from '$lib/components/Errors.svelte'
  import { ItemGrid } from '$lib/components/ItemGrid'
  import Pagination from '$lib/components/Pagination.svelte'
  import { baseUrlStore, itemsStore } from '$lib/stores'
  import dayjs from 'dayjs'

  export let data: PageData

  const { Configuration, SortedMovies } = data

  const baseUrl = baseUrlStore(Configuration)
  const { errors, pagination, items } = itemsStore(
    SortedMovies,
    (data) => data.sortedMovies,
    ({ id, title, releaseDate, voteAverage, posterPath }) => ({
      id,
      title,
      description: dayjs(releaseDate).format('ll'),
      rating: voteAverage * 10,
      url: `/movie/${id}`,
      image: posterPath
        ? {
            small: ['w92', posterPath].join(''),
            large: ['w154', posterPath].join(''),
          }
        : undefined,
    }),
  )
</script>

<Errors {errors} />
<ItemGrid {items} {baseUrl} />
<Pagination type="movies" {pagination} />
<!-- <pre>{JSON.stringify($SortedMovies.data?.sortedMovies, null, 2)}</pre> -->
