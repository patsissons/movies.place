<script lang="ts">
  import escapeRegExp from 'lodash/escapeRegExp'
  import { derived, writable, type Readable } from 'svelte/store'
  import Input from '$lib/components/Input.svelte'
  import { Errors } from '$lib/components/Errors'
  import type { Pagination as PaginationState } from '$lib/stores'
  import ItemGrid from './ItemGrid.svelte'
  import Tabs from './Tabs.svelte'
  import type { Item } from './types'
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
  export let queryFilter: Readable<string> | undefined = undefined

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
</script>

<Errors {errors} />
{#if filterable}
  <Input
    center
    placeholder={`Filter ${itemType} below...`}
    bind:value={$filter}
  />
{/if}
{#if $filteredItems.length > 0}
  <Tabs>
    <span slot="grid"><ItemGrid {baseUrl} items={filteredItems} /></span>
    <span slot="table"
      ><ItemTable {baseUrl} items={filteredItems} {descriptionLabel} />
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
          <a class="text-secondary font-bold" href={`/${itemType}`}
            >popular {itemType}</a
          >
        </span>
      </p>
    {/if}
  </div>
{/if}
{#if pagination}
  <Pagination type={itemType} {pagination} />
{/if}
