import type { ReactElement } from 'react'
import type { AxSigninPreviewProps } from '../typings/AxSigninProps'
import { AxSigninPreview } from './preview/AxSigninPreview'

export function preview(_props: AxSigninPreviewProps): ReactElement {
  return <AxSigninPreview />
}

export function getPreviewCss(): string {
  return require('./styles/AxSignin.scss')
}
