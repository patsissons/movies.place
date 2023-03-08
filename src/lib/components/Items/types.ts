export interface Item {
  id: number
  title: string
  url: string
  description?: string
  ratings?: {
    label: string
    value: number
  }[]
  image?: {
    src: string
    widths: string[]
    sizes?: string
  }
}
