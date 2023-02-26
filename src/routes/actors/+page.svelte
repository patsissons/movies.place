<script lang="ts">
  import type { PageData } from './$houdini'
  import Errors from '$lib/components/Errors.svelte'
  import { ItemGrid } from '$lib/components/ItemGrid'
  import Pagination from '$lib/components/Pagination.svelte'
  import { baseUrlStore, itemsStore } from '$lib/stores'

  export let data: PageData

  const { Configuration, SortedPeople } = data

  const baseUrl = baseUrlStore(Configuration)
  const { errors, pagination, items } = itemsStore(
    SortedPeople,
    (data) => data.sortedPeople,
    ({ id, name: title, profilePath }) => ({
      id,
      title,
      url: `/movie/${id}`,
      image: {
        large: `/w154${profilePath}`,
        small: `/w92${profilePath}`,
      },
    }),
  )
</script>

<Errors {errors} />
<ItemGrid {items} {baseUrl} />
<Pagination type="movies" {pagination} />
