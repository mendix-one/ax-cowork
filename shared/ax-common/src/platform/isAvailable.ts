/**
 * Check whether a Mendix DynamicValue/EditableValue has a usable value
 * (status 'available' and a defined value).
 */
export function isAvailable<T>(value?: {
  status: string
  value: T | undefined
}): value is { status: 'available'; value: T } {
  return value !== undefined && value.status === 'available' && value.value !== undefined
}

/** Check whether a Mendix value is still loading. */
export function isLoading(value?: { status: string }): boolean {
  return value !== undefined && value.status === 'loading'
}
