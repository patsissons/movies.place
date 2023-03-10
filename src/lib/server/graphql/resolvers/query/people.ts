import { JsonError } from '$lib/server/fetchJson'
import type { Resolver } from '$lib/server/graphql/types'
import { fetchTMDBJson } from '$lib/server/tmdb'
import type {
  PersonListResultsPage,
  QueryPeopleArgs,
} from '$lib/types/graphql.generated'
import { GraphQLError } from 'graphql'
import { fallbacks } from '$lib/server/tmdb/fallbacks'

export const people = (async (
  _source,
  { query, page, includeAdult, region },
  { fetch },
) => {
  try {
    const payload = await fetchTMDBJson<PersonListResultsPage>(
      fetch,
      'search',
      'person',
      {
        query,
        page,
        include_adult: includeAdult,
        region,
      },
      { fallbackUrl: fallbacks.people },
    )

    payload.results.forEach((result) => {
      result.knownFor = result.knownFor.filter((item) => {
        const mediaType = (item as Record<string, unknown>).mediaType as
          | string
          | undefined
        if (!mediaType) return true

        return mediaType === 'movie'
      })
    })

    return payload
  } catch (error) {
    if (error instanceof JsonError) {
      throw new GraphQLError(error.message)
    }

    throw error
  }
}) satisfies Resolver<QueryPeopleArgs, PersonListResultsPage, unknown>
