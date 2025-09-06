import { error } from '@sveltejs/kit'
import { load_Configuration, load_Movie } from '$houdini'
import type { PageLoad } from './$houdini'

export const load = (async (event) => {
  const {
    params: { id },
  } = event

  if (!id) throw error(429, { message: 'Missing movie ID' })

  const [{ Configuration }, { Movie }] = await Promise.all([
    load_Configuration({ event }),
    load_Movie({ event, variables: { id: Number(id) } }),
  ])

  return {
    Configuration,
    MovieStore: Movie,
  }
}) satisfies PageLoad
