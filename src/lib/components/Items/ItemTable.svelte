<script lang="ts">
  import orderBy from 'lodash/orderBy'
  import type { Readable } from 'svelte/store'
  import Rating from './Rating.svelte'
  import type { Item } from './types'

  export let items: Readable<Item[]>
  export let baseUrl: Readable<string | undefined>
  export let descriptionLabel: string

  type SortField = 'title' | 'description' | 'rating'
  type SortDir = 'asc' | 'desc'

  let sort: SortField = 'title'
  let dir: SortDir = 'asc'

  $: sortedItems = orderBy($items, [sort], [dir])

  function handleSort(field: typeof sort) {
    if (!sort) {
      sort = field
      dir = 'asc'
    } else if (sort === field) {
      dir = dir === 'asc' ? 'desc' : 'asc'
    } else {
      sort = field
      dir = 'asc'
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
        <th class="p-0 w-48">
          <button
            class="btn btn-ghost btn-block h-20 justify-start rounded-none"
            on:click={() => handleSort('rating')}
          >
            Rating
            {#if sort === 'rating' && dir}
              {dir === 'asc' ? '↑' : '↓'}
            {/if}
          </button>
        </th>
      </tr>
    </thead>
    <tbody>
      {#each sortedItems as { title, description, image, rating, url }}
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
                      <img
                        src={[$baseUrl, image.small].join('')}
                        alt={`${title} poster`}
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
          <td class="p-0">
            {#if rating}
              <a
                class="btn btn-ghost btn-block h-20 justify-start rounded-none p-4"
                href={url}
              >
                <Rating {rating} />
              </a>
            {/if}
          </td>
        </tr>
      {/each}
    </tbody>
    <tfoot class="border-t border-slate-500">
      <tr>
        <th>Title</th>
        <th>{descriptionLabel}</th>
        <th>Rating</th>
      </tr>
    </tfoot>
  </table>
</div>
