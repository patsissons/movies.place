<script lang="ts">
  import orderBy from 'lodash/orderBy'
  import mapValues from 'lodash/mapValues'
  import { createEventDispatcher } from 'svelte'
  import { derived, readable, type Readable } from 'svelte/store'
  import { PosterImage } from '$lib/components/Poster'
  import Rating from './Rating.svelte'
  import { allRatingIds, type Item, type RatingID } from './types'
  import { Icon } from '../Icon'

  export let items: Readable<Item[]>
  export let baseUrl: Readable<string | undefined>
  export let descriptionLabel: string | undefined = undefined
  export let selectedItems: Readable<number[]> | undefined = undefined

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

  $: hasOrder = $items.some(({ order }) => order != null)
  $: hasDates = $items.some(({ date }) => Boolean(date))
  $: tableItems = $items.map(
    ({ id, order, title, description, date, image, url, ratings }) => ({
      id,
      order,
      title,
      description,
      date,
      image,
      url,
      ratings,
      ...mapValues(ratings, (rating) => rating?.value ?? 0),
    }),
  )
  $: ratingIds = Object.keys(tableItems[0]).filter((key) =>
    allRatingIds.includes(key as RatingID),
  ) as RatingID[]
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
</script>

<div class="overflow-x-auto w-full">
  <table class="table table-zebra table-compact w-full">
    <thead class="border-b border-slate-500">
      <tr>
        {#if selectedItems}
          <th class="w-auto" />
        {/if}
        {#if hasOrder}
          <th class="p-0 w-10">
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
      {#each sortedItems as { id, order, title, description, date, image, url, ratings }}
        <tr class="hover">
          {#if selectedItems}
            <th class="w-0">
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
            <td class="p-0">
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
          <td class="p-0">
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
          {#each ratingIds as id}
            <td class="p-0">
              {#if ratings && ratings[id]}
                <a
                  class="btn btn-ghost btn-block h-20 justify-start rounded-none p-4"
                  href={url}
                >
                  <Rating rating={ratings[id]} />
                </a>
              {/if}
            </td>
          {/each}
        </tr>
      {/each}
    </tbody>
    <tfoot class="border-t border-slate-500">
      <tr>
        <th class="px-4">Title</th>
        {#if descriptionLabel}
          <th class="px-4">{descriptionLabel}</th>
        {/if}
        {#if hasDates}
          <th class="px-4">Date</th>
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
