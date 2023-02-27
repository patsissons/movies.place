<script lang="ts">
  import PosterImage from './PosterImage.svelte'

  export let title: string
  export let url: string
  export let src: string | undefined = undefined
  export let srcLarge: string | undefined = undefined
</script>

<!--

"posterSizes": [
  "w92",
  "w154",
  "w185",
  "w342",
  "w500",
  "w780",
  "original"
]

 -->

<a
  href={url}
  class="flex flex-col items-center gap-2 w-full h-full rounded-lg p-2 btn-ghost"
>
  <div class="bg-slate-400 w-[92px] 2xl:w-[154px] h-[138px] 2xl:h-[231px]">
    {#if src}
      <PosterImage alt={`${title} poster`} {src} {srcLarge} />
    {/if}
  </div>
  <p class="w-full text-center">
    {title}
  </p>
</a>
