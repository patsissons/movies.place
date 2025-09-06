/* eslint-disable import/named */

declare module '*.svg?component' {
  import { ComponentType, SvelteComponentTyped } from 'svelte'
  const icon: ComponentType<SvelteComponentTyped>
  export default icon
}

declare module '*.svg?c' {
  import { ComponentType, SvelteComponentTyped } from 'svelte'
  const icon: ComponentType<SvelteComponentTyped>
  export default icon
}
