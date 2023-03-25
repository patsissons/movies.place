<script lang="ts">
  import { derived } from 'svelte/store'
  import { baseUrlStore, itemsStore } from '$lib/stores'
  import type { PageData } from './$houdini'
  import { Items, type Item, type ItemImage } from '$lib/components/Items'
  import type { ItemList } from '$lib/stores/items'

  export let data: PageData

  const { Configuration, PeopleStores } = data
  const baseUrl = baseUrlStore(Configuration)

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
        },
        images,
        source,
      ) =>
        ({
          id,
          refId: source.id,
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
</script>

<Items
  {baseUrl}
  {errors}
  {fetching}
  {items}
  {refImages}
  itemType="movies"
  descriptionLabel="Character"
  filterable
/>
