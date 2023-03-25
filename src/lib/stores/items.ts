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

export interface ItemList<T> {
  list: T[]
  variables: Record<string, unknown>
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
  TSource extends Record<string, unknown>,
  TList extends Result,
  Item extends ResultItem,
>(
  config: ConfigurationStore,
  store: QueryStore<Data, Record<string, unknown>>,
  sourceTransformer: (data: Data) => TSource | null | undefined,
  listTransformer: (source: TSource) => TList[] | undefined,
  transformer: (result: TList, images: Images, source: TSource) => Item,
  conditional?: Readable<boolean>,
) {
  const errors = derived(store, ({ errors, fetching }) => {
    if (fetching) return
    if (errors && errors.length > 0) return errors.map(({ message }) => message)
  })

  const images = imagesStore(config)

  const items = derived([images, store], ([$images, { data, variables }]) => {
    if (!data || !$images) return

    const source = sourceTransformer(data)
    if (!source) return

    const results = listTransformer(source)
    if (!results) return

    return {
      list: results.map((result) => transformer(result, $images, source)),
      variables,
    } as ItemList<Item>
  })

  const fetching = derived(store, ({ fetching }) => fetching)

  const result = {
    errors,
    fetching,
  }

  if (!conditional) return { ...result, items }

  return {
    ...result,
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
  TList extends Result,
  Item extends ResultItem,
>(
  config: ConfigurationStore,
  store: QueryStore<Data, Input>,
  resultTransformer: (data: Data) => ResultList<TList>,
  transformer: (
    result: TList,
    images: Images,
    source: ResultList<TList>,
  ) => Item,
  conditional?: Readable<boolean>,
) {
  const result = itemsStore(
    config,
    store,
    (data) => resultTransformer(data),
    (result) => result.results,
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

  if (!conditional) return { ...result, pagination }

  return {
    ...result,
    pagination: derived(
      [pagination, conditional],
      ([$pagination, $conditional]) => {
        return $conditional ? $pagination : undefined
      },
    ),
  }
}
