<script lang="ts">
  import { debuggingEnabled } from '$lib/stores/debugging'

  export let data: Record<string, unknown> | unknown
  export let title = 'View Raw Response'
</script>

{#if $debuggingEnabled && data}
  <div
    class="collapse collapse-arrow border border-base-300 bg-base-100 rounded-box mt-4"
  >
    <input type="checkbox" class="peer" />
    <div class="collapse-title text-center">{title}</div>
    <div class="collapse-content p-0">
      <pre class="border-base-300 border-t p-4 whitespace-pre-wrap"><code
          >{JSON.stringify(data, null, 2)}</code
        ></pre>
    </div>
  </div>
{/if}
