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
  const { errors, fetching, items } = itemsStore(
    Configuration,
    PersonStore,
    (data) => data.person,
    (person) => person.cast,
    (
      {
        id,
        title,
        character,
        releaseDate,
        voteAverage,
        voteCount,
        posterPath,
        movie: {
          externalIds: { imdbId },
        },
      },
      images,
    ) =>
      ({
        id,
        imdbId: imdbId ?? undefined,
        title,
        date: releaseDate ?? undefined,
        tmdbRating: {
          label: 'TMDB',
          value: voteAverage * 10,
          description: `${voteCount} votes`,
          disabled: voteCount === 0,
        },
        url: `/movie/${id}`,
        image: posterPath
          ? {
              src: posterPath,
              widths: images.posterSizes,
            }
          : undefined,
        description: character,
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
            <div class="flex flex-wrap items-center gap-2 text-white">
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
              {#if person.externalIds.facebookId}
                <a
                  class="btn btn-ghost btn-sm"
                  href={`https://facebook.com/${person.externalIds.facebookId}`}
                  target="_blank"
                  rel="noreferrer"
                >
                  <Icon icon="facebook" size={20} />
                </a>
              {/if}
              {#if person.externalIds.instagramId}
                <a
                  class="btn btn-ghost btn-sm"
                  href={`https://www.instagram.com/${person.externalIds.instagramId}`}
                  target="_blank"
                  rel="noreferrer"
                >
                  <Icon icon="instagram" size={20} />
                </a>
              {/if}
              {#if person.externalIds.twitterId}
                <a
                  class="btn btn-ghost btn-sm"
                  href={`https://twitter.com/${person.externalIds.twitterId}`}
                  target="_blank"
                  rel="noreferrer"
                >
                  <Icon icon="twitter" size={20} />
                </a>
              {/if}
              {#if person.externalIds.youtubeId}
                <a
                  class="btn btn-ghost btn-sm"
                  href={`https://youtube.com/${person.externalIds.youtubeId}`}
                  target="_blank"
                  rel="noreferrer"
                >
                  <Icon icon="youtube" size={20} />
                </a>
              {/if}
              {#if person.externalIds.tiktokId}
                <a
                  class="btn btn-ghost btn-sm"
                  href={`https://tiktok.com/${person.externalIds.tiktokId}`}
                  target="_blank"
                  rel="noreferrer"
                >
                  <Icon icon="tiktok" size={20} />
                </a>
              {/if}
              {#if person.externalIds.wikidataId}
                <a
                  class="btn btn-ghost btn-sm"
                  href={`https://www.wikidata.org/wiki/${person.externalIds.wikidataId}`}
                  target="_blank"
                  rel="noreferrer"
                >
                  <Icon icon="wikidata" size={20} />
                </a>
              {/if}
              <!-- {#if person.externalIds.tvrageId}
                <a
                  class="btn btn-ghost btn-sm"
                  href={`https://www.tvrage.com/${person.externalIds.tvrageId}`}
                  target="_blank"
                  rel="noreferrer"
                >
                  <Icon icon="tvrage" size={20} />
                </a>
              {/if} -->
              <!-- {#if person.externalIds.freebaseId}
                <a
                  class="btn btn-ghost btn-sm"
                  href={`https://www.freebase.com/m/${person.externalIds.freebaseId}`}
                  target="_blank"
                  rel="noreferrer"
                >
                  <Icon icon="freebase" size={20} />
                </a>
              {/if} -->
              <!-- {#if person.externalIds.freebaseMid && !person.externalIds.freebaseId}
                <a
                  class="btn btn-ghost btn-sm"
                  href={`https://www.freebase.com/${person.externalIds.freebaseMid}`}
                  target="_blank"
                  rel="noreferrer"
                >
                  <Icon icon="freebase" size={20} />
                </a>
              {/if} -->
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
      {fetching}
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
