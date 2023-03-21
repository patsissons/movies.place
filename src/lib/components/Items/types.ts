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
}
export type Ratings = Partial<Record<RatingID, RatingData>>

export interface Item {
  id: number
  imdbId?: string
  order?: number
  title: string
  url: string
  description?: string
  date?: string
  tmdbRating?: RatingData
  image?: {
    src: string
    widths: string[]
    sizes?: string
  }
}
