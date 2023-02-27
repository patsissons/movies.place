<script lang="ts">
  import type { Readable } from 'svelte/store'
  import { Poster } from '$lib/components/Poster'
  import type { Item } from './types'

  export let items: Readable<Item[] | undefined>
  export let baseUrl: Readable<string | undefined>

  const itemMap = new Map<number, Item>()
  let allItems: Item[] = []
  let lastLength = 0

  $: if ($items) {
    lastLength = allItems.length
    $items.forEach((item) => {
      if (!itemMap.has(item.id)) itemMap.set(item.id, item)
    })

    allItems = Array.from(itemMap.values())
  }
</script>

<ul
  class="grid grid-cols-3 xs:grid-cols-5 lg:grid-cols-10 justify-items-center animate-stagger"
>
  {#each allItems as { title, url, description, image }, index}
    <li
      class="w-full animate-in ease-out animate-duration-500 slide-in-from-bottom slide-in-from-right fill-mode-both fade-in zoom-in"
      style={`--animation-delay-factor: ${(index - lastLength) % 20}`}
    >
      <Poster
        {title}
        {url}
        {description}
        src={image ? [$baseUrl, image.small].join('') : undefined}
        srcLarge={image ? [$baseUrl, image.large].join('') : undefined}
      />
    </li>
  {/each}
</ul>

<style lang="scss">
  .animate-stagger > li {
    animation-delay: calc(var(--animation-delay-factor, 0) * 50ms);
  }
</style>
