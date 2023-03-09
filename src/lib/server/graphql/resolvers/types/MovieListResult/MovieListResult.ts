import type { Context } from '$lib/server/graphql/types'
import type { MovieListResult as MovieListResultType } from '$lib/types/graphql.generated'
import type { IObjectTypeResolver } from '@graphql-tools/utils'
import { movie } from './movie'

export const MovieListResult: IObjectTypeResolver<
  MovieListResultType,
  Context,
  unknown
> = {
  movie,
}
