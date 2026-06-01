import { makeAutoObservable } from 'mobx'

// Thin bridge to the latest Mendix-bound values/callbacks. Rebuilt by the container on every
// render (the underlying EditableValue/ActionValue instances are new each render), and pushed
// into the store via `syncBridge`. It is intentionally NOT observable — the store's own
// observable interaction state (touched flags, submit attempts) drives re-renders; the bridge is
// just read at action time so submit() always sees the current Mendix props.
export interface AxLoginBridge {
  account: string
  password: string
  busy: boolean
  signIn(): void
  signUp(): void
}

// MobX store owning the login form's interaction state. Mirrors react-app's store-per-shape
// convention: observable state + actions, consumed by an `observer` container. The field values
// themselves stay Mendix-controlled (the attributes are the source of truth) — this store owns
// the bits Mendix has no concept of: which fields the user has touched and whether a submit was
// attempted, which together decide when required-field errors become visible.
export class AxLoginStore {
  accountTouched = false
  passwordTouched = false
  submitAttempted = false

  private bridge: AxLoginBridge

  constructor(bridge: AxLoginBridge) {
    this.bridge = bridge
    // `bridge` excluded from observability (see interface note); the explicit second generic adds
    // the private key to the annotations map. autoBind so actions can be passed straight as event
    // handlers (e.g. onBlur={store.touchAccount}).
    makeAutoObservable<AxLoginStore, 'bridge'>(this, { bridge: false }, { autoBind: true })
  }

  syncBridge(bridge: AxLoginBridge): void {
    this.bridge = bridge
  }

  touchAccount(): void {
    this.accountTouched = true
  }

  touchPassword(): void {
    this.passwordTouched = true
  }

  // Validation errors surface once a field is touched or a submit has been attempted. Read by the
  // observer container (it also tracks the live account/password values, so these stay fresh).
  accountErrorFor(account: string): string | undefined {
    return (this.accountTouched || this.submitAttempted) && !account.trim() ? 'Account is required' : undefined
  }

  passwordErrorFor(password: string): string | undefined {
    return (this.passwordTouched || this.submitAttempted) && !password ? 'Password is required' : undefined
  }

  submit(): void {
    this.submitAttempted = true
    const { account, password, busy } = this.bridge
    if (!busy && account.trim() && password) {
      this.bridge.signIn()
    }
  }

  signUp(): void {
    this.bridge.signUp()
  }

  reset(): void {
    this.accountTouched = false
    this.passwordTouched = false
    this.submitAttempted = false
  }
}
