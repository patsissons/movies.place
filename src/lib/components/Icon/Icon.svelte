<script lang="ts">
  import globe from 'ionicons/dist/svg/globe.svg?c'
  import imdb from './icons/imdb.svg?c'
  import metacritic from './icons/metacritic.svg?c'
  import rottentomatoes from './icons/rottentomatoes.svg?c'
  import tmdb from './icons/tmdb.svg?c'

  const icons = { globe, imdb, metacritic, rottentomatoes, tmdb }

  export let icon: keyof typeof icons
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
