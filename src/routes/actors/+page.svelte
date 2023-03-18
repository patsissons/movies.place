<script lang="ts">
  import meanBy from 'lodash/meanBy'
  import type { PageData } from './$houdini'
  import { Items } from '$lib/components/Items'
  import { baseUrlStore, itemsStorePaginated } from '$lib/stores'
  import DebugData from '$lib/components/DebugData.svelte'
  import dayjs from 'dayjs'

  export let data: PageData

  const { Configuration, SortedPeople } = data

  const baseUrl = baseUrlStore(Configuration)
  const { errors, fetching, items, pagination } = itemsStorePaginated(
    Configuration,
    SortedPeople,
    (data) => data.sortedPeople,
    ({ id, name: title, knownFor, profilePath }, images) => ({
      id,
      title,
      description: knownFor
        .slice(0, 5)
        .map(({ title, releaseDate }) =>
          releaseDate ? `${title} (${dayjs(releaseDate).year()})` : title,
        )
        .join(', '),
      ratings: {
        tmdb: {
          label: 'TMDB',
          value: meanBy(knownFor, ({ voteAverage }) => voteAverage * 10),
          description: `${knownFor.length} movies`,
        },
      },
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
  {fetching}
  {items}
  {pagination}
  itemType="actors"
  descriptionLabel="Known for"
  filterable
/>
<DebugData store={SortedPeople} />
