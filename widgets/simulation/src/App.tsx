import { useMemo, useState } from 'react'
import { AxAppLayout } from '../../app-layout/src/AxAppLayout'
import { AxGantt } from '../../ax-gantt/src/AxGantt'
import { AxMenuIcon } from '../../ax-menu-icon/src/AxMenuIcon'

export function App() {
  const iconName = 'mdiApps'
  const [clickCount, setClickCount] = useState(0)

  const actionValue = useMemo(() => {
    return {
      canExecute: true,
      execute: () => setClickCount((value) => value + 1),
    }
  }, [])

  return (
    <div className="sim-page">
      
      <div className="sim-layout-wrap">
        <AxAppLayout
          name="sim-layout"
          class=""
          left={
            <div className="slot-box slot-rail">
              <div className="slot-rail-icons">
                <AxMenuIcon name="sim-left-icon-1" class="" iconName="mdiApps" onClick={actionValue as any} />
                <AxMenuIcon name="sim-left-icon-2" class="" iconName="mdiChartTimelineVariant" onClick={actionValue as any} />
                <AxMenuIcon name="sim-left-icon-3" class="" iconName="mdiCubeOutline" onClick={actionValue as any} />
                <AxMenuIcon name="sim-left-icon-4" class="" iconName="mdiTuneVariant" onClick={actionValue as any} />
              </div>
            </div>
          }
          content={
            <>
              <div className="slot-box slot-main">
                <h2>Content Primary</h2>
                <div className="slot-gantt-wrap">
                  <AxGantt name="sim-gantt" class="" height="100%" />
                </div>
              </div>
              <div className="slot-box slot-main">
                <h2>Content Secondary</h2>
                <div className="slot-gantt-wrap">
                  <AxGantt name="sim-gantt" class="" height="100%" />
                </div>
              </div>
            </>
          }
          right={
            <div className="slot-box slot-rail">
              <div className="slot-rail-icons">
                <AxMenuIcon name="sim-right-icon-1" class="" iconName="mdiCreationOutline" onClick={actionValue as any} />
                <AxMenuIcon name="sim-right-icon-2" class="" iconName="mdiProgressStarFourPoints" onClick={actionValue as any} />
              </div>
            </div>
          }
          footer={<div className="slot-box">Footer slot</div>}
        />
      </div>
    </div>
  )
}
