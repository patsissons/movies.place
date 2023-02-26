<script lang="ts">
  export let type: string
  export let page: number | undefined
  export let totalPages: number | undefined
  export let nextPage: () => unknown
</script>

{#if page && totalPages && page < totalPages}
  <div class="text-center p-5">
    <button class="btn btn-ghost btn-xs" on:click={nextPage}>
      <p class="text-orange-500 dark:text-yellow-500 normal-case">
        {`Load the next page of ${type} (${page} / ${totalPages})`}
      </p>
    </button>
  </div>
{/if}
