<script lang="ts">
  import type { Readable } from 'svelte/store'
  import { Poster } from '$lib/components/Poster'
  import type { Item } from './types'
  import { ratingColor } from './utils'
  import { lastLengthStore } from './stores'

  export let items: Readable<Item[]>
  export let baseUrl: Readable<string | undefined>

  const lastLength = lastLengthStore(items)
</script>

<ul
  class="grid grid-cols-3 xs:grid-cols-5 lg:grid-cols-10 gap-y-2 justify-items-center animate-stagger"
>
  {#each $items as { title, url, description, rating, image }, index}
    <li
      class="w-full animate-in ease-out animate-duration-500 slide-in-from-bottom slide-in-from-right fill-mode-both fade-in zoom-in"
      style={`--animation-delay-factor: ${(index - $lastLength) % 20}`}
    >
      <div class="relative w-full h-full">
        <div class="relative pl-2 pt-4 left-0 top-0 h-0">
          {#if rating}
            <div
              class="radial-progress text-xs font-bold bg-black bg-opacity-75"
              style={`--size:2rem; --thickness: 2px; --value:${rating}; --color:var(--${ratingColor(
                rating,
              )});`}
            >
              <p>{Math.floor(rating)}</p>
            </div>
          {/if}
        </div>
        <a
          href={url}
          class="flex flex-col items-center gap-2 w-full h-full rounded-lg p-2 pt-4 btn-ghost"
        >
          <Poster
            {title}
            {description}
            src={image ? [$baseUrl, image.small].join('') : undefined}
            srcLarge={image ? [$baseUrl, image.large].join('') : undefined}
          />
        </a>
      </div>
    </li>
  {/each}
</ul>

<style lang="scss">
  .animate-stagger > li {
    animation-delay: calc(var(--animation-delay-factor, 0) * 50ms);
  }

  .radial-progress {
    color: hsla(var(--color) / var(--tw-text-opacity, 1));

    > p::after {
      content: '%';
      font-size: 50%;
      position: relative;
      top: -25%;
    }
  }
</style>
