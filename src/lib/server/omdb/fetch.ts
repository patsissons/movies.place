import omitBy from 'lodash/omitBy'
import isNil from 'lodash/isNil'
import { OMDB_API_KEY } from '$lib/server/env'
import { fetchJson, type Fetch, type FetchOptions } from '$lib/server/fetchJson'

export const baseUrl = 'http://www.omdbapi.com/'
export const apiVersion = 1

export interface OMDBErrorResponse {
  response: 'False'
  error: string
}

export class OMDBError extends Error {}

export function isOMDBError(result: unknown): result is OMDBErrorResponse {
  if (!result || typeof result !== 'object') return false
  if ('response' in result && 'error' in result && result.response === 'False')
    return true

  return false
}

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

  const result = await fetchJson<Result | OMDBErrorResponse>(
    fetch,
    url,
    options,
  )

  if (isOMDBError(result)) throw new OMDBError(result.error)

  return result
}
