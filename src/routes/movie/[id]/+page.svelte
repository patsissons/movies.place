<script lang="ts">
  import Time from 'svelte-time'
  import dayjs from 'dayjs'
  import { page } from '$app/stores'
  import { Error } from '$lib/components/Errors'
  import { baseUrlStore, itemsStore } from '$lib/stores'
  import { urls } from '$lib/utils/urls'
  import type { PageData } from './$houdini'
  import { Icon } from '$lib/components/Icon'
  import { Items, type Item } from '$lib/components/Items'
  import type { Movie$result } from '$houdini'
  import type { QueryStoreWithoutCustomScalars } from '$lib/types/graphql'
  import DebugData from '$lib/components/DebugData.svelte'

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
  const { errors, items } = itemsStore(
    MovieStore as QueryStoreWithoutCustomScalars<
      typeof MovieStore,
      Movie$result
    >,
    (data) => data.movie?.cast,
    ({ id, name: title, character: description, profilePath }) =>
      ({
        id,
        title,
        url: `/actor/${id}`,
        description,
        image: profilePath
          ? {
              small: ['w92', profilePath].join(''),
              large: ['w154', profilePath].join(''),
            }
          : undefined,
      } as Item),
  )
</script>

{#if movie}
  <div class="flex flex-col gap-1">
    <div class="flex flex-col gap-4">
      <div
        class="hero min-h-screen bg-base-200"
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
              class="max-w-[358px] rounded-lg shadow-2xl"
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
                    class="font-mono font-light text-base-content"
                    timestamp={movie.releaseDate}
                    format="(YYYY)"
                  />
                </div>
              </h1>
              <div class="flex items-center gap-2 text-white">
                {#if movie.homepage}
                  <a
                    class="btn btn-ghost btn-sm"
                    href={movie.homepage}
                    target="_blank"
                    rel="noreferrer"
                  >
                    <Icon icon="globe" size={20} />
                  </a>
                {/if}
                <a
                  class="btn btn-ghost btn-sm"
                  href={urls.tmdb(movie.id)}
                  target="_blank"
                  rel="noreferrer"
                >
                  <Icon icon="tmdb" size={20} />
                </a>
                {#if movie.imdbId}
                  <a
                    class="btn btn-ghost btn-sm"
                    href={urls.imdb(movie.imdbId)}
                    target="_blank"
                    rel="noreferrer"
                  >
                    <Icon icon="imdb" size={20} />
                  </a>
                {/if}
              </div>
            </div>
            <div class="flex flex-wrap items-center gap-1">
              {#if movie.runtime}
                <p>
                  {dayjs.duration(movie.runtime, 'minutes').format('H[h] m[m]')}
                </p>
              {/if}
              {#if movie.genres.length > 0}
                <p>•</p>
                <div class="flex flex-wrap items-center gap-1">
                  {#each movie.genres as genre}
                    <div class="badge badge-primary">{genre.name}</div>
                  {/each}
                </div>
              {/if}
              {#if movie.tagline}
                <p>•</p>
                <p class="italic">{movie.tagline}</p>
              {/if}
            </div>
            {#if movie.overview}
              <div class="flex flex-col gap-4">
                {#each movie.overview.split(/\n+/) as text}
                  <p>{text}</p>
                {/each}
              </div>
            {/if}
            {#if movie.voteAverage || movie.popularity || movie.budget}
              <div
                class="stats stats-vertical sm:stats-horizontal text-center sm:text-left shadow"
              >
                {#if movie.voteCount}
                  <div class="stat">
                    <div class="stat-title">User rating</div>
                    <div class="stat-value text-secondary">
                      {movie.voteAverage} / 10
                    </div>
                    <div class="stat-desc">{movie.voteCount} votes</div>
                  </div>
                {/if}

                {#if movie.popularity}
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
                {/if}

                {#if movie.revenue > 0 || movie.budget > 0}
                  <div class="stat">
                    <div class="stat-title">Success</div>
                    <div class="stat-value text-secondary">
                      {#if movie.revenue > 0}
                        <div
                          class="tooltip tooltip-info tooltip-top"
                          data-tip={`${currencyFormatter.format(
                            movie.revenue,
                          )} revenue`}
                        >
                          {currencyFormatter.format(
                            Number(movie.revenue - movie.budget) / 1e6,
                          )}M profit
                        </div>
                      {:else}
                        -
                      {/if}
                    </div>
                    <div class="stat-desc opacity-100">
                      {#if movie.revenue > 0 && movie.budget > 0}
                        <span
                          class="opacity-60"
                          class:text-success={movie.revenue > movie.budget}
                          class:text-error={movie.budget > movie.revenue}
                        >
                          {movie.revenue > movie.budget ? '↗︎' : '↘︎'}
                          {percentFormatter.format(
                            Number(
                              ((movie.revenue - movie.budget) * 100n) /
                                movie.budget,
                            ) / 100.0,
                          )}
                        </span>
                      {/if}

                      {#if movie.budget > 0}
                        <div
                          class="tooltip tooltip-info tooltip-top"
                          data-tip={`${currencyFormatter.format(
                            movie.budget,
                          )} budget`}
                        >
                          <span class="opacity-60">
                            ({currencyFormatter.format(
                              Number(movie.budget) / 1e6,
                            )}M)
                          </span>
                        </div>
                      {/if}
                    </div>
                  </div>
                {/if}
              </div>
            {/if}
          </div>
        </div>
      </div>
    </div>
    <Items
      {baseUrl}
      {errors}
      {items}
      itemType="actors"
      descriptionLabel="Character"
      filterable
    />
  </div>
{:else if $MovieStore.data}
  <Error error={`Movie ${id} not found`} />
{/if}
<DebugData store={MovieStore} />
