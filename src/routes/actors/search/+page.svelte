<script lang="ts">
  import Input from '$lib/components/Input.svelte'

  let filter: string = ''

  function handleValue({ detail }: CustomEvent<string>) {
    filter = detail
  }
</script>

<Input center placeholder="Find an actor..." on:value={handleValue} />
{#if filter}
  <p>Searching for {filter}...</p>
{/if}
