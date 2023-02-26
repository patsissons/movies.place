import type { QueryStore } from '$houdini'
import type { GraphQLObject } from 'houdini'
import { derived } from 'svelte/store'

interface Result extends GraphQLObject {
  id: number
}

interface ResultList<T extends Result> extends GraphQLObject {
  page: number
  totalPages: number
  results: T[]
}

export function itemsFromResultListStore<
  Data extends GraphQLObject,
  T extends Result,
  Item,
>(
  store: QueryStore<Data, Record<string, unknown>>,
  dataTransformer: (data: Data) => ResultList<T>,
  transformer: (result: T) => Item,
) {
  return derived(store, ({ data, errors, fetching }) => {
    if (!data || fetching) return {}
    if (errors && errors.length > 0)
      return { errors: errors.map(({ message }) => message) }

    const list = dataTransformer(data)
    const { page, totalPages, results } = list
    const items = results.map(transformer)

    return { page, totalPages, items }
  })
}
