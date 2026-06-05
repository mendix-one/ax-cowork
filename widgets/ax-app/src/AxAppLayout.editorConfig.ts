import { AxAppLayoutPreviewProps } from '../typings/AxAppLayoutProps'

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

// Recursively drop properties (by key) from the property tree — used to hide irrelevant props per mode.
function hideProperties(groups: Properties, keys: string[]): void {
  for (const group of groups) {
    if (group.propertyGroups) hideProperties(group.propertyGroups, keys)
    if (group.properties) {
      group.properties = group.properties.filter((property) => !keys.includes(property.key))
    }
  }
}

// Show only the properties that the chosen layout mode actually consumes, and hide a header button's
// action + tooltip when that button is toggled off. Per mode:
//  - FILL_CONTENT_PAGE   — page content only (no rails / menus / panels).
//  - ONE_PANEL_PAGE      — page content + left & right action menus.
//  - SPLIT_VIEW_SINGLE   — page content (left view) + left action menus + cached right panels.
//  - SPLIT_VIEW_MULTIPLE — cached left & right panels (no single page content).
export function getProperties(values: AxAppLayoutPreviewProps, defaultProperties: Properties /* , target: Platform */): Properties {
  const mode = values.prpEnmMode
  const hidden: string[] = []

  const usesPageContent = mode === 'FILL_CONTENT_PAGE' || mode === 'ONE_PANEL_PAGE' || mode === 'SPLIT_VIEW_SINGLE'
  const usesLeftMenus = mode === 'ONE_PANEL_PAGE' || mode === 'SPLIT_VIEW_SINGLE'
  const usesRightMenus = mode === 'ONE_PANEL_PAGE'
  const usesLeftPanels = mode === 'SPLIT_VIEW_MULTIPLE'
  const usesRightPanels = mode === 'SPLIT_VIEW_SINGLE' || mode === 'SPLIT_VIEW_MULTIPLE'

  if (!usesPageContent) hidden.push('prpWdgPageContent')
  if (!usesLeftMenus) hidden.push('prpDsLeftMenus')
  if (!usesRightMenus) hidden.push('prpDsRightMenus')
  if (!usesLeftPanels) hidden.push('prpDsLeftPanels')
  if (!usesRightPanels) hidden.push('prpDsRightPanels')

  // Header button off → its action + tooltip label are dead config; hide them to keep the pane tidy.
  if (!values.prpBlnHeaderMenuApps) hidden.push('prpActApps', 'prpStrApps')
  if (!values.prpBlnHeaderMenuWorldMap) hidden.push('prpActWorldMap', 'prpStrWorldMap')
  if (!values.prpBlnHeaderMenuNotify) hidden.push('prpActNotify', 'prpStrNotify')
  if (!values.prpBlnHeaderMenuAccount) hidden.push('prpActAccount', 'prpStrAccount')
  if (!values.prpBlnHeaderMenuSettings) hidden.push('prpActSettings', 'prpStrSettings')

  hideProperties(defaultProperties, hidden)
  return defaultProperties
}
