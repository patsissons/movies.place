export interface Item {
  id: number
  title: string
  url: string
  description?: string
  image?: {
    large: string
    small: string
  }
}
