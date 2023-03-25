export function denull<T>(input: T | null | undefined) {
  return input as T
}
