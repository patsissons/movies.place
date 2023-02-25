import { redirect } from '@sveltejs/kit'
import type { PageLoad } from './movies/$types'

export const load = (() => {
  throw redirect(302, '/movies')
}) satisfies PageLoad
