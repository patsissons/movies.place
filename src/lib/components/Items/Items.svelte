<script lang="ts">
  import escapeRegExp from 'lodash/escapeRegExp'
  import { derived, writable, type Readable, type Writable } from 'svelte/store'
  import Input from '$lib/components/Input.svelte'
  import { Errors } from '$lib/components/Errors'
  import type { Pagination as PaginationState } from '$lib/stores'
  import ItemGrid from './ItemGrid.svelte'
  import Tabs from './Tabs.svelte'
  import type { Item, ItemImage } from './types'
  import Pagination from '../Pagination.svelte'
  import ItemTable from './ItemTable.svelte'
  import type { ItemList } from '$lib/stores/items'

  export let baseUrl: Readable<string | undefined>
  export let errors: Readable<string[] | undefined>
  export let fetching: Readable<boolean>
  export let items: Readable<ItemList<Item> | undefined>
  export let itemType: 'movies' | 'actors'
  export let descriptionLabel: string | undefined = undefined
  export let pagination: Readable<PaginationState | undefined> | undefined =
    undefined
  export let filterable = false
  export let selectedItems: Writable<number[]> | undefined = undefined
  export let queryFilter: Readable<string> | undefined = undefined
  export let refImages:
    | Readable<Record<number, ItemImage | undefined> | undefined>
    | undefined = undefined

  const filter = writable('')
  const loaded = writable<{
    list?: Item[]
    query?: string
    page?: number
  }>({})

  derived([loaded, items, fetching], (x) => x).subscribe(
    ([$loaded, $items, $fetching]) => {
      if ($fetching) return
      if (!$items) {
        if (!$loaded.list) return

        loaded.set({})
        return
      }

      const { query = '', page = 1 } = $items.variables as {
        query?: string
        page?: number
      }

      if (!$loaded.list || $loaded.query !== query) {
        loaded.set({ list: $items.list, query, page })
        return
      }

      if ($loaded.page !== page) {
        loaded.set({ list: [...$loaded.list, ...$items.list], query, page })
      }
    },
  )

  const filteredItems = derived([filter, loaded], ([$filter, { list }]) => {
    if (!list) return []

    const regex = filterRegex($filter)
    if (!regex) return list

    return list.filter(({ title, description, date }) =>
      [title, description, date].some((field) => field && regex.test(field)),
    )
  })

  function filterRegex(filter: string) {
    try {
      if (!filter) return

      return new RegExp(filter, 'i')
    } catch {
      return new RegExp(escapeRegExp(filter))
    }
  }

  function handleSelectionChanged({
    detail: { id },
  }: CustomEvent<{ id: number }>) {
    if (!selectedItems) return

    selectedItems.update((values) => {
      const selected = values.includes(id)
      if (selected) return values.filter((value) => value !== id)

      return values.concat(id)
    })
  }
</script>

<Errors {errors} />
<div class="w-80 mx-auto">
  {#if filterable && $loaded.list}
    <Input
      placeholder={`Filter ${$loaded.list.length} ${itemType} below...`}
      center
      fullWidth
      bind:value={$filter}
    />
  {/if}
  <div class="p-1 text-center">
    {#if $fetching}
      <progress class="progress progress-secondary w-full" />
    {:else}
      <progress class="progress w-full" value={0} max={100} />
    {/if}
  </div>
</div>
{#if $filteredItems.length > 0}
  <Tabs>
    <span slot="grid">
      <ItemGrid
        {baseUrl}
        items={filteredItems}
        {selectedItems}
        on:selectionChanged={handleSelectionChanged}
      />
    </span>
    <span slot="table">
      <ItemTable
        {baseUrl}
        items={filteredItems}
        {descriptionLabel}
        {selectedItems}
        {refImages}
        on:selectionChanged={handleSelectionChanged}
      />
    </span>
  </Tabs>
{:else if !$fetching}
  <div class="p-4 text-center">
    {#if $queryFilter}
      <p>{`No ${itemType} found for "${$queryFilter}"`}</p>
    {:else}
      <p>
        <span class="whitespace-nowrap"> Not sure what to look for? </span>
        <span class="whitespace-nowrap">
          Try browsing
          <a class="text-secondary font-bold" href={`/${itemType}`}>
            popular {itemType}
          </a>
        </span>
      </p>
    {/if}
  </div>
{/if}
{#if pagination}
  <Pagination type={itemType} {pagination} />
{/if}
