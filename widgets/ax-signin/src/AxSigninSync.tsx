import type { ReactElement } from 'react'
import { useCallback, useEffect } from 'react'
import { observer } from 'mobx-react-lite'
import { type AxEvent, useWidgetEvents } from '@ax/common'
import type { AxSigninContainerProps } from '../typings/AxSigninProps'
import { useAxSigninStore } from './stores/context'
import { AxSigninMain } from './main/AxSigninMain'

// Props ↔ store bridge layer. The ONLY component that reads the Mendix container props: it pushes each
// group into the store through a dedicated useEffect (keyed on that group's props, so values that
// resolve after mount are picked up), and it wires the global Ax event bus.
//
// The store never touches a Mendix value. It emits ACT_* intents on its private topic; this component
// holds the EditableValues + ActionValues and turns those intents into real Mendix calls (setValue() /
// execute()). Nanoflows / other widgets can also drive the form by emitting CMD_* (CMD_SUBMIT |
// CMD_RESET). isLayout ensures the bus exists when the signin widget stands alone. AxSigninMain below
// works purely off store state.
export const AxSigninSync = observer((props: AxSigninContainerProps): ReactElement => {
  const store = useAxSigninStore()

  // Widget attributes.
  useEffect(() => {
    store.setWidget(props.name || 'axSignin1', props.class, props.style, props.tabIndex)
  }, [store, props.name, props.class, props.style, props.tabIndex])

  // Field labels.
  useEffect(() => {
    store.setLabels({
      account: props.prpTxtAccountLabel?.value ?? '',
      accountPlaceholder: props.prpTxtAccountPlaceholder?.value ?? '',
      password: props.prpTxtPasswordLabel?.value ?? '',
      submit: props.prpTxtSubmitLabel?.value ?? '',
      signUpPrompt: props.prpTxtSignUpPrompt?.value ?? '',
      signUpLink: props.prpTxtSignUpLinkLabel?.value ?? '',
      sso: props.prpTxtSsoLabel?.value ?? '',
    })
  }, [
    store,
    props.prpTxtAccountLabel,
    props.prpTxtAccountPlaceholder,
    props.prpTxtPasswordLabel,
    props.prpTxtSubmitLabel,
    props.prpTxtSignUpPrompt,
    props.prpTxtSignUpLinkLabel,
    props.prpTxtSsoLabel,
  ])

  // Busy + error/success status.
  useEffect(() => {
    store.setStatus(
      props.prpAttIsBusy?.value === true,
      props.prpTxtErrorMessage?.value || undefined,
      props.prpTxtSuccessMessage?.value || undefined,
    )
  }, [store, props.prpAttIsBusy, props.prpTxtErrorMessage, props.prpTxtSuccessMessage])

  // Logo image.
  useEffect(() => {
    store.setLogo(props.prpImgLogoUrl?.value?.uri)
  }, [store, props.prpImgLogoUrl])

  // Animated background layer toggle + its AI-for-engineering-planning message (optional booleans default
  // to "on"; the text props fall back to empty so a missing value just hides that line).
  useEffect(() => {
    store.setBackground(
      props.prpBlnBackground !== false,
      props.prpTxtBgTitle?.value ?? '',
      props.prpTxtBgSubtitle?.value ?? '',
      props.prpTxtBgTagline?.value ?? '',
    )
  }, [store, props.prpBlnBackground, props.prpTxtBgTitle, props.prpTxtBgSubtitle, props.prpTxtBgTagline])

  // Optional capabilities (whether the sign-up / SSO actions are configured).
  useEffect(() => {
    store.setCapabilities(!!props.prpActSignUp, !!props.prpActSso)
  }, [store, props.prpActSignUp, props.prpActSso])

  // Reconcile the bound attributes (persisted values) into the store's synchronous fields.
  useEffect(() => {
    store.syncAccount(props.prpAttAccount.value ?? '')
  }, [store, props.prpAttAccount])

  useEffect(() => {
    store.syncPassword(props.prpAttPassword.value ?? '')
  }, [store, props.prpAttPassword])

  // Action callbacks. The Mendix ActionValues and their executable guards stay here at the top level;
  // the store only asks for them by emitting ACT_* on its private topic.
  const excSignIn = useCallback(() => {
    if (props.prpActSignIn && props.prpActSignIn.canExecute && !props.prpActSignIn.isExecuting) {
      props.prpActSignIn.execute()
    }
  }, [props.prpActSignIn])

  const excSignUp = useCallback(() => {
    if (props.prpActSignUp && props.prpActSignUp.canExecute && !props.prpActSignUp.isExecuting) {
      props.prpActSignUp.execute()
    }
  }, [props.prpActSignUp])

  const excSso = useCallback(() => {
    if (props.prpActSso && props.prpActSso.canExecute && !props.prpActSso.isExecuting) {
      props.prpActSso.execute()
    }
  }, [props.prpActSso])

  const handleEvent = useCallback(
    (event: AxEvent) => {
      const { action, payload } = event
      if (action?.startsWith('CMD_')) {
        store.handleCommand(action)
      } else if (action?.startsWith('ACT_')) {
        switch (action) {
          case 'ACT_SET_ACCOUNT':
            props.prpAttAccount.setValue(typeof payload === 'string' ? payload : '')
            break
          case 'ACT_SET_PASSWORD':
            props.prpAttPassword.setValue(typeof payload === 'string' ? payload : '')
            break
          case 'ACT_SIGN_IN':
            excSignIn()
            break
          case 'ACT_SIGN_UP':
            excSignUp()
            break
          case 'ACT_SSO':
            excSso()
            break
          default:
            break
        }
      }
    },
    [store, props.prpAttAccount, props.prpAttPassword, excSignIn, excSignUp, excSso],
  )
  useWidgetEvents({ widgetName: props.name, onEvent: handleEvent, isLayout: true })

  return <AxSigninMain />
})
