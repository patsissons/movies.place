<script lang="ts">
  import type { PageData } from './$houdini'
  import Errors from '$lib/components/Errors.svelte'
  import { ItemGrid } from '$lib/components/ItemGrid'
  import Pagination from '$lib/components/Pagination.svelte'
  import { baseUrlStore, itemsStore } from '$lib/stores'

  export let data: PageData

  const { Configuration, SortedMovies } = data

  const baseUrl = baseUrlStore(Configuration)
  const { errors, pagination, items } = itemsStore(
    SortedMovies,
    (data) => data.sortedMovies,
    ({ id, title, posterPath }) => ({
      id,
      title,
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
