import type { Context } from '$lib/server/graphql/types'
import type { MovieCastCredit as MovieCastCreditType } from '$lib/types/graphql.generated'
import type { IObjectTypeResolver } from '@graphql-tools/utils'
import { actor } from './actor'

export const MovieCastCredit: IObjectTypeResolver<
  MovieCastCreditType,
  Context,
  unknown
> = {
  actor,
}
