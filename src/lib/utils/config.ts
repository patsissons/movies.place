import type { ConfigurationStore } from '$houdini'
import { derived } from 'svelte/store'

export function baseUrlFromConfigStore(config: ConfigurationStore) {
  return derived(config, ({ data, errors, fetching }) => {
    if (!data || fetching) return {}
    if (errors && errors.length > 0)
      return { errors: errors.map(({ message }) => message) }

    const baseUrl = data.configuration.images?.secureBaseUrl

    return { baseUrl }
  })
}
