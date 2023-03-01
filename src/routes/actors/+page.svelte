<script lang="ts">
  import meanBy from 'lodash/meanBy'
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
    ({ id, name: title, knownFor, knownFor: [movie], profilePath }) => ({
      id,
      title,
      description: movie?.title,
      rating: meanBy(knownFor, ({ voteAverage }) => voteAverage * 10),
      url: `/actor/${id}`,
      image: profilePath
        ? {
            small: ['w92', profilePath].join(''),
            large: ['w154', profilePath].join(''),
          }
        : undefined,
    }),
  )
</script>

<Errors {errors} />
<ItemGrid {items} {baseUrl} />
<Pagination type="movies" {pagination} />
<!-- <pre>{JSON.stringify($SortedPeople.data?.sortedPeople, null, 2)}</pre> -->
