import { isDevelopment } from '$lib/server/env'

function fallback(name: string) {
  return `/data/_ignore/tmdb/${name}.json`
}

export const fallbacks = isDevelopment
  ? {
      configuration: fallback('Configuration'),
      movie: fallback('Movie'),
      movies: fallback('Movies'),
      people: fallback('People'),
      person: fallback('Person'),
      sortedMovies: fallback('SortedMovies'),
      sortedPeople: fallback('SortedPeople'),
    }
  : {}
