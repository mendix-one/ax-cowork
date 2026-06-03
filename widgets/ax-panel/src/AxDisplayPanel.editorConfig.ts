import { AxDisplayPanelPreviewProps } from '../typings/AxDisplayPanelProps'

export type Platform = 'web' | 'desktop'

export type Properties = PropertyGroup[]

type PropertyGroup = {
  caption: string
  propertyGroups?: PropertyGroup[]
  properties?: Property[]
}

type Property = {
  key: string
  caption: string
  description?: string
  objectHeaders?: string[]
  objects?: ObjectProperties[]
  properties?: Properties[]
}

type ObjectProperties = {
  properties: PropertyGroup[]
  captions?: string[]
}

export type Problem = {
  property?: string
  severity?: 'error' | 'warning' | 'deprecation'
  message: string
  studioMessage?: string
  url?: string
  studioUrl?: string
}

// Recursively drop the listed property keys from the (mutable) property tree.
function hideKeys(groups: Properties, keys: string[]): void {
  for (const group of groups) {
    if (group.properties) {
      group.properties = group.properties.filter((p) => !keys.includes(p.key))
    }
    if (group.propertyGroups) {
      hideKeys(group.propertyGroups, keys)
    }
  }
}

export function getProperties(values: AxDisplayPanelPreviewProps, defaultProperties: Properties /* , target: Platform */): Properties {
  // Main panels maximize/restore (boolean attribute + actions); Sub panels only close. Hide the
  // irrelevant controls for the selected type so the property pane stays focused.
  const hidden = values.prpEnmType === 'sub' ? ['prpAtrMaximized', 'prpActMaximize', 'prpActRestore'] : ['prpActClose']
  hideKeys(defaultProperties, hidden)
  return defaultProperties
}
