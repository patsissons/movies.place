<script lang="ts">
  export let rating:
    | { label: string; value: number; description?: string }
    | undefined

  export function ratingColor(rating: number) {
    if (rating >= 70) return 'su'
    if (rating >= 50) return 'wa'
    return 'er'
  }
</script>

{#if rating}
  <div
    class="tooltip tooltip-bottom"
    data-tip={rating.description
      ? `${rating.label} (${rating.description}) asdf as fdas df asdf as df asd fas df asd fas fd sadf as df asdf asd fasd fa sdf asd fas df sdf as dfa sdf asdf `
      : rating.label}
  >
    <div
      class="radial-progress text-xs font-bold bg-black bg-opacity-75"
      style={`--size:2.25rem; --thickness: 2px; --value:${
        rating.value
      }; --color:var(--${ratingColor(rating.value)});`}
    >
      <p>{Math.floor(rating.value)}</p>
    </div>
  </div>
{/if}

<style lang="scss">
  .radial-progress {
    color: hsla(var(--color) / var(--tw-text-opacity, 1));

    p::after {
      content: '%';
      font-size: 50%;
      vertical-align: super;
    }
  }
</style>
