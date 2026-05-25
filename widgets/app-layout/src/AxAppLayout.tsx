import { Children, Fragment, isValidElement, useState, type ReactElement, type ReactNode } from 'react'
import { ConfigProvider, Splitter } from 'antd'
import type { AxAppLayoutContainerProps } from '../typings/AxAppLayoutProps'
import { AxAppLayoutTop } from './components/AxAppLayoutTop'
import './ui/AxAppLayout.css'

const slot = (node: ReactNode): ReactNode => {
  return node ?? null
}

const flattenSlotChildren = (node: ReactNode): ReactNode[] => {
  return Children.toArray(node).flatMap((child) => {
    if (isValidElement(child) && child.type === Fragment) {
      const fragmentChild = child as ReactElement<{ children?: ReactNode }>
      return flattenSlotChildren(fragmentChild.props.children ?? null)
    }

    return [child]
  })
}

export function AxAppLayout(props: AxAppLayoutContainerProps): ReactElement {
  const contentChildren = flattenSlotChildren(props.content)
  const splitPrimaryContent = contentChildren[0] ?? null
  const splitSecondaryContent = contentChildren[1] ?? null
  const hasSplitSecondaryContent = splitSecondaryContent != null
  const [splitViewActive, setSplitViewActive] = useState<boolean>(false)

  const handleToggleSplitView = (): void => {
    if (!hasSplitSecondaryContent) {
      return
    }

    setSplitViewActive((current) => !current)
  }

  const headerSlot = props.header ?? <AxAppLayoutTop splitViewActive={splitViewActive} onToggleSplitView={handleToggleSplitView} />

  return (
    <ConfigProvider
      theme={{
        components: {
          Splitter: { splitBarSize: 4, splitTriggerSize: 16 },
        },
      }}
    >
      <section className={`ax-app-layout ${props.class ?? ''}`.trim()} style={props.style} tabIndex={props.tabIndex}>
        <header className="ax-app-layout__header">{headerSlot}</header>
        <div className="ax-app-layout__middle">
          <aside className="ax-app-layout__left">{slot(props.left)}</aside>

          <div className="ax-app-layout__main-region">
            {splitViewActive && hasSplitSecondaryContent ? (
              <Splitter orientation='horizontal' style={{ width: '100%', height: '100%' }}>
                <Splitter.Panel defaultSize="50%" min="20%" max="90%">
                  <main className="ax-app-layout__content ax-app-layout__content--split">{splitPrimaryContent}</main>
                </Splitter.Panel>
                <Splitter.Panel defaultSize="50%" min="20%" max="90%">
                  <section className="ax-app-layout__split-pane">{splitSecondaryContent}</section>
                </Splitter.Panel>
              </Splitter>
            ) : (
              <main className="ax-app-layout__content">{splitPrimaryContent}</main>
            )}
          </div>

          <aside className="ax-app-layout__right">{slot(props.right)}</aside>
        </div>
        <footer className="ax-app-layout__footer">{slot(props.footer)}</footer>
      </section>
    </ConfigProvider>
  )
}
