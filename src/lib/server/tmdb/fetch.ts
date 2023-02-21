import omitBy from 'lodash/omitBy'
import isNil from 'lodash/isNil'
import { TMDB_API_KEY } from '$lib/server/env'
import { camelize } from '../graphql/utils'

export const baseUrl = 'https://api.themoviedb.org'
export const apiVersion = 3
export const baseApiUrl = [baseUrl, apiVersion].join('/')
export const defaultLanguage = 'en-US'

type Fetch = typeof fetch

export interface JsonErrorStatus {
  status_code: number
  status_message: string
}

export class JsonError extends Error {
  public static isJsonErrorStatus(
    payload: unknown,
  ): payload is JsonErrorStatus {
    if (!payload || typeof payload !== 'object') return false
    if ('status_code' in payload && 'status_message' in payload) return true

    return false
  }

  public readonly code: number

  constructor({ status_code, status_message }: JsonErrorStatus) {
    super(status_message)

    this.code = status_code
  }
}

export interface FetchParams
  extends Record<string, string | number | boolean | null | undefined> {
  language?: string
}

export async function fetchJson<T = Record<string, unknown>>(
  fetch: Fetch,
  section: string,
  path?: string | number,
  { language = defaultLanguage, ...options }: FetchParams = {},
) {
  const endpointParts: (string | number)[] = [baseApiUrl, section]
  if (path) endpointParts.push(path)

  const endpoint = endpointParts.join('/')
  const params = new URLSearchParams(
    omitBy(
      {
        api_key: TMDB_API_KEY || '',
        language,
        ...options,
      },
      isNil,
    ),
  ).toString()
  const url = [endpoint, params].join('?')

  // console.log('D', url)

  const response = await fetch(url, {
    headers: {
      accept: 'application/json; charset=utf8;',
      'Content-Type': 'application/json',
    },
    method: 'GET',
  })

  if (!response.ok) {
    const body = await response.text()
    const error = tryParseJson(body)

    if (JsonError.isJsonErrorStatus(error)) {
      throw new JsonError(error)
    } else {
      throw new Error(body)
    }
  }

  const payload = await response.json()

  // console.log('D', payload)

  return camelize<T>(payload)
}

function tryParseJson<T = unknown>(text: string) {
  try {
    return JSON.parse(text) as T
  } catch {
    // do nothing
  }
}
