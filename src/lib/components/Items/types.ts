export const allRatingIds = [
  'tmdb',
  'imdb',
  'rottentomatoes',
  'metacritic',
  'aggregate',
] as const

export type RatingID = (typeof allRatingIds)[number]
export type Ratings = Partial<
  Record<
    RatingID,
    {
      label: string
      value: number
      description?: string
    }
  >
>

export interface Item {
  id: number
  order?: number
  title: string
  url: string
  description?: string
  date?: string
  ratings?: Ratings
  image?: {
    src: string
    widths: string[]
    sizes?: string
  }
}
