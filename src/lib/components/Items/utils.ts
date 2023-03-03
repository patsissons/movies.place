export function ratingColor(rating: number) {
  if (rating >= 70) return 'su'
  if (rating >= 50) return 'wa'
  return 'er'
}
