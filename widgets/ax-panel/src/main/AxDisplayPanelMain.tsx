import type { ReactElement } from 'react'
import cn from 'classnames'
import { observer } from 'mobx-react-lite'
import { Icon } from 'mendix/components/web/Icon'
import { useAxDisplayPanelStore } from '../stores/context'

// MDI glyph paths for the single header control button.
const GLYPH = {
  maximize: 'M4,4H20V20H4V4M6,8V18H18V8H6Z',
  restore: 'M4,8H8V4H20V16H16V20H4V8M16,8V14H18V6H10V8H16M6,12V18H14V12H6Z',
  close: 'M13.46,12L19,17.54V19H17.54L12,13.46L6.46,19H5V17.54L10.54,12L5,6.46V5H6.46L12,10.54L17.54,5H19V6.46L13.46,12Z',
}

// Presentational + interaction layer. Renders the panel chrome (icon, title, toolbar, control button,
// body) purely from store state, and routes the control button through the store's action vocabulary.
// Holds no widget props — AxDisplayPanelSync keeps the store in sync with Mendix.
export const AxDisplayPanelMain = observer((): ReactElement => {
  const store = useAxDisplayPanelStore()

  const isMain = store.type === 'main'
  const maximized = store.maximized
  const control = !isMain
    ? { glyph: GLYPH.close, title: 'Close' }
    : maximized
      ? { glyph: GLYPH.restore, title: 'Restore' }
      : { glyph: GLYPH.maximize, title: 'Maximize' }

  return (
    <div className={cn('ax-display-panel', store.className)} style={store.style} tabIndex={store.tabIndex}>
      <div className="ax-display-panel_header">
        <div className="ax-display-panel_header_title">
          {store.icon && (
            <span className="ax-display-panel_header_title_icon">
              <Icon icon={store.icon} altText={store.title} />
            </span>
          )}
          {store.title && <p className="ax-display-panel_header_title_text">{store.title}</p>}
        </div>
        <div className="ax-display-panel_header_tools">{store.toolbar}</div>
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
      <div className="ax-display-panel_body">{store.content}</div>
    </div>
  )
})
