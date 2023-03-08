<script lang="ts">
  import meanBy from 'lodash/meanBy'
  import type { PageData } from './$houdini'
  import { Items } from '$lib/components/Items'
  import { baseUrlStore, itemsStorePaginated } from '$lib/stores'
  import DebugData from '$lib/components/DebugData.svelte'

  export let data: PageData

  const { Configuration, SortedPeople } = data

  const baseUrl = baseUrlStore(Configuration)
  const { errors, pagination, items } = itemsStorePaginated(
    Configuration,
    SortedPeople,
    (data) => data.sortedPeople,
    ({ id, name: title, knownFor, profilePath }, images) => ({
      id,
      title,
      description: knownFor
        .slice(0, 5)
        .map(({ title }) => title)
        .join(', '),
      ratings: [
        {
          label: 'TMDB',
          value: meanBy(knownFor, ({ voteAverage }) => voteAverage * 10),
        },
      ],
      url: `/actor/${id}`,
      image: profilePath
        ? {
            src: profilePath,
            widths: images.profileSizes,
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
<DebugData store={SortedPeople} />
