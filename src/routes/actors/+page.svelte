<script lang="ts">
  import meanBy from 'lodash/meanBy'
  import type { PageData } from './$houdini'
  import { Items } from '$lib/components/Items'
  import { baseUrlStore, itemsStorePaginated } from '$lib/stores'

  export let data: PageData

  const { Configuration, SortedPeople } = data

  const baseUrl = baseUrlStore(Configuration)
  const { errors, pagination, items } = itemsStorePaginated(
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

<Items {baseUrl} {errors} {items} itemType="actors" {pagination} />
<!-- <pre>{JSON.stringify($SortedPeople.data?.sortedPeople, null, 2)}</pre> -->
