<script lang="ts">
  import debounce from 'lodash/debounce'
  import { createEventDispatcher } from 'svelte'
  import type { FormEventHandler } from 'svelte/elements'

  export let placeholder: string
  export let center = false
  export let wait = 300
  export let value = ''
  export let fullWidth = false

  const dispatch = createEventDispatcher<{ value: string }>()

  const handleInput = debounce(
    (({ currentTarget, target }) => {
      value = (currentTarget ?? target)?.value ?? ''

      dispatch('value', value)
    }) satisfies FormEventHandler<HTMLInputElement>,
    wait,
  )
</script>

<div class="flex" class:justify-center={center}>
  <input
    class="input input-ghost input-bordered focus:input-info !outline-none w-80"
    class:w-full={fullWidth}
    type="text"
    {placeholder}
    on:input={handleInput}
  />
</div>
