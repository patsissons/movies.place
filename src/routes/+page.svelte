<script lang="ts">
  import debounce from 'lodash/debounce'
  import { onMount } from 'svelte'
  import { page } from '$app/stores'
  import { fetchMovieNames } from '$lib/client/movies'

  let documentElement: HTMLElement | undefined
  let max: number | undefined
  let filter: string | undefined
  let dark = true
  let movieNames: string[] | undefined
  let filteredNames: string[] | undefined
  let visibleNames: string[] | undefined
  let error: string | undefined

  $: if (documentElement) {
    loadMovieNames()
  }

  $: if (movieNames) {
    if (filter) {
      try {
        const regex = new RegExp(filter, 'i')
        filteredNames = movieNames.filter((name) => regex.test(name))
      } catch {
        filteredNames = movieNames.filter(
          (name) => name.indexOf(filter as string) >= 0,
        )
      }
    } else {
      filteredNames = movieNames
    }

    visibleNames = filteredNames.slice(0, max)
  }

  $: if (documentElement) {
    documentElement.setAttribute('data-theme', dark ? 'dark' : 'light')
    if (dark) {
      documentElement.classList.add('dark')
    } else {
      documentElement.classList.remove('dark')
    }
  }

  const handleFilterInput = debounce((e: Event) => {
    filter = (e.target as HTMLInputElement).value
  }, 300)

  const showMore = () => {
    if (!max || !visibleNames || !filteredNames) return
    if (visibleNames.length === filteredNames.length) return

    visibleNames = filteredNames.slice(0, visibleNames.length + max)
  }

  const handleResetParams = () => {
    max = 100
    filter = ''
  }

  const loadMovieNames = async () => {
    try {
      movieNames = await fetchMovieNames()
    } catch (err) {
      error = err instanceof Error ? err.message : String(err)
    }
  }

  onMount(() => {
    dark = window.matchMedia('(prefers-color-scheme: dark)').matches
    documentElement = document.documentElement

    max = Number($page.url.searchParams.get('max') || 100)
    filter = $page.url.searchParams.get('filter') || ''
  })
</script>

<div class="w-screen h-screen min-w-[352px]">
  <div class="navbar bg-base-100">
    <div class="navbar-start">
      <a
        class="btn btn-ghost drawer-button text-xl font-bold"
        href={$page.url.origin}
        on:click={handleResetParams}
      >
        <div class="flex items-center gap-2">
          <div>
            <img
              class="w-8 h-8 p-1"
              src="/favicon.svg"
              alt="movies.place logo"
            />
          </div>
          <span class="hidden sm:inline">movies.place</span>
        </div>
      </a>
    </div>
    <div class="navbar-center lg:min-w-[512px] md:min-w-[384px] gap-2">
      <div class="form-control w-full">
        <input
          class="input input-bordered"
          type="text"
          placeholder="Search for movies..."
          value={filter}
          on:input={handleFilterInput}
        />
      </div>
      <a
        class="hidden sm:block btn btn-ghost btn-square"
        href={`${$page.url.origin}?filter=${filter}&max=${max}`}
        target="_blank"
        rel="noreferrer"
      >
        <svg
          class="w-full h-full p-1"
          stroke="currentColor"
          fill="currentColor"
          stroke-width="0"
          viewBox="0 0 512 512"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            fill="none"
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="48"
            d="M200.66 352H144a96 96 0 010-192h55.41m113.18 0H368a96 96 0 010 192h-56.66m-142.27-96h175.86"
          />
        </svg>
      </a>
    </div>
    <div class="navbar-end">
      <label class="btn btn-circle btn-ghost swap swap-rotate">
        <input type="checkbox" bind:checked={dark} />
        <p class="swap-on">🌙</p>
        <p class="swap-off">🌞</p>
      </label>
    </div>
  </div>
  <div class="w-full h-full">
    <div class="container mx-auto py-5">
      {#if visibleNames}
        <div class="flex flex-wrap justify-center gap-5">
          {#each visibleNames as name}
            <a href={`/${name}`}>
              {name}
            </a>
          {/each}
        </div>
        {#if max && visibleNames && filteredNames && filteredNames.length > visibleNames.length}
          <div class="text-center p-5">
            <button class="btn btn-ghost btn-xs" on:click={showMore}>
              <p class="text-orange-500 dark:text-yellow-500 normal-case">
                Load the next {Math.min(
                  max,
                  filteredNames.length - visibleNames.length,
                ).toLocaleString()} of {(
                  filteredNames.length - visibleNames.length
                ).toLocaleString()} movies
              </p>
            </button>
          </div>
        {/if}
      {/if}
    </div>
    {#if error}
      <div class="flex justify-center">
        <div class="alert alert-error shadow-lg w-auto">
          <div>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="stroke-current flex-shrink-0 h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              ><path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
            <span>{error}</span>
          </div>
        </div>
      </div>
    {/if}
  </div>
</div>
