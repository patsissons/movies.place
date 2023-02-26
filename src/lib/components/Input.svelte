<script lang="ts">
  import debounce from 'lodash/debounce'
  import { createEventDispatcher } from 'svelte'
  import type { FormEventHandler } from 'svelte/elements'

  export let placeholder: string
  export let wait = 300

  const dispatch = createEventDispatcher<{ value: string }>()

  const handleInput = debounce(
    (({ currentTarget, target }) => {
      const value = (currentTarget ?? target)?.value ?? ''

      dispatch('value', value)
    }) satisfies FormEventHandler<HTMLInputElement>,
    wait,
  )
</script>

<input
  class="input input-ghost focus:input-info w-full max-w-xs"
  type="text"
  {placeholder}
  on:input={handleInput}
/>
