import type { GraphQLObject, GraphQLValue, QueryStore } from '$houdini'
import type { LocalGraphQLValue } from './scalars'
export * from './scalars'

export type LocalGraphQLObject = GraphQLObject & {
  [key: string]: GraphQLValue | LocalGraphQLValue
}

export type WithoutCustomScalars<T> = {
  [K in keyof T]: T[K] extends object | null
    ? WithoutCustomScalars<T[K]>
    : T[K] extends GraphQLValue
    ? T[K]
    : never
}

export type QueryStoreWithoutCustomScalars<
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  Store extends QueryStore<any, any>,
  Result extends object,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
> = Store extends QueryStore<any, infer Input>
  ? QueryStore<WithoutCustomScalars<Result>, Input>
  : never
