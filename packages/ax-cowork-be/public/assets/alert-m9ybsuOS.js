import { a as e, n as t } from './jsx-runtime-B6doAwFl.js'
import {
  Bt as n,
  Ft as r,
  It as i,
  Jt as a,
  K as o,
  Lt as s,
  Pt as c,
  U as l,
  Vt as u,
  W as d,
  at as f,
  ct as p,
  et as m,
  ft as h,
  in as g,
  it as _,
  mn as ee,
  mt as v,
  rt as y,
  tn as b,
  tt as x,
} from './button-BU_eysIT.js'
import { gt as S, ht as C } from './typography-_G6plS4i.js'
var w = e(t()),
  T = (e, t, n, r, i) => ({ background: e, border: `${a(r.lineWidth)} ${r.lineType} ${t}`, [`${i}-icon`]: { color: n } }),
  E = (e) => {
    let {
      componentCls: t,
      motionDurationSlow: n,
      marginXS: r,
      marginSM: i,
      fontSize: a,
      fontSizeLG: o,
      lineHeight: s,
      borderRadiusLG: c,
      motionEaseInOutCirc: l,
      withDescriptionIconSize: u,
      colorText: d,
      colorTextHeading: f,
      withDescriptionPadding: p,
      defaultPadding: m,
    } = e
    return {
      [t]: {
        ...v(e),
        position: `relative`,
        display: `flex`,
        alignItems: `center`,
        padding: m,
        wordWrap: `break-word`,
        borderRadius: c,
        [`&${t}-rtl`]: { direction: `rtl` },
        [`${t}-section`]: { flex: 1, minWidth: 0 },
        [`${t}-icon`]: { marginInlineEnd: r, lineHeight: 0 },
        '&-description': { display: `none`, fontSize: a, lineHeight: s },
        '&-title': { color: f },
        [`&${t}-motion-leave`]: {
          overflow: `hidden`,
          opacity: 1,
          transition: [`max-height`, `opacity`, `padding-top`, `padding-bottom`, `margin-bottom`].map((e) => `${e} ${n} ${l}`).join(`, `),
        },
        [`&${t}-motion-leave-active`]: { maxHeight: 0, marginBottom: `0 !important`, paddingTop: 0, paddingBottom: 0, opacity: 0 },
      },
      [`${t}-with-description`]: {
        alignItems: `flex-start`,
        padding: p,
        [`${t}-icon`]: { marginInlineEnd: i, fontSize: u, lineHeight: 0 },
        [`${t}-title`]: { display: `block`, marginBottom: r, color: f, fontSize: o },
        [`${t}-description`]: { display: `block`, color: d },
      },
      [`${t}-banner`]: { marginBottom: 0, border: `0 !important`, borderRadius: 0 },
    }
  },
  D = (e) => {
    let {
      componentCls: t,
      colorSuccess: n,
      colorSuccessBorder: r,
      colorSuccessBg: i,
      colorWarning: a,
      colorWarningBorder: o,
      colorWarningBg: s,
      colorError: c,
      colorErrorBorder: l,
      colorErrorBg: u,
      colorInfo: d,
      colorInfoBorder: f,
      colorInfoBg: p,
    } = e
    return {
      [t]: {
        '&-success': T(i, r, n, e, t),
        '&-info': T(p, f, d, e, t),
        '&-warning': T(s, o, a, e, t),
        '&-error': { ...T(u, l, c, e, t), [`${t}-description > pre`]: { margin: 0, padding: 0 } },
      },
    }
  },
  O = (e) => {
    let { componentCls: t, iconCls: n, motionDurationMid: r, marginXS: i, fontSizeIcon: o, colorIcon: s, colorIconHover: c } = e
    return {
      [t]: {
        '&-actions': { marginInlineStart: i },
        [`${t}-close-icon`]: {
          marginInlineStart: i,
          padding: 0,
          overflow: `hidden`,
          fontSize: o,
          lineHeight: a(o),
          backgroundColor: `transparent`,
          border: `none`,
          cursor: `pointer`,
          ...h(e),
          [`${n}-close`]: { color: s, transition: `color ${r}`, '&:hover': { color: c } },
        },
        '&-close-text': { color: s, transition: `color ${r}`, '&:hover': { color: c } },
      },
    }
  },
  te = p(
    `Alert`,
    (e) => [E(e), D(e), O(e)],
    (e) => ({
      withDescriptionIconSize: e.fontSizeHeading3,
      defaultPadding: `${e.paddingContentVerticalSM}px 12px`,
      withDescriptionPadding: `${e.paddingMD}px ${e.paddingContentHorizontalLG}px`,
    }),
  ),
  ne = (e) => {
    let { icon: t, type: n, className: r, style: i, successIcon: a, infoIcon: o, warningIcon: s, errorIcon: c } = e,
      l = {
        success: a ?? w.createElement(f, null),
        info: o ?? w.createElement(C, null),
        error: c ?? w.createElement(_, null),
        warning: s ?? w.createElement(y, null),
      }
    return w.createElement(`span`, { className: r, style: i }, t ?? l[n])
  },
  k = (e) => {
    let { isClosable: t, prefixCls: n, closeIcon: r, handleClose: i, ariaProps: a, className: o, style: s } = e,
      c = r === !0 || r === void 0 ? w.createElement(S, null) : r
    return t ? w.createElement(`button`, { type: `button`, onClick: i, className: g(`${n}-close-icon`, o), tabIndex: 0, style: s, ...a }, c) : null
  },
  A = w.forwardRef((e, t) => {
    let {
        description: n,
        prefixCls: r,
        message: i,
        title: a,
        banner: s,
        className: c,
        rootClassName: u,
        style: f,
        onMouseEnter: p,
        onMouseLeave: h,
        onClick: _,
        afterClose: v,
        showIcon: y,
        closable: S,
        closeText: C,
        closeIcon: T,
        action: E,
        id: D,
        styles: O,
        classNames: A,
        ...j
      } = e,
      M = a ?? i,
      [N, re] = w.useState(!1),
      P = w.useRef(null)
    w.useImperativeHandle(t, () => ({ nativeElement: P.current }))
    let {
        getPrefixCls: ie,
        direction: ae,
        closable: F,
        closeIcon: I,
        className: L,
        style: R,
        classNames: z,
        styles: B,
        successIcon: V,
        infoIcon: H,
        warningIcon: U,
        errorIcon: W,
      } = b(`alert`),
      G = ie(`alert`, r),
      [K, q] = te(G),
      { onClose: oe, afterClose: se } = o(S) ? S : {},
      ce = (t) => {
        ;(re(!0), (oe ?? e.onClose)?.(t))
      },
      J = w.useMemo(() => (e.type === void 0 ? (s ? `warning` : `info`) : e.type), [e.type, s]),
      Y = w.useMemo(() => ((o(S) && S.closeIcon) || C ? !0 : typeof S == `boolean` ? S : T !== !1 && d(T) ? !0 : !!F), [C, T, S, F]),
      X = s && y === void 0 ? !0 : y,
      Z = { ...e, prefixCls: G, type: J, showIcon: X, closable: Y },
      [Q, $] = l([z, A], [B, O], { props: Z }),
      le = g(G, `${G}-${J}`, { [`${G}-with-description`]: !!n, [`${G}-no-icon`]: !X, [`${G}-banner`]: !!s, [`${G}-rtl`]: ae === `rtl` }, L, c, u, Q.root, q, K),
      ue = m(j, { aria: !0, data: !0 }),
      de = w.useMemo(() => (o(S) && S.closeIcon ? S.closeIcon : C || (T === void 0 ? (o(F) && F.closeIcon ? F.closeIcon : I) : T)), [T, S, F, C, I]),
      fe = w.useMemo(() => {
        let e = S ?? F
        return o(e) ? m(e, { data: !0, aria: !0 }) : {}
      }, [S, F])
    return w.createElement(
      x,
      { visible: !N, motionName: `${G}-motion`, motionAppear: !1, motionEnter: !1, onLeaveStart: (e) => ({ maxHeight: e.offsetHeight }), onLeaveEnd: se ?? v },
      ({ className: t, style: r }, i) =>
        w.createElement(
          `div`,
          {
            id: D,
            ref: ee(P, i),
            'data-show': !N,
            className: g(le, t),
            style: { ...$.root, ...R, ...f, ...r },
            onMouseEnter: p,
            onMouseLeave: h,
            onClick: _,
            role: `alert`,
            ...ue,
          },
          X
            ? w.createElement(ne, {
                className: g(`${G}-icon`, Q.icon),
                style: $.icon,
                description: n,
                icon: e.icon,
                prefixCls: G,
                type: J,
                successIcon: V,
                infoIcon: H,
                warningIcon: U,
                errorIcon: W,
              })
            : null,
          w.createElement(
            `div`,
            { className: g(`${G}-section`, Q.section), style: $.section },
            M ? w.createElement(`div`, { className: g(`${G}-title`, Q.title), style: $.title }, M) : null,
            n ? w.createElement(`div`, { className: g(`${G}-description`, Q.description), style: $.description }, n) : null,
          ),
          E ? w.createElement(`div`, { className: g(`${G}-actions`, Q.actions), style: $.actions }, E) : null,
          w.createElement(k, { className: Q.close, style: $.close, isClosable: Y, prefixCls: G, closeIcon: de, handleClose: ce, ariaProps: fe }),
        ),
    )
  })
function j(e, t, n) {
  return ((t = i(t)), c(e, r() ? Reflect.construct(t, n || [], i(e).constructor) : t.apply(e, n)))
}
var M = (function (e) {
    function t() {
      var e
      return (u(this, t), (e = j(this, t, arguments)), (e.state = { error: void 0, info: {} }), e)
    }
    return (
      s(t, e),
      n(t, [
        {
          key: `componentDidCatch`,
          value: function (e, t) {
            this.setState({ error: e, info: t })
          },
        },
        {
          key: `render`,
          value: function () {
            let { message: e, title: t, description: n, id: r, children: i } = this.props,
              { error: a, info: o } = this.state,
              s = t ?? e,
              c = o?.componentStack || null,
              l = d(s) ? s : a?.toString(),
              u = d(n) ? n : c
            return a
              ? w.createElement(A, {
                  id: r,
                  type: `error`,
                  title: l,
                  description: w.createElement(`pre`, { style: { fontSize: `0.9em`, overflowX: `auto` } }, u),
                })
              : i
          },
        },
      ])
    )
  })(w.PureComponent),
  N = A
N.ErrorBoundary = M
export { N as t }
