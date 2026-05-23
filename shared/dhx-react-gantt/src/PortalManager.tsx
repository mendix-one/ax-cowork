import React, { useEffect, useState } from 'react'
import ReactDOM from 'react-dom'
import { PortalRegistry } from './PortalRegistry'

export function PortalManager() {
  const [portals, setPortals] = useState<[string, React.ReactElement][]>([])

  useEffect(() => {
    const listener = (entries: [string, React.ReactElement][]) => {
      setPortals(entries)
    }
    PortalRegistry.addListener(listener)
    return () => {
      PortalRegistry.removeListener(listener)
    }
  }, [])

  return (
    <>
      {portals.map(([id, element]) => {
        const container = document.getElementById(id)
        if (!container) {
          // the gantt placeholder for this portal doesn't exist (yet or anymore)
          return null
        }
        if (container.dataset.isStatic === 'true') {
          // remove static placeholder before rendering react element
          container.innerHTML = ''
          delete container.dataset.isStatic
        }

        return <React.Fragment key={id}>{ReactDOM.createPortal(element, container)}</React.Fragment>
      })}
    </>
  )
}
