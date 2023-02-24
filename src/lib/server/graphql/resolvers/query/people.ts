import type { Resolver } from '$lib/server/graphql/types'
import { fetchJson, JsonError } from '$lib/server/tmdb'
import type {
  PersonListResultsPage,
  QueryPeopleArgs,
} from '$lib/types/graphql.generated'
import { GraphQLError } from 'graphql'
import { loadDefaults } from './defaultPayloads'

export const people = (async (
  _source,
  { query, page, includeAdult, region },
  { fetch },
) => {
  try {
    const { PeopleDefault } = await loadDefaults()
    const payload = await fetchJson<PersonListResultsPage>(
      fetch,
      'search',
      'person',
      {
        query,
        page,
        include_adult: includeAdult,
        region,
      },
      { defaultPayload: PeopleDefault },
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
}) satisfies Resolver<QueryPeopleArgs, PersonListResultsPage, never>
