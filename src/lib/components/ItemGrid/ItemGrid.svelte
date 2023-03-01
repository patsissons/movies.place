<script lang="ts">
  import type { Readable } from 'svelte/store'
  import { Poster } from '$lib/components/Poster'
  import type { Item } from './types'

  export let items: Readable<Item[] | undefined>
  export let baseUrl: Readable<string | undefined>

  const itemMap = new Map<number, Item>()
  let allItems: Item[] = []
  let lastLength = 0
  const percentFormatter = new Intl.NumberFormat(undefined, {
    style: 'percent',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  })

  $: if ($items) {
    lastLength = allItems.length
    $items.forEach((item) => {
      if (!itemMap.has(item.id)) itemMap.set(item.id, item)
    })

    allItems = Array.from(itemMap.values())
  }

  function ratingColor(rating: number) {
    if (rating >= 70) return 'su'
    if (rating >= 50) return 'wa'
    return 'er'
  }
</script>

<ul
  class="grid grid-cols-3 xs:grid-cols-5 lg:grid-cols-10 gap-y-2 justify-items-center animate-stagger"
>
  {#each allItems as { title, url, description, rating, image }, index}
    <li
      class="w-full animate-in ease-out animate-duration-500 slide-in-from-bottom slide-in-from-right fill-mode-both fade-in zoom-in"
      style={`--animation-delay-factor: ${(index - lastLength) % 20}`}
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

    > p:after {
      position: relative;
      top: -25%;
      font-size: 50%;
      content: '%';
    }
  }
</style>
