import { fetchJson, type FetchOptions } from './json'

export interface MovieName {
  title: string
}

const endpoints = {
  names: '',
} as const

export async function fetchMovieNames(options?: FetchOptions) {
  const endpoint = endpoints.names
  if (!endpoint) throw new Error('movies.place is coming soon 🎉')

  const names = await fetchJson<MovieName[]>(endpoint, options)

  return names.map(({ title }) => title)
}
