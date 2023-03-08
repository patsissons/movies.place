<script lang="ts">
  import type { Readable } from 'svelte/store'
  import { Poster } from '$lib/components/Poster'
  import Rating from './Rating.svelte'
  import type { Item } from './types'
  import { lastLengthStore } from './stores'

  export let items: Readable<Item[]>
  export let baseUrl: Readable<string | undefined>

  const lastLength = lastLengthStore(items)
</script>

<ul
  class="grid grid-cols-3 xs:grid-cols-5 lg:grid-cols-10 gap-y-2 justify-items-center overflow-x-hidden animate-stagger"
>
  {#each $items as { title, url, description, ratings, image }, index}
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
          sizes="(max-width: 1024px) 10vw, (max-width: 480px) 20vw, 33vw"
          {...image}
          {description}
        >
          {#if ratings && ratings.some(({ value }) => Boolean(value))}
            <div class="absolute left-0 top-0">
              <Rating rating={ratings.find((value) => Boolean(value))} />
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
