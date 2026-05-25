import { a as e, n as t, t as n } from './jsx-runtime-B6doAwFl.js'
import { t as r } from './button-Di0uy-dC.js'
import { t as i } from './typography-BlYS2lqL.js'
import { t as a } from './alert-Bixofab4.js'
import { t as o } from './input-BVKQSqCw.js'
import { a as s, c, f as l, i as u, j as d, l as f, o as p, s as m, x as h } from './index-BL7_U56f.js'
var g = e(t(), 1),
  _ = n(),
  { Text: v } = i,
  y = 1,
  b = 2,
  x = l(() => {
    let { auth: e } = p(),
      { t } = d(`auth`),
      n = f(),
      i = c(),
      [l] = h.useForm(),
      [x, S] = (0, g.useState)(null),
      C = u(i.search),
      w = i.state?.from,
      T = C === `/` ? (w ?? `/`) : C,
      E = async (r) => {
        S(null)
        try {
          ;(await e.signin({ username: r.account, password: r.password }), n(T, { replace: !0 }))
        } catch (e) {
          e instanceof s && (e.code === y ? S(t(`errors.invalidCredentials`)) : e.code === b ? S(t(`errors.accountNotActive`)) : S(e.message))
        }
      }
    return (0, _.jsxs)(h, {
      form: l,
      layout: `vertical`,
      onSubmitCapture: (e) => e.preventDefault(),
      onFinish: (e) => void E(e),
      disabled: e.isLoading,
      children: [
        x && (0, _.jsx)(a, { type: `error`, message: x, showIcon: !0, style: { marginBottom: 16 } }),
        (0, _.jsx)(h.Item, {
          name: `account`,
          label: t(`signIn.account`),
          rules: [{ required: !0 }],
          children: (0, _.jsx)(o, { autoComplete: `username`, placeholder: t(`signIn.accountPlaceholder`) }),
        }),
        (0, _.jsx)(h.Item, {
          name: `password`,
          label: t(`signIn.password`),
          rules: [{ required: !0 }],
          children: (0, _.jsx)(o.Password, { autoComplete: `current-password` }),
        }),
        (0, _.jsx)(r, { type: `primary`, htmlType: `submit`, block: !0, loading: e.isLoading, children: t(`signIn.submit`) }),
        (0, _.jsxs)(v, {
          type: `secondary`,
          style: { display: `block`, marginTop: 12, textAlign: `center` },
          children: [t(`signIn.noAccount`), ` `, (0, _.jsx)(m, { to: `/auth/signup`, children: t(`signIn.signUpLink`) })],
        }),
      ],
    })
  })
export { x as SignInPage }
