<script lang="ts">
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

  const { errors, fetching, items, pagination } = itemsStorePaginated(
    Configuration,
    store,
    (data) => data.movies,
    (
      {
        id,
        title,
        releaseDate,
        voteAverage,
        voteCount,
        posterPath,
        movie: {
          externalIds: { imdbId },
        },
      },
      images,
    ) => ({
      id,
      imdbId: imdbId ?? undefined,
      title,
      date: releaseDate ?? undefined,
      tmdbRating: {
        label: 'TMDB',
        value: voteAverage * 10,
        description: `${voteCount} votes`,
        disabled: voteCount === 0,
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
  {fetching}
  {items}
  {pagination}
  queryFilter={filter}
  itemType="movies"
  descriptionLabel="Release date"
/>
<DebugData {store} />
