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
  $: if ($Configuration.data?.configuration) {
    console.log('Config', $Configuration.data.configuration)
  }
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
  <ul
    class="grid grid-cols-3 xs:grid-cols-5 lg:grid-cols-10 justify-items-center gap-2 animate-stagger"
  >
    {#each movies as movie, index}
      <li
        class="animate-in ease-out animate-duration-500 slide-in-from-bottom slide-in-from-right fill-mode-both fade-in zoom-in"
        style={`--animation-delay-factor: ${index % 20}`}
      >
        <a
          href={`/${movie.id}`}
          class="flex flex-col items-center gap-2 w-full"
        >
          <div
            class="bg-slate-400 w-[92px] 2xl:w-[154px] h-[138px] 2xl:h-[231px]"
          >
            {#if baseUrl}
              <img
                class="hidden 2xl:block"
                src={`${baseUrl}/w154${movie.posterPath}`}
                alt={`${movie.title} poster`}
              />
              <img
                class="2xl:hidden"
                src={`${baseUrl}/w92${movie.posterPath}`}
                alt={`${movie.title} poster`}
              />
            {/if}
          </div>
          <p class="w-full text-center">
            {movie.title}
          </p>
        </a>
      </li>
    {/each}
  </ul>
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

<style lang="scss">
  .animate-stagger > li {
    animation-delay: calc(var(--animation-delay-factor, 0) * 50ms);
  }
</style>
