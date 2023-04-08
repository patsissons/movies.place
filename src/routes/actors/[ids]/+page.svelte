<script lang="ts">
  import { derived, writable } from 'svelte/store'
  import { baseUrlStore, itemsStore } from '$lib/stores'
  import type { PageData } from './$houdini'
  import { Items, type Item, type ItemImage } from '$lib/components/Items'
  import type { ItemList } from '$lib/stores/items'
  import ItemGrid from '$lib/components/Items/ItemGrid.svelte'
  import type { Person$result } from '$houdini'
  import dayjs from 'dayjs'

  export let data: PageData

  const { Configuration, PeopleStores, ids } = data
  const baseUrl = baseUrlStore(Configuration)

  const selectedActors = writable<number[]>(ids)

  let watchable: boolean = true

  const people = PeopleStores.map((personStore) =>
    itemsStore(
      Configuration,
      personStore,
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
          genreIds,
        },
        images,
        source,
      ) =>
        ({
          id,
          refId: source.id,
          watchable:
            source.imdbId != null && voteCount > 5 && genreIds.length > 0,
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
      sources
        .filter((source): source is NonNullable<Person$result['person']> =>
          Boolean(source),
        )
        .map(
          ({ id, name: title }) =>
            ({
              id,
              title,
              url: `/actor/${id}`,
              image: refImages?.[id],
            } as Item),
        ),
  )

  const filteredItems = writable<ItemList<Item>>()

  $: {
    if (!$filteredItems) {
      filteredItems.set($items)
    } else {
      const list = $items.list.filter((item) => {
        if (watchable && !item.watchable) return false
        if (item.refId && !$selectedActors.includes(item.refId)) return false
        if (filterYear && item.date) {
          if (dayjs(item.date).year() < filterYear) return false
        }

        if (item.tmdbRating && item.tmdbRating.value < filterRating)
          return false

        return true
      })

      console.log('update', list)
      filteredItems.update((items) => {
        return {
          ...items,
          list,
        }
      })
    }
  }

  function handleSelectionChanged({
    detail: { id },
  }: CustomEvent<{ id: number }>) {
    if (!selectedActors) return

    selectedActors.update((values) => {
      const selected = values.includes(id)
      if (selected) return values.filter((value) => value !== id)

      return values.concat(id)
    })
  }
</script>

<div class="flex flex-col items-center gap-4">
  <div class="collapse collapse-arrow">
    <input type="checkbox" class="peer" checked />
    <div class="collapse-title">Filters</div>
    <div class="collapse-content">
      <div class="flex flex-col items-center justify-center gap-2">
        <ItemGrid
          {baseUrl}
          items={actors}
          selectedItems={selectedActors}
          center
          on:selectionChanged={handleSelectionChanged}
        />
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
  />
</div>
