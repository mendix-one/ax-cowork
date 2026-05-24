import { a as e, n as t } from './jsx-runtime-B6doAwFl.js'
import {
  $t as n,
  Dn as r,
  Jt as i,
  L as a,
  Mt as o,
  Ot as s,
  P as c,
  Tn as l,
  U as u,
  Zt as d,
  _n as f,
  b as p,
  bn as m,
  cn as h,
  ct as g,
  d as _,
  dt as v,
  gn as y,
  gt as b,
  hn as x,
  ht as S,
  in as C,
  j as w,
  ln as T,
  mn as E,
  mt as D,
  nn as O,
  ot as k,
  tn as A,
  tt as j,
  un as M,
  ut as N,
  vn as ee,
  w as te,
  yn as ne,
} from './button-BU_eysIT.js'
import { $ as P, R as re, ct as F, h as ie, tt as I, ut as L } from './typography-_G6plS4i.js'
import { F as R, a as z, m as B } from './AxMuiIcon-CelvnH-o.js'
var V = e(t()),
  { ESC: ae, TAB: oe } = te
function H({ visible: e, triggerRef: t, onVisibleChange: n, autoFocus: r, overlayRef: i }) {
  let a = V.useRef(!1),
    o = () => {
      e && (t.current?.focus?.(), n?.(!1))
    },
    s = () => (i.current?.focus ? (i.current.focus(), (a.current = !0), !0) : !1),
    c = (e) => {
      switch (e.keyCode) {
        case ae:
          o()
          break
        case oe: {
          let t = !1
          ;(a.current || (t = s()), t ? e.preventDefault() : o())
          break
        }
      }
    }
  V.useEffect(
    () =>
      e
        ? (window.addEventListener(`keydown`, c),
          r && O(s, 3),
          () => {
            ;(window.removeEventListener(`keydown`, c), (a.current = !1))
          })
        : () => {
            a.current = !1
          },
    [e],
  )
}
var se = (0, V.forwardRef)((e, t) => {
    let { overlay: n, arrow: r, prefixCls: i } = e,
      a = (0, V.useMemo)(() => {
        let e
        return ((e = typeof n == `function` ? n() : n), e)
      }, [n]),
      o = E(t, x(a))
    return V.createElement(V.Fragment, null, r && V.createElement(`div`, { className: `${i}-arrow` }), V.cloneElement(a, { ref: f(a) ? o : void 0 }))
  }),
  U = { adjustX: 1, adjustY: 1 },
  W = [0, 0],
  ce = {
    topLeft: { points: [`bl`, `tl`], overflow: U, offset: [0, -4], targetOffset: W },
    top: { points: [`bc`, `tc`], overflow: U, offset: [0, -4], targetOffset: W },
    topRight: { points: [`br`, `tr`], overflow: U, offset: [0, -4], targetOffset: W },
    bottomLeft: { points: [`tl`, `bl`], overflow: U, offset: [0, 4], targetOffset: W },
    bottom: { points: [`tc`, `bc`], overflow: U, offset: [0, 4], targetOffset: W },
    bottomRight: { points: [`tr`, `br`], overflow: U, offset: [0, 4], targetOffset: W },
  }
function le() {
  return (
    (le = Object.assign
      ? Object.assign.bind()
      : function (e) {
          for (var t = 1; t < arguments.length; t++) {
            var n = arguments[t]
            for (var r in n) Object.prototype.hasOwnProperty.call(n, r) && (e[r] = n[r])
          }
          return e
        }),
    le.apply(this, arguments)
  )
}
var ue = V.forwardRef((e, t) => {
    let {
        arrow: n = !1,
        prefixCls: r = `rc-dropdown`,
        transitionName: i,
        animation: a,
        align: o,
        placement: s = `bottomLeft`,
        placements: l = ce,
        getPopupContainer: u,
        showAction: d,
        hideAction: p,
        overlayClassName: m,
        overlayStyle: h,
        visible: g,
        trigger: _ = [`hover`],
        autoFocus: v,
        overlay: y,
        children: b,
        onVisibleChange: S,
        ...w
      } = e,
      [T, D] = V.useState(),
      O = `visible` in e ? g : T,
      k = a ? `${r}-${a}` : i,
      A = V.useRef(null),
      j = V.useRef(null),
      M = V.useRef(null)
    V.useImperativeHandle(t, () => A.current)
    let N = (e) => {
      ;(D(e), S?.(e))
    }
    H({ visible: O, triggerRef: M, onVisibleChange: N, autoFocus: v, overlayRef: j })
    let ee = (t) => {
        let { onOverlayClick: n } = e
        ;(D(!1), n && n(t))
      },
      te = () => V.createElement(se, { ref: j, overlay: y, prefixCls: r, arrow: n }),
      ne = () => (typeof y == `function` ? te : te()),
      P = () => {
        let { minOverlayWidthMatchTrigger: t, alignPoint: n } = e
        return `minOverlayWidthMatchTrigger` in e ? t : !n
      },
      re = V.cloneElement(b, {
        className: C(
          b.props?.className,
          O &&
            (() => {
              let { openClassName: t } = e
              return t === void 0 ? `${r}-open` : t
            })(),
        ),
        ref: f(b) ? E(M, x(b)) : void 0,
      }),
      F = p
    return (
      !F && _.indexOf(`contextMenu`) !== -1 && (F = [`click`]),
      V.createElement(
        c,
        le({ builtinPlacements: l }, w, {
          prefixCls: r,
          ref: A,
          popupClassName: C(m, { [`${r}-show-arrow`]: n }),
          popupStyle: h,
          action: _,
          showAction: d,
          hideAction: F,
          popupPlacement: s,
          popupAlign: o,
          popupMotion: { motionName: k },
          popupVisible: O,
          stretch: P() ? `minWidth` : ``,
          popup: ne(),
          onOpenChange: N,
          onPopupClick: ee,
          getPopupContainer: u,
        }),
        re,
      )
    )
  }),
  de = e(r()),
  fe = V.createContext(null)
function G(e, t) {
  return `${e}-${t}`
}
function pe(e) {
  return G(V.useContext(fe), e)
}
var K = V.createContext(null)
function me(e, t) {
  let n = { ...e }
  return (
    Object.keys(t).forEach((e) => {
      let r = t[e]
      r !== void 0 && (n[e] = r)
    }),
    n
  )
}
function he({ children: e, locked: t, ...n }) {
  let r = V.useContext(K),
    i = ne(
      () => me(r, n),
      [r, n],
      (e, n) => !t && (e[0] !== n[0] || !d(e[1], n[1], !0)),
    )
  return V.createElement(K.Provider, { value: i }, e)
}
var ge = [],
  _e = V.createContext(null)
function q() {
  return V.useContext(_e)
}
var ve = V.createContext(ge)
function ye(e) {
  let t = V.useContext(ve)
  return V.useMemo(() => (e === void 0 ? t : [...t, e]), [t, e])
}
var be = V.createContext(null),
  xe = V.createContext({}),
  { LEFT: Se, RIGHT: J, UP: Ce, DOWN: Y, ENTER: we, ESC: Te, HOME: X, END: Z } = te,
  Ee = [Ce, Y, Se, J]
function Q(e, t, n, r) {
  let i = `prev`,
    a = `next`,
    o = `children`,
    s = `parent`
  if (e === `inline` && r === we) return { inlineTrigger: !0 }
  let c = { [Ce]: i, [Y]: a },
    l = { [Se]: n ? a : i, [J]: n ? i : a, [Y]: o, [we]: o },
    u = { [Ce]: i, [Y]: a, [we]: o, [Te]: s, [Se]: n ? o : s, [J]: n ? s : o }
  switch ({ inline: c, horizontal: l, vertical: u, inlineSub: c, horizontalSub: u, verticalSub: u }[`${e}${t ? `` : `Sub`}`]?.[r]) {
    case i:
      return { offset: -1, sibling: !0 }
    case a:
      return { offset: 1, sibling: !0 }
    case s:
      return { offset: -1, sibling: !1 }
    case o:
      return { offset: 1, sibling: !1 }
    default:
      return null
  }
}
function De(e) {
  let t = e
  for (; t; ) {
    if (t.getAttribute(`data-menu-list`)) return t
    t = t.parentElement
  }
  return null
}
function Oe(e, t) {
  let n = e || document.activeElement
  for (; n; ) {
    if (t.has(n)) return n
    n = n.parentElement
  }
  return null
}
function ke(e, t) {
  return P(e, !0).filter((e) => t.has(e))
}
function Ae(e, t, n, r = 1) {
  if (!e) return null
  let i = ke(e, t),
    a = i.length,
    o = i.findIndex((e) => n === e)
  return (r < 0 ? (o === -1 ? (o = a - 1) : --o) : r > 0 && (o += 1), (o = (o + a) % a), i[o])
}
var je = (e, t) => {
  let n = new Set(),
    r = new Map(),
    i = new Map()
  return (
    e.forEach((e) => {
      let a = document.querySelector(`[data-menu-id='${G(t, e)}']`)
      a && (n.add(a), i.set(a, e), r.set(e, a))
    }),
    { elements: n, key2element: r, element2key: i }
  )
}
function Me(e, t, n, r, i, a, o, s, c, l) {
  let u = V.useRef(),
    d = V.useRef()
  d.current = t
  let f = () => {
    O.cancel(u.current)
  }
  return (
    V.useEffect(
      () => () => {
        f()
      },
      [],
    ),
    (p) => {
      let { which: m } = p
      if ([...Ee, we, Te, X, Z].includes(m)) {
        let l = a(),
          h = je(l, r),
          { elements: g, key2element: _, element2key: v } = h,
          y = Oe(_.get(t), g),
          b = v.get(y),
          x = Q(e, o(b, !0).length === 1, n, m)
        if (!x && m !== X && m !== Z) return
        ;(Ee.includes(m) || [X, Z].includes(m)) && p.preventDefault()
        let S = (e) => {
          if (e) {
            let t = e,
              n = e.querySelector(`a`)
            n?.getAttribute(`href`) && (t = n)
            let r = v.get(e)
            ;(s(r),
              f(),
              (u.current = O(() => {
                d.current === r && t.focus()
              })))
          }
        }
        if ([X, Z].includes(m) || x.sibling || !y) {
          let t
          t = !y || e === `inline` ? i.current : De(y)
          let n,
            r = ke(t, g)
          ;((n = m === X ? r[0] : m === Z ? r[r.length - 1] : Ae(t, g, y, x.offset)), S(n))
        } else if (x.inlineTrigger) c(b)
        else if (x.offset > 0)
          (c(b, !0),
            f(),
            (u.current = O(() => {
              h = je(l, r)
              let e = y.getAttribute(`aria-controls`)
              S(Ae(document.getElementById(e), h.elements))
            }, 5)))
        else if (x.offset < 0) {
          let e = o(b, !0),
            t = e[e.length - 2],
            n = _.get(t)
          ;(c(t, !1), S(n))
        }
      }
      l?.(p)
    }
  )
}
function Ne(e) {
  Promise.resolve().then(e)
}
var Pe = `__RC_UTIL_PATH_SPLIT__`,
  Fe = (e) => e.join(Pe),
  Ie = (e) => e.split(Pe),
  Le = `rc-menu-more`
function Re() {
  let [, e] = V.useState({}),
    t = (0, V.useRef)(new Map()),
    n = (0, V.useRef)(new Map()),
    [r, i] = V.useState([]),
    a = (0, V.useRef)(0),
    o = (0, V.useRef)(!1),
    s = () => {
      o.current || e({})
    },
    c = (0, V.useCallback)((e, r) => {
      let i = Fe(r)
      ;(n.current.set(i, e), t.current.set(e, i), (a.current += 1))
      let o = a.current
      Ne(() => {
        o === a.current && s()
      })
    }, []),
    l = (0, V.useCallback)((e, r) => {
      let i = Fe(r)
      ;(n.current.delete(i), t.current.delete(e))
    }, []),
    u = (0, V.useCallback)((e) => {
      i(e)
    }, []),
    d = (0, V.useCallback)(
      (e, n) => {
        let i = Ie(t.current.get(e) || ``)
        return (n && r.includes(i[0]) && i.unshift(Le), i)
      },
      [r],
    ),
    f = (0, V.useCallback)((e, t) => e.filter((e) => e !== void 0).some((e) => d(e, !0).includes(t)), [d]),
    p = () => {
      let e = [...t.current.keys()]
      return (r.length && e.push(Le), e)
    },
    m = (0, V.useCallback)((e) => {
      let r = `${t.current.get(e)}${Pe}`,
        i = new Set()
      return (
        [...n.current.keys()].forEach((e) => {
          e.startsWith(r) && i.add(n.current.get(e))
        }),
        i
      )
    }, [])
  return (
    V.useEffect(
      () => () => {
        o.current = !0
      },
      [],
    ),
    { registerPath: c, unregisterPath: l, refreshOverflowKeys: u, isSubPathKey: f, getKeyPath: d, getKeys: p, getSubPathKeys: m }
  )
}
function ze(e) {
  let t = V.useRef(e)
  t.current = e
  let n = V.useCallback((...e) => t.current?.(...e), [])
  return e ? n : void 0
}
function Be(e, t, n, r) {
  let { activeKey: i, onActive: a, onInactive: o } = V.useContext(K),
    s = { active: i === e }
  return (
    t ||
      ((s.onMouseEnter = (t) => {
        ;(n?.({ key: e, domEvent: t }), a(e))
      }),
      (s.onMouseLeave = (t) => {
        ;(r?.({ key: e, domEvent: t }), o(e))
      })),
    s
  )
}
function Ve(e) {
  let { mode: t, rtl: n, inlineIndent: r } = V.useContext(K)
  if (t !== `inline`) return null
  let i = e
  return n ? { paddingRight: i * r } : { paddingLeft: i * r }
}
function He({ icon: e, props: t, children: n }) {
  let r
  return e === null || e === !1 ? null : (typeof e == `function` ? (r = V.createElement(e, { ...t })) : typeof e != `boolean` && (r = e), r || n || null)
}
function Ue({ item: e, ...t }) {
  return (
    Object.defineProperty(t, `item`, {
      get: () => (M(!1, '`info.item` is deprecated since we will move to function component that not provides React Node instance in future.'), e),
    }),
    t
  )
}
function We() {
  return (
    (We = Object.assign
      ? Object.assign.bind()
      : function (e) {
          for (var t = 1; t < arguments.length; t++) {
            var n = arguments[t]
            for (var r in n) Object.prototype.hasOwnProperty.call(n, r) && (e[r] = n[r])
          }
          return e
        }),
    We.apply(this, arguments)
  )
}
var Ge = class extends V.Component {
    render() {
      let { title: e, attribute: t, elementRef: n, ...r } = this.props,
        i = T(r, [`eventKey`, `popupClassName`, `popupOffset`, `onTitleClick`])
      return (
        M(!t, '`attribute` of Menu.Item is deprecated. Please pass attribute directly.'),
        V.createElement(B.Item, We({}, t, { title: typeof e == `string` ? e : void 0 }, i, { ref: n }))
      )
    }
  },
  Ke = V.forwardRef((e, t) => {
    let {
        style: n,
        className: r,
        eventKey: i,
        warnKey: a,
        disabled: o,
        itemIcon: s,
        children: c,
        role: l,
        onMouseEnter: u,
        onMouseLeave: d,
        onClick: f,
        onKeyDown: p,
        onFocus: m,
        ...h
      } = e,
      g = pe(i),
      { prefixCls: _, onItemClick: v, disabled: y, overflowDisabled: b, itemIcon: x, selectedKeys: S, onActive: w } = V.useContext(K),
      { _internalRenderMenuItem: E } = V.useContext(xe),
      D = `${_}-item`,
      O = V.useRef(),
      k = V.useRef(),
      A = y || o,
      j = ee(t, k),
      M = ye(i),
      N = (e) => ({ key: i, keyPath: [...M].reverse(), item: O.current, domEvent: e }),
      ne = s || x,
      { active: P, ...re } = Be(i, A, u, d),
      F = S.includes(i),
      ie = Ve(M.length),
      I = (e) => {
        if (A) return
        let t = N(e)
        ;(f?.(Ue(t)), v(t))
      },
      L = (e) => {
        if ((p?.(e), e.which === te.ENTER)) {
          let t = N(e)
          ;(f?.(Ue(t)), v(t))
        }
      },
      R = (e) => {
        ;(w(i), m?.(e))
      },
      z = {}
    e.role === `option` && (z[`aria-selected`] = F)
    let B = V.createElement(
      Ge,
      We(
        { ref: O, elementRef: j, role: l === null ? `none` : l || `menuitem`, tabIndex: o ? null : -1, 'data-menu-id': b && g ? null : g },
        T(h, [`extra`]),
        re,
        z,
        {
          component: `li`,
          'aria-disabled': o,
          style: { ...ie, ...n },
          className: C(D, { [`${D}-active`]: P, [`${D}-selected`]: F, [`${D}-disabled`]: A }, r),
          onClick: I,
          onKeyDown: L,
          onFocus: R,
        },
      ),
      c,
      V.createElement(He, { props: { ...e, isSelected: F }, icon: ne }),
    )
    return (E && (B = E(B, e, { selected: F })), B)
  })
function qe(e, t) {
  let { eventKey: n } = e,
    r = q(),
    i = ye(n)
  return (
    V.useEffect(() => {
      if (r)
        return (
          r.registerPath(n, i),
          () => {
            r.unregisterPath(n, i)
          }
        )
    }, [i]),
    r ? null : V.createElement(Ke, We({}, e, { ref: t }))
  )
}
var Je = V.forwardRef(qe)
function Ye() {
  return (
    (Ye = Object.assign
      ? Object.assign.bind()
      : function (e) {
          for (var t = 1; t < arguments.length; t++) {
            var n = arguments[t]
            for (var r in n) Object.prototype.hasOwnProperty.call(n, r) && (e[r] = n[r])
          }
          return e
        }),
    Ye.apply(this, arguments)
  )
}
var Xe = V.forwardRef(({ className: e, children: t, ...n }, r) => {
  let { prefixCls: i, mode: a, rtl: o } = V.useContext(K)
  return V.createElement(
    `ul`,
    Ye({ className: C(i, o && `${i}-rtl`, `${i}-sub`, `${i}-${a === `inline` ? `inline` : `vertical`}`, e), role: `menu` }, n, {
      'data-menu-list': !0,
      ref: r,
    }),
    t,
  )
})
function Ze(e, t) {
  return h(e).map((e, n) => {
    if (V.isValidElement(e)) {
      let { key: r } = e,
        i = e.props?.eventKey ?? r
      i ??= `tmp_key-${[...t, n].join(`-`)}`
      let a = { key: i, eventKey: i }
      return V.cloneElement(e, a)
    }
    return e
  })
}
var $ = { adjustX: 1, adjustY: 1 },
  Qe = {
    topLeft: { points: [`bl`, `tl`], overflow: $ },
    topRight: { points: [`br`, `tr`], overflow: $ },
    bottomLeft: { points: [`tl`, `bl`], overflow: $ },
    bottomRight: { points: [`tr`, `br`], overflow: $ },
    leftTop: { points: [`tr`, `tl`], overflow: $ },
    leftBottom: { points: [`br`, `bl`], overflow: $ },
    rightTop: { points: [`tl`, `tr`], overflow: $ },
    rightBottom: { points: [`bl`, `br`], overflow: $ },
  },
  $e = {
    topLeft: { points: [`bl`, `tl`], overflow: $ },
    topRight: { points: [`br`, `tr`], overflow: $ },
    bottomLeft: { points: [`tl`, `bl`], overflow: $ },
    bottomRight: { points: [`tr`, `br`], overflow: $ },
    rightTop: { points: [`tr`, `tl`], overflow: $ },
    rightBottom: { points: [`br`, `bl`], overflow: $ },
    leftTop: { points: [`tl`, `tr`], overflow: $ },
    leftBottom: { points: [`bl`, `br`], overflow: $ },
  }
function et(e, t, n) {
  if (t) return t
  if (n) return n[e] || n.other
}
var tt = { horizontal: `bottomLeft`, vertical: `rightTop`, 'vertical-left': `rightTop`, 'vertical-right': `leftTop` }
function nt({ prefixCls: e, visible: t, children: n, popup: r, popupStyle: i, popupClassName: a, popupOffset: o, disabled: s, mode: l, onVisibleChange: u }) {
  let {
      getPopupContainer: d,
      rtl: f,
      subMenuOpenDelay: p,
      subMenuCloseDelay: m,
      builtinPlacements: h,
      triggerSubMenuAction: g,
      forceSubMenuRender: _,
      rootClassName: v,
      motion: y,
      defaultMotions: b,
    } = V.useContext(K),
    [x, S] = V.useState(!1),
    w = f ? { ...$e, ...h } : { ...Qe, ...h },
    T = tt[l],
    E = et(l, y, b),
    D = V.useRef(E)
  l !== `inline` && (D.current = E)
  let k = { ...D.current, leavedClassName: `${e}-hidden`, removeOnLeave: !1, motionAppear: !0 },
    A = V.useRef()
  return (
    V.useEffect(
      () => (
        (A.current = O(() => {
          S(t)
        })),
        () => {
          O.cancel(A.current)
        }
      ),
      [t],
    ),
    V.createElement(
      c,
      {
        prefixCls: e,
        popupClassName: C(`${e}-popup`, { [`${e}-rtl`]: f }, a, v),
        stretch: l === `horizontal` ? `minWidth` : null,
        getPopupContainer: d,
        builtinPlacements: w,
        popupPlacement: T,
        popupVisible: x,
        popup: r,
        popupStyle: i,
        popupAlign: o && { offset: o },
        action: s ? [] : [g],
        mouseEnterDelay: p,
        mouseLeaveDelay: m,
        onPopupVisibleChange: u,
        forceRender: _,
        popupMotion: k,
        fresh: !0,
      },
      n,
    )
  )
}
function rt() {
  return (
    (rt = Object.assign
      ? Object.assign.bind()
      : function (e) {
          for (var t = 1; t < arguments.length; t++) {
            var n = arguments[t]
            for (var r in n) Object.prototype.hasOwnProperty.call(n, r) && (e[r] = n[r])
          }
          return e
        }),
    rt.apply(this, arguments)
  )
}
function it({ id: e, open: t, keyPath: n, children: r }) {
  let i = `inline`,
    { prefixCls: a, forceSubMenuRender: o, motion: s, defaultMotions: c, mode: l } = V.useContext(K),
    u = V.useRef(!1)
  u.current = l === i
  let [d, f] = V.useState(!u.current),
    p = u.current ? t : !1
  V.useEffect(() => {
    u.current && f(!1)
  }, [l])
  let m = { ...et(i, s, c) }
  n.length > 1 && (m.motionAppear = !1)
  let h = m.onVisibleChanged
  return (
    (m.onVisibleChanged = (e) => (!u.current && !e && f(!0), h?.(e))),
    d
      ? null
      : V.createElement(
          he,
          { mode: i, locked: !u.current },
          V.createElement(j, rt({ visible: p }, m, { forceRender: o, removeOnLeave: !1, leavedClassName: `${a}-hidden` }), ({ className: t, style: n }) =>
            V.createElement(Xe, { id: e, className: t, style: n }, r),
          ),
        )
  )
}
function at() {
  return (
    (at = Object.assign
      ? Object.assign.bind()
      : function (e) {
          for (var t = 1; t < arguments.length; t++) {
            var n = arguments[t]
            for (var r in n) Object.prototype.hasOwnProperty.call(n, r) && (e[r] = n[r])
          }
          return e
        }),
    at.apply(this, arguments)
  )
}
var ot = V.forwardRef((e, t) => {
    let {
        style: n,
        className: r,
        styles: i,
        classNames: a,
        title: o,
        eventKey: s,
        warnKey: c,
        disabled: l,
        internalPopupClose: u,
        children: d,
        itemIcon: f,
        expandIcon: p,
        popupClassName: m,
        popupOffset: h,
        popupStyle: g,
        onClick: _,
        onMouseEnter: v,
        onMouseLeave: y,
        onTitleClick: b,
        onTitleMouseEnter: x,
        onTitleMouseLeave: S,
        popupRender: w,
        ...T
      } = e,
      E = pe(s),
      {
        prefixCls: D,
        mode: O,
        openKeys: k,
        disabled: A,
        overflowDisabled: j,
        activeKey: M,
        selectedKeys: N,
        itemIcon: ee,
        expandIcon: te,
        onItemClick: ne,
        onOpenChange: P,
        onActive: re,
        popupRender: F,
      } = V.useContext(K),
      { _internalRenderSubMenuItem: ie } = V.useContext(xe),
      { isSubPathKey: I } = V.useContext(be),
      L = ye(),
      R = `${D}-submenu`,
      z = A || l,
      ae = V.useRef(),
      oe = V.useRef(),
      H = f ?? ee,
      se = p ?? te,
      U = k.includes(s),
      W = !j && U,
      ce = I(N, s),
      { active: le, ...ue } = Be(s, z, x, S),
      [de, fe] = V.useState(!1),
      G = (e) => {
        z || fe(e)
      },
      me = (e) => {
        ;(G(!0), v?.({ key: s, domEvent: e }))
      },
      ge = (e) => {
        ;(G(!1), y?.({ key: s, domEvent: e }))
      },
      _e = V.useMemo(() => le || (O === `inline` ? !1 : de || I([M], s)), [O, le, M, de, s, I]),
      q = Ve(L.length),
      ve = (e) => {
        z || (b?.({ key: s, domEvent: e }), O === `inline` && P(s, !U))
      },
      Se = ze((e) => {
        ;(_?.(Ue(e)), ne(e))
      }),
      J = (e) => {
        O !== `inline` && P(s, e)
      },
      Ce = () => {
        re(s)
      },
      Y = E && `${E}-popup`,
      we = V.useMemo(
        () =>
          V.createElement(
            He,
            { icon: O === `horizontal` ? void 0 : se, props: { ...e, isOpen: W, isSubMenu: !0 } },
            V.createElement(`i`, { className: `${R}-arrow` }),
          ),
        [O, se, e, W, R],
      ),
      Te = V.createElement(
        `div`,
        at(
          {
            role: `menuitem`,
            style: q,
            className: `${R}-title`,
            tabIndex: z ? null : -1,
            ref: ae,
            title: typeof o == `string` ? o : null,
            'data-menu-id': j && E ? null : E,
            'aria-expanded': W,
            'aria-haspopup': !0,
            'aria-controls': Y,
            'aria-disabled': z,
            onClick: ve,
            onFocus: Ce,
          },
          ue,
        ),
        o,
        we,
      ),
      X = V.useRef(O)
    O !== `inline` && L.length > 1 ? (X.current = `vertical`) : (X.current = O)
    let Z = X.current,
      Ee = V.useMemo(() => {
        let t = V.createElement(he, { classNames: a, styles: i, mode: Z === `horizontal` ? `vertical` : Z }, V.createElement(Xe, { id: Y, ref: oe }, d)),
          n = w || F
        return n ? n(t, { item: e, keys: L }) : t
      }, [w, F, L, Y, d, e, Z])
    if (!j) {
      let e = X.current
      Te = V.createElement(
        nt,
        {
          mode: e,
          prefixCls: R,
          visible: !u && W && O !== `inline`,
          popupClassName: m,
          popupOffset: h,
          popupStyle: g,
          popup: Ee,
          disabled: z,
          onVisibleChange: J,
        },
        Te,
      )
    }
    let Q = V.createElement(
      B.Item,
      at({ ref: t, role: `none` }, T, {
        component: `li`,
        style: n,
        className: C(R, `${R}-${O}`, r, { [`${R}-open`]: W, [`${R}-active`]: _e, [`${R}-selected`]: ce, [`${R}-disabled`]: z }),
        onMouseEnter: me,
        onMouseLeave: ge,
      }),
      Te,
      !j && V.createElement(it, { id: Y, open: W, keyPath: L }, d),
    )
    return (
      ie && (Q = ie(Q, e, { selected: ce, active: _e, open: W, disabled: z })),
      V.createElement(he, { classNames: a, styles: i, onItemClick: Se, mode: O === `horizontal` ? `vertical` : O, itemIcon: H, expandIcon: se }, Q)
    )
  }),
  st = V.forwardRef((e, t) => {
    let { eventKey: n, children: r } = e,
      i = ye(n),
      a = Ze(r, i),
      o = q()
    V.useEffect(() => {
      if (o)
        return (
          o.registerPath(n, i),
          () => {
            o.unregisterPath(n, i)
          }
        )
    }, [i])
    let s
    return ((s = o ? a : V.createElement(ot, at({ ref: t }, e), a)), V.createElement(ve.Provider, { value: i }, s))
  })
function ct({ className: e, style: t }) {
  let { prefixCls: n } = V.useContext(K)
  return q() ? null : V.createElement(`li`, { role: `separator`, className: C(`${n}-item-divider`, e), style: t })
}
function lt() {
  return (
    (lt = Object.assign
      ? Object.assign.bind()
      : function (e) {
          for (var t = 1; t < arguments.length; t++) {
            var n = arguments[t]
            for (var r in n) Object.prototype.hasOwnProperty.call(n, r) && (e[r] = n[r])
          }
          return e
        }),
    lt.apply(this, arguments)
  )
}
var ut = V.forwardRef((e, t) => {
    let { className: n, title: r, eventKey: i, children: a, ...o } = e,
      { prefixCls: s, classNames: c, styles: l } = V.useContext(K),
      u = `${s}-item-group`
    return V.createElement(
      `li`,
      lt({ ref: t, role: `presentation` }, o, { onClick: (e) => e.stopPropagation(), className: C(u, n) }),
      V.createElement(
        `div`,
        { role: `presentation`, className: C(`${u}-title`, c?.listTitle), style: l?.listTitle, title: typeof r == `string` ? r : void 0 },
        r,
      ),
      V.createElement(`ul`, { role: `group`, className: C(`${u}-list`, c?.list), style: l?.list }, a),
    )
  }),
  dt = V.forwardRef((e, t) => {
    let { eventKey: n, children: r } = e,
      i = Ze(r, ye(n))
    return q() ? i : V.createElement(ut, lt({ ref: t }, T(e, [`warnKey`])), i)
  })
function ft() {
  return (
    (ft = Object.assign
      ? Object.assign.bind()
      : function (e) {
          for (var t = 1; t < arguments.length; t++) {
            var n = arguments[t]
            for (var r in n) Object.prototype.hasOwnProperty.call(n, r) && (e[r] = n[r])
          }
          return e
        }),
    ft.apply(this, arguments)
  )
}
function pt(e, t, n) {
  let { item: r, group: i, submenu: a, divider: o } = t
  return (e || [])
    .map((e, s) => {
      if (e && typeof e == `object`) {
        let { label: c, children: l, key: u, type: d, extra: f, ...p } = e,
          m = u ?? `tmp-${s}`
        return l || d === `group`
          ? d === `group`
            ? V.createElement(i, ft({ key: m }, p, { title: c }), pt(l, t, n))
            : V.createElement(a, ft({ key: m }, p, { title: c }), pt(l, t, n))
          : d === `divider`
            ? V.createElement(o, ft({ key: m }, p))
            : V.createElement(r, ft({ key: m }, p, { extra: f }), c, (!!f || f === 0) && V.createElement(`span`, { className: `${n}-item-extra` }, f))
      }
      return null
    })
    .filter((e) => e)
}
function mt(e, t, n, r, i) {
  let a = e,
    o = { divider: ct, item: Je, group: dt, submenu: st, ...r }
  return (t && (a = pt(t, o, i)), Ze(a, n))
}
function ht() {
  return (
    (ht = Object.assign
      ? Object.assign.bind()
      : function (e) {
          for (var t = 1; t < arguments.length; t++) {
            var n = arguments[t]
            for (var r in n) Object.prototype.hasOwnProperty.call(n, r) && (e[r] = n[r])
          }
          return e
        }),
    ht.apply(this, arguments)
  )
}
var gt = [],
  _t = V.forwardRef((e, t) => {
    let {
        prefixCls: n = `rc-menu`,
        rootClassName: r,
        style: i,
        className: o,
        styles: s,
        classNames: c,
        tabIndex: l = 0,
        items: u,
        children: f,
        direction: p,
        id: h,
        mode: g = `vertical`,
        inlineCollapsed: _,
        disabled: v,
        disabledOverflow: y,
        subMenuOpenDelay: b = 0.1,
        subMenuCloseDelay: x = 0.1,
        forceSubMenuRender: S,
        defaultOpenKeys: w,
        openKeys: T,
        activeKey: E,
        defaultActiveFirst: D,
        selectable: O = !0,
        multiple: k = !1,
        defaultSelectedKeys: A,
        selectedKeys: j,
        onSelect: M,
        onDeselect: N,
        inlineIndent: ee = 24,
        motion: te,
        defaultMotions: ne,
        triggerSubMenuAction: P = `hover`,
        builtinPlacements: re,
        itemIcon: F,
        expandIcon: ie,
        overflowedIndicator: I = `...`,
        overflowedIndicatorPopupClassName: L,
        getPopupContainer: R,
        onClick: z,
        onOpenChange: ae,
        onKeyDown: oe,
        openAnimation: H,
        openTransitionName: se,
        _internalRenderMenuItem: U,
        _internalRenderSubMenuItem: W,
        _internalComponents: ce,
        popupRender: le,
        ...ue
      } = e,
      [G, pe] = V.useMemo(() => [mt(f, u, gt, ce, n), mt(f, u, gt, {}, n)], [f, u, ce]),
      [K, me] = V.useState(!1),
      ge = V.useRef(),
      q = a(h ? `rc-menu-uuid-${h}` : `rc-menu-uuid`),
      ve = p === `rtl`,
      [ye, Se] = m(w, T),
      J = ye || gt,
      Ce = (e, t = !1) => {
        function n() {
          ;(Se(e), ae?.(e))
        }
        t ? (0, de.flushSync)(n) : n()
      },
      [Y, we] = V.useState(J),
      Te = V.useRef(!1),
      [X, Z] = V.useMemo(() => ((g === `inline` || g === `vertical`) && _ ? [`vertical`, _] : [g, !1]), [g, _]),
      Ee = X === `inline`,
      [Q, De] = V.useState(X),
      [Oe, Ae] = V.useState(Z)
    V.useEffect(() => {
      ;(De(X), Ae(Z), Te.current && (Ee ? Se(Y) : Ce(gt)))
    }, [X, Z])
    let [Ne, Pe] = V.useState(0),
      Fe = Ne >= G.length - 1 || Q !== `horizontal` || y
    ;(V.useEffect(() => {
      Ee && we(J)
    }, [J]),
      V.useEffect(
        () => (
          (Te.current = !0),
          () => {
            Te.current = !1
          }
        ),
        [],
      ))
    let { registerPath: Ie, unregisterPath: Be, refreshOverflowKeys: Ve, isSubPathKey: He, getKeyPath: We, getKeys: Ge, getSubPathKeys: Ke } = Re(),
      qe = V.useMemo(() => ({ registerPath: Ie, unregisterPath: Be }), [Ie, Be]),
      Ye = V.useMemo(() => ({ isSubPathKey: He }), [He])
    V.useEffect(() => {
      Ve(Fe ? gt : G.slice(Ne + 1).map((e) => e.key))
    }, [Ne, Fe])
    let [Xe, Ze] = m(E || (D && G[0]?.key), E),
      $ = ze((e) => {
        Ze(e)
      }),
      Qe = ze(() => {
        Ze(void 0)
      })
    ;(0, V.useImperativeHandle)(t, () => ({
      list: ge.current,
      focus: (e) => {
        let t = Ge(),
          { elements: n, key2element: r, element2key: i } = je(t, q),
          a = ke(ge.current, n),
          o
        o = Xe && t.includes(Xe) ? Xe : a[0] ? i.get(a[0]) : G.find((e) => !e.props.disabled)?.key
        let s = r.get(o)
        o && s && s?.focus?.(e)
      },
      findItem: ({ key: e }) => {
        let { key2element: t } = je(Ge(), q)
        return t.get(e) || null
      },
    }))
    let [$e, et] = m(A || [], j),
      tt = V.useMemo(() => (Array.isArray($e) ? $e : $e == null ? gt : [$e]), [$e]),
      nt = (e) => {
        if (O) {
          let { key: t } = e,
            n = tt.includes(t),
            r
          ;((r = k ? (n ? tt.filter((e) => e !== t) : [...tt, t]) : [t]), et(r))
          let i = { ...e, selectedKeys: r }
          n ? N?.(i) : M?.(i)
        }
        !k && J.length && Q !== `inline` && Ce(gt)
      },
      rt = ze((e) => {
        ;(z?.(Ue(e)), nt(e))
      }),
      it = ze((e, t) => {
        let n = J.filter((t) => t !== e)
        if (t) n.push(e)
        else if (Q !== `inline`) {
          let t = Ke(e)
          n = n.filter((e) => !t.has(e))
        }
        d(J, n, !0) || Ce(n, !0)
      }),
      at = Me(
        Q,
        Xe,
        ve,
        q,
        ge,
        Ge,
        We,
        Ze,
        (e, t) => {
          it(e, t ?? !J.includes(e))
        },
        oe,
      )
    V.useEffect(() => {
      me(!0)
    }, [])
    let ot = V.useMemo(() => ({ _internalRenderMenuItem: U, _internalRenderSubMenuItem: W }), [U, W]),
      ct = Q !== `horizontal` || y ? G : G.map((e, t) => V.createElement(he, { key: e.key, overflowDisabled: t > Ne, classNames: c, styles: s }, e)),
      lt = V.createElement(
        B,
        ht(
          {
            id: h,
            ref: ge,
            prefixCls: `${n}-overflow`,
            component: `ul`,
            itemComponent: Je,
            className: C(n, `${n}-root`, `${n}-${Q}`, o, { [`${n}-inline-collapsed`]: Oe, [`${n}-rtl`]: ve }, r),
            dir: p,
            style: i,
            role: `menu`,
            tabIndex: l,
            data: ct,
            renderRawItem: (e) => e,
            renderRawRest: (e) => {
              let t = e.length,
                n = t ? G.slice(-t) : null
              return V.createElement(st, { eventKey: Le, title: I, disabled: Fe, internalPopupClose: t === 0, popupClassName: L }, n)
            },
            maxCount: Q !== `horizontal` || y ? B.INVALIDATE : B.RESPONSIVE,
            ssr: `full`,
            'data-menu-list': !0,
            onVisibleChange: (e) => {
              Pe(e)
            },
            onKeyDown: at,
          },
          ue,
        ),
      )
    return V.createElement(
      xe.Provider,
      { value: ot },
      V.createElement(
        fe.Provider,
        { value: q },
        V.createElement(
          he,
          {
            prefixCls: n,
            rootClassName: r,
            classNames: c,
            styles: s,
            mode: Q,
            openKeys: J,
            rtl: ve,
            disabled: v,
            motion: K ? te : null,
            defaultMotions: K ? ne : null,
            activeKey: Xe,
            onActive: $,
            onInactive: Qe,
            selectedKeys: tt,
            inlineIndent: ee,
            subMenuOpenDelay: b,
            subMenuCloseDelay: x,
            forceSubMenuRender: S,
            builtinPlacements: re,
            triggerSubMenuAction: P,
            getPopupContainer: R,
            itemIcon: F,
            expandIcon: ie,
            onItemClick: rt,
            onOpenChange: it,
            popupRender: le,
          },
          V.createElement(be.Provider, { value: Ye }, lt),
          V.createElement(`div`, { style: { display: `none` }, 'aria-hidden': !0 }, V.createElement(_e.Provider, { value: qe }, pe)),
        ),
      ),
    )
  })
;((_t.Item = Je), (_t.SubMenu = st), (_t.ItemGroup = dt), (_t.Divider = ct))
var vt = {
  icon: {
    tag: `svg`,
    attrs: { viewBox: `64 64 896 896`, focusable: `false` },
    children: [
      {
        tag: `path`,
        attrs: { d: `M176 511a56 56 0 10112 0 56 56 0 10-112 0zm280 0a56 56 0 10112 0 56 56 0 10-112 0zm280 0a56 56 0 10112 0 56 56 0 10-112 0z` },
      },
    ],
  },
  name: `ellipsis`,
  theme: `outlined`,
}
function yt() {
  return (
    (yt = Object.assign
      ? Object.assign.bind()
      : function (e) {
          for (var t = 1; t < arguments.length; t++) {
            var n = arguments[t]
            for (var r in n) Object.prototype.hasOwnProperty.call(n, r) && (e[r] = n[r])
          }
          return e
        }),
    yt.apply(this, arguments)
  )
}
var bt = V.forwardRef((e, t) => V.createElement(k, yt({}, e, { ref: t, icon: vt }))),
  xt = (0, V.createContext)({ prefixCls: ``, firstLevel: !0, inlineCollapsed: !1, styles: null, classNames: null }),
  St = (e) => {
    let { prefixCls: t, className: r, dashed: i, ...a } = e,
      { getPrefixCls: o } = V.useContext(n),
      s = C({ [`${o(`menu`, t)}-item-divider-dashed`]: !!i }, r)
    return V.createElement(ct, { className: s, ...a })
  },
  Ct = (e) => {
    let { className: t, children: n, icon: r, title: i, danger: a, extra: o } = e,
      {
        prefixCls: s,
        firstLevel: c,
        direction: l,
        disableMenuItemTitleTooltip: u,
        tooltip: d,
        inlineCollapsed: f,
        styles: p,
        classNames: m,
      } = V.useContext(xt),
      g = (e) => {
        let t = n?.[0],
          i = V.createElement(
            `span`,
            {
              className: C(`${s}-title-content`, c ? m?.itemContent : m?.subMenu?.itemContent, { [`${s}-title-content-with-extra`]: !!o || o === 0 }),
              style: c ? p?.itemContent : p?.subMenu?.itemContent,
            },
            n,
          )
        return (!r || (V.isValidElement(n) && n.type === `span`)) && n && e && c && typeof t == `string`
          ? V.createElement(`div`, { className: `${s}-inline-collapsed-noicon` }, t.charAt(0))
          : i
      },
      { siderCollapsed: _ } = V.useContext(z),
      v = i
    i === void 0 ? (v = c ? n : ``) : i === !1 && (v = ``)
    let y = d === !1 ? void 0 : d,
      b = y && y.title !== void 0 ? y.title : v,
      x = { ...(y ?? null), title: b }
    !_ && !f && ((x.title = null), (x.open = !1))
    let S = h(n).length,
      E = V.createElement(
        Je,
        {
          ...T(e, [`title`, `icon`, `danger`]),
          className: C(c ? m?.item : m?.subMenu?.item, { [`${s}-item-danger`]: a, [`${s}-item-only-child`]: (r ? S + 1 : S) === 1 }, t),
          style: { ...(c ? p?.item : p?.subMenu?.item), ...e.style },
          title: typeof i == `string` ? i : void 0,
        },
        w(r, (e) => ({
          className: C(`${s}-item-icon`, c ? m?.itemIcon : m?.subMenu?.itemIcon, e.className),
          style: { ...(c ? p?.itemIcon : p?.subMenu?.itemIcon), ...e.style },
        })),
        g(f),
      )
    if (!u && d !== !1) {
      let e = y && y.placement ? y.placement : l === `rtl` ? `left` : `right`,
        t = `${s}-inline-collapsed-tooltip`,
        n = (e) => ({ ...e, root: C(t, e?.root) }),
        r = y && typeof y.classNames == `function` ? (e) => n(y.classNames(e)) : n(y?.classNames)
      E = V.createElement(ie, { ...x, placement: e, classNames: r }, E)
    }
    return E
  },
  wt = V.createContext(null),
  Tt = V.forwardRef((e, t) => {
    let { children: n, ...r } = e,
      i = V.useContext(wt),
      a = V.useMemo(() => ({ ...i, ...r }), [i, r.prefixCls, r.mode, r.selectable, r.rootClassName]),
      o = y(n),
      s = ee(t, o ? x(n) : null)
    return V.createElement(wt.Provider, { value: a }, V.createElement(re, { space: !0 }, o ? V.cloneElement(n, { ref: s }) : n))
  }),
  Et = (e) => {
    let { componentCls: t, motionDurationSlow: n, horizontalLineHeight: r, colorSplit: a, lineWidth: o, lineType: s, itemPaddingInline: c } = e
    return {
      [`${t}-horizontal`]: {
        lineHeight: r,
        border: 0,
        borderBottom: `${i(o)} ${s} ${a}`,
        boxShadow: `none`,
        '&::after': { display: `block`, clear: `both`, height: 0, content: `"\\20"` },
        [`${t}-item, ${t}-submenu`]: { position: `relative`, display: `inline-block`, verticalAlign: `bottom`, paddingInline: c },
        [`> ${t}-item:hover,
        > ${t}-item-active,
        > ${t}-submenu ${t}-submenu-title:hover`]: { backgroundColor: `transparent` },
        [`${t}-item, ${t}-submenu-title`]: { transition: [`border-color`, `background-color`].map((e) => `${e} ${n}`).join(`,`) },
        [`${t}-submenu-arrow`]: { display: `none` },
      },
    }
  },
  Dt = ({ componentCls: e, menuArrowOffset: t, calc: n }) => ({
    [`${e}-rtl`]: { direction: `rtl` },
    [`${e}-submenu-rtl`]: { transformOrigin: `100% 0` },
    [`${e}-rtl${e}-vertical,
    ${e}-submenu-rtl ${e}-vertical`]: {
      [`${e}-submenu-arrow`]: {
        '&::before': { transform: `rotate(-45deg) translateY(${i(n(t).mul(-1).equal())})` },
        '&::after': { transform: `rotate(45deg) translateY(${i(t)})` },
      },
    },
  }),
  Ot = (e) => v(e),
  kt = (e, t) => {
    let {
      componentCls: n,
      itemColor: r,
      itemSelectedColor: a,
      subMenuItemSelectedColor: o,
      groupTitleColor: s,
      itemBg: c,
      subMenuItemBg: l,
      itemSelectedBg: u,
      activeBarHeight: d,
      activeBarWidth: f,
      activeBarBorderWidth: p,
      motionDurationSlow: m,
      motionEaseInOut: h,
      motionEaseOut: g,
      itemPaddingInline: _,
      motionDurationMid: v,
      itemHoverColor: y,
      lineType: b,
      colorSplit: x,
      itemDisabledColor: S,
      dangerItemColor: C,
      dangerItemHoverColor: w,
      dangerItemSelectedColor: T,
      dangerItemActiveBg: E,
      dangerItemSelectedBg: D,
      popupBg: O,
      itemHoverBg: k,
      itemActiveBg: A,
      menuSubMenuBg: j,
      horizontalItemSelectedColor: M,
      horizontalItemSelectedBg: N,
      horizontalItemBorderRadius: ee,
      horizontalItemHoverBg: te,
    } = e
    return {
      [`${n}-${t}, ${n}-${t} > ${n}`]: {
        color: r,
        background: c,
        [`&${n}-root:focus-visible`]: { ...Ot(e) },
        [`${n}-item`]: { '&-group-title, &-extra': { color: s } },
        [`${n}-submenu-selected > ${n}-submenu-title`]: { color: o },
        [`${n}-item, ${n}-submenu-title`]: { color: r, [`&:not(${n}-item-disabled):focus-visible`]: { ...Ot(e) } },
        [`${n}-item-disabled, ${n}-submenu-disabled`]: { color: `${S} !important` },
        [`${n}-item:not(${n}-item-selected):not(${n}-submenu-selected)`]: { [`&:hover, > ${n}-submenu-title:hover`]: { color: y } },
        [`${n}-submenu:not(${n}-submenu-selected)`]: { [`> ${n}-submenu-title:hover`]: { color: y } },
        [`&:not(${n}-horizontal)`]: {
          [`${n}-item:not(${n}-item-selected)`]: { '&:hover': { backgroundColor: k }, '&:active': { backgroundColor: A } },
          [`${n}-submenu-title`]: { '&:hover': { backgroundColor: k }, '&:active': { backgroundColor: A } },
        },
        [`${n}-item-danger`]: {
          color: C,
          [`&${n}-item:hover`]: { [`&:not(${n}-item-selected):not(${n}-submenu-selected)`]: { color: w } },
          [`&${n}-item:active`]: { background: E },
        },
        [`${n}-item a`]: { '&, &:hover': { color: `inherit` } },
        [`${n}-item-selected`]: { color: a, [`&${n}-item-danger`]: { color: T }, 'a, a:hover': { color: `inherit` } },
        [`& ${n}-item-selected`]: { backgroundColor: u, [`&${n}-item-danger`]: { backgroundColor: D } },
        [`&${n}-submenu > ${n}`]: { backgroundColor: j },
        [`&${n}-popup > ${n}`]: { backgroundColor: O },
        [`&${n}-submenu-popup > ${n}`]: { backgroundColor: O },
        [`&${n}-horizontal`]: {
          ...(t === `dark` ? { borderBottom: 0 } : {}),
          [`> ${n}-item, > ${n}-submenu`]: {
            top: p,
            marginTop: e.calc(p).mul(-1).equal(),
            marginBottom: 0,
            borderRadius: ee,
            '&::after': {
              position: `absolute`,
              insetInline: _,
              bottom: 0,
              borderBottom: `${i(d)} solid transparent`,
              transition: `border-color ${m} ${h}`,
              content: `""`,
            },
            '&:hover, &-active, &-open': { background: te, '&::after': { borderBottomWidth: d, borderBottomColor: M } },
            '&-selected': { color: M, backgroundColor: N, '&:hover': { backgroundColor: N }, '&::after': { borderBottomWidth: d, borderBottomColor: M } },
          },
        },
        [`&${n}-root`]: { [`&${n}-inline, &${n}-vertical`]: { borderInlineEnd: `${i(p)} ${b} ${x}` } },
        [`&${n}-inline`]: {
          [`${n}-sub${n}-inline`]: { background: l },
          [`${n}-item`]: {
            position: `relative`,
            '&::after': {
              position: `absolute`,
              insetBlock: 0,
              insetInlineEnd: 0,
              borderInlineEnd: `${i(f)} solid ${a}`,
              transform: `scaleY(0.0001)`,
              opacity: 0,
              transition: [`transform`, `opacity`].map((e) => `${e} ${v} ${g}`).join(`,`),
              content: `""`,
            },
            [`&${n}-item-danger`]: { '&::after': { borderInlineEndColor: T } },
          },
          [`${n}-selected, ${n}-item-selected`]: {
            '&::after': { transform: `scaleY(1)`, opacity: 1, transition: [`transform`, `opacity`].map((e) => `${e} ${v} ${h}`).join(`,`) },
          },
        },
      },
    }
  },
  At = (e) => {
    let {
        componentCls: t,
        itemHeight: n,
        itemMarginInline: r,
        padding: a,
        menuArrowSize: o,
        marginXS: s,
        itemMarginBlock: c,
        itemWidth: l,
        itemPaddingInline: u,
      } = e,
      d = e.calc(o).add(a).add(s).equal()
    return {
      [`${t}-item`]: { position: `relative`, overflow: `hidden` },
      [`${t}-item, ${t}-submenu-title`]: {
        height: n,
        lineHeight: i(n),
        paddingInline: u,
        overflow: `hidden`,
        textOverflow: `ellipsis`,
        marginInline: r,
        marginBlock: c,
        width: l,
      },
      [`> ${t}-item,
            > ${t}-submenu > ${t}-submenu-title`]: { height: n, lineHeight: i(n) },
      [`${t}-item-group-list ${t}-submenu-title,
            ${t}-submenu-title`]: { paddingInlineEnd: d },
    }
  },
  jt = (e) => {
    let {
        componentCls: t,
        iconCls: n,
        itemHeight: r,
        colorTextLightSolid: a,
        dropdownWidth: o,
        controlHeightLG: s,
        motionEaseOut: c,
        paddingXL: l,
        itemMarginInline: u,
        fontSizeLG: d,
        motionDurationFast: f,
        motionDurationSlow: p,
        paddingXS: m,
        boxShadowSecondary: h,
        collapsedWidth: g,
        collapsedIconSize: _,
      } = e,
      v = { height: r, lineHeight: i(r), listStylePosition: `inside`, listStyleType: `disc` }
    return [
      {
        [t]: { '&-inline, &-vertical': { [`&${t}-root`]: { boxShadow: `none` }, ...At(e) } },
        [`${t}-submenu-popup`]: { [`${t}-vertical`]: { ...At(e), boxShadow: h } },
      },
      {
        [`${t}-submenu-popup ${t}-vertical${t}-sub`]: {
          minWidth: o,
          maxHeight: `calc(100vh - ${i(e.calc(s).mul(2.5).equal())})`,
          padding: `0`,
          overflow: `hidden`,
          borderInlineEnd: 0,
          "&:not([class*='-active'])": { overflowX: `hidden`, overflowY: `auto` },
        },
      },
      {
        [`${t}-inline`]: {
          width: `100%`,
          [`&${t}-root`]: {
            [`${t}-item, ${t}-submenu-title`]: {
              display: `flex`,
              alignItems: `center`,
              transition: [`border-color ${p}`, `background-color ${p}`, `padding ${f} ${c}`].join(`,`),
              [`> ${t}-title-content`]: { flex: `auto`, minWidth: 0, overflow: `hidden`, textOverflow: `ellipsis` },
              '> *': { flex: `none` },
            },
          },
          [`${t}-sub${t}-inline`]: {
            padding: 0,
            border: 0,
            borderRadius: 0,
            boxShadow: `none`,
            [`& > ${t}-submenu > ${t}-submenu-title`]: v,
            [`& ${t}-item-group-title`]: { paddingInlineStart: l },
          },
          [`${t}-item`]: v,
        },
      },
      {
        [`${t}-inline-collapsed`]: {
          width: g,
          [`&${t}-root`]: { [`${t}-item, ${t}-submenu ${t}-submenu-title`]: { [`> ${t}-inline-collapsed-noicon`]: { fontSize: d, textAlign: `center` } } },
          [`> ${t}-item,
          > ${t}-item-group > ${t}-item-group-list > ${t}-item,
          > ${t}-item-group > ${t}-item-group-list > ${t}-submenu > ${t}-submenu-title,
          > ${t}-submenu > ${t}-submenu-title`]: {
            display: `flex`,
            alignItems: `center`,
            justifyContent: `center`,
            insetInlineStart: 0,
            paddingInline: `calc(50% - ${i(e.calc(_).div(2).equal())} - ${i(u)})`,
            textOverflow: `clip`,
            [`
            ${t}-submenu-arrow,
            ${t}-submenu-expand-icon
          `]: { opacity: 0 },
            [`> ${t}-title-content`]: { width: 0, opacity: 0, overflow: `hidden` },
            [`${t}-item-icon, ${n}`]: {
              margin: 0,
              fontSize: _,
              lineHeight: i(r),
              '+ span': { display: `inline-block`, width: 0, opacity: 0, overflow: `hidden`, marginInlineStart: 0 },
            },
          },
          [`${t}-item-icon, ${n}`]: { display: `inline-block` },
          '&-tooltip': { pointerEvents: `none`, [`${t}-item-icon, ${n}`]: { display: `none` }, 'a, a:hover': { color: a } },
          [`${t}-item-group-title`]: { ...b, paddingInline: m },
        },
      },
    ]
  },
  Mt = (e) => {
    let {
      componentCls: t,
      motionDurationSlow: n,
      motionDurationMid: r,
      motionEaseInOut: i,
      motionEaseOut: a,
      iconCls: o,
      iconSize: s,
      iconMarginInlineEnd: c,
    } = e
    return {
      [`${t}-item, ${t}-submenu-title`]: {
        position: `relative`,
        display: `block`,
        margin: 0,
        whiteSpace: `nowrap`,
        cursor: `pointer`,
        transition: [`border-color ${n}`, `background-color ${n}`, `padding calc(${n} + 0.1s) ${i}`].join(`,`),
        [`${t}-item-icon, ${o}`]: {
          minWidth: s,
          fontSize: s,
          transition: [`font-size ${r} ${a}`, `margin ${n} ${i}`, `color ${n}`].join(`,`),
          '+ span': { marginInlineStart: c, opacity: 1, transition: [`opacity ${n} ${i}`, `margin ${n}`, `color ${n}`].join(`,`) },
        },
        [`${t}-item-icon`]: { ...S() },
        [`&${t}-item-only-child`]: { [`> ${o}, > ${t}-item-icon`]: { marginInlineEnd: 0 } },
      },
      [`${t}-item-disabled, ${t}-submenu-disabled`]: {
        background: `none !important`,
        cursor: `not-allowed`,
        '&::after': { borderColor: `transparent !important` },
        a: { color: `inherit !important`, cursor: `not-allowed`, pointerEvents: `none` },
        [`> ${t}-submenu-title`]: { color: `inherit !important`, cursor: `not-allowed` },
      },
    }
  },
  Nt = (e) => {
    let { componentCls: t, motionDurationSlow: n, motionEaseInOut: r, borderRadius: a, menuArrowSize: o, menuArrowOffset: s } = e
    return {
      [`${t}-submenu`]: {
        '&-expand-icon, &-arrow': {
          position: `absolute`,
          top: `50%`,
          insetInlineEnd: e.margin,
          width: o,
          color: `currentcolor`,
          transform: `translateY(-50%)`,
          transition: [`transform`, `opacity`].map((e) => `${e} ${n}`).join(`,`),
        },
        '&-arrow': {
          '&::before, &::after': {
            position: `absolute`,
            width: e.calc(o).mul(0.6).equal(),
            height: e.calc(o).mul(0.15).equal(),
            backgroundColor: `currentcolor`,
            borderRadius: a,
            transition: [`background-color`, `transform`, `top`, `color`].map((e) => `${e} ${n} ${r}`).join(`,`),
            content: `""`,
          },
          '&::before': { transform: `rotate(45deg) translateY(${i(e.calc(s).mul(-1).equal())})` },
          '&::after': { transform: `rotate(-45deg) translateY(${i(s)})` },
        },
      },
    }
  },
  Pt = (e) => {
    let {
      antCls: t,
      componentCls: n,
      fontSize: r,
      motionDurationSlow: a,
      motionDurationMid: o,
      motionEaseInOut: s,
      paddingXS: c,
      padding: l,
      colorSplit: u,
      lineWidth: d,
      zIndexPopup: f,
      borderRadiusLG: p,
      subMenuItemBorderRadius: m,
      menuArrowSize: h,
      menuArrowOffset: g,
      lineType: _,
      groupTitleLineHeight: v,
      groupTitleFontSize: y,
    } = e
    return [
      { '': { [n]: { ...N(), '&-hidden': { display: `none` } } }, [`${n}-submenu-hidden`]: { display: `none` } },
      {
        [n]: {
          ...D(e),
          ...N(),
          marginBottom: 0,
          paddingInlineStart: 0,
          fontSize: r,
          lineHeight: 0,
          listStyle: `none`,
          outline: `none`,
          transition: `width ${a} cubic-bezier(0.2, 0, 0, 1) 0s`,
          'ul, ol': { margin: 0, padding: 0, listStyle: `none` },
          '&-overflow': { display: `flex`, [`${n}-item`]: { flex: `none` } },
          [`${n}-item, ${n}-submenu, ${n}-submenu-title`]: { borderRadius: e.itemBorderRadius },
          [`${n}-item-group-title`]: { padding: `${i(c)} ${i(l)}`, fontSize: y, lineHeight: v, transition: `all ${a}` },
          [`&-horizontal ${n}-submenu`]: { transition: [`border-color`, `background-color`].map((e) => `${e} ${a} ${s}`).join(`,`) },
          [`${n}-submenu, ${n}-submenu-inline`]: {
            transition: [`border-color ${a}`, `background-color ${a}`, `padding ${o}`].map((e) => `${e} ${s}`).join(`,`),
          },
          [`${n}-submenu ${n}-sub`]: { cursor: `initial`, transition: [`background-color`, `padding`].map((e) => `${e} ${a} ${s}`).join(`,`) },
          [`${n}-title-content`]: {
            transition: `color ${a}`,
            '&-with-extra': { display: `inline-flex`, alignItems: `center`, width: `100%` },
            [`> ${t}-typography-ellipsis-single-line`]: { display: `inline`, verticalAlign: `unset` },
            [`${n}-item-extra`]: { marginInlineStart: `auto`, paddingInlineStart: e.padding },
          },
          [`${n}-item a`]: { '&::before': { position: `absolute`, inset: 0, backgroundColor: `transparent`, content: `""` } },
          [`${n}-item-divider`]: {
            overflow: `hidden`,
            lineHeight: 0,
            borderColor: u,
            borderStyle: _,
            borderWidth: 0,
            borderTopWidth: d,
            marginBlock: d,
            padding: 0,
            '&-dashed': { borderStyle: `dashed` },
          },
          ...Mt(e),
          [`${n}-item-group`]: {
            [`${n}-item-group-list`]: { margin: 0, padding: 0, [`${n}-item, ${n}-submenu-title`]: { paddingInline: `${i(e.calc(r).mul(2).equal())} ${i(l)}` } },
          },
          '&-submenu': {
            '&-popup': {
              position: `absolute`,
              zIndex: f,
              borderRadius: p,
              boxShadow: `none`,
              transformOrigin: `0 0`,
              [`&${n}-submenu`]: { background: `transparent` },
              '&::before': { position: `absolute`, inset: 0, zIndex: -1, width: `100%`, height: `100%`, opacity: 0, content: `""` },
              [`> ${n}`]: {
                borderRadius: p,
                ...Mt(e),
                ...Nt(e),
                [`${n}-item, ${n}-submenu > ${n}-submenu-title`]: { borderRadius: m },
                [`${n}-submenu-title::after`]: { transition: `transform ${a} ${s}` },
              },
            },
            '&-placement-leftTop, &-placement-bottomRight': { transformOrigin: `100% 0` },
            '&-placement-leftBottom, &-placement-topRight': { transformOrigin: `100% 100%` },
            '&-placement-rightBottom, &-placement-topLeft': { transformOrigin: `0 100%` },
            '&-placement-bottomLeft, &-placement-rightTop': { transformOrigin: `0 0` },
            '&-placement-leftTop, &-placement-leftBottom': { paddingInlineEnd: e.paddingXS },
            '&-placement-rightTop, &-placement-rightBottom': { paddingInlineStart: e.paddingXS },
            '&-placement-topRight, &-placement-topLeft': { paddingBottom: e.paddingXS },
            '&-placement-bottomRight, &-placement-bottomLeft': { paddingTop: e.paddingXS },
          },
          ...Nt(e),
          [`&-inline-collapsed ${n}-submenu-arrow,
        &-inline ${n}-submenu-arrow`]: {
            '&::before': { transform: `rotate(-45deg) translateX(${i(g)})` },
            '&::after': { transform: `rotate(45deg) translateX(${i(e.calc(g).mul(-1).equal())})` },
          },
          [`${n}-submenu-open${n}-submenu-inline > ${n}-submenu-title > ${n}-submenu-arrow`]: {
            transform: `translateY(${i(e.calc(h).mul(0.2).mul(-1).equal())})`,
            '&::after': { transform: `rotate(-45deg) translateX(${i(e.calc(g).mul(-1).equal())})` },
            '&::before': { transform: `rotate(45deg) translateX(${i(g)})` },
          },
        },
      },
      { [`${t}-layout-header`]: { [n]: { lineHeight: `inherit` } } },
    ]
  },
  Ft = (e) => {
    let {
        colorPrimary: t,
        colorError: n,
        colorTextDisabled: r,
        colorErrorBg: i,
        colorText: a,
        colorTextDescription: o,
        colorBgContainer: c,
        colorFillAlter: l,
        colorFillContent: u,
        lineWidth: d,
        lineWidthBold: f,
        controlItemBgActive: p,
        colorBgTextHover: m,
        controlHeightLG: h,
        lineHeight: g,
        colorBgElevated: _,
        marginXXS: v,
        padding: y,
        fontSize: b,
        controlHeightSM: x,
        fontSizeLG: S,
        colorTextLightSolid: C,
        colorErrorHover: w,
      } = e,
      T = e.activeBarWidth ?? 0,
      E = e.activeBarBorderWidth ?? d,
      D = e.itemMarginInline ?? e.marginXXS,
      O = new s(C).setA(0.65).toRgbString()
    return {
      dropdownWidth: 160,
      zIndexPopup: e.zIndexPopupBase + 50,
      radiusItem: e.borderRadiusLG,
      itemBorderRadius: e.borderRadiusLG,
      radiusSubMenuItem: e.borderRadiusSM,
      subMenuItemBorderRadius: e.borderRadiusSM,
      colorItemText: a,
      itemColor: a,
      colorItemTextHover: a,
      itemHoverColor: a,
      colorItemTextHoverHorizontal: t,
      horizontalItemHoverColor: t,
      colorGroupTitle: o,
      groupTitleColor: o,
      colorItemTextSelected: t,
      itemSelectedColor: t,
      subMenuItemSelectedColor: t,
      colorItemTextSelectedHorizontal: t,
      horizontalItemSelectedColor: t,
      colorItemBg: c,
      itemBg: c,
      colorItemBgHover: m,
      itemHoverBg: m,
      colorItemBgActive: u,
      itemActiveBg: p,
      colorSubItemBg: l,
      subMenuItemBg: l,
      colorItemBgSelected: p,
      itemSelectedBg: p,
      colorItemBgSelectedHorizontal: `transparent`,
      horizontalItemSelectedBg: `transparent`,
      colorActiveBarWidth: 0,
      activeBarWidth: T,
      colorActiveBarHeight: f,
      activeBarHeight: f,
      colorActiveBarBorderSize: d,
      activeBarBorderWidth: E,
      colorItemTextDisabled: r,
      itemDisabledColor: r,
      colorDangerItemText: n,
      dangerItemColor: n,
      colorDangerItemTextHover: n,
      dangerItemHoverColor: n,
      colorDangerItemTextSelected: n,
      dangerItemSelectedColor: n,
      colorDangerItemBgActive: i,
      dangerItemActiveBg: i,
      colorDangerItemBgSelected: i,
      dangerItemSelectedBg: i,
      itemMarginInline: D,
      horizontalItemBorderRadius: 0,
      horizontalItemHoverBg: `transparent`,
      itemHeight: h,
      groupTitleLineHeight: g,
      collapsedWidth: h * 2,
      popupBg: _,
      itemMarginBlock: v,
      itemPaddingInline: y,
      horizontalLineHeight: `${h * 1.15}px`,
      iconSize: b,
      iconMarginInlineEnd: x - b,
      collapsedIconSize: S,
      groupTitleFontSize: b,
      darkItemDisabledColor: new s(C).setA(0.25).toRgbString(),
      darkItemColor: O,
      darkDangerItemColor: n,
      darkItemBg: `#001529`,
      darkPopupBg: `#001529`,
      darkSubMenuItemBg: `#000c17`,
      darkItemSelectedColor: C,
      darkItemSelectedBg: t,
      darkDangerItemSelectedBg: n,
      darkItemHoverBg: `transparent`,
      darkGroupTitleColor: O,
      darkItemHoverColor: C,
      darkDangerItemHoverColor: w,
      darkDangerItemSelectedColor: C,
      darkDangerItemActiveBg: n,
      itemWidth: T ? `calc(100% + ${E}px)` : `calc(100% - ${D * 2}px)`,
    }
  },
  It = (e, t = e, n = !0) =>
    g(
      `Menu`,
      (e) => {
        let {
            colorBgElevated: t,
            controlHeightLG: n,
            fontSize: r,
            darkItemColor: i,
            darkDangerItemColor: a,
            darkItemBg: s,
            darkSubMenuItemBg: c,
            darkItemSelectedColor: l,
            darkItemSelectedBg: u,
            darkDangerItemSelectedBg: d,
            darkItemHoverBg: f,
            darkGroupTitleColor: p,
            darkItemHoverColor: m,
            darkItemDisabledColor: h,
            darkDangerItemHoverColor: g,
            darkDangerItemSelectedColor: v,
            darkDangerItemActiveBg: y,
            popupBg: b,
            darkPopupBg: x,
          } = e,
          S = e.calc(r).div(7).mul(5).equal(),
          C = o(e, {
            menuArrowSize: S,
            menuHorizontalHeight: e.calc(n).mul(1.15).equal(),
            menuArrowOffset: e.calc(S).mul(0.25).equal(),
            menuSubMenuBg: t,
            calc: e.calc,
            popupBg: b,
          }),
          w = o(C, {
            itemColor: i,
            itemHoverColor: m,
            groupTitleColor: p,
            itemSelectedColor: l,
            subMenuItemSelectedColor: l,
            itemBg: s,
            popupBg: x,
            subMenuItemBg: c,
            itemActiveBg: `transparent`,
            itemSelectedBg: u,
            activeBarHeight: 0,
            activeBarBorderWidth: 0,
            itemHoverBg: f,
            itemDisabledColor: h,
            dangerItemColor: a,
            dangerItemHoverColor: g,
            dangerItemSelectedColor: v,
            dangerItemActiveBg: y,
            dangerItemSelectedBg: d,
            menuSubMenuBg: c,
            horizontalItemSelectedColor: l,
            horizontalItemSelectedBg: u,
          })
        return [Pt(C), Et(C), jt(C), kt(C, `light`), kt(w, `dark`), Dt(C), _(C), R(C, `slide-up`), R(C, `slide-down`), I(C, `zoom-big`)]
      },
      Ft,
      {
        deprecatedTokens: [
          [`colorGroupTitle`, `groupTitleColor`],
          [`radiusItem`, `itemBorderRadius`],
          [`radiusSubMenuItem`, `subMenuItemBorderRadius`],
          [`colorItemText`, `itemColor`],
          [`colorItemTextHover`, `itemHoverColor`],
          [`colorItemTextHoverHorizontal`, `horizontalItemHoverColor`],
          [`colorItemTextSelected`, `itemSelectedColor`],
          [`colorItemTextSelectedHorizontal`, `horizontalItemSelectedColor`],
          [`colorItemTextDisabled`, `itemDisabledColor`],
          [`colorDangerItemText`, `dangerItemColor`],
          [`colorDangerItemTextHover`, `dangerItemHoverColor`],
          [`colorDangerItemTextSelected`, `dangerItemSelectedColor`],
          [`colorDangerItemBgActive`, `dangerItemActiveBg`],
          [`colorDangerItemBgSelected`, `dangerItemSelectedBg`],
          [`colorItemBg`, `itemBg`],
          [`colorItemBgHover`, `itemHoverBg`],
          [`colorSubItemBg`, `subMenuItemBg`],
          [`colorItemBgActive`, `itemActiveBg`],
          [`colorItemBgSelectedHorizontal`, `horizontalItemSelectedBg`],
          [`colorActiveBarWidth`, `activeBarWidth`],
          [`colorActiveBarHeight`, `activeBarHeight`],
          [`colorActiveBarBorderSize`, `activeBarBorderWidth`],
          [`colorItemBgSelected`, `itemSelectedBg`],
        ],
        injectStyle: n,
        unitless: { groupTitleLineHeight: !0 },
      },
    )(e, t),
  Lt = (e) => {
    let { popupClassName: t, icon: n, title: r, theme: i } = e,
      a = V.useContext(xt),
      { prefixCls: o, inlineCollapsed: s, theme: c, classNames: l, styles: u } = a,
      d = ye(),
      f
    if (!n)
      f =
        s && !d.length && r && typeof r == `string`
          ? V.createElement(`div`, { className: `${o}-inline-collapsed-noicon` }, r.charAt(0))
          : V.createElement(`span`, { className: `${o}-title-content` }, r)
    else {
      let e = V.isValidElement(r) && r.type === `span`
      f = V.createElement(
        V.Fragment,
        null,
        w(n, (e) => ({ className: C(e.className, `${o}-item-icon`, l?.itemIcon), style: { ...e.style, ...u?.itemIcon } })),
        e ? r : V.createElement(`span`, { className: `${o}-title-content` }, r),
      )
    }
    let p = V.useMemo(() => ({ ...a, firstLevel: !1 }), [a]),
      [m] = L(`Menu`)
    return V.createElement(
      xt.Provider,
      { value: p },
      V.createElement(st, {
        ...T(e, [`icon`]),
        title: f,
        classNames: { list: l?.subMenu?.list, listTitle: l?.subMenu?.itemTitle },
        styles: { list: u?.subMenu?.list, listTitle: u?.subMenu?.itemTitle },
        popupClassName: C(o, t, l?.popup?.root, `${o}-${i || c}`),
        popupStyle: { zIndex: m, ...e.popupStyle, ...u?.popup?.root },
      }),
    )
  }
function Rt(e) {
  return e === null || e === !1
}
var zt = { item: Ct, submenu: Lt, divider: St },
  Bt = (0, V.forwardRef)((e, t) => {
    let r = V.useContext(wt),
      i = r || {},
      {
        prefixCls: a,
        className: o,
        style: s,
        theme: c = `light`,
        expandIcon: d,
        _internalDisableMenuItemTitleTooltip: f,
        tooltip: m,
        inlineCollapsed: h,
        siderCollapsed: g,
        rootClassName: _,
        mode: v,
        selectable: y,
        onClick: b,
        overflowedIndicatorPopupClassName: x,
        classNames: S,
        styles: E,
        ...D
      } = e,
      { menu: O } = V.useContext(n),
      { getPrefixCls: k, getPopupContainer: j, direction: M, className: N, style: ee, classNames: te, styles: ne } = A(`menu`),
      P = k(),
      re = T(D, [`collapsedWidth`])
    i.validator?.({ mode: v })
    let ie = l((...e) => {
        ;(b?.(...e), i.onClick?.())
      }),
      I = i.mode || v,
      L = y ?? i.selectable,
      R = h ?? g,
      z = { ...e, mode: I, inlineCollapsed: R, selectable: L, theme: c },
      [B, ae] = u([te, S], [ne, E], { props: z }, { popup: { _default: `root` }, subMenu: { _default: `item` } }),
      oe = { horizontal: { motionName: `${P}-slide-up` }, inline: p(P), other: { motionName: `${P}-zoom-big` } },
      H = k(`menu`, a || i.prefixCls),
      se = F(H),
      [U, W] = It(H, se, !r),
      ce = C(`${H}-${c}`, N, o),
      le = V.useMemo(() => {
        if (typeof d == `function` || Rt(d)) return d || null
        if (typeof i.expandIcon == `function` || Rt(i.expandIcon)) return i.expandIcon || null
        if (typeof O?.expandIcon == `function` || Rt(O?.expandIcon)) return O?.expandIcon || null
        let e = d ?? i?.expandIcon ?? O?.expandIcon
        return w(e, { className: C(`${H}-submenu-expand-icon`, V.isValidElement(e) ? e.props?.className : void 0) })
      }, [d, i?.expandIcon, O?.expandIcon, H]),
      ue = V.useMemo(
        () => ({
          prefixCls: H,
          inlineCollapsed: R || !1,
          direction: M,
          firstLevel: !0,
          theme: c,
          mode: I,
          disableMenuItemTitleTooltip: f,
          tooltip: m,
          classNames: B,
          styles: ae,
        }),
        [H, R, M, f, c, I, B, ae, m],
      )
    return V.createElement(
      wt.Provider,
      { value: null },
      V.createElement(
        xt.Provider,
        { value: ue },
        V.createElement(_t, {
          getPopupContainer: j,
          overflowedIndicator: V.createElement(bt, null),
          overflowedIndicatorPopupClassName: C(H, `${H}-${c}`, x),
          classNames: { list: B.list, listTitle: B.itemTitle },
          styles: { list: ae.list, listTitle: ae.itemTitle },
          mode: I,
          selectable: L,
          onClick: ie,
          ...re,
          inlineCollapsed: R,
          style: { ...ae.root, ...ee, ...s },
          className: ce,
          prefixCls: H,
          direction: M,
          defaultMotions: oe,
          expandIcon: le,
          ref: t,
          rootClassName: C(_, U, i.rootClassName, W, se, B.root),
          _internalComponents: zt,
        }),
      ),
    )
  }),
  Vt = (0, V.forwardRef)((e, t) => {
    let n = (0, V.useRef)(null),
      r = V.useContext(z)
    return (
      (0, V.useImperativeHandle)(t, () => ({
        menu: n.current,
        focus: (e) => {
          n.current?.focus(e)
        },
      })),
      V.createElement(Bt, { ref: n, ...e, ...r })
    )
  })
;((Vt.Item = Ct), (Vt.SubMenu = Lt), (Vt.Divider = St), (Vt.ItemGroup = dt))
export { Je as a, _t as i, Tt as n, ue as o, bt as r, Vt as t }
