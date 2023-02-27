<script lang="ts">
  import { page } from '$app/stores'
  import Error from '$lib/components/Error.svelte'
  import { baseUrlStore } from '$lib/stores'
  import type { PageData } from './$houdini'

  export let data: PageData

  const { id } = $page.route
  const { Configuration, PersonStore } = data
  const baseUrl = baseUrlStore(Configuration)

  $: person = $PersonStore.data?.person
</script>

{#if person}
  <div class="flex flex-col">
    <pre>{JSON.stringify(person, null, 2)}</pre>
  </div>
{:else if $PersonStore.data}
  <Error error={`Actor ${id} not found`} />
{/if}
