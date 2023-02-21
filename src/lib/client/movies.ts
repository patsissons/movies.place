import { fetchText, type FetchOptions } from './json'

export interface MovieName {
  title: string
}

const endpoints = {
  names: 'https://datasets.imdbws.com/title.akas.tsv.gz',
} as const

export async function fetchMovieNames(options?: FetchOptions) {
  const endpoint = endpoints.names
  if (!endpoint) throw new Error('movies.place is coming soon 🎉')

  const text = await fetchText(endpoint, options)
  const rows = text.split('\n')
  return rows.map((row) => {
    const [, , title] = row.split('\t')

    return title
  })
}
