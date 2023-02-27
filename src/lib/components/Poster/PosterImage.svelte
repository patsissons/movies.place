<script lang="ts">
  export let alt: string
  export let src: string
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

<div class="bg-slate-400 w-[92px] 2xl:w-[154px] h-[138px] 2xl:h-[231px]">
  <img class={srcLarge ? '2xl:hidden' : undefined} {src} {alt} />
  {#if srcLarge}
    <img class="hidden 2xl:block" src={srcLarge} {alt} />
  {/if}
</div>
