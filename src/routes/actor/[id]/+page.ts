import { error } from '@sveltejs/kit'
import { load_Person } from '$houdini'
import type { PageLoad } from './$houdini'

export const load = (async (event) => {
  const {
    params: { id },
  } = event

  if (!id) throw error(404, { message: 'Actor id missing' })

  const { Person } = await load_Person({ event, variables: { id: Number(id) } })

  return {
    PersonStore: Person,
  }
}) satisfies PageLoad
