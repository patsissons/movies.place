import type { Resolver } from '$lib/server/graphql/types'
import { fetchJson, JsonError } from '$lib/server/tmdb'
import type { Configuration } from '$lib/types/graphql.generated'
import { GraphQLError } from 'graphql'
import { fallbacks } from './fallbacks'

export const configuration = (async (_source, _, { fetch }) => {
  try {
    return fetchJson<Configuration>(
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
}) satisfies Resolver<never, Promise<Configuration>, never>
