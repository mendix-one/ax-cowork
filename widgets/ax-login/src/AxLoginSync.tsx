import type { ReactElement } from 'react'
import { useCallback, useEffect } from 'react'
import { observer } from 'mobx-react-lite'
import { type AxEvent, useWidgetEvents } from '@ax/common'
import type { AxLoginContainerProps } from '../typings/AxLoginProps'
import { useAxLoginStore } from './stores/context'
import { AxLoginMain } from './main/AxLoginMain'

// Props ↔ store bridge layer. The ONLY component that reads the Mendix container props: it pushes each
// group into the store through a dedicated useEffect (keyed on that group's props, so values that
// resolve after mount are picked up), and it wires the global Ax event bus.
//
// The store never touches a Mendix value. It emits ACT_* intents on its private topic; this component
// holds the EditableValues + ActionValues and turns those intents into real Mendix calls (setValue() /
// execute()). Nanoflows / other widgets can also drive the form by emitting CMD_* (CMD_SUBMIT |
// CMD_RESET). isLayout ensures the bus exists when the login widget stands alone. AxLoginMain below
// works purely off store state.
export const AxLoginSync = observer((props: AxLoginContainerProps): ReactElement => {
  const store = useAxLoginStore()

  // Widget attributes.
  useEffect(() => {
    store.setWidget(props.name || 'axLogin1', props.class, props.style, props.tabIndex)
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

  // Busy + error status.
  useEffect(() => {
    store.setStatus(props.prpExpIsBusy?.value === true, props.prpTxtErrorMessage?.value || undefined)
  }, [store, props.prpExpIsBusy, props.prpTxtErrorMessage])

  // Logo image.
  useEffect(() => {
    store.setLogo(props.prpImgLogoUrl?.value?.uri)
  }, [store, props.prpImgLogoUrl])

  // Optional capabilities (whether the sign-up / SSO actions are configured).
  useEffect(() => {
    store.setCapabilities(!!props.prpActSignUp, !!props.prpActSso)
  }, [store, props.prpActSignUp, props.prpActSso])

  // Reconcile the bound attributes (persisted values) into the store's synchronous fields.
  useEffect(() => {
    store.syncAccount(props.prpAtrAccount.value ?? '')
  }, [store, props.prpAtrAccount])

  useEffect(() => {
    store.syncPassword(props.prpAtrPassword.value ?? '')
  }, [store, props.prpAtrPassword])

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
            props.prpAtrAccount.setValue(typeof payload === 'string' ? payload : '')
            break
          case 'ACT_SET_PASSWORD':
            props.prpAtrPassword.setValue(typeof payload === 'string' ? payload : '')
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
    [store, props.prpAtrAccount, props.prpAtrPassword, excSignIn, excSignUp, excSso],
  )
  useWidgetEvents({ widgetName: props.name, onEvent: handleEvent, isLayout: true })

  return <AxLoginMain />
})
