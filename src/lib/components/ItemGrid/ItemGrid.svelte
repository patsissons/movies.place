<script lang="ts">
  import type { Readable } from 'svelte/store'
  import type { Item } from './types'

  export let items: Readable<Item[] | undefined>
  export let baseUrl: Readable<string | undefined>

  const itemMap = new Map<number, Item>()
  let allItems: Item[] = []
  let lastLength = 0

  $: if ($items) {
    lastLength = allItems.length
    $items.forEach((item) => {
      if (itemMap.has(item.id)) {
        console.log('E', item)
      } else {
        itemMap.set(item.id, item)
      }
    })

    allItems = Array.from(itemMap.values())
  }
</script>

<ul
  class="grid grid-cols-3 xs:grid-cols-5 lg:grid-cols-10 justify-items-center animate-stagger"
>
  {#each allItems as item, index}
    <li
      class="w-full animate-in ease-out animate-duration-500 slide-in-from-bottom slide-in-from-right fill-mode-both fade-in zoom-in"
      style={`--animation-delay-factor: ${(index - lastLength) % 20}`}
    >
      <a
        href={`/${item.id}`}
        class="flex flex-col items-center gap-2 w-full h-full rounded-lg p-2 btn-ghost"
      >
        <div
          class="bg-slate-400 w-[92px] 2xl:w-[154px] h-[138px] 2xl:h-[231px]"
        >
          {#if $baseUrl}
            <img
              class="hidden 2xl:block"
              src={[$baseUrl, item.image.large].join('')}
              alt={`${item.title} poster`}
            />
            <img
              class="2xl:hidden"
              src={[$baseUrl, item.image.small].join('')}
              alt={`${item.title} poster`}
            />
          {/if}
        </div>
        <p class="w-full text-center">
          {item.title}
        </p>
      </a>
    </li>
  {/each}
</ul>

<style lang="scss">
  .animate-stagger > li {
    animation-delay: calc(var(--animation-delay-factor, 0) * 50ms);
  }
</style>
