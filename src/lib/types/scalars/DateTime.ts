import { DateTimeResolver } from 'graphql-scalars'
import type { GraphQLDateTimeConfig } from 'graphql-scalars/typings/scalars/iso-date/DateTime'
import type { ScalarExternalType } from './types'

type DateTimeType = ScalarExternalType<typeof GraphQLDateTimeConfig>

export { DateTimeResolver as DateTime, type DateTimeType }
