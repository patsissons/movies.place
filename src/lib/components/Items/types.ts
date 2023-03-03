export interface Item {
  id: number
  title: string
  url: string
  description?: string
  rating?: number
  image?: {
    large: string
    small: string
  }
}
