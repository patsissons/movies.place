import { error } from '@sveltejs/kit'
import { load_Person } from '$houdini'
import type { PageLoad } from './$houdini'

export const load = (async (event) => {
  const {
    params: { ids },
  } = event

  if (!ids) throw error(404, { message: 'Actors ids missing' })

  const idList = ids.split(',')
  if (idList.length === 0) throw error(404, { message: 'Actors ids empty' })

  const PeopleStores = await Promise.all(
    idList.map((id) =>
      load_Person({ event, variables: { id: Number(id) } }).then(
        ({ Person }) => Person,
      ),
    ),
  )

  return {
    PeopleStores,
  }
}) satisfies PageLoad
