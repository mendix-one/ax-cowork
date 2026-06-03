/**
 * Event payload for inter-widget communication on the global Ax event bus.
 */
export interface AxEvent {
  /** Event action name (e.g. 'reset', 'submit', 'theme-changed', 'navigate') */
  action: string
  /** Optional data payload */
  payload?: unknown
}

export type AxEventHandler = (event: AxEvent) => void

/** Broadcast topic — every subscribedwidgetTopic widget receives events sent here. */
export const AX_BROADCAST = 'ax:broadcast'

/** Build the private topic name for a specific widget instance (its Mendix `name`). */
export const widgetTopic = (widgetName: string): string => `ax:${widgetName}`
