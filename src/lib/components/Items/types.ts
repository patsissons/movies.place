export interface Item {
  id: number
  title: string
  url: string
  description?: string
  rating?: number
  image?: {
    src: string
    widths: string[]
    sizes?: string
  }
}
