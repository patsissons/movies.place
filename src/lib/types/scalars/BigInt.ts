import { BigIntResolver } from 'graphql-scalars'
import type { GraphQLBigIntConfig } from 'graphql-scalars/typings/scalars/BigInt'
import type { ScalarExternalType } from './types'

type BigIntType = ScalarExternalType<typeof GraphQLBigIntConfig>

export { BigIntResolver as BigInt, type BigIntType }
