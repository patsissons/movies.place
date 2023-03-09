import type { Context } from '$lib/server/graphql/types'
import type { PersonCastCredit as PersonCastCreditType } from '$lib/types/graphql.generated'
import type { IObjectTypeResolver } from '@graphql-tools/utils'
import { movie } from './movie'

export const PersonCastCredit: IObjectTypeResolver<
  PersonCastCreditType,
  Context,
  unknown
> = {
  movie,
}
