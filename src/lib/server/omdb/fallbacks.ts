import { useFallbacks } from '$lib/server/env'

function fallback(name: string) {
  return `/data/_ignore/omdb/${name}.json`
}

export const fallbacks = useFallbacks
  ? {
      movie: fallback('Movie'),
    }
  : {}
