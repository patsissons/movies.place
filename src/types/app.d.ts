// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces
declare global {
  namespace App {
    // interface Error {}
    // interface Locals {}
    // interface PageData {}
    // interface Platform {}
  }

  interface ImportMetaEnv {
    VITE_TMDB_API_KEY?: string
    VITE_OMDB_API_KEY?: string
  }
}

export {}
