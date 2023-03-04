import type { GraphQLScalarTypeConfig } from 'graphql'

export type ScalarExternalType<ScalarType> =
  ScalarType extends GraphQLScalarTypeConfig<unknown, infer External>
    ? External
    : never
