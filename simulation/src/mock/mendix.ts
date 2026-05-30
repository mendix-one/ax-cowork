// Minimal stubs of the Mendix runtime value APIs that pluggable widgets consume.
// Each factory pairs with a React state hook below so the simulation page owns the
// data; widgets see exactly the prop shape they'd see inside Studio Pro.

import { Dispatch, SetStateAction } from 'react'

export type Status = 'available' | 'loading' | 'unavailable'

export interface EditableValue<T> {
  status: Status
  value: T | null
  displayValue?: string
  validation?: string
  readOnly?: boolean
  setValue(value: T | null): void
}

export interface DynamicValue<T> {
  status: Status
  value: T | null
}

export interface ActionValue {
  canExecute: boolean
  isExecuting: boolean
  execute(): void
}

export interface WebImage {
  uri: string
  altText?: string
}

// ----- Factories -----

export function editable<T>(state: [T, Dispatch<SetStateAction<T>>], opts?: { readOnly?: boolean }): EditableValue<T> {
  const [value, setValue] = state
  return {
    status: 'available',
    value,
    readOnly: opts?.readOnly,
    setValue: (next) => setValue(next as T),
  }
}

export function dynamic<T>(value: T | null | undefined): DynamicValue<T> {
  return {
    status: 'available',
    value: (value ?? null) as T | null,
  }
}

export function action(impl: () => void, opts?: { canExecute?: boolean }): ActionValue {
  return {
    canExecute: opts?.canExecute ?? true,
    isExecuting: false,
    execute: impl,
  }
}

export function webImage(uri: string, altText?: string): DynamicValue<WebImage> {
  return dynamic<WebImage>({ uri, altText })
}
