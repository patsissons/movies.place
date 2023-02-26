import type { ConfigurationStore } from '$houdini'
import { derived } from 'svelte/store'

export function baseUrlFromConfigStore(config: ConfigurationStore) {
  return derived(config, ({ data, errors, fetching }) => {
    if (!data || fetching || (errors && errors.length > 0)) return

    return data.configuration.images?.secureBaseUrl
  })
}
