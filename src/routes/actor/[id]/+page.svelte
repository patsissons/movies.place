<script lang="ts">
  import meanBy from 'lodash/meanBy'
  import { page } from '$app/stores'
  import { Error } from '$lib/components/Errors'
  import { Icon } from '$lib/components/Icon'
  import { PosterImage } from '$lib/components/Poster'
  import { baseUrlStore, itemsStore } from '$lib/stores'
  import { urls } from '$lib/utils/urls'
  import type { PageData } from './$houdini'
  import dayjs from 'dayjs'
  import { Items, type Item } from '$lib/components/Items'
  import DebugData from '$lib/components/DebugData.svelte'
  import { imagesStore } from '$lib/stores/imagesStore'

  export let data: PageData

  const { id } = $page.route
  const { Configuration, PersonStore } = data
  const baseUrl = baseUrlStore(Configuration)
  const images = imagesStore(Configuration)

  $: person = $PersonStore.data?.person
  const { errors, items } = itemsStore(
    Configuration,
    PersonStore,
    (data) => data.person?.cast,
    ({ id, title, character, releaseDate, voteAverage, posterPath }, images) =>
      ({
        id,
        title,
        url: `/movie/${id}`,
        rating: voteAverage * 10,
        description: `${character}${
          releaseDate ? ` (${dayjs(releaseDate).year()})` : ''
        }`,
        image: posterPath
          ? {
              src: posterPath,
              widths: images.posterSizes,
            }
          : undefined,
      } as Item),
  )
</script>

{#if person}
  <div class="flex flex-col gap-2">
    <div class="hero min-h-screen bg-base-200">
      <div class="hero-content flex-col lg:flex-row lg:items-start text-white">
        <div class="indicator w-full lg:w-auto">
          {#if person.adult}
            <span
              class="indicator-item indicator-start indicator-top badge badge-secondary"
            >
              adult
            </span>
          {/if}
          {#if person.profilePath && $images}
            <PosterImage
              class="rounded-lg shadow-2xl"
              {baseUrl}
              src={person.profilePath}
              widths={$images.profileSizes}
              sizes="(max-width: 1280px) 183px, (max-width: 1024px) 119px, 100vw"
              alt={`${person.name} image`}
            />
          {/if}
        </div>
        <div class="flex flex-col gap-4">
          <div class="flex flex-wrap items-center justify-between gap-2">
            <h1 class="text-4xl font-bold">{person.name}</h1>
            <div class="flex items-center gap-2 text-white">
              <a
                class="btn btn-ghost btn-sm"
                href={urls.tmdb(person.id, 'person')}
                target="_blank"
                rel="noreferrer"
              >
                <Icon icon="tmdb" size={20} />
              </a>
              {#if person.imdbId}
                <a
                  class="btn btn-ghost btn-sm"
                  href={urls.imdb(person.imdbId, 'name')}
                  target="_blank"
                  rel="noreferrer"
                >
                  <Icon icon="imdb" size={20} />
                </a>
              {/if}
              {#if person.homepage}
                <a
                  class="btn btn-ghost btn-sm"
                  href={person.homepage}
                  target="_blank"
                  rel="noreferrer"
                >
                  <Icon icon="globe" size={20} />
                </a>
              {/if}
            </div>
          </div>
          <div class="flex flex-col gap-4">
            {#each person.biography.split(/\n+/) as text}
              <p>{text}</p>
            {/each}
          </div>
          {#if person.cast.length > 0 || person.popularity || person.birthday}
            <div
              class="stats stats-vertical md:stats-horizontal text-center md:text-left shadow"
            >
              {#if person.cast.length > 0}
                <div class="stat">
                  <div class="stat-title">Movies</div>
                  <div class="stat-value text-secondary">
                    {person.cast.length}
                  </div>
                  <div class="stat-desc">
                    {meanBy(
                      person.cast,
                      ({ voteAverage }) => voteAverage,
                    ).toFixed(2)} / 10 average
                  </div>
                </div>
              {/if}

              {#if person.popularity}
                <div class="stat">
                  <div class="stat-title">Popularity</div>
                  <div class="stat-value text-secondary">
                    {person.popularity}
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

              {#if person.birthday}
                <div class="stat">
                  <div class="stat-title">Age</div>
                  <div class="stat-value text-secondary">
                    {person.deathday
                      ? dayjs(person.birthday).from(person.deathday)
                      : dayjs(person.birthday).fromNow(true)}
                  </div>
                </div>
              {/if}
            </div>
          {/if}
        </div>
      </div>
    </div>
    <Items
      {baseUrl}
      {errors}
      {items}
      itemType="movies"
      descriptionLabel="Character"
      filterable
    />
  </div>
{:else if $PersonStore.data}
  <Error error={`Actor ${id} not found`} />
{/if}
<DebugData store={PersonStore} />
