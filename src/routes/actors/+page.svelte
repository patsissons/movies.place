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
    ({ id, name: title, knownFor, profilePath }) => ({
      id,
      title,
      description: knownFor
        .slice(0, 5)
        .map(({ title }) => title)
        .join(', '),
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

<Items
  {baseUrl}
  {errors}
  {items}
  {pagination}
  itemType="actors"
  descriptionLabel="Known for"
  filterable
/>
<!-- <pre>{JSON.stringify($SortedPeople.data?.sortedPeople, null, 2)}</pre> -->
