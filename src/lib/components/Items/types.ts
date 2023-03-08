export type RatingID = 'tmdb' | 'imdb' | 'rt' | 'meta'

export interface Item {
  id: number
  title: string
  url: string
  description?: string
  date?: string
  ratings?: Partial<
    Record<
      RatingID,
      {
        label: string
        value: number
        description?: string
      }
    >
  >
  image?: {
    src: string
    widths: string[]
    sizes?: string
  }
}
