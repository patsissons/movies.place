export const allRatingIds = [
  'tmdb',
  'imdb',
  'rottentomatoes',
  'metacritic',
  'aggregate',
] as const

export type RatingID = (typeof allRatingIds)[number]
export interface RatingData {
  label: string
  value: number
  description?: string
  disabled?: boolean
  count?: number
}
export type Ratings = Partial<Record<RatingID, RatingData>>

export interface ItemImage {
  src: string
  widths: string[]
  sizes?: string
  alt?: string
}

export interface Item {
  id: number
  imdbId?: string
  order?: number
  count?: number
  refId?: number
  watchable?: boolean
  title: string
  url: string
  description?: string
  date?: string
  tmdbRating?: RatingData
  image?: ItemImage
}
