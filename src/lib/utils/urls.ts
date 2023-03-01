export const urls = {
  tmdb(id: number, type: 'movie' | 'person' = 'movie') {
    return ['https://www.themoviedb.org', type, id].join('/')
  },
  imdb(id: string, type: 'title' | 'name' = 'title') {
    return ['https://www.imdb.com', type, id].join('/')
  },
}
