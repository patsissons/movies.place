<script lang="ts">
  import type { Pagination } from '$lib/stores'
  import type { Readable } from 'svelte/store'

  export let type: string
  export let pagination: Readable<Pagination | undefined>
</script>

{#if $pagination}
  <div class="text-center p-5">
    <button class="btn btn-ghost btn-xs" on:click={$pagination.nextPage}>
      <p class="text-orange-500 dark:text-yellow-500 normal-case">
        {`Load the next page of ${type} (${$pagination.page} / ${$pagination.totalPages})`}
      </p>
    </button>
  </div>
{/if}
