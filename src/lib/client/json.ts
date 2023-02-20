export interface FetchOptions {
  fetch?: typeof fetch
}

export async function fetchJson<T = unknown>(
  path: string,
  { fetch = window.fetch }: FetchOptions = {},
): Promise<T> {
  const response = await fetch(path, {
    headers: {
      'Content-Type': 'application/json',
    },
    method: 'GET',
  })

  if (!response.ok) {
    const body = await response.text()
    const json = tryParseJson(body)

    if (
      json &&
      typeof json === 'object' &&
      'message' in json &&
      typeof json.message === 'string'
    ) {
      throw new Error(json.message)
    }

    console.error(body || 'unexpected error')
    throw new Error(`unable to fetch: ${path}`)
  }

  return response.json() as Promise<T>
}

function tryParseJson(text: string): unknown {
  try {
    return JSON.parse(text)
  } catch {
    // do nothing
  }
}
