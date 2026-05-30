import { ReactElement } from "react";
import { AxLoginContainerProps } from "../typings/AxLoginProps";
import { LoginForm } from "./components/LoginForm";
import "./ui/AxLogin.scss";

export function AxLogin(props: AxLoginContainerProps): ReactElement {
    // Both attributes must be loaded before we can render an editable form. Mendix re-renders
    // when status flips so we don't manage loading state ourselves — we just gate writes.
    const isReady =
        props.accountAttribute.status === "available" && props.passwordAttribute.status === "available";
    const isReadOnly = props.accountAttribute.readOnly === true || props.passwordAttribute.readOnly === true;

    const isBusy = props.isBusy?.value === true;
    const errorMessage = props.errorMessage?.value ?? undefined;

    const handleSubmit = (): void => {
        if (!isReady || isBusy) {
            return;
        }
        if (props.signInAction?.canExecute && !props.signInAction.isExecuting) {
            props.signInAction.execute();
        }
    };

    const handleSignUp = props.signUpAction
        ? (): void => {
              if (props.signUpAction?.canExecute) {
                  props.signUpAction.execute();
              }
          }
        : undefined;

    return (
        <LoginForm
            className={props.class}
            style={props.style}
            tabIndex={props.tabIndex}
            account={props.accountAttribute.value ?? ""}
            password={props.passwordAttribute.value ?? ""}
            onAccountChange={value => props.accountAttribute.setValue(value)}
            onPasswordChange={value => props.passwordAttribute.setValue(value)}
            onSubmit={handleSubmit}
            onSignUp={handleSignUp}
            errorMessage={errorMessage}
            isBusy={isBusy}
            disabled={!isReady || isReadOnly}
            logoUrl={props.logoUrl?.value?.uri}
            accountLabel={props.accountLabel?.value ?? "Account"}
            accountPlaceholder={props.accountPlaceholder?.value}
            passwordLabel={props.passwordLabel?.value ?? "Password"}
            submitLabel={props.submitLabel?.value ?? "Sign in"}
            signUpPrompt={props.signUpPrompt?.value ?? "Don't have an account?"}
            signUpLinkLabel={props.signUpLinkLabel?.value ?? "Sign up"}
        />
    );
}
