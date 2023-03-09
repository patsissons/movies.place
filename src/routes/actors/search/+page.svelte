<script lang="ts">
  import meanBy from 'lodash/meanBy'
  import { PeopleStore } from '$houdini'
  import Input from '$lib/components/Input.svelte'
  import { Items } from '$lib/components/Items'
  import { baseUrlStore, itemsStorePaginated } from '$lib/stores'
  import { derived, writable } from 'svelte/store'
  import type { PageData } from './$houdini'
  import DebugData from '$lib/components/DebugData.svelte'
  import dayjs from 'dayjs'

  export let data: PageData

  const { Configuration } = data

  const baseUrl = baseUrlStore(Configuration)
  const store = new PeopleStore()
  const filter = writable('')
  const hasQuery = derived(filter, ($filter) => Boolean($filter))

  const { errors, pagination, items } = itemsStorePaginated(
    Configuration,
    store,
    (data) => data.people,
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
    hasQuery,
  )

  function handleValue({ detail: query }: CustomEvent<string>) {
    filter.set(query)
    if (query) {
      store.fetch({ variables: { query } })
    }
  }
</script>

<Input center placeholder="Find an actor..." on:value={handleValue} />
<Items
  {baseUrl}
  {errors}
  {items}
  {pagination}
  resetKey={filter}
  itemType="actors"
  descriptionLabel="Known for"
/>
<DebugData {store} />
