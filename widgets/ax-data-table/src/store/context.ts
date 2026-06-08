import { createWidgetContext } from '@ax/common'

import type { DataTableStore } from './store'

export const { Provider: DataTableProvider, useStore: useDataTableStore } = createWidgetContext<DataTableStore>('DataTable')