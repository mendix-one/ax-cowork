import type { ReactElement } from 'react'
import type { AxSimulationPreviewProps } from '../typings/AxSimulationProps'
import { AxSimulationPreview } from './preview/AxSimulationPreview'

export function preview(_props: AxSimulationPreviewProps): ReactElement {
  return <AxSimulationPreview />
}

export function getPreviewCss(): string {
  return require('./styles/AxSimulation.scss')
}
