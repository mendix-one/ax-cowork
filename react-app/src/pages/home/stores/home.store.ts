import { makeAutoObservable, observable } from 'mobx'
import {
  PRODUCTION_LINE_GROUPS,
  PRODUCTION_LINES,
  type ProductionLine,
  type ProductionLineGroup,
  type ProductionLineGroupId,
  type ProductionLineStore,
} from '@/acore/store/production-line.store'
import type { MdiIconName } from '@/shared/mui-icon/AxMuiIcon.tsx'

export type GroupStyle = { accent: string; icon: MdiIconName }

// Visual identity per BizGroup — accent + icon. Colors mirror the AntD brand tokens
// (primary / secondary / tertiary) defined in acore/theme.
const GROUP_STYLE: Record<ProductionLineGroupId, GroupStyle> = {
  SOC: { accent: '#3F51B5', icon: 'mdiChip' },
  Sensor: { accent: '#009688', icon: 'mdiCameraIris' },
  LSI: { accent: '#673AB7', icon: 'mdiMemory' },
}

// Per-page store for the HomePage landing shell (mirrors the eps / mps module pattern: one MobX store
// provided through a React context, consumed by the separated layout components). It owns the
// production-line catalog the selector renders, the per-group visual identity, and a bridge to the shared
// (persisted) line selection — so the layout reads everything from this one store instead of reaching into
// the root store. Global app / modal state stays in the root store.
export class HomeStore {
  groups: ProductionLineGroup[] = PRODUCTION_LINE_GROUPS

  // The shared, persisted selection store, bound once by HomePage. Kept as a ref (its own fields are already
  // observable) so reassignment re-renders observers without deep-observing another store's internals.
  private productionLine: ProductionLineStore | null = null

  constructor() {
    makeAutoObservable<HomeStore, 'productionLine'>(this, { productionLine: observable.ref })
  }

  // Wire in the shared production-line store (from the root store, via the page). Called from an effect, so
  // it must be safe to run more than once.
  bind(productionLine: ProductionLineStore) {
    this.productionLine = productionLine
  }

  // Last-used line — drives the "LAST USED" highlight on the cards. Null until the shared store is bound.
  get selectedId(): string | null {
    return this.productionLine?.selectedId ?? null
  }

  linesByGroup(groupId: ProductionLineGroupId): ProductionLine[] {
    return PRODUCTION_LINES.filter((line) => line.group === groupId)
  }

  groupStyle(groupId: ProductionLineGroupId): GroupStyle {
    return GROUP_STYLE[groupId]
  }

  // Pick a line → scope the shared selection (persisted; the EPS workspace reads it on entry). Navigation
  // itself stays in the component, which owns the router.
  select(id: string) {
    this.productionLine?.setSelected(id)
  }
}

// Module singleton — same lifetime model as epsStore / the other page stores.
export const homeStore = new HomeStore()
