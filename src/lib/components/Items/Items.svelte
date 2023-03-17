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

  export let baseUrl: Readable<string | undefined>
  export let errors: Readable<string[] | undefined>
  export let fetching: Readable<boolean>
  export let items: Readable<Item[] | undefined>
  export let itemType: 'movies' | 'actors'
  export let descriptionLabel: string | undefined = undefined
  export let pagination: Readable<PaginationState | undefined> | undefined =
    undefined
  export let filterable = false
  export let queryFilter: Readable<string> | undefined = undefined

  let itemMap = new Map<number, Item>()
  const filter = writable('')

  queryFilter?.subscribe(resetList)

  const loadedItems = derived(items, ($items) => {
    if (!$items) return

    $items.forEach((item) => {
      if (!itemMap.has(item.id)) itemMap.set(item.id, item)
    })

    return Array.from(itemMap.values())
  })

  const filteredItems = derived([filter, loadedItems], ([$filter, $items]) => {
    if (!$items) return []

    const regex = filterRegex($filter)
    if (!regex) return $items

    return $items.filter(({ title, description, date }) =>
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

  function resetList() {
    console.info('resetting list...')
    itemMap = new Map<number, Item>()
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
        Not sure what to look for? try browsing <a
          class="text-secondary font-bold"
          href={`/${itemType}`}>popular {itemType}</a
        >
      </p>
    {/if}
  </div>
{/if}
{#if pagination}
  <Pagination type={itemType} {pagination} />
{/if}
