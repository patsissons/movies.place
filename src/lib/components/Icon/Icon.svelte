<script lang="ts">
  import ImdbIcon from './icons/imdb.svg?c'
  import TmdbIcon from './icons/tmdb.svg?c'

  const icons = { imdb: ImdbIcon, tmdb: TmdbIcon }

  export let icon: keyof typeof icons
  export let size: number | string

  const Component = icons[icon]
</script>

<Component width={size} height={size} />
