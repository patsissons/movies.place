import { GraphQLError } from 'graphql'
import type { Resolver } from '$lib/server/graphql/types'
import { fetchTMDBJson } from '$lib/server/tmdb'
import type {
  PersonListResultsPage,
  QuerySortedPeopleArgs,
} from '$lib/types/graphql.generated'
import { fallbacks } from '$lib/server/tmdb/fallbacks'
import { JsonError } from '$lib/server/fetchJson'

export const sortedPeople = (async (
  _source,
  { sort, page, region },
  { fetch },
) => {
  try {
    const payload = await fetchTMDBJson<PersonListResultsPage>(
      fetch,
      'person',
      (sort || 'POPULAR').toLowerCase(),
      { page, region },
      { fallbackUrl: fallbacks.sortedPeople },
    )

    payload.results.forEach((result) => {
      result.knownFor = result.knownFor.filter((item) => {
        const mediaType = (item as Record<string, unknown>).mediaType as string

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
}) satisfies Resolver<QuerySortedPeopleArgs, PersonListResultsPage, unknown>
