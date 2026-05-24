import { createContext, useContext } from 'react'

export interface BlockEditContextValue {
  // NodeView calls this with the block id (parsed from the JSON body in attrs).
  // The page looks up the block in `draft` and opens the drawer.
  openEditor: (blockId: string) => void
}

export const BlockEditContext = createContext<BlockEditContextValue | null>(null)

export function useBlockEditContext(): BlockEditContextValue | null {
  return useContext(BlockEditContext)
}
