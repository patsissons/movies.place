<script lang="ts">
  import dayjs from 'dayjs'
  import { MoviesStore } from '$houdini'
  import Input from '$lib/components/Input.svelte'
  import { baseUrlStore, itemsStorePaginated } from '$lib/stores'
  import { Items } from '$lib/components/Items'
  import type { PageData } from './$houdini'
  import { derived, writable } from 'svelte/store'
  import DebugData from '$lib/components/DebugData.svelte'

  export let data: PageData

  const { Configuration } = data

  const baseUrl = baseUrlStore(Configuration)
  const store = new MoviesStore()
  const filter = writable('')
  const hasQuery = derived(filter, ($filter) => Boolean($filter))

  const { errors, pagination, items } = itemsStorePaginated(
    Configuration,
    store,
    (data) => data.movies,
    (
      { id, title, releaseDate, voteAverage, voteCount, posterPath },
      images,
    ) => ({
      id,
      title,
      date: releaseDate ?? undefined,
      ratings: {
        tmdb: {
          label: 'TMDB',
          value: voteAverage * 10,
          description: `${voteCount} votes`,
        },
      },
      url: `/movie/${id}`,
      image: posterPath
        ? {
            src: posterPath,
            widths: images.posterSizes,
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

<Input center placeholder="Find a movie..." on:value={handleValue} />
<Items
  {baseUrl}
  {errors}
  {items}
  {pagination}
  resetKey={filter}
  itemType="movies"
  descriptionLabel="Release date"
/>
<DebugData {store} />
