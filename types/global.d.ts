// Allow importing CSS files in TSX files
declare module '*.css'
declare module '*.scss'

declare namespace JSX {
  interface IntrinsicElements {
    [elemName: string]: any
  }
}
