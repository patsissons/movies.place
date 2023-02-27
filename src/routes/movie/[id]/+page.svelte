<script lang="ts">
  import Time from 'svelte-time'
  import dayjs from 'dayjs'
  import { page } from '$app/stores'
  import Error from '$lib/components/Error.svelte'
  import { baseUrlStore } from '$lib/stores'
  import { urls } from '$lib/utils/urls'
  import type { PageData } from './$houdini'
  import { Icon } from '$lib/components/Icon'
  import { ItemGrid, type Item } from '$lib/components/ItemGrid'
  import { derived } from 'svelte/store'

  export let data: PageData

  const { id } = $page.route
  const { Configuration, MovieStore } = data
  const baseUrl = baseUrlStore(Configuration)
  const currencyFormatter = new Intl.NumberFormat(undefined, {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  })
  const percentFormatter = new Intl.NumberFormat(undefined, {
    style: 'percent',
  })

  $: movie = $MovieStore.data?.movie
  const items = derived(MovieStore, ({ data }) => {
    if (!data || !data.movie) return

    return data.movie.cast.map(
      ({ id, name: title, profilePath }) =>
        ({
          id,
          title,
          url: `/actor/${id}`,
          image: {
            small: ['w92', profilePath].join(''),
            large: ['w154', profilePath].join(''),
          },
        } as Item),
    )
  })
</script>

{#if movie}
  <div class="flex flex-col gap-1">
    <div class="flex flex-col gap-4">
      <div
        class="hero min-h-screen bg-base-200 bg-cover"
        style={movie.backdropPath
          ? `background-image: url(${[
              $baseUrl,
              'original',
              movie.backdropPath,
            ].join('')});`
          : undefined}
      >
        <div class="hero-overlay backdrop-blur-sm" />
        <div
          class="hero-content flex-col lg:flex-row lg:items-start text-white"
        >
          <div class="indicator">
            {#if movie.adult}
              <span
                class="indicator-item indicator-start indicator-top badge badge-secondary"
              >
                adult
              </span>
            {/if}
            <img
              class="max-w-sm rounded-lg shadow-2xl"
              src={[$baseUrl, 'original', movie.posterPath].join('')}
              alt={`${movie.title} poster`}
            />
          </div>
          <div class="flex flex-col gap-4">
            <div class="flex items-start justify-between gap-2">
              <h1 class="text-4xl font-bold">
                {movie.title}
                <div
                  class="tooltip cursor-pointer"
                  data-tip={`${dayjs(movie.releaseDate).format('LL')} (${dayjs(
                    movie.releaseDate,
                  ).fromNow()})`}
                >
                  <Time
                    class="font-mono font-thin text-base-content"
                    timestamp={movie.releaseDate}
                    format="(YYYY)"
                  />
                </div>
              </h1>
              <div class="flex items-center gap-2 text-white">
                <a
                  class="btn btn-ghost btn-sm"
                  href={movie.homepage}
                  target="_blank"
                  rel="noreferrer"
                >
                  <Icon icon="globe" size={20} /></a
                >
                <a
                  class="btn btn-ghost btn-sm"
                  href={urls.tmdb(movie.id)}
                  target="_blank"
                  rel="noreferrer"
                >
                  <Icon icon="tmdb" size={20} /></a
                >
                {#if movie.imdbId}
                  <a
                    class="btn btn-ghost btn-sm"
                    href={urls.imdb(movie.imdbId)}
                    target="_blank"
                    rel="noreferrer"
                  >
                    <Icon icon="imdb" size={20} /></a
                  >
                {/if}
              </div>
            </div>
            <div class="flex items-center gap-1">
              {#if movie.runtime}
                <p>
                  {dayjs.duration(movie.runtime, 'minutes').format('H[h] m[m]')}
                </p>
              {/if}
              {#if movie.genres.length > 0}
                <p>•</p>
                {#each movie.genres as genre}
                  <div class="badge badge-primary">{genre.name}</div>
                {/each}
              {/if}
              <p>•</p>
              <p class="italic">{movie.tagline}</p>
            </div>
            <p>{movie.overview}</p>
            <div class="stats stats-vertical lg:stats-horizontal shadow">
              <div class="stat">
                <div class="stat-title">User rating</div>
                <div class="stat-value text-secondary">
                  {movie.voteAverage} / 10
                </div>
                <div class="stat-desc">{movie.voteCount} votes</div>
              </div>

              <div class="stat">
                <div class="stat-title">Popularity</div>
                <div class="stat-value text-secondary">
                  {movie.popularity}
                </div>
                <div class="stat-desc">
                  <a
                    class="link"
                    href="https://developers.themoviedb.org/3/getting-started/popularity"
                    >See explanation</a
                  >
                </div>
              </div>

              <div class="stat">
                <div class="stat-title">Success</div>
                <div class="stat-value text-secondary">
                  {currencyFormatter.format(
                    Number(movie.revenue - movie.budget) / 1e6,
                  )}M
                </div>
                <div class="stat-desc">
                  {#if movie.budget}
                    {movie.revenue > movie.budget ? '↗︎' : '↘︎'}
                    {percentFormatter.format(
                      (movie.revenue - movie.budget) / movie.budget,
                    )} ({currencyFormatter.format(Number(movie.budget) / 1e6)}M)
                  {/if}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <ItemGrid {items} {baseUrl} />
    <!-- <pre>{JSON.stringify(movie, null, 2)}</pre> -->
  </div>
{:else if $MovieStore.data}
  <Error error={`Movie ${id} not found`} />
{/if}
