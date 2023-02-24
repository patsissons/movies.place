import { isDevelopment } from '$lib/server/env'

export async function loadDefaults() {
  if (!isDevelopment) return {}

  const Movie = await import('$lib/_ignore/Movie.json')
  const Movies = await import('$lib/_ignore/Movies.json')
  const People = await import('$lib/_ignore/People.json')
  const Person = await import('$lib/_ignore/Person.json')
  const SortedMovies = await import('$lib/_ignore/SortedMovies.json')

  return {
    MovieDefault: Movie.data.movie,
    MoviesDefault: Movies.data.movies,
    PeopleDefault: People.data.people,
    PersonDefault: Person.data.person,
    SortedMoviesDefault: SortedMovies.data.sortedMovies,
  }
}
