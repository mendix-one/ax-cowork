import { useEffect } from 'react'
import { isEqual } from 'lodash-es'

export function useTemplates(ganttRef: any | null, prevTemplatesRef: any, templates: any, debounceRender: () => void) {
  useEffect(() => {
    if (!ganttRef.current) return
    const gantt = ganttRef.current
    const oldTemplates = prevTemplatesRef.current
    if (Object.entries(templates).length && !isEqual(oldTemplates, templates)) {
      Object.entries(templates).forEach(([templateName, templateFunction]) => {
        gantt.templates[templateName] = templateFunction
      })
      debounceRender()
    }
  }, [templates])
}
