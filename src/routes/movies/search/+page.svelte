<script lang="ts">
  import Input from '$lib/components/Input.svelte'

  let filter: string = ''

  function handleValue({ detail }: CustomEvent<string>) {
    filter = detail
  }
</script>

<div class="flex flex-col items-center gap-4">
  <Input placeholder="Find a movie..." on:value={handleValue} />
  {#if filter}
    <p>Searching for {filter}...</p>
  {/if}
</div>
