declare module '*.graphql' {
  import type { DocumentNode } from 'graphql'
  const node: DocumentNode
  export default node
}
