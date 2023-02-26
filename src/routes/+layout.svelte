<script lang="ts">
  import { onMount } from 'svelte'
  import { page } from '$app/stores'
  import '$lib/styles/global.scss'

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
</script>

<div class="w-screen h-screen min-w-[352px]">
  <div class="drawer">
    <input id="drawer" type="checkbox" class="drawer-toggle" />
    <div class="drawer-content">
      <div class="navbar bg-base-100">
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
      <div class="w-full h-full">
        <div class="container mx-auto py-5">
          <slot />
        </div>
      </div>
    </div>
    <div class="drawer-side">
      <label for="drawer" class="drawer-overlay" />
      <ul class="menu p-4 w-80 bg-base-100 text-base-content">
        <li class="menu-title !opacity-100">
          <a class="btn btn-ghost" href={$page.url.origin}>
            <div class="flex items-center gap-2 w-full">
              <svg
                class="w-8 h-8"
                stroke="currentColor"
                fill="currentColor"
                stroke-width="0"
                viewBox="0 0 512 512"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M261.56 101.28a8 8 0 00-11.06 0L66.4 277.15a8 8 0 00-2.47 5.79L63.9 448a32 32 0 0032 32H192a16 16 0 0016-16V328a8 8 0 018-8h80a8 8 0 018 8v136a16 16 0 0016 16h96.06a32 32 0 0032-32V282.94a8 8 0 00-2.47-5.79z"
                />
                <path
                  d="M490.91 244.15l-74.8-71.56V64a16 16 0 00-16-16h-48a16 16 0 00-16 16v32l-57.92-55.38C272.77 35.14 264.71 32 256 32c-8.68 0-16.72 3.14-22.14 8.63l-212.7 203.5c-6.22 6-7 15.87-1.34 22.37A16 16 0 0043 267.56L250.5 69.28a8 8 0 0111.06 0l207.52 198.28a16 16 0 0022.59-.44c6.14-6.36 5.63-16.86-.76-22.97z"
                />
              </svg>
              <span class="text-xl text-secondary font-bold">Home</span>
            </div>
          </a>
        </li>
        <div class="divider" />
        <li class="menu-title">Popular</li>
        <li><a href="/movies">Movies</a></li>
        <li><a href="/actors">Actors</a></li>
        <div class="divider" />
        <li class="menu-title">Search</li>
        <li><a href="/movies/search">By Movie</a></li>
        <li><a href="/actors/search">By Actor</a></li>
        <div class="divider" />
        <li>
          <a href="/api/graphql" target="_blank" rel="noreferrer">GraphQL</a>
        </li>
      </ul>
    </div>
  </div>
</div>
