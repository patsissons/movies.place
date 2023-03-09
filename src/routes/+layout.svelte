<script lang="ts">
  import { onMount } from 'svelte'
  import '$lib/styles/global.scss'
  import { debuggingStore } from '$lib/stores/debugging'

  let documentElement: HTMLElement | undefined
  let dark = true

  $: if (documentElement) {
    documentElement.setAttribute('data-theme', dark ? 'dark' : 'light')
    if (dark) {
      documentElement.classList.add('dark')
    } else {
      documentElement.classList.remove('dark')
    }
  }

  onMount(() => {
    dark = window.matchMedia('(prefers-color-scheme: dark)').matches
    documentElement = document.documentElement
  })

  function toggleDebugging() {
    debuggingStore.update((value) => !value)
  }
</script>

<div class="w-screen h-screen min-w-[375px]">
  <div class="drawer">
    <input id="drawer" type="checkbox" class="drawer-toggle" />
    <div class="drawer-content">
      <div
        class="navbar bg-base-100 bg-opacity-75 fixed h-16 z-50 backdrop-blur"
      >
        <div class="navbar-start">
          <label
            for="drawer"
            class="btn btn-ghost drawer-button text-xl font-bold"
          >
            <div class="flex items-center gap-2">
              <div>
                <img
                  class="w-8 h-8 p-1"
                  src="/favicon.svg"
                  alt="movies.place logo"
                />
              </div>
              <span class="hidden sm:inline text-secondary">movies.place</span>
            </div>
          </label>
        </div>
        <div class="navbar-center">
          <p class="text-accent text-xl">Let's do that movie!</p>
        </div>
        <div class="navbar-end">
          <label class="btn btn-circle btn-ghost swap swap-rotate">
            <input type="checkbox" bind:checked={dark} />
            <p class="swap-on">🌙</p>
            <p class="swap-off">🌞</p>
          </label>
        </div>
      </div>
      <div class="mt-16 w-full h-full">
        <div class="container mx-auto py-5">
          <slot />
        </div>
      </div>
    </div>
    <div class="drawer-side">
      <label for="drawer" class="drawer-overlay" />
      <ul class="menu p-4 w-80 bg-base-100 text-base-content">
        <li class="menu-title">Search</li>
        <li><a href="/movies/search">By Movie</a></li>
        <li><a href="/actors/search">By Actor</a></li>
        <div class="divider" />
        <li class="menu-title">Popular</li>
        <li><a href="/movies">Movies</a></li>
        <li><a href="/actors">Actors</a></li>
        <div class="divider" />
        <li>
          <a href="/api/graphql" target="_blank" rel="noreferrer">GraphQL</a>
        </li>
        <div class="divider" />
        <div class="form-control">
          <label class="label cursor-pointer px-4 py-3">
            <span>Debugging</span>
            <input
              type="checkbox"
              class="toggle"
              checked={$debuggingStore}
              on:change={toggleDebugging}
            />
          </label>
        </div>
      </ul>
    </div>
  </div>
</div>
