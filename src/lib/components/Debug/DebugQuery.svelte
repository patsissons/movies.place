<script lang="ts">
  import type { QueryStore } from '$houdini'
  import DebugData from './DebugData.svelte'

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  export let store: QueryStore<any, Record<string, unknown>>
</script>

<DebugData data={$store.data} />
