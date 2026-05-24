import { createContext, useContext } from 'react'
import { AccountStore } from './account.store'

// React context exposing the modal-local AccountStore. The provider wraps AccountModal's
// children; sidebar + view components consume via useAccountStore() so they don't have to
// thread the store through props.
export const AccountStoreContext = createContext<AccountStore | null>(null)

export function useAccountStore(): AccountStore {
  const store = useContext(AccountStoreContext)
  if (!store) {
    throw new Error('useAccountStore() must be called inside <AccountStoreContext.Provider>')
  }
  return store
}
