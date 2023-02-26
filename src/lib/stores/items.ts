import type { QueryStore } from '$houdini'
import type { GraphQLObject } from 'houdini'
import { derived } from 'svelte/store'

interface ResultItem {
  id: number
}

interface Result extends GraphQLObject, ResultItem {}

interface ResultList<T extends Result> extends GraphQLObject {
  page: number
  totalPages: number
  results: T[]
}

export interface Pagination {
  page: number
  totalPages: number
  nextPage: () => unknown
  fetching: boolean
}

export function itemsStore<
  Data extends GraphQLObject,
  T extends Result,
  Item extends ResultItem,
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
    if (!data) return

    const { page, totalPages } = dataTransformer(data)

    const nextPage = () => {
      if (page === totalPages) return

      return store.fetch({ variables: { page: page + 1 } })
    }

    return { page, totalPages, nextPage, fetching } as Pagination
  })

  const items = derived(store, ({ data, fetching }) => {
    if (!data || fetching) return

    const { results } = dataTransformer(data)

    return results.map(transformer)
  })

  return { errors, pagination, items }
}
