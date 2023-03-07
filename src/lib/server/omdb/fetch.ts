import omitBy from 'lodash/omitBy'
import isNil from 'lodash/isNil'
import { OMDB_API_KEY } from '$lib/server/env'
import { fetchJson, type Fetch, type FetchOptions } from '$lib/server/fetchJson'

export const baseUrl = 'http://www.omdbapi.com/'
export const apiVersion = 1

export interface FetchParams
  extends Record<string, string | number | boolean | null | undefined> {
  /** IMDB id */
  i?: string
}

export async function fetchOMDBJson<Result = Record<string, unknown>>(
  fetch: Fetch,
  { i = '', ...params }: FetchParams,
  options?: FetchOptions,
) {
  const urlParams = new URLSearchParams(
    omitBy(
      {
        apikey: OMDB_API_KEY || '',
        v: String(apiVersion),
        i,
        ...params,
      },
      isNil,
    ),
  ).toString()
  const url = [baseUrl, urlParams].join('?')

  return fetchJson<Result>(fetch, url, options)
}
