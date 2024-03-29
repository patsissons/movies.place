import type { IResolvers } from '@graphql-tools/utils'
import { configuration } from './configuration'
import { movie } from './movie'
import { movies } from './movies'
import { omdbMovie } from './omdbMovie'
import { people } from './people'
import { person } from './person'
import { ping } from './ping'
import { sortedMovies } from './sortedMovies'
import { sortedPeople } from './sortedPeople'

export const Query: IResolvers = {
  configuration,
  movie,
  movies,
  omdbMovie,
  people,
  person,
  ping,
  sortedMovies,
  sortedPeople,
}
