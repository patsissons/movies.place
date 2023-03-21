// import { useGraphQlJit } from '@envelop/graphql-jit'
import { useResponseCache } from '@graphql-yoga/plugin-response-cache'
import { print } from 'graphql'
import { createYoga } from 'graphql-yoga'
import { context } from './context'
import { schema } from './schema'
import type { Context } from './types'

import ConfigurationQuery from '$lib/client/graphql/Configuration.graphql'
import MovieQuery from '$lib/client/graphql/Movie.graphql'
import MoviesQuery from '$lib/client/graphql/Movies.graphql'
import PeopleQuery from '$lib/client/graphql/People.graphql'
import PersonQuery from '$lib/client/graphql/Person.graphql'
import SortedMoviesQuery from '$lib/client/graphql/SortedMovies.graphql'
import SortedPeopleQuery from '$lib/client/graphql/SortedPeople.graphql'

export const server = createYoga<Context>({
  logging: true,
  schema,
  context,
  plugins: [
    // graphql-jit is causing annoying error handling issues on data type mismatches
    // e.g., Cannot destructure property 'http' of 'err.extensions' as it is undefined.
    // see: omitInternalsFromError in graphql-yoga
    // useGraphQlJit(),

    useResponseCache({
      // global cache
      session: () => null,
      // default TTL is Infinity
    }),
  ],
  graphqlEndpoint: '/api/graphql',
  graphiql: {
    title: 'movies.place GraphiQL explorer',
    defaultQuery: `
${print(SortedMoviesQuery)}
${print(MoviesQuery)
  .replaceAll('$query', '$movieQuery')
  .replace('$movieQuery: String!', '$movieQuery: String! = "skyfall"')}
${print(MovieQuery)
  .replaceAll('$id', '$movieId')
  .replace('$movieId: Int!', '$movieId: Int! = 37724')}
${print(SortedPeopleQuery)}
${print(PeopleQuery)
  .replaceAll('$query', '$peopleQuery')
  .replace('$peopleQuery: String!', '$peopleQuery: String! = "Daniel Craig"')}
${print(PersonQuery)
  .replaceAll('$id', '$personId')
  .replace('$personId: Int!', '$personId: Int! = 8784')}
${print(ConfigurationQuery)}
`.trim(),
  },
  fetchAPI: globalThis,
})
