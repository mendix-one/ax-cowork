import type { ReactElement } from 'react'
import { useCallback, useState } from 'react'
import cn from 'classnames'
import { Layout, Splitter } from 'antd'
import { observer } from 'mobx-react-lite'
import { useAxAppStore } from '../stores/context'
import { AxAppTop } from './AxAppTop'
import { AxAppLeft } from './AxAppLeft'
import { AxAppRight } from './AxAppRight'
import { AxAppBottom } from './AxAppBottom'
import { ViewSlot } from './views/ViewSlot'

// Maps the layout mode onto a root modifier class (CSS keys overlay/full-page behaviour off it).
const MODE_CLASS: Record<string, string> = {
  FILL_CONTENT_PAGE: 'ax-mode-fill',
  ONE_PANEL_PAGE: 'ax-mode-one-panel',
  SPLIT_VIEW_SINGLE: 'ax-mode-split-single',
  SPLIT_VIEW_MULTIPLE: 'ax-mode-split-multiple',
}

// Single page-content view — the whole main area is one drop zone (FILL_CONTENT_PAGE / ONE_PANEL_PAGE).
// Mounted once; no view stack, no caching.
const AxAppSingle = observer((): ReactElement => {
  const store = useAxAppStore()
  return (
    <div className="ax-sim_view ax-sim_view_page">
      <div className="ax-sim_slot is-active">{store.pageContent}</div>
    </div>
  )
})

// Resizable split view (SPLIT_VIEW_SINGLE / SPLIT_VIEW_MULTIPLE). The right region is always the cached
// right-panel stack (every view stays mounted, CSS fades between them). The left region is the cached
// left-panel stack in SPLIT_VIEW_MULTIPLE, or the single (uncached) page content in SPLIT_VIEW_SINGLE.
const AxAppSplit = observer((): ReactElement => {
  const store = useAxAppStore()

  // Remember the right region's width (px) so closing → reopening restores the user's drag, mirroring
  // MpsLayout's persisted right pane. Controlled size on the right panel only; the left panel fills.
  const [rightSize, setRightSize] = useState<number | string>('32%')
  const onResize = useCallback(
    (sizes: number[]) => {
      if (store.rightOpen && sizes.length > 1) setRightSize(sizes[1])
    },
    [store],
  )

  return (
    <Splitter
      className={cn('ax-sim_splitter', { 'ax-maximize-main': !store.rightOpen })}
      onResize={onResize}
      classNames={{ dragger: { default: 'ax-sim_splitter_dragger', active: 'ax-sim_splitter_dragger_active' } }}
    >
      <Splitter.Panel min="25%" className="ax-sim_splitter_panel ax-sim_splitter_panel_left" style={{ paddingRight: `${store.rightOpen ? '3px' : '0'}` }}>
        <div className="ax-sim_view ax-sim_view_left">
          {store.mode === 'SPLIT_VIEW_SINGLE' ? (
            <div className="ax-sim_slot is-active">{store.pageContent}</div>
          ) : (
            store.leftPanels.map((panel, i) => (
              <ViewSlot key={i} active={store.activeLeft === i}>
                {panel.content}
              </ViewSlot>
            ))
          )}
        </div>
      </Splitter.Panel>
      <Splitter.Panel
        className="ax-sim_splitter_panel ax-sim_splitter_panel_right"
        size={store.rightOpen ? rightSize : 0}
        min={store.rightOpen ? 480 : 0}
        resizable={store.rightOpen}
        style={{ paddingLeft: store.rightOpen ? '3px' : '0' }}
      >
        <div className="ax-sim_view ax-sim_view_right">
          {store.rightPanels.map((panel, i) => (
            <ViewSlot key={i} active={store.rightOpen && store.activeRight === i}>
              {panel.content}
            </ViewSlot>
          ))}
        </div>
      </Splitter.Panel>
    </Splitter>
  )
})

// Full-page layout shell — a self-contained port of react-app's MpsLayout. AntD Layout for the
// top / left / right / bottom frame. The body depends on store.mode:
//  - FILL_CONTENT_PAGE  — page content fills the shell, the top bar floats over it (no rails / footer).
//  - ONE_PANEL_PAGE     — page content with the left/right rails (action menus or thin gutters).
//  - SPLIT_VIEW_SINGLE / SPLIT_VIEW_MULTIPLE — a resizable Splitter (see AxAppSplit).
// Holds no business logic and touches no widget props: every drop zone, label, action, and the mode itself
// is read from the store (kept in sync with Mendix props by AxAppSync).
export const AxAppMain = observer((): ReactElement => {
  const store = useAxAppStore()
  const isFill = store.isFill

  return (
    <Layout className={cn('ax-sim', MODE_CLASS[store.mode], store.className)} style={store.style} tabIndex={store.tabIndex}>
      <AxAppTop />

      <Layout className="ax-sim_middle">
        {!isFill && <AxAppLeft />}
        <Layout.Content className="ax-sim_main">{store.showSplit ? <AxAppSplit /> : <AxAppSingle />}</Layout.Content>
        {!isFill && <AxAppRight />}
      </Layout>

      {!isFill && <AxAppBottom />}
    </Layout>
  )
})
