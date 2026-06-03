import type { CSSProperties } from 'react'
import { makeAutoObservable, observable } from 'mobx'
import { emitEvent } from '@ax/common'

// Field labels for the signin card. Sourced from widget props (translatable in Studio).
export interface AxSigninLabels {
  account: string
  accountPlaceholder: string
  password: string
  submit: string
  signUpPrompt: string
  signUpLink: string
  sso: string
}

const EMPTY_LABELS: AxSigninLabels = {
  account: '',
  accountPlaceholder: '',
  password: '',
  submit: '',
  signUpPrompt: '',
  signUpLink: '',
  sso: '',
}

// MobX store owning the signin form. It holds the form's interaction state (which fields are touched,
// whether a submit was attempted) and the prop-derived view data (labels, busy/error flags, logo,
// capabilities), and it talks to the outside world only through the event bus — never through a Mendix
// value:
//
//  - `account` / `password` are the synchronous source of truth for the controlled inputs, so typing
//    never lags the bound attribute's async round-trip. On user edit we update the field immediately
//    and emit `ACT_SET_*` so AxSigninSync writes the bound attribute; the attribute reconciles back via
//    `syncAccount` / `syncPassword`.
//  - `submit` / `signUp` / `sso` emit `ACT_*` intents on the widget's private topic; AxSigninSync holds
//    the Mendix ActionValues and runs them.
//
// AxSigninSync pushes prop-derived data in via setters (per group, via useEffect) so late-arriving
// Mendix values are picked up after mount. AxSigninMain reads everything from this store.
export class AxSigninStore {
  // --- Interaction state --------------------------------------------------------------------------
  accountTouched = false
  passwordTouched = false
  submitAttempted = false

  // --- Prop-derived view data (set by AxSigninSync) ------------------------------------------------
  name = 'axSignin1'
  className = ''
  style?: CSSProperties
  tabIndex?: number
  account = ''
  password = ''
  busy = false
  errorMessage?: string
  logoUrl?: string
  canSignUp = false
  canSso = false
  labels: AxSigninLabels = EMPTY_LABELS

  constructor() {
    makeAutoObservable(
      this,
      {
        style: observable.ref,
        labels: observable.ref,
      },
      { autoBind: true },
    )
  }

  // Emit an action-intent event on this widget's private topic (handled by AxSigninSync).
  private emit(action: string, payload?: unknown): void {
    emitEvent(`ax:${this.name}`, { action, payload })
  }

  // --- Setters used by AxSigninSync's effects ------------------------------------------------------
  setWidget(name: string, className: string, style: CSSProperties | undefined, tabIndex: number | undefined): void {
    this.name = name
    this.className = className
    this.style = style
    this.tabIndex = tabIndex
  }

  setLabels(labels: AxSigninLabels): void {
    this.labels = labels
  }

  setStatus(busy: boolean, errorMessage: string | undefined): void {
    this.busy = busy
    this.errorMessage = errorMessage
  }

  setLogo(logoUrl: string | undefined): void {
    this.logoUrl = logoUrl
  }

  setCapabilities(canSignUp: boolean, canSso: boolean): void {
    this.canSignUp = canSignUp
    this.canSso = canSso
  }

  // Reconcile the bound attributes (the persisted values) back into the synchronous fields — covers
  // the initial value and external/runtime changes. No emit, so it never loops with the ACT_SET_*
  // write below.
  syncAccount(account: string): void {
    this.account = account
  }

  syncPassword(password: string): void {
    this.password = password
  }

  // --- Input handlers (user editing) --------------------------------------------------------------
  // Update the field immediately (synchronous, smooth typing) and ask AxSigninSync to persist it to the
  // bound Mendix attribute.
  setAccount(account: string): void {
    this.account = account
    this.emit('ACT_SET_ACCOUNT', account)
  }

  setPassword(password: string): void {
    this.password = password
    this.emit('ACT_SET_PASSWORD', password)
  }

  touchAccount(): void {
    this.accountTouched = true
  }

  touchPassword(): void {
    this.passwordTouched = true
  }

  // Validation errors surface once a field is touched or a submit has been attempted.
  get accountError(): string | undefined {
    return (this.accountTouched || this.submitAttempted) && !this.account.trim() ? 'Account is required' : undefined
  }

  get passwordError(): string | undefined {
    return (this.passwordTouched || this.submitAttempted) && !this.password ? 'Password is required' : undefined
  }

  // --- Action vocabulary --------------------------------------------------------------------------
  submit(): void {
    this.submitAttempted = true
    if (!this.busy && this.account.trim() && this.password) {
      this.emit('ACT_SIGN_IN')
    }
  }

  signUp(): void {
    this.emit('ACT_SIGN_UP')
  }

  sso(): void {
    if (!this.busy) {
      this.emit('ACT_SSO')
    }
  }

  reset(): void {
    this.accountTouched = false
    this.passwordTouched = false
    this.submitAttempted = false
    this.account = ''
    this.password = ''
    this.emit('ACT_SET_ACCOUNT', '')
    this.emit('ACT_SET_PASSWORD', '')
  }

  // --- Global event bus ---------------------------------------------------------------------------
  // Drive the form from nanoflows / other widgets. Command names (CMD_*) are distinct from the ACT_*
  // intents emitted above, so a command never loops back into itself.
  handleCommand(action: string): void {
    switch (action) {
      case 'CMD_SUBMIT':
        this.submit()
        break
      case 'CMD_RESET':
        this.reset()
        break
      default:
        break
    }
  }
}
