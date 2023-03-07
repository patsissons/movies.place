import type { ConfigurationStore } from '$houdini'
import { derived } from 'svelte/store'

export function imagesStore(config: ConfigurationStore) {
  return derived(config, ({ data }) => {
    if (!data) return

    const { images } = data.configuration

    return images || undefined
  })
}
