<script lang="ts">
  import type { Readable } from 'svelte/store'

  export let baseUrl: Readable<string | undefined>
  export let src: string
  export let alt: string
  export let widths: string[] | undefined = undefined
  export let sizes: string | undefined = undefined

  let className = ''
  export { className as class }
</script>

{#if $baseUrl}
  {#if !widths || widths.length === 0}
    <img class={className} {alt} src={[$baseUrl, src].join('')} />
  {:else}
    <img
      class={`w-full ${className}`}
      {alt}
      {sizes}
      src={[$baseUrl, widths[widths.length - 1], src].join('')}
      srcset={widths
        .filter((width) => width !== 'original')
        .map((width) =>
          [
            [$baseUrl, width, src].join(''),
            [width.slice(1), 'w'].join(''),
          ].join(' '),
        )
        .join(', ')}
    />
  {/if}
{/if}
