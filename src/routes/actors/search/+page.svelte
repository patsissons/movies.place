<script lang="ts">
  import meanBy from 'lodash/meanBy'
  import sumBy from 'lodash/sumBy'
  import { PeopleStore } from '$houdini'
  import Input from '$lib/components/Input.svelte'
  import { Items } from '$lib/components/Items'
  import { baseUrlStore, itemsStorePaginated } from '$lib/stores'
  import { derived, writable } from 'svelte/store'
  import type { PageData } from './$houdini'
  import { DebugQuery } from '$lib/components/Debug'
  import dayjs from 'dayjs'

  export let data: PageData

  const { Configuration } = data

  const baseUrl = baseUrlStore(Configuration)
  const store = new PeopleStore()
  const filter = writable('')
  const hasQuery = derived(filter, ($filter) => Boolean($filter))

  const { errors, fetching, items, pagination } = itemsStorePaginated(
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
        tmdb:
          knownFor.length > 0
            ? {
                label: 'TMDB',
                value: meanBy(knownFor, ({ voteAverage }) => voteAverage * 10),
                count: sumBy(knownFor, ({ voteCount }) => voteCount),
                description: `${knownFor.length} movies`,
                disabled: knownFor.length === 0,
              }
            : undefined,
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
  {fetching}
  {items}
  {pagination}
  queryFilter={filter}
  itemType="actors"
  descriptionLabel="Known for"
/>
<DebugQuery {store} />
