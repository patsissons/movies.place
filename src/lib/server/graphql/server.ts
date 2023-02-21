import { useGraphQlJit } from '@envelop/graphql-jit'
import { createYoga } from 'graphql-yoga'
import { context } from './context'
import { schema } from './schema'
import type { Context } from './types'

export const server = createYoga<Context>({
  logging: true,
  schema,
  context,
  plugins: [useGraphQlJit()],
  graphqlEndpoint: '/api/graphql',
  graphiql: {
    defaultQuery: `
query SortedMovies {
  sortedMovies {
    page
    totalResults
    totalPages
    results {
      id
      title
      posterPath
      adult
      overview
      releaseDate
      genreIds
      originalTitle
      originalLanguage
      backdropPath
      popularity
      voteCount
      video
      voteAverage
    }
  }
}

query Movies {
  movies(query: "skyfall") {
    page
    totalPages
    totalResults
    results {
      id
      posterPath
      adult
      overview
      releaseDate
      genreIds
      originalTitle
      originalLanguage
      title
      backdropPath
      popularity
      voteCount
      video
      voteAverage
    }
  }
}

query Movie {
  movie(id: 37724) {
    id
    adult
    backdropPath
    belongsToCollection {
      id
      name
      overview
      posterPath
      backdropPath
    }
    budget
    genres {
      id
      name
    }
    homepage
    imdbId
    originalLanguage
    originalTitle
    overview
    popularity
    posterPath
    productionCompanies {
      id
      name
      logoPath
      originCountry
    }
    productionCountries {
      iso31661
      name
    }
    releaseDate
    revenue
    runtime
    spokenLanguages {
      iso6391
      name
    }
    status
    tagline
    title
    video
    voteAverage
    voteCount
    cast {
      id
      adult
      gender
      knownForDepartment
      name
      originalName
      popularity
      profilePath
      castId
      character
      creditId
      order
    }
  }
}

query People {
  people(query: "Daniel Craig") {
    page
    totalPages
    totalResults
    results {
      id
      profilePath
      adult
      knownFor {
        id
        posterPath
        adult
        overview
        releaseDate
        genreIds
        originalTitle
        originalLanguage
        title
        backdropPath
        popularity
        voteCount
        video
        voteAverage
      }
      name
      popularity
    }
  }
}

query Person {
  person(id: 8784) {
    id
    birthday
    knownForDepartment
    deathday
    name
    alsoKnownAs
    gender
    biography
    popularity
    placeOfBirth
    profilePath
    adult
    imdbId
    homepage
    cast {
      id
      character
      creditId
      releaseDate
      voteCount
      video
      adult
      voteAverage
      title
      genreIds
      originalLanguage
      originalTitle
      popularity
      backdropPath
      overview
      posterPath
    }
  }
}
`,
  },
  fetchAPI: globalThis,
})
