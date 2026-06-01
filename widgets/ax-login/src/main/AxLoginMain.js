import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import cn from 'classnames';
import { Alert, Avatar, Button, Form, Input, theme, Typography } from 'antd';
import { LockOutlined, LoginOutlined, UserOutlined } from '@ant-design/icons';
import '../styles/AxLogin.scss';
const { Text } = Typography;
// Presentational login card — a self-contained port of react-app's SignInPage + AuthLayout card.
// Holds no business logic: the container (AxLogin.tsx) maps Mendix Values-API props to these
// plain props, and the simulation drives them from local React state.
export function AxLoginMain(props) {
    const { token } = theme.useToken();
    const { labels, busy, errorMessage, canSignUp, logoUrl } = props;
    return (_jsx("div", { className: cn('ax-login', props.className), children: _jsxs("div", { className: "ax-login__card w-full max-w-sm rounded-md shadow-md p-8", style: { background: token.colorBgContainer }, children: [_jsx("header", { className: "flex flex-col items-center mb-6", children: logoUrl ? (_jsx("img", { className: "ax-login__logo", src: logoUrl, alt: "logo" })) : (_jsx(Avatar, { size: 64, icon: _jsx(UserOutlined, {}), style: { backgroundColor: token.colorPrimary } })) }), _jsxs(Form, { layout: "vertical", 
                    // Mirror SignInPage: stop the native submit so the host page never reloads, then
                    // delegate to the Mendix sign-in action via onFinish.
                    onSubmitCapture: (e) => e.preventDefault(), onFinish: () => props.onSignIn(), disabled: busy, children: [errorMessage && _jsx(Alert, { type: "error", message: errorMessage, showIcon: true, className: "mb-4" }), _jsx(Form.Item, { label: labels.account, required: true, children: _jsx(Input, { autoComplete: "username", placeholder: labels.accountPlaceholder, prefix: _jsx(UserOutlined, { style: { color: token.colorTextTertiary } }), value: props.account, onChange: (e) => props.onAccountChange(e.target.value) }) }), _jsx(Form.Item, { label: labels.password, required: true, children: _jsx(Input.Password, { autoComplete: "current-password", prefix: _jsx(LockOutlined, { style: { color: token.colorTextTertiary } }), value: props.password, onChange: (e) => props.onPasswordChange(e.target.value) }) }), _jsx(Button, { type: "primary", htmlType: "submit", block: true, loading: busy, icon: _jsx(LoginOutlined, {}), children: labels.submit }), canSignUp && (_jsxs(Text, { type: "secondary", className: "block text-center mt-3", children: [labels.signUpPrompt, ' ', _jsx("a", { onClick: () => props.onSignUp?.(), onKeyDown: (e) => {
                                        if (e.key === 'Enter')
                                            props.onSignUp?.();
                                    }, role: "button", tabIndex: 0, children: labels.signUpLink })] }))] })] }) }));
}
