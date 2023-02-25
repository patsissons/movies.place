import { GraphQLError } from 'graphql'
import type { Resolver } from '$lib/server/graphql/types'
import { fetchJson, JsonError } from '$lib/server/tmdb'
import type {
  PersonListResultsPage,
  QuerySortedPeopleArgs,
} from '$lib/types/graphql.generated'
import { loadDefaults } from './defaultPayloads'

export const sortedPeople = (async (
  _source,
  { sort, page, region },
  { fetch },
) => {
  try {
    const { SortedPeopleDefault } = await loadDefaults()

    const payload = await fetchJson<PersonListResultsPage>(
      fetch,
      'person',
      (sort || 'POPULAR').toLowerCase(),
      { page, region },
      { defaultPayload: SortedPeopleDefault },
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
}) satisfies Resolver<QuerySortedPeopleArgs, PersonListResultsPage, never>
