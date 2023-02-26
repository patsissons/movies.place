<script lang="ts">
  import { page } from '$app/stores'
  import Error from '$lib/components/Error.svelte'
  import type { PageData, RouteParams } from './$types'

  export let data: PageData

  const { id } = $page.params as RouteParams
  const { MovieStore } = data
  const movie = $MovieStore?.data?.movie
</script>

{#if movie}
  <pre>{JSON.stringify(movie, null, 2)}</pre>
{:else}
  <Error error={`Movie ${id} not found`} />
{/if}
