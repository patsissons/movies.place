import omitBy from 'lodash/omitBy'
import isNil from 'lodash/isNil'
import { TMDB_API_KEY } from '$lib/server/env'
import {
  fetchJson,
  JsonError,
  type Fetch,
  type FetchOptions,
} from '$lib/server/fetchJson'

export const baseUrl = 'https://api.themoviedb.org'
export const apiVersion = 3
export const baseApiUrl = [baseUrl, apiVersion].join('/')
export const defaultLanguage = 'en-US'

export class TMDBError extends Error {
  public static statusMessage(response: string) {
    const json = tryParseJson()
    if (!json) return

    if ('status_message' in json && typeof json.status_message === 'string') {
      return json.status_message
    }

    function tryParseJson() {
      try {
        return JSON.parse(response) as Record<string, unknown>
      } catch {
        // do nothing
      }
    }
  }

  constructor(url: string, error: string) {
    super(`Error fetching ${url}: ${error}`)
  }
}

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

  try {
    return fetchJson<Result>(fetch, url, options)
  } catch (error) {
    if (error instanceof JsonError) {
      const statusMessage = TMDBError.statusMessage(error.response)
      if (statusMessage) throw new TMDBError(error.url, statusMessage)

      throw error
    }

    throw new TMDBError(
      url,
      error instanceof Error ? error.message : String(error),
    )
  }
}
