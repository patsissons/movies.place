<script lang="ts">
  import type { SortedMovies$result } from '$houdini'
  import type { PageData } from './$houdini'
  import Errors from '$lib/components/Errors.svelte'
  import { ItemGrid, type Item } from '$lib/components/ItemGrid'
  import Pagination from '$lib/components/Pagination.svelte'
  // import { itemsFromResultListStore } from '$lib/utils/items'
  // import { baseUrlFromConfigStore } from '$lib/utils/config'

  export let data: PageData

  const { Configuration, SortedMovies } = data

  let items: Item[] = []
  let errors: string[] | undefined
  let page: number | undefined
  let totalPages: number | undefined

  let baseUrl: string | undefined
  let itemMap = new Map<
    number,
    SortedMovies$result['sortedMovies']['results'][0]
  >()

  // const config = baseUrlFromConfigStore(Configuration)
  // const items = itemsFromResultListStore(
  //   SortedMovies,
  //   (data) => data.sortedMovies,
  //   ({id, title, posterPath}) => ({
  //     id,
  //     title,
  //     url: `/movie/${id}`,
  //     image: baseUrl
  //       ? {
  //           large: `/w154${posterPath}`,
  //           small: `/w92${posterPath}`,
  //         }
  //       : undefined,
  //   }),
  // )

  $: if ($Configuration.data && !$Configuration.fetching) {
    // console.log('Config', $Configuration.data.configuration)
    baseUrl = $Configuration.data.configuration.images?.secureBaseUrl
  }
  $: if ($SortedMovies.data && !$SortedMovies.fetching) {
    errors = $SortedMovies.errors?.map(({ message }) => message)
    const { sortedMovies } = $SortedMovies.data
    page = sortedMovies.page
    totalPages = sortedMovies.totalPages

    sortedMovies.results.forEach((result) => {
      itemMap.set(result.id, result)
    })

    items = Array.from(itemMap.values()).map(({ id, title, posterPath }) => ({
      id,
      title,
      url: `/movie/${id}`,
      image: baseUrl
        ? {
            large: `${baseUrl}/w154${posterPath}`,
            small: `${baseUrl}/w92${posterPath}`,
          }
        : undefined,
    }))
  }

  function nextPage() {
    if (!page || !totalPages || page === totalPages) return

    SortedMovies.fetch({ variables: { page: page + 1 } })
  }
</script>

<Errors {errors} />
<ItemGrid {items} />
<Pagination type="movies" {page} {totalPages} {nextPage} />
