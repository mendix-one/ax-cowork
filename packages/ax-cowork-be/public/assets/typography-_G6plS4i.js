import { a as e, n as t } from './jsx-runtime-B6doAwFl.js'
import {
  $t as n,
  A as r,
  B as i,
  Bt as a,
  C as o,
  Dn as s,
  Et as c,
  F as l,
  Ft as u,
  G as d,
  Gt as f,
  H as p,
  Ht as m,
  It as h,
  Jt as g,
  K as _,
  Kt as v,
  L as y,
  Lt as b,
  M as x,
  Mt as S,
  Nt as C,
  O as w,
  P as T,
  Q as E,
  Rt as D,
  Sn as O,
  Tn as k,
  U as A,
  Ut as j,
  V as M,
  Vt as N,
  W as P,
  X as ee,
  Zt as F,
  _t as I,
  a as L,
  an as te,
  at as ne,
  bn as re,
  cn as R,
  ct as z,
  dn as ie,
  dt as B,
  en as ae,
  et as oe,
  fn as V,
  ft as se,
  g as ce,
  h as le,
  in as H,
  it as ue,
  j as de,
  jt as fe,
  ln as pe,
  lt as U,
  m as W,
  mn as me,
  mt as G,
  nn as he,
  nt as K,
  ot as q,
  p as ge,
  pn as J,
  pt as _e,
  r as ve,
  rn as ye,
  rt as be,
  sn as xe,
  st as Se,
  tn as Ce,
  un as we,
  ut as Te,
  w as Ee,
  wn as De,
  y as Oe,
  z as ke,
  zt as Ae,
} from './button-BU_eysIT.js'
function je(e, t) {
  return fe.reduce((n, r) => {
    let i = e[`${r}1`],
      a = e[`${r}3`],
      o = e[`${r}6`],
      s = e[`${r}7`]
    return { ...n, ...t(r, { lightColor: i, lightBorderColor: a, darkColor: o, textColor: s }) }
  }, {})
}
var Y = e(t()),
  Me = {
    icon: {
      tag: `svg`,
      attrs: { 'fill-rule': `evenodd`, viewBox: `64 64 896 896`, focusable: `false` },
      children: [
        {
          tag: `path`,
          attrs: {
            d: `M799.86 166.31c.02 0 .04.02.08.06l57.69 57.7c.04.03.05.05.06.08a.12.12 0 010 .06c0 .03-.02.05-.06.09L569.93 512l287.7 287.7c.04.04.05.06.06.09a.12.12 0 010 .07c0 .02-.02.04-.06.08l-57.7 57.69c-.03.04-.05.05-.07.06a.12.12 0 01-.07 0c-.03 0-.05-.02-.09-.06L512 569.93l-287.7 287.7c-.04.04-.06.05-.09.06a.12.12 0 01-.07 0c-.02 0-.04-.02-.08-.06l-57.69-57.7c-.04-.03-.05-.05-.06-.07a.12.12 0 010-.07c0-.03.02-.05.06-.09L454.07 512l-287.7-287.7c-.04-.04-.05-.06-.06-.09a.12.12 0 010-.07c0-.02.02-.04.06-.08l57.7-57.69c.03-.04.05-.05.07-.06a.12.12 0 01.07 0c.03 0 .05.02.09.06L512 454.07l287.7-287.7c.04-.04.06-.05.09-.06a.12.12 0 01.07 0z`,
          },
        },
      ],
    },
    name: `close`,
    theme: `outlined`,
  }
function Ne() {
  return (
    (Ne = Object.assign
      ? Object.assign.bind()
      : function (e) {
          for (var t = 1; t < arguments.length; t++) {
            var n = arguments[t]
            for (var r in n) Object.prototype.hasOwnProperty.call(n, r) && (e[r] = n[r])
          }
          return e
        }),
    Ne.apply(this, arguments)
  )
}
var Pe = Y.forwardRef((e, t) => Y.createElement(q, Ne({}, e, { ref: t, icon: Me }))),
  Fe = e(s()),
  Ie = {
    icon: {
      tag: `svg`,
      attrs: { viewBox: `64 64 896 896`, focusable: `false` },
      children: [
        {
          tag: `path`,
          attrs: {
            d: `M512 64C264.6 64 64 264.6 64 512s200.6 448 448 448 448-200.6 448-448S759.4 64 512 64zm32 664c0 4.4-3.6 8-8 8h-48c-4.4 0-8-3.6-8-8V456c0-4.4 3.6-8 8-8h48c4.4 0 8 3.6 8 8v272zm-32-344a48.01 48.01 0 010-96 48.01 48.01 0 010 96z`,
          },
        },
      ],
    },
    name: `info-circle`,
    theme: `filled`,
  }
function Le() {
  return (
    (Le = Object.assign
      ? Object.assign.bind()
      : function (e) {
          for (var t = 1; t < arguments.length; t++) {
            var n = arguments[t]
            for (var r in n) Object.prototype.hasOwnProperty.call(n, r) && (e[r] = n[r])
          }
          return e
        }),
    Le.apply(this, arguments)
  )
}
var Re = Y.forwardRef((e, t) => Y.createElement(q, Le({}, e, { ref: t, icon: Ie })))
function ze(...e) {
  let t = {}
  return (
    e.forEach((e) => {
      e &&
        Object.keys(e).forEach((n) => {
          e[n] !== void 0 && (t[n] = e[n])
        })
    }),
    t
  )
}
var Be = (e) => {
    if (!e) return
    let { closable: t, closeIcon: n } = e
    return { closable: t, closeIcon: n }
  },
  Ve = {},
  He = (e, t) => {
    if (!e && (e === !1 || t === !1 || t === null)) return !1
    if (e === void 0 && t === void 0) return null
    let n = { closeIcon: typeof t != `boolean` && t !== null ? t : void 0 }
    return (_(e) && (n = { ...n, ...e }), n)
  },
  Ue = (e, t, n) => (e === !1 ? !1 : e ? ze(n, t, e) : t === !1 ? !1 : t ? ze(n, t) : n.closable ? n : !1),
  We = (e, t, n) => {
    let { closeIconRender: r } = t,
      { closeIcon: i, ...a } = e,
      o = i,
      s = oe(a, !0)
    return (
      P(o) &&
        (r && (o = r(o)),
        (o = Y.isValidElement(o) ? Y.cloneElement(o, { 'aria-label': n, ...o.props, ...s }) : Y.createElement(`span`, { 'aria-label': n, ...s }, o))),
      [o, s]
    )
  },
  Ge = (e, t, n = Ve, r = `Close`) => {
    let i = He(e?.closable, e?.closeIcon),
      a = He(t?.closable, t?.closeIcon),
      o = { closeIcon: Y.createElement(Pe, null), ...n },
      s = Ue(i, a, o),
      c = typeof s == `boolean` ? !1 : !!s?.disabled
    if (s === !1) return [!1, null, c, {}]
    let [l, u] = We(s, o, r)
    return [!0, l, c, u]
  },
  Ke = (e, t, n = Ve) => {
    let [r] = ee(`global`, E.global)
    return Y.useMemo(() => Ge(e, t, { closeIcon: Y.createElement(Pe, null), ...n }, r.close), [e, t, n, r.close])
  },
  qe = Y.createContext(void 0),
  Je = 100,
  Ye = Je * 10
Ye + Je
var Xe = { Modal: Je, Drawer: Je, Popover: Je, Popconfirm: Je, Tooltip: Je, Tour: Je, FloatButton: Je },
  Ze = { SelectLike: 50, Dropdown: 50, DatePicker: 50, Menu: 50, ImagePreview: 1 },
  Qe = (e) => e in Xe,
  $e = (e, t) => {
    let [, n] = I(),
      r = Y.useContext(qe),
      i = Qe(e),
      a
    if (t !== void 0) a = [t, t]
    else {
      let o = r ?? 0
      ;(i ? (o += (r ? 0 : n.zIndexPopupBase) + Xe[e]) : (o += Ze[e]), (a = [r === void 0 ? t : o, o]))
    }
    return a
  },
  et = (e) => `${e}-css-var`
function tt() {
  return (
    (tt = Object.assign
      ? Object.assign.bind()
      : function (e) {
          for (var t = 1; t < arguments.length; t++) {
            var n = arguments[t]
            for (var r in n) Object.prototype.hasOwnProperty.call(n, r) && (e[r] = n[r])
          }
          return e
        }),
    tt.apply(this, arguments)
  )
}
var nt = Y.forwardRef((e, t) => {
    let {
        prefixCls: n,
        style: r,
        className: i,
        duration: a = 4.5,
        showProgress: o,
        pauseOnHover: s = !0,
        eventKey: c,
        content: l,
        closable: u,
        props: d,
        onClick: f,
        onNoticeClose: p,
        times: m,
        hovering: h,
      } = e,
      [g, _] = Y.useState(!1),
      [v, y] = Y.useState(0),
      [b, x] = Y.useState(0),
      S = h || g,
      C = typeof a == `number` ? a : 0,
      w = C > 0 && o,
      T = () => {
        p(c)
      },
      E = (e) => {
        ;(e.key === `Enter` || e.code === `Enter` || e.keyCode === Ee.ENTER) && T()
      }
    ;(Y.useEffect(() => {
      if (!S && C > 0) {
        let e = Date.now() - b,
          t = setTimeout(
            () => {
              T()
            },
            C * 1e3 - b,
          )
        return () => {
          ;(s && clearTimeout(t), x(Date.now() - e))
        }
      }
    }, [C, S, m]),
      Y.useEffect(() => {
        if (!S && w && (s || b === 0)) {
          let e = performance.now(),
            t,
            n = () => {
              ;(cancelAnimationFrame(t),
                (t = requestAnimationFrame((t) => {
                  let r = t + b - e,
                    i = Math.min(r / (C * 1e3), 1)
                  ;(y(i * 100), i < 1 && n())
                })))
            }
          return (
            n(),
            () => {
              s && cancelAnimationFrame(t)
            }
          )
        }
      }, [C, b, S, w, m]))
    let D = Y.useMemo(() => (typeof u == `object` && u ? u : {}), [u]),
      O = oe(D, !0),
      k = 100 - (!v || v < 0 ? 0 : v > 100 ? 100 : v),
      A = `${n}-notice`
    return Y.createElement(
      `div`,
      tt({}, d, {
        ref: t,
        className: H(A, i, { [`${A}-closable`]: u }),
        style: r,
        onMouseEnter: (e) => {
          ;(_(!0), d?.onMouseEnter?.(e))
        },
        onMouseLeave: (e) => {
          ;(_(!1), d?.onMouseLeave?.(e))
        },
        onClick: f,
      }),
      Y.createElement(`div`, { className: `${A}-content` }, l),
      u &&
        Y.createElement(
          `button`,
          tt({ className: `${A}-close`, onKeyDown: E, 'aria-label': `Close` }, O, {
            onClick: (e) => {
              ;(e.preventDefault(), e.stopPropagation(), T())
            },
          }),
          D.closeIcon ?? `x`,
        ),
      w && Y.createElement(`progress`, { className: `${A}-progress`, max: `100`, value: k }, k + `%`),
    )
  }),
  rt = Y.createContext({}),
  it = ({ children: e, classNames: t }) => Y.createElement(rt.Provider, { value: { classNames: t } }, e),
  at = 8,
  ot = 3,
  st = 16,
  ct = (e) => {
    let t = { offset: at, threshold: ot, gap: st }
    return (e && typeof e == `object` && ((t.offset = e.offset ?? at), (t.threshold = e.threshold ?? ot), (t.gap = e.gap ?? st)), [!!e, t])
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
var ut = (e) => {
    let { configList: t, placement: n, prefixCls: r, className: i, style: a, motion: o, onAllNoticeRemoved: s, onNoticeClose: c, stack: l } = e,
      { classNames: u } = (0, Y.useContext)(rt),
      d = (0, Y.useRef)({}),
      [f, p] = (0, Y.useState)(null),
      [m, h] = (0, Y.useState)([]),
      g = t.map((e) => ({ config: e, key: String(e.key) })),
      [_, { offset: v, threshold: y, gap: b }] = ct(l),
      x = _ && (m.length > 0 || g.length <= y),
      S = typeof o == `function` ? o(n) : o
    return (
      (0, Y.useEffect)(() => {
        _ && m.length > 1 && h((e) => e.filter((e) => g.some(({ key: t }) => e === t)))
      }, [m, g, _]),
      (0, Y.useEffect)(() => {
        _ && d.current[g[g.length - 1]?.key] && p(d.current[g[g.length - 1]?.key])
      }, [g, _]),
      Y.createElement(
        K,
        lt({ key: n, className: H(r, `${r}-${n}`, u?.list, i, { [`${r}-stack`]: !!_, [`${r}-stack-expanded`]: x }), style: a, keys: g, motionAppear: !0 }, S, {
          onAllRemoved: () => {
            s(n)
          },
        }),
        ({ config: e, className: t, style: i, index: a }, o) => {
          let { key: s, times: l } = e,
            p = String(s),
            { className: y, style: S, classNames: C, styles: w, ...T } = e,
            E = g.findIndex((e) => e.key === p),
            D = {}
          if (_) {
            let e = g.length - 1 - (E > -1 ? E : a - 1),
              t = n === `top` || n === `bottom` ? `-50%` : `0`
            if (e > 0) {
              D.height = x ? d.current[p]?.offsetHeight : f?.offsetHeight
              let r = 0
              for (let t = 0; t < e; t++) r += d.current[g[g.length - 1 - t].key]?.offsetHeight + b
              D.transform = `translate3d(${t}, ${(x ? r : e * v) * (n.startsWith(`top`) ? 1 : -1)}px, 0) scaleX(${!x && f?.offsetWidth && d.current[p]?.offsetWidth ? (f?.offsetWidth - v * 2 * (e < 3 ? e : 3)) / d.current[p]?.offsetWidth : 1})`
            } else D.transform = `translate3d(${t}, 0, 0)`
          }
          return Y.createElement(
            `div`,
            {
              ref: o,
              className: H(`${r}-notice-wrapper`, t, C?.wrapper),
              style: { ...i, ...D, ...w?.wrapper },
              onMouseEnter: () => h((e) => (e.includes(p) ? e : [...e, p])),
              onMouseLeave: () => h((e) => e.filter((e) => e !== p)),
            },
            Y.createElement(
              nt,
              lt({}, T, {
                ref: (e) => {
                  E > -1 ? (d.current[p] = e) : delete d.current[p]
                },
                prefixCls: r,
                classNames: C,
                styles: w,
                className: H(y, u?.notice),
                style: S,
                times: l,
                key: s,
                eventKey: s,
                onNoticeClose: c,
                hovering: _ && m.length > 0,
              }),
            ),
          )
        },
      )
    )
  },
  dt = Y.forwardRef((e, t) => {
    let {
        prefixCls: n = `rc-notification`,
        container: r,
        motion: i,
        maxCount: a,
        className: o,
        style: s,
        onAllRemoved: c,
        stack: l,
        renderNotifications: u,
      } = e,
      [d, f] = Y.useState([]),
      p = (e) => {
        let t = d.find((t) => t.key === e),
          n = t?.closable,
          { onClose: r } = n && typeof n == `object` ? n : {}
        ;(r?.(), t?.onClose?.(), f((t) => t.filter((t) => t.key !== e)))
      }
    Y.useImperativeHandle(t, () => ({
      open: (e) => {
        f((t) => {
          let n = [...t],
            r = n.findIndex((t) => t.key === e.key),
            i = { ...e }
          return (r >= 0 ? ((i.times = (t[r]?.times || 0) + 1), (n[r] = i)) : ((i.times = 0), n.push(i)), a > 0 && n.length > a && (n = n.slice(-a)), n)
        })
      },
      close: (e) => {
        p(e)
      },
      destroy: () => {
        f([])
      },
    }))
    let [m, h] = Y.useState({})
    Y.useEffect(() => {
      let e = {}
      ;(d.forEach((t) => {
        let { placement: n = `topRight` } = t
        n && ((e[n] = e[n] || []), e[n].push(t))
      }),
        Object.keys(m).forEach((t) => {
          e[t] = e[t] || []
        }),
        h(e))
    }, [d])
    let g = (e) => {
        h((t) => {
          let n = { ...t }
          return ((n[e] || []).length || delete n[e], n)
        })
      },
      _ = Y.useRef(!1)
    if (
      (Y.useEffect(() => {
        Object.keys(m).length > 0 ? (_.current = !0) : (_.current &&= (c?.(), !1))
      }, [m]),
      !r)
    )
      return null
    let v = Object.keys(m)
    return (0, Fe.createPortal)(
      Y.createElement(
        Y.Fragment,
        null,
        v.map((e) => {
          let t = m[e],
            r = Y.createElement(ut, {
              key: e,
              configList: t,
              placement: e,
              prefixCls: n,
              className: o?.(e),
              style: s?.(e),
              motion: i,
              onNoticeClose: p,
              onAllNoticeRemoved: g,
              stack: l,
            })
          return u ? u(r, { prefixCls: n, key: e }) : r
        }),
      ),
      r,
    )
  }),
  ft = () => document.body,
  pt = 0
function mt(...e) {
  let t = {}
  return (
    e.forEach((e) => {
      e &&
        Object.keys(e).forEach((n) => {
          let r = e[n]
          r !== void 0 && (t[n] = r)
        })
    }),
    t
  )
}
function ht(e = {}) {
  let { getContainer: t = ft, motion: n, prefixCls: r, maxCount: i, className: a, style: o, onAllRemoved: s, stack: c, renderNotifications: l, ...u } = e,
    [d, f] = Y.useState(),
    p = Y.useRef(),
    m = Y.createElement(dt, {
      container: d,
      ref: p,
      prefixCls: r,
      motion: n,
      maxCount: i,
      className: a,
      style: o,
      onAllRemoved: s,
      stack: c,
      renderNotifications: l,
    }),
    [h, g] = Y.useState([]),
    _ = k((e) => {
      let t = mt(u, e)
      ;((t.key === null || t.key === void 0) && ((t.key = `rc-notification-${pt}`), (pt += 1)), g((e) => [...e, { type: `open`, config: t }]))
    }),
    v = Y.useMemo(
      () => ({
        open: _,
        close: (e) => {
          g((t) => [...t, { type: `close`, key: e }])
        },
        destroy: () => {
          g((e) => [...e, { type: `destroy` }])
        },
      }),
      [],
    )
  return (
    Y.useEffect(() => {
      f(t())
    }),
    Y.useEffect(() => {
      if (p.current && h.length) {
        h.forEach((e) => {
          switch (e.type) {
            case `open`:
              p.current.open(e.config)
              break
            case `close`:
              p.current.close(e.key)
              break
            case `destroy`:
              p.current.destroy()
              break
          }
        })
        let e, t
        g((n) => ((e !== n || !t) && ((e = n), (t = n.filter((e) => !h.includes(e)))), t))
      }
    }, [h]),
    [v, m]
  )
}
var gt = (e) => ({ animationDuration: e, animationFillMode: `both` }),
  _t = (e, t, n, r, i = !1) => {
    let a = i ? `&` : ``
    return {
      [`
      ${a}${e}-enter,
      ${a}${e}-appear
    `]: { ...gt(r), animationPlayState: `paused` },
      [`${a}${e}-leave`]: { ...gt(r), animationPlayState: `paused` },
      [`
      ${a}${e}-enter${e}-enter-active,
      ${a}${e}-appear${e}-appear-active
    `]: { animationName: t, animationPlayState: `running` },
      [`${a}${e}-leave${e}-leave-active`]: { animationName: n, animationPlayState: `running`, pointerEvents: `none` },
    }
  },
  vt = new v(`antFadeIn`, { '0%': { opacity: 0 }, '100%': { opacity: 1 } }),
  yt = new v(`antFadeOut`, { '0%': { opacity: 1 }, '100%': { opacity: 0 } }),
  bt = (e, t = !1) => {
    let { antCls: n } = e,
      r = `${n}-fade`,
      i = t ? `&` : ``
    return [
      _t(r, vt, yt, e.motionDurationMid, t),
      {
        [`
        ${i}${r}-enter,
        ${i}${r}-appear
      `]: { opacity: 0, animationTimingFunction: `linear` },
        [`${i}${r}-leave`]: { animationTimingFunction: `linear` },
      },
    ]
  },
  xt = new v(`antZoomIn`, { '0%': { transform: `scale(0.2)`, opacity: 0 }, '100%': { transform: `scale(1)`, opacity: 1 } }),
  St = new v(`antZoomOut`, { '0%': { transform: `scale(1)` }, '100%': { transform: `scale(0.2)`, opacity: 0 } }),
  Ct = new v(`antZoomBigIn`, { '0%': { transform: `scale(0.8)`, opacity: 0 }, '100%': { transform: `scale(1)`, opacity: 1 } }),
  wt = new v(`antZoomBigOut`, { '0%': { transform: `scale(1)` }, '100%': { transform: `scale(0.8)`, opacity: 0 } }),
  Tt = new v(`antZoomUpIn`, {
    '0%': { transform: `scale(0.8)`, transformOrigin: `50% 0%`, opacity: 0 },
    '100%': { transform: `scale(1)`, transformOrigin: `50% 0%` },
  }),
  Et = new v(`antZoomUpOut`, {
    '0%': { transform: `scale(1)`, transformOrigin: `50% 0%` },
    '100%': { transform: `scale(0.8)`, transformOrigin: `50% 0%`, opacity: 0 },
  }),
  Dt = new v(`antZoomLeftIn`, {
    '0%': { transform: `scale(0.8)`, transformOrigin: `0% 50%`, opacity: 0 },
    '100%': { transform: `scale(1)`, transformOrigin: `0% 50%` },
  }),
  Ot = new v(`antZoomLeftOut`, {
    '0%': { transform: `scale(1)`, transformOrigin: `0% 50%` },
    '100%': { transform: `scale(0.8)`, transformOrigin: `0% 50%`, opacity: 0 },
  }),
  kt = new v(`antZoomRightIn`, {
    '0%': { transform: `scale(0.8)`, transformOrigin: `100% 50%`, opacity: 0 },
    '100%': { transform: `scale(1)`, transformOrigin: `100% 50%` },
  }),
  At = new v(`antZoomRightOut`, {
    '0%': { transform: `scale(1)`, transformOrigin: `100% 50%` },
    '100%': { transform: `scale(0.8)`, transformOrigin: `100% 50%`, opacity: 0 },
  }),
  jt = new v(`antZoomDownIn`, {
    '0%': { transform: `scale(0.8)`, transformOrigin: `50% 100%`, opacity: 0 },
    '100%': { transform: `scale(1)`, transformOrigin: `50% 100%` },
  }),
  Mt = new v(`antZoomDownOut`, {
    '0%': { transform: `scale(1)`, transformOrigin: `50% 100%` },
    '100%': { transform: `scale(0.8)`, transformOrigin: `50% 100%`, opacity: 0 },
  }),
  Nt = {
    zoom: { inKeyframes: xt, outKeyframes: St },
    'zoom-big': { inKeyframes: Ct, outKeyframes: wt },
    'zoom-big-fast': { inKeyframes: Ct, outKeyframes: wt },
    'zoom-left': { inKeyframes: Dt, outKeyframes: Ot },
    'zoom-right': { inKeyframes: kt, outKeyframes: At },
    'zoom-up': { inKeyframes: Tt, outKeyframes: Et },
    'zoom-down': { inKeyframes: jt, outKeyframes: Mt },
  },
  Pt = (e, t) => {
    let { antCls: n } = e,
      r = `${n}-${t}`,
      { inKeyframes: i, outKeyframes: a } = Nt[t]
    return [
      _t(r, i, a, t === `zoom-big-fast` ? e.motionDurationFast : e.motionDurationMid),
      {
        [`
        ${r}-enter,
        ${r}-appear
      `]: { transform: `scale(0)`, opacity: 0, animationTimingFunction: e.motionEaseOutCirc, '&-prepare': { transform: `none` } },
        [`${r}-leave`]: { animationTimingFunction: e.motionEaseInOutCirc },
      },
    ]
  }
function Ft(e, t = !1) {
  if (l(e)) {
    let n = e.nodeName.toLowerCase(),
      r = [`input`, `select`, `textarea`, `button`].includes(n) || e.isContentEditable || (n === `a` && !!e.getAttribute(`href`)),
      i = e.getAttribute(`tabindex`),
      a = Number(i),
      o = null
    return (i && !Number.isNaN(a) ? (o = a) : r && o === null && (o = 0), r && e.disabled && (o = null), o !== null && (o >= 0 || (t && o < 0)))
  }
  return !1
}
function It(e, t = !1) {
  let n = [...e.querySelectorAll(`*`)].filter((e) => Ft(e, t))
  return (Ft(e, t) && n.unshift(e), n)
}
function Lt(e, t) {
  if (!e) return
  e.focus(t)
  let { cursor: n } = t || {}
  if (n && (e instanceof HTMLInputElement || e instanceof HTMLTextAreaElement)) {
    let t = e.value.length
    switch (n) {
      case `start`:
        e.setSelectionRange(0, 0)
        break
      case `end`:
        e.setSelectionRange(t, t)
        break
      default:
        e.setSelectionRange(0, t)
    }
  }
}
var Rt = null,
  zt = [],
  Bt = new Map(),
  Vt = new Map()
function Ht() {
  return zt[zt.length - 1]
}
function Ut(e) {
  let t = Ht()
  if (e && t) {
    let n
    for (let [e, r] of Bt.entries())
      if (r === t) {
        n = e
        break
      }
    let r = Vt.get(n)
    return !!r && (r === e || r.contains(e))
  }
  return !1
}
function Wt(e) {
  let { activeElement: t } = document
  return e === t || e.contains(t)
}
function Gt() {
  let e = Ht(),
    { activeElement: t } = document
  if (!Ut(t))
    if (e && !Wt(e)) {
      let t = It(e)
      ;(t.includes(Rt) ? Rt : t[0])?.focus({ preventScroll: !0 })
    } else Rt = t
}
function Kt(e) {
  if (e.key === `Tab`) {
    let { activeElement: t } = document,
      n = It(Ht()),
      r = n[n.length - 1]
    e.shiftKey && t === n[0] ? (Rt = r) : !e.shiftKey && t === r && (Rt = n[0])
  }
}
function qt(e, t) {
  return (
    e && (Bt.set(t, e), (zt = zt.filter((t) => t !== e)), zt.push(e), window.addEventListener(`focusin`, Gt), window.addEventListener(`keydown`, Kt, !0), Gt()),
    () => {
      ;((Rt = null),
        (zt = zt.filter((t) => t !== e)),
        Bt.delete(t),
        Vt.delete(t),
        zt.length === 0 && (window.removeEventListener(`focusin`, Gt), window.removeEventListener(`keydown`, Kt, !0)))
    }
  )
}
function Jt(e, t) {
  let n = (0, Y.useRef)(0),
    [r, i] = (0, Y.useState)(0)
  ;((0, Y.useEffect)(() => {
    n.current = 0
  }, t),
    (0, Y.useEffect)(() => {
      let [t, r] = e(n.current)
      return (r || ((n.current += 1), i((e) => e + 1)), t)
    }, [...t, r]))
}
function Yt(e, t) {
  let n = y(),
    r = (0, Y.useRef)(t)
  return (
    (r.current = t),
    Jt(
      (t) => {
        if (!e) return [void 0, !0]
        let i = r.current()
        return i ? [qt(i, n), !0] : [void 0, t >= 1]
      },
      [n, e],
    ),
    [
      (e) => {
        e && Vt.set(n, e)
      },
    ]
  )
}
var Xt = `RC_FORM_INTERNAL_HOOKS`,
  X = () => {
    we(!1, `Can not find FormContext. Please make sure you wrap Field under Form.`)
  },
  Zt = Y.createContext({
    getFieldValue: X,
    getFieldsValue: X,
    getFieldError: X,
    getFieldWarning: X,
    getFieldsError: X,
    isFieldsTouched: X,
    isFieldTouched: X,
    isFieldValidating: X,
    isFieldsValidating: X,
    resetFields: X,
    setFields: X,
    setFieldValue: X,
    setFieldsValue: X,
    validateFields: X,
    submit: X,
    getInternalHooks: () => (
      X(),
      {
        dispatch: X,
        initEntityValue: X,
        registerField: X,
        useSubscribe: X,
        setInitialValues: X,
        destroyForm: X,
        setCallbacks: X,
        registerWatch: X,
        getFields: X,
        setValidateMessages: X,
        setPreserve: X,
        getInitialValue: X,
      }
    ),
  }),
  Qt = Y.createContext(null)
function $t(e) {
  return e == null ? [] : Array.isArray(e) ? e : [e]
}
function en(e) {
  return e && !!e._init
}
function tn() {
  return {
    default: `Validation error on field %s`,
    required: `%s is required`,
    enum: `%s must be one of %s`,
    whitespace: `%s cannot be empty`,
    date: { format: `%s date %s is invalid for format %s`, parse: `%s date could not be parsed, %s is invalid `, invalid: `%s date %s is invalid` },
    types: {
      string: `%s is not a %s`,
      method: `%s is not a %s (function)`,
      array: `%s is not an %s`,
      object: `%s is not an %s`,
      number: `%s is not a %s`,
      date: `%s is not a %s`,
      boolean: `%s is not a %s`,
      integer: `%s is not an %s`,
      float: `%s is not a %s`,
      regexp: `%s is not a valid %s`,
      email: `%s is not a valid %s`,
      tel: `%s is not a valid %s`,
      url: `%s is not a valid %s`,
      hex: `%s is not a valid %s`,
    },
    string: {
      len: `%s must be exactly %s characters`,
      min: `%s must be at least %s characters`,
      max: `%s cannot be longer than %s characters`,
      range: `%s must be between %s and %s characters`,
    },
    number: { len: `%s must equal %s`, min: `%s cannot be less than %s`, max: `%s cannot be greater than %s`, range: `%s must be between %s and %s` },
    array: {
      len: `%s must be exactly %s in length`,
      min: `%s cannot be less than %s in length`,
      max: `%s cannot be greater than %s in length`,
      range: `%s must be between %s and %s in length`,
    },
    pattern: { mismatch: `%s value %s does not match pattern %s` },
    clone: function () {
      var e = JSON.parse(JSON.stringify(this))
      return ((e.clone = this.clone), e)
    },
  }
}
var nn = tn()
function rn(e) {
  try {
    return Function.toString.call(e).indexOf(`[native code]`) !== -1
  } catch {
    return typeof e == `function`
  }
}
function an(e, t, n) {
  if (u()) return Reflect.construct.apply(null, arguments)
  var r = [null]
  r.push.apply(r, t)
  var i = new (e.bind.apply(e, r))()
  return (n && D(i, n.prototype), i)
}
function on(e) {
  var t = typeof Map == `function` ? new Map() : void 0
  return (
    (on = function (e) {
      if (e === null || !rn(e)) return e
      if (typeof e != `function`) throw TypeError(`Super expression must either be null or a function`)
      if (t !== void 0) {
        if (t.has(e)) return t.get(e)
        t.set(e, n)
      }
      function n() {
        return an(e, arguments, h(this).constructor)
      }
      return ((n.prototype = Object.create(e.prototype, { constructor: { value: n, enumerable: !1, writable: !0, configurable: !0 } })), D(n, e))
    }),
    on(e)
  )
}
var sn = /%[sdj%]/g,
  cn = function () {}
function ln(e) {
  if (!e || !e.length) return null
  var t = {}
  return (
    e.forEach(function (e) {
      var n = e.field
      ;((t[n] = t[n] || []), t[n].push(e))
    }),
    t
  )
}
function un(e) {
  var t = [...arguments].slice(1),
    n = 0,
    r = t.length
  return typeof e == `function`
    ? e.apply(null, t)
    : typeof e == `string`
      ? e.replace(sn, function (e) {
          if (e === `%%`) return `%`
          if (n >= r) return e
          switch (e) {
            case `%s`:
              return String(t[n++])
            case `%d`:
              return Number(t[n++])
            case `%j`:
              try {
                return JSON.stringify(t[n++])
              } catch {
                return `[Circular]`
              }
              break
            default:
              return e
          }
        })
      : e
}
function dn(e) {
  return e === `string` || e === `url` || e === `hex` || e === `email` || e === `date` || e === `pattern` || e === `tel`
}
function Z(e, t) {
  return !!(e == null || (t === `array` && Array.isArray(e) && !e.length) || (dn(t) && typeof e == `string` && !e))
}
function fn(e, t, n) {
  var r = [],
    i = 0,
    a = e.length
  function o(e) {
    ;(r.push.apply(r, ye(e || [])), i++, i === a && n(r))
  }
  e.forEach(function (e) {
    t(e, o)
  })
}
function pn(e, t, n) {
  var r = 0,
    i = e.length
  function a(o) {
    if (o && o.length) {
      n(o)
      return
    }
    var s = r
    ;((r += 1), s < i ? t(e[s], a) : n([]))
  }
  a([])
}
function mn(e) {
  var t = []
  return (
    Object.keys(e).forEach(function (n) {
      t.push.apply(t, ye(e[n] || []))
    }),
    t
  )
}
var hn = (function (e) {
  b(n, e)
  var t = C(n)
  function n(e, r) {
    var i
    return (N(this, n), (i = t.call(this, `Async Validation Error`)), j(Ae(i), `errors`, void 0), j(Ae(i), `fields`, void 0), (i.errors = e), (i.fields = r), i)
  }
  return a(n)
})(on(Error))
function gn(e, t, n, r, i) {
  if (t.first) {
    var a = new Promise(function (t, a) {
      pn(mn(e), n, function (e) {
        return (r(e), e.length ? a(new hn(e, ln(e))) : t(i))
      })
    })
    return (
      a.catch(function (e) {
        return e
      }),
      a
    )
  }
  var o = t.firstFields === !0 ? Object.keys(e) : t.firstFields || [],
    s = Object.keys(e),
    c = s.length,
    l = 0,
    u = [],
    d = new Promise(function (t, a) {
      var d = function (e) {
        if ((u.push.apply(u, e), l++, l === c)) return (r(u), u.length ? a(new hn(u, ln(u))) : t(i))
      }
      ;(s.length || (r(u), t(i)),
        s.forEach(function (t) {
          var r = e[t]
          o.indexOf(t) === -1 ? fn(r, n, d) : pn(r, n, d)
        }))
    })
  return (
    d.catch(function (e) {
      return e
    }),
    d
  )
}
function _n(e) {
  return !!(e && e.message !== void 0)
}
function vn(e, t) {
  for (var n = e, r = 0; r < t.length; r++) {
    if (n == null) return n
    n = n[t[r]]
  }
  return n
}
function yn(e, t) {
  return function (n) {
    var r = e.fullFields ? vn(t, e.fullFields) : t[n.field || e.fullField]
    return _n(n)
      ? ((n.field = n.field || e.fullField), (n.fieldValue = r), n)
      : { message: typeof n == `function` ? n() : n, fieldValue: r, field: n.field || e.fullField }
  }
}
function bn(e, t) {
  if (t) {
    for (var n in t)
      if (t.hasOwnProperty(n)) {
        var r = t[n]
        f(r) === `object` && f(e[n]) === `object` ? (e[n] = m(m({}, e[n]), r)) : (e[n] = r)
      }
  }
  return e
}
var xn = `enum`,
  Sn = function (e, t, n, r, i) {
    ;((e[xn] = Array.isArray(e[xn]) ? e[xn] : []), e[xn].indexOf(t) === -1 && r.push(un(i.messages[xn], e.fullField, e[xn].join(`, `))))
  },
  Cn = function (e, t, n, r, i) {
    e.pattern &&
      (e.pattern instanceof RegExp
        ? ((e.pattern.lastIndex = 0), e.pattern.test(t) || r.push(un(i.messages.pattern.mismatch, e.fullField, t, e.pattern)))
        : typeof e.pattern == `string` && (new RegExp(e.pattern).test(t) || r.push(un(i.messages.pattern.mismatch, e.fullField, t, e.pattern))))
  },
  wn = function (e, t, n, r, i) {
    var a = typeof e.len == `number`,
      o = typeof e.min == `number`,
      s = typeof e.max == `number`,
      c = /[\uD800-\uDBFF][\uDC00-\uDFFF]/g,
      l = t,
      u = null,
      d = typeof t == `number`,
      f = typeof t == `string`,
      p = Array.isArray(t)
    if ((d ? (u = `number`) : f ? (u = `string`) : p && (u = `array`), !u)) return !1
    ;(p && (l = t.length),
      f && (l = t.replace(c, `_`).length),
      a
        ? l !== e.len && r.push(un(i.messages[u].len, e.fullField, e.len))
        : o && !s && l < e.min
          ? r.push(un(i.messages[u].min, e.fullField, e.min))
          : s && !o && l > e.max
            ? r.push(un(i.messages[u].max, e.fullField, e.max))
            : o && s && (l < e.min || l > e.max) && r.push(un(i.messages[u].range, e.fullField, e.min, e.max)))
  },
  Tn = function (e, t, n, r, i, a) {
    e.required && (!n.hasOwnProperty(e.field) || Z(t, a || e.type)) && r.push(un(i.messages.required, e.fullField))
  },
  En,
  Dn = function () {
    if (En) return En
    var e = `[a-fA-F\\d:]`,
      t = function (t) {
        return t && t.includeBoundaries ? `(?:(?<=\\s|^)(?=${e})|(?<=${e})(?=\\s|\$))` : ``
      },
      n = `(?:25[0-5]|2[0-4]\\d|1\\d\\d|[1-9]\\d|\\d)(?:\\.(?:25[0-5]|2[0-4]\\d|1\\d\\d|[1-9]\\d|\\d)){3}`,
      r = `[a-fA-F\\d]{1,4}`,
      i = `(?:${[`(?:${r}:){7}(?:${r}|:)`, `(?:${r}:){6}(?:${n}|:${r}|:)`, `(?:${r}:){5}(?::${n}|(?::${r}){1,2}|:)`, `(?:${r}:){4}(?:(?::${r}){0,1}:${n}|(?::${r}){1,3}|:)`, `(?:${r}:){3}(?:(?::${r}){0,2}:${n}|(?::${r}){1,4}|:)`, `(?:${r}:){2}(?:(?::${r}){0,3}:${n}|(?::${r}){1,5}|:)`, `(?:${r}:){1}(?:(?::${r}){0,4}:${n}|(?::${r}){1,6}|:)`, `(?::(?:(?::${r}){0,5}:${n}|(?::${r}){1,7}|:))`].join(`|`)})(?:%[0-9a-zA-Z]{1,})?`,
      a = RegExp(`(?:^${n}\$)|(?:^${i}\$)`),
      o = RegExp(`^${n}\$`),
      s = RegExp(`^${i}\$`),
      c = function (e) {
        return e && e.exact ? a : RegExp(`(?:${t(e)}${n}${t(e)})|(?:${t(e)}${i}${t(e)})`, `g`)
      }
    ;((c.v4 = function (e) {
      return e && e.exact ? o : RegExp(`${t(e)}${n}${t(e)}`, `g`)
    }),
      (c.v6 = function (e) {
        return e && e.exact ? s : RegExp(`${t(e)}${i}${t(e)}`, `g`)
      }))
    var l = `(?:(?:(?:[a-z]+:)?//)|www\\.)(?:\\S+(?::\\S*)?@)?(?:localhost|${c.v4().source}|${c.v6().source}|(?:(?:[a-z\\u00a1-\\uffff0-9][-_]*)*[a-z\\u00a1-\\uffff0-9]+)(?:\\.(?:[a-z\\u00a1-\\uffff0-9]-*)*[a-z\\u00a1-\\uffff0-9]+)*(?:\\.(?:[a-z\\u00a1-\\uffff]{2,})))(?::\\d{2,5})?(?:[/?#][^\\s"]*)?`
    return ((En = RegExp(`(?:^${l}\$)`, `i`)), En)
  },
  On = {
    email:
      /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]+\.)+[a-zA-Z\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]{2,}))$/,
    tel: /^(\+[0-9]{1,3}[-\s\u2011]?)?(\([0-9]{1,4}\)[-\s\u2011]?)?([0-9]+[-\s\u2011]?)*[0-9]+$/,
    hex: /^#?([a-f0-9]{6}|[a-f0-9]{3})$/i,
  },
  kn = {
    integer: function (e) {
      return kn.number(e) && parseInt(e, 10) === e
    },
    float: function (e) {
      return kn.number(e) && !kn.integer(e)
    },
    array: function (e) {
      return Array.isArray(e)
    },
    regexp: function (e) {
      if (e instanceof RegExp) return !0
      try {
        return !!new RegExp(e)
      } catch {
        return !1
      }
    },
    date: function (e) {
      return typeof e.getTime == `function` && typeof e.getMonth == `function` && typeof e.getYear == `function` && !isNaN(e.getTime())
    },
    number: function (e) {
      return isNaN(e) ? !1 : typeof e == `number`
    },
    object: function (e) {
      return f(e) === `object` && !kn.array(e)
    },
    method: function (e) {
      return typeof e == `function`
    },
    email: function (e) {
      return typeof e == `string` && e.length <= 320 && !!e.match(On.email)
    },
    tel: function (e) {
      return typeof e == `string` && e.length <= 32 && !!e.match(On.tel)
    },
    url: function (e) {
      return typeof e == `string` && e.length <= 2048 && !!e.match(Dn())
    },
    hex: function (e) {
      return typeof e == `string` && !!e.match(On.hex)
    },
  },
  Q = {
    required: Tn,
    whitespace: function (e, t, n, r, i) {
      ;(/^\s+$/.test(t) || t === ``) && r.push(un(i.messages.whitespace, e.fullField))
    },
    type: function (e, t, n, r, i) {
      if (e.required && t === void 0) {
        Tn(e, t, n, r, i)
        return
      }
      var a = [`integer`, `float`, `array`, `regexp`, `object`, `method`, `email`, `tel`, `number`, `date`, `url`, `hex`],
        o = e.type
      a.indexOf(o) > -1
        ? kn[o](t) || r.push(un(i.messages.types[o], e.fullField, e.type))
        : o && f(t) !== e.type && r.push(un(i.messages.types[o], e.fullField, e.type))
    },
    range: wn,
    enum: Sn,
    pattern: Cn,
  },
  An = function (e, t, n, r, i) {
    var a = []
    if (e.required || (!e.required && r.hasOwnProperty(e.field))) {
      if (Z(t) && !e.required) return n()
      Q.required(e, t, r, a, i)
    }
    n(a)
  },
  jn = function (e, t, n, r, i) {
    var a = []
    if (e.required || (!e.required && r.hasOwnProperty(e.field))) {
      if (t == null && !e.required) return n()
      ;(Q.required(e, t, r, a, i, `array`), t != null && (Q.type(e, t, r, a, i), Q.range(e, t, r, a, i)))
    }
    n(a)
  },
  Mn = function (e, t, n, r, i) {
    var a = []
    if (e.required || (!e.required && r.hasOwnProperty(e.field))) {
      if (Z(t) && !e.required) return n()
      ;(Q.required(e, t, r, a, i), t !== void 0 && Q.type(e, t, r, a, i))
    }
    n(a)
  },
  Nn = function (e, t, n, r, i) {
    var a = []
    if (e.required || (!e.required && r.hasOwnProperty(e.field))) {
      if (Z(t, `date`) && !e.required) return n()
      if ((Q.required(e, t, r, a, i), !Z(t, `date`))) {
        var o = t instanceof Date ? t : new Date(t)
        ;(Q.type(e, o, r, a, i), o && Q.range(e, o.getTime(), r, a, i))
      }
    }
    n(a)
  },
  Pn = `enum`,
  Fn = function (e, t, n, r, i) {
    var a = []
    if (e.required || (!e.required && r.hasOwnProperty(e.field))) {
      if (Z(t) && !e.required) return n()
      ;(Q.required(e, t, r, a, i), t !== void 0 && Q[Pn](e, t, r, a, i))
    }
    n(a)
  },
  In = function (e, t, n, r, i) {
    var a = []
    if (e.required || (!e.required && r.hasOwnProperty(e.field))) {
      if (Z(t) && !e.required) return n()
      ;(Q.required(e, t, r, a, i), t !== void 0 && (Q.type(e, t, r, a, i), Q.range(e, t, r, a, i)))
    }
    n(a)
  },
  Ln = function (e, t, n, r, i) {
    var a = []
    if (e.required || (!e.required && r.hasOwnProperty(e.field))) {
      if (Z(t) && !e.required) return n()
      ;(Q.required(e, t, r, a, i), t !== void 0 && (Q.type(e, t, r, a, i), Q.range(e, t, r, a, i)))
    }
    n(a)
  },
  Rn = function (e, t, n, r, i) {
    var a = []
    if (e.required || (!e.required && r.hasOwnProperty(e.field))) {
      if (Z(t) && !e.required) return n()
      ;(Q.required(e, t, r, a, i), t !== void 0 && Q.type(e, t, r, a, i))
    }
    n(a)
  },
  zn = function (e, t, n, r, i) {
    var a = []
    if (e.required || (!e.required && r.hasOwnProperty(e.field))) {
      if ((t === `` && (t = void 0), Z(t) && !e.required)) return n()
      ;(Q.required(e, t, r, a, i), t !== void 0 && (Q.type(e, t, r, a, i), Q.range(e, t, r, a, i)))
    }
    n(a)
  },
  Bn = function (e, t, n, r, i) {
    var a = []
    if (e.required || (!e.required && r.hasOwnProperty(e.field))) {
      if (Z(t) && !e.required) return n()
      ;(Q.required(e, t, r, a, i), t !== void 0 && Q.type(e, t, r, a, i))
    }
    n(a)
  },
  Vn = function (e, t, n, r, i) {
    var a = []
    if (e.required || (!e.required && r.hasOwnProperty(e.field))) {
      if (Z(t, `string`) && !e.required) return n()
      ;(Q.required(e, t, r, a, i), Z(t, `string`) || Q.pattern(e, t, r, a, i))
    }
    n(a)
  },
  Hn = function (e, t, n, r, i) {
    var a = []
    if (e.required || (!e.required && r.hasOwnProperty(e.field))) {
      if (Z(t) && !e.required) return n()
      ;(Q.required(e, t, r, a, i), Z(t) || Q.type(e, t, r, a, i))
    }
    n(a)
  },
  Un = function (e, t, n, r, i) {
    var a = [],
      o = Array.isArray(t) ? `array` : f(t)
    ;(Q.required(e, t, r, a, i, o), n(a))
  },
  Wn = function (e, t, n, r, i) {
    var a = []
    if (e.required || (!e.required && r.hasOwnProperty(e.field))) {
      if (Z(t, `string`) && !e.required) return n()
      ;(Q.required(e, t, r, a, i, `string`),
        Z(t, `string`) || (Q.type(e, t, r, a, i), Q.range(e, t, r, a, i), Q.pattern(e, t, r, a, i), e.whitespace === !0 && Q.whitespace(e, t, r, a, i)))
    }
    n(a)
  },
  Gn = function (e, t, n, r, i) {
    var a = e.type,
      o = []
    if (e.required || (!e.required && r.hasOwnProperty(e.field))) {
      if (Z(t, a) && !e.required) return n()
      ;(Q.required(e, t, r, o, i, a), Z(t, a) || Q.type(e, t, r, o, i))
    }
    n(o)
  },
  Kn = {
    string: Wn,
    method: Rn,
    number: zn,
    boolean: Mn,
    regexp: Hn,
    integer: Ln,
    float: In,
    array: jn,
    object: Bn,
    enum: Fn,
    pattern: Vn,
    date: Nn,
    url: Gn,
    hex: Gn,
    email: Gn,
    tel: Gn,
    required: Un,
    any: An,
  },
  qn = (function () {
    function e(t) {
      ;(N(this, e), j(this, `rules`, null), j(this, `_messages`, nn), this.define(t))
    }
    return (
      a(e, [
        {
          key: `define`,
          value: function (e) {
            var t = this
            if (!e) throw Error(`Cannot configure a schema with no rules`)
            if (f(e) !== `object` || Array.isArray(e)) throw Error(`Rules must be an object`)
            ;((this.rules = {}),
              Object.keys(e).forEach(function (n) {
                var r = e[n]
                t.rules[n] = Array.isArray(r) ? r : [r]
              }))
          },
        },
        {
          key: `messages`,
          value: function (e) {
            return (e && (this._messages = bn(tn(), e)), this._messages)
          },
        },
        {
          key: `validate`,
          value: function (t) {
            var n = this,
              r = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {},
              i = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : function () {},
              a = t,
              o = r,
              s = i
            if ((typeof o == `function` && ((s = o), (o = {})), !this.rules || Object.keys(this.rules).length === 0))
              return (s && s(null, a), Promise.resolve(a))
            function c(e) {
              var t = [],
                n = {}
              function r(e) {
                if (Array.isArray(e)) {
                  var n
                  t = (n = t).concat.apply(n, ye(e))
                } else t.push(e)
              }
              for (var i = 0; i < e.length; i++) r(e[i])
              t.length ? ((n = ln(t)), s(t, n)) : s(null, a)
            }
            if (o.messages) {
              var l = this.messages()
              ;(l === nn && (l = tn()), bn(l, o.messages), (o.messages = l))
            } else o.messages = this.messages()
            var u = {}
            ;(o.keys || Object.keys(this.rules)).forEach(function (e) {
              var r = n.rules[e],
                i = a[e]
              r.forEach(function (r) {
                var o = r
                ;(typeof o.transform == `function` &&
                  (a === t && (a = m({}, a)), (i = a[e] = o.transform(i)), i != null && (o.type = o.type || (Array.isArray(i) ? `array` : f(i)))),
                  (o = typeof o == `function` ? { validator: o } : m({}, o)),
                  (o.validator = n.getValidationMethod(o)),
                  o.validator &&
                    ((o.field = e),
                    (o.fullField = o.fullField || e),
                    (o.type = n.getType(o)),
                    (u[e] = u[e] || []),
                    u[e].push({ rule: o, value: i, source: a, field: e })))
              })
            })
            var d = {}
            return gn(
              u,
              o,
              function (t, n) {
                var r = t.rule,
                  i = (r.type === `object` || r.type === `array`) && (f(r.fields) === `object` || f(r.defaultField) === `object`)
                ;((i &&= r.required || (!r.required && t.value)), (r.field = t.field))
                function s(e, t) {
                  return m(m({}, t), {}, { fullField: `${r.fullField}.${e}`, fullFields: r.fullFields ? [].concat(ye(r.fullFields), [e]) : [e] })
                }
                function c() {
                  var c = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : [],
                    l = Array.isArray(c) ? c : [c]
                  ;(!o.suppressWarning && l.length && e.warning(`async-validator:`, l),
                    l.length && r.message !== void 0 && r.message !== null && (l = [].concat(r.message)))
                  var u = l.map(yn(r, a))
                  if (o.first && u.length) return ((d[r.field] = 1), n(u))
                  if (!i) n(u)
                  else {
                    if (r.required && !t.value)
                      return (
                        r.message === void 0 ? o.error && (u = [o.error(r, un(o.messages.required, r.field))]) : (u = [].concat(r.message).map(yn(r, a))),
                        n(u)
                      )
                    var f = {}
                    ;(r.defaultField &&
                      Object.keys(t.value).map(function (e) {
                        f[e] = r.defaultField
                      }),
                      (f = m(m({}, f), t.rule.fields)))
                    var p = {}
                    Object.keys(f).forEach(function (e) {
                      var t = f[e]
                      p[e] = (Array.isArray(t) ? t : [t]).map(s.bind(null, e))
                    })
                    var h = new e(p)
                    ;(h.messages(o.messages),
                      t.rule.options && ((t.rule.options.messages = o.messages), (t.rule.options.error = o.error)),
                      h.validate(t.value, t.rule.options || o, function (e) {
                        var t = []
                        ;(u && u.length && t.push.apply(t, ye(u)), e && e.length && t.push.apply(t, ye(e)), n(t.length ? t : null))
                      }))
                  }
                }
                var l
                if (r.asyncValidator) l = r.asyncValidator(r, t.value, c, t.source, o)
                else if (r.validator) {
                  try {
                    l = r.validator(r, t.value, c, t.source, o)
                  } catch (e) {
                    var u, p
                    ;((u = (p = console).error) == null || u.call(p, e),
                      o.suppressValidatorError ||
                        setTimeout(function () {
                          throw e
                        }, 0),
                      c(e.message))
                  }
                  l === !0
                    ? c()
                    : l === !1
                      ? c(typeof r.message == `function` ? r.message(r.fullField || r.field) : r.message || `${r.fullField || r.field} fails`)
                      : l instanceof Array
                        ? c(l)
                        : l instanceof Error && c(l.message)
                }
                l &&
                  l.then &&
                  l.then(
                    function () {
                      return c()
                    },
                    function (e) {
                      return c(e)
                    },
                  )
              },
              function (e) {
                c(e)
              },
              a,
            )
          },
        },
        {
          key: `getType`,
          value: function (e) {
            if (
              (e.type === void 0 && e.pattern instanceof RegExp && (e.type = `pattern`),
              typeof e.validator != `function` && e.type && !Kn.hasOwnProperty(e.type))
            )
              throw Error(un(`Unknown rule type %s`, e.type))
            return e.type || `string`
          },
        },
        {
          key: `getValidationMethod`,
          value: function (e) {
            if (typeof e.validator == `function`) return e.validator
            var t = Object.keys(e),
              n = t.indexOf(`message`)
            return (n !== -1 && t.splice(n, 1), t.length === 1 && t[0] === `required` ? Kn.required : Kn[this.getType(e)] || void 0)
          },
        },
      ]),
      e
    )
  })()
;(j(qn, `register`, function (e, t) {
  if (typeof t != `function`) throw Error(`Cannot register a validator by type, validator is not a function`)
  Kn[e] = t
}),
  j(qn, `warning`, cn),
  j(qn, `messages`, nn),
  j(qn, `validators`, Kn))
var Jn = "'${name}' is not a valid ${type}",
  Yn = {
    default: "Validation error on field '${name}'",
    required: "'${name}' is required",
    enum: "'${name}' must be one of [${enum}]",
    whitespace: "'${name}' cannot be empty",
    date: { format: "'${name}' is invalid for format date", parse: "'${name}' could not be parsed as date", invalid: "'${name}' is invalid date" },
    types: {
      string: Jn,
      method: Jn,
      array: Jn,
      object: Jn,
      number: Jn,
      date: Jn,
      boolean: Jn,
      integer: Jn,
      float: Jn,
      regexp: Jn,
      email: Jn,
      tel: Jn,
      url: Jn,
      hex: Jn,
    },
    string: {
      len: "'${name}' must be exactly ${len} characters",
      min: "'${name}' must be at least ${min} characters",
      max: "'${name}' cannot be longer than ${max} characters",
      range: "'${name}' must be between ${min} and ${max} characters",
    },
    number: {
      len: "'${name}' must equal ${len}",
      min: "'${name}' cannot be less than ${min}",
      max: "'${name}' cannot be greater than ${max}",
      range: "'${name}' must be between ${min} and ${max}",
    },
    array: {
      len: "'${name}' must be exactly ${len} in length",
      min: "'${name}' cannot be less than ${min} in length",
      max: "'${name}' cannot be greater than ${max} in length",
      range: "'${name}' must be between ${min} and ${max} in length",
    },
    pattern: { mismatch: "'${name}' does not match pattern ${pattern}" },
  },
  Xn = qn
function Zn(e, t) {
  return e.replace(/\\?\$\{\w+\}/g, (e) => (e.startsWith(`\\`) ? e.slice(1) : t[e.slice(2, -1)]))
}
var Qn = `CODE_LOGIC_ERROR`
async function $n(e, t, n, r, i) {
  let a = { ...n }
  if ((delete a.ruleIndex, (Xn.warning = () => void 0), a.validator)) {
    let e = a.validator
    a.validator = (...t) => {
      try {
        return e(...t)
      } catch (e) {
        return (console.error(e), Promise.reject(Qn))
      }
    }
  }
  let o = null
  a && a.type === `array` && a.defaultField && ((o = a.defaultField), delete a.defaultField)
  let s = new Xn({ [e]: [a] }),
    c = ie(Yn, r.validateMessages)
  s.messages(c)
  let l = []
  try {
    await Promise.resolve(s.validate({ [e]: t }, { ...r }))
  } catch (e) {
    e.errors &&
      (l = e.errors.map(({ message: e }, t) => {
        let n = e === Qn ? c.default : e
        return Y.isValidElement(n) ? Y.cloneElement(n, { key: `error_${t}` }) : n
      }))
  }
  if (!l.length && o && Array.isArray(t) && t.length > 0)
    return (await Promise.all(t.map((t, n) => $n(`${e}.${n}`, t, o, r, i)))).reduce((e, t) => [...e, ...t], [])
  let u = { ...n, name: e, enum: (n.enum || []).join(`, `), ...i }
  return l.map((e) => (typeof e == `string` ? Zn(e, u) : e))
}
function er(e, t, n, r, i, a) {
  let o = e.join(`.`),
    s = n
      .map((e, t) => {
        let n = e.validator,
          r = { ...e, ruleIndex: t }
        return (
          n &&
            (r.validator = (e, t, r) => {
              let i = !1,
                a = n(e, t, (...e) => {
                  Promise.resolve().then(() => {
                    ;(we(!i, 'Your validator function has already return a promise. `callback` will be ignored.'), i || r(...e))
                  })
                })
              ;((i = a && typeof a.then == `function` && typeof a.catch == `function`),
                we(i, '`callback` is deprecated. Please return a promise instead.'),
                i &&
                  a
                    .then(() => {
                      r()
                    })
                    .catch((e) => {
                      r(e || ` `)
                    }))
            }),
          r
        )
      })
      .sort(({ warningOnly: e, ruleIndex: t }, { warningOnly: n, ruleIndex: r }) => (!!e == !!n ? t - r : e ? 1 : -1)),
    c
  if (i === !0)
    c = new Promise(async (e, n) => {
      for (let e = 0; e < s.length; e += 1) {
        let i = s[e],
          c = await $n(o, t, i, r, a)
        if (c.length) {
          n([{ errors: c, rule: i }])
          return
        }
      }
      e([])
    })
  else {
    let e = s.map((e) => $n(o, t, e, r, a).then((t) => ({ errors: t, rule: e })))
    c = (i ? nr(e) : tr(e)).then((e) => Promise.reject(e))
  }
  return (c.catch((e) => e), c)
}
async function tr(e) {
  return Promise.all(e).then((e) => [].concat(...e))
}
async function nr(e) {
  let t = 0
  return new Promise((n) => {
    e.forEach((r) => {
      r.then((r) => {
        ;(r.errors.length && n([r]), (t += 1), t === e.length && n([]))
      })
    })
  })
}
function $(e) {
  return $t(e)
}
function rr(e, t) {
  let n = {}
  return (
    t.forEach((t) => {
      let r = J(e, t)
      n = V(n, t, r)
    }),
    n
  )
}
function ir(e, t, n = !1) {
  return e && e.some((e) => ar(t, e, n))
}
function ar(e, t, n = !1) {
  return !e || !t || (!n && e.length !== t.length) ? !1 : t.every((t, n) => e[n] === t)
}
function or(e, t) {
  if (e === t) return !0
  if ((!e && t) || (e && !t) || !e || !t || typeof e != `object` || typeof t != `object`) return !1
  let n = Object.keys(e),
    r = Object.keys(t)
  return [...new Set([...n, ...r])].every((n) => {
    let r = e[n],
      i = t[n]
    return typeof r == `function` && typeof i == `function` ? !0 : r === i
  })
}
function sr(e, ...t) {
  let n = t[0]
  return n && n.target && typeof n.target == `object` && e in n.target ? n.target[e] : n
}
function cr(e, t, n) {
  let { length: r } = e
  if (t < 0 || t >= r || n < 0 || n >= r) return e
  let i = e[t],
    a = t - n
  return a > 0
    ? [...e.slice(0, n), i, ...e.slice(n, t), ...e.slice(t + 1, r)]
    : a < 0
      ? [...e.slice(0, t), ...e.slice(t + 1, n + 1), i, ...e.slice(n + 1, r)]
      : e
}
var lr = (e) => {
    let t = new MessageChannel()
    ;((t.port1.onmessage = e), t.port2.postMessage(null))
  },
  ur = class {
    namePathList = []
    taskId = 0
    watcherList = new Set()
    form
    constructor(e) {
      this.form = e
    }
    register(e) {
      return (
        this.watcherList.add(e),
        () => {
          this.watcherList.delete(e)
        }
      )
    }
    notify(e) {
      ;(e.forEach((e) => {
        this.namePathList.every((t) => !ar(t, e)) && this.namePathList.push(e)
      }),
        this.doBatch())
    }
    doBatch() {
      this.taskId += 1
      let e = this.taskId
      lr(() => {
        if (e === this.taskId && this.watcherList.size) {
          let e = this.form.getForm(),
            t = e.getFieldsValue(),
            n = e.getFieldsValue(!0)
          ;(this.watcherList.forEach((e) => {
            e(t, n, this.namePathList)
          }),
            (this.namePathList = []))
        }
      })
    }
  }
async function dr() {
  return new Promise((e) => {
    lr(() => {
      he(() => {
        e()
      })
    })
  })
}
function fr() {
  return (
    (fr = Object.assign
      ? Object.assign.bind()
      : function (e) {
          for (var t = 1; t < arguments.length; t++) {
            var n = arguments[t]
            for (var r in n) Object.prototype.hasOwnProperty.call(n, r) && (e[r] = n[r])
          }
          return e
        }),
    fr.apply(this, arguments)
  )
}
var pr = [],
  mr = []
function hr(e, t, n, r, i, a) {
  return typeof e == `function` ? e(t, n, `source` in a ? { source: a.source } : {}) : r !== i
}
var gr = class extends Y.Component {
  static contextType = Zt
  state = { resetCount: 0 }
  cancelRegisterFunc = null
  mounted = !1
  touched = !1
  dirty = !1
  validatePromise
  prevValidating
  errors = pr
  warnings = mr
  constructor(e) {
    if ((super(e), e.fieldContext)) {
      let { getInternalHooks: t } = e.fieldContext,
        { initEntityValue: n } = t(Xt)
      n(this)
    }
  }
  componentDidMount() {
    let { shouldUpdate: e, fieldContext: t } = this.props
    if (((this.mounted = !0), t)) {
      let { getInternalHooks: e } = t,
        { registerField: n } = e(Xt)
      this.cancelRegisterFunc = n(this)
    }
    e === !0 && this.reRender()
  }
  componentWillUnmount() {
    ;(this.cancelRegister(), this.triggerMetaEvent(!0), (this.mounted = !1))
  }
  cancelRegister = () => {
    let { preserve: e, isListField: t, name: n } = this.props
    ;(this.cancelRegisterFunc && this.cancelRegisterFunc(t, e, $(n)), (this.cancelRegisterFunc = null))
  }
  getNamePath = () => {
    let { name: e, fieldContext: t } = this.props,
      { prefixName: n = [] } = t
    return e === void 0 ? [] : [...n, ...e]
  }
  getRules = () => {
    let { rules: e = [], fieldContext: t } = this.props
    return e.map((e) => (typeof e == `function` ? e(t) : e))
  }
  reRender() {
    this.mounted && this.forceUpdate()
  }
  refresh = () => {
    this.mounted && this.setState(({ resetCount: e }) => ({ resetCount: e + 1 }))
  }
  metaCache = null
  triggerMetaEvent = (e) => {
    let { onMetaChange: t } = this.props
    if (t) {
      let n = { ...this.getMeta(), destroy: e }
      ;(F(this.metaCache, n) || t(n), (this.metaCache = n))
    } else this.metaCache = null
  }
  onStoreChange = (e, t, n) => {
    let { shouldUpdate: r, dependencies: i = [], onReset: a } = this.props,
      { store: o } = n,
      s = this.getNamePath(),
      c = this.getValue(e),
      l = this.getValue(o),
      u = t && ir(t, s)
    switch (
      (n.type === `valueUpdate` &&
        n.source === `external` &&
        !F(c, l) &&
        ((this.touched = !0), (this.dirty = !0), (this.validatePromise = null), (this.errors = pr), (this.warnings = mr), this.triggerMetaEvent()),
      n.type)
    ) {
      case `reset`:
        if (!t || u) {
          ;((this.touched = !1),
            (this.dirty = !1),
            (this.validatePromise = void 0),
            (this.errors = pr),
            (this.warnings = mr),
            this.triggerMetaEvent(),
            a?.(),
            this.refresh())
          return
        }
        break
      case `remove`:
        if (r && hr(r, e, o, c, l, n)) {
          this.reRender()
          return
        }
        break
      case `setField`: {
        let { data: i } = n
        if (u) {
          ;(`touched` in i && (this.touched = i.touched),
            `validating` in i && !(`originRCField` in i) && (this.validatePromise = i.validating ? Promise.resolve([]) : null),
            `errors` in i && (this.errors = i.errors || pr),
            `warnings` in i && (this.warnings = i.warnings || mr),
            (this.dirty = !0),
            this.triggerMetaEvent(),
            this.reRender())
          return
        } else if (`value` in i && ir(t, s, !0)) {
          this.reRender()
          return
        }
        if (r && !s.length && hr(r, e, o, c, l, n)) {
          this.reRender()
          return
        }
        break
      }
      case `dependenciesUpdate`:
        if (i.map($).some((e) => ir(n.relatedFields, e))) {
          this.reRender()
          return
        }
        break
      default:
        if (u || ((!i.length || s.length || r) && hr(r, e, o, c, l, n))) {
          this.reRender()
          return
        }
        break
    }
    r === !0 && this.reRender()
  }
  validateRules = (e) => {
    let t = this.getNamePath(),
      n = this.getValue(),
      { triggerName: r, validateOnly: i = !1, delayFrame: a } = e || {},
      o = Promise.resolve().then(async () => {
        if (!this.mounted) return []
        let { validateFirst: i = !1, messageVariables: s, validateDebounce: c } = this.props
        a && (await dr())
        let l = this.getRules()
        if (
          (r &&
            (l = l
              .filter((e) => e)
              .filter((e) => {
                let { validateTrigger: t } = e
                return t ? $t(t).includes(r) : !0
              })),
          c &&
            r &&
            (await new Promise((e) => {
              setTimeout(e, c)
            }),
            this.validatePromise !== o))
        )
          return []
        let u = er(t, n, l, e, i, s)
        return (
          u
            .catch((e) => e)
            .then((e = pr) => {
              if (this.validatePromise === o) {
                this.validatePromise = null
                let t = [],
                  n = []
                ;(e.forEach?.(({ rule: { warningOnly: e }, errors: r = pr }) => {
                  e ? n.push(...r) : t.push(...r)
                }),
                  (this.errors = t),
                  (this.warnings = n),
                  this.triggerMetaEvent(),
                  this.reRender())
              }
            }),
          u
        )
      })
    return i ? o : ((this.validatePromise = o), (this.dirty = !0), (this.errors = pr), (this.warnings = mr), this.triggerMetaEvent(), this.reRender(), o)
  }
  isFieldValidating = () => !!this.validatePromise
  isFieldTouched = () => this.touched
  isFieldDirty = () => {
    if (this.dirty || this.props.initialValue !== void 0) return !0
    let { fieldContext: e } = this.props,
      { getInitialValue: t } = e.getInternalHooks(Xt)
    return t(this.getNamePath()) !== void 0
  }
  getErrors = () => this.errors
  getWarnings = () => this.warnings
  isListField = () => this.props.isListField
  isList = () => this.props.isList
  isPreserve = () => this.props.preserve
  getMeta = () => (
    (this.prevValidating = this.isFieldValidating()),
    {
      touched: this.isFieldTouched(),
      validating: this.prevValidating,
      errors: this.errors,
      warnings: this.warnings,
      name: this.getNamePath(),
      validated: this.validatePromise === null,
    }
  )
  getOnlyChild = (e) => {
    if (typeof e == `function`) {
      let t = this.getMeta()
      return { ...this.getOnlyChild(e(this.getControlled(), t, this.props.fieldContext)), isFunction: !0 }
    }
    let t = R(e)
    return t.length !== 1 || !Y.isValidElement(t[0]) ? { child: t, isFunction: !1 } : { child: t[0], isFunction: !1 }
  }
  getValue = (e) => {
    let { getFieldsValue: t } = this.props.fieldContext,
      n = this.getNamePath()
    return J(e || t(!0), n)
  }
  getControlled = (e = {}) => {
    let {
        name: t,
        trigger: n = `onChange`,
        validateTrigger: r,
        getValueFromEvent: i,
        normalize: a,
        valuePropName: o = `value`,
        getValueProps: s,
        fieldContext: c,
      } = this.props,
      l = r === void 0 ? c.validateTrigger : r,
      u = this.getNamePath(),
      { getInternalHooks: d, getFieldsValue: f } = c,
      { dispatch: p } = d(Xt),
      m = this.getValue(),
      h = s || ((e) => ({ [o]: e })),
      g = e[n],
      _ = t === void 0 ? {} : h(m),
      v = { ...e, ..._ }
    return (
      (v[n] = (...e) => {
        ;((this.touched = !0), (this.dirty = !0), this.triggerMetaEvent())
        let t
        ;((t = i ? i(...e) : sr(o, ...e)), a && (t = a(t, m, f(!0))), t !== m && p({ type: `updateValue`, namePath: u, value: t }), g && g(...e))
      }),
      $t(l || []).forEach((e) => {
        let t = v[e]
        v[e] = (...n) => {
          t && t(...n)
          let { rules: r } = this.props
          r && r.length && p({ type: `validateField`, namePath: u, triggerName: e })
        }
      }),
      v
    )
  }
  render() {
    let { resetCount: e } = this.state,
      { children: t } = this.props,
      { child: n, isFunction: r } = this.getOnlyChild(t),
      i
    return (
      r
        ? (i = n)
        : Y.isValidElement(n)
          ? (i = Y.cloneElement(n, this.getControlled(n.props)))
          : (we(!n, '`children` of Field is not validate ReactElement.'), (i = n)),
      Y.createElement(Y.Fragment, { key: e }, i)
    )
  }
}
function _r({ name: e, ...t }) {
  let n = Y.useContext(Zt),
    r = Y.useContext(Qt),
    i = e === void 0 ? void 0 : $(e),
    a = t.isListField ?? !!r,
    o = `keep`
  return (a || (o = `_${(i || []).join(`_`)}`), Y.createElement(gr, fr({ key: o, name: i, isListField: a }, t, { fieldContext: n })))
}
function vr({ name: e, initialValue: t, children: n, rules: r, validateTrigger: i, isListField: a }) {
  let o = Y.useContext(Zt),
    s = Y.useContext(Qt),
    c = Y.useRef({ keys: [], id: 0 }).current,
    l = Y.useMemo(() => [...($(o.prefixName) || []), ...$(e)], [o.prefixName, e]),
    u = Y.useMemo(() => ({ ...o, prefixName: l }), [o, l]),
    d = Y.useMemo(
      () => ({
        getKey: (e) => {
          let t = l.length,
            n = e[t]
          return [c.keys[n], e.slice(t + 1)]
        },
      }),
      [c, l],
    )
  return typeof n == `function`
    ? Y.createElement(
        Qt.Provider,
        { value: d },
        Y.createElement(
          Zt.Provider,
          { value: u },
          Y.createElement(
            _r,
            {
              name: [],
              shouldUpdate: (e, t, { source: n }) => (n === `internal` ? !1 : e !== t),
              rules: r,
              validateTrigger: i,
              initialValue: t,
              isList: !0,
              isListField: a ?? !!s,
            },
            ({ value: e = [], onChange: t }, r) => {
              let { getFieldValue: i } = o,
                a = () => i(l || []) || [],
                s = {
                  add: (e, n) => {
                    let r = a()
                    ;(n >= 0 && n <= r.length
                      ? ((c.keys = [...c.keys.slice(0, n), c.id, ...c.keys.slice(n)]), t([...r.slice(0, n), e, ...r.slice(n)]))
                      : ((c.keys = [...c.keys, c.id]), t([...r, e])),
                      (c.id += 1))
                  },
                  remove: (e) => {
                    let n = a(),
                      r = new Set(Array.isArray(e) ? e : [e])
                    r.size <= 0 || ((c.keys = c.keys.filter((e, t) => !r.has(t))), t(n.filter((e, t) => !r.has(t))))
                  },
                  move(e, n) {
                    if (e === n) return
                    let r = a()
                    e < 0 || e >= r.length || n < 0 || n >= r.length || ((c.keys = cr(c.keys, e, n)), t(cr(r, e, n)))
                  },
                },
                u = e || []
              return (
                Array.isArray(u) || (u = []),
                n(
                  u.map((e, t) => {
                    let n = c.keys[t]
                    return (n === void 0 && ((c.keys[t] = c.id), (n = c.keys[t]), (c.id += 1)), { name: t, key: n, isListField: !0 })
                  }),
                  s,
                  r,
                )
              )
            },
          ),
        ),
      )
    : (we(!1, `Form.List only accepts function as children.`), null)
}
function yr(e) {
  let t = !1,
    n = e.length,
    r = []
  return e.length
    ? new Promise((i, a) => {
        e.forEach((e, o) => {
          e.catch((e) => ((t = !0), e)).then((e) => {
            ;(--n, (r[o] = e), !(n > 0) && (t && a(r), i(r)))
          })
        })
      })
    : Promise.resolve([])
}
var br = `__@field_split__`
function xr(e) {
  return e.map((e) => `${typeof e}:${e}`).join(br)
}
var Sr = class {
    kvs = new Map()
    set(e, t) {
      this.kvs.set(xr(e), t)
    }
    get(e) {
      return this.kvs.get(xr(e))
    }
    getAsPrefix(e) {
      let t = xr(e),
        n = t + br,
        r = [],
        i = this.kvs.get(t)
      return (
        i !== void 0 && r.push(i),
        this.kvs.forEach((e, t) => {
          t.startsWith(n) && r.push(e)
        }),
        r
      )
    }
    update(e, t) {
      let n = t(this.get(e))
      n ? this.set(e, n) : this.delete(e)
    }
    delete(e) {
      this.kvs.delete(xr(e))
    }
    map(e) {
      return [...this.kvs.entries()].map(([t, n]) =>
        e({
          key: t.split(br).map((e) => {
            let [, t, n] = e.match(/^([^:]*):(.*)$/)
            return t === `number` ? Number(n) : n
          }),
          value: n,
        }),
      )
    }
    toJSON() {
      let e = {}
      return (this.map(({ key: t, value: n }) => ((e[t.join(`.`)] = n), null)), e)
    }
  },
  Cr = class {
    formHooked = !1
    forceRootUpdate
    subscribable = !0
    store = {}
    fieldEntities = []
    initialValues = {}
    callbacks = {}
    validateMessages = null
    preserve = null
    lastValidatePromise = null
    watcherCenter = new ur(this)
    constructor(e) {
      this.forceRootUpdate = e
    }
    getForm = () => ({
      getFieldValue: this.getFieldValue,
      getFieldsValue: this.getFieldsValue,
      getFieldError: this.getFieldError,
      getFieldWarning: this.getFieldWarning,
      getFieldsError: this.getFieldsError,
      isFieldsTouched: this.isFieldsTouched,
      isFieldTouched: this.isFieldTouched,
      isFieldValidating: this.isFieldValidating,
      isFieldsValidating: this.isFieldsValidating,
      resetFields: this.resetFields,
      setFields: this.setFields,
      setFieldValue: this.setFieldValue,
      setFieldsValue: this.setFieldsValue,
      validateFields: this.validateFields,
      submit: this.submit,
      _init: !0,
      getInternalHooks: this.getInternalHooks,
    })
    getInternalHooks = (e) =>
      e === `RC_FORM_INTERNAL_HOOKS`
        ? ((this.formHooked = !0),
          {
            dispatch: this.dispatch,
            initEntityValue: this.initEntityValue,
            registerField: this.registerField,
            useSubscribe: this.useSubscribe,
            setInitialValues: this.setInitialValues,
            destroyForm: this.destroyForm,
            setCallbacks: this.setCallbacks,
            setValidateMessages: this.setValidateMessages,
            getFields: this.getFields,
            setPreserve: this.setPreserve,
            getInitialValue: this.getInitialValue,
            registerWatch: this.registerWatch,
          })
        : (we(!1, '`getInternalHooks` is internal usage. Should not call directly.'), null)
    useSubscribe = (e) => {
      this.subscribable = e
    }
    prevWithoutPreserves = null
    setInitialValues = (e, t) => {
      if (((this.initialValues = e || {}), t)) {
        let t = ie(e, this.store)
        ;(this.prevWithoutPreserves?.map(({ key: n }) => {
          t = V(t, n, J(e, n))
        }),
          (this.prevWithoutPreserves = null),
          this.updateStore(t))
      }
    }
    destroyForm = (e) => {
      if (e) this.updateStore({})
      else {
        let e = new Sr()
        ;(this.getFieldEntities(!0).forEach((t) => {
          this.isMergedPreserve(t.isPreserve()) || e.set(t.getNamePath(), !0)
        }),
          (this.prevWithoutPreserves = e))
      }
    }
    getInitialValue = (e) => {
      let t = J(this.initialValues, e)
      return e.length ? ie(t) : t
    }
    setCallbacks = (e) => {
      this.callbacks = e
    }
    setValidateMessages = (e) => {
      this.validateMessages = e
    }
    setPreserve = (e) => {
      this.preserve = e
    }
    registerWatch = (e) => this.watcherCenter.register(e)
    notifyWatch = (e = []) => {
      this.watcherCenter.notify(e)
    }
    timeoutId = null
    warningUnhooked = () => {}
    updateStore = (e) => {
      this.store = e
    }
    getFieldEntities = (e = !1) => (e ? this.fieldEntities.filter((e) => e.getNamePath().length) : this.fieldEntities)
    getFieldsMap = (e = !1) => {
      let t = new Sr()
      return (
        this.getFieldEntities(e).forEach((e) => {
          let n = e.getNamePath()
          t.set(n, e)
        }),
        t
      )
    }
    getFieldEntitiesForNamePathList = (e, t = !1) => {
      if (!e) return this.getFieldEntities(!0)
      let n = this.getFieldsMap(!0)
      return t
        ? e.flatMap((e) => {
            let t = $(e),
              r = n.getAsPrefix(t)
            return r.length ? r : [{ INVALIDATE_NAME_PATH: t }]
          })
        : e.map((e) => {
            let t = $(e)
            return n.get(t) || { INVALIDATE_NAME_PATH: $(e) }
          })
    }
    getFieldsValue = (e, t) => {
      this.warningUnhooked()
      let n, r
      if ((e === !0 || Array.isArray(e) ? ((n = e), (r = t)) : e && typeof e == `object` && (r = e.filter), n === !0 && !r)) return this.store
      let i = this.getFieldEntitiesForNamePathList(Array.isArray(n) ? n : null, !0),
        a = [],
        o = []
      i.forEach((e) => {
        let t = e.INVALIDATE_NAME_PATH || e.getNamePath()
        if (e.isList?.()) {
          o.push(t)
          return
        }
        if (!r) a.push(t)
        else {
          let n = `getMeta` in e ? e.getMeta() : null
          r(n) && a.push(t)
        }
      })
      let s = rr(this.store, a.map($))
      return (
        o.forEach((e) => {
          J(s, e) || (s = V(s, e, []))
        }),
        s
      )
    }
    getFieldValue = (e) => {
      this.warningUnhooked()
      let t = $(e)
      return J(this.store, t)
    }
    getFieldsError = (e) => (
      this.warningUnhooked(),
      this.getFieldEntitiesForNamePathList(e).map((t, n) =>
        t && !t.INVALIDATE_NAME_PATH
          ? { name: t.getNamePath(), errors: t.getErrors(), warnings: t.getWarnings() }
          : { name: $(e[n]), errors: [], warnings: [] },
      )
    )
    getFieldError = (e) => {
      this.warningUnhooked()
      let t = $(e)
      return this.getFieldsError([t])[0].errors
    }
    getFieldWarning = (e) => {
      this.warningUnhooked()
      let t = $(e)
      return this.getFieldsError([t])[0].warnings
    }
    isFieldsTouched = (...e) => {
      this.warningUnhooked()
      let [t, n] = e,
        r,
        i = !1
      e.length === 0 ? (r = null) : e.length === 1 ? (Array.isArray(t) ? ((r = t.map($)), (i = !1)) : ((r = null), (i = t))) : ((r = t.map($)), (i = n))
      let a = this.getFieldEntities(!0),
        o = (e) => e.isFieldTouched()
      if (!r) return i ? a.every((e) => o(e) || e.isList()) : a.some(o)
      let s = new Sr()
      ;(r.forEach((e) => {
        s.set(e, [])
      }),
        a.forEach((e) => {
          let t = e.getNamePath()
          r.forEach((n) => {
            n.every((e, n) => t[n] === e) && s.update(n, (t) => [...t, e])
          })
        }))
      let c = (e) => e.some(o),
        l = s.map(({ value: e }) => e)
      return i ? l.every(c) : l.some(c)
    }
    isFieldTouched = (e) => (this.warningUnhooked(), this.isFieldsTouched([e]))
    isFieldsValidating = (e) => {
      this.warningUnhooked()
      let t = this.getFieldEntities()
      if (!e) return t.some((e) => e.isFieldValidating())
      let n = e.map($)
      return t.some((e) => ir(n, e.getNamePath()) && e.isFieldValidating())
    }
    isFieldValidating = (e) => (this.warningUnhooked(), this.isFieldsValidating([e]))
    resetWithFieldInitialValue = (e = {}) => {
      let t = new Sr(),
        n = this.getFieldEntities(!0)
      n.forEach((e) => {
        let { initialValue: n } = e.props,
          r = e.getNamePath()
        if (n !== void 0) {
          let i = t.get(r) || new Set()
          ;(i.add({ entity: e, value: n }), t.set(r, i))
        }
      })
      let r = (n) => {
          n.forEach((n) => {
            let { initialValue: r } = n.props
            if (r !== void 0) {
              let r = n.getNamePath()
              if (this.getInitialValue(r) !== void 0) we(!1, `Form already set 'initialValues' with path '${r.join(`.`)}'. Field can not overwrite it.`)
              else {
                let i = t.get(r)
                if (i && i.size > 1) we(!1, `Multiple Field with path '${r.join(`.`)}' set 'initialValue'. Can not decide which one to pick.`)
                else if (i) {
                  let t = this.getFieldValue(r)
                  !n.isListField() && (!e.skipExist || t === void 0) && this.updateStore(V(this.store, r, [...i][0].value))
                }
              }
            }
          })
        },
        i
      ;(e.entities
        ? (i = e.entities)
        : e.namePathList
          ? ((i = []),
            e.namePathList.forEach((e) => {
              let n = t.get(e)
              n && i.push(...[...n].map((e) => e.entity))
            }))
          : (i = n),
        r(i))
    }
    resetFields = (e) => {
      this.warningUnhooked()
      let t = this.store
      if (!e) {
        ;(this.updateStore(ie(this.initialValues)), this.resetWithFieldInitialValue(), this.notifyObservers(t, null, { type: `reset` }), this.notifyWatch())
        return
      }
      let n = e.map($)
      ;(n.forEach((e) => {
        let t = this.getInitialValue(e)
        this.updateStore(V(this.store, e, t))
      }),
        this.resetWithFieldInitialValue({ namePathList: n }),
        this.notifyObservers(t, n, { type: `reset` }),
        this.notifyWatch(n))
    }
    setFields = (e) => {
      this.warningUnhooked()
      let t = this.store,
        n = []
      ;(e.forEach((e) => {
        let { name: r, ...i } = e,
          a = $(r)
        ;(n.push(a), `value` in i && this.updateStore(V(this.store, a, i.value)), this.notifyObservers(t, [a], { type: `setField`, data: e }))
      }),
        this.notifyWatch(n))
    }
    getFields = () =>
      this.getFieldEntities(!0).map((e) => {
        let t = e.getNamePath(),
          n = { ...e.getMeta(), name: t, value: this.getFieldValue(t) }
        return (Object.defineProperty(n, `originRCField`, { value: !0 }), n)
      })
    initEntityValue = (e) => {
      let { initialValue: t } = e.props
      if (t !== void 0) {
        let n = e.getNamePath()
        J(this.store, n) === void 0 && this.updateStore(V(this.store, n, t))
      }
    }
    isMergedPreserve = (e) => (e === void 0 ? this.preserve : e) ?? !0
    registerField = (e) => {
      this.fieldEntities.push(e)
      let t = e.getNamePath()
      if ((this.notifyWatch([t]), e.props.initialValue !== void 0)) {
        let t = this.store
        ;(this.resetWithFieldInitialValue({ entities: [e], skipExist: !0 }),
          this.notifyObservers(t, [e.getNamePath()], { type: `valueUpdate`, source: `internal` }))
      }
      return (n, r, i = []) => {
        if (((this.fieldEntities = this.fieldEntities.filter((t) => t !== e)), !this.isMergedPreserve(r) && (!n || i.length > 1))) {
          let e = n ? void 0 : this.getInitialValue(t)
          if (t.length && this.getFieldValue(t) !== e && this.fieldEntities.every((e) => !ar(e.getNamePath(), t))) {
            let n = this.store
            ;(this.updateStore(V(n, t, e, !0)), this.notifyObservers(n, [t], { type: `remove` }), this.triggerDependenciesUpdate(n, t))
          }
        }
        this.notifyWatch([t])
      }
    }
    dispatch = (e) => {
      switch (e.type) {
        case `updateValue`: {
          let { namePath: t, value: n } = e
          this.updateValue(t, n)
          break
        }
        case `validateField`: {
          let { namePath: t, triggerName: n } = e
          this.validateFields([t], { triggerName: n })
          break
        }
        default:
      }
    }
    notifyObservers = (e, t, n) => {
      if (this.subscribable) {
        let r = { ...n, store: this.getFieldsValue(!0) }
        this.getFieldEntities().forEach(({ onStoreChange: n }) => {
          n(e, t, r)
        })
      } else this.forceRootUpdate()
    }
    triggerDependenciesUpdate = (e, t) => {
      let n = this.getDependencyChildrenFields(t)
      return (n.length && this.validateFields(n, { delayFrame: !0 }), this.notifyObservers(e, n, { type: `dependenciesUpdate`, relatedFields: [t, ...n] }), n)
    }
    updateValue = (e, t) => {
      let n = $(e),
        r = this.store
      ;(this.updateStore(V(this.store, n, t)), this.notifyObservers(r, [n], { type: `valueUpdate`, source: `internal` }), this.notifyWatch([n]))
      let i = this.triggerDependenciesUpdate(r, n),
        { onValuesChange: a } = this.callbacks
      if (a) {
        let e = rr(this.store, [n])
        a(e, V(this.getFieldsValue(), n, J(e, n)))
      }
      this.triggerOnFieldsChange([n, ...i])
    }
    setFieldsValue = (e) => {
      this.warningUnhooked()
      let t = this.store
      if (e) {
        let t = ie(this.store, e)
        this.updateStore(t)
      }
      ;(this.notifyObservers(t, null, { type: `valueUpdate`, source: `external` }), this.notifyWatch())
    }
    setFieldValue = (e, t) => {
      this.setFields([{ name: e, value: t, errors: [], warnings: [], touched: !0 }])
    }
    getDependencyChildrenFields = (e) => {
      let t = new Set(),
        n = [],
        r = new Sr()
      this.getFieldEntities().forEach((e) => {
        let { dependencies: t } = e.props
        ;(t || []).forEach((t) => {
          let n = $(t)
          r.update(n, (t = new Set()) => (t.add(e), t))
        })
      })
      let i = (e) => {
        ;(r.get(e) || new Set()).forEach((e) => {
          if (!t.has(e)) {
            t.add(e)
            let r = e.getNamePath()
            e.isFieldDirty() && r.length && (n.push(r), i(r))
          }
        })
      }
      return (i(e), n)
    }
    triggerOnFieldsChange = (e, t) => {
      let { onFieldsChange: n } = this.callbacks
      if (n) {
        let r = this.getFields()
        if (t) {
          let e = new Sr()
          ;(t.forEach(({ name: t, errors: n }) => {
            e.set(t, n)
          }),
            r.forEach((t) => {
              t.errors = e.get(t.name) || t.errors
            }))
        }
        let i = r.filter(({ name: t }) => ir(e, t))
        i.length && n(i, r)
      }
    }
    validateFields = (e, t) => {
      this.warningUnhooked()
      let n, r
      Array.isArray(e) || typeof e == `string` || typeof t == `string` ? ((n = e), (r = t)) : (r = e)
      let i = !!n,
        a = i ? n.map($) : [],
        o = [...a],
        s = [],
        c = String(Date.now()),
        l = new Set(),
        { recursive: u, dirty: d } = r || {}
      this.getFieldEntities(!0).forEach((e) => {
        let t = e.getNamePath()
        if (
          (i || ((!e.isList() || !a.some((e) => ar(e, t, !0))) && o.push(t), a.push(t)),
          !(!e.props.rules || !e.props.rules.length) && !(d && !e.isFieldDirty()) && (l.add(t.join(c)), !i || ir(a, t, u)))
        ) {
          let n = e.validateRules({ validateMessages: { ...Yn, ...this.validateMessages }, ...r })
          s.push(
            n
              .then(() => ({ name: t, errors: [], warnings: [] }))
              .catch((e) => {
                let n = [],
                  r = []
                return (
                  e.forEach?.(({ rule: { warningOnly: e }, errors: t }) => {
                    e ? r.push(...t) : n.push(...t)
                  }),
                  n.length ? Promise.reject({ name: t, errors: n, warnings: r }) : { name: t, errors: n, warnings: r }
                )
              }),
          )
        }
      })
      let f = yr(s)
      ;((this.lastValidatePromise = f),
        f
          .catch((e) => e)
          .then((e) => {
            let t = e.map(({ name: e }) => e)
            ;(this.notifyObservers(this.store, t, { type: `validateFinish` }), this.triggerOnFieldsChange(t, e))
          }))
      let p = f
        .then(() => (this.lastValidatePromise === f ? Promise.resolve(this.getFieldsValue(o)) : Promise.reject([])))
        .catch((e) => {
          let t = e.filter((e) => e && e.errors.length),
            n = t[0]?.errors?.[0]
          return Promise.reject({ message: n, values: this.getFieldsValue(a), errorFields: t, outOfDate: this.lastValidatePromise !== f })
        })
      p.catch((e) => e)
      let m = a.filter((e) => l.has(e.join(c)))
      return (this.triggerOnFieldsChange(m), p)
    }
    submit = () => {
      ;(this.warningUnhooked(),
        this.validateFields()
          .then((e) => {
            let { onFinish: t } = this.callbacks
            if (t)
              try {
                t(e)
              } catch (e) {
                console.error(e)
              }
          })
          .catch((e) => {
            let { onFinishFailed: t } = this.callbacks
            t && t(e)
          }))
    }
  }
function wr(e) {
  let t = Y.useRef(null),
    [, n] = Y.useState({})
  return (
    t.current ||
      (e
        ? (t.current = e)
        : (t.current = new Cr(() => {
            n({})
          }).getForm())),
    [t.current]
  )
}
var Tr = Y.createContext({ triggerFormChange: () => {}, triggerFormFinish: () => {}, registerForm: () => {}, unregisterForm: () => {} }),
  Er = ({ validateMessages: e, onFormChange: t, onFormFinish: n, children: r }) => {
    let i = Y.useContext(Tr),
      a = Y.useRef({})
    return Y.createElement(
      Tr.Provider,
      {
        value: {
          ...i,
          validateMessages: { ...i.validateMessages, ...e },
          triggerFormChange: (e, n) => {
            ;(t && t(e, { changedFields: n, forms: a.current }), i.triggerFormChange(e, n))
          },
          triggerFormFinish: (e, t) => {
            ;(n && n(e, { values: t, forms: a.current }), i.triggerFormFinish(e, t))
          },
          registerForm: (e, t) => {
            ;(e && (a.current = { ...a.current, [e]: t }), i.registerForm(e, t))
          },
          unregisterForm: (e) => {
            let t = { ...a.current }
            ;(delete t[e], (a.current = t), i.unregisterForm(e))
          },
        },
      },
      r,
    )
  }
function Dr() {
  return (
    (Dr = Object.assign
      ? Object.assign.bind()
      : function (e) {
          for (var t = 1; t < arguments.length; t++) {
            var n = arguments[t]
            for (var r in n) Object.prototype.hasOwnProperty.call(n, r) && (e[r] = n[r])
          }
          return e
        }),
    Dr.apply(this, arguments)
  )
}
var Or = (
  {
    name: e,
    initialValues: t,
    fields: n,
    form: r,
    preserve: i,
    children: a,
    component: o = `form`,
    validateMessages: s,
    validateTrigger: c = `onChange`,
    onValuesChange: l,
    onFieldsChange: u,
    onFinish: d,
    onFinishFailed: f,
    clearOnDestroy: p,
    ...m
  },
  h,
) => {
  let g = Y.useRef(null),
    _ = Y.useContext(Tr),
    [v] = wr(r),
    { useSubscribe: y, setInitialValues: b, setCallbacks: x, setValidateMessages: S, setPreserve: C, destroyForm: w } = v.getInternalHooks(Xt)
  ;(Y.useImperativeHandle(h, () => ({ ...v, nativeElement: g.current })),
    Y.useEffect(
      () => (
        _.registerForm(e, v),
        () => {
          _.unregisterForm(e)
        }
      ),
      [_, v, e],
    ),
    S({ ..._.validateMessages, ...s }),
    x({
      onValuesChange: l,
      onFieldsChange: (t, ...n) => {
        ;(_.triggerFormChange(e, t), u && u(t, ...n))
      },
      onFinish: (t) => {
        ;(_.triggerFormFinish(e, t), d && d(t))
      },
      onFinishFailed: f,
    }),
    C(i))
  let T = Y.useRef(null)
  ;(b(t, !T.current), (T.current ||= !0), Y.useEffect(() => () => w(p), []))
  let E,
    D = typeof a == `function`
  ;((E = D ? a(v.getFieldsValue(!0), v) : a), y(!D))
  let O = Y.useRef(null)
  Y.useEffect(() => {
    ;(or(O.current || [], n || []) || v.setFields(n || []), (O.current = n))
  }, [n, v])
  let k = Y.useMemo(() => ({ ...v, validateTrigger: c }), [v, c]),
    A = Y.createElement(Qt.Provider, { value: null }, Y.createElement(Zt.Provider, { value: k }, E))
  return o === !1
    ? A
    : Y.createElement(
        o,
        Dr({}, m, {
          ref: g,
          onSubmit: (e) => {
            ;(e.preventDefault(), e.stopPropagation(), v.submit())
          },
          onReset: (e) => {
            ;(e.preventDefault(), v.resetFields(), m.onReset?.(e))
          },
        }),
        A,
      )
}
function kr(e) {
  try {
    return JSON.stringify(e)
  } catch {
    return Math.random()
  }
}
function Ar(...e) {
  let [t, n = {}] = e,
    r = en(n) ? { form: n } : n,
    i = r.form,
    [a, o] = (0, Y.useState)(() => (typeof t == `function` ? t({}) : void 0)),
    s = (0, Y.useMemo)(() => kr(a), [a]),
    c = (0, Y.useRef)(s)
  c.current = s
  let l = (0, Y.useContext)(Zt),
    u = i || l,
    d = u && u._init,
    { getFieldsValue: f, getInternalHooks: p } = u,
    { registerWatch: m } = p(Xt),
    h = k((e, n) => {
      let i = r.preserve ? (n ?? f(!0)) : (e ?? f()),
        s = typeof t == `function` ? t(i) : J(i, $(t))
      kr(a) !== kr(s) && o(s)
    })
  return (
    (0, Y.useEffect)(() => {
      d && h()
    }, [d, typeof t == `function` ? t : JSON.stringify(t)]),
    (0, Y.useEffect)(() => {
      if (d)
        return m((e, t) => {
          h(e, t)
        })
    }, [d]),
    a
  )
}
var jr = Y.forwardRef(Or)
;((jr.FormProvider = Er), (jr.Field = _r), (jr.List = vr), (jr.useForm = wr), (jr.useWatch = Ar))
var Mr = Y.createContext({ labelAlign: `right`, layout: `horizontal`, itemRef: () => {} }),
  Nr = Y.createContext(null),
  Pr = (e) => {
    let t = pe(e, [`prefixCls`])
    return Y.createElement(Er, { ...t })
  },
  Fr = Y.createContext({ prefixCls: `` }),
  Ir = Y.createContext({}),
  Lr = ({ children: e, status: t, override: n }) => {
    let r = Y.useContext(Ir),
      i = Y.useMemo(() => {
        let e = { ...r }
        return (n && delete e.isFormItemInput, t && (delete e.status, delete e.hasFeedback, delete e.feedbackIcon), e)
      }, [t, n, r])
    return Y.createElement(Ir.Provider, { value: i }, e)
  },
  Rr = Y.createContext(void 0),
  zr = (e) => {
    let { space: t, form: n, children: r } = e
    if (!P(r)) return null
    let i = r
    return (n && (i = Y.createElement(Lr, { override: !0, status: !0 }, i)), t && (i = Y.createElement(W, null, i)), i)
  },
  Br = (e) => {
    if (De() && window.document.documentElement) {
      let t = Array.isArray(e) ? e : [e],
        { documentElement: n } = window.document
      return t.some((e) => e in n.style)
    }
    return !1
  },
  Vr = (e, t) => {
    if (!Br(e)) return !1
    let n = document.createElement(`div`),
      r = n.style[e]
    return ((n.style[e] = t), n.style[e] !== r)
  }
function Hr(e, t) {
  return !Array.isArray(e) && t !== void 0 ? Vr(e, t) : Br(e)
}
var Ur = () => De() && window.document.documentElement,
  Wr = (e) => {
    let { componentCls: t } = e
    return {
      [t]: {
        display: `flex`,
        flexFlow: `row wrap`,
        minWidth: 0,
        '&::before, &::after': { display: `flex` },
        '&-no-wrap': { flexWrap: `nowrap` },
        '&-start': { justifyContent: `flex-start` },
        '&-center': { justifyContent: `center` },
        '&-end': { justifyContent: `flex-end` },
        '&-space-between': { justifyContent: `space-between` },
        '&-space-around': { justifyContent: `space-around` },
        '&-space-evenly': { justifyContent: `space-evenly` },
        '&-top': { alignItems: `flex-start` },
        '&-middle': { alignItems: `center` },
        '&-bottom': { alignItems: `flex-end` },
      },
    }
  },
  Gr = (e) => {
    let { componentCls: t } = e
    return { [t]: { position: `relative`, maxWidth: `100%`, minHeight: 1 } }
  },
  Kr = (e, t) => {
    let { componentCls: n, gridColumns: r, antCls: i } = e,
      [a, o] = Se(i, `grid`),
      [, s] = Se(i, `col`),
      c = {}
    for (let e = r; e >= 0; e--)
      e === 0
        ? ((c[`${n}${t}-${e}`] = { display: `none` }),
          (c[`${n}-push-${e}`] = { insetInlineStart: `auto` }),
          (c[`${n}-pull-${e}`] = { insetInlineEnd: `auto` }),
          (c[`${n}${t}-push-${e}`] = { insetInlineStart: `auto` }),
          (c[`${n}${t}-pull-${e}`] = { insetInlineEnd: `auto` }),
          (c[`${n}${t}-offset-${e}`] = { marginInlineStart: 0 }),
          (c[`${n}${t}-order-${e}`] = { order: 0 }))
        : ((c[`${n}${t}-${e}`] = [
            { [a(`display`)]: `block`, display: `block` },
            { display: o(`display`), flex: `0 0 ${(e / r) * 100}%`, maxWidth: `${(e / r) * 100}%` },
          ]),
          (c[`${n}${t}-push-${e}`] = { insetInlineStart: `${(e / r) * 100}%` }),
          (c[`${n}${t}-pull-${e}`] = { insetInlineEnd: `${(e / r) * 100}%` }),
          (c[`${n}${t}-offset-${e}`] = { marginInlineStart: `${(e / r) * 100}%` }),
          (c[`${n}${t}-order-${e}`] = { order: e }))
    return ((c[`${n}${t}-flex`] = { flex: s(`${t.replace(/-/, ``)}-flex`) }), c)
  },
  qr = (e, t) => Kr(e, t),
  Jr = (e, t, n) => ({ [`@media (min-width: ${g(t)})`]: { ...qr(e, n) } }),
  Yr = () => ({}),
  Xr = () => ({}),
  Zr = z(`Grid`, Wr, Yr),
  Qr = (e) => ({ xs: e.screenXSMin, sm: e.screenSMMin, md: e.screenMDMin, lg: e.screenLGMin, xl: e.screenXLMin, xxl: e.screenXXLMin, xxxl: e.screenXXXLMin }),
  $r = z(
    `Grid`,
    (e) => {
      let t = S(e, { gridColumns: 24 }),
        n = Qr(t)
      return (
        delete n.xs,
        [
          Gr(t),
          qr(t, ``),
          qr(t, `-xs`),
          Object.keys(n)
            .map((e) => Jr(t, n[e], `-${e}`))
            .reduce((e, t) => ({ ...e, ...t }), {}),
        ]
      )
    },
    Xr,
  ),
  ei = (e) => {
    let { componentCls: t, notificationMarginEdge: n, animationMaxHeight: r } = e,
      i = `${t}-notice`,
      a = new v(`antNotificationFadeIn`, {
        '0%': { transform: `translate3d(100%, 0, 0)`, opacity: 0 },
        '100%': { transform: `translate3d(0, 0, 0)`, opacity: 1 },
      }),
      o = new v(`antNotificationTopFadeIn`, { '0%': { top: -r, opacity: 0 }, '100%': { top: 0, opacity: 1 } }),
      s = new v(`antNotificationBottomFadeIn`, { '0%': { bottom: e.calc(r).mul(-1).equal(), opacity: 0 }, '100%': { bottom: 0, opacity: 1 } }),
      c = new v(`antNotificationLeftFadeIn`, {
        '0%': { transform: `translate3d(-100%, 0, 0)`, opacity: 0 },
        '100%': { transform: `translate3d(0, 0, 0)`, opacity: 1 },
      })
    return {
      [t]: {
        [`&${t}-top, &${t}-bottom`]: { marginInline: 0, [i]: { marginInline: `auto auto` } },
        [`&${t}-top`]: { [`${t}-fade-enter${t}-fade-enter-active, ${t}-fade-appear${t}-fade-appear-active`]: { animationName: o } },
        [`&${t}-bottom`]: { [`${t}-fade-enter${t}-fade-enter-active, ${t}-fade-appear${t}-fade-appear-active`]: { animationName: s } },
        [`&${t}-topRight, &${t}-bottomRight`]: { [`${t}-fade-enter${t}-fade-enter-active, ${t}-fade-appear${t}-fade-appear-active`]: { animationName: a } },
        [`&${t}-topLeft, &${t}-bottomLeft`]: {
          marginRight: { value: 0, _skip_check_: !0 },
          marginLeft: { value: n, _skip_check_: !0 },
          [i]: { marginInlineEnd: `auto`, marginInlineStart: 0 },
          [`${t}-fade-enter${t}-fade-enter-active, ${t}-fade-appear${t}-fade-appear-active`]: { animationName: c },
        },
      },
    }
  },
  ti = [`top`, `topLeft`, `topRight`, `bottom`, `bottomLeft`, `bottomRight`],
  ni = { topLeft: `left`, topRight: `right`, bottomLeft: `left`, bottomRight: `right`, top: `left`, bottom: `left` },
  ri = (e, t) => {
    let { componentCls: n } = e
    return {
      [`${n}-${t}`]: { [`&${n}-stack > ${n}-notice-wrapper`]: { [t.startsWith(`top`) ? `top` : `bottom`]: 0, [ni[t]]: { value: 0, _skip_check_: !0 } } },
    }
  },
  ii = (e) => {
    let t = {}
    for (let n = 1; n < e.notificationStackLayer; n++)
      t[`&:nth-last-child(${n + 1})`] = { overflow: `hidden`, [`& > ${e.componentCls}-notice`]: { opacity: 0, transition: `opacity ${e.motionDurationMid}` } }
    return { [`&:not(:nth-last-child(-n+${e.notificationStackLayer}))`]: { opacity: 0, overflow: `hidden`, color: `transparent`, pointerEvents: `none` }, ...t }
  },
  ai = (e) => {
    let t = {}
    for (let n = 1; n < e.notificationStackLayer; n++)
      t[`&:nth-last-child(${n + 1})`] = { background: e.colorBgBlur, backdropFilter: `blur(10px)`, '-webkit-backdrop-filter': `blur(10px)` }
    return t
  },
  oi = (e) => {
    let { componentCls: t } = e
    return {
      [`${t}-stack`]: {
        [`& > ${t}-notice-wrapper`]: {
          transition: `transform ${e.motionDurationSlow}, backdrop-filter 0s`,
          willChange: `transform, opacity`,
          position: `absolute`,
          ...ii(e),
        },
      },
      [`${t}-stack:not(${t}-stack-expanded)`]: { [`& > ${t}-notice-wrapper`]: { ...ai(e) } },
      [`${t}-stack${t}-stack-expanded`]: {
        [`& > ${t}-notice-wrapper`]: {
          '&:not(:nth-last-child(-n + 1))': {
            opacity: 1,
            overflow: `unset`,
            color: `inherit`,
            pointerEvents: `auto`,
            [`& > ${e.componentCls}-notice`]: { opacity: 1 },
          },
          '&:after': {
            content: `""`,
            position: `absolute`,
            height: e.margin,
            width: `100%`,
            insetInline: 0,
            bottom: e.calc(e.margin).mul(-1).equal(),
            background: `transparent`,
            pointerEvents: `auto`,
          },
        },
      },
      ...ti.map((t) => ri(e, t)).reduce((e, t) => ({ ...e, ...t }), {}),
    }
  },
  si = (e) => {
    let {
        iconCls: t,
        componentCls: n,
        boxShadow: r,
        fontSizeLG: i,
        notificationMarginBottom: a,
        borderRadiusLG: o,
        colorSuccess: s,
        colorInfo: c,
        colorWarning: l,
        colorError: u,
        colorTextHeading: d,
        notificationBg: f,
        notificationPadding: p,
        notificationMarginEdge: m,
        progressBg: h,
        notificationProgressHeight: _,
        fontSize: v,
        lineHeight: y,
        width: b,
        notificationIconSize: x,
        colorText: S,
        colorSuccessBg: C,
        colorErrorBg: w,
        colorInfoBg: T,
        colorWarningBg: E,
        motionDurationMid: D,
      } = e,
      O = `${n}-notice`
    return {
      position: `relative`,
      marginBottom: a,
      marginInlineStart: `auto`,
      background: f,
      borderRadius: o,
      boxShadow: r,
      [O]: {
        padding: p,
        width: b,
        maxWidth: `calc(100vw - ${g(e.calc(m).mul(2).equal())})`,
        lineHeight: y,
        wordWrap: `break-word`,
        borderRadius: o,
        overflow: `hidden`,
        '&-success': C ? { background: C } : {},
        '&-error': w ? { background: w } : {},
        '&-info': T ? { background: T } : {},
        '&-warning': E ? { background: E } : {},
      },
      [`${O}-title`]: { marginBottom: e.marginXS, color: d, fontSize: i, lineHeight: e.lineHeightLG },
      [`${O}-description`]: { fontSize: v, color: S, marginTop: e.marginXS, '&:first-child': { marginTop: 0, marginInlineEnd: e.marginSM } },
      [`${O}-closable ${O}-title`]: { paddingInlineEnd: e.paddingLG },
      [`${O}-with-icon ${O}-title`]: { marginBottom: e.marginXS, marginInlineStart: e.calc(e.marginSM).add(x).equal(), fontSize: i },
      [`${O}-with-icon ${O}-description`]: { marginInlineStart: e.calc(e.marginSM).add(x).equal(), fontSize: v },
      [`${O}-icon`]: {
        position: `absolute`,
        fontSize: x,
        lineHeight: 1,
        [`&-success${t}`]: { color: s },
        [`&-info${t}`]: { color: c },
        [`&-warning${t}`]: { color: l },
        [`&-error${t}`]: { color: u },
      },
      [`${O}-close`]: {
        position: `absolute`,
        top: e.notificationPaddingVertical,
        insetInlineEnd: e.notificationPaddingHorizontal,
        color: e.colorIcon,
        outline: `none`,
        width: e.notificationCloseButtonSize,
        height: e.notificationCloseButtonSize,
        borderRadius: e.borderRadiusSM,
        transition: [`color`, `background-color`].map((e) => `${e} ${D}`).join(`, `),
        display: `flex`,
        alignItems: `center`,
        justifyContent: `center`,
        background: `none`,
        border: `none`,
        '&:hover': { color: e.colorIconHover, backgroundColor: e.colorBgTextHover },
        '&:active': { backgroundColor: e.colorBgTextActive },
        ...se(e),
      },
      [`${O}-progress`]: {
        position: `absolute`,
        display: `block`,
        appearance: `none`,
        inlineSize: `calc(100% - ${g(o)} * 2)`,
        left: { _skip_check_: !0, value: o },
        right: { _skip_check_: !0, value: o },
        bottom: 0,
        blockSize: _,
        border: 0,
        '&, &::-webkit-progress-bar': { borderRadius: o, backgroundColor: `rgba(0, 0, 0, 0.04)` },
        '&::-moz-progress-bar': { background: h },
        '&::-webkit-progress-value': { borderRadius: o, background: h },
      },
      [`${O}-actions`]: { float: `right`, marginTop: e.marginSM },
    }
  },
  ci = (e) => {
    let { componentCls: t, notificationMarginBottom: n, notificationMarginEdge: r, motionDurationMid: i, motionEaseInOut: a } = e,
      o = `${t}-notice`,
      s = new v(`antNotificationFadeOut`, {
        '0%': { maxHeight: e.animationMaxHeight, marginBottom: n },
        '100%': { maxHeight: 0, marginBottom: 0, paddingTop: 0, paddingBottom: 0, opacity: 0 },
      })
    return [
      {
        [t]: {
          ...G(e),
          position: `fixed`,
          zIndex: e.zIndexPopup,
          marginRight: { value: r, _skip_check_: !0 },
          [`${t}-hook-holder`]: { position: `relative` },
          [`${t}-fade-appear-prepare`]: { opacity: `0 !important` },
          [`${t}-fade-enter, ${t}-fade-appear`]: {
            animationDuration: e.motionDurationMid,
            animationTimingFunction: a,
            animationFillMode: `both`,
            opacity: 0,
            animationPlayState: `paused`,
          },
          [`${t}-fade-leave`]: { animationTimingFunction: a, animationFillMode: `both`, animationDuration: i, animationPlayState: `paused` },
          [`${t}-fade-enter${t}-fade-enter-active, ${t}-fade-appear${t}-fade-appear-active`]: { animationPlayState: `running` },
          [`${t}-fade-leave${t}-fade-leave-active`]: { animationName: s, animationPlayState: `running` },
          '&-rtl': { direction: `rtl`, [`${o}-actions`]: { float: `left` } },
        },
      },
      { [t]: { [`${o}-wrapper`]: si(e) } },
    ]
  },
  li = (e) => ({
    zIndexPopup: e.zIndexPopupBase + Ye + 50,
    width: 384,
    progressBg: `linear-gradient(90deg, ${e.colorPrimaryBorderHover}, ${e.colorPrimary})`,
    colorSuccessBg: void 0,
    colorErrorBg: void 0,
    colorInfoBg: void 0,
    colorWarningBg: void 0,
  }),
  ui = (e) => {
    let t = e.paddingMD,
      n = e.paddingLG
    return S(e, {
      notificationBg: e.colorBgElevated,
      notificationPaddingVertical: t,
      notificationPaddingHorizontal: n,
      notificationIconSize: e.calc(e.fontSizeLG).mul(e.lineHeightLG).equal(),
      notificationCloseButtonSize: e.calc(e.controlHeightLG).mul(0.55).equal(),
      notificationMarginBottom: e.margin,
      notificationPadding: `${g(e.paddingMD)} ${g(e.paddingContentHorizontalLG)}`,
      notificationMarginEdge: e.marginLG,
      animationMaxHeight: 150,
      notificationStackLayer: 3,
      notificationProgressHeight: 2,
    })
  },
  di = z(
    `Notification`,
    (e) => {
      let t = ui(e)
      return [ci(t), ei(t), oi(t)]
    },
    li,
  ),
  fi = U(
    [`Notification`, `PurePanel`],
    (e) => {
      let t = `${e.componentCls}-notice`,
        n = ui(e)
      return { [`${t}-pure-panel`]: { ...si(n), width: n.width, maxWidth: `calc(100vw - ${g(e.calc(n.notificationMarginEdge).mul(2).equal())})`, margin: 0 } }
    },
    li,
  )
function pi(e, t) {
  return t === null || t === !1 ? null : t || Y.createElement(Pe, { className: `${e}-close-icon` })
}
var mi = { success: ne, info: Re, error: ue, warning: be },
  hi = (e) => {
    let { prefixCls: t, icon: n, type: r, title: i, description: a, actions: o, role: s = `alert`, styles: c, classNames: l } = e,
      u = null
    return (
      n
        ? (u = Y.createElement(`span`, { className: H(`${t}-icon`, l.icon), style: c.icon }, n))
        : r && (u = Y.createElement(mi[r] || null, { className: H(`${t}-icon`, l.icon, `${t}-icon-${r}`), style: c.icon })),
      Y.createElement(
        `div`,
        { className: H({ [`${t}-with-icon`]: u }), role: s },
        u,
        i && Y.createElement(`div`, { className: H(`${t}-title`, l.title), style: c.title }, i),
        a && Y.createElement(`div`, { className: H(`${t}-description`, l.description), style: c.description }, a),
        o && Y.createElement(`div`, { className: H(`${t}-actions`, l.actions), style: c.actions }, o),
      )
    )
  },
  gi = (e) => {
    let {
        prefixCls: t,
        icon: r,
        type: i,
        message: a,
        title: o,
        description: s,
        btn: c,
        actions: l,
        closeIcon: u,
        className: d,
        style: f,
        styles: p,
        classNames: m,
        closable: h,
        ...g
      } = e,
      { getPrefixCls: v, className: y, style: b, classNames: x, styles: S } = Ce(`notification`),
      [C, w] = A([x, m], [S, p], { props: e }),
      { notification: T } = Y.useContext(n),
      E = l ?? c,
      D = o ?? a,
      O = t || v(`notification`),
      k = `${O}-notice`,
      j = et(O),
      [M, N] = di(O, j),
      [P, ee, , F] = Ke(Be(e), Be(T), { closable: !0, closeIcon: Y.createElement(Pe, { className: `${O}-close-icon` }), closeIconRender: (e) => pi(O, e) }),
      I = P ? { onClose: _(h) ? h?.onClose : void 0, closeIcon: ee, ...F } : !1
    return Y.createElement(
      `div`,
      { className: H(`${k}-pure-panel`, M, d, N, j, C.root), style: w.root },
      Y.createElement(fi, { prefixCls: O }),
      Y.createElement(nt, {
        style: { ...b, ...f },
        ...g,
        prefixCls: O,
        eventKey: `pure`,
        duration: null,
        closable: I,
        className: H(d, y),
        content: Y.createElement(hi, { classNames: C, styles: w, prefixCls: k, icon: r, type: i, title: D, description: s, actions: E }),
      }),
    )
  }
function _i(e, t, n) {
  let r
  switch (e) {
    case `top`:
      r = { left: `50%`, transform: `translateX(-50%)`, right: `auto`, top: t, bottom: `auto` }
      break
    case `topLeft`:
      r = { left: 0, top: t, bottom: `auto` }
      break
    case `topRight`:
      r = { right: 0, top: t, bottom: `auto` }
      break
    case `bottom`:
      r = { left: `50%`, transform: `translateX(-50%)`, right: `auto`, top: `auto`, bottom: n }
      break
    case `bottomLeft`:
      r = { left: 0, top: `auto`, bottom: n }
      break
    default:
      r = { right: 0, top: `auto`, bottom: n }
      break
  }
  return r
}
function vi(e) {
  return { motionName: `${e}-fade` }
}
function yi(e, t, n) {
  return e === void 0 ? (t?.closeIcon === void 0 ? n?.closeIcon : t.closeIcon) : e
}
var bi = 24,
  xi = 4.5,
  Si = `topRight`,
  Ci = ({ children: e, prefixCls: t }) => {
    let n = et(t),
      [r, i] = di(t, n)
    return Y.createElement(it, { classNames: { list: H(r, i, n) } }, e)
  },
  wi = (e, { prefixCls: t, key: n }) => Y.createElement(Ci, { prefixCls: t, key: n }, e),
  Ti = Y.forwardRef((e, t) => {
    let {
        top: r,
        bottom: i,
        prefixCls: a,
        getContainer: o,
        maxCount: s,
        rtl: c,
        onAllRemoved: l,
        stack: u,
        duration: f = xi,
        pauseOnHover: p = !0,
        showProgress: m,
      } = e,
      { getPrefixCls: h, getPopupContainer: g, direction: v } = Ce(`notification`),
      { notification: y } = (0, Y.useContext)(n),
      [, b] = I(),
      x = a || h(`notification`),
      S = (0, Y.useMemo)(() => (d(f) && f > 0 ? f : !1), [f]),
      [C, w] = ht({
        prefixCls: x,
        style: (e) => _i(e, r ?? bi, i ?? bi),
        className: () => H({ [`${x}-rtl`]: c ?? v === `rtl` }),
        motion: () => vi(x),
        closable: { closeIcon: pi(x) },
        duration: S,
        getContainer: () => o?.() || g?.() || document.body,
        maxCount: s,
        pauseOnHover: p,
        showProgress: m,
        onAllRemoved: l,
        renderNotifications: wi,
        stack: u === !1 ? !1 : { threshold: _(u) ? u?.threshold : void 0, offset: 8, gap: b.margin },
      }),
      [T, E] = A([y?.classNames, e?.classNames], [y?.styles, e?.styles], { props: e })
    return (Y.useImperativeHandle(t, () => ({ ...C, prefixCls: x, notification: y, classNames: T, styles: E })), w)
  })
function Ei(e) {
  let t = Y.useRef(null)
  xe(`Notification`)
  let { notification: r } = Y.useContext(n)
  return [
    Y.useMemo(() => {
      let n = (n) => {
          if (!t.current) return
          let { open: a, prefixCls: o, notification: s, classNames: c, styles: l } = t.current,
            u = s?.className || {},
            d = s?.style || {},
            f = `${o}-notice`,
            {
              title: m,
              message: h,
              description: g,
              icon: v,
              type: y,
              btn: b,
              actions: x,
              className: S,
              style: C,
              role: w = `alert`,
              closeIcon: T,
              closable: E,
              classNames: D = {},
              styles: O = {},
              ...k
            } = n,
            A = m ?? h,
            j = x ?? b,
            N = pi(f, yi(T, e, s)),
            [P, ee, , F] = Ge(Be({ ...(e || {}), ...n }), Be(r), { closable: !0, closeIcon: N }),
            I = P ? { onClose: _(E) ? E.onClose : void 0, closeIcon: ee, ...F } : !1,
            L = p(D, { props: n }),
            te = p(O, { props: n }),
            ne = i(void 0, c, L),
            re = M(l, te)
          return a({
            placement: e?.placement ?? Si,
            ...k,
            content: Y.createElement(hi, { prefixCls: f, icon: v, type: y, title: A, description: g, actions: j, role: w, classNames: ne, styles: re }),
            className: H({ [`${f}-${y}`]: y }, S, u, ne.root),
            style: { ...d, ...re.root, ...C },
            closable: I,
          })
        },
        a = {
          open: n,
          destroy: (e) => {
            e === void 0 ? t.current?.destroy() : t.current?.close(e)
          },
        }
      return (
        [`success`, `info`, `warning`, `error`].forEach((e) => {
          a[e] = (t) => n({ ...t, type: e })
        }),
        a
      )
    }, [e, r]),
    Y.createElement(Ti, { key: `notification-holder`, ...e, ref: t }),
  ]
}
function Di(e) {
  return Ei(e)
}
var Oi = Y.createContext({}),
  ki = Y.createContext({ message: {}, notification: {}, modal: {} }),
  Ai = (e, t, n) =>
    H({
      [`${e}-status-success`]: t === `success`,
      [`${e}-status-warning`]: t === `warning`,
      [`${e}-status-error`]: t === `error`,
      [`${e}-status-validating`]: t === `validating`,
      [`${e}-has-feedback`]: n,
    }),
  ji = (e, t) => t || e,
  Mi = (e, t, r) => {
    let { variant: i, [e]: a } = Y.useContext(n),
      o = Y.useContext(Rr),
      s = a?.variant,
      c
    c = t === void 0 ? (r === !1 ? `borderless` : (o ?? s ?? i ?? `outlined`)) : t
    let l = ae.includes(c)
    return [c, l]
  },
  Ni = {
    icon: {
      tag: `svg`,
      attrs: { viewBox: `64 64 896 896`, focusable: `false` },
      children: [
        {
          tag: `path`,
          attrs: {
            d: `M912 190h-69.9c-9.8 0-19.1 4.5-25.1 12.2L404.7 724.5 207 474a32 32 0 00-25.1-12.2H112c-6.7 0-10.4 7.7-6.3 12.9l273.9 347c12.8 16.2 37.4 16.2 50.3 0l488.4-618.9c4.1-5.1.4-12.8-6.3-12.8z`,
          },
        },
      ],
    },
    name: `check`,
    theme: `outlined`,
  }
function Pi() {
  return (
    (Pi = Object.assign
      ? Object.assign.bind()
      : function (e) {
          for (var t = 1; t < arguments.length; t++) {
            var n = arguments[t]
            for (var r in n) Object.prototype.hasOwnProperty.call(n, r) && (e[r] = n[r])
          }
          return e
        }),
    Pi.apply(this, arguments)
  )
}
var Fi = Y.forwardRef((e, t) => Y.createElement(q, Pi({}, e, { ref: t, icon: Ni }))),
  Ii = {
    icon: {
      tag: `svg`,
      attrs: { viewBox: `64 64 896 896`, focusable: `false` },
      children: [
        {
          tag: `path`,
          attrs: {
            d: `M909.6 854.5L649.9 594.8C690.2 542.7 712 479 712 412c0-80.2-31.3-155.4-87.9-212.1-56.6-56.7-132-87.9-212.1-87.9s-155.5 31.3-212.1 87.9C143.2 256.5 112 331.8 112 412c0 80.1 31.3 155.5 87.9 212.1C256.5 680.8 331.8 712 412 712c67 0 130.6-21.8 182.7-62l259.7 259.6a8.2 8.2 0 0011.6 0l43.6-43.5a8.2 8.2 0 000-11.6zM570.4 570.4C528 612.7 471.8 636 412 636s-116-23.3-158.4-65.6C211.3 528 188 471.8 188 412s23.3-116.1 65.6-158.4C296 211.3 352.2 188 412 188s116.1 23.2 158.4 65.6S636 352.2 636 412s-23.3 116.1-65.6 158.4z`,
          },
        },
      ],
    },
    name: `search`,
    theme: `outlined`,
  }
function Li() {
  return (
    (Li = Object.assign
      ? Object.assign.bind()
      : function (e) {
          for (var t = 1; t < arguments.length; t++) {
            var n = arguments[t]
            for (var r in n) Object.prototype.hasOwnProperty.call(n, r) && (e[r] = n[r])
          }
          return e
        }),
    Li.apply(this, arguments)
  )
}
var Ri = Y.forwardRef((e, t) => Y.createElement(q, Li({}, e, { ref: t, icon: Ii }))),
  zi = (e) => {
    let { children: t, prefixCls: n, id: r, classNames: i, styles: a, className: o, style: s } = e
    return Y.createElement(
      `div`,
      { id: r, className: H(`${n}-container`, i?.container, o), style: { ...a?.container, ...s }, role: `tooltip` },
      typeof t == `function` ? t() : t,
    )
  },
  Bi = { shiftX: 64, adjustY: 1 },
  Vi = { adjustX: 1, shiftY: !0 },
  Hi = [0, 0],
  Ui = {
    left: { points: [`cr`, `cl`], overflow: Vi, offset: [-4, 0], targetOffset: Hi },
    right: { points: [`cl`, `cr`], overflow: Vi, offset: [4, 0], targetOffset: Hi },
    top: { points: [`bc`, `tc`], overflow: Bi, offset: [0, -4], targetOffset: Hi },
    bottom: { points: [`tc`, `bc`], overflow: Bi, offset: [0, 4], targetOffset: Hi },
    topLeft: { points: [`bl`, `tl`], overflow: Bi, offset: [0, -4], targetOffset: Hi },
    leftTop: { points: [`tr`, `tl`], overflow: Vi, offset: [-4, 0], targetOffset: Hi },
    topRight: { points: [`br`, `tr`], overflow: Bi, offset: [0, -4], targetOffset: Hi },
    rightTop: { points: [`tl`, `tr`], overflow: Vi, offset: [4, 0], targetOffset: Hi },
    bottomRight: { points: [`tr`, `br`], overflow: Bi, offset: [0, 4], targetOffset: Hi },
    rightBottom: { points: [`bl`, `br`], overflow: Vi, offset: [4, 0], targetOffset: Hi },
    bottomLeft: { points: [`tl`, `bl`], overflow: Bi, offset: [0, 4], targetOffset: Hi },
    leftBottom: { points: [`br`, `bl`], overflow: Vi, offset: [-4, 0], targetOffset: Hi },
  }
function Wi() {
  return (
    (Wi = Object.assign
      ? Object.assign.bind()
      : function (e) {
          for (var t = 1; t < arguments.length; t++) {
            var n = arguments[t]
            for (var r in n) Object.prototype.hasOwnProperty.call(n, r) && (e[r] = n[r])
          }
          return e
        }),
    Wi.apply(this, arguments)
  )
}
var Gi = Y.forwardRef((e, t) => {
  let {
      trigger: n = [`hover`],
      mouseEnterDelay: r = 0,
      mouseLeaveDelay: i = 0.1,
      prefixCls: a = `rc-tooltip`,
      children: o,
      onVisibleChange: s,
      afterVisibleChange: c,
      motion: l,
      placement: u = `right`,
      align: d = {},
      destroyOnHidden: f = !1,
      defaultVisible: p,
      getTooltipContainer: m,
      arrowContent: h,
      overlay: g,
      id: _,
      showArrow: v = !0,
      classNames: b,
      styles: x,
      ...S
    } = e,
    C = y(_),
    w = (0, Y.useRef)(null)
  ;(0, Y.useImperativeHandle)(t, () => w.current)
  let E = { ...S }
  ;`visible` in e && (E.popupVisible = e.visible)
  let D = Y.useMemo(() => {
    if (!v) return !1
    let e = v === !0 ? {} : v
    return { ...e, className: H(e.className, b?.arrow), style: { ...e.style, ...x?.arrow }, content: e.content ?? h }
  }, [v, b?.arrow, x?.arrow, h])
  return Y.createElement(
    T,
    Wi(
      {
        popupClassName: b?.root,
        prefixCls: a,
        popup: Y.createElement(zi, { key: `content`, prefixCls: a, id: C, classNames: b, styles: x }, g),
        action: n,
        builtinPlacements: Ui,
        popupPlacement: u,
        ref: w,
        popupAlign: d,
        getPopupContainer: m,
        onOpenChange: s,
        afterOpenChange: c,
        popupMotion: l,
        defaultPopupVisible: p,
        autoDestroy: f,
        mouseLeaveDelay: i,
        popupStyle: x?.root,
        mouseEnterDelay: r,
        arrow: D,
        uniqueContainerClassName: b?.uniqueContainer,
        uniqueContainerStyle: x?.uniqueContainer,
      },
      E,
    ),
    ({ open: e }) => {
      let t = Y.Children.only(o),
        n = { 'aria-describedby': g && e ? C : void 0 }
      return Y.cloneElement(t, n)
    },
  )
})
function Ki(e) {
  let { sizePopupArrow: t, borderRadiusXS: n, borderRadiusOuter: r } = e,
    i = t / 2,
    a = i,
    o = (r * 1) / Math.sqrt(2),
    s = i - r * (1 - 1 / Math.sqrt(2)),
    c = i - (1 / Math.sqrt(2)) * n,
    l = r * (Math.sqrt(2) - 1) + (1 / Math.sqrt(2)) * n,
    u = 2 * i - c,
    d = l,
    f = 2 * i - o,
    p = s,
    m = 2 * i - 0,
    h = a,
    g = i * Math.sqrt(2) + r * (Math.sqrt(2) - 2),
    _ = r * (Math.sqrt(2) - 1),
    v = `polygon(${_}px 100%, 50% ${_}px, ${2 * i - _}px 100%, ${_}px 100%)`
  return {
    arrowShadowWidth: g,
    arrowPath: `path('M 0 ${a} A ${r} ${r} 0 0 0 ${o} ${s} L ${c} ${l} A ${n} ${n} 0 0 1 ${u} ${d} L ${f} ${p} A ${r} ${r} 0 0 0 ${m} ${h} Z')`,
    arrowPolygon: v,
  }
}
var qi = (e, t, n) => {
  let { sizePopupArrow: r, arrowPolygon: i, arrowPath: a, arrowShadowWidth: o, borderRadiusXS: s, calc: c } = e
  return {
    pointerEvents: `none`,
    width: r,
    height: r,
    overflow: `hidden`,
    '&::before': {
      position: `absolute`,
      bottom: 0,
      insetInlineStart: 0,
      width: r,
      height: c(r).div(2).equal(),
      background: t,
      clipPath: { _multi_value_: !0, value: [i, a] },
      content: `""`,
    },
    '&::after': {
      content: `""`,
      position: `absolute`,
      width: o,
      height: o,
      bottom: 0,
      insetInline: 0,
      margin: `auto`,
      borderRadius: { _skip_check_: !0, value: `0 0 ${g(s)} 0` },
      transform: `translateY(50%) rotate(-135deg)`,
      boxShadow: n,
      zIndex: 0,
      background: `transparent`,
    },
  }
}
function Ji(e) {
  let { contentRadius: t, limitVerticalRadius: n } = e,
    r = t > 12 ? t + 2 : 12
  return { arrowOffsetHorizontal: r, arrowOffsetVertical: n ? 8 : r }
}
function Yi(e, t) {
  return e ? t : {}
}
var Xi = (e, t, n) => {
  let { componentCls: r, boxShadowPopoverArrow: i, arrowOffsetVertical: a, arrowOffsetHorizontal: o, antCls: s } = e,
    [c] = Se(s, `tooltip`),
    { arrowDistance: l = 0, arrowPlacement: u = { left: !0, right: !0, top: !0, bottom: !0 } } = n || {}
  return {
    [r]: {
      [`${r}-arrow`]: [{ position: `absolute`, zIndex: 1, display: `block`, ...qi(e, t, i), '&:before': { background: t } }],
      ...Yi(!!u.top, {
        [[`&-placement-top > ${r}-arrow`, `&-placement-topLeft > ${r}-arrow`, `&-placement-topRight > ${r}-arrow`].join(`,`)]: {
          bottom: l,
          transform: `translateY(100%) rotate(180deg)`,
        },
        [`&-placement-top > ${r}-arrow`]: { left: { _skip_check_: !0, value: `50%` }, transform: `translateX(-50%) translateY(100%) rotate(180deg)` },
        '&-placement-topLeft': { [c(`arrow-offset-x`)]: o, [`> ${r}-arrow`]: { left: { _skip_check_: !0, value: o } } },
        '&-placement-topRight': { [c(`arrow-offset-x`)]: `calc(100% - ${g(o)})`, [`> ${r}-arrow`]: { right: { _skip_check_: !0, value: o } } },
      }),
      ...Yi(!!u.bottom, {
        [[`&-placement-bottom > ${r}-arrow`, `&-placement-bottomLeft > ${r}-arrow`, `&-placement-bottomRight > ${r}-arrow`].join(`,`)]: {
          top: l,
          transform: `translateY(-100%)`,
        },
        [`&-placement-bottom > ${r}-arrow`]: { left: { _skip_check_: !0, value: `50%` }, transform: `translateX(-50%) translateY(-100%)` },
        '&-placement-bottomLeft': { [c(`arrow-offset-x`)]: o, [`> ${r}-arrow`]: { left: { _skip_check_: !0, value: o } } },
        '&-placement-bottomRight': { [c(`arrow-offset-x`)]: `calc(100% - ${g(o)})`, [`> ${r}-arrow`]: { right: { _skip_check_: !0, value: o } } },
      }),
      ...Yi(!!u.left, {
        [[`&-placement-left > ${r}-arrow`, `&-placement-leftTop > ${r}-arrow`, `&-placement-leftBottom > ${r}-arrow`].join(`,`)]: {
          right: { _skip_check_: !0, value: l },
          transform: `translateX(100%) rotate(90deg)`,
        },
        [`&-placement-left > ${r}-arrow`]: { top: { _skip_check_: !0, value: `50%` }, transform: `translateY(-50%) translateX(100%) rotate(90deg)` },
        [`&-placement-leftTop > ${r}-arrow`]: { top: a },
        [`&-placement-leftBottom > ${r}-arrow`]: { bottom: a },
      }),
      ...Yi(!!u.right, {
        [[`&-placement-right > ${r}-arrow`, `&-placement-rightTop > ${r}-arrow`, `&-placement-rightBottom > ${r}-arrow`].join(`,`)]: {
          left: { _skip_check_: !0, value: l },
          transform: `translateX(-100%) rotate(-90deg)`,
        },
        [`&-placement-right > ${r}-arrow`]: { top: { _skip_check_: !0, value: `50%` }, transform: `translateY(-50%) translateX(-100%) rotate(-90deg)` },
        [`&-placement-rightTop > ${r}-arrow`]: { top: a },
        [`&-placement-rightBottom > ${r}-arrow`]: { bottom: a },
      }),
    },
  }
}
function Zi(e, t, n, r) {
  if (r === !1) return { adjustX: !1, adjustY: !1 }
  let i = _(r) ? r : {},
    a = {}
  switch (e) {
    case `top`:
    case `bottom`:
      ;((a.shiftX = t.arrowOffsetHorizontal * 2 + n), (a.shiftY = !0), (a.adjustY = !0))
      break
    case `left`:
    case `right`:
      ;((a.shiftY = t.arrowOffsetVertical * 2 + n), (a.shiftX = !0), (a.adjustX = !0))
      break
  }
  let o = { ...a, ...i }
  return (o.shiftX || (o.adjustX = !0), o.shiftY || (o.adjustY = !0), o)
}
var Qi = {
    left: { points: [`cr`, `cl`] },
    right: { points: [`cl`, `cr`] },
    top: { points: [`bc`, `tc`] },
    bottom: { points: [`tc`, `bc`] },
    topLeft: { points: [`bl`, `tl`] },
    leftTop: { points: [`tr`, `tl`] },
    topRight: { points: [`br`, `tr`] },
    rightTop: { points: [`tl`, `tr`] },
    bottomRight: { points: [`tr`, `br`] },
    rightBottom: { points: [`bl`, `br`] },
    bottomLeft: { points: [`tl`, `bl`] },
    leftBottom: { points: [`br`, `bl`] },
  },
  $i = {
    topLeft: { points: [`bl`, `tc`] },
    leftTop: { points: [`tr`, `cl`] },
    topRight: { points: [`br`, `tc`] },
    rightTop: { points: [`tl`, `cr`] },
    bottomRight: { points: [`tr`, `bc`] },
    rightBottom: { points: [`bl`, `cr`] },
    bottomLeft: { points: [`tl`, `bc`] },
    leftBottom: { points: [`br`, `cl`] },
  },
  ea = new Set([`topLeft`, `topRight`, `bottomLeft`, `bottomRight`, `leftTop`, `leftBottom`, `rightTop`, `rightBottom`])
function ta(e) {
  let { arrowWidth: t, autoAdjustOverflow: n, arrowPointAtCenter: r, offset: i, borderRadius: a, visibleFirst: o } = e,
    s = t / 2,
    c = {},
    l = Ji({ contentRadius: a, limitVerticalRadius: !0 })
  return (
    Object.keys(Qi).forEach((e) => {
      let a = { ...((r && $i[e]) || Qi[e]), offset: [0, 0], dynamicInset: !0 }
      switch (((c[e] = a), ea.has(e) && (a.autoArrow = !1), e)) {
        case `top`:
        case `topLeft`:
        case `topRight`:
          a.offset[1] = -s - i
          break
        case `bottom`:
        case `bottomLeft`:
        case `bottomRight`:
          a.offset[1] = s + i
          break
        case `left`:
        case `leftTop`:
        case `leftBottom`:
          a.offset[0] = -s - i
          break
        case `right`:
        case `rightTop`:
        case `rightBottom`:
          a.offset[0] = s + i
          break
      }
      if (r)
        switch (e) {
          case `topLeft`:
          case `bottomLeft`:
            a.offset[0] = -l.arrowOffsetHorizontal - s
            break
          case `topRight`:
          case `bottomRight`:
            a.offset[0] = l.arrowOffsetHorizontal + s
            break
          case `leftTop`:
          case `rightTop`:
            a.offset[1] = -l.arrowOffsetHorizontal * 2 + s
            break
          case `leftBottom`:
          case `rightBottom`:
            a.offset[1] = l.arrowOffsetHorizontal * 2 - s
            break
        }
      ;((a.overflow = Zi(e, l, t, n)), o && (a.htmlRegion = `visibleFirst`))
    }),
    c
  )
}
var na = Y.createContext(!1),
  ra = (e, t) => {
    let n = (e) => (typeof e == `boolean` ? { show: e } : e || {})
    return Y.useMemo(() => {
      let r = n(e),
        i = n(t)
      return { ...i, ...r, show: r.show ?? i.show ?? !0 }
    }, [e, t])
  },
  ia = `50%`,
  aa = (e) => {
    let {
        calc: t,
        componentCls: n,
        tooltipMaxWidth: r,
        tooltipColor: i,
        tooltipBg: a,
        tooltipBorderRadius: o,
        zIndexPopup: s,
        controlHeight: c,
        boxShadowSecondary: l,
        paddingSM: u,
        paddingXS: d,
        arrowOffsetHorizontal: f,
        sizePopupArrow: p,
        antCls: m,
      } = e,
      [h, _] = Se(m, `tooltip`),
      v = t(o).add(p).add(f).equal(),
      y = {
        minWidth: t(o).mul(2).add(p).equal(),
        minHeight: c,
        padding: `${g(e.calc(u).div(2).equal())} ${g(d)}`,
        color: _(`overlay-color`, i),
        textAlign: `start`,
        textDecoration: `none`,
        wordWrap: `break-word`,
        backgroundColor: a,
        borderRadius: o,
        boxShadow: l,
        boxSizing: `border-box`,
      },
      b = { [h(`valid-offset-x`)]: _(`arrow-offset-x`, `var(--arrow-x)`), transformOrigin: [_(`valid-offset-x`, ia), `var(--arrow-y, ${ia})`].join(` `) }
    return [
      {
        [n]: {
          ...G(e),
          position: `absolute`,
          zIndex: s,
          display: `block`,
          width: `max-content`,
          maxWidth: r,
          visibility: `visible`,
          ...b,
          '&-hidden': { display: `none` },
          [h(`arrow-background-color`)]: a,
          [`${n}-container`]: [y, bt(e, !0)],
          [`&:has(~ ${n}-unique-container)`]: { [`${n}-container`]: { border: `none`, background: `transparent`, boxShadow: `none` } },
          [[`&-placement-topLeft`, `&-placement-topRight`, `&-placement-bottomLeft`, `&-placement-bottomRight`].join(`,`)]: { minWidth: v },
          [[`&-placement-left`, `&-placement-leftTop`, `&-placement-leftBottom`, `&-placement-right`, `&-placement-rightTop`, `&-placement-rightBottom`].join(
            `,`,
          )]: { [`${n}-inner`]: { borderRadius: e.min(o, 8) } },
          [`${n}-content`]: { position: `relative` },
          ...je(e, (e, { darkColor: t }) => ({
            [`&${n}-${e}`]: { [`${n}-container`]: { backgroundColor: t }, [`${n}-arrow`]: { [h(`arrow-background-color`)]: t } },
          })),
          '&-rtl': { direction: `rtl` },
        },
      },
      Xi(e, _(`arrow-background-color`)),
      { [`${n}-pure`]: { position: `relative`, maxWidth: `none`, margin: e.sizePopupArrow } },
      {
        [`${n}-unique-container`]: {
          ...y,
          ...b,
          position: `absolute`,
          zIndex: t(s).sub(1).equal(),
          '&-hidden': { display: `none` },
          '&-visible': { transition: `all ${e.motionDurationSlow}` },
        },
      },
    ]
  },
  oa = (e) => ({
    zIndexPopup: e.zIndexPopupBase + 70,
    maxWidth: 250,
    ...Ji({ contentRadius: e.borderRadius, limitVerticalRadius: !0 }),
    ...Ki(S(e, { borderRadiusOuter: Math.min(e.borderRadiusOuter, 4) })),
  }),
  sa = (e, t, n = !0) =>
    z(
      `Tooltip`,
      (e) => {
        let { borderRadius: t, colorTextLightSolid: n, colorBgSpotlight: r, maxWidth: i } = e
        return [aa(S(e, { tooltipMaxWidth: i, tooltipColor: n, tooltipBorderRadius: t, tooltipBg: r })), Pt(e, `zoom-big-fast`)]
      },
      oa,
      { resetStyle: !1, injectStyle: n },
    )(e, t),
  ca = fe.map((e) => `${e}-inverse`),
  la = [`success`, `processing`, `error`, `default`, `warning`]
function ua(e, t = !0) {
  return t ? [].concat(ye(ca), ye(fe)).includes(e) : fe.includes(e)
}
function da(e) {
  return la.includes(e)
}
var fa = (e, t, n) => {
    let r = ua(n),
      [i] = Se(e, `tooltip`),
      a = H({ [`${t}-${n}`]: n && r }),
      o = {},
      s = {},
      c = L(n).toRgb(),
      l = (0.299 * c.r + 0.587 * c.g + 0.114 * c.b) / 255 < 0.5 ? `#FFF` : `#000`
    return (
      n && !r && ((o.background = n), (o[i(`overlay-color`)] = l), (s[i(`arrow-background-color`)] = n)),
      { className: a, overlayStyle: o, arrowStyle: s }
    )
  },
  pa = (e) => {
    let { prefixCls: t, className: r, placement: i = `top`, title: a, color: o, overlayInnerStyle: s, classNames: c, styles: l } = e,
      { getPrefixCls: u } = Y.useContext(n),
      d = u(`tooltip`, t),
      f = u(),
      p = et(d),
      [m, h] = sa(d, p),
      g = fa(f, d, o),
      _ = g.arrowStyle,
      v = Y.useMemo(() => ({ container: { ...s, ...g.overlayStyle } }), [s, g.overlayStyle]),
      y = { ...e, placement: i },
      [b, x] = A([c], [v, l], { props: y }),
      S = H(p, m, h, d, `${d}-pure`, `${d}-placement-${i}`, r, g.className)
    return Y.createElement(
      `div`,
      { className: S, style: _ },
      Y.createElement(`div`, { className: `${d}-arrow` }),
      Y.createElement(zi, { ...e, className: m, prefixCls: d, classNames: b, styles: x }, a),
    )
  },
  ma = Y.forwardRef((e, t) => {
    let {
        prefixCls: n,
        openClassName: r,
        getTooltipContainer: i,
        color: a,
        children: o,
        afterOpenChange: s,
        arrow: c,
        destroyTooltipOnHide: l,
        destroyOnHidden: u,
        title: d,
        overlay: f,
        trigger: p,
        builtinPlacements: m,
        autoAdjustOverflow: h = !0,
        motion: g,
        getPopupContainer: _,
        placement: v = `top`,
        mouseEnterDelay: y = 0.1,
        mouseLeaveDelay: b = 0.1,
        rootClassName: S,
        styles: C,
        classNames: w,
        onOpenChange: T,
        overlayInnerStyle: E,
        overlayStyle: D,
        overlayClassName: O,
        ...k
      } = e,
      [, j] = I(),
      M = e[`data-popover-inject`],
      { getPopupContainer: N, getPrefixCls: P, direction: ee, ...F } = Ce(`tooltip`),
      { className: L, style: te, classNames: ne, styles: R, arrow: z, trigger: ie } = M ? {} : F,
      B = ra(c, z),
      ae = B.show,
      oe = p || ie || `hover`,
      V = _ || N,
      se = u ?? !!l,
      ce = Y.useContext(na)
    xe(`Tooltip`)
    let le = Y.useRef(null),
      ue = () => {
        le.current?.forceAlign()
      }
    Y.useImperativeHandle(t, () => ({ forceAlign: ue, nativeElement: le.current?.nativeElement, popupElement: le.current?.popupElement }))
    let [fe, pe] = re(e.defaultOpen ?? !1, e.open),
      U = !d && !f && d !== 0,
      W = (e) => {
        ;(pe(U ? !1 : e), !U && T && T(e))
      },
      me = Y.useMemo(
        () =>
          m ||
          ta({
            arrowPointAtCenter: B?.pointAtCenter ?? !1,
            autoAdjustOverflow: h,
            arrowWidth: ae ? j.sizePopupArrow : 0,
            borderRadius: j.borderRadius,
            offset: j.marginXXS,
            visibleFirst: !0,
          }),
        [B, m, j, ae, h],
      ),
      G = Y.useMemo(() => (d === 0 ? d : f || d || ``), [f, d]),
      he = Y.createElement(zr, { space: !0, form: !0 }, typeof G == `function` ? G() : G),
      K = { ...e, trigger: oe, builtinPlacements: me, getPopupContainer: V, destroyOnHidden: se },
      [q, ge] = A([ne, w], [R, C], { props: K }),
      J = P(`tooltip`, n),
      _e = P(),
      ve = fe
    ;((!(`open` in e) && U) || ce) && (ve = !1)
    let ye = Y.isValidElement(o) && !x(o) ? o : Y.createElement(`span`, null, o),
      be = ye.props,
      Se = !be.className || typeof be.className == `string` ? H(be.className, r || `${J}-open`) : be.className,
      we = et(J),
      [Te, Ee] = sa(J, we, !M),
      De = fa(_e, J, a),
      ke = De.arrowStyle,
      Ae = H(we, Te, Ee),
      je = H(O, { [`${J}-rtl`]: ee === `rtl` }, De.className, S, Ae, L, q.root),
      [Me, Ne] = $e(`Tooltip`, k.zIndex),
      Pe = { ...ge.container, ...E, ...De.overlayStyle },
      Fe = Y.createElement(
        Gi,
        {
          unique: !0,
          ...k,
          zIndex: Me,
          showArrow: ae,
          placement: v,
          mouseEnterDelay: y,
          mouseLeaveDelay: b,
          prefixCls: J,
          classNames: { root: je, container: q.container, arrow: q.arrow, uniqueContainer: H(Ae, q.container) },
          styles: { root: { ...ke, ...ge.root, ...te, ...D }, container: Pe, uniqueContainer: Pe, arrow: ge.arrow },
          ref: le,
          overlay: he,
          visible: ve,
          onVisibleChange: W,
          afterVisibleChange: s,
          arrowContent: Y.createElement(`span`, { className: `${J}-arrow-content` }),
          motion: { motionName: Oe(_e, `zoom-big-fast`, typeof g?.motionName == `string` ? g?.motionName : void 0), motionDeadline: 1e3 },
          trigger: oe,
          builtinPlacements: me,
          getTooltipContainer: V,
          destroyOnHidden: se,
        },
        ve ? de(ye, { className: Se }) : ye,
      )
    return Y.createElement(qe.Provider, { value: Ne }, Fe)
  })
;((ma._InternalPanelDoNotUseOrYouWillBeFired = pa), (ma.UniqueProvider = r))
function ha(e) {
  return S(e, { inputAffixPadding: e.paddingXXS })
}
var ga = (e) => {
    let {
        controlHeight: t,
        fontSize: n,
        lineHeight: r,
        lineWidth: i,
        controlHeightSM: a,
        controlHeightLG: o,
        fontSizeLG: s,
        lineHeightLG: c,
        paddingSM: l,
        controlPaddingHorizontalSM: u,
        controlPaddingHorizontal: d,
        colorFillAlter: f,
        colorPrimaryHover: p,
        colorPrimary: m,
        controlOutlineWidth: h,
        controlOutline: g,
        colorErrorOutline: _,
        colorWarningOutline: v,
        colorBgContainer: y,
        inputFontSize: b,
        inputFontSizeLG: x,
        inputFontSizeSM: S,
      } = e,
      C = b || n,
      w = S || C,
      T = x || s,
      E = Math.round(((t - C * r) / 2) * 10) / 10 - i,
      D = Math.round(((a - w * r) / 2) * 10) / 10 - i,
      O = Math.ceil(((o - T * c) / 2) * 10) / 10 - i
    return {
      paddingBlock: Math.max(E, 0),
      paddingBlockSM: Math.max(D, 0),
      paddingBlockLG: Math.max(O, 0),
      paddingInline: l - i,
      paddingInlineSM: u - i,
      paddingInlineLG: d - i,
      addonBg: f,
      activeBorderColor: m,
      hoverBorderColor: p,
      activeShadow: `0 0 0 ${h}px ${g}`,
      errorActiveShadow: `0 0 0 ${h}px ${_}`,
      warningActiveShadow: `0 0 0 ${h}px ${v}`,
      hoverBg: y,
      activeBg: y,
      inputFontSize: C,
      inputFontSizeLG: T,
      inputFontSizeSM: w,
    }
  },
  _a = (e) => ({ borderColor: e.hoverBorderColor, backgroundColor: e.hoverBg }),
  va = (e) => ({
    color: e.colorTextDisabled,
    backgroundColor: e.colorBgContainerDisabled,
    borderColor: e.colorBorderDisabled,
    boxShadow: `none`,
    cursor: `not-allowed`,
    opacity: 1,
    'input[disabled], textarea[disabled]': { cursor: `not-allowed` },
    '&:hover:not([disabled])': { ..._a(S(e, { hoverBorderColor: e.colorBorderDisabled, hoverBg: e.colorBgContainerDisabled })) },
  }),
  ya = (e, t) => ({
    background: e.colorBgContainer,
    borderWidth: e.lineWidth,
    borderStyle: e.lineType,
    borderColor: t.borderColor,
    '&:hover': { borderColor: t.hoverBorderColor, backgroundColor: e.hoverBg },
    '&:focus, &:focus-within': { borderColor: t.activeBorderColor, boxShadow: t.activeShadow, outline: 0, backgroundColor: e.activeBg },
  }),
  ba = (e, t) => ({
    [`&${e.componentCls}-status-${t.status}:not(${e.componentCls}-disabled)`]: {
      ...ya(e, t),
      [`${e.componentCls}-prefix, ${e.componentCls}-suffix`]: { color: t.affixColor },
    },
    [`&${e.componentCls}-status-${t.status}${e.componentCls}-disabled`]: { borderColor: t.borderColor },
  }),
  xa = (e, t) => ({
    '&-outlined': {
      ...ya(e, { borderColor: e.colorBorder, hoverBorderColor: e.hoverBorderColor, activeBorderColor: e.activeBorderColor, activeShadow: e.activeShadow }),
      [`&${e.componentCls}-disabled, &[disabled]`]: { ...va(e) },
      ...ba(e, {
        status: `error`,
        borderColor: e.colorError,
        hoverBorderColor: e.colorErrorBorderHover,
        activeBorderColor: e.colorError,
        activeShadow: e.errorActiveShadow,
        affixColor: e.colorError,
      }),
      ...ba(e, {
        status: `warning`,
        borderColor: e.colorWarning,
        hoverBorderColor: e.colorWarningBorderHover,
        activeBorderColor: e.colorWarning,
        activeShadow: e.warningActiveShadow,
        affixColor: e.colorWarning,
      }),
      ...t,
    },
  }),
  Sa = (e, t) => ({
    [`&${e.componentCls}-group-wrapper-status-${t.status}`]: { [`${e.componentCls}-group-addon`]: { borderColor: t.addonBorderColor, color: t.addonColor } },
  }),
  Ca = (e) => ({
    '&-outlined': {
      [`${e.componentCls}-group`]: {
        '&-addon': { background: e.addonBg, border: `${g(e.lineWidth)} ${e.lineType} ${e.colorBorder}` },
        '&-addon:first-child': { borderInlineEnd: 0 },
        '&-addon:last-child': { borderInlineStart: 0 },
      },
      ...Sa(e, { status: `error`, addonBorderColor: e.colorError, addonColor: e.colorErrorText }),
      ...Sa(e, { status: `warning`, addonBorderColor: e.colorWarning, addonColor: e.colorWarningText }),
      [`&${e.componentCls}-group-wrapper-disabled`]: { [`${e.componentCls}-group-addon`]: { ...va(e) } },
    },
  }),
  wa = (e, t) => {
    let { componentCls: n } = e
    return {
      '&-borderless': {
        background: `transparent`,
        border: `none`,
        paddingBlock: e.calc(e.paddingBlock).add(e.lineWidth).equal(),
        [`&${n}-sm, &${n}-affix-wrapper-sm`]: { paddingBlock: e.calc(e.paddingBlockSM).add(e.lineWidth).equal() },
        [`&${n}-lg, &${n}-affix-wrapper-lg`]: { paddingBlock: e.calc(e.paddingBlockLG).add(e.lineWidth).equal() },
        '&:focus, &:focus-within': { outline: `none` },
        [`&${n}-disabled, &[disabled]`]: { color: e.colorTextDisabled, cursor: `not-allowed` },
        [`&${n}-status-error`]: { '&, & input, & textarea': { color: e.colorError } },
        [`&${n}-status-warning`]: { '&, & input, & textarea': { color: e.colorWarning } },
        ...t,
      },
    }
  },
  Ta = (e, t) => ({
    background: t.bg,
    borderWidth: e.lineWidth,
    borderStyle: e.lineType,
    borderColor: `transparent`,
    'input&, & input, textarea&, & textarea': { color: t?.inputColor ?? `unset` },
    '&:hover': { background: t.hoverBg },
    '&:focus, &:focus-within': { outline: 0, borderColor: t.activeBorderColor, backgroundColor: e.activeBg },
  }),
  Ea = (e, t) => ({
    [`&${e.componentCls}-status-${t.status}:not(${e.componentCls}-disabled)`]: {
      ...Ta(e, t),
      [`${e.componentCls}-prefix, ${e.componentCls}-suffix`]: { color: t.affixColor },
    },
  }),
  Da = (e, t) => ({
    '&-filled': {
      ...Ta(e, { bg: e.colorFillTertiary, hoverBg: e.colorFillSecondary, activeBorderColor: e.activeBorderColor, inputColor: e.colorText }),
      [`&${e.componentCls}-disabled, &[disabled]`]: { ...va(e) },
      ...Ea(e, {
        status: `error`,
        bg: e.colorErrorBg,
        hoverBg: e.colorErrorBgHover,
        activeBorderColor: e.colorError,
        inputColor: e.colorErrorText,
        affixColor: e.colorError,
      }),
      ...Ea(e, {
        status: `warning`,
        bg: e.colorWarningBg,
        hoverBg: e.colorWarningBgHover,
        activeBorderColor: e.colorWarning,
        inputColor: e.colorWarningText,
        affixColor: e.colorWarning,
      }),
      ...t,
    },
  }),
  Oa = (e, t) => ({
    [`&${e.componentCls}-group-wrapper-status-${t.status}`]: { [`${e.componentCls}-group-addon`]: { background: t.addonBg, color: t.addonColor } },
  }),
  ka = (e) => ({
    '&-filled': {
      [`${e.componentCls}-group-addon`]: { background: e.colorFillTertiary, '&:last-child': { position: `static` } },
      ...Oa(e, { status: `error`, addonBg: e.colorErrorBg, addonColor: e.colorErrorText }),
      ...Oa(e, { status: `warning`, addonBg: e.colorWarningBg, addonColor: e.colorWarningText }),
      [`&${e.componentCls}-group-wrapper-disabled`]: {
        [`${e.componentCls}-group`]: {
          '&-addon': { background: e.colorFillTertiary, color: e.colorTextDisabled },
          '&-addon:first-child': {
            borderInlineStart: `${g(e.lineWidth)} ${e.lineType} ${e.colorBorder}`,
            borderTop: `${g(e.lineWidth)} ${e.lineType} ${e.colorBorder}`,
            borderBottom: `${g(e.lineWidth)} ${e.lineType} ${e.colorBorder}`,
          },
          '&-addon:last-child': {
            borderInlineEnd: `${g(e.lineWidth)} ${e.lineType} ${e.colorBorder}`,
            borderTop: `${g(e.lineWidth)} ${e.lineType} ${e.colorBorder}`,
            borderBottom: `${g(e.lineWidth)} ${e.lineType} ${e.colorBorder}`,
          },
        },
      },
    },
  }),
  Aa = (e, t) => ({
    background: e.colorBgContainer,
    borderWidth: `${g(e.lineWidth)} 0`,
    borderStyle: `${e.lineType} none`,
    borderColor: `transparent transparent ${t.borderColor} transparent`,
    borderRadius: 0,
    '&:hover': { borderColor: `transparent transparent ${t.hoverBorderColor} transparent`, backgroundColor: e.hoverBg },
    '&:focus, &:focus-within': { borderColor: `transparent transparent ${t.activeBorderColor} transparent`, outline: 0, backgroundColor: e.activeBg },
  }),
  ja = (e, t) => ({
    [`&${e.componentCls}-status-${t.status}:not(${e.componentCls}-disabled)`]: {
      ...Aa(e, t),
      [`${e.componentCls}-prefix, ${e.componentCls}-suffix`]: { color: t.affixColor },
    },
    [`&${e.componentCls}-status-${t.status}${e.componentCls}-disabled`]: { borderColor: `transparent transparent ${t.borderColor} transparent` },
  }),
  Ma = (e, t) => ({
    '&-underlined': {
      ...Aa(e, { borderColor: e.colorBorder, hoverBorderColor: e.hoverBorderColor, activeBorderColor: e.activeBorderColor, activeShadow: e.activeShadow }),
      [`&${e.componentCls}-disabled, &[disabled]`]: {
        color: e.colorTextDisabled,
        boxShadow: `none`,
        cursor: `not-allowed`,
        '&:hover': { borderColor: `transparent transparent ${e.colorBorder} transparent` },
      },
      'input[disabled], textarea[disabled]': { cursor: `not-allowed` },
      ...ja(e, {
        status: `error`,
        borderColor: e.colorError,
        hoverBorderColor: e.colorErrorBorderHover,
        activeBorderColor: e.colorError,
        activeShadow: e.errorActiveShadow,
        affixColor: e.colorError,
      }),
      ...ja(e, {
        status: `warning`,
        borderColor: e.colorWarning,
        hoverBorderColor: e.colorWarningBorderHover,
        activeBorderColor: e.colorWarning,
        activeShadow: e.warningActiveShadow,
        affixColor: e.colorWarning,
      }),
      ...t,
    },
  }),
  Na = (e) => ({
    '&::-moz-placeholder': { opacity: 1 },
    '&::placeholder': { color: e, userSelect: `none` },
    '&:placeholder-shown': { textOverflow: `ellipsis` },
  }),
  Pa = (e) => {
    let { paddingBlockLG: t, lineHeightLG: n, borderRadiusLG: r, paddingInlineLG: i } = e
    return { padding: `${g(t)} ${g(i)}`, fontSize: e.inputFontSizeLG, lineHeight: n, borderRadius: r }
  },
  Fa = (e) => ({ padding: `${g(e.paddingBlockSM)} ${g(e.paddingInlineSM)}`, fontSize: e.inputFontSizeSM, borderRadius: e.borderRadiusSM }),
  Ia = (e, t = {}) => ({
    position: `relative`,
    display: `inline-block`,
    width: `100%`,
    minWidth: 0,
    padding: `${g(e.paddingBlock)} ${g(e.paddingInline)}`,
    color: e.colorText,
    fontSize: e.inputFontSize,
    lineHeight: e.lineHeight,
    borderRadius: e.borderRadius,
    transition: `all ${e.motionDurationMid}`,
    ...Na(e.colorTextPlaceholder),
    '&-lg': { ...Pa(e), ...t.largeStyle },
    '&-sm': { ...Fa(e), ...t.smallStyle },
    '&-rtl, &-textarea-rtl': { direction: `rtl` },
  }),
  La = (e) => {
    let { componentCls: t, antCls: n } = e
    return {
      position: `relative`,
      display: `table`,
      width: `100%`,
      borderCollapse: `separate`,
      borderSpacing: 0,
      "&[class*='col-']": { paddingInlineEnd: e.paddingXS, '&:last-child': { paddingInlineEnd: 0 } },
      [`&-lg ${t}, &-lg > ${t}-group-addon`]: { ...Pa(e) },
      [`&-sm ${t}, &-sm > ${t}-group-addon`]: { ...Fa(e) },
      [`&-lg ${n}-select-single`]: { height: e.controlHeightLG },
      [`&-sm ${n}-select-single`]: { height: e.controlHeightSM },
      [`> ${t}`]: { display: `table-cell`, '&:not(:first-child):not(:last-child)': { borderRadius: 0 } },
      [`${t}-group`]: {
        '&-addon, &-wrap': {
          display: `table-cell`,
          width: 1,
          whiteSpace: `nowrap`,
          verticalAlign: `middle`,
          '&:not(:first-child):not(:last-child)': { borderRadius: 0 },
        },
        '&-wrap > *': { display: `block !important` },
        '&-addon': {
          position: `relative`,
          padding: `0 ${g(e.paddingInline)}`,
          color: e.colorText,
          fontWeight: `normal`,
          fontSize: e.inputFontSize,
          textAlign: `center`,
          borderRadius: e.borderRadius,
          transition: `all ${e.motionDurationSlow}`,
          lineHeight: 1,
          [`${n}-select`]: {
            margin: `${g(e.calc(e.paddingBlock).add(1).mul(-1).equal())} ${g(e.calc(e.paddingInline).mul(-1).equal())}`,
            [`&${n}-select-single:not(${n}-select-customize-input):not(${n}-pagination-size-changer)`]: {
              backgroundColor: `inherit`,
              border: `${g(e.lineWidth)} ${e.lineType} transparent`,
              boxShadow: `none`,
            },
          },
          [`${n}-cascader-picker`]: {
            margin: `-9px ${g(e.calc(e.paddingInline).mul(-1).equal())}`,
            backgroundColor: `transparent`,
            [`${n}-cascader-input`]: { textAlign: `start`, border: 0, boxShadow: `none` },
          },
        },
      },
      [t]: {
        width: `100%`,
        marginBottom: 0,
        textAlign: `inherit`,
        '&:focus': { zIndex: 1, borderInlineEndWidth: 1 },
        '&:hover': { zIndex: 1, borderInlineEndWidth: 1 },
      },
      [`> ${t}:first-child, ${t}-group-addon:first-child`]: {
        borderStartEndRadius: 0,
        borderEndEndRadius: 0,
        [`${n}-select`]: { borderStartEndRadius: 0, borderEndEndRadius: 0 },
      },
      [`> ${t}-affix-wrapper`]: {
        [`&:not(:first-child) ${t}`]: { borderStartStartRadius: 0, borderEndStartRadius: 0 },
        [`&:not(:last-child) ${t}`]: { borderStartEndRadius: 0, borderEndEndRadius: 0 },
      },
      [`> ${t}:last-child, ${t}-group-addon:last-child`]: {
        borderStartStartRadius: 0,
        borderEndStartRadius: 0,
        [`${n}-select`]: { borderStartStartRadius: 0, borderEndStartRadius: 0 },
      },
      [`${t}-affix-wrapper`]: {
        '&:not(:last-child)': { borderStartEndRadius: 0, borderEndEndRadius: 0 },
        '&:not(:first-child)': { borderStartStartRadius: 0, borderEndStartRadius: 0 },
      },
      [`&${t}-group-compact`]: {
        display: `block`,
        ...Te(),
        [`${t}-group-addon, ${t}-group-wrap, > ${t}`]: {
          '&:not(:first-child):not(:last-child)': { borderInlineEndWidth: e.lineWidth, '&:hover, &:focus': { zIndex: 1 } },
        },
        '& > *': { display: `inline-flex`, float: `none`, verticalAlign: `top`, borderRadius: 0 },
        [`
        & > ${t}-affix-wrapper,
        & > ${t}-number-affix-wrapper,
        & > ${n}-picker-range
      `]: { display: `inline-flex` },
        '& > *:not(:last-child)': { marginInlineEnd: e.calc(e.lineWidth).mul(-1).equal(), borderInlineEndWidth: e.lineWidth },
        [t]: { float: `none` },
        [`& > ${n}-select,
      & > ${n}-select-auto-complete ${t},
      & > ${n}-cascader-picker ${t},
      & > ${t}-group-wrapper ${t}`]: { borderInlineEndWidth: e.lineWidth, borderRadius: 0, '&:hover, &:focus': { zIndex: 1 } },
        [`& > ${n}-select-focused`]: { zIndex: 1 },
        [`& > ${n}-select > ${n}-select-arrow`]: { zIndex: 1 },
        [`& > *:first-child,
      & > ${n}-select:first-child,
      & > ${n}-select-auto-complete:first-child ${t},
      & > ${n}-cascader-picker:first-child ${t}`]: { borderStartStartRadius: e.borderRadius, borderEndStartRadius: e.borderRadius },
        [`& > *:last-child,
      & > ${n}-select:last-child,
      & > ${n}-cascader-picker:last-child ${t},
      & > ${n}-cascader-picker-focused:last-child ${t}`]: {
          borderInlineEndWidth: e.lineWidth,
          borderStartEndRadius: e.borderRadius,
          borderEndEndRadius: e.borderRadius,
        },
        [`& > ${n}-select-auto-complete ${t}`]: { verticalAlign: `top` },
        [`${t}-group-wrapper + ${t}-group-wrapper`]: { marginInlineStart: e.calc(e.lineWidth).mul(-1).equal(), [`${t}-affix-wrapper`]: {} },
      },
    }
  },
  Ra = (e) => {
    let { componentCls: t, controlHeightSM: n, lineWidth: r, calc: i } = e,
      a = i(n).sub(i(r).mul(2)).sub(16).div(2).equal()
    return {
      [t]: {
        ...G(e),
        ...Ia(e),
        ...xa(e),
        ...Da(e),
        ...wa(e),
        ...Ma(e),
        '&[type="color"]': {
          height: e.controlHeight,
          [`&${t}-lg`]: { height: e.controlHeightLG },
          [`&${t}-sm`]: { height: n, paddingTop: a, paddingBottom: a },
        },
        '&[type="search"]::-webkit-search-cancel-button, &[type="search"]::-webkit-search-decoration': { appearance: `none` },
      },
    }
  },
  za = (e) => {
    let { componentCls: t } = e
    return {
      [`${t}-clear-icon`]: {
        margin: 0,
        padding: 0,
        lineHeight: 0,
        color: e.colorTextQuaternary,
        fontSize: e.fontSizeIcon,
        verticalAlign: -1,
        cursor: `pointer`,
        transition: `color ${e.motionDurationSlow}`,
        border: `none`,
        outline: `none`,
        backgroundColor: `transparent`,
        '&:hover': { color: e.colorIcon },
        '&:focus-visible': { color: e.colorIcon, borderRadius: e.borderRadiusSM, ...B(e) },
        '&:active': { color: e.colorText },
        '&-hidden': { visibility: `hidden` },
        '&-has-suffix': { margin: `0 ${g(e.inputAffixPadding)}` },
      },
    }
  },
  Ba = (e) => {
    let { componentCls: t, inputAffixPadding: n, colorTextDescription: r, motionDurationSlow: i, colorIcon: a, colorIconHover: o, iconCls: s } = e,
      c = `${t}-affix-wrapper`,
      l = `${t}-affix-wrapper-disabled`
    return {
      [c]: {
        ...Ia(e),
        display: `inline-flex`,
        '&-focused, &:focus': { zIndex: 1 },
        [`> input${t}`]: { padding: 0 },
        [`> input${t}, > textarea${t}`]: {
          fontSize: `inherit`,
          border: `none`,
          borderRadius: 0,
          outline: `none`,
          background: `transparent`,
          color: `inherit`,
          '&::-ms-reveal': { display: `none` },
          '&:focus': { boxShadow: `none !important` },
        },
        '&::before': { display: `inline-block`, width: 0, visibility: `hidden`, content: `"\\a0"` },
        [t]: {
          '&-prefix, &-suffix': { display: `flex`, flex: `none`, alignItems: `center`, '> *:not(:last-child)': { marginInlineEnd: e.paddingXS } },
          '&-show-count-suffix': { color: r, direction: `ltr` },
          '&-show-count-has-suffix': { marginInlineEnd: e.paddingXXS },
          '&-prefix': { marginInlineEnd: n },
          '&-suffix': { marginInlineStart: n },
        },
        ...za(e),
        [`${s}${t}-password-icon`]: { color: a, cursor: `pointer`, transition: `all ${i}`, '&:hover': { color: o } },
      },
      [`${t}-underlined`]: { borderRadius: 0 },
      [l]: { [`${s}${t}-password-icon`]: { color: a, cursor: `not-allowed`, '&:hover': { color: a } } },
    }
  },
  Va = (e) => {
    let { componentCls: t, borderRadiusLG: n, borderRadiusSM: r } = e
    return {
      [`${t}-group`]: {
        ...G(e),
        ...La(e),
        '&-rtl': { direction: `rtl` },
        '&-wrapper': {
          display: `inline-block`,
          width: `100%`,
          textAlign: `start`,
          verticalAlign: `top`,
          '&-rtl': { direction: `rtl` },
          '&-lg': { [`${t}-group-addon`]: { borderRadius: n, fontSize: e.inputFontSizeLG } },
          '&-sm': { [`${t}-group-addon`]: { borderRadius: r } },
          ...Ca(e),
          ...ka(e),
          [`&:not(${t}-compact-first-item):not(${t}-compact-last-item)${t}-compact-item`]: { [`${t}, ${t}-group-addon`]: { borderRadius: 0 } },
          [`&:not(${t}-compact-last-item)${t}-compact-first-item`]: { [`${t}, ${t}-group-addon`]: { borderStartEndRadius: 0, borderEndEndRadius: 0 } },
          [`&:not(${t}-compact-first-item)${t}-compact-last-item`]: { [`${t}, ${t}-group-addon`]: { borderStartStartRadius: 0, borderEndStartRadius: 0 } },
          [`&:not(${t}-compact-last-item)${t}-compact-item`]: { [`${t}-affix-wrapper`]: { borderStartEndRadius: 0, borderEndEndRadius: 0 } },
          [`&:not(${t}-compact-first-item)${t}-compact-item`]: { [`${t}-affix-wrapper`]: { borderStartStartRadius: 0, borderEndStartRadius: 0 } },
        },
      },
    }
  },
  Ha = (e) => {
    let { componentCls: t } = e
    return { [`${t}-out-of-range`]: { [`&, & input, & textarea, ${t}-show-count-suffix, ${t}-data-count`]: { color: e.colorError } } }
  },
  Ua = z(
    [`Input`, `Shared`],
    (e) => {
      let t = S(e, ha(e))
      return [Ra(t), Ba(t)]
    },
    ga,
    { resetFont: !1 },
  ),
  Wa = z(
    [`Input`, `Component`],
    (e) => {
      let t = S(e, ha(e))
      return [Va(t), Ha(t), ve(t, { focus: !0, focusElCls: `${t.componentCls}-affix-wrapper-focused` })]
    },
    ga,
    { resetFont: !1 },
  ),
  Ga = (e) => {
    let {
        componentCls: t,
        borderRadius: n,
        paddingSM: r,
        colorBorder: i,
        paddingXS: a,
        fontSizeLG: o,
        fontSizeSM: s,
        borderRadiusLG: c,
        borderRadiusSM: l,
        colorBgContainerDisabled: u,
        lineWidth: d,
        antCls: f,
      } = e,
      [p, m] = Se(f, `space`)
    return {
      [t]: [
        {
          display: `inline-flex`,
          alignItems: `center`,
          gap: 0,
          whiteSpace: `nowrap`,
          paddingInline: r,
          margin: 0,
          borderWidth: d,
          borderStyle: `solid`,
          borderRadius: n,
          '&:hover': { zIndex: 0 },
          [`&${t}-disabled`]: { color: e.colorTextDisabled },
          '&-large': { fontSize: o, borderRadius: c },
          '&-small': { paddingInline: a, borderRadius: l, fontSize: s },
          '&-compact-last-item': { borderEndStartRadius: 0, borderStartStartRadius: 0 },
          '&-compact-first-item': { borderEndEndRadius: 0, borderStartEndRadius: 0 },
          '&-compact-item:not(:first-child):not(:last-child)': { borderRadius: 0 },
          '&-compact-item:not(:last-child)': { borderInlineEndWidth: 0 },
          '&-compact-item:not(:first-child)': { borderInlineStartWidth: 0 },
        },
        {
          [p(`addon-border-color`)]: i,
          [p(`addon-background`)]: u,
          [p(`addon-border-color-outlined`)]: i,
          [p(`addon-background-filled`)]: u,
          borderColor: m(`addon-border-color`),
          background: m(`addon-background`),
          '&-variant-outlined': { [p(`addon-border-color`)]: m(`addon-border-color-outlined`) },
          '&-variant-filled': {
            [p(`addon-border-color`)]: `transparent`,
            [p(`addon-background`)]: m(`addon-background-filled`),
            [`&${t}-disabled`]: { [p(`addon-border-color`)]: i, [p(`addon-background`)]: u },
          },
          '&-variant-borderless': { border: `none`, background: `transparent` },
          '&-variant-underlined': { border: `none`, background: `transparent` },
        },
        {
          '&-status-error': { [p(`addon-border-color-outlined`)]: e.colorError, [p(`addon-background-filled`)]: e.colorErrorBg, color: e.colorError },
          '&-status-warning': { [p(`addon-border-color-outlined`)]: e.colorWarning, [p(`addon-background-filled`)]: e.colorWarningBg, color: e.colorWarning },
        },
      ],
    }
  },
  Ka = z([`Space`, `Addon`], (e) => [Ga(e), ve(e, { focus: !1 })]),
  qa = Y.forwardRef((e, t) => {
    let { className: r, children: i, style: a, prefixCls: o, variant: s = `outlined`, disabled: c, status: l, ...u } = e,
      { getPrefixCls: d, direction: f } = Y.useContext(n),
      p = d(`space-addon`, o),
      [m, h] = Ka(p),
      { compactItemClassnames: g, compactSize: _ } = le(p, f),
      v = Ai(p, l),
      y = H(p, m, g, h, `${p}-variant-${s}`, v, { [`${p}-${_}`]: _, [`${p}-disabled`]: c }, r)
    return Y.createElement(`div`, { ref: t, className: y, style: a, ...u }, i)
  })
function Ja(e) {
  return !!(e.addonBefore || e.addonAfter)
}
function Ya(e) {
  return !!(e.prefix || e.suffix || e.allowClear)
}
function Xa(e, t, n) {
  let r = t.cloneNode(!0),
    i = Object.create(e, { target: { value: r }, currentTarget: { value: r } })
  return (
    (r.value = n),
    typeof t.selectionStart == `number` && typeof t.selectionEnd == `number` && ((r.selectionStart = t.selectionStart), (r.selectionEnd = t.selectionEnd)),
    (r.setSelectionRange = (...e) => {
      t.setSelectionRange(...e)
    }),
    i
  )
}
function Za(e, t, n, r) {
  if (!n) return
  let i = t
  if (t.type === `click`) {
    ;((i = Xa(t, e, ``)), n(i))
    return
  }
  if (e.type !== `file` && r !== void 0) {
    ;((i = Xa(t, e, r)), n(i))
    return
  }
  n(i)
}
function Qa() {
  return (
    (Qa = Object.assign
      ? Object.assign.bind()
      : function (e) {
          for (var t = 1; t < arguments.length; t++) {
            var n = arguments[t]
            for (var r in n) Object.prototype.hasOwnProperty.call(n, r) && (e[r] = n[r])
          }
          return e
        }),
    Qa.apply(this, arguments)
  )
}
var $a = Y.forwardRef((e, t) => {
  let {
      inputElement: n,
      children: r,
      prefixCls: i,
      prefix: a,
      suffix: o,
      addonBefore: s,
      addonAfter: c,
      className: l,
      style: u,
      disabled: d,
      readOnly: f,
      focused: p,
      triggerFocus: m,
      allowClear: h,
      value: g,
      handleReset: _,
      hidden: v,
      classes: y,
      classNames: b,
      dataAttrs: x,
      styles: S,
      components: C,
      onClear: w,
    } = e,
    T = r ?? n,
    E = C?.affixWrapper || `span`,
    D = C?.groupWrapper || `span`,
    O = C?.wrapper || `span`,
    k = C?.groupAddon || `span`,
    A = (0, Y.useRef)(null),
    j = (e) => {
      A.current?.contains(e.target) && m?.()
    },
    M = Ya(e),
    N = (0, Y.cloneElement)(T, { value: g, className: H(T.props?.className, !M && b?.variant) || null }),
    P = (0, Y.useRef)(null)
  if ((Y.useImperativeHandle(t, () => ({ nativeElement: P.current || A.current })), M)) {
    let e = null
    if (h) {
      let t = !d && !f && g,
        n = `${i}-clear-icon`,
        r = typeof h == `object` && h?.clearIcon ? h.clearIcon : `✖`
      e = Y.createElement(
        `button`,
        {
          type: `button`,
          tabIndex: -1,
          onClick: (e) => {
            ;(_?.(e), w?.())
          },
          onMouseDown: (e) => e.preventDefault(),
          className: H(n, { [`${n}-hidden`]: !t, [`${n}-has-suffix`]: !!o }),
        },
        r,
      )
    }
    let t = `${i}-affix-wrapper`,
      n = H(
        t,
        { [`${i}-disabled`]: d, [`${t}-disabled`]: d, [`${t}-focused`]: p, [`${t}-readonly`]: f, [`${t}-input-with-clear-btn`]: o && h && g },
        y?.affixWrapper,
        b?.affixWrapper,
        b?.variant,
      ),
      r = (o || h) && Y.createElement(`span`, { className: H(`${i}-suffix`, b?.suffix), style: S?.suffix }, e, o)
    N = Y.createElement(
      E,
      Qa({ className: n, style: S?.affixWrapper, onClick: j }, x?.affixWrapper, { ref: A }),
      a && Y.createElement(`span`, { className: H(`${i}-prefix`, b?.prefix), style: S?.prefix }, a),
      N,
      r,
    )
  }
  if (Ja(e)) {
    let e = `${i}-group`,
      t = `${e}-addon`,
      n = `${e}-wrapper`,
      r = H(`${i}-wrapper`, e, y?.wrapper, b?.wrapper),
      a = H(n, { [`${n}-disabled`]: d }, y?.group, b?.groupWrapper)
    N = Y.createElement(
      D,
      { className: a, ref: P },
      Y.createElement(O, { className: r }, s && Y.createElement(k, { className: t }, s), N, c && Y.createElement(k, { className: t }, c)),
    )
  }
  return Y.cloneElement(N, { className: H(N.props?.className, l) || null, style: { ...N.props?.style, ...u }, hidden: v })
})
function eo(e, t) {
  return Y.useMemo(() => {
    let n = {}
    ;(t && (n.show = typeof t == `object` && t.formatter ? t.formatter : !!t), (n = { ...n, ...e }))
    let { show: r, ...i } = n
    return { ...i, show: !!r, showFormatter: typeof r == `function` ? r : void 0, strategy: i.strategy || ((e) => e.length) }
  }, [e, t])
}
function to() {
  return (
    (to = Object.assign
      ? Object.assign.bind()
      : function (e) {
          for (var t = 1; t < arguments.length; t++) {
            var n = arguments[t]
            for (var r in n) Object.prototype.hasOwnProperty.call(n, r) && (e[r] = n[r])
          }
          return e
        }),
    to.apply(this, arguments)
  )
}
var no = (0, Y.forwardRef)((e, t) => {
    let {
        autoComplete: n,
        onChange: r,
        onFocus: i,
        onBlur: a,
        onPressEnter: o,
        onKeyDown: s,
        onKeyUp: c,
        prefixCls: l = `rc-input`,
        disabled: u,
        htmlSize: d,
        className: f,
        maxLength: p,
        suffix: m,
        showCount: h,
        count: g,
        type: _ = `text`,
        classes: v,
        classNames: y,
        styles: b,
        onCompositionStart: x,
        onCompositionEnd: S,
        ...C
      } = e,
      [w, T] = (0, Y.useState)(!1),
      E = (0, Y.useRef)(!1),
      D = (0, Y.useRef)(!1),
      O = (0, Y.useRef)(null),
      k = (0, Y.useRef)(null),
      A = (e) => {
        O.current && Lt(O.current, e)
      },
      [j, M] = re(e.defaultValue, e.value),
      N = j == null ? `` : String(j),
      [P, ee] = (0, Y.useState)(null),
      F = eo(g, h),
      I = F.max || p,
      L = F.strategy(N),
      te = !!I && L > I
    ;((0, Y.useImperativeHandle)(t, () => ({
      focus: A,
      blur: () => {
        O.current?.blur()
      },
      setSelectionRange: (e, t, n) => {
        O.current?.setSelectionRange(e, t, n)
      },
      select: () => {
        O.current?.select()
      },
      input: O.current,
      nativeElement: k.current?.nativeElement || O.current,
    })),
      (0, Y.useEffect)(() => {
        ;((D.current &&= !1), T((e) => (e && u ? !1 : e)))
      }, [u]))
    let ne = (e, t, n) => {
      let i = t
      if (!E.current && F.exceedFormatter && F.max && F.strategy(t) > F.max)
        ((i = F.exceedFormatter(t, { max: F.max })), t !== i && ee([O.current?.selectionStart || 0, O.current?.selectionEnd || 0]))
      else if (n.source === `compositionEnd`) return
      ;(M(i), O.current && Za(O.current, e, r, i))
    }
    ;(0, Y.useEffect)(() => {
      P && O.current?.setSelectionRange(...P)
    }, [P])
    let R = (e) => {
        ne(e, e.target.value, { source: `change` })
      },
      z = (e) => {
        ;((E.current = !1), ne(e, e.currentTarget.value, { source: `compositionEnd` }), S?.(e))
      },
      ie = (e) => {
        ;(o && e.key === `Enter` && !D.current && !e.nativeEvent.isComposing && ((D.current = !0), o(e)), s?.(e))
      },
      B = (e) => {
        ;(e.key === `Enter` && (D.current = !1), c?.(e))
      },
      ae = (e) => {
        ;(T(!0), i?.(e))
      },
      oe = (e) => {
        ;((D.current &&= !1), T(!1), a?.(e))
      },
      V = (e) => {
        ;(M(``), A(), O.current && Za(O.current, e, r))
      },
      se = te && `${l}-out-of-range`
    return Y.createElement(
      $a,
      to({}, C, {
        prefixCls: l,
        className: H(f, se),
        handleReset: V,
        value: N,
        focused: w,
        triggerFocus: A,
        suffix: (() => {
          let e = Number(I) > 0
          if (m || F.show) {
            let t = F.showFormatter ? F.showFormatter({ value: N, count: L, maxLength: I }) : `${L}${e ? ` / ${I}` : ``}`
            return Y.createElement(
              Y.Fragment,
              null,
              F.show &&
                Y.createElement(
                  `span`,
                  { className: H(`${l}-show-count-suffix`, { [`${l}-show-count-has-suffix`]: !!m }, y?.count), style: { ...b?.count } },
                  t,
                ),
              m,
            )
          }
          return null
        })(),
        disabled: u,
        classes: v,
        classNames: y,
        styles: b,
        ref: k,
      }),
      (() => {
        let t = pe(e, [
          `prefixCls`,
          `onPressEnter`,
          `addonBefore`,
          `addonAfter`,
          `prefix`,
          `suffix`,
          `allowClear`,
          `defaultValue`,
          `showCount`,
          `count`,
          `classes`,
          `htmlSize`,
          `styles`,
          `classNames`,
          `onClear`,
        ])
        return Y.createElement(
          `input`,
          to({ autoComplete: n }, t, {
            onChange: R,
            onFocus: ae,
            onBlur: oe,
            onKeyDown: ie,
            onKeyUp: B,
            className: H(l, { [`${l}-disabled`]: u }, y?.input),
            style: b?.input,
            ref: O,
            size: d,
            type: _,
            onCompositionStart: (e) => {
              ;((E.current = !0), x?.(e))
            },
            onCompositionEnd: z,
          }),
        )
      })(),
    )
  }),
  ro = (e) => {
    let t
    return (_(e) && e?.clearIcon ? (t = e) : e && (t = { clearIcon: Y.createElement(ue, null) }), t)
  }
function io(e, t) {
  let n = (0, Y.useRef)([]),
    r = () => {
      n.current.push(
        setTimeout(() => {
          e.current?.input &&
            e.current?.input.getAttribute(`type`) === `password` &&
            e.current?.input.hasAttribute(`value`) &&
            e.current?.input.removeAttribute(`value`)
        }),
      )
    }
  return (
    (0, Y.useEffect)(
      () => (
        t && r(),
        () =>
          n.current.forEach((e) => {
            e && clearTimeout(e)
          })
      ),
      [],
    ),
    r
  )
}
function ao(e) {
  return !!(e.prefix || e.suffix || e.allowClear || e.showCount)
}
var oo = (0, Y.forwardRef)((e, t) => {
  let {
      prefixCls: n,
      bordered: r = !0,
      status: i,
      size: a,
      disabled: o,
      onBlur: s,
      onFocus: c,
      suffix: l,
      allowClear: u,
      addonAfter: d,
      addonBefore: f,
      className: p,
      style: m,
      styles: h,
      rootClassName: g,
      onChange: _,
      classNames: v,
      variant: y,
      ...b
    } = e,
    { getPrefixCls: x, direction: S, allowClear: C, autoComplete: T, className: E, style: D, classNames: O, styles: k } = Ce(`input`),
    j = x(`input`, n),
    M = (0, Y.useRef)(null),
    N = et(j),
    [P, ee] = Ua(j, g)
  Wa(j, N)
  let { compactSize: F, compactItemClassnames: I } = le(j, S),
    L = ce((e) => a ?? F ?? e),
    te = Y.useContext(w),
    ne = o ?? te,
    re = { ...e, size: L, disabled: ne },
    [R, z] = A([O, v], [k, h], { props: re }),
    { status: ie, hasFeedback: B, feedbackIcon: ae } = (0, Y.useContext)(Ir),
    oe = ji(ie, i)
  ;(0, Y.useRef)(ao(e) || !!B)
  let V = io(M, !0),
    se = (e) => {
      ;(V(), s?.(e))
    },
    ue = (e) => {
      ;(V(), c?.(e))
    },
    de = (e) => {
      ;(V(), _?.(e))
    },
    fe = (B || l) && Y.createElement(Y.Fragment, null, l, B && ae),
    pe = ro(u ?? C),
    [U, W] = Mi(`input`, y, r)
  return Y.createElement(no, {
    ref: me(t, M),
    prefixCls: j,
    autoComplete: T,
    ...b,
    disabled: ne,
    onBlur: se,
    onFocus: ue,
    style: { ...z.root, ...D, ...m },
    styles: z,
    suffix: fe,
    allowClear: pe,
    className: H(p, g, ee, N, I, E, R.root),
    onChange: de,
    addonBefore: f && Y.createElement(zr, { form: !0, space: !0 }, f),
    addonAfter: d && Y.createElement(zr, { form: !0, space: !0 }, d),
    classNames: {
      ...R,
      input: H({ [`${j}-sm`]: L === `small`, [`${j}-lg`]: L === `large`, [`${j}-rtl`]: S === `rtl` }, R.input, P),
      variant: H({ [`${j}-${U}`]: W }, Ai(j, oe)),
      affixWrapper: H({ [`${j}-affix-wrapper-sm`]: L === `small`, [`${j}-affix-wrapper-lg`]: L === `large`, [`${j}-affix-wrapper-rtl`]: S === `rtl` }, P),
      wrapper: H({ [`${j}-group-rtl`]: S === `rtl` }, P),
      groupWrapper: H(
        {
          [`${j}-group-wrapper-sm`]: L === `small`,
          [`${j}-group-wrapper-lg`]: L === `large`,
          [`${j}-group-wrapper-rtl`]: S === `rtl`,
          [`${j}-group-wrapper-${U}`]: W,
        },
        Ai(`${j}-group-wrapper`, oe, B),
        P,
      ),
    },
  })
})
function so(e) {
  return [`small`, `middle`, `medium`, `large`].includes(e)
}
function co(e) {
  return e ? d(e) : !1
}
var lo = Y.createContext({ latestIndex: 0 }),
  uo = lo.Provider,
  fo = (e) => {
    let { className: t, prefix: n, index: r, children: i, separator: a, style: o, classNames: s, styles: c } = e,
      { latestIndex: l } = Y.useContext(lo)
    return P(i)
      ? Y.createElement(
          Y.Fragment,
          null,
          Y.createElement(`div`, { className: t, style: o }, i),
          r < l && a && Y.createElement(`span`, { className: H(`${n}-item-separator`, s?.separator), style: c?.separator }, a),
        )
      : null
  },
  po = (e) => {
    let { componentCls: t, antCls: n } = e
    return {
      [t]: {
        display: `inline-flex`,
        '&-rtl': { direction: `rtl` },
        '&-vertical': { flexDirection: `column` },
        '&-align': {
          flexDirection: `column`,
          '&-center': { alignItems: `center` },
          '&-start': { alignItems: `flex-start` },
          '&-end': { alignItems: `flex-end` },
          '&-baseline': { alignItems: `baseline` },
        },
        [`${t}-item:empty`]: { display: `none` },
        [`${t}-item > ${n}-badge-not-a-wrapper:only-child`]: { display: `block` },
      },
    }
  },
  mo = (e) => {
    let { componentCls: t } = e
    return {
      [t]: {
        '&-gap-row-small': { rowGap: e.spaceGapSmallSize },
        '&-gap-row-medium, &-gap-row-middle': { rowGap: e.spaceGapMiddleSize },
        '&-gap-row-large': { rowGap: e.spaceGapLargeSize },
        '&-gap-col-small': { columnGap: e.spaceGapSmallSize },
        '&-gap-col-medium, &-gap-col-middle': { columnGap: e.spaceGapMiddleSize },
        '&-gap-col-large': { columnGap: e.spaceGapLargeSize },
      },
    }
  },
  ho = z(
    `Space`,
    (e) => {
      let t = S(e, { spaceGapSmallSize: e.paddingXS, spaceGapMiddleSize: e.padding, spaceGapLargeSize: e.paddingLG })
      return [po(t), mo(t)]
    },
    () => ({}),
    { resetStyle: !1 },
  ),
  go = Y.forwardRef((e, t) => {
    let { getPrefixCls: n, direction: r, size: i, className: a, style: o, classNames: s, styles: c } = Ce(`space`),
      {
        size: l = i ?? `small`,
        align: u,
        className: d,
        rootClassName: f,
        children: p,
        direction: m,
        orientation: h,
        prefixCls: g,
        split: _,
        separator: v,
        style: y,
        vertical: b,
        wrap: x = !1,
        classNames: S,
        styles: C,
        ...w
      } = e,
      [T, E] = Array.isArray(l) ? l : [l, l],
      D = so(E),
      O = so(T),
      k = co(E),
      j = co(T),
      M = R(p, { keepEmpty: !0 }),
      [N, ee] = ke(h, b, m),
      F = u === void 0 && !ee ? `center` : u,
      I = v ?? _,
      L = n(`space`, g),
      [te, ne] = ho(L),
      re = { ...e, size: l, orientation: N, align: F },
      [z, ie] = A([s, S], [c, C], { props: re }),
      B = H(L, a, te, `${L}-${N}`, { [`${L}-rtl`]: r === `rtl`, [`${L}-align-${F}`]: F, [`${L}-gap-row-${E}`]: D, [`${L}-gap-col-${T}`]: O }, d, f, ne, z.root),
      ae = H(`${L}-item`, z.item),
      oe = M.map((e, t) => {
        let n = e?.key || `${ae}-${t}`
        return Y.createElement(fo, { prefix: L, classNames: z, styles: ie, className: ae, key: n, index: t, separator: I, style: ie.item }, e)
      }),
      V = Y.useMemo(() => ({ latestIndex: M.reduce((e, t, n) => (P(t) ? n : e), 0) }), [M])
    if (M.length === 0) return null
    let se = {}
    return (
      x && (se.flexWrap = `wrap`),
      !O && j && (se.columnGap = T),
      !D && k && (se.rowGap = E),
      Y.createElement(`div`, { ref: t, className: B, style: { ...se, ...ie.root, ...o, ...y }, ...w }, Y.createElement(uo, { value: V }, oe))
    )
  })
;((go.Compact = ge), (go.Addon = qa))
var _o = `
  min-height:0 !important;
  max-height:none !important;
  height:0 !important;
  visibility:hidden !important;
  overflow:hidden !important;
  position:absolute !important;
  z-index:-1000 !important;
  top:0 !important;
  right:0 !important;
  pointer-events: none !important;
`,
  vo = [
    `letter-spacing`,
    `line-height`,
    `padding-top`,
    `padding-bottom`,
    `font-family`,
    `font-weight`,
    `font-size`,
    `font-variant`,
    `text-rendering`,
    `text-transform`,
    `width`,
    `text-indent`,
    `padding-left`,
    `padding-right`,
    `border-width`,
    `box-sizing`,
    `word-break`,
    `white-space`,
  ],
  yo = {},
  bo
function xo(e, t = !1) {
  let n = e.getAttribute(`id`) || e.getAttribute(`data-reactid`) || e.getAttribute(`name`)
  if (t && yo[n]) return yo[n]
  let r = window.getComputedStyle(e),
    i = r.getPropertyValue(`box-sizing`) || r.getPropertyValue(`-moz-box-sizing`) || r.getPropertyValue(`-webkit-box-sizing`),
    a = parseFloat(r.getPropertyValue(`padding-bottom`)) + parseFloat(r.getPropertyValue(`padding-top`)),
    o = parseFloat(r.getPropertyValue(`border-bottom-width`)) + parseFloat(r.getPropertyValue(`border-top-width`)),
    s = { sizingStyle: vo.map((e) => `${e}:${r.getPropertyValue(e)}`).join(`;`), paddingSize: a, borderSize: o, boxSizing: i }
  return (t && n && (yo[n] = s), s)
}
function So(e, t = !1, n = null, r = null) {
  ;(bo ||
    ((bo = document.createElement(`textarea`)),
    bo.setAttribute(`tab-index`, `-1`),
    bo.setAttribute(`aria-hidden`, `true`),
    bo.setAttribute(`name`, `hiddenTextarea`),
    document.body.appendChild(bo)),
    e.getAttribute(`wrap`) ? bo.setAttribute(`wrap`, e.getAttribute(`wrap`)) : bo.removeAttribute(`wrap`))
  let { paddingSize: i, borderSize: a, boxSizing: o, sizingStyle: s } = xo(e, t)
  ;(bo.setAttribute(`style`, `${s};${_o}`), (bo.value = e.value || e.placeholder || ``))
  let c,
    l,
    u,
    d = bo.scrollHeight
  if ((o === `border-box` ? (d += a) : o === `content-box` && (d -= i), n !== null || r !== null)) {
    bo.value = ` `
    let e = bo.scrollHeight - i
    ;(n !== null && ((c = e * n), o === `border-box` && (c = c + i + a), (d = Math.max(c, d))),
      r !== null && ((l = e * r), o === `border-box` && (l = l + i + a), (u = d > l ? `` : `hidden`), (d = Math.min(l, d))))
  }
  let f = { height: d, overflowY: u, resize: `none` }
  return (c && (f.minHeight = c), l && (f.maxHeight = l), f)
}
function Co() {
  return (
    (Co = Object.assign
      ? Object.assign.bind()
      : function (e) {
          for (var t = 1; t < arguments.length; t++) {
            var n = arguments[t]
            for (var r in n) Object.prototype.hasOwnProperty.call(n, r) && (e[r] = n[r])
          }
          return e
        }),
    Co.apply(this, arguments)
  )
}
var wo = 0,
  To = 1,
  Eo = 2,
  Do = Y.forwardRef((e, t) => {
    let {
        prefixCls: n,
        defaultValue: r,
        value: i,
        autoSize: a,
        onResize: o,
        className: s,
        style: c,
        disabled: l,
        onChange: u,
        onInternalAutoSize: d,
        ...f
      } = e,
      [p, m] = re(r, i),
      h = p ?? ``,
      g = (e) => {
        ;(m(e.target.value), u?.(e))
      },
      _ = Y.useRef()
    Y.useImperativeHandle(t, () => ({ textArea: _.current }))
    let [v, y] = Y.useMemo(() => (a && typeof a == `object` ? [a.minRows, a.maxRows] : []), [a]),
      b = !!a,
      [x, S] = Y.useState(Eo),
      [C, w] = Y.useState(),
      T = () => {
        S(wo)
      }
    ;(O(() => {
      b && T()
    }, [i, v, y, b]),
      O(() => {
        if (x === wo) S(To)
        else if (x === To) {
          let e = So(_.current, !1, v, y)
          ;(S(Eo), w(e))
        }
      }, [x]))
    let E = Y.useRef(),
      D = () => {
        he.cancel(E.current)
      },
      k = (e) => {
        x === Eo &&
          (o?.(e),
          a &&
            (D(),
            (E.current = he(() => {
              T()
            }))))
      }
    Y.useEffect(() => D, [])
    let A = b ? C : null,
      j = { ...c, ...A }
    return (
      (x === wo || x === To) && ((j.overflowY = `hidden`), (j.overflowX = `hidden`)),
      Y.createElement(
        te,
        { onResize: k, disabled: !(a || o) },
        Y.createElement(`textarea`, Co({}, f, { ref: _, style: j, className: H(n, s, { [`${n}-disabled`]: l }), disabled: l, value: h, onChange: g })),
      )
    )
  })
function Oo() {
  return (
    (Oo = Object.assign
      ? Object.assign.bind()
      : function (e) {
          for (var t = 1; t < arguments.length; t++) {
            var n = arguments[t]
            for (var r in n) Object.prototype.hasOwnProperty.call(n, r) && (e[r] = n[r])
          }
          return e
        }),
    Oo.apply(this, arguments)
  )
}
var ko = Y.forwardRef(
    (
      {
        defaultValue: e,
        value: t,
        onFocus: n,
        onBlur: r,
        onChange: i,
        allowClear: a,
        maxLength: o,
        onCompositionStart: s,
        onCompositionEnd: c,
        suffix: l,
        prefixCls: u = `rc-textarea`,
        showCount: d,
        count: f,
        className: p,
        style: m,
        disabled: h,
        hidden: g,
        classNames: _,
        styles: v,
        onResize: y,
        onClear: b,
        onPressEnter: x,
        readOnly: S,
        autoSize: C,
        onKeyDown: w,
        ...T
      },
      E,
    ) => {
      let [D, O] = re(e, t),
        k = D == null ? `` : String(D),
        [A, j] = Y.useState(!1),
        M = Y.useRef(!1),
        [N, P] = Y.useState(null),
        ee = (0, Y.useRef)(null),
        F = (0, Y.useRef)(null),
        I = () => F.current?.textArea,
        L = () => {
          I().focus()
        }
      ;((0, Y.useImperativeHandle)(E, () => ({
        resizableTextArea: F.current,
        focus: L,
        blur: () => {
          I().blur()
        },
        nativeElement: ee.current?.nativeElement || I(),
      })),
        (0, Y.useEffect)(() => {
          j((e) => !h && e)
        }, [h]))
      let [te, ne] = Y.useState(null)
      Y.useEffect(() => {
        te && I().setSelectionRange(...te)
      }, [te])
      let R = eo(f, d),
        z = R.max ?? o,
        ie = Number(z) > 0,
        B = R.strategy(k),
        ae = !!z && B > z,
        oe = (e, t) => {
          let n = t
          ;(!M.current &&
            R.exceedFormatter &&
            R.max &&
            R.strategy(t) > R.max &&
            ((n = R.exceedFormatter(t, { max: R.max })), t !== n && ne([I().selectionStart || 0, I().selectionEnd || 0])),
            O(n),
            Za(e.currentTarget, e, i, n))
        },
        V = (e) => {
          ;((M.current = !0), s?.(e))
        },
        se = (e) => {
          ;((M.current = !1), oe(e, e.currentTarget.value), c?.(e))
        },
        ce = (e) => {
          oe(e, e.target.value)
        },
        le = (e) => {
          ;(e.key === `Enter` && x && !e.nativeEvent.isComposing && x(e), w?.(e))
        },
        ue = (e) => {
          ;(j(!0), n?.(e))
        },
        de = (e) => {
          ;(j(!1), r?.(e))
        },
        fe = (e) => {
          ;(O(``), L(), Za(I(), e, i))
        },
        pe = l,
        U
      R.show &&
        ((U = R.showFormatter ? R.showFormatter({ value: k, count: B, maxLength: z }) : `${B}${ie ? ` / ${z}` : ``}`),
        (pe = Y.createElement(Y.Fragment, null, pe, Y.createElement(`span`, { className: H(`${u}-data-count`, _?.count), style: v?.count }, U))))
      let W = (e) => {
          ;(y?.(e), I()?.style.height && P(!0))
        },
        me = !C && !d && !a
      return Y.createElement(
        $a,
        {
          ref: ee,
          value: k,
          allowClear: a,
          handleReset: fe,
          suffix: pe,
          prefixCls: u,
          classNames: { ..._, affixWrapper: H(_?.affixWrapper, { [`${u}-show-count`]: d, [`${u}-textarea-allow-clear`]: a }) },
          disabled: h,
          focused: A,
          className: H(p, ae && `${u}-out-of-range`),
          style: { ...m, ...(N && !me ? { height: `auto` } : {}) },
          dataAttrs: { affixWrapper: { 'data-count': typeof U == `string` ? U : void 0 } },
          hidden: g,
          readOnly: S,
          onClear: b,
        },
        Y.createElement(
          Do,
          Oo({}, T, {
            autoSize: C,
            maxLength: o,
            onKeyDown: le,
            onChange: ce,
            onFocus: ue,
            onBlur: de,
            onCompositionStart: V,
            onCompositionEnd: se,
            className: H(_?.textarea),
            style: { resize: m?.resize, ...v?.textarea },
            disabled: h,
            prefixCls: u,
            onResize: W,
            ref: F,
            readOnly: S,
          }),
        ),
      )
    },
  ),
  Ao = (e) => {
    let { componentCls: t, paddingLG: n } = e,
      r = `${t}-textarea`
    return {
      [`textarea${t}`]: {
        maxWidth: `100%`,
        height: `auto`,
        minHeight: e.controlHeight,
        lineHeight: e.lineHeight,
        verticalAlign: `bottom`,
        transition: `all ${e.motionDurationSlow}`,
        resize: `vertical`,
        [`&${t}-mouse-active`]: { transition: `all ${e.motionDurationSlow}, height 0s, width 0s` },
      },
      [`${t}-textarea-affix-wrapper-resize-dirty`]: { width: `auto` },
      [r]: {
        position: `relative`,
        '&-show-count': {
          [`${t}-data-count`]: {
            position: `absolute`,
            bottom: e.calc(e.fontSize).mul(e.lineHeight).mul(-1).equal(),
            insetInlineEnd: 0,
            color: e.colorTextDescription,
            whiteSpace: `nowrap`,
            pointerEvents: `none`,
          },
        },
        [`
        &-allow-clear > ${t},
        &-affix-wrapper${r}-has-feedback ${t}
      `]: { paddingInlineEnd: n },
        [`&-affix-wrapper${t}-affix-wrapper`]: {
          padding: 0,
          [`> textarea${t}`]: {
            fontSize: `inherit`,
            border: `none`,
            outline: `none`,
            background: `transparent`,
            minHeight: e.calc(e.controlHeight).sub(e.calc(e.lineWidth).mul(2)).equal(),
            '&:focus': { boxShadow: `none !important` },
          },
          [`${t}-suffix`]: {
            margin: 0,
            '> *:not(:last-child)': { marginInline: 0 },
            [`${t}-clear-icon`]: { position: `absolute`, insetInlineEnd: e.paddingInline, insetBlockStart: e.paddingXS },
            [`${r}-suffix`]: {
              position: `absolute`,
              top: 0,
              insetInlineEnd: e.paddingInline,
              bottom: 0,
              zIndex: 1,
              display: `inline-flex`,
              alignItems: `center`,
              margin: `auto`,
              pointerEvents: `none`,
            },
          },
        },
        [`&-affix-wrapper${t}-affix-wrapper-rtl`]: { [`${t}-suffix`]: { [`${t}-data-count`]: { direction: `ltr`, insetInlineStart: 0 } } },
        [`&-affix-wrapper${t}-affix-wrapper-sm`]: { [`${t}-suffix`]: { [`${t}-clear-icon`]: { insetInlineEnd: e.paddingInlineSM } } },
      },
    }
  },
  jo = z([`Input`, `TextArea`], (e) => Ao(S(e, ha(e))), ga, { resetFont: !1 }),
  Mo = (0, Y.forwardRef)((e, t) => {
    let {
        prefixCls: n,
        bordered: r = !0,
        size: i,
        disabled: a,
        status: o,
        allowClear: s,
        classNames: c,
        rootClassName: l,
        className: u,
        style: d,
        styles: f,
        variant: p,
        showCount: m,
        onMouseDown: h,
        onResize: g,
        ..._
      } = e,
      { getPrefixCls: v, direction: y, allowClear: b, autoComplete: x, className: S, style: C, classNames: T, styles: E } = Ce(`textArea`),
      D = Y.useContext(w),
      O = a ?? D,
      { status: k, hasFeedback: j, feedbackIcon: M } = Y.useContext(Ir),
      N = ji(k, o),
      [P, ee] = A([T, c], [E, f], { props: e }),
      F = Y.useRef(null)
    Y.useImperativeHandle(t, () => ({
      resizableTextArea: F.current?.resizableTextArea,
      focus: (e) => {
        Lt(F.current?.resizableTextArea?.textArea, e)
      },
      blur: () => F.current?.blur(),
      nativeElement: F.current?.nativeElement || null,
    }))
    let I = v(`input`, n),
      L = et(I),
      [te, ne] = Ua(I, l)
    jo(I, L)
    let { compactSize: re, compactItemClassnames: R } = le(I, y),
      z = ce((e) => i ?? re ?? e),
      [ie, B] = Mi(`textArea`, p, r),
      ae = ro(s ?? b),
      [oe, V] = Y.useState(!1),
      [se, ue] = Y.useState(!1),
      de = (e) => {
        ;(V(!0), h?.(e))
        let t = () => {
          ;(V(!1), document.removeEventListener(`mouseup`, t))
        }
        document.addEventListener(`mouseup`, t)
      },
      fe = (e) => {
        if ((g?.(e), oe && typeof getComputedStyle == `function`)) {
          let e = F.current?.nativeElement?.querySelector(`textarea`)
          e && getComputedStyle(e).resize === `both` && ue(!0)
        }
      }
    return Y.createElement(ko, {
      autoComplete: x,
      ..._,
      style: { ...ee.root, ...C, ...d },
      styles: ee,
      disabled: O,
      allowClear: ae,
      className: H(ne, L, u, l, R, S, P.root, { [`${I}-textarea-affix-wrapper-resize-dirty`]: se }),
      classNames: {
        ...P,
        textarea: H({ [`${I}-sm`]: z === `small`, [`${I}-lg`]: z === `large` }, te, P.textarea, oe && `${I}-mouse-active`),
        variant: H({ [`${I}-${ie}`]: B }, Ai(I, N)),
        affixWrapper: H(
          `${I}-textarea-affix-wrapper`,
          {
            [`${I}-affix-wrapper-rtl`]: y === `rtl`,
            [`${I}-affix-wrapper-sm`]: z === `small`,
            [`${I}-affix-wrapper-lg`]: z === `large`,
            [`${I}-textarea-show-count`]: m || e.count?.show,
          },
          te,
        ),
      },
      prefixCls: I,
      suffix: j && Y.createElement(`span`, { className: `${I}-textarea-suffix` }, M),
      showCount: m,
      ref: F,
      onResize: fe,
      onMouseDown: de,
    })
  }),
  No = (e, t = {}) => (!P(e) && t?.skipEmpty ? [] : Array.isArray(e) ? e : [e]),
  Po = {
    icon: {
      tag: `svg`,
      attrs: { viewBox: `64 64 896 896`, focusable: `false` },
      children: [
        {
          tag: `path`,
          attrs: {
            d: `M257.7 752c2 0 4-.2 6-.5L431.9 722c2-.4 3.9-1.3 5.3-2.8l423.9-423.9a9.96 9.96 0 000-14.1L694.9 114.9c-1.9-1.9-4.4-2.9-7.1-2.9s-5.2 1-7.1 2.9L256.8 538.8c-1.5 1.5-2.4 3.3-2.8 5.3l-29.5 168.2a33.5 33.5 0 009.4 29.8c6.6 6.4 14.9 9.9 23.8 9.9zm67.4-174.4L687.8 215l73.3 73.3-362.7 362.6-88.9 15.7 15.6-89zM880 836H144c-17.7 0-32 14.3-32 32v36c0 4.4 3.6 8 8 8h784c4.4 0 8-3.6 8-8v-36c0-17.7-14.3-32-32-32z`,
          },
        },
      ],
    },
    name: `edit`,
    theme: `outlined`,
  }
function Fo() {
  return (
    (Fo = Object.assign
      ? Object.assign.bind()
      : function (e) {
          for (var t = 1; t < arguments.length; t++) {
            var n = arguments[t]
            for (var r in n) Object.prototype.hasOwnProperty.call(n, r) && (e[r] = n[r])
          }
          return e
        }),
    Fo.apply(this, arguments)
  )
}
var Io = Y.forwardRef((e, t) => Y.createElement(q, Fo({}, e, { ref: t, icon: Po }))),
  Lo = {
    icon: {
      tag: `svg`,
      attrs: { viewBox: `64 64 896 896`, focusable: `false` },
      children: [
        {
          tag: `path`,
          attrs: {
            d: `M864 170h-60c-4.4 0-8 3.6-8 8v518H310v-73c0-6.7-7.8-10.5-13-6.3l-141.9 112a8 8 0 000 12.6l141.9 112c5.3 4.2 13 .4 13-6.3v-75h498c35.3 0 64-28.7 64-64V178c0-4.4-3.6-8-8-8z`,
          },
        },
      ],
    },
    name: `enter`,
    theme: `outlined`,
  }
function Ro() {
  return (
    (Ro = Object.assign
      ? Object.assign.bind()
      : function (e) {
          for (var t = 1; t < arguments.length; t++) {
            var n = arguments[t]
            for (var r in n) Object.prototype.hasOwnProperty.call(n, r) && (e[r] = n[r])
          }
          return e
        }),
    Ro.apply(this, arguments)
  )
}
var zo = Y.forwardRef((e, t) => Y.createElement(q, Ro({}, e, { ref: t, icon: Lo }))),
  Bo = (e, t, n, r) => {
    let { titleMarginBottom: i, fontWeightStrong: a } = r
    return { marginBottom: i, color: n, fontWeight: a, fontSize: e, lineHeight: t }
  },
  Vo = (e) => {
    let t = [1, 2, 3, 4, 5],
      n = {}
    return (
      t.forEach((t) => {
        n[
          `
      h${t}&,
      div&-h${t},
      div&-h${t} > textarea,
      h${t}
    `
        ] = Bo(e[`fontSizeHeading${t}`], e[`lineHeightHeading${t}`], e.colorTextHeading, e)
      }),
      n
    )
  },
  Ho = (e) => {
    let { componentCls: t } = e
    return {
      [`&${`${t}-link`}`]: {
        ..._e(e),
        userSelect: `text`,
        [`&[disabled], &${t}-disabled`]: {
          color: e.colorTextDisabled,
          cursor: `not-allowed`,
          '&:active, &:hover': { color: e.colorTextDisabled },
          '&:active': { pointerEvents: `none`, [`${t}-actions`]: { pointerEvents: `auto` } },
        },
      },
    }
  },
  Uo = (e) => ({
    code: {
      margin: `0 0.2em`,
      paddingInline: `0.4em`,
      paddingBlock: `0.2em 0.1em`,
      fontSize: `85%`,
      fontFamily: e.fontFamilyCode,
      background: `rgba(150, 150, 150, 0.1)`,
      border: `1px solid rgba(100, 100, 100, 0.2)`,
      borderRadius: 3,
    },
    kbd: {
      margin: `0 0.2em`,
      paddingInline: `0.4em`,
      paddingBlock: `0.15em 0.1em`,
      fontSize: `90%`,
      fontFamily: e.fontFamilyCode,
      background: `rgba(150, 150, 150, 0.06)`,
      border: `1px solid rgba(100, 100, 100, 0.2)`,
      borderBottomWidth: 2,
      borderRadius: 3,
    },
    mark: { padding: 0, backgroundColor: c[2] },
    'u, ins': { textDecoration: `underline`, textDecorationSkipInk: `auto` },
    's, del': { textDecoration: `line-through` },
    strong: { fontWeight: e.fontWeightStrong },
    'ul, ol': { marginInline: 0, marginBlock: `0 1em`, padding: 0, li: { marginInline: `20px 0`, marginBlock: 0, paddingInline: `4px 0`, paddingBlock: 0 } },
    ul: { listStyleType: `circle`, ul: { listStyleType: `disc` } },
    ol: { listStyleType: `decimal` },
    'pre, blockquote': { margin: `1em 0` },
    pre: {
      padding: `0.4em 0.6em`,
      whiteSpace: `pre-wrap`,
      wordWrap: `break-word`,
      background: `rgba(150, 150, 150, 0.1)`,
      border: `1px solid rgba(100, 100, 100, 0.2)`,
      borderRadius: 3,
      fontFamily: e.fontFamilyCode,
      code: { display: `inline`, margin: 0, padding: 0, fontSize: `inherit`, fontFamily: `inherit`, background: `transparent`, border: 0 },
    },
    blockquote: { paddingInline: `0.6em 0`, paddingBlock: 0, borderInlineStart: `4px solid rgba(100, 100, 100, 0.2)`, opacity: 0.85 },
  }),
  Wo = (e) => {
    let { componentCls: t, paddingSM: n } = e,
      r = n
    return {
      '&-edit-content': {
        position: `relative`,
        'div&': {
          insetInlineStart: e.calc(e.paddingSM).mul(-1).equal(),
          insetBlockStart: e.calc(r).div(-2).add(1).equal(),
          marginBottom: e.calc(r).div(2).sub(2).equal(),
        },
        [`${t}-edit-content-confirm`]: {
          position: `absolute`,
          insetInlineEnd: e.calc(e.marginXS).add(2).equal(),
          insetBlockEnd: e.marginXS,
          color: e.colorIcon,
          fontWeight: `normal`,
          fontSize: e.fontSize,
          fontStyle: `normal`,
          pointerEvents: `none`,
        },
        textarea: { margin: `0!important`, MozTransition: `none`, height: `1em` },
      },
    }
  },
  Go = (e) => ({
    [`${e.componentCls}-copy-success`]: { '&, &:hover, &:focus': { color: e.colorSuccess } },
    [`${e.componentCls}-copy-icon-only`]: { marginInlineStart: 0 },
  }),
  Ko = () => ({
    'a&-ellipsis, span&-ellipsis': { display: `inline-block`, maxWidth: `100%` },
    '&-ellipsis-single-line': {
      whiteSpace: `nowrap`,
      overflow: `hidden`,
      textOverflow: `ellipsis`,
      'a&, span&': { verticalAlign: `bottom` },
      '> code': {
        paddingBlock: 0,
        maxWidth: `calc(100% - 1.2em)`,
        display: `inline-block`,
        overflow: `hidden`,
        textOverflow: `ellipsis`,
        verticalAlign: `bottom`,
        boxSizing: `content-box`,
      },
    },
    '&-ellipsis-multiple-line': { display: `-webkit-box`, overflow: `hidden`, WebkitLineClamp: 3, WebkitBoxOrient: `vertical` },
  }),
  qo = z(
    `Typography`,
    (e) => {
      let { componentCls: t, titleMarginTop: n } = e
      return {
        [t]: {
          color: e.colorText,
          wordBreak: `break-word`,
          lineHeight: e.lineHeight,
          [`&${t}-secondary, &${t}-link${t}-secondary`]: { color: e.colorTextDescription },
          [`&${t}-success, &${t}-link${t}-success`]: { color: e.colorSuccessText },
          [`&${t}-warning, &${t}-link${t}-warning`]: { color: e.colorWarningText },
          [`&${t}-danger, &${t}-link${t}-danger`]: {
            color: e.colorErrorText,
            [`&${t}-link:active, &${t}-link:focus`]: { color: e.colorErrorTextActive },
            [`&${t}-link:hover`]: { color: e.colorErrorTextHover },
          },
          [`&${t}-disabled`]: { color: e.colorTextDisabled, cursor: `not-allowed`, userSelect: `none` },
          'div&, p': { marginBottom: `1em` },
          ...Vo(e),
          [`& + h1${t}, & + h2${t}, & + h3${t}, & + h4${t}, & + h5${t}`]: { marginTop: n },
          'div, ul, li, p, h1, h2, h3, h4, h5': { '+ h1, + h2, + h3, + h4, + h5': { marginTop: n } },
          ...Uo(e),
          ...Ho(e),
          [`${t}-actions`]: { display: `inline` },
          [`
        ${t}-expand,
        ${t}-collapse,
        ${t}-edit,
        ${t}-copy
      `]: { ..._e(e), marginInlineStart: e.marginXXS },
          ...Wo(e),
          ...Go(e),
          ...Ko(),
          '&-rtl': { direction: `rtl` },
        },
      }
    },
    () => ({ titleMarginTop: `1.2em`, titleMarginBottom: `0.5em` }),
  ),
  Jo = (e) => {
    let {
        prefixCls: t,
        'aria-label': n,
        className: r,
        style: i,
        direction: a,
        maxLength: o,
        autoSize: s = !0,
        value: c,
        onSave: l,
        onCancel: u,
        onEnd: d,
        component: f,
        enterIcon: p = Y.createElement(zo, null),
      } = e,
      m = Y.useRef(null),
      h = Y.useRef(!1),
      g = Y.useRef(null),
      [_, v] = Y.useState(c)
    ;(Y.useEffect(() => {
      v(c)
    }, [c]),
      Y.useEffect(() => {
        if (m.current?.resizableTextArea) {
          let { textArea: e } = m.current.resizableTextArea
          e.focus()
          let { length: t } = e.value
          e.setSelectionRange(t, t)
        }
      }, []))
    let y = ({ target: e }) => {
        v(e.value.replace(/[\n\r]/g, ``))
      },
      b = () => {
        h.current = !0
      },
      x = () => {
        h.current = !1
      },
      S = ({ keyCode: e }) => {
        h.current || (g.current = e)
      },
      C = () => {
        l(_.trim())
      },
      w = ({ keyCode: e, ctrlKey: t, altKey: n, metaKey: r, shiftKey: i }) => {
        g.current !== e || h.current || t || n || r || i || (e === Ee.ENTER ? (C(), d?.()) : e === Ee.ESC && u())
      },
      T = () => {
        C()
      },
      [E, D] = qo(t),
      O = H(t, `${t}-edit-content`, { [`${t}-rtl`]: a === `rtl`, [`${t}-${f}`]: !!f }, r, E, D)
    return Y.createElement(
      `div`,
      { className: O, style: i },
      Y.createElement(Mo, {
        ref: m,
        maxLength: o,
        value: _,
        onChange: y,
        onKeyDown: S,
        onKeyUp: w,
        onCompositionStart: b,
        onCompositionEnd: x,
        onBlur: T,
        'aria-label': n,
        rows: 1,
        autoSize: s,
      }),
      p === null ? null : de(p, { className: `${t}-edit-content-confirm` }),
    )
  },
  Yo = (e, t) => {
    let n = !1,
      r = (r) => {
        ;(r.stopPropagation(),
          r.preventDefault(),
          r.clipboardData?.clearData(),
          r.clipboardData?.setData(`text/plain`, e),
          t && r.clipboardData?.setData(`text/html`, e),
          (n = !0))
      }
    try {
      return (document.addEventListener(`copy`, r, { capture: !0 }), document.execCommand(`copy`), n)
    } catch {
      return !1
    } finally {
      document.removeEventListener(`copy`, r, { capture: !0 })
    }
  },
  Xo = async (e, t) => {
    try {
      return (
        t
          ? await navigator.clipboard.write([
              new ClipboardItem({ 'text/html': new Blob([e], { type: `text/html` }), 'text/plain': new Blob([e], { type: `text/plain` }) }),
            ])
          : await navigator.clipboard.writeText(e),
        !0
      )
    } catch {
      return !1
    }
  }
async function Zo(e, t) {
  if (typeof e != `string`) return !1
  let n = t?.format === `text/html`
  return !!((await Xo(e, n)) || Yo(e, n))
}
var Qo = ({ copyConfig: e, children: t }) => {
  let [n, r] = Y.useState(!1),
    [i, a] = Y.useState(!1),
    o = Y.useRef(null),
    s = () => {
      o.current && clearTimeout(o.current)
    },
    c = {}
  return (
    e.format && (c.format = e.format),
    Y.useEffect(() => s, []),
    {
      copied: n,
      copyLoading: i,
      onClick: k(async (n) => {
        ;(n?.preventDefault(), n?.stopPropagation(), a(!0))
        try {
          ;(await Zo((typeof e.text == `function` ? await e.text() : e.text) || No(t, { skipEmpty: !0 }).join(``) || ``, c),
            a(!1),
            r(!0),
            s(),
            (o.current = setTimeout(() => {
              r(!1)
            }, 3e3)),
            e.onCopy?.(n))
        } catch (e) {
          throw (a(!1), e)
        }
      }),
    }
  )
}
function $o(e, t) {
  return Y.useMemo(() => {
    let n = !!e
    return [n, { ...t, ...(n && typeof e == `object` ? e : null) }]
  }, [e])
}
var es = (e) => {
    let t = (0, Y.useRef)(void 0)
    return (
      (0, Y.useEffect)(() => {
        t.current = e
      }),
      t.current
    )
  },
  ts = (e, t, n) =>
    (0, Y.useMemo)(() => (e === !0 ? { title: t ?? n } : (0, Y.isValidElement)(e) ? { title: e } : _(e) ? { title: t ?? n, ...e } : { title: e }), [e, t, n]),
  ns = Y.forwardRef((e, t) => {
    let { prefixCls: n, component: r = `article`, className: i, rootClassName: a, children: o, direction: s, style: c, ...l } = e,
      { getPrefixCls: u, direction: d, className: f, style: p } = Ce(`typography`),
      m = s ?? d,
      h = u(`typography`, n),
      [g, _] = qo(h),
      v = H(h, f, { [`${h}-rtl`]: m === `rtl` }, i, a, g, _),
      y = { ...p, ...c }
    return Y.createElement(r, { className: v, style: y, ref: t, ...l }, o)
  }),
  rs = {
    icon: {
      tag: `svg`,
      attrs: { viewBox: `64 64 896 896`, focusable: `false` },
      children: [
        {
          tag: `path`,
          attrs: {
            d: `M832 64H296c-4.4 0-8 3.6-8 8v56c0 4.4 3.6 8 8 8h496v688c0 4.4 3.6 8 8 8h56c4.4 0 8-3.6 8-8V96c0-17.7-14.3-32-32-32zM704 192H192c-17.7 0-32 14.3-32 32v530.7c0 8.5 3.4 16.6 9.4 22.6l173.3 173.3c2.2 2.2 4.7 4 7.4 5.5v1.9h4.2c3.5 1.3 7.2 2 11 2H704c17.7 0 32-14.3 32-32V224c0-17.7-14.3-32-32-32zM350 856.2L263.9 770H350v86.2zM664 888H414V746c0-22.1-17.9-40-40-40H232V264h432v624z`,
          },
        },
      ],
    },
    name: `copy`,
    theme: `outlined`,
  }
function is() {
  return (
    (is = Object.assign
      ? Object.assign.bind()
      : function (e) {
          for (var t = 1; t < arguments.length; t++) {
            var n = arguments[t]
            for (var r in n) Object.prototype.hasOwnProperty.call(n, r) && (e[r] = n[r])
          }
          return e
        }),
    is.apply(this, arguments)
  )
}
var as = Y.forwardRef((e, t) => Y.createElement(q, is({}, e, { ref: t, icon: rs }))),
  os = (e) => (e === !1 ? [!1, !1] : No(e))
function ss(e, t, n) {
  return e === !0 || e === void 0 ? t : e || (n && t)
}
function cs(e) {
  let t = document.createElement(`em`)
  e.appendChild(t)
  let n = e.getBoundingClientRect(),
    r = t.getBoundingClientRect()
  return (e.removeChild(t), n.left > r.left || r.right > n.right || n.top > r.top || r.bottom > n.bottom)
}
var ls = (e) => [`string`, `number`].includes(typeof e),
  us = (e) => {
    let { prefixCls: t, copied: n, locale: r, iconOnly: i, tooltips: a, icon: s, tabIndex: c, onCopy: l, loading: u } = e,
      d = os(a),
      f = os(s),
      { copied: p, copy: m } = r ?? {},
      h = n ? p : m,
      g = ss(d[+!!n], h),
      _ = typeof g == `string` ? g : h
    return Y.createElement(
      ma,
      { title: g },
      Y.createElement(
        `button`,
        { type: `button`, className: H(`${t}-copy`, { [`${t}-copy-success`]: n, [`${t}-copy-icon-only`]: i }), onClick: l, 'aria-label': _, tabIndex: c },
        n ? ss(f[1], Y.createElement(Fi, null), !0) : ss(f[0], u ? Y.createElement(o, null) : Y.createElement(as, null), !0),
      ),
    )
  },
  ds = Y.forwardRef(({ style: e, children: t }, n) => {
    let r = Y.useRef(null)
    return (
      Y.useImperativeHandle(n, () => ({
        isExceed: () => {
          let e = r.current
          return e.scrollHeight > e.clientHeight
        },
        getHeight: () => r.current.clientHeight,
      })),
      Y.createElement(
        `span`,
        {
          'aria-hidden': !0,
          ref: r,
          style: { position: `fixed`, display: `block`, left: 0, top: 0, pointerEvents: `none`, backgroundColor: `rgba(255, 0, 0, 0.65)`, ...e },
        },
        t,
      )
    )
  }),
  fs = (e) => e.reduce((e, t) => e + (ls(t) ? String(t).length : 1), 0)
function ps(e, t) {
  let n = 0,
    r = []
  for (let i = 0; i < e.length; i += 1) {
    if (n === t) return r
    let a = e[i],
      o = ls(a) ? String(a).length : 1,
      s = n + o
    if (s > t) {
      let e = t - n
      return (r.push(String(a).slice(0, e)), r)
    }
    ;(r.push(a), (n = s))
  }
  return e
}
var ms = 0,
  hs = 1,
  gs = 2,
  _s = 3,
  vs = 4,
  ys = { display: `-webkit-box`, overflow: `hidden`, WebkitBoxOrient: `vertical` }
function bs(e) {
  let { enableMeasure: t, width: n, text: r, children: i, rows: a, expanded: o, miscDeps: s, onEllipsis: c } = e,
    l = Y.useMemo(() => R(r), [r]),
    u = Y.useMemo(() => fs(l), [r]),
    d = Y.useMemo(() => i(l, !1), [r]),
    [f, p] = Y.useState(null),
    m = Y.useRef(null),
    h = Y.useRef(null),
    g = Y.useRef(null),
    _ = Y.useRef(null),
    v = Y.useRef(null),
    [y, b] = Y.useState(!1),
    [x, S] = Y.useState(ms),
    [C, w] = Y.useState(0),
    [T, E] = Y.useState(null)
  ;(O(() => {
    S(t && n && u ? hs : ms)
  }, [n, r, a, t, l]),
    O(() => {
      if (x === hs) (S(gs), E(h.current && getComputedStyle(h.current).whiteSpace))
      else if (x === gs) {
        let e = !!g.current?.isExceed()
        ;(S(e ? _s : vs), p(e ? [0, u] : null), b(e))
        let t = g.current?.getHeight() || 0,
          n = a === 1 ? 0 : _.current?.getHeight() || 0,
          r = v.current?.getHeight() || 0
        ;(w(Math.max(t, n + r) + 1), c(e))
      }
    }, [x]))
  let D = f ? Math.ceil((f[0] + f[1]) / 2) : 0
  O(() => {
    let [e, t] = f || [0, 0]
    if (e !== t) {
      let n = (m.current?.getHeight() || 0) > C,
        r = D
      ;(t - e === 1 && (r = n ? e : t), p(n ? [e, r] : [r, t]))
    }
  }, [f, D])
  let k = Y.useMemo(
      () => {
        if (!t) return i(l, !1)
        if (x !== _s || !f || f[0] !== f[1]) {
          let e = i(l, !1)
          return [vs, ms].includes(x) ? e : Y.createElement(`span`, { style: { ...ys, WebkitLineClamp: a } }, e)
        }
        return i(o ? l : ps(l, f[0]), y)
      },
      [o, x, f, l].concat(ye(s)),
    ),
    A = { width: n, margin: 0, padding: 0, whiteSpace: T === `nowrap` ? `normal` : `inherit` }
  return Y.createElement(
    Y.Fragment,
    null,
    k,
    x === gs &&
      Y.createElement(
        Y.Fragment,
        null,
        Y.createElement(ds, { style: { ...A, ...ys, WebkitLineClamp: a }, ref: g }, d),
        Y.createElement(ds, { style: { ...A, ...ys, WebkitLineClamp: a - 1 }, ref: _ }, d),
        Y.createElement(ds, { style: { ...A, ...ys, WebkitLineClamp: 1 }, ref: v }, i([], !0)),
      ),
    x === _s && f && f[0] !== f[1] && Y.createElement(ds, { style: { ...A, top: 400 }, ref: m }, i(ps(l, D), !0)),
    x === hs && Y.createElement(`span`, { style: { whiteSpace: `inherit` }, ref: h }),
  )
}
var xs = ({ enableEllipsis: e, isEllipsis: t, open: n, children: r, tooltipProps: i }) => {
  if (!i?.title || !e) return r
  let a = n && t
  return Y.createElement(ma, { open: a, ...i }, r)
}
function Ss({ mark: e, code: t, underline: n, delete: r, strong: i, keyboard: a, italic: o }, s) {
  let c = s
  function l(e, t) {
    t && (c = Y.createElement(e, {}, c))
  }
  return (l(`strong`, i), l(`u`, n), l(`del`, r), l(`code`, t), l(`mark`, e), l(`kbd`, a), l(`i`, o), c)
}
var Cs = `...`,
  ws = [`delete`, `mark`, `code`, `underline`, `strong`, `keyboard`, `italic`],
  Ts = Y.forwardRef((e, t) => {
    let {
        prefixCls: r,
        className: i,
        style: a,
        type: o,
        disabled: s,
        children: c,
        ellipsis: l,
        editable: u,
        copyable: d,
        component: f,
        title: p,
        onMouseEnter: m,
        onMouseLeave: h,
        ...g
      } = e,
      { getPrefixCls: _, direction: v } = Y.useContext(n),
      [y] = ee(`Text`),
      b = Y.useRef(null),
      x = Y.useRef(null),
      S = _(`typography`, r),
      C = pe(g, ws),
      [w, T] = $o(u),
      [E, D] = re(!1, T.editing),
      { triggerType: k = [`icon`] } = T,
      A = (e) => {
        ;(e && T.onStart?.(), D(e))
      },
      j = es(E)
    O(() => {
      !E && j && x.current?.focus()
    }, [E])
    let M = (e) => {
        ;(e?.preventDefault(), A(!0))
      },
      N = (e) => {
        ;(T.onChange?.(e), A(!1))
      },
      F = () => {
        ;(T.onCancel?.(), A(!1))
      },
      [I, L] = $o(d),
      { copied: ne, copyLoading: z, onClick: ie } = Qo({ copyConfig: L, children: c }),
      [B, ae] = Y.useState(!1),
      [oe, V] = Y.useState(!1),
      [se, ce] = Y.useState(!1),
      [le, ue] = Y.useState(!1),
      [de, fe] = Y.useState(!0),
      [U, W] = $o(l, { expandable: !1, symbol: (e) => (e ? y?.collapse : y?.expand) }),
      [G, he] = re(W.defaultExpanded || !1, W.expanded),
      K = U && (!G || W.expandable === `collapsible`),
      { rows: q = 1 } = W,
      ge = Y.useMemo(() => K && (W.suffix !== void 0 || W.onEllipsis || W.expandable || w || I), [K, W, w, I])
    O(() => {
      U && !ge && (ae(Hr(`webkitLineClamp`)), V(Hr(`textOverflow`)))
    }, [ge, U])
    let [J, _e] = Y.useState(K),
      ve = Y.useMemo(() => (ge ? !1 : q === 1 ? oe : B), [ge, oe, B])
    O(() => {
      _e(ve && K)
    }, [ve, K])
    let be = ts(W.tooltip, T.text, c),
      xe = J && !!be.title,
      Se = K && (J ? xe && le : se),
      Ce = K && q === 1 && J,
      we = K && q > 1 && J,
      Te = (e, t) => {
        ;(he(t.expanded), W.onExpand?.(e, t))
      },
      [Ee, De] = Y.useState(0),
      [Oe, ke] = Y.useState(!1),
      [Ae, je] = Y.useState(!1),
      Me = ({ offsetWidth: e }) => {
        De(e)
      },
      Ne = (e) => {
        ;(ce(e), se !== e && W.onEllipsis?.(e))
      }
    ;(Y.useEffect(() => {
      let e = b.current
      if (U && xe && e) {
        let t = cs(e)
        le !== t && ue(t)
      }
    }, [U, xe, c, we, de, Ee]),
      Y.useEffect(() => {
        let e = b.current
        if (typeof IntersectionObserver > `u` || !e || !xe || !K) return
        let t = new IntersectionObserver(() => {
          fe(!!e.offsetParent)
        })
        return (
          t.observe(e),
          () => {
            t.disconnect()
          }
        )
      }, [xe, K]))
    let Pe = Y.useMemo(() => {
      if (!(!U || J)) return [T.text, c, p, be.title].find(ls)
    }, [U, J, p, be.title, Se])
    if (E)
      return Y.createElement(Jo, {
        value: T.text ?? (typeof c == `string` ? c : ``),
        onSave: N,
        onCancel: F,
        onEnd: T.onEnd,
        prefixCls: S,
        className: i,
        style: a,
        direction: v,
        component: f,
        maxLength: T.maxLength,
        autoSize: T.autoSize,
        enterIcon: T.enterIcon,
      })
    let Fe = () => {
        let { expandable: e, symbol: t } = W
        return e
          ? Y.createElement(
              `button`,
              {
                type: `button`,
                key: `expand`,
                className: `${S}-${G ? `collapse` : `expand`}`,
                onClick: (e) => Te(e, { expanded: !G }),
                'aria-label': G ? y.collapse : y?.expand,
              },
              typeof t == `function` ? t(G) : t,
            )
          : null
      },
      Ie = () => {
        if (!w) return
        let { icon: e, tooltip: t, tabIndex: n } = T,
          r = R(t)[0] || y?.edit,
          i = typeof r == `string` ? r : ``
        return k.includes(`icon`)
          ? Y.createElement(
              ma,
              { key: `edit`, title: t === !1 ? `` : r },
              Y.createElement(
                `button`,
                { type: `button`, ref: x, className: `${S}-edit`, onClick: M, 'aria-label': i, tabIndex: n },
                e || Y.createElement(Io, { role: `button` }),
              ),
            )
          : null
      },
      Le = () => (I ? Y.createElement(us, { key: `copy`, ...L, prefixCls: S, copied: ne, locale: y, onCopy: ie, loading: z, iconOnly: !P(c) }) : null),
      Re = (e) => {
        let t = e && Fe(),
          n = Ie(),
          r = Le()
        return !t && !n && !r
          ? null
          : Y.createElement(`span`, { key: `operations`, className: `${S}-actions`, onMouseEnter: () => ke(!0), onMouseLeave: () => ke(!1) }, t, n, r)
      },
      ze = (e) => [e && !G && Y.createElement(`span`, { 'aria-hidden': !0, key: `ellipsis` }, Cs), W.suffix, Re(e)]
    return Y.createElement(te, { onResize: Me, disabled: !K }, (n) =>
      Y.createElement(
        xs,
        { tooltipProps: be, enableEllipsis: K, isEllipsis: Se, open: Ae && !Oe },
        Y.createElement(
          ns,
          {
            onMouseEnter: (e) => {
              ;(je(!0), m?.(e))
            },
            onMouseLeave: (e) => {
              ;(je(!1), h?.(e))
            },
            className: H(
              {
                [`${S}-${o}`]: o,
                [`${S}-disabled`]: s,
                [`${S}-ellipsis`]: U,
                [`${S}-ellipsis-single-line`]: Ce,
                [`${S}-ellipsis-multiple-line`]: we,
                [`${S}-link`]: f === `a`,
              },
              i,
            ),
            prefixCls: r,
            style: { ...a, WebkitLineClamp: we ? q : void 0 },
            component: f,
            ref: me(n, b, t),
            direction: v,
            onClick: k.includes(`text`) ? M : void 0,
            'aria-label': Pe?.toString(),
            title: p,
            ...C,
          },
          Y.createElement(
            bs,
            { enableMeasure: K && !J, text: c, rows: q, width: Ee, onEllipsis: Ne, expanded: G, miscDeps: [ne, G, z, w, I, y].concat(ye(ws.map((t) => e[t]))) },
            (t, n) =>
              Ss(
                e,
                Y.createElement(
                  Y.Fragment,
                  null,
                  t.length > 0 && n && !G && Pe ? Y.createElement(`span`, { key: `show-content`, 'aria-hidden': !0 }, t) : t,
                  ze(n),
                ),
              ),
          ),
        ),
      ),
    )
  }),
  Es = Y.forwardRef((e, t) => {
    let { ellipsis: n, rel: r, children: i, navigate: a, ...o } = e,
      s = { ...o, rel: r === void 0 && o.target === `_blank` ? `noopener noreferrer` : r }
    return Y.createElement(Ts, { ...s, ref: t, ellipsis: !!n, component: `a` }, i)
  }),
  Ds = Y.forwardRef((e, t) => {
    let { children: n, ...r } = e
    return Y.createElement(Ts, { ref: t, ...r, component: `div` }, n)
  }),
  Os = Y.forwardRef((e, t) => {
    let { ellipsis: n, children: r, ...i } = e,
      a = Y.useMemo(() => (_(n) ? pe(n, [`expandable`, `rows`]) : n), [n])
    return Y.createElement(Ts, { ref: t, ...i, ellipsis: a, component: `span` }, r)
  }),
  ks = [1, 2, 3, 4, 5],
  As = Y.forwardRef((e, t) => {
    let { level: n = 1, children: r, ...i } = e,
      a = ks.includes(n) ? `h${n}` : `h1`
    return Y.createElement(Ts, { ref: t, ...i, component: a }, r)
  }),
  js = ns
;((js.Text = Os), (js.Link = Es), (js.Title = As), (js.Paragraph = Ds))
export {
  It as $,
  ki as A,
  Ir as B,
  zi as C,
  ji as D,
  Mi as E,
  $r as F,
  Rr as G,
  Pr as H,
  Zr as I,
  wr as J,
  jr as K,
  Ur as L,
  Di as M,
  gi as N,
  Ai as O,
  Qr as P,
  Zt as Q,
  zr as R,
  Ki as S,
  Fi as T,
  Lr as U,
  Fr as V,
  Nr as W,
  _r as X,
  vr as Y,
  Qt as Z,
  da as _,
  je as _t,
  oo as a,
  ht as at,
  Ji as b,
  Pa as c,
  et as ct,
  ya as d,
  qe as dt,
  Yt as et,
  va as f,
  Be as ft,
  ua as g,
  Pe as gt,
  ma as h,
  Re as ht,
  so as i,
  _t as it,
  Ei as j,
  Oi as k,
  Fa as l,
  Ye as lt,
  ha as m,
  ze as mt,
  Mo as n,
  xt as nt,
  io as o,
  it as ot,
  ga as p,
  Ke as pt,
  Ar as q,
  go as r,
  bt as rt,
  Ia as s,
  nt as st,
  js as t,
  Pt as tt,
  Wa as u,
  $e as ut,
  ra as v,
  Ri as w,
  Xi as x,
  ta as y,
  Mr as z,
}
