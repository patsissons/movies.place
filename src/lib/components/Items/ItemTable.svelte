<script lang="ts">
  import orderBy from 'lodash/orderBy'
  import mapValues from 'lodash/mapValues'
  import type { Readable } from 'svelte/store'
  import { PosterImage } from '$lib/components/Poster'
  import Rating from './Rating.svelte'
  import type { Item, RatingID } from './types'

  export let items: Readable<Item[]>
  export let baseUrl: Readable<string | undefined>
  export let descriptionLabel: string | undefined = undefined

  type SortField = 'title' | 'description' | 'date' | RatingID
  type SortDir = 'asc' | 'desc'

  let sort: SortField = 'title'
  let dir: SortDir = 'asc'

  $: hasDates = $items.some(({ date }) => Boolean(date))
  $: tableItems = $items.map(
    ({ title, description, date, image, url, ratings }) => ({
      title,
      description,
      date,
      image,
      url,
      ratings,
      ...mapValues(ratings, (rating) => rating?.value),
    }),
  )
  $: ratingIds = Object.keys(tableItems[0]).filter((key) =>
    ['tmdb', 'imdb', 'rt', 'meta'].includes(key),
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
</script>

<div class="overflow-x-auto w-full">
  <table class="table table-zebra table-compact w-full">
    <thead class="border-b border-slate-500">
      <tr>
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
          <th class="p-0 w-48">
            <button
              class="btn btn-ghost btn-block h-20 justify-start rounded-none"
              on:click={() => handleSort(id)}
            >
              {tableItems[0]?.ratings?.[id]?.label ?? id}
              {#if sort === id && dir}
                {dir === 'asc' ? '↑' : '↓'}
              {/if}
            </button>
          </th>
        {/each}
      </tr>
    </thead>
    <tbody>
      {#each sortedItems as { title, description, date, image, url, ratings }}
        <tr class="hover">
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
          <th class="px-4">{tableItems[0]?.ratings?.[id]?.label ?? id}</th>
        {/each}
      </tr>
    </tfoot>
  </table>
</div>
