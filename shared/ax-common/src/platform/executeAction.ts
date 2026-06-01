/**
 * Safely execute a Mendix ActionValue. Checks both `canExecute` and `isExecuting` to avoid
 * double-execution. No-op when the action is undefined or not currently executable.
 */
export function executeAction(action?: {
  canExecute: boolean
  isExecuting: boolean
  execute(): void
}): void {
  if (action && action.canExecute && !action.isExecuting) {
    action.execute()
  }
}
