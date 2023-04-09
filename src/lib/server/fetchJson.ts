import { camelize } from '$lib/server/graphql/utils'

export type Fetch = typeof fetch

export class JsonError extends Error {
  constructor(
    public readonly url: string,
    public readonly status: number,
    public readonly response: string,
  ) {
    super(`Error fetching ${url}: ${status} ${response}`)
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
    // console.log('D', `wget -q -O- "${url}"`)
    const response = await fetch(url, {
      headers: {
        accept: 'application/json; charset=utf8;',
        'Content-Type': 'application/json',
      },
      method: 'GET',
    })

    if (!response.ok) {
      const body = await response.text()

      throw new JsonError(url, response.status, body)
    }

    const payload = (await response.json()) as Record<string, unknown>

    // console.log('D', payload)

    return camelize<Result>(payload)
  } catch (error) {
    // console.log('E', error)
    if (fallbackUrl) {
      return await fetchJson<Result>(fetch, fallbackUrl)
    }

    throw error
  }
}
