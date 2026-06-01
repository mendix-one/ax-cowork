// Minimal stubs of the Mendix runtime value APIs that pluggable widgets consume.
// Each factory pairs with a React state hook below so the simulation page owns the
// data; widgets see exactly the prop shape they'd see inside Studio Pro.
// ----- Factories -----
export function editable(state, opts) {
  const [value, setValue] = state
  return {
    status: 'available',
    value,
    readOnly: opts?.readOnly,
    setValue: (next) => setValue(next),
  }
}
export function dynamic(value) {
  return {
    status: 'available',
    value: value ?? null,
  }
}
export function action(impl, opts) {
  return {
    canExecute: opts?.canExecute ?? true,
    isExecuting: false,
    execute: impl,
  }
}
export function webImage(uri, altText) {
  return dynamic({ uri, altText })
}
