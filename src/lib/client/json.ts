export interface FetchOptions {
  fetch?: typeof fetch
}

export async function fetchText(
  path: string,
  { fetch = window.fetch }: FetchOptions = {},
): Promise<string> {
  const response = await fetch(path, {
    headers: {
      accept: 'application/json; charset=utf8;',
      'Content-Type': 'application/json',
    },
    method: 'GET',
  })

  return response.text()
}
