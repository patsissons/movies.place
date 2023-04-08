<script lang="ts">
  import orderBy from 'lodash/orderBy'
  import mapValues from 'lodash/mapValues'
  import { createEventDispatcher } from 'svelte'
  import { derived, readable, writable, type Readable } from 'svelte/store'
  import { PosterImage } from '$lib/components/Poster'
  import Rating from './Rating.svelte'
  import type { Item, ItemImage, RatingData, RatingID, Ratings } from './types'
  import { Icon } from '../Icon'
  import { OMDBMovieStore } from '$houdini'

  export let items: Readable<Item[]>
  export let baseUrl: Readable<string | undefined>
  export let descriptionLabel: string | undefined = undefined
  export let selectedItems: Readable<number[]> | undefined = undefined
  export let refImages:
    | Readable<Record<number, ItemImage | undefined> | undefined>
    | undefined = readable(undefined)

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

  type SortField =
    | 'order'
    | 'title'
    | 'description'
    | 'date'
    | 'count'
    | 'refId'
    | RatingID
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
  $: hasRatings = $items.some(({ tmdbRating }) => Boolean(tmdbRating))
  $: hasOrders = $items.some(({ order }) => order != null)
  $: hasDates = $items.some(({ date }) => Boolean(date))
  $: hasCounts = $items.some(({ count }) => Boolean(count))
  $: hasRefs = $items.some(({ refId }) => Boolean(refId))
  $: tableItems = $items.map(
    ({
      id,
      refId,
      count,
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
      refId,
      count,
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
  $: ratingsByImdbId = $ratingsStore
    ? mapValues(Object.fromEntries($ratingsStore.entries()), (ratings) =>
        mapValues(ratings, (rating) => rating?.value),
      )
    : undefined
  $: tableItemsWithRatings = tableItems.map((item) => {
    const ratings = ratingsByImdbId?.[item.imdbId ?? ''] ?? {}

    return {
      ...item,
      ...ratings,
      tmdb: item.tmdbRating?.value,
    }
  })
  $: sortedItems = orderBy(tableItemsWithRatings, [sort], [dir])
  $: refImageMap = $refImages ?? {}

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
                  count: result.numericalRatings.imdbVotes ?? undefined,
                  description: `${result.numericalRatings.imdbVotes} votes`,
                  disabled: result.numericalRatings.imdbVotes === 0,
                }
              : undefined,
          })
        }, new Map<string, Ratings>())

      console.info(`loaded ${ratings.size} external ratings`, ratings)
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
  <div class="mb-4 px-4">
    <button
      class="btn btn-secondary btn-block"
      class:btn-disabled={$loadingRatingsStore}
      on:click={handleLoadRatings}
    >
      Load External Ratings for {tableItems.length} items
    </button>
  </div>
{/if}
<div class="overflow-x-auto w-screen px-4">
  <table class="table table-zebra table-compact w-full">
    <thead class="border-b border-slate-500">
      <tr>
        {#if selectedItems}
          <th class="!static w-[40px]" />
        {/if}
        {#if hasOrders}
          <th class="p-0 !static w-[100px]">
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
        {#if hasRefs}
          <th class="p-0 !static w-[100px]">
            <button
              class="btn btn-ghost btn-block h-20 justify-start rounded-none"
              on:click={() => handleSort('refId')}
            >
              Actor
              {#if sort === 'refId' && dir}
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
          <th class="p-0">
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
          <th class="p-0 w-[125px]">
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
        {#if hasCounts}
          <th class="p-0 w-[100px]">
            <button
              class="btn btn-ghost btn-block h-20 justify-start rounded-none"
              on:click={() => handleSort('count')}
            >
              Count
              {#if sort === 'count' && dir}
                {dir === 'asc' ? '↑' : '↓'}
              {/if}
            </button>
          </th>
        {/if}
        {#if hasRatings}
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
      {#each sortedItems as { id, imdbId, order, title, description, date, count, refId, image, url, tmdbRating }}
        <tr class="hover">
          {#if selectedItems}
            <th class="!static">
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
          {#if hasOrders}
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
          {#if hasRefs}
            <td class="p-0 !static">
              {#if refId != null}
                {@const image = refImageMap[refId]}
                <a
                  class="btn btn-ghost btn-block h-20 justify-start rounded-none p-4"
                  href={`/actor/${refId}`}
                >
                  {#if image}
                    <div class="avatar">
                      <div class="w-8 !aspect-auto">
                        <PosterImage
                          {baseUrl}
                          sizes="32px"
                          alt={`${refId} image`}
                          {...image}
                        />
                      </div>
                    </div>
                  {/if}
                  <span class="invisible">{refId}</span>
                </a>
              {/if}
            </td>
          {/if}
          <td class="p-0 !static max-w-[300px] truncate">
            <a
              class="btn btn-ghost btn-block h-20 justify-start rounded-none p-4"
              href={url}
            >
              <div class="flex items-center gap-4">
                <div class="avatar">
                  <div class="w-8 !aspect-auto">
                    {#if image}
                      <PosterImage
                        {baseUrl}
                        sizes="32px"
                        alt={`${title} image`}
                        {...image}
                      />
                    {/if}
                  </div>
                </div>
                <div class="flex flex-col">
                  <p class="w-full text-center font-bold">
                    {title}
                  </p>
                </div>
              </div>
            </a>
          </td>
          {#if descriptionLabel}
            <td class="p-0 max-w-[300px] truncate">
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
          {#if hasCounts}
            <td class="p-0">
              {#if count}
                <a
                  class="btn btn-ghost btn-block h-20 justify-start rounded-none p-4"
                  href={url}
                >
                  <p>{count}</p>
                </a>
              {/if}
            </td>
          {/if}
          {#if hasRatings}
            <td class="p-0">
              {#if tmdbRating}
                <a
                  class="btn btn-ghost btn-block h-20 justify-start rounded-none p-4"
                  href={url}
                >
                  <Rating rating={tmdbRating} simple />
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
                  <Rating {rating} simple />
                </a>
              {/if}
            </td>
          {/each}
        </tr>
      {/each}
    </tbody>
    <tfoot class="border-t border-slate-500">
      <tr>
        {#if selectedItems}
          <th class="px-4 !static" />
        {/if}
        {#if hasOrders}
          <th class="px-4 !static">Order</th>
        {/if}
        {#if hasRefs}
          <th class="px-4 !static">Actor</th>
        {/if}
        <th class="px-4 !static">Title</th>
        {#if descriptionLabel}
          <th class="px-4">{descriptionLabel}</th>
        {/if}
        {#if hasDates}
          <th class="px-4">Date</th>
        {/if}
        {#if hasCounts}
          <th class="px-4">Count</th>
        {/if}
        {#if hasRatings}
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
