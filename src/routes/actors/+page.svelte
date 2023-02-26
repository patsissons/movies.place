<script lang="ts">
  import type { SortedPeople$result } from '$houdini'
  import type { PageData } from './$houdini'
  import Errors from '$lib/components/Errors.svelte'
  import { ItemGrid, type Item } from '$lib/components/ItemGrid'
  import Pagination from '$lib/components/Pagination.svelte'

  export let data: PageData

  const { Configuration, SortedPeople } = data

  let items: Item[] = []
  let errors: string[] | undefined
  let page: number | undefined
  let totalPages: number | undefined

  let baseUrl: string | undefined
  let itemMap = new Map<
    number,
    SortedPeople$result['sortedPeople']['results'][0]
  >()

  $: if ($Configuration.data && !$Configuration.fetching) {
    // console.log('Config', $Configuration.data.configuration)
    baseUrl = $Configuration.data.configuration.images?.secureBaseUrl
  }
  $: if ($SortedPeople.data && !$SortedPeople.fetching) {
    errors = $SortedPeople.errors?.map(({ message }) => message)
    const { sortedPeople } = $SortedPeople.data
    page = sortedPeople.page
    totalPages = sortedPeople.totalPages

    sortedPeople.results.forEach((result) => {
      itemMap.set(result.id, result)
    })

    items = Array.from(itemMap.values()).map(
      ({ id, name: title, profilePath }) => ({
        id,
        title,
        url: `/actor/${id}`,
        image: baseUrl
          ? {
              large: `${baseUrl}/w154${profilePath}`,
              small: `${baseUrl}/w92${profilePath}`,
            }
          : undefined,
      }),
    )
  }

  async function nextPage() {
    if (!page || !totalPages || page === totalPages) return

    await SortedPeople.fetch({ variables: { page: page + 1 } })
  }
</script>

<Errors {errors} />
<ItemGrid {items} />
<Pagination type="actors" {page} {totalPages} {nextPage} />
