import { load_Person } from '$houdini'
import type { PageLoad } from './$types'

export const load = (async (event) => {
  const {
    params: { id },
  } = event

  if (!id) return {}

  const { Person } = await load_Person({ event, variables: { id: Number(id) } })

  return {
    PersonStore: Person,
  }
}) satisfies PageLoad
