import type { ReactElement } from 'react'
import type { AxAppLayoutPreviewProps } from '../typings/AxAppLayoutProps'
import { AxAppLayoutTop } from './components/AxAppLayoutTop'
import './ui/AxAppLayout.css'

declare const require: (path: string) => string

const previewPane = (title: string): ReactElement => {
  return <div style={{ fontSize: '11px', opacity: 0.72, padding: '4px' }}>{title}</div>
}

const renderSlot = (
  slot: AxAppLayoutPreviewProps['header'],
  fallbackNode: ReactElement,
  fallbackCaption: string,
): ReactElement => {
  if (!slot || slot.widgetCount === 0) {
    return fallbackNode
  }

  const Renderer = slot.renderer
  return <Renderer caption={fallbackCaption}>{fallbackNode}</Renderer>
}

export function preview(props: AxAppLayoutPreviewProps): ReactElement {
  const headerSlot = renderSlot(props.header, <AxAppLayoutTop />, 'Header slot')
  const leftSlot = renderSlot(props.left, previewPane('Left slot'), 'Left slot')
  const contentSlot = renderSlot(props.content, previewPane('Content slot'), 'Content slot')
  const rightSlot = renderSlot(props.right, previewPane('Right slot'), 'Right slot')
  const footerSlot = renderSlot(props.footer, previewPane('Footer slot'), 'Footer slot')

  return (
    <section className={`ax-app-layout ${props.class ?? ''}`.trim()} style={props.styleObject}>
      <header className="ax-app-layout__header">{headerSlot}</header>
      <div className="ax-app-layout__middle">
        <aside className="ax-app-layout__left">{leftSlot}</aside>
        <main className="ax-app-layout__content">{contentSlot}</main>
        <aside className="ax-app-layout__right">{rightSlot}</aside>
      </div>
      <footer className="ax-app-layout__footer">{footerSlot}</footer>
    </section>
  )
}

export function getPreviewCss(): string {
  return require('./ui/AxAppLayout.css')
}
