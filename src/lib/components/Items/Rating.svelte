<script lang="ts">
  export let rating: { label: string; value: number } | undefined

  export function ratingColor(rating: number) {
    if (rating >= 70) return 'su'
    if (rating >= 50) return 'wa'
    return 'er'
  }
</script>

{#if rating}
  <div
    class="radial-progress text-xs font-bold bg-black bg-opacity-75"
    style={`--size:2.25rem; --thickness: 2px; --value:${
      rating.value
    }; --color:var(--${ratingColor(rating.value)});`}
  >
    <div class="tooltip tooltip-bottom" data-tip={rating.label}>
      <p>{Math.floor(rating.value)}</p>
    </div>
  </div>
{/if}

<style lang="scss">
  .radial-progress {
    color: hsla(var(--color) / var(--tw-text-opacity, 1));

    > p::after {
      content: '%';
      font-size: 50%;
      position: relative;
      top: -25%;
    }
  }
</style>
