import { derived, type Readable } from 'svelte/store'
import type { Item } from './types'

export function lastLengthStore(items: Readable<Item[]>) {
  const lengths = [0, 0]

  return derived(items, ($items) => {
    const length = $items.length

    lengths.shift()
    lengths.push(length)

    return lengths[0]
  })
}
