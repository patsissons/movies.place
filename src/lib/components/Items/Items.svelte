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
  export let items: Readable<Item[] | undefined>
  export let itemType: 'movies' | 'actors'
  export let descriptionLabel: string | undefined = undefined
  export let pagination: Readable<PaginationState | undefined> | undefined =
    undefined
  export let filterable = false
  export let resetKey: Readable<string> | undefined = undefined

  const itemMap = new Map<number, Item>()
  const filter = writable('')

  resetKey?.subscribe(() => itemMap.clear())

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
</script>

<Errors {errors} />
{#if filterable}
  <Input
    center
    placeholder={`Filter ${itemType} below...`}
    bind:value={$filter}
  />
{/if}
<Tabs>
  <span slot="grid"><ItemGrid {baseUrl} items={filteredItems} /></span>
  <span slot="table"
    ><ItemTable {baseUrl} items={filteredItems} {descriptionLabel} />
  </span>
</Tabs>
{#if pagination}
  <Pagination type={itemType} {pagination} />
{/if}
