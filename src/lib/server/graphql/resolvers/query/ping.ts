import type { Resolver } from '$lib/server/graphql/types'
import type { Pong } from '$lib/types/graphql.generated'

export interface QueryPingResponse {
  ping: Pong
}

export const ping = (() => {
  return {
    timestamp: new Date(),
  }
}) satisfies Resolver<never, Pong>
