import { error } from '@sveltejs/kit'
import { load_Configuration, load_Person } from '$houdini'
import type { PageLoad } from './$houdini'

export const load = (async (event) => {
  const {
    params: { id },
  } = event

  if (!id) throw error(404, { message: 'Actor id missing' })

  const [{ Configuration }, { Person }] = await Promise.all([
    load_Configuration({ event }),
    load_Person({ event, variables: { id: Number(id) } }),
  ])

  return {
    Configuration,
    PersonStore: Person,
  }
}) satisfies PageLoad
