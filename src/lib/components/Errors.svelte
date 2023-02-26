<script lang="ts">
  import type { Readable } from 'svelte/store'
  import Error from './Error.svelte'

  export let errors: Readable<string[] | undefined>
</script>

{#if $errors && $errors.length > 0}
  <div class="flex flex-col gap-4">
    {#each $errors as error}
      <Error {error} />
    {/each}
  </div>
{/if}
