<script lang="ts">
  import dayjs from 'dayjs'
  import { MoviesStore } from '$houdini'
  import Input from '$lib/components/Input.svelte'
  import { baseUrlStore, itemsStorePaginated } from '$lib/stores'
  import { Items } from '$lib/components/Items'
  import type { PageData } from './$houdini'
  import { derived, writable } from 'svelte/store'

  export let data: PageData

  const { Configuration } = data

  const baseUrl = baseUrlStore(Configuration)
  const store = new MoviesStore()
  const filter = writable('')
  const hasQuery = derived(filter, ($filter) => Boolean($filter))

  const { errors, pagination, items } = itemsStorePaginated(
    store,
    (data) => data.movies,
    ({ id, title, releaseDate, voteAverage, posterPath }) => ({
      id,
      title,
      description: dayjs(releaseDate).format('ll'),
      rating: voteAverage * 10,
      url: `/movie/${id}`,
      image: posterPath
        ? {
            small: ['w92', posterPath].join(''),
            large: ['w154', posterPath].join(''),
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
<!-- <pre>{JSON.stringify($store.data?.movies, null, 2)}</pre> -->
