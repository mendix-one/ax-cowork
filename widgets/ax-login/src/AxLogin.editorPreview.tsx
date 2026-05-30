import { ReactElement } from "react";
import { LoginForm } from "./components/LoginForm";
import { AxLoginPreviewProps } from "../typings/AxLoginProps";
import AxLoginCss from "./ui/AxLogin.scss";

export function preview(props: AxLoginPreviewProps): ReactElement {
    const logoUrl =
        props.logoUrl?.type === "static" && props.logoUrl.imageUrl ? props.logoUrl.imageUrl : undefined;

    return (
        <LoginForm
            className={props.className}
            account=""
            password=""
            onAccountChange={() => undefined}
            onPasswordChange={() => undefined}
            onSubmit={() => undefined}
            onSignUp={() => undefined}
            logoUrl={logoUrl}
            accountLabel={props.accountLabel || "Account"}
            accountPlaceholder={props.accountPlaceholder || "Username, email or phone"}
            passwordLabel={props.passwordLabel || "Password"}
            submitLabel={props.submitLabel || "Sign in"}
            signUpPrompt={props.signUpPrompt || "Don't have an account?"}
            signUpLinkLabel={props.signUpLinkLabel || "Sign up"}
        />
    );
}

export function getPreviewCss(): string {
    return AxLoginCss;
}
