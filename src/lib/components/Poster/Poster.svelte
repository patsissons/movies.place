<script lang="ts">
  import PosterImage from './PosterImage.svelte'

  export let title: string
  export let url: string
  export let src: string
  export let srcLarge: string | undefined = undefined
</script>

<a
  href={url}
  class="flex flex-col items-center gap-2 w-full h-full rounded-lg p-2 btn-ghost"
>
  <PosterImage alt={`${title} poster`} {src} {srcLarge} />
  <p class="w-full text-center">
    {title}
  </p>
</a>
