<script lang="ts">
  import type { PageData } from './$houdini'
  import Errors from '$lib/components/Errors.svelte'
  import { ItemGrid } from '$lib/components/ItemGrid'
  import Pagination from '$lib/components/Pagination.svelte'
  import { baseUrlFromConfigStore } from '$lib/utils/config'
  import { itemsFromResultListStore } from '$lib/utils/items'

  export let data: PageData

  const { Configuration, SortedMovies } = data

  const baseUrl = baseUrlFromConfigStore(Configuration)
  const { errors, pagination, items } = itemsFromResultListStore(
    SortedMovies,
    (data) => data.sortedMovies,
    ({ id, title, posterPath }) => ({
      id,
      title,
      url: `/movie/${id}`,
      image: {
        large: `/w154${posterPath}`,
        small: `/w92${posterPath}`,
      },
    }),
  )
  const { page, totalPages, nextPage } = $pagination
</script>

<Errors errors={$errors} />
<ItemGrid items={$items} baseUrl={$baseUrl} />
<Pagination type="movies" {page} {totalPages} {nextPage} />
