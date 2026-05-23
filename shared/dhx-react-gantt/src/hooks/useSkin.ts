import { useEffect } from 'react'

export function useSkin(ganttRef: any | null, skin: any, debounceRender: () => void) {
  useEffect(() => {
    if (!ganttRef.current) return
    const gantt = ganttRef.current
    if (skin !== gantt.skin) {
      gantt.setSkin(skin)
      debounceRender()
    }
  }, [skin])
}
