<script lang="ts">
  import type { SortedMovies$result } from '$houdini'
  import type { PageData } from './$houdini'

  export let data: PageData

  let movieMap = new Map<
    number,
    SortedMovies$result['sortedMovies']['results'][0]
  >()
  let movies: SortedMovies$result['sortedMovies']['results'] = []
  let movieErrors: string[] | undefined
  let page: number | undefined
  let totalPages: number | undefined

  $: ({ Configuration, SortedMovies } = data)
  $: baseUrl = $Configuration.data?.configuration.images?.secureBaseUrl
  $: if ($SortedMovies.data && !$SortedMovies.fetching) {
    movieErrors = $SortedMovies.errors?.map(({ message }) => message)
    const { sortedMovies } = $SortedMovies.data
    page = sortedMovies.page
    totalPages = sortedMovies.totalPages

    sortedMovies.results.forEach((result) => {
      movieMap.set(result.id, result)
    })

    movies = Array.from(movieMap.values())
  }

  function showMore() {
    if (!page || !totalPages || page === totalPages) return

    SortedMovies.fetch({ variables: { page: page + 1 } })
  }
</script>

{#if movieErrors && movieErrors.length > 0}
  <div class="alert alert-warning shadow-lg">
    <div>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        class="stroke-current flex-shrink-0 h-6 w-6"
        fill="none"
        viewBox="0 0 24 24"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
        />
      </svg>
      {#each movieErrors as error}
        <p>{error}</p>
      {/each}
    </div>
  </div>
{/if}
{#if movies}
  <div class="flex flex-wrap justify-center gap-x-[6px] gap-y-4">
    {#each movies as movie, index}
      <a
        href={`/${movie.id}`}
        class={`flex flex-col gap-2 w-[154px] animate-in slide-in-from-bottom fade-in zoom-in animate-duration-500 animate-delay-[${
          (index % 10) * 25
        }ms]`}
      >
        <div class="bg-slate-400 w-full h-[231px]">
          {#if baseUrl}
            <img
              src={`${baseUrl}/w154${movie.posterPath}`}
              alt={`${movie.title} poster`}
            />
          {/if}
        </div>
        <p class="overflow-hidden whitespace-nowrap text-ellipsis text-center">
          {movie.title}
        </p>
      </a>
    {/each}
  </div>
{/if}
{#if page && totalPages && page < totalPages}
  <div class="text-center p-5">
    <button class="btn btn-ghost btn-xs" on:click={showMore}>
      <p class="text-orange-500 dark:text-yellow-500 normal-case">
        {`Load the next page of movies (${page} / ${totalPages})`}
      </p>
    </button>
  </div>
{/if}
