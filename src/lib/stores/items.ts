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
  results?: T[]
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
  listTransformer: (data: Data) => T[] | undefined,
  transformer: (result: T) => Item,
) {
  const errors = derived(store, ({ errors, fetching }) => {
    if (fetching) return
    if (errors && errors.length > 0) return errors.map(({ message }) => message)
  })

  const items = derived(store, ({ data, fetching }) => {
    if (!data || fetching) return

    const results = listTransformer(data)
    if (!results) return

    return results.map(transformer)
  })

  return { errors, items }
}

export interface PaginatedInput extends Record<string, unknown> {
  page?: number | null
}

export function itemsStorePaginated<
  Data extends GraphQLObject,
  Input extends PaginatedInput,
  T extends Result,
  Item extends ResultItem,
>(
  store: QueryStore<Data, Input>,
  resultTransformer: (data: Data) => ResultList<T>,
  transformer: (result: T) => Item,
) {
  const { errors, items } = itemsStore(
    store,
    (data) => resultTransformer(data).results,
    transformer,
  )

  const pagination = derived(store, ({ data, fetching }) => {
    if (!data) return

    const { page, totalPages } = resultTransformer(data)

    const nextPage = () => {
      if (page === totalPages) return

      return store.fetch({ variables: { page: page + 1 } as Input })
    }

    return { page, totalPages, nextPage, fetching } as Pagination
  })

  return { errors, pagination, items }
}
