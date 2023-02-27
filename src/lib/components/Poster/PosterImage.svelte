<script lang="ts">
  export let alt: string
  export let src: string
  export let srcLarge: string | undefined = undefined
</script>

<img class={srcLarge ? '2xl:hidden' : undefined} {src} {alt} />
{#if srcLarge}
  <img class="hidden 2xl:block" src={srcLarge} {alt} />
{/if}
