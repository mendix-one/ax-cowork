import { t as e } from './jsx-runtime-B6doAwFl.js'
import { t } from './button-BU_eysIT.js'
import { g as n, j as r, s as i } from './index-C8rcLqPT.js'
var a = e(),
  o = () => {
    let { t: e } = r()
    return (0, a.jsx)(n, {
      status: `500`,
      title: e(`error.systemErrorTitle`),
      subTitle: e(`error.systemErrorSubtitle`),
      extra: (0, a.jsx)(a.Fragment, { children: (0, a.jsx)(i, { to: `/`, children: (0, a.jsx)(t, { children: e(`nav.home`) }) }) }),
    })
  }
export { o as SystemErrorPage }
