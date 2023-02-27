<script lang="ts">
  export let svg: string
  export let size: number | string

  let className: string | undefined = undefined
  export { className as class }
</script>

<div
  class={`icon stroke-current fill-current stroke-0 ${className}`}
  style={`--icon-size: ${typeof size === 'string' ? size : `${size}px`};`}
>
  {@html svg.slice('data:image/svg+xml;utf8,'.length)}
</div>

<style lang="scss">
  .icon {
    height: var(--icon-size);
    width: var(--icon-size);
  }
</style>
