<script lang="ts">
  import { page } from '$app/stores'
  import Error from '$lib/components/Error.svelte'
  import type { PageData, RouteParams } from './$types'

  export let data: PageData

  const { id } = $page.params as RouteParams
  const { PersonStore } = data
  const person = $PersonStore?.data?.person
</script>

{#if person}
  <pre>{JSON.stringify(person, null, 2)}</pre>
{:else}
  <Error error={`Actor ${id} not found`} />
{/if}
