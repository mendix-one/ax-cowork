import { t as e } from './jsx-runtime-B6doAwFl.js'
import { t } from './button-Di0uy-dC.js'
import { f as n, g as r, j as i, s as a } from './index-BL7_U56f.js'
var o = e(),
  s = n(function () {
    let { t: e } = i()
    return (0, o.jsx)(r, {
      status: `404`,
      title: `404`,
      subTitle: e(`error.notFound`),
      extra: (0, o.jsx)(a, { to: `/`, children: (0, o.jsx)(t, { type: `primary`, children: e(`nav.home`) }) }),
    })
  })
export { s as NotFoundPage }
