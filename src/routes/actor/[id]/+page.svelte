<script lang="ts">
  import { page } from '$app/stores'
  import Error from '$lib/components/Error.svelte'
  import { baseUrlStore } from '$lib/stores'
  import type { PageData } from './$houdini'

  export let data: PageData

  const { id } = $page.route
  const { Configuration, PersonStore } = data
  const person = $PersonStore?.data?.person
  const baseUrl = baseUrlStore(Configuration)
</script>

{#if $PersonStore.data}
  {#if person}
    <div class="flex flex-col">
      <pre>{JSON.stringify(person, null, 2)}</pre>
    </div>
  {:else}
    <Error error={`Actor ${id} not found`} />
  {/if}
{/if}
