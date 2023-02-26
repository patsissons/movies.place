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
  const errors = derived(store, ({ errors, fetching }) => {
    if (fetching) return
    if (errors && errors.length > 0) return errors.map(({ message }) => message)
  })

  const pagination = derived(store, ({ data, fetching }) => {
    if (!data || fetching) return {}

    const list = dataTransformer(data)
    const { page, totalPages } = list

    const nextPage = () => {
      if (page === totalPages) return

      return store.fetch({ variables: { page: page + 1 } })
    }

    return { page, totalPages, nextPage }
  })

  const items = derived(store, ({ data, fetching }) => {
    if (!data || fetching) return

    const { results } = dataTransformer(data)

    return results.map(transformer)
  })

  return { errors, pagination, items }
}
