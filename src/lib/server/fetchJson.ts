import { camelize } from '$lib/server/graphql/utils'

export type Fetch = typeof fetch

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

export interface FetchOptions {
  fallbackUrl?: string
}

export async function fetchJson<Result = Record<string, unknown>>(
  fetch: Fetch,
  url: string,
  { fallbackUrl }: FetchOptions = {},
): Promise<Result> {
  try {
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

    return camelize<Result>(payload)
  } catch (error) {
    if (fallbackUrl) {
      const { data } = await fetchJson<{ data: Record<string, Result> }>(
        fetch,
        fallbackUrl,
      )
      const [field] = Object.keys(data)

      return data[field]
    }

    throw error
  }
}

export function tryParseJson<Result = unknown>(text: string) {
  try {
    return JSON.parse(text) as Result
  } catch {
    // do nothing
  }
}
