import type { ReactElement } from 'react'
import { useCallback, useEffect } from 'react'
import { observer } from 'mobx-react-lite'
import { type AxEvent, useWidgetEvents } from '@ax/common'
import type { AxDisplayPanelContainerProps } from '../typings/AxDisplayPanelProps'
import { useAxDisplayPanelStore } from './stores/context'
import { AxDisplayPanelMain } from './main/AxDisplayPanelMain'

// Props ↔ store bridge layer. The ONLY component that reads the Mendix container props: it pushes each
// group into the store through a dedicated useEffect (keyed on exactly that group's props, so values
// that resolve after mount are picked up), and it wires the global Ax event bus.
//
// The store never touches a Mendix value. Instead it emits ACT_* intents on its private topic; this
// component holds the ActionValue + bound attribute and turns those intents into real Mendix calls
// (execute() + setValue()). Nanoflows / other widgets can also drive the panel by emitting CMD_*
// (CMD_MAXIMIZE | CMD_RESTORE | CMD_TOGGLE | CMD_CLOSE), and the panel reacts to the host layout's
// AX_LAYOUT_RIGHT_CHANGED broadcast (right hidden → maximize, right shown → restore). isLayout ensures
// the bus exists when the panel stands alone. AxDisplayPanelMain below works purely off store state.
export const AxDisplayPanelSync = observer((props: AxDisplayPanelContainerProps): ReactElement => {
  const store = useAxDisplayPanelStore()

  // Widget attributes.
  useEffect(() => {
    store.setWidget(props.name || 'axDisplayPanel1', props.class, props.style, props.tabIndex)
  }, [store, props.name, props.class, props.style, props.tabIndex])

  // Header (type, title, icon).
  useEffect(() => {
    store.setHeader(props.prpEnmType, props.prpStrTitle, props.prpIcnHeader?.value ?? undefined)
  }, [store, props.prpEnmType, props.prpStrTitle, props.prpIcnHeader])

  // Toolbar / content drop zones.
  useEffect(() => {
    store.setToolbar(props.prpWdgToolbar)
  }, [store, props.prpWdgToolbar])

  useEffect(() => {
    store.setContent(props.prpWdgContent)
  }, [store, props.prpWdgContent])

  // Bound maximize attribute (the source of truth when present).
  useEffect(() => {
    store.setMaximized(props.prpAtrMaximized !== undefined, props.prpAtrMaximized?.value === true)
  }, [store, props.prpAtrMaximized])

  // Action callbacks. The Mendix ActionValues / EditableValue and their guards stay here at the top
  // level; the store only asks for them by emitting ACT_* on its private topic.
  const onMaximize = useCallback(() => {
    props.prpAtrMaximized?.setValue(true)
    if (props.prpActMaximize && props.prpActMaximize.canExecute && !props.prpActMaximize.isExecuting) {
      props.prpActMaximize.execute()
    }
  }, [props.prpAtrMaximized, props.prpActMaximize])

  const onRestore = useCallback(() => {
    props.prpAtrMaximized?.setValue(false)
    if (props.prpActRestore && props.prpActRestore.canExecute && !props.prpActRestore.isExecuting) {
      props.prpActRestore.execute()
    }
  }, [props.prpAtrMaximized, props.prpActRestore])

  const onClose = useCallback(() => {
    if (props.prpActClose && props.prpActClose.canExecute && !props.prpActClose.isExecuting) {
      props.prpActClose.execute()
    }
  }, [props.prpActClose])

  const handleEvent = useCallback(
    (event: AxEvent) => {
      const { action, payload } = event
      if (action?.startsWith('CMD_')) {
        store.handleCommand(action)
      } else if (action?.startsWith('AX_LAYOUT_')) {
        store.handleLayout(action, payload)
      } else if (action?.startsWith('ACT_')) {
        switch (action) {
          case 'ACT_MAXIMIZE':
            onMaximize()
            break
          case 'ACT_RESTORE':
            onRestore()
            break
          case 'ACT_CLOSE':
            onClose()
            break
          default:
            break
        }
      }
    },
    [store, onMaximize, onRestore, onClose],
  )
  useWidgetEvents({ widgetName: props.name, onEvent: handleEvent, isLayout: true })

  return <AxDisplayPanelMain />
})
