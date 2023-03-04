<script lang="ts">
  import type { Readable } from 'svelte/store'
  import type { Item } from './types'

  export let items: Readable<Item[]>
  export let baseUrl: Readable<string | undefined>

  type SortField = 'title' | 'description' | 'rating'
  type SortDir = 'asc' | 'desc'

  let sort: SortField | undefined
  let dir: SortDir | undefined

  $: sortedItems = $items.sort((a, b) => {
    if (sort === 'title') {
      if (dir === 'asc') {
        return a.title.localeCompare(b.title)
      } else if (dir === 'desc') {
        return b.title.localeCompare(a.title)
      }
    }

    if (sort === 'description') {
      if (dir === 'asc') {
        if (!a.description) return -1
        if (!b.description) return 1

        return a.description.localeCompare(b.description)
      } else if (dir === 'desc') {
        if (!a.description) return -1
        if (!b.description) return 1

        return b.description.localeCompare(a.description)
      }
    }

    return 0
  })

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
  <table class="table table-zebra w-full">
    <!-- head -->
    <thead>
      <tr>
        <th>
          <button class="btn btn-ghost" on:click={() => handleSort('title')}>
            Title
            {#if sort === 'title' && dir}
              {dir === 'asc' ? '↑' : '↓'}
            {/if}
          </button>
        </th>
        <th>
          <button
            class="btn btn-ghost"
            on:click={() => handleSort('description')}
          >
            Description
            {#if sort === 'description' && dir}
              {dir === 'asc' ? '↑' : '↓'}
            {/if}
          </button>
        </th>
        <th>
          <button class="btn btn-ghost" on:click={() => handleSort('rating')}>
            Rating
            {#if sort === 'rating' && dir}
              {dir === 'asc' ? '↑' : '↓'}
            {/if}
          </button>
        </th>
      </tr>
    </thead>
    <tbody>
      {#each $items as { title, description, image, rating, url }}
        <tr class="hover">
          <td class="p-0">
            <a class="block w-full p-4" href={url}>
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
            <a class="block w-full p-4" href={url}>
              <p>{description}</p>
            </a>
          </td>
          <td class="p-0">
            <a class="block w-full p-4" href={url}>
              <p>{rating}</p>
            </a>
          </td>
        </tr>
      {/each}
    </tbody>
    <!-- foot -->
    <tfoot>
      <tr>
        <th>Title</th>
        <th>Description</th>
        <th>Rating</th>
      </tr>
    </tfoot>
  </table>
</div>
