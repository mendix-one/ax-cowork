export default (initCallback, renderCallback) => {
  let pendingOperation: 'none' | 'init' | 'render' = 'none'
  let operationTimeout: number | undefined

  function cancelPendingOperation() {
    if (operationTimeout !== undefined) {
      clearTimeout(operationTimeout)
      operationTimeout = undefined
    }
  }

  function onCallback() {
    if (pendingOperation === 'init') {
      initCallback()
    } else if (pendingOperation === 'render') {
      renderCallback()
    }
    pendingOperation = 'none'
    operationTimeout = undefined
  }

  function debounceInit(wait = 1) {
    if (operationTimeout !== undefined) {
      clearTimeout(operationTimeout)
    }
    pendingOperation = 'init'
    operationTimeout = window.setTimeout(onCallback, wait)
  }

  function debounceRender(wait = 1) {
    if (pendingOperation !== 'init') {
      pendingOperation = 'render'
    }

    if (operationTimeout !== undefined) {
      clearTimeout(operationTimeout)
    }

    operationTimeout = window.setTimeout(onCallback, wait)
  }

  return {
    debounceInit,
    debounceRender,
    cancelPendingOperation,
  }
}
