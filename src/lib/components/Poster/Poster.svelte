<script lang="ts">
  import type { Readable } from 'svelte/store'
  import PosterImage from './PosterImage.svelte'

  export let title: string
  export let baseUrl: Readable<string | undefined>
  export let src: string | undefined = undefined
  export let widths: string[] | undefined = undefined
  export let sizes: string | undefined = undefined
  export let description: string | undefined = undefined
</script>

<div class="relative w-full h-full">
  <div
    class="bg-slate-400 rounded-tl-[18px] overflow-hidden w-full aspect-[2/3]"
  >
    {#if src}
      <PosterImage {baseUrl} {src} {widths} {sizes} alt={`${title} image`} />
    {/if}
  </div>
  <p class="w-full text-center font-bold">
    {title}
  </p>
  {#if description}
    <p class="w-full text-center text-sm font-light">{description}</p>
  {/if}
  <slot />
</div>
