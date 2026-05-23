var globalScope
if (typeof window !== 'undefined') {
  globalScope = window
} else {
  globalScope = global
}

export default globalScope
