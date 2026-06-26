import { ReactElement, useEffect } from 'react'
import { AxDataTableContainerProps } from 'typings/AxDataTableProps'
import { buildStoreEvent, buildTableConfig, syncRuntimeState, buildPagination } from './helper/TableOptionHelper'
import { DataTableMain } from './main/DataTableMain'
import { useDataTableStore } from './store/context'

export function AxDataTableSync(props: AxDataTableContainerProps): ReactElement {
  const store = useDataTableStore()

  useEffect(() => {
    buildTableConfig(props, store)
    buildStoreEvent(props, store)
    syncRuntimeState(props, store)
  }, [props, store])

  useEffect(() => {
    buildPagination(props.dataSource, store)
  }, [props.dataSource, store])

  return <DataTableMain />
}
