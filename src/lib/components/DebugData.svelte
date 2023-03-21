<script lang="ts">
  import type { QueryStore } from '$houdini'
  import { debuggingStore } from '$lib/stores/debugging'

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  export let store: QueryStore<any, Record<string, unknown>>
</script>

{#if $debuggingStore && $store.data}
  <div
    class="collapse collapse-arrow border border-base-300 bg-base-100 rounded-box mt-4"
  >
    <input type="checkbox" class="peer" />
    <div class="collapse-title text-center">View Raw Response</div>
    <div class="collapse-content p-0">
      <pre class="border-base-300 border-t p-4 whitespace-pre-wrap"><code
          >{JSON.stringify($store.data, null, 2)}</code
        ></pre>
    </div>
  </div>
{/if}
