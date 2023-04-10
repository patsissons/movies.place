<script lang="ts">
  import { derived, writable } from 'svelte/store'
  import { baseUrlStore, itemsStore } from '$lib/stores'
  import type { PageData } from './$houdini'
  import { Items, type Item, type ItemImage } from '$lib/components/Items'
  import type { ItemList } from '$lib/stores/items'
  import ItemGrid from '$lib/components/Items/ItemGrid.svelte'
  import type { Person$result } from '$houdini'
  import dayjs from 'dayjs'
  import DebugData from '$lib/components/Debug/DebugData.svelte'
  import type { QueryStoreWithoutCustomScalars } from '$lib/types/graphql'

  export let data: PageData

  const { Configuration, PeopleStores, ids } = data
  const baseUrl = baseUrlStore(Configuration)

  const selectedActors = writable<number[]>(ids)
  const selectedMovieIds = writable<number[]>([])

  let watchable: boolean = true

  const people = PeopleStores.map((personStore) =>
    itemsStore(
      Configuration,
      personStore as QueryStoreWithoutCustomScalars<
        typeof personStore,
        Person$result
      >,
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
          popularity,
          posterPath,
          movie: {
            externalIds: { imdbId },
            budget,
            revenue,
            runtime,
          },
          genreIds,
        },
        images,
        source,
      ) =>
        ({
          id,
          refId: source.id,
          watchable:
            Boolean(source.imdbId) &&
            voteAverage > 0 &&
            voteCount > 5 &&
            popularity > 0 &&
            genreIds.length > 0 &&
            (budget as bigint) > 0 &&
            (revenue as bigint) > 0 &&
            (runtime || 0) > 60 &&
            Boolean(character),
          imdbId: imdbId ?? undefined,
          title,
          date: releaseDate ?? undefined,
          tmdbRating: {
            label: 'TMDB',
            value: voteAverage * 10,
            count: voteCount,
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
    ),
  )

  const fetching = derived(
    people.map(({ fetching }) => fetching),
    (fetching) => fetching.some(Boolean),
  )
  const errors = derived(
    people.map(({ errors }) => errors),
    (allErrors) =>
      allErrors.filter((errors): errors is string[] => Boolean(errors)).flat(),
  )
  const items = derived(
    people.map(({ items }) => items),
    (allItems) =>
      ({
        variables: {},
        list: Array.from<Item>(
          allItems
            .filter((items): items is ItemList<Item> => Boolean(items?.list))
            .reduce((map, items) => {
              items.list.forEach((item) => {
                const actor = map.get(item.id)

                if (actor) {
                  actor.count!++
                  return map
                }

                item.count = 1
                return map.set(item.id, item)
              })

              return map
            }, new Map<number, Item>())
            .values(),
        ),
      } as ItemList<Item>),
  )
  const refImages = derived(
    [Configuration, ...PeopleStores],
    ([configuration, ...peopleStores]) => {
      if (!configuration.data?.configuration.images?.profileSizes) return

      const { profileSizes } = configuration.data.configuration.images

      return peopleStores.reduce((map, { data }) => {
        if (data?.person) {
          const { id, name, profilePath } = data.person
          map[id] = profilePath
            ? {
                src: profilePath,
                widths: profileSizes,
                alt: `${name} image`,
              }
            : undefined
        }

        return map
      }, {} as Record<number, ItemImage | undefined>)
    },
  )

  const selectedMovies = derived([selectedMovieIds, items], ([$ids, $items]) =>
    $items.list.filter((item) => $ids.includes(item.id)),
  )

  let minYear: number | undefined
  let maxYear: number | undefined
  let filterYear: number | undefined

  $: if (!filterYear) {
    const years = $items.list
      .filter((item): item is Item & { date: string } => Boolean(item.date))
      .sort((a, b) => (dayjs(a.date).isAfter(b.date) ? 1 : -1))
      .map((item) => dayjs(item.date).year())

    minYear = years[0]
    maxYear = years[years.length - 1]
    filterYear = Math.max(2000, minYear)
  }

  let filterRating = 50

  const actors = derived(
    [refImages, ...people.map(({ source }) => source)],
    ([refImages, ...sources]) =>
      (sources as (Person$result['person'] | null)[])
        .filter((source): source is NonNullable<Person$result['person']> =>
          Boolean(source),
        )
        .map(
          ({ id, name: title, cast }) =>
            ({
              id,
              title,
              description: `${cast.length} movies`,
              url: `/actor/${id}`,
              image: refImages?.[id],
            } as Item),
        ),
  )

  const filteredItems = writable<ItemList<Item>>()

  $: {
    const { list, variables } = $items
    const filteredList = list.filter((item) => {
      if (watchable && !item.watchable) return false
      if (item.refId && !$selectedActors.includes(item.refId)) return false
      if (filterYear && item.date) {
        if (dayjs(item.date).year() < filterYear) return false
      }

      if (item.tmdbRating && item.tmdbRating.value < filterRating) return false

      return true
    })

    filteredItems.set({
      variables,
      list: filteredList,
    })
  }

  function handleSelectionChanged({
    detail: { id },
  }: CustomEvent<{ id: number }>) {
    selectedActors.update((values) => {
      const selected = values.includes(id)
      if (selected) return values.filter((value) => value !== id)

      return values.concat(id)
    })
  }

  function handleShortlistChanged({
    detail: { id },
  }: CustomEvent<{ id: number }>) {
    selectedMovieIds.update((values) => {
      const selected = values.some((value) => value === id)
      if (selected) return values.filter((value) => value !== id)

      return values.concat(id)
    })
  }

  function handleShortlistRemoved({
    detail: { id },
  }: CustomEvent<{ id: number }>) {
    selectedMovieIds.update((values) => values.filter((value) => value !== id))
  }
</script>

<div class="flex flex-col items-center gap-4">
  {#if $selectedMovies.length > 0}
    <div class="p-4">
      <div
        class="flex flex-col gap-4 p-2 border border-base-300 bg-base-200 rounded-box"
      >
        <p class="text-xl text-center">Short list</p>
        <ItemGrid
          {baseUrl}
          items={selectedMovies}
          selectedItems={selectedMovieIds}
          on:selectionChanged={handleShortlistRemoved}
        />
      </div>
    </div>
  {/if}
  <div class="collapse collapse-arrow">
    <input type="checkbox" class="peer" checked />
    <div class="collapse-title text-center">Filters</div>
    <div class="collapse-content">
      <div class="flex flex-col items-center justify-center gap-2">
        <div class="w-full">
          <ItemGrid
            {baseUrl}
            items={actors}
            selectedItems={selectedActors}
            on:selectionChanged={handleSelectionChanged}
          />
        </div>
        <div
          class="flex flex-col sm:flex-row items-center sm:items-end gap-4 w-full p-4 border border-base-300 bg-base-200 rounded-box"
        >
          <label class="flex gap-2 label cursor-pointer">
            <span class="label-text">Watchable?</span>
            <input type="checkbox" class="checkbox" bind:checked={watchable} />
          </label>
          <div class="flex flex-col items-center gap-1">
            <p>Min Rating: {filterRating}</p>
            <label class="flex gap-2 label cursor-pointer">
              <input
                type="range"
                min={0}
                max={100}
                bind:value={filterRating}
                class="range"
                step={1}
              />
            </label>
          </div>
          {#if minYear && maxYear && filterYear}
            <div class="flex flex-col items-center gap-1">
              <p>Min Year: {filterYear}</p>
              <label class="flex gap-2 label cursor-pointer">
                <span class="label-text">{minYear}</span>
                <input
                  type="range"
                  min={minYear}
                  max={maxYear}
                  bind:value={filterYear}
                  class="range"
                  step={1}
                />
                <span class="label-text">{maxYear}</span>
              </label>
            </div>
          {/if}
        </div>
      </div>
    </div>
  </div>
  <Items
    {baseUrl}
    {errors}
    {fetching}
    items={filteredItems}
    {refImages}
    itemType="movies"
    descriptionLabel="Character"
    filterable
    selectedItems={selectedMovieIds}
    on:selectionChanged={handleShortlistChanged}
  />
</div>
<DebugData data={$filteredItems} />
