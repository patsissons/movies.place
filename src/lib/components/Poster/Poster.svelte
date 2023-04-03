<script lang="ts">
  import dayjs from 'dayjs'
  import type { Readable } from 'svelte/store'
  import PosterImage from './PosterImage.svelte'

  export let title: string
  export let baseUrl: Readable<string | undefined>
  export let src: string | undefined = undefined
  export let widths: string[] | undefined = undefined
  export let sizes: string | undefined = undefined
  export let description: string | undefined = undefined
  export let date: string | Date | undefined = undefined
  export let alt: string | undefined = undefined

  let desc: string | undefined

  $: {
    if (date && description) {
      desc = `${description} (${dayjs(date).year()})`
    }

    if (date) {
      desc = dayjs(date).format('ll')
    }

    desc = description
  }
</script>

<div class="relative w-full h-full">
  <div
    class="bg-slate-400 rounded-tl-[18px] rounded-tr-lg overflow-hidden w-full aspect-[2/3]"
  >
    {#if src}
      <PosterImage
        {baseUrl}
        {src}
        {widths}
        {sizes}
        alt={alt ?? `${title} image`}
      />
    {/if}
  </div>
  <p class="w-full text-center font-bold">
    {title}
  </p>
  {#if desc}
    <p class="w-full text-center text-sm font-light">{desc}</p>
  {/if}
  <slot />
</div>
