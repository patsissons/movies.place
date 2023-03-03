<script lang="ts">
  import type { PageData } from './$houdini'
  import { Items } from '$lib/components/Items'
  import { baseUrlStore, itemsStorePaginated } from '$lib/stores'
  import dayjs from 'dayjs'

  export let data: PageData

  const { Configuration, SortedMovies } = data

  const baseUrl = baseUrlStore(Configuration)
  const { errors, pagination, items } = itemsStorePaginated(
    SortedMovies,
    (data) => data.sortedMovies,
    ({ id, title, releaseDate, voteAverage, posterPath }) => ({
      id,
      title,
      description: dayjs(releaseDate).format('ll'),
      rating: voteAverage * 10,
      url: `/movie/${id}`,
      image: posterPath
        ? {
            small: ['w92', posterPath].join(''),
            large: ['w154', posterPath].join(''),
          }
        : undefined,
    }),
  )
</script>

<Items {baseUrl} {errors} {items} itemType="movies" {pagination} />
<!-- <pre>{JSON.stringify($SortedMovies.data?.sortedMovies, null, 2)}</pre> -->
