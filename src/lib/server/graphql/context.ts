import type { RequestEvent } from '@sveltejs/kit'
import type { Context } from './types'

export function context({ fetch, request }: RequestEvent): Context {
  return {
    fetch,
    request,
  }
}
