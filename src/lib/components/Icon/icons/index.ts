import { default as facebook } from 'ionicons/dist/svg/logo-facebook.svg?c'
import { default as freebase } from './freebase.svg?c'
import { default as globe } from 'ionicons/dist/svg/globe.svg?c'
import { default as imdb } from './imdb.svg?c'
import { default as instagram } from 'ionicons/dist/svg/logo-instagram.svg?c'
import { default as metacritic } from './metacritic.svg?c'
import { default as rottentomatoes } from './rottentomatoes.svg?c'
import { default as tiktok } from 'ionicons/dist/svg/logo-tiktok.svg?c'
import { default as tmdb } from './tmdb.svg?c'
import { default as tvrage } from './tvrage.svg?c'
import { default as twitter } from 'ionicons/dist/svg/logo-twitter.svg?c'
import { default as wikidata } from './wikidata.svg?c'
import { default as youtube } from 'ionicons/dist/svg/logo-youtube.svg?c'

export const icons = {
  facebook,
  freebase,
  globe,
  imdb,
  instagram,
  metacritic,
  rottentomatoes,
  tiktok,
  tmdb,
  tvrage,
  twitter,
  wikidata,
  youtube,
}

export type IconName = keyof typeof icons
