import type { Context } from '$lib/server/graphql/types'
import type { Movie as MovieType } from '$lib/types/graphql.generated'
import type { IObjectTypeResolver } from '@graphql-tools/utils'
import { omdb } from './omdb'

export const Movie: IObjectTypeResolver<MovieType, Context, unknown> = {
  omdb,
}
