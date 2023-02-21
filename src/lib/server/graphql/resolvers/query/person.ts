import type { Resolver } from '$lib/server/graphql/types'
import { fetchJson, JsonError } from '$lib/server/tmdb'
import type {
  Person,
  PersonCastCredit,
  QueryPersonArgs,
} from '$lib/types/graphql.generated'
import { GraphQLError } from 'graphql'

interface PersonPayload extends Omit<Person, 'cast'> {
  movieCredits: {
    cast: PersonCastCredit[]
  }
}

export const person = (async (_source, { id }, { fetch }) => {
  try {
    const {
      movieCredits: { cast },
      ...payload
    } = await fetchJson<PersonPayload>(fetch, 'person', id, {
      append_to_response: 'movie_credits',
    })

    return {
      ...payload,
      cast,
    }
  } catch (error) {
    if (error instanceof JsonError) {
      throw new GraphQLError(error.message)
    }

    throw error
  }
}) satisfies Resolver<QueryPersonArgs, Promise<Person>, never>
