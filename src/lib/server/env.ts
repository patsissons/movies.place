/* eslint-disable no-process-env */

// general env
export const NODE_ENV = process.env.NODE_ENV

// api key env
export const TMDB_API_KEY = import.meta.env.VITE_TMDB_API_KEY
export const OMDB_API_KEY = import.meta.env.VITE_OMDB_API_KEY

// env transformations
export const isDevelopment = Boolean(NODE_ENV === 'development')
export const isProduction = Boolean(NODE_ENV === 'production')
