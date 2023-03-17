import { derived, type Readable } from 'svelte/store'
import type {
  Configuration$result,
  ConfigurationStore,
  QueryStore,
} from '$houdini'
import type { LocalGraphQLObject } from '$lib/types/graphql'
import { imagesStore } from './imagesStore'

interface ResultItem {
  id: number
}

interface Result extends LocalGraphQLObject, ResultItem {}

interface ResultList<T extends Result> extends LocalGraphQLObject {
  page: number
  totalPages: number
  results?: T[]
}

type Images = NonNullable<Configuration$result['configuration']['images']>

export interface Pagination {
  page: number
  totalPages: number
  nextPage: () => unknown
  fetching: boolean
}

export function itemsStore<
  Data extends LocalGraphQLObject,
  T extends Result,
  Item extends ResultItem,
>(
  config: ConfigurationStore,
  store: QueryStore<Data, Record<string, unknown>>,
  listTransformer: (data: Data) => T[] | undefined,
  transformer: (result: T, images: Images) => Item,
  conditional?: Readable<boolean>,
) {
  const errors = derived(store, ({ errors, fetching }) => {
    if (fetching) return
    if (errors && errors.length > 0) return errors.map(({ message }) => message)
  })

  const images = imagesStore(config)

  const items = derived([images, store], ([$images, { data }]) => {
    if (!data || !$images) return

    const results = listTransformer(data)
    if (!results) return

    return results.map((result) => transformer(result, $images))
  })

  if (!conditional) return { errors, items }

  return {
    errors,
    items: derived([items, conditional], ([$items, $conditional]) => {
      return $conditional ? $items : undefined
    }),
  }
}

export interface PaginatedInput extends Record<string, unknown> {
  page?: number | null
}

export function itemsStorePaginated<
  Data extends LocalGraphQLObject,
  Input extends PaginatedInput,
  T extends Result,
  Item extends ResultItem,
>(
  config: ConfigurationStore,
  store: QueryStore<Data, Input>,
  resultTransformer: (data: Data) => ResultList<T>,
  transformer: (result: T, images: Images) => Item,
  conditional?: Readable<boolean>,
) {
  const { errors, items } = itemsStore(
    config,
    store,
    (data) => resultTransformer(data).results,
    transformer,
    conditional,
  )

  const pagination = derived(store, ({ data, fetching, variables }) => {
    if (!data) return

    const { page, totalPages } = resultTransformer(data)

    if (page === totalPages) return

    const nextPage = () => {
      if (page === totalPages) return

      return store.fetch({
        variables: { ...variables, page: page + 1 } as Input,
      })
    }

    return { page, totalPages, nextPage, fetching } as Pagination
  })

  if (!conditional) return { errors, pagination, items }

  return {
    errors,
    items,
    pagination: derived(
      [pagination, conditional],
      ([$pagination, $conditional]) => {
        return $conditional ? $pagination : undefined
      },
    ),
  }
}
