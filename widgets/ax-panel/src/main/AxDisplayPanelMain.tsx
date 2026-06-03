import type { ReactElement } from 'react'
import { useCallback } from 'react'
import cn from 'classnames'
import { observer } from 'mobx-react-lite'
import { Icon } from 'mendix/components/web/Icon'
import { type AxEvent, useWidgetEvents } from '@ax/common'
import type { AxDisplayPanelContainerProps } from '../../typings/AxDisplayPanelProps'
import { useAxDisplayPanelStore } from '../stores/context'
import { buildBridge } from '../stores/AxDisplayPanelStore'

// MDI glyph paths for the single header control button.
const GLYPH = {
  maximize: 'M4,4H20V20H4V4M6,8V18H18V8H6Z',
  restore: 'M4,8H8V4H20V16H16V20H4V8M16,8V14H18V6H10V8H16M6,12V18H14V12H6Z',
  close: 'M13.46,12L19,17.54V19H17.54L12,13.46L6.46,19H5V17.54L10.54,12L5,6.46V5H6.46L12,10.54L17.54,5H19V6.46L13.46,12Z',
}

// Presentational + interaction layer. Renders the panel chrome (icon, title, toolbar, control button,
// body), reads maximize state from the bound attribute (or the store's local fallback), and routes the
// control button + global bus events through the store's action vocabulary.
export const AxDisplayPanelMain = observer((props: AxDisplayPanelContainerProps): ReactElement => {
  const store = useAxDisplayPanelStore()
  // Refresh the store's bridge with the latest Mendix values/actions on every render.
  store.syncBridge(buildBridge(props))

  // Listen on the global Ax bus (broadcast + this widget's private topic) so nanoflows / other widgets
  // can drive the panel: emit { action: 'maximize' | 'restore' | 'toggle' | 'close' }. isLayout ensures
  // the bus exists even when the panel stands alone.
  const handleEvent = useCallback((event: AxEvent) => store.handleEvent(event.action), [store])
  useWidgetEvents({ widgetName: props.name, onEvent: handleEvent, isLayout: true })

  const isMain = props.prpEnmType === 'main'
  const maximized = props.prpAtrMaximized ? props.prpAtrMaximized.value === true : store.localMaximized
  const control = !isMain
    ? { glyph: GLYPH.close, title: 'Close' }
    : maximized
      ? { glyph: GLYPH.restore, title: 'Restore' }
      : { glyph: GLYPH.maximize, title: 'Maximize' }

  return (
    <div className={cn('ax-display-panel', props.class)} style={props.style} tabIndex={props.tabIndex}>
      <div className="ax-display-panel_header">
        <div className="ax-display-panel_header_title">
          {props.prpIcnHeader?.value && (
            <span className="ax-display-panel_header_title_icon">
              <Icon icon={props.prpIcnHeader.value} altText={props.prpStrTitle} />
            </span>
          )}
          {props.prpStrTitle && <p className="ax-display-panel_header_title_text">{props.prpStrTitle}</p>}
        </div>
        <div className="ax-display-panel_header_tools">{props.prpWdgToolbar}</div>
        <div className="ax-display-panel_header_option">
          <button
            className="ax-display-panel_header_option_button"
            type="button"
            title={control.title}
            aria-label={control.title}
            onClick={store.activate}
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="ax-display-panel_header_option_icon">
              <path d={control.glyph} />
            </svg>
          </button>
        </div>
      </div>
      <div className="ax-display-panel_body">{props.prpWdgContent}</div>
    </div>
  )
})
