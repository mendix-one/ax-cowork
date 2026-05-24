import { a as e, n as t } from './jsx-runtime-B6doAwFl.js'
import {
  $t as n,
  K as r,
  Mt as i,
  O as a,
  Tn as o,
  U as s,
  ct as c,
  et as l,
  g as u,
  h as d,
  in as f,
  j as p,
  ln as m,
  mn as h,
  n as g,
  nn as _,
  ot as v,
  p as y,
  rn as b,
  tn as ee,
} from './button-BU_eysIT.js'
import { B as x, D as te, a as S, m as C, n as w, o as T, p as E, r as D, u as O, w as k } from './typography-_G6plS4i.js'
var A = e(t()),
  j = (e) => {
    let { getPrefixCls: t, direction: r } = (0, A.useContext)(n),
      { prefixCls: i, className: a } = e,
      o = t(`input-group`, i),
      [s, c] = O(t(`input`)),
      l = f(o, c, { [`${o}-lg`]: e.size === `large`, [`${o}-sm`]: e.size === `small`, [`${o}-compact`]: e.compact, [`${o}-rtl`]: r === `rtl` }, s, a),
      u = (0, A.useContext)(x),
      d = (0, A.useMemo)(() => ({ ...u, isFormItemInput: !1 }), [u])
    return A.createElement(
      x.Provider,
      { value: d },
      A.createElement(
        D.Compact,
        { className: l, style: e.style, onMouseEnter: e.onMouseEnter, onMouseLeave: e.onMouseLeave, onFocus: e.onFocus, onBlur: e.onBlur },
        e.children,
      ),
    )
  },
  M = (e) => {
    let { componentCls: t, paddingXS: n } = e
    return {
      [t]: {
        display: `inline-flex`,
        alignItems: `center`,
        flexWrap: `nowrap`,
        columnGap: n,
        [`${t}-input-wrapper`]: {
          position: `relative`,
          [`${t}-mask-icon`]: { position: `absolute`, zIndex: `1`, top: `50%`, right: `50%`, transform: `translate(50%, -50%)`, pointerEvents: `none` },
          [`${t}-mask-input`]: { color: `transparent`, caretColor: e.colorText, '&::selection': { color: `transparent` } },
          [`${t}-mask-input[type=number]::-webkit-inner-spin-button`]: { '-webkit-appearance': `none`, margin: 0 },
          [`${t}-mask-input[type=number]`]: { '-moz-appearance': `textfield` },
        },
        '&-rtl': { direction: `rtl` },
        [`${t}-input`]: { textAlign: `center`, paddingInline: e.paddingXXS },
        [`&${t}-sm ${t}-input`]: { paddingInline: e.calc(e.paddingXXS).div(2).equal() },
        [`&${t}-lg ${t}-input`]: { paddingInline: e.paddingXS },
      },
    }
  },
  N = c([`Input`, `OTP`], (e) => M(i(e, C(e))), E),
  ne = A.forwardRef((e, t) => {
    let { className: r, value: i, onChange: a, onActiveChange: o, index: s, mask: c, onFocus: l, ...u } = e,
      { getPrefixCls: d } = A.useContext(n),
      p = d(`otp`),
      m = typeof c == `string` ? c : i,
      h = A.useRef(null)
    A.useImperativeHandle(t, () => h.current)
    let g = (e) => {
        a(s, e.target.value)
      },
      v = () => {
        _(() => {
          let e = h.current?.input
          document.activeElement === e && e && e.select()
        })
      },
      y = (e) => {
        ;(l?.(e), v())
      },
      b = (e) => {
        let { key: t, ctrlKey: n, metaKey: r } = e
        ;(t === `ArrowLeft` ? o(s - 1) : t === `ArrowRight` ? o(s + 1) : t === `z` && (n || r) ? e.preventDefault() : t === `Backspace` && !i && o(s - 1), v())
      }
    return A.createElement(
      `span`,
      { className: `${p}-input-wrapper`, role: `presentation` },
      c && i !== `` && i !== void 0 && A.createElement(`span`, { className: `${p}-mask-icon`, 'aria-hidden': `true` }, m),
      A.createElement(S, {
        'aria-label': `OTP Input ${s + 1}`,
        type: c === !0 ? `password` : `text`,
        ...u,
        ref: h,
        value: i,
        onInput: g,
        onFocus: y,
        onKeyDown: b,
        onMouseDown: v,
        onMouseUp: v,
        className: f(r, { [`${p}-mask-input`]: c }),
      }),
    )
  })
function P(e) {
  return (e || ``).split(``)
}
var re = (e) => {
    let { index: t, prefixCls: n, separator: r, className: i, style: a } = e,
      o = typeof r == `function` ? r(t) : r
    return o ? A.createElement(`span`, { className: f(`${n}-separator`, i), style: a }, o) : null
  },
  ie = A.forwardRef((e, t) => {
    let {
        prefixCls: n,
        length: r = 6,
        size: i,
        defaultValue: a,
        value: c,
        onChange: d,
        formatter: p,
        separator: m,
        variant: h,
        disabled: g,
        status: _,
        autoFocus: v,
        mask: y,
        type: S,
        autoComplete: C,
        onInput: w,
        onFocus: T,
        inputMode: E,
        classNames: D,
        styles: O,
        className: k,
        style: j,
        ...M
      } = e,
      { classNames: ie, styles: F, getPrefixCls: I, direction: L, style: R, className: z } = ee(`otp`),
      B = I(`otp`, n),
      V = { ...e, length: r },
      [H, U] = s([ie, D], [F, O], { props: V }),
      ae = l(M, { aria: !0, data: !0, attr: !0 }),
      [W, G] = N(B),
      K = u((e) => i ?? e),
      q = A.useContext(x),
      J = te(q.status, _),
      oe = A.useMemo(() => ({ ...q, status: J, hasFeedback: !1, feedbackIcon: null }), [q, J]),
      Y = A.useRef(null),
      X = A.useRef({})
    A.useImperativeHandle(t, () => ({
      focus: () => {
        X.current[0]?.focus()
      },
      blur: () => {
        for (let e = 0; e < r; e += 1) X.current[e]?.blur()
      },
      nativeElement: Y.current,
    }))
    let Z = (e) => (p ? p(e) : e),
      [Q, $] = A.useState(() => P(Z(a || ``)))
    A.useEffect(() => {
      c !== void 0 && $(P(c))
    }, [c])
    let se = o((e) => {
        ;($(e), w && w(e), d && e.length === r && e.every((e) => e) && e.some((e, t) => Q[t] !== e) && d(e.join(``)))
      }),
      ce = o((e, t) => {
        let n = b(Q)
        for (let t = 0; t < e; t += 1) n[t] || (n[t] = ``)
        ;(t.length <= 1 ? (n[e] = t) : (n = n.slice(0, e).concat(P(t))), (n = n.slice(0, r)))
        for (let e = n.length - 1; e >= 0 && !n[e]; --e) n.pop()
        return ((n = P(Z(n.map((e) => e || ` `).join(``))).map((e, t) => (e === ` ` && !n[t] ? n[t] : e))), n)
      }),
      le = (e, t) => {
        let n = ce(e, t),
          i = Math.min(e + t.length, r - 1)
        ;(i !== e && n[e] !== void 0 && X.current[i]?.focus(), se(n))
      },
      ue = (e) => {
        X.current[e]?.focus()
      },
      de = (e, t) => {
        for (let e = 0; e < t; e += 1)
          if (!X.current[e]?.input?.value) {
            X.current[e]?.focus()
            break
          }
        T?.(e)
      },
      fe = { variant: h, disabled: g, status: J, mask: y, type: S, inputMode: E, autoComplete: C }
    return A.createElement(
      `div`,
      {
        ...ae,
        ref: Y,
        className: f(k, B, { [`${B}-sm`]: K === `small`, [`${B}-lg`]: K === `large`, [`${B}-rtl`]: L === `rtl` }, G, W, z, H.root),
        style: { ...U.root, ...R, ...j },
        role: `group`,
      },
      A.createElement(
        x.Provider,
        { value: oe },
        Array.from({ length: r }).map((e, t) => {
          let n = `otp-${t}`,
            i = Q[t] || ``
          return A.createElement(
            A.Fragment,
            { key: n },
            A.createElement(ne, {
              ref: (e) => {
                X.current[t] = e
              },
              index: t,
              size: K,
              htmlSize: 1,
              className: f(H.input, `${B}-input`),
              style: U.input,
              onChange: le,
              value: i,
              onActiveChange: ue,
              autoFocus: t === 0 && v,
              onFocus: (e) => de(e, t),
              ...fe,
            }),
            t < r - 1 && A.createElement(re, { separator: m, index: t, prefixCls: B, className: f(H.separator), style: U.separator }),
          )
        }),
      ),
    )
  }),
  F = {
    icon: {
      tag: `svg`,
      attrs: { viewBox: `64 64 896 896`, focusable: `false` },
      children: [
        {
          tag: `path`,
          attrs: {
            d: `M942.2 486.2Q889.47 375.11 816.7 305l-50.88 50.88C807.31 395.53 843.45 447.4 874.7 512 791.5 684.2 673.4 766 512 766q-72.67 0-133.87-22.38L323 798.75Q408 838 512 838q288.3 0 430.2-300.3a60.29 60.29 0 000-51.5zm-63.57-320.64L836 122.88a8 8 0 00-11.32 0L715.31 232.2Q624.86 186 512 186q-288.3 0-430.2 300.3a60.3 60.3 0 000 51.5q56.69 119.4 136.5 191.41L112.48 835a8 8 0 000 11.31L155.17 889a8 8 0 0011.31 0l712.15-712.12a8 8 0 000-11.32zM149.3 512C232.6 339.8 350.7 258 512 258c54.54 0 104.13 9.36 149.12 28.39l-70.3 70.3a176 176 0 00-238.13 238.13l-83.42 83.42C223.1 637.49 183.3 582.28 149.3 512zm246.7 0a112.11 112.11 0 01146.2-106.69L401.31 546.2A112 112 0 01396 512z`,
          },
        },
        {
          tag: `path`,
          attrs: {
            d: `M508 624c-3.46 0-6.87-.16-10.25-.47l-52.82 52.82a176.09 176.09 0 00227.42-227.42l-52.82 52.82c.31 3.38.47 6.79.47 10.25a111.94 111.94 0 01-112 112z`,
          },
        },
      ],
    },
    name: `eye-invisible`,
    theme: `outlined`,
  }
function I() {
  return (
    (I = Object.assign
      ? Object.assign.bind()
      : function (e) {
          for (var t = 1; t < arguments.length; t++) {
            var n = arguments[t]
            for (var r in n) Object.prototype.hasOwnProperty.call(n, r) && (e[r] = n[r])
          }
          return e
        }),
    I.apply(this, arguments)
  )
}
var L = A.forwardRef((e, t) => A.createElement(v, I({}, e, { ref: t, icon: F }))),
  R = {
    icon: {
      tag: `svg`,
      attrs: { viewBox: `64 64 896 896`, focusable: `false` },
      children: [
        {
          tag: `path`,
          attrs: {
            d: `M942.2 486.2C847.4 286.5 704.1 186 512 186c-192.2 0-335.4 100.5-430.2 300.3a60.3 60.3 0 000 51.5C176.6 737.5 319.9 838 512 838c192.2 0 335.4-100.5 430.2-300.3 7.7-16.2 7.7-35 0-51.5zM512 766c-161.3 0-279.4-81.8-362.7-254C232.6 339.8 350.7 258 512 258c161.3 0 279.4 81.8 362.7 254C791.5 684.2 673.4 766 512 766zm-4-430c-97.2 0-176 78.8-176 176s78.8 176 176 176 176-78.8 176-176-78.8-176-176-176zm0 288c-61.9 0-112-50.1-112-112s50.1-112 112-112 112 50.1 112 112-50.1 112-112 112z`,
          },
        },
      ],
    },
    name: `eye`,
    theme: `outlined`,
  }
function z() {
  return (
    (z = Object.assign
      ? Object.assign.bind()
      : function (e) {
          for (var t = 1; t < arguments.length; t++) {
            var n = arguments[t]
            for (var r in n) Object.prototype.hasOwnProperty.call(n, r) && (e[r] = n[r])
          }
          return e
        }),
    z.apply(this, arguments)
  )
}
var B = A.forwardRef((e, t) => A.createElement(v, z({}, e, { ref: t, icon: R }))),
  V = (e) => (e ? A.createElement(B, null) : A.createElement(L, null)),
  H = { click: `onClick`, hover: `onMouseOver` },
  U = A.forwardRef((e, t) => {
    let { disabled: i, action: o = `click`, visibilityToggle: s = !0, iconRender: c = V, suffix: l } = e,
      u = A.useContext(a),
      d = i ?? u,
      p = r(s) && s.visible !== void 0,
      [g, _] = (0, A.useState)(() => (p ? s.visible : !1)),
      v = (0, A.useRef)(null)
    A.useEffect(() => {
      p && _(s.visible)
    }, [p, s])
    let y = T(v),
      b = () => {
        if (d) return
        g && y()
        let e = !g
        ;(_(e), r(s) && s.onVisibleChange?.(e))
      },
      ee = (e) => {
        let t = H[o] || ``,
          n = c(g),
          r = {
            [t]: b,
            className: `${e}-icon`,
            key: `passwordIcon`,
            onMouseDown: (e) => {
              e.preventDefault()
            },
            onMouseUp: (e) => {
              e.preventDefault()
            },
          }
        return A.cloneElement(A.isValidElement(n) ? n : A.createElement(`span`, null, n), r)
      },
      { className: x, prefixCls: te, inputPrefixCls: C, size: w, ...E } = e,
      { getPrefixCls: D } = A.useContext(n),
      O = D(`input`, C),
      k = D(`input-password`, te),
      j = s && ee(k),
      M = f(k, x, { [`${k}-${w}`]: !!w }),
      N = {
        ...m(E, [`suffix`, `iconRender`, `visibilityToggle`]),
        type: g ? `text` : `password`,
        className: M,
        prefixCls: O,
        suffix: A.createElement(A.Fragment, null, j, l),
      }
    return (w && (N.size = w), A.createElement(S, { ref: h(t, v), ...N }))
  }),
  ae = c([`Input`, `Search`], (e) => {
    let { componentCls: t } = e,
      n = `${t}-btn`
    return {
      [t]: {
        width: `100%`,
        [n]: {
          '&-filled': {
            background: e.colorFillTertiary,
            '&:not(:disabled)': { '&:hover': { background: e.colorFillSecondary }, '&:active': { background: e.colorFill } },
          },
        },
      },
    }
  }),
  W = A.forwardRef((e, t) => {
    let {
        prefixCls: n,
        inputPrefixCls: r,
        className: i,
        size: a,
        style: o,
        enterButton: c = !1,
        addonAfter: _,
        loading: v,
        disabled: b,
        onSearch: x,
        onChange: te,
        onCompositionStart: C,
        onCompositionEnd: w,
        variant: T,
        onPressEnter: E,
        classNames: D,
        styles: O,
        hidden: j,
        ...M
      } = e,
      { direction: N, getPrefixCls: ne, classNames: P, styles: re } = ee(`inputSearch`),
      ie = { ...e, enterButton: c },
      [F, I] = s([P, D], [re, O], { props: ie }, { button: { _default: `root` } }),
      L = A.useRef(!1),
      R = ne(`input-search`, n),
      z = ne(`input`, r),
      [B, V] = ae(R),
      { compactSize: H } = d(R, N),
      U = u((e) => a ?? H ?? e),
      W = A.useRef(null),
      G = (e) => {
        ;(e?.target && e.type === `click` && x && x(e.target.value, e, { source: `clear` }), te?.(e))
      },
      K = (e) => {
        document.activeElement === W.current?.input && e.preventDefault()
      },
      q = (e) => {
        x && x(W.current?.input?.value, e, { source: `input` })
      },
      J = (e) => {
        L.current || v || (E?.(e), q(e))
      },
      oe = typeof c == `boolean` ? A.createElement(k, null) : null,
      Y = `${R}-btn`,
      X = f(Y, { [`${Y}-${T}`]: T }),
      Z,
      Q = c || {},
      $ = Q.type && Q.type.__ANT_BUTTON === !0
    ;((Z =
      $ || Q.type === `button`
        ? p(Q, {
            onMouseDown: K,
            onClick: (e) => {
              ;(Q?.props?.onClick?.(e), q(e))
            },
            key: `enterButton`,
            ...($ ? { className: X, size: U } : {}),
          })
        : A.createElement(
            g,
            {
              classNames: F.button,
              styles: I.button,
              className: X,
              color: c ? `primary` : `default`,
              size: U,
              disabled: b,
              key: `enterButton`,
              onMouseDown: K,
              onClick: q,
              loading: v,
              icon: oe,
              variant: T === `borderless` || T === `filled` || T === `underlined` ? `text` : c ? `solid` : void 0,
            },
            c,
          )),
      _ && (Z = [Z, p(_, { key: `addonAfter` })]))
    let se = f(R, V, { [`${R}-rtl`]: N === `rtl`, [`${R}-${U}`]: !!U, [`${R}-with-button`]: !!c }, i, B, F.root),
      ce = (e) => {
        ;((L.current = !0), C?.(e))
      },
      le = (e) => {
        ;((L.current = !1), w?.(e))
      },
      ue = l(M, { data: !0 }),
      de = m(
        {
          ...M,
          classNames: m(F, [`button`, `root`]),
          styles: m(I, [`button`, `root`]),
          prefixCls: z,
          type: `search`,
          size: U,
          variant: T,
          onPressEnter: J,
          onCompositionStart: ce,
          onCompositionEnd: le,
          onChange: G,
          disabled: b,
        },
        Object.keys(ue),
      )
    return A.createElement(y, { className: se, style: { ...o, ...I.root }, ...ue, hidden: j }, A.createElement(S, { ref: h(W, t), ...de }), Z)
  }),
  G = S
;((G.Group = j), (G.Search = W), (G.TextArea = w), (G.Password = U), (G.OTP = ie))
export { G as t }
