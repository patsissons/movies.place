import camelCaseKeys from 'camelcase-keys'

export function camelize<Output>(input: Record<string, unknown>) {
  return camelCaseKeys(input, { deep: true }) as Output
}
