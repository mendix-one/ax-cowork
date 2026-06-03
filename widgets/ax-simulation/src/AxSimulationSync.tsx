import type { ReactElement } from 'react'
import { useCallback, useEffect } from 'react'
import { observer } from 'mobx-react-lite'
import { type AxEvent, useWidgetEvents } from '@ax/common'
import type { AxSimulationContainerProps } from '../typings/AxSimulationProps'
import { useAxSimulationStore } from './stores/context'
import { AxSimulationMain } from './main/AxSimulationMain'

// Props ↔ store bridge layer. This is the ONLY component that reads the Mendix container props. It
// pushes each group of props into the store through a dedicated useEffect, keyed on exactly the props
// that group depends on, so a value that isn't resolved at mount time (e.g. the context datasource, or
// a drop zone whose content arrives asynchronously) is written into the store as soon as it changes —
// the effect re-runs and updates only that slice. It also wires the global Ax event bus so nanoflows /
// other widgets can drive the layout (emit { action: 'CMD_SET_LEFT' | 'CMD_OPEN_RIGHT' |
// 'CMD_TOGGLE_RIGHT' | 'CMD_CLOSE_RIGHT', payload }). It also reacts to AX_LAYOUT_* notifications
// broadcast by ax-panel children (maximize collapses the right region; restore/close reopens it).
// isLayout ensures the bus exists — this widget is the host layout. AxSimulationMain and the rail
// children below it work purely off store state.
export const AxSimulationSync = observer((props: AxSimulationContainerProps): ReactElement => {
  const store = useAxSimulationStore()

  // Widget attributes.
  useEffect(() => {
    store.setWidget(props.name || 'axSimulation1', props.class, props.style, props.tabIndex)
  }, [store, props.name, props.class, props.style, props.tabIndex])

  // Logo drop zone.
  useEffect(() => {
    store.setLogo(props.prpWdgLogo)
  }, [store, props.prpWdgLogo])

  // Left content drop zones.
  useEffect(() => {
    store.setLeftSlots({
      simulation: props.prpWdgSimulation,
      projects: props.prpWdgProjects,
      analysis: props.prpWdgAnalysis,
      pmData: props.prpWdgPmData,
      tuningLogic: props.prpWdgTuningLogic,
      factorControl: props.prpWdgFactorControl,
      pmStandard: props.prpWdgPmStandard,
      integration: props.prpWdgIntegration,
      setting: props.prpWdgSetting,
    })
  }, [
    store,
    props.prpWdgSimulation,
    props.prpWdgProjects,
    props.prpWdgAnalysis,
    props.prpWdgPmData,
    props.prpWdgTuningLogic,
    props.prpWdgFactorControl,
    props.prpWdgPmStandard,
    props.prpWdgIntegration,
    props.prpWdgSetting,
  ])

  // Right content drop zones.
  useEffect(() => {
    store.setRightSlots({
      compare: props.prpWdgCompare,
      aiAssistant: props.prpWdgAiAssistant,
      recommendation: props.prpWdgRecommendation,
      history: props.prpWdgHistory,
    })
  }, [store, props.prpWdgCompare, props.prpWdgAiAssistant, props.prpWdgRecommendation, props.prpWdgHistory])

  // All rail + top-bar tooltip labels (one flat map; the ids don't collide).
  useEffect(() => {
    store.setLabels({
      simulation: props.prpStrSimulation,
      projects: props.prpStrProjects,
      analysis: props.prpStrAnalysis,
      pmData: props.prpStrPmData,
      tuningLogic: props.prpStrTuningLogic,
      setting: props.prpStrSetting,
      compare: props.prpStrCompare,
      aiAssistant: props.prpStrAiAssistant,
      recommendation: props.prpStrRecommendation,
      history: props.prpStrHistory,
      apps: props.prpStrApps,
      worldMap: props.prpStrWorldMap,
      notify: props.prpStrNotify,
      account: props.prpStrAccount,
      settings: props.prpStrSettings,
    })
  }, [
    store,
    props.prpStrSimulation,
    props.prpStrProjects,
    props.prpStrAnalysis,
    props.prpStrPmData,
    props.prpStrTuningLogic,
    props.prpStrSetting,
    props.prpStrCompare,
    props.prpStrAiAssistant,
    props.prpStrRecommendation,
    props.prpStrHistory,
    props.prpStrApps,
    props.prpStrWorldMap,
    props.prpStrNotify,
    props.prpStrAccount,
    props.prpStrSettings,
  ])

  // Top bar action callbacks. The Mendix ActionValues and their executable guards stay here at the top
  // level; only the resulting plain callbacks are handed to the store.
  const onClickApps = useCallback(() => {
    if (props.prpActApps && props.prpActApps.canExecute && !props.prpActApps.isExecuting) {
      props.prpActApps.execute()
    }
  }, [props.prpActApps])

  const onClickWorldMap = useCallback(() => {
    if (props.prpActWorldMap && props.prpActWorldMap.canExecute && !props.prpActWorldMap.isExecuting) {
      props.prpActWorldMap.execute()
    }
  }, [props.prpActWorldMap])

  const onClickNotify = useCallback(() => {
    if (props.prpActNotify && props.prpActNotify.canExecute && !props.prpActNotify.isExecuting) {
      props.prpActNotify.execute()
    }
  }, [props.prpActNotify])

  const onClickAccount = useCallback(() => {
    if (props.prpActAccount && props.prpActAccount.canExecute && !props.prpActAccount.isExecuting) {
      props.prpActAccount.execute()
    }
  }, [props.prpActAccount])

  const onClickSettings = useCallback(() => {
    if (props.prpActSettings && props.prpActSettings.canExecute && !props.prpActSettings.isExecuting) {
      props.prpActSettings.execute()
    }
  }, [props.prpActSettings])

  // Global event bus — let nanoflows / other widgets drive the layout.
  const handleEvent = useCallback(
    (event: AxEvent) => {
      const { action, payload } = event
      console.info(`${action}: ${payload ? JSON.stringify(payload) : '<no payload>'}`)
      if (action?.startsWith('CMD_')) {
        store.handleCommand(action, payload)
      } else if (action?.startsWith('AX_LAYOUT_')) {
        store.handleLayout(action)
      } else if (action?.startsWith('ACT_')) {
        switch (action) {
          case 'ACT_ON_CLICK_APPS':
            onClickApps()
            break
          case 'ACT_ON_CLICK_WORLD_MAP':
            onClickWorldMap()
            break
          case 'ACT_ON_CLICK_NOTIFY':
            onClickNotify()
            break
          case 'ACT_ON_CLICK_ACCOUNT':
            onClickAccount()
            break
          case 'ACT_ON_CLICK_SETTINGS':
            onClickSettings()
            break
          default:
            break
        }
      }
    },
    [store, onClickApps, onClickWorldMap, onClickNotify, onClickAccount, onClickSettings],
  )
  useWidgetEvents({ widgetName: props.name, onEvent: handleEvent, isLayout: true })

  return <AxSimulationMain />
})
