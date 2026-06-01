import { useEffect, useRef } from 'react'

import { getEventBus, initEventBus } from './bus'
import { AX_BROADCAST, type AxEventHandler, widgetTopic } from './types'

interface UseWidgetEventsOptions {
  /** Widget instance name from Mendix props (e.g. 'AxLogin1'). */
  widgetName: string
  /** Handler invoked for events on both the broadcast and this widget's private topic. */
  onEvent: AxEventHandler
  /** If true, ensure the bus exists (layout/host widgets, or a standalone widget). Default: false. */
  isLayout?: boolean
}

/**
 * Subscribe to the global Ax event bus from a widget's container layer.
 *
 * - **Layout/host widgets** pass `isLayout: true` to guarantee the bus is created.
 * - **Child widgets** connect to whatever bus already exists.
 *
 * Each widget listens on two topics:
 * 1. `ax:broadcast` — all widgets receive
 * 2. `ax:{widgetName}` — only this widget instance
 *
 * The latest `onEvent` is always used (kept in a ref) without resubscribing on every render.
 */
export function useWidgetEvents({ widgetName, onEvent, isLayout }: UseWidgetEventsOptions): void {
  const handlerRef = useRef(onEvent)
  handlerRef.current = onEvent

  useEffect(() => {
    const bus = isLayout ? initEventBus() : getEventBus()
    if (!bus) {
      return
    }

    const privateTopic = widgetTopic(widgetName)
    const handler: AxEventHandler = (event) => handlerRef.current(event)

    bus.on(AX_BROADCAST, handler)
    bus.on(privateTopic, handler)

    return () => {
      bus.removeListener(AX_BROADCAST, handler)
      bus.removeListener(privateTopic, handler)
    }
  }, [widgetName, isLayout])
}
