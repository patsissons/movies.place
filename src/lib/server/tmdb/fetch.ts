import omitBy from 'lodash/omitBy'
import isNil from 'lodash/isNil'
import { TMDB_API_KEY } from '$lib/server/env'
import { fetchJson, type Fetch, type FetchOptions } from '$lib/server/fetchJson'

export const baseUrl = 'https://api.themoviedb.org'
export const apiVersion = 3
export const baseApiUrl = [baseUrl, apiVersion].join('/')
export const defaultLanguage = 'en-US'

export interface FetchParams
  extends Record<string, string | number | boolean | null | undefined> {
  language?: string
}

export async function fetchTMDBJson<Result = Record<string, unknown>>(
  fetch: Fetch,
  section: string,
  path?: string | number,
  { language = defaultLanguage, ...params }: FetchParams = {},
  options?: FetchOptions,
) {
  const endpointParts: (string | number)[] = [baseApiUrl, section]
  if (path) endpointParts.push(path)

  const endpoint = endpointParts.join('/')
  const urlParams = new URLSearchParams(
    omitBy(
      {
        api_key: TMDB_API_KEY || '',
        language,
        ...params,
      },
      isNil,
    ),
  ).toString()
  const url = [endpoint, urlParams].join('?')

  return fetchJson<Result>(fetch, url, options)
}
