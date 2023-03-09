<script lang="ts">
  import { icons, type IconName } from './icons'

  export let icon: IconName
  export let size: number | string

  const Component = icons[icon]
</script>

<Component
  width={size}
  height={size}
  stroke="currentColor"
  fill="currentColor"
  stroke-width={0}
  role="img"
/>
