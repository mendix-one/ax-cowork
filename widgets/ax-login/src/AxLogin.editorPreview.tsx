import type { ReactElement } from 'react'
import type { AxLoginPreviewProps } from '../typings/AxLoginProps'
import { AxLoginPreview } from './preview/AxLoginPreview'

export function preview(_props: AxLoginPreviewProps): ReactElement {
  return <AxLoginPreview />
}

export function getPreviewCss(): string {
  return require('./styles/AxLogin.scss')
}
