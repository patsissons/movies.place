<script lang="ts">
  import type { RatingData } from './types'

  let className = ''
  export { className as class }

  export let rating: RatingData | undefined
  export let simple = false

  export function ratingColor(rating: number) {
    if (rating >= 70) return 'su'
    if (rating >= 50) return 'wa'
    return 'er'
  }
</script>

{#if rating}
  {#if simple}
    <div
      class={`item-rating ${className}`}
      class:grayscale={rating.disabled}
      style={`--color:var(--${ratingColor(rating.value)})`}
    >
      <p>{Math.floor(rating.value)}</p>
    </div>
  {:else}
    <div
      class={`tooltip tooltip-bottom before:whitespace-normal ${className}`}
      data-tip={rating.description
        ? `${rating.label} (${rating.description})`
        : rating.label}
    >
      <div
        class="item-rating"
        class:grayscale={rating.disabled}
        style={`--color:var(--${ratingColor(rating.value)})`}
      >
        <div
          class="radial-progress text-xs font-bold bg-black bg-opacity-75"
          style={`--size:2.25rem; --thickness: 2px; --value:${rating.value};`}
        >
          <p>{Math.floor(rating.value)}</p>
        </div>
      </div>
    </div>
  {/if}
{/if}

<style lang="scss">
  .item-rating {
    color: hsla(var(--color) / var(--tw-text-opacity, 1));
  }

  p::after {
    content: '%';
    font-size: 50%;
    vertical-align: super;
  }
</style>
