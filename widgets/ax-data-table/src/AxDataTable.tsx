"use client"
import { ReactElement } from 'react'
import { configure } from 'mobx'
import { ConfigProvider } from 'antd'
import { axTheme } from '@ax/common'

import './ui/AxDataTable.scss'
import { DataTableProvider } from './store/context'
import { DataTableStore } from './store/store'
import { AxDataTableContainerProps } from 'typings/AxDataTableProps'
import { AxDataTableSync } from './AxDataTableSync'

configure({ isolateGlobalState: true })

export function AxDataTable(props: AxDataTableContainerProps): ReactElement {
  return (
    <DataTableProvider createStore={() => new DataTableStore()}>
      <ConfigProvider theme={axTheme}>
        <AxDataTableSync {...props} />
      </ConfigProvider>
    </DataTableProvider>
  )
}

