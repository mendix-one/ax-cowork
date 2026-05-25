import { t as e } from './jsx-runtime-B6doAwFl.js'
import { t } from './button-Di0uy-dC.js'
import { g as n, j as r, s as i } from './index-BL7_U56f.js'
var a = e(),
  o = () => {
    let { t: e } = r()
    return (0, a.jsx)(n, {
      status: `403`,
      title: e(`error.accessDeniedTitle`),
      subTitle: e(`error.accessDeniedSubtitle`),
      extra: (0, a.jsx)(i, { to: `/`, children: (0, a.jsx)(t, { type: `primary`, children: e(`nav.home`) }) }),
    })
  }
export { o as AccessDeniedPage }
