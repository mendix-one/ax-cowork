import { CSSProperties, ReactElement } from "react";
import { Alert, Button, ConfigProvider, Form, Input, Typography } from "antd";

const { Text } = Typography;

export interface LoginFormProps {
    className?: string;
    style?: CSSProperties;
    tabIndex?: number;
    account: string;
    password: string;
    onAccountChange: (value: string) => void;
    onPasswordChange: (value: string) => void;
    onSubmit: () => void;
    onSignUp?: () => void;
    errorMessage?: string;
    isBusy?: boolean;
    disabled?: boolean;
    logoUrl?: string;
    accountLabel: string;
    accountPlaceholder?: string;
    passwordLabel: string;
    submitLabel: string;
    signUpPrompt?: string;
    signUpLinkLabel?: string;
}

type FormValues = {
    account: string;
    password: string;
};

export function LoginForm(props: LoginFormProps): ReactElement {
    const [form] = Form.useForm<FormValues>();
    const blocked = props.disabled === true || props.isBusy === true;

    // We keep AntD as the source of truth for typography/spacing tokens, but pin the
    // primary brand color to axColors.primary so the widget looks identical to the
    // react-app login regardless of the Mendix app's AntD theme.
    return (
        <ConfigProvider theme={{ token: { colorPrimary: "#3F51B5" } }}>
            <div className={`ax-login ${props.className ?? ""}`} style={props.style}>
                {props.logoUrl && (
                    <header className="ax-login__header flex justify-center mb-6">
                        <img src={props.logoUrl} alt="" className="ax-login__logo" />
                    </header>
                )}
                <Form
                    form={form}
                    layout="vertical"
                    onSubmitCapture={e => e.preventDefault()}
                    onFinish={() => {
                        if (!blocked) {
                            props.onSubmit();
                        }
                    }}
                    disabled={blocked}
                >
                    {props.errorMessage && (
                        <Alert
                            type="error"
                            message={props.errorMessage}
                            showIcon
                            style={{ marginBottom: 16 }}
                        />
                    )}
                    <Form.Item label={props.accountLabel} required>
                        <Input
                            autoComplete="username"
                            placeholder={props.accountPlaceholder}
                            value={props.account}
                            onChange={e => props.onAccountChange(e.target.value)}
                            tabIndex={props.tabIndex}
                        />
                    </Form.Item>
                    <Form.Item label={props.passwordLabel} required>
                        <Input.Password
                            autoComplete="current-password"
                            value={props.password}
                            onChange={e => props.onPasswordChange(e.target.value)}
                        />
                    </Form.Item>
                    <Button type="primary" htmlType="submit" block loading={props.isBusy}>
                        {props.submitLabel}
                    </Button>
                    {props.onSignUp && (
                        <Text type="secondary" className="ax-login__footer block mt-3 text-center">
                            {props.signUpPrompt}{" "}
                            <a
                                href="#"
                                className="ax-login__link"
                                onClick={e => {
                                    e.preventDefault();
                                    props.onSignUp?.();
                                }}
                            >
                                {props.signUpLinkLabel}
                            </a>
                        </Text>
                    )}
                </Form>
            </div>
        </ConfigProvider>
    );
}
