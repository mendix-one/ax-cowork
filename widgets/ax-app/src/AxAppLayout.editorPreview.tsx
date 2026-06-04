import type { ReactElement } from 'react'
import type { AxAppLayoutPreviewProps } from '../typings/AxAppLayoutProps'
import { AxAppPreview } from './preview/AxAppPreview'

export function preview(_props: AxAppLayoutPreviewProps): ReactElement {
  return <AxAppPreview />
}

export function getPreviewCss(): string {
  return require('./styles/AxApp.scss')
}
