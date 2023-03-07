<script lang="ts">
  import { derived, type Readable } from 'svelte/store'

  export let baseUrl: Readable<string | undefined>
  export let src: string
  export let alt: string
  export let widths: string[] | undefined = undefined
  export let sizes: string | undefined = undefined

  let className: string | undefined = undefined
  export { className as class }

  const props = derived(baseUrl, ($baseUrl) => {
    if (!$baseUrl) return
    if (!widths || widths.length === 0) return { src: [$baseUrl, src].join('') }

    return {
      src: [$baseUrl, widths[widths.length - 1], src].join(''),
      srcset: widths
        .filter((width) => width !== 'original')
        .map((width) => {
          const path = [$baseUrl, width, src].join('')

          return [path, width].join(' ')
        })
        .join(', '),
      sizes,
    }
  })
</script>

{#if $props}
  <img class={className} {...$props} {alt} />
  <!-- <img
    alt="testing srcset"
    src="http://placehold.jp/3840x5760.png"
    srcset="http://placehold.jp/3840x5760.png 3840w,
            http://placehold.jp/2048x3072.png 2048w,
            http://placehold.jp/1920x2880.png 1920w,
            http://placehold.jp/1200x1800.png 1200w,
            http://placehold.jp/1080x1620.png 1080w,
            http://placehold.jp/828x1242.png 828w,
            http://placehold.jp/750x1125.png 750w,
            http://placehold.jp/640x960.png 640w"
    sizes="(max-width: 1024px) 10vw, (max-width: 480px) 20vw, 33vw"
  /> -->
{/if}
