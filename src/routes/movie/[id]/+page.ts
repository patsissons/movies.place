import { load_Movie } from '$houdini'
import type { PageLoad } from './$types'

export const load = (async (event) => {
  const {
    params: { id },
  } = event

  if (!id) return {}

  const { Movie } = await load_Movie({ event, variables: { id: Number(id) } })

  return {
    MovieStore: Movie,
  }
}) satisfies PageLoad
