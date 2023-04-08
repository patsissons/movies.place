<script lang="ts">
  import { derived, readable, type Readable } from 'svelte/store'
  import { Poster } from '$lib/components/Poster'
  import Rating from './Rating.svelte'
  import type { Item } from './types'
  import { lastLengthStore } from './stores'
  import { createEventDispatcher } from 'svelte'

  export let items: Readable<Item[]>
  export let baseUrl: Readable<string | undefined>
  export let selectedItems: Readable<number[]> | undefined = undefined
  export let center: boolean | undefined = false

  const dispatch = createEventDispatcher<{
    selectionChanged: { id: number }
  }>()

  const selectedSet = derived(
    selectedItems ?? readable([]),
    (values) => new Set(values),
  )

  const lastLength = lastLengthStore(items)

  function handleSelect(e: MouseEvent, id: number) {
    e.preventDefault()
    dispatch('selectionChanged', { id })
  }
</script>

<ul
  class={`gap-y-2 justify-items-center overflow-x-hidden animate-stagger ${
    center
      ? 'flex flex-flow'
      : 'grid grid-cols-3 xs:grid-cols-5 lg:grid-cols-10'
  }`}
>
  {#each $items as { id, title, url, description, date, tmdbRating, image }, index}
    <li
      class="w-full animate-in ease-out animate-duration-500 slide-in-from-bottom slide-in-from-right fill-mode-both fade-in zoom-in"
      style={`--animation-delay-factor: ${(index - $lastLength) % 20}`}
    >
      <a
        href={url}
        class="flex flex-col items-center gap-2 w-full h-full rounded-lg p-2 btn-ghost"
      >
        <Poster
          {title}
          {baseUrl}
          sizes="(min-width: 1024px) 10vw, (min-width: 480px) 20vw, 33vw"
          {...image}
          {description}
          {date}
        >
          {#if tmdbRating}
            <div class="absolute left-0 top-0">
              <Rating rating={tmdbRating} />
            </div>
          {/if}
          {#if selectedItems}
            <div class="absolute top-0 right-0">
              <label>
                {#if $selectedSet.has(id)}
                  <input
                    type="checkbox"
                    class="checkbox checkbox-accent !bg-base-100"
                    checked
                    on:click={(e) => handleSelect(e, id)}
                  />
                {:else}
                  <input
                    type="checkbox"
                    class="checkbox checkbox-accent bg-opacity-25 bg-black"
                    on:click={(e) => handleSelect(e, id)}
                  />
                {/if}
              </label>
            </div>
          {/if}
        </Poster>
      </a>
    </li>
  {/each}
</ul>

<style lang="scss">
  .animate-stagger > li {
    animation-delay: calc(var(--animation-delay-factor, 0) * 50ms);
  }
</style>
