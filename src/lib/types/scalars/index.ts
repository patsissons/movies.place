import type { BigIntType } from './BigInt'
import type { DateType } from './Date'
import type { DateTimeType } from './DateTime'

export { BigInt } from './BigInt'
export { Date } from './Date'
export { DateTime } from './DateTime'

export type LocalGraphQLScalars = BigIntType | DateType | DateTimeType
