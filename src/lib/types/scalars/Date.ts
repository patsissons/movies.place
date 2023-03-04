import { DateResolver } from 'graphql-scalars'
import type { GraphQLDateConfig } from 'graphql-scalars/typings/scalars/iso-date/Date'
import type { ScalarExternalType } from './types'

type DateType = ScalarExternalType<typeof GraphQLDateConfig>

export { DateResolver as Date, type DateType }
