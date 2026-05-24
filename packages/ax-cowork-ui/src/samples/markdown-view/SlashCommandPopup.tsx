import { forwardRef, useEffect, useImperativeHandle, useState } from 'react'
import type { Editor, Range } from '@tiptap/react'
import { AxMuiIcon } from '@/shared/mui-icon/AxMuiIcon.tsx'
import type { MdiIconName } from '@/shared/mui-icon/AxMuiIcon.tsx'

export interface SlashItem {
  title: string
  description: string
  icon: MdiIconName
  command: (args: { editor: Editor; range: Range }) => void
}

interface PopupProps {
  items: SlashItem[]
  command: (item: SlashItem) => void
}

export interface SlashCommandPopupHandle {
  onKeyDown: (props: { event: KeyboardEvent }) => boolean
}

export const SlashCommandPopup = forwardRef<SlashCommandPopupHandle, PopupProps>(function SlashCommandPopup({ items, command }, ref) {
  const [selectedIndex, setSelectedIndex] = useState(0)

  useEffect(() => {
    setSelectedIndex(0)
  }, [items])

  useImperativeHandle(ref, () => ({
    onKeyDown({ event }) {
      if (items.length === 0) return false
      if (event.key === 'ArrowUp') {
        setSelectedIndex((prev) => (prev + items.length - 1) % items.length)
        return true
      }
      if (event.key === 'ArrowDown') {
        setSelectedIndex((prev) => (prev + 1) % items.length)
        return true
      }
      if (event.key === 'Enter') {
        const item = items[selectedIndex]
        if (item) command(item)
        return true
      }
      return false
    },
  }))

  if (items.length === 0) {
    return <div style={{ ...popupStyle, padding: '8px 12px', color: '#8c8c8c', fontSize: 12 }}>No matches</div>
  }

  return (
    <div style={popupStyle}>
      {items.map((item, idx) => (
        <button
          key={item.title}
          onClick={() => command(item)}
          onMouseEnter={() => setSelectedIndex(idx)}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 10,
            width: '100%',
            padding: '6px 10px',
            background: idx === selectedIndex ? '#f0f5ff' : 'transparent',
            border: 'none',
            borderRadius: 4,
            cursor: 'pointer',
            textAlign: 'left',
          }}
        >
          <AxMuiIcon icon={item.icon} size={18} color="#595959" />
          <div>
            <div style={{ fontWeight: 500, fontSize: 13, color: '#262626' }}>{item.title}</div>
            <div style={{ fontSize: 11, color: '#8c8c8c' }}>{item.description}</div>
          </div>
        </button>
      ))}
    </div>
  )
})

const popupStyle: React.CSSProperties = {
  background: '#fff',
  border: '1px solid #f0f0f0',
  borderRadius: 6,
  boxShadow: '0 4px 12px rgba(0,0,0,0.12)',
  padding: 4,
  minWidth: 280,
  maxHeight: 320,
  overflowY: 'auto',
}
