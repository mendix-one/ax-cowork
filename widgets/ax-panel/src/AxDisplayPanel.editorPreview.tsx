import type { ReactElement } from 'react'
import type { AxDisplayPanelPreviewProps } from '../typings/AxDisplayPanelProps'
import { AxDisplayPanelPreview } from './preview/AxDisplayPanelPreview'

export function preview(props: AxDisplayPanelPreviewProps): ReactElement {
  return <AxDisplayPanelPreview {...props} />
}

export function getPreviewCss(): string {
  return require('./styles/AxDisplayPanel.scss')
}
