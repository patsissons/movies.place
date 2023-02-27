export const urls = {
  tmdb(id: number) {
    return ['https://www.themoviedb.org/movie', id].join('/')
  },
  imdb(id: string) {
    return ['https://www.imdb.com/title', id].join('/')
  },
}
