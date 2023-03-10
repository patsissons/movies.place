import { JsonError } from '$lib/server/fetchJson'
import type { Resolver } from '$lib/server/graphql/types'
import { fetchTMDBJson } from '$lib/server/tmdb'
import type { Configuration } from '$lib/types/graphql.generated'
import { GraphQLError } from 'graphql'
import { fallbacks } from '$lib/server/tmdb/fallbacks'

export const configuration = (async (_source, _, { fetch }) => {
  try {
    return fetchTMDBJson<Configuration>(
      fetch,
      'configuration',
      undefined,
      undefined,
      { fallbackUrl: fallbacks.configuration },
    )
  } catch (error) {
    if (error instanceof JsonError) {
      throw new GraphQLError(error.message)
    }

    throw error
  }
}) satisfies Resolver<never, Promise<Configuration>, unknown>
