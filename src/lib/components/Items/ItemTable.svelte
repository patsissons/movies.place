<script lang="ts">
  import orderBy from 'lodash/orderBy'
  import { createEventDispatcher } from 'svelte'
  import { derived, readable, writable, type Readable } from 'svelte/store'
  import { PosterImage } from '$lib/components/Poster'
  import Rating from './Rating.svelte'
  import type { Item, RatingData, RatingID, Ratings } from './types'
  import { Icon } from '../Icon'
  import { OMDBMovieStore } from '$houdini'

  export let items: Readable<Item[]>
  export let baseUrl: Readable<string | undefined>
  export let descriptionLabel: string | undefined = undefined
  export let selectedItems: Readable<number[]> | undefined = undefined

  const omdbStore = new OMDBMovieStore()
  const ratingsStore = writable<Map<string, Ratings> | undefined>()
  const loadingRatingsStore = writable(false)

  const dispatch = createEventDispatcher<{
    selectionChanged: { id: number }
  }>()

  const selectedSet = derived(
    selectedItems ?? readable([]),
    (values) => new Set(values),
  )

  type SortField = 'order' | 'title' | 'description' | 'date' | RatingID
  type SortDir = 'asc' | 'desc'

  let sort: SortField = 'order'
  let dir: SortDir = 'asc'

  $: canLoadRatings = $items.some(({ imdbId }) => Boolean(imdbId))
  $: ratingIds = $ratingsStore
    ? Array.from(
        Array.from($ratingsStore.values()).reduce(
          (set, ratings) =>
            Object.entries(ratings as Record<string, RatingData>)
              .filter(([, rating]) => rating != null)
              .reduce((set, [id]) => set.add(id as RatingID), set),
          new Set<RatingID>(),
        ),
      )
    : []
  $: hasRating = $items.some(({ tmdbRating }) => Boolean(tmdbRating))
  $: hasOrder = $items.some(({ order }) => order != null)
  $: hasDates = $items.some(({ date }) => Boolean(date))
  $: tableItems = $items.map(
    ({
      id,
      imdbId,
      order,
      title,
      description,
      date,
      image,
      url,
      tmdbRating,
    }) => ({
      id,
      imdbId,
      order,
      title,
      description,
      date,
      image,
      url,
      tmdbRating,
    }),
  )
  $: sortedItems = orderBy(tableItems, [sort], [dir])

  function handleSort(field: typeof sort) {
    if (sort === field) {
      dir = dir === 'asc' ? 'desc' : 'asc'
    } else {
      sort = field
      dir = 'desc'
    }
  }

  function handleSelect(e: MouseEvent, id: number) {
    e.preventDefault()
    dispatch('selectionChanged', { id })
  }

  async function handleLoadRatings() {
    try {
      loadingRatingsStore.set(true)

      const imdbIds = tableItems
        .map(({ imdbId }) => imdbId)
        .filter((imdbId): imdbId is string => Boolean(imdbId))

      const results = await Promise.all(
        imdbIds.map((imdbId) => omdbStore.fetch({ variables: { imdbId } })),
      )

      const ratings = results
        .map((result) => ({
          imdbId: result.variables?.imdbId,
          numericalRatings: result.data?.omdbMovie?.numericalRatings,
        }))
        .reduce((ratings, result) => {
          if (
            !result ||
            !result.imdbId ||
            !result.numericalRatings ||
            !Object.values(result.numericalRatings).some(Boolean)
          )
            return ratings

          return ratings.set(result.imdbId, {
            rottentomatoes: result.numericalRatings.rottenTomatoesScore
              ? {
                  label: 'Rotten Tomatoes',
                  value: result.numericalRatings.rottenTomatoesScore,
                  disabled: result.numericalRatings.rottenTomatoesScore === 0,
                }
              : undefined,
            metacritic: result.numericalRatings.metascore
              ? {
                  label: 'Metacritic',
                  value: result.numericalRatings.metascore,
                  disabled: result.numericalRatings.metascore === 0,
                }
              : undefined,
            imdb: result.numericalRatings.imdbRating
              ? {
                  label: 'IMDB',
                  value: result.numericalRatings.imdbRating * 10,
                  description: `${result.numericalRatings.imdbVotes} votes`,
                  disabled: result.numericalRatings.imdbVotes === 0,
                }
              : undefined,
          })
        }, new Map<string, Ratings>())

      console.info(`loaded ${ratings.size} external ratings`)
      ratingsStore.set(ratings)
    } catch (error) {
      console.error('Error loading external ratings', error)
    } finally {
      loadingRatingsStore.set(false)
    }
    if (!canLoadRatings) return
  }

  function ratingsForImdbId(
    ratingsMap?: Map<string, Ratings>,
    imdbId?: string,
  ) {
    if (!ratingsMap || !imdbId) return ratingIds.map(() => undefined)

    const ratings = ratingsMap.get(imdbId)
    if (!ratings) return ratingIds.map(() => undefined)

    return ratingIds.map((id) => ratings[id])
  }
</script>

{#if canLoadRatings && !$ratingsStore}
  <button
    class="btn btn-secondary btn-block mb-4"
    class:btn-disabled={$loadingRatingsStore}
    on:click={handleLoadRatings}
  >
    Load External Ratings
  </button>
{/if}
<div class="overflow-x-auto w-full">
  <table class="table table-zebra table-compact w-full">
    <thead class="border-b border-slate-500">
      <tr>
        {#if selectedItems}
          <th class="w-auto !static" />
        {/if}
        {#if hasOrder}
          <th class="p-0 w-10 !static">
            <button
              class="btn btn-ghost btn-block h-20 justify-start rounded-none"
              on:click={() => handleSort('order')}
            >
              Order
              {#if sort === 'order' && dir}
                {dir === 'asc' ? '↑' : '↓'}
              {/if}
            </button>
          </th>
        {/if}
        <th class="p-0 !static">
          <button
            class="btn btn-ghost btn-block h-20 justify-start rounded-none"
            on:click={() => handleSort('title')}
          >
            Title
            {#if sort === 'title' && dir}
              {dir === 'asc' ? '↑' : '↓'}
            {/if}
          </button>
        </th>
        {#if descriptionLabel}
          <th class="p-0 w-80">
            <button
              class="btn btn-ghost btn-block h-20 justify-start rounded-none"
              on:click={() => handleSort('description')}
            >
              {descriptionLabel}
              {#if sort === 'description' && dir}
                {dir === 'asc' ? '↑' : '↓'}
              {/if}
            </button>
          </th>
        {/if}
        {#if hasDates}
          <th class="p-0 w-80">
            <button
              class="btn btn-ghost btn-block h-20 justify-start rounded-none"
              on:click={() => handleSort('date')}
            >
              Date
              {#if sort === 'date' && dir}
                {dir === 'asc' ? '↑' : '↓'}
              {/if}
            </button>
          </th>
        {/if}
        {#if hasRating}
          <th class="p-0 w-[68px]">
            <button
              class="btn btn-ghost btn-block h-20 justify-center rounded-none"
              on:click={() => handleSort('tmdb')}
            >
              <Icon icon={'tmdb'} size={36} />
              {#if sort === 'tmdb' && dir}
                {dir === 'asc' ? '↑' : '↓'}
              {/if}
            </button>
          </th>
        {/if}
        {#each ratingIds as id}
          <th class="p-0 w-[68px]">
            <button
              class="btn btn-ghost btn-block h-20 justify-center rounded-none"
              on:click={() => handleSort(id)}
            >
              {#if id === 'aggregate'}
                ⅀
              {:else}
                <Icon icon={id} size={36} />
              {/if}
              {#if sort === id && dir}
                {dir === 'asc' ? '↑' : '↓'}
              {/if}
            </button>
          </th>
        {/each}
      </tr>
    </thead>
    <tbody>
      {#each sortedItems as { id, imdbId, order, title, description, date, image, url, tmdbRating }}
        <tr class="hover">
          {#if selectedItems}
            <th class="w-0 !static">
              <label>
                {#if $selectedSet.has(id)}
                  <input
                    type="checkbox"
                    class="checkbox"
                    checked
                    on:click={(e) => handleSelect(e, id)}
                  />
                {:else}
                  <input
                    type="checkbox"
                    class="checkbox"
                    on:click={(e) => handleSelect(e, id)}
                  />
                {/if}
              </label>
            </th>
          {/if}
          {#if hasOrder}
            <td class="p-0 !static">
              {#if order != null}
                <a
                  class="btn btn-ghost btn-block h-20 justify-start rounded-none p-4"
                  href={url}
                >
                  <p>{order}</p>
                </a>
              {/if}
            </td>
          {/if}
          <td class="p-0 !static">
            <a
              class="btn btn-ghost btn-block h-20 justify-start rounded-none p-4"
              href={url}
            >
              <div class="flex items-center gap-4">
                {#if image}
                  <div class="avatar">
                    <div class="w-8 !aspect-auto">
                      <PosterImage
                        {baseUrl}
                        sizes="32px"
                        {...image}
                        alt={`${title} image`}
                      />
                    </div>
                  </div>
                {/if}
                <div class="flex flex-col">
                  <p class="w-full text-center font-bold">
                    {title}
                  </p>
                </div>
              </div>
            </a>
          </td>
          {#if descriptionLabel}
            <td class="p-0">
              {#if description}
                <a
                  class="btn btn-ghost btn-block h-20 justify-start rounded-none p-4"
                  href={url}
                >
                  <p>{description}</p>
                </a>
              {/if}
            </td>
          {/if}
          {#if hasDates}
            <td class="p-0">
              {#if date}
                <a
                  class="btn btn-ghost btn-block h-20 justify-start rounded-none p-4"
                  href={url}
                >
                  <p>{date}</p>
                </a>
              {/if}
            </td>
          {/if}
          {#if hasRating}
            <td class="p-0">
              {#if tmdbRating}
                <a
                  class="btn btn-ghost btn-block h-20 justify-start rounded-none p-4"
                  href={url}
                >
                  <Rating class="tooltip-left" rating={tmdbRating} />
                </a>
              {/if}
            </td>
          {/if}
          {#each ratingsForImdbId($ratingsStore, imdbId) as rating}
            <td class="p-0">
              {#if rating}
                <a
                  class="btn btn-ghost btn-block h-20 justify-start rounded-none p-4"
                  href={url}
                >
                  <Rating class="tooltip-left" {rating} />
                </a>
              {/if}
            </td>
          {/each}
        </tr>
      {/each}
    </tbody>
    <tfoot class="border-t border-slate-500">
      <tr>
        <th class="px-4 !static">Title</th>
        {#if descriptionLabel}
          <th class="px-4">{descriptionLabel}</th>
        {/if}
        {#if hasDates}
          <th class="px-4">Date</th>
        {/if}
        {#if hasRating}
          <th class="px-4">
            <Icon icon="tmdb" size={36} />
          </th>
        {/if}
        {#each ratingIds as id}
          <th class="px-4">
            {#if id === 'aggregate'}
              ⅀
            {:else}
              <Icon icon={id} size={36} />
            {/if}
          </th>
        {/each}
      </tr>
    </tfoot>
  </table>
</div>
