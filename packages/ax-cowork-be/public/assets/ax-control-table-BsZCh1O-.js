import { a as e, n as t, t as n } from './jsx-runtime-B6doAwFl.js'
import {
  $t as r,
  Dn as i,
  G as a,
  Jt as o,
  K as s,
  Mt as c,
  O as l,
  Tn as u,
  U as d,
  W as f,
  _ as p,
  _t as m,
  bn as h,
  c as g,
  ct as _,
  dt as v,
  ft as y,
  h as b,
  in as x,
  j as S,
  ln as C,
  mt as w,
  ot as T,
  q as E,
  rn as D,
  sn as O,
  t as k,
  tn as A,
  u as j,
  v as ee,
  vn as te,
} from './button-BU_eysIT.js'
import { B as ne, S as re, b as M, ct as ie, dt as N, h as P, r as ae, tt as F, ut as I, w as oe, x as L, y as se } from './typography-_G6plS4i.js'
import { B as R, F as ce, I as z, L as le, R as ue, c as de, h as fe, l as pe, n as B, z as V } from './AxMuiIcon-CelvnH-o.js'
import { n as me, o as he, r as ge, t as _e } from './menu-CmMxyigb.js'
import { n as ve, t as ye } from './useBubbleLock-DdMqRyyU.js'
import { t as be } from './input-CYA5sF8X.js'
var H = e(t()),
  xe = (e) => {
    let { componentCls: t, menuCls: n, colorError: r, colorTextLightSolid: i } = e,
      a = `${n}-item`
    return {
      [`${t}, ${t}-menu-submenu`]: { [`${n} ${a}`]: { [`&${a}-danger:not(${a}-disabled)`]: { color: r, '&:hover': { color: i, backgroundColor: r } } } },
    }
  },
  Se = (e) => {
    let {
      componentCls: t,
      menuCls: n,
      zIndexPopup: r,
      dropdownArrowDistance: i,
      sizePopupArrow: a,
      antCls: s,
      iconCls: c,
      motionDurationMid: l,
      paddingBlock: u,
      fontSize: d,
      dropdownEdgeChildPadding: f,
      colorTextDisabled: p,
      fontSizeIcon: m,
      controlPaddingHorizontal: h,
      colorBgElevated: g,
    } = e
    return [
      {
        [t]: {
          position: `absolute`,
          top: -9999,
          left: { _skip_check_: !0, value: -9999 },
          zIndex: r,
          display: `block`,
          '&::before': { position: `absolute`, insetBlock: e.calc(a).div(2).sub(i).equal(), zIndex: -9999, opacity: 1e-4, content: `""` },
          '&-menu-vertical': { maxHeight: `100vh`, overflowY: `auto` },
          [`&-trigger${s}-btn`]: { [`& > ${c}-down, & > ${s}-btn-icon > ${c}-down`]: { fontSize: m } },
          [`${t}-wrap`]: { position: `relative`, [`${s}-btn > ${c}-down`]: { fontSize: m }, [`${c}-down::before`]: { transition: `transform ${l}` } },
          [`${t}-wrap-open`]: { [`${c}-down::before`]: { transform: `rotate(180deg)` } },
          '&-hidden, &-menu-hidden, &-menu-submenu-hidden': { display: `none` },
          [`&${s}-slide-down-enter${s}-slide-down-enter-active${t}-placement-bottomLeft,
          &${s}-slide-down-appear${s}-slide-down-appear-active${t}-placement-bottomLeft,
          &${s}-slide-down-enter${s}-slide-down-enter-active${t}-placement-bottom,
          &${s}-slide-down-appear${s}-slide-down-appear-active${t}-placement-bottom,
          &${s}-slide-down-enter${s}-slide-down-enter-active${t}-placement-bottomRight,
          &${s}-slide-down-appear${s}-slide-down-appear-active${t}-placement-bottomRight`]: { animationName: ue },
          [`&${s}-slide-up-enter${s}-slide-up-enter-active${t}-placement-topLeft,
          &${s}-slide-up-appear${s}-slide-up-appear-active${t}-placement-topLeft,
          &${s}-slide-up-enter${s}-slide-up-enter-active${t}-placement-top,
          &${s}-slide-up-appear${s}-slide-up-appear-active${t}-placement-top,
          &${s}-slide-up-enter${s}-slide-up-enter-active${t}-placement-topRight,
          &${s}-slide-up-appear${s}-slide-up-appear-active${t}-placement-topRight`]: { animationName: z },
          [`&${s}-slide-down-leave${s}-slide-down-leave-active${t}-placement-bottomLeft,
          &${s}-slide-down-leave${s}-slide-down-leave-active${t}-placement-bottom,
          &${s}-slide-down-leave${s}-slide-down-leave-active${t}-placement-bottomRight`]: { animationName: V },
          [`&${s}-slide-up-leave${s}-slide-up-leave-active${t}-placement-topLeft,
          &${s}-slide-up-leave${s}-slide-up-leave-active${t}-placement-top,
          &${s}-slide-up-leave${s}-slide-up-leave-active${t}-placement-topRight`]: { animationName: le },
        },
      },
      L(e, g, { arrowPlacement: { top: !0, bottom: !0 } }),
      {
        [`${t} ${n}`]: { position: `relative`, margin: 0 },
        [`${n}-submenu-popup`]: {
          position: `absolute`,
          zIndex: r,
          background: `transparent`,
          boxShadow: `none`,
          transformOrigin: `0 0`,
          'ul, li': { listStyle: `none`, margin: 0 },
        },
        [`${t}, ${t}-menu-submenu`]: {
          ...w(e),
          [n]: {
            padding: f,
            listStyleType: `none`,
            backgroundColor: g,
            backgroundClip: `padding-box`,
            borderRadius: e.borderRadiusLG,
            outline: `none`,
            boxShadow: e.boxShadowSecondary,
            ...y(e),
            '&:empty': { padding: 0, boxShadow: `none` },
            [`${n}-item-group-title`]: { padding: `${o(u)} ${o(h)}`, color: e.colorTextDescription, transition: `all ${l}` },
            [`${n}-item`]: { position: `relative`, display: `flex`, alignItems: `center` },
            [`${n}-item-icon`]: { minWidth: d, marginInlineEnd: e.marginXS, fontSize: e.fontSizeSM },
            [`${n}-title-content`]: {
              flex: `auto`,
              '&-with-extra': { display: `inline-flex`, alignItems: `center`, width: `100%` },
              '> a': {
                color: `inherit`,
                transition: `all ${l}`,
                '&:hover': { color: `inherit` },
                '&::after': { position: `absolute`, inset: 0, content: `""` },
              },
              [`${n}-item-extra`]: { paddingInlineStart: e.padding, marginInlineStart: `auto`, fontSize: e.fontSizeSM, color: e.colorTextDescription },
            },
            [`${n}-item, ${n}-submenu-title`]: {
              display: `flex`,
              margin: 0,
              padding: `${o(u)} ${o(h)}`,
              color: e.colorText,
              fontWeight: `normal`,
              fontSize: d,
              lineHeight: e.lineHeight,
              cursor: `pointer`,
              transition: `all ${l}`,
              borderRadius: e.borderRadiusSM,
              '&:hover, &-active': { backgroundColor: e.controlItemBgHover },
              ...y(e),
              '&-selected': {
                color: e.colorPrimary,
                backgroundColor: e.controlItemBgActive,
                '&:hover, &-active': { backgroundColor: e.controlItemBgActiveHover },
              },
              '&-disabled': {
                color: p,
                cursor: `not-allowed`,
                '&:hover': { color: p, backgroundColor: g, cursor: `not-allowed` },
                a: { pointerEvents: `none` },
              },
              '&-divider': { height: 1, margin: `${o(e.marginXXS)} 0`, overflow: `hidden`, lineHeight: 0, backgroundColor: e.colorSplit },
              [`${t}-menu-submenu-expand-icon`]: {
                position: `absolute`,
                insetInlineEnd: e.paddingXS,
                [`${t}-menu-submenu-arrow-icon`]: { marginInlineEnd: `0 !important`, color: e.colorIcon, fontSize: m, fontStyle: `normal` },
              },
            },
            [`${n}-item-group-list`]: { margin: `0 ${o(e.marginXS)}`, padding: 0, listStyle: `none` },
            [`${n}-submenu-title`]: { paddingInlineEnd: e.calc(h).add(e.fontSizeSM).equal() },
            [`${n}-submenu-vertical`]: { position: `relative` },
            [`${n}-submenu${n}-submenu-disabled ${t}-menu-submenu-title`]: {
              [`&, ${t}-menu-submenu-arrow-icon`]: { color: p, backgroundColor: g, cursor: `not-allowed` },
            },
            [`${n}-submenu-selected ${t}-menu-submenu-title`]: { color: e.colorPrimary },
          },
        },
      },
      [ce(e, `slide-up`), ce(e, `slide-down`), R(e, `move-up`), R(e, `move-down`), F(e, `zoom-big`)],
    ]
  },
  Ce = _(
    `Dropdown`,
    (e) => {
      let { marginXXS: t, sizePopupArrow: n, paddingXXS: r, componentCls: i } = e,
        a = c(e, { menuCls: `${i}-menu`, dropdownArrowDistance: e.calc(n).div(2).add(t).equal(), dropdownEdgeChildPadding: r })
      return [Se(a), xe(a)]
    },
    (e) => ({
      zIndexPopup: e.zIndexPopupBase + 50,
      paddingBlock: (e.controlHeight - e.fontSize * e.lineHeight) / 2,
      ...M({ contentRadius: e.borderRadiusLG, limitVerticalRadius: !0 }),
      ...re(e),
    }),
    { resetStyle: !1 },
  ),
  U = (e) => {
    let {
        menu: t,
        arrow: n,
        prefixCls: r,
        children: i,
        trigger: a,
        disabled: o,
        dropdownRender: c,
        popupRender: l,
        getPopupContainer: f,
        overlayClassName: p,
        rootClassName: _,
        overlayStyle: v,
        open: y,
        onOpenChange: b,
        mouseEnterDelay: w = 0.15,
        mouseLeaveDelay: T = 0.1,
        autoAdjustOverflow: D = !0,
        placement: k = ``,
        transitionName: j,
        classNames: ee,
        styles: te,
        destroyPopupOnHide: ne,
        destroyOnHidden: re,
      } = e,
      { getPrefixCls: M, direction: P, getPopupContainer: ae, className: F, style: oe, classNames: L, styles: R } = A(`dropdown`),
      ce = { ...e, mouseEnterDelay: w, mouseLeaveDelay: T, autoAdjustOverflow: D },
      [z, le] = d([L, ee], [R, te], { props: ce }),
      ue = { ...oe, ...v, ...le.root },
      fe = l || c
    O(`Dropdown`)
    let pe = H.useMemo(() => {
        let e = M()
        return j === void 0 ? (k.includes(`top`) ? `${e}-slide-down` : `${e}-slide-up`) : j
      }, [M, k, j]),
      B = H.useMemo(() => (k ? (k.includes(`Center`) ? k.slice(0, k.indexOf(`Center`)) : k) : P === `rtl` ? `bottomRight` : `bottomLeft`), [k, P]),
      V = M(`dropdown`, r),
      ge = ie(V),
      [ve, ye] = Ce(V, ge),
      [, be] = m(),
      xe = H.Children.only(E(i) ? H.createElement(`span`, null, i) : i),
      Se = S(xe, { className: x(`${V}-trigger`, { [`${V}-rtl`]: P === `rtl` }, xe.props.className), disabled: xe.props.disabled ?? o }),
      U = o ? [] : a,
      we = !!U?.includes(`contextMenu`),
      [Te, Ee] = h(!1, y),
      De = u((e) => {
        ;(b?.(e, { source: `trigger` }), Ee(e))
      }),
      Oe = x(p, _, ve, ye, ge, F, z.root, { [`${V}-rtl`]: P === `rtl` }),
      ke = se({
        arrowPointAtCenter: s(n) && n.pointAtCenter,
        autoAdjustOverflow: D,
        offset: be.marginXXS,
        arrowWidth: n ? be.sizePopupArrow : 0,
        borderRadius: be.borderRadius,
      }),
      Ae = u(() => {
        ;(t?.selectable && t?.multiple) || (b?.(!1, { source: `menu` }), Ee(!1))
      }),
      W = () => {
        let e = C(z, [`root`]),
          n = C(le, [`root`]),
          r
        return (
          t?.items && (r = H.createElement(_e, { ...t, classNames: { ...e, subMenu: { ...e } }, styles: { ...n, subMenu: { ...n } } })),
          fe && (r = fe(r)),
          (r = H.Children.only(typeof r == `string` ? H.createElement(`span`, null, r) : r)),
          H.createElement(
            me,
            {
              prefixCls: `${V}-menu`,
              rootClassName: x(ye, ge),
              expandIcon: H.createElement(
                `span`,
                { className: `${V}-menu-submenu-arrow` },
                P === `rtl`
                  ? H.createElement(de, { className: `${V}-menu-submenu-arrow-icon` })
                  : H.createElement(g, { className: `${V}-menu-submenu-arrow-icon` }),
              ),
              mode: `vertical`,
              selectable: !1,
              onClick: Ae,
              validator: ({ mode: e }) => {},
            },
            r,
          )
        )
      },
      [je, Me] = I(`Dropdown`, ue.zIndex),
      Ne = H.createElement(
        he,
        {
          alignPoint: we,
          ...C(e, [`rootClassName`, `onOpenChange`]),
          mouseEnterDelay: w,
          mouseLeaveDelay: T,
          visible: Te,
          builtinPlacements: ke,
          arrow: !!n,
          overlayClassName: Oe,
          prefixCls: V,
          getPopupContainer: f || ae,
          transitionName: pe,
          trigger: U,
          overlay: W,
          placement: B,
          onVisibleChange: De,
          overlayStyle: { ...ue, zIndex: je },
          autoDestroy: re ?? ne,
        },
        Se,
      )
    return (je && (Ne = H.createElement(N.Provider, { value: Me }, Ne)), Ne)
  },
  we = fe(U, `align`, void 0, `dropdown`, (e) => e)
U._InternalPanelDoNotUseOrYouWillBeFired = (e) => H.createElement(we, { ...e }, H.createElement(`span`, null))
var Te = (e) => {
  let { checkboxCls: t, checkboxSize: n, lineWidth: r } = e,
    i = `${t}-wrapper`
  return [
    {
      [`${t}-group`]: { ...w(e), display: `inline-flex`, flexWrap: `wrap`, columnGap: e.marginXS, [`> ${e.antCls}-row`]: { flex: 1 } },
      [i]: {
        ...w(e),
        display: `inline-flex`,
        alignItems: `baseline`,
        cursor: `pointer`,
        '&:after': { display: `inline-block`, width: 0, overflow: `hidden`, content: `'\\a0'` },
        [`& + ${i}`]: { marginInlineStart: 0 },
        [`&${i}-in-form-item`]: { 'input[type="checkbox"]': { width: 14, height: 14 } },
      },
      [t]: {
        ...w(e),
        position: `relative`,
        whiteSpace: `nowrap`,
        lineHeight: 1,
        cursor: `pointer`,
        alignSelf: `center`,
        boxSizing: `border-box`,
        display: `block`,
        width: n,
        height: n,
        direction: `ltr`,
        backgroundColor: e.colorBgContainer,
        border: `${o(r)} ${e.lineType} ${e.colorBorder}`,
        borderRadius: e.borderRadiusSM,
        borderCollapse: `separate`,
        transition: `all ${e.motionDurationSlow}`,
        flex: `none`,
        ...j(),
        '&:after': {
          boxSizing: `border-box`,
          position: `absolute`,
          top: `calc(${n} / 2 - ${r})`,
          insetInlineStart: `calc(${n} / 4 - ${r})`,
          display: `table`,
          width: e.calc(n).div(14).mul(5).equal(),
          height: e.calc(n).div(14).mul(8).equal(),
          border: `${o(e.lineWidthBold)} solid ${e.colorWhite}`,
          borderTop: 0,
          borderInlineStart: 0,
          transform: `rotate(45deg) scale(0) translate(-50%,-50%)`,
          opacity: 0,
          content: `""`,
          transition: `all ${e.motionDurationFast} ${e.motionEaseInBack}, opacity ${e.motionDurationFast}`,
          ...j(),
        },
        [`${t}-input`]: { position: `absolute`, inset: `calc(-1 * (${r}))`, zIndex: 1, cursor: `pointer`, opacity: 0, margin: 0 },
        [`&:has(${t}-input:focus-visible)`]: v(e),
        '& + span': { paddingInlineStart: e.paddingXS, paddingInlineEnd: e.paddingXS },
      },
    },
    {
      [`
        ${i}:not(${i}-disabled),
        ${t}:not(${t}-disabled)
      `]: { [`&:hover ${t}`]: { borderColor: e.colorPrimary } },
      [`${i}:not(${i}-disabled)`]: { [`&:hover ${t}-checked:not(${t}-disabled)`]: { backgroundColor: e.colorPrimaryHover, borderColor: `transparent` } },
    },
    {
      [`${t}-checked`]: {
        backgroundColor: e.colorPrimary,
        borderColor: e.colorPrimary,
        '&:after': {
          opacity: 1,
          transform: `rotate(45deg) scale(1) translate(-50%,-50%)`,
          transition: `all ${e.motionDurationMid} ${e.motionEaseOutBack} ${e.motionDurationFast}`,
          ...j(),
        },
        [`&:not(${t}-disabled):hover`]: { backgroundColor: e.colorPrimaryHover, borderColor: `transparent` },
      },
    },
    {
      [t]: {
        '&-indeterminate': {
          backgroundColor: e.colorBgContainer,
          borderColor: e.colorBorder,
          '&:after': {
            top: `50%`,
            insetInlineStart: `50%`,
            width: e.calc(e.fontSizeLG).div(2).equal(),
            height: e.calc(e.fontSizeLG).div(2).equal(),
            backgroundColor: e.colorPrimary,
            border: 0,
            transform: `translate(-50%, -50%) scale(1)`,
            opacity: 1,
            content: `""`,
          },
          '&:hover': { backgroundColor: e.colorBgContainer, borderColor: e.colorPrimary },
        },
      },
    },
    {
      [`${i}-disabled`]: { cursor: `not-allowed` },
      [`${t}-disabled`]: {
        [`&, ${t}-input`]: { cursor: `not-allowed`, pointerEvents: `none` },
        background: e.colorBgContainerDisabled,
        borderColor: e.colorBorder,
        '&:after': { borderColor: e.colorTextDisabled },
        '& + span': { color: e.colorTextDisabled },
        [`&${t}-indeterminate::after`]: { background: e.colorTextDisabled },
      },
    },
  ]
}
function Ee(e, t) {
  return Te(c(t, { checkboxCls: `.${e}`, checkboxSize: t.controlInteractiveSize }))
}
var De = _(`Checkbox`, (e, { prefixCls: t }) => [Ee(t, e)]),
  Oe = H.createContext(null),
  ke = H.forwardRef((e, t) => {
    let {
        prefixCls: n,
        children: r,
        indeterminate: i = !1,
        onMouseEnter: a,
        onMouseLeave: o,
        skipGroup: s = !1,
        disabled: c,
        rootClassName: m,
        className: g,
        style: _,
        classNames: v,
        styles: y,
        name: b,
        value: S,
        checked: C,
        defaultChecked: w,
        onChange: T,
        ...E
      } = e,
      { getPrefixCls: D, direction: O, className: k, style: j, classNames: re, styles: M } = A(`checkbox`),
      N = H.useContext(Oe),
      { isFormItemInput: P } = H.useContext(ne),
      ae = H.useContext(l),
      F = (N?.disabled || c) ?? ae,
      [I, oe] = h(w, C),
      L = I,
      se = u((e) => {
        ;(oe(e.target.checked), T?.(e), !s && N?.toggleOption && N.toggleOption({ label: r, value: S }))
      })
    N && !s && (L = N.value.includes(S))
    let R = H.useRef(null),
      ce = te(t, R)
    ;(H.useEffect(() => {
      if (!(s || !N))
        return (
          N.registerValue(S),
          () => {
            N.cancelValue(S)
          }
        )
    }, [S, s]),
      H.useEffect(() => {
        R.current?.input && (R.current.input.indeterminate = i)
      }, [i]))
    let z = D(`checkbox`, n),
      le = ie(z),
      [ue, de] = De(z, le),
      fe = { ...E },
      pe = { ...e, indeterminate: i, disabled: F, checked: L },
      [B, V] = d([re, v], [M, y], { props: pe }),
      me = x(
        `${z}-wrapper`,
        { [`${z}-rtl`]: O === `rtl`, [`${z}-wrapper-checked`]: L, [`${z}-wrapper-disabled`]: F, [`${z}-wrapper-in-form-item`]: P },
        k,
        g,
        B.root,
        m,
        de,
        le,
        ue,
      ),
      he = x(B.icon, { [`${z}-indeterminate`]: i }, ee, ue),
      [ge, _e] = ye(fe.onClick)
    return H.createElement(
      p,
      { component: `Checkbox`, disabled: F },
      H.createElement(
        `label`,
        { className: me, style: { ...V.root, ...j, ..._ }, onMouseEnter: a, onMouseLeave: o, onClick: ge },
        H.createElement(ve, {
          ...fe,
          name: !s && N ? N.name : b,
          checked: L,
          onClick: _e,
          onChange: se,
          prefixCls: z,
          className: he,
          style: V.icon,
          disabled: F,
          ref: ce,
          value: S,
        }),
        f(r) && H.createElement(`span`, { className: x(`${z}-label`, B.label), style: V.label }, r),
      ),
    )
  }),
  Ae = H.forwardRef((e, t) => {
    let { defaultValue: n, children: i, options: o = [], prefixCls: s, className: c, rootClassName: l, style: u, onChange: d, role: f = `group`, ...p } = e,
      { getPrefixCls: m, direction: h } = H.useContext(r),
      [g, _] = H.useState(p.value || n || []),
      [v, y] = H.useState([])
    H.useEffect(() => {
      ;`value` in p && _(p.value || [])
    }, [p.value])
    let b = H.useMemo(() => o.map((e) => (typeof e == `string` || a(e) ? { label: e, value: e } : e)), [o]),
      S = (e) => {
        y((t) => t.filter((t) => t !== e))
      },
      w = (e) => {
        y((t) => [].concat(D(t), [e]))
      },
      T = (e) => {
        let t = g.indexOf(e.value),
          n = D(g)
        ;(t === -1 ? n.push(e.value) : n.splice(t, 1),
          `value` in p || _(n),
          d?.(n.filter((e) => v.includes(e)).sort((e, t) => b.findIndex((t) => t.value === e) - b.findIndex((e) => e.value === t))))
      },
      E = m(`checkbox`, s),
      O = `${E}-group`,
      k = ie(E),
      [A, j] = De(E, k),
      ee = C(p, [`value`, `disabled`]),
      te = o.length
        ? b.map((e) =>
            H.createElement(
              ke,
              {
                prefixCls: E,
                key: e.value.toString(),
                disabled: `disabled` in e ? e.disabled : p.disabled,
                value: e.value,
                checked: g.includes(e.value),
                onChange: e.onChange,
                className: x(`${O}-item`, e.className),
                style: e.style,
                title: e.title,
                id: e.id,
                required: e.required,
              },
              e.label,
            ),
          )
        : i,
      ne = H.useMemo(
        () => ({ toggleOption: T, value: g, disabled: p.disabled, name: p.name, registerValue: w, cancelValue: S }),
        [T, g, p.disabled, p.name, w, S],
      ),
      re = x(O, { [`${O}-rtl`]: h === `rtl` }, c, l, j, k, A)
    return H.createElement(`div`, { className: re, style: u, role: f, ...ee, ref: t }, H.createElement(Oe.Provider, { value: ne }, te))
  }),
  W = ke
;((W.Group = Ae), (W.__ANT_CHECKBOX = !0))
var je = (e) => {
  let { getPopupContainer: t, getPrefixCls: n, direction: i } = H.useContext(r),
    {
      prefixCls: a,
      type: o = `default`,
      danger: s,
      disabled: c,
      loading: l,
      onClick: u,
      htmlType: d,
      children: f,
      className: p,
      menu: m,
      arrow: h,
      autoFocus: g,
      trigger: _,
      align: v,
      open: y,
      onOpenChange: S,
      placement: C,
      getPopupContainer: w,
      href: T,
      icon: E = H.createElement(ge, null),
      title: D,
      buttonsRender: O = (e) => e,
      mouseEnterDelay: A,
      mouseLeaveDelay: j,
      overlayClassName: ee,
      overlayStyle: te,
      destroyOnHidden: ne,
      destroyPopupOnHide: re,
      dropdownRender: M,
      popupRender: ie,
      ...N
    } = e,
    P = n(`dropdown`, a),
    F = `${P}-button`,
    I = {
      menu: m,
      arrow: h,
      autoFocus: g,
      align: v,
      disabled: c,
      trigger: c ? [] : _,
      onOpenChange: S,
      getPopupContainer: w || t,
      mouseEnterDelay: A,
      mouseLeaveDelay: j,
      classNames: { root: ee },
      styles: { root: te },
      destroyOnHidden: ne,
      popupRender: ie || M,
    },
    { compactSize: oe, compactItemClassnames: L } = b(P, i),
    se = x(F, L, p)
  ;(`destroyPopupOnHide` in e && (I.destroyPopupOnHide = re),
    `open` in e && (I.open = y),
    `placement` in e ? (I.placement = C) : (I.placement = i === `rtl` ? `bottomLeft` : `bottomRight`))
  let [R, ce] = O([
    H.createElement(k, { type: o, danger: s, disabled: c, loading: l, onClick: u, htmlType: d, href: T, title: D }, f),
    H.createElement(k, { type: o, danger: s, icon: E }),
  ])
  return H.createElement(ae.Compact, { className: se, size: oe, block: !0, ...N }, R, H.createElement(U, { ...I }, ce))
}
je.__ANT_BUTTON = !0
var Me = U
Me.Button = je
var Ne = {
  icon: {
    tag: `svg`,
    attrs: { viewBox: `64 64 896 896`, focusable: `false` },
    children: [
      {
        tag: `path`,
        attrs: {
          d: `M847.9 592H152c-4.4 0-8 3.6-8 8v60c0 4.4 3.6 8 8 8h605.2L612.9 851c-4.1 5.2-.4 13 6.3 13h72.5c4.9 0 9.5-2.2 12.6-6.1l168.8-214.1c16.5-21 1.6-51.8-25.2-51.8zM872 356H266.8l144.3-183c4.1-5.2.4-13-6.3-13h-72.5c-4.9 0-9.5 2.2-12.6 6.1L150.9 380.2c-16.5 21-1.6 51.8 25.1 51.8h696c4.4 0 8-3.6 8-8v-60c0-4.4-3.6-8-8-8z`,
        },
      },
    ],
  },
  name: `swap`,
  theme: `outlined`,
}
function Pe() {
  return (
    (Pe = Object.assign
      ? Object.assign.bind()
      : function (e) {
          for (var t = 1; t < arguments.length; t++) {
            var n = arguments[t]
            for (var r in n) Object.prototype.hasOwnProperty.call(n, r) && (e[r] = n[r])
          }
          return e
        }),
    Pe.apply(this, arguments)
  )
}
var Fe = H.forwardRef((e, t) => H.createElement(T, Pe({}, e, { ref: t, icon: Ne }))),
  Ie = {
    icon: {
      tag: `svg`,
      attrs: { viewBox: `64 64 896 896`, focusable: `false` },
      children: [
        {
          tag: `path`,
          attrs: {
            d: `M349 838c0 17.7 14.2 32 31.8 32h262.4c17.6 0 31.8-14.3 31.8-32V642H349v196zm531.1-684H143.9c-24.5 0-39.8 26.7-27.5 48l221.3 376h348.8l221.3-376c12.1-21.3-3.2-48-27.7-48z`,
          },
        },
      ],
    },
    name: `filter`,
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
var Re = H.forwardRef((e, t) => H.createElement(T, Le({}, e, { ref: t, icon: Ie }))),
  ze = {
    icon: {
      tag: `svg`,
      attrs: { viewBox: `0 0 1024 1024`, focusable: `false` },
      children: [
        { tag: `path`, attrs: { d: `M840.4 300H183.6c-19.7 0-30.7 20.8-18.5 35l328.4 380.8c9.4 10.9 27.5 10.9 37 0L858.9 335c12.2-14.2 1.2-35-18.5-35z` } },
      ],
    },
    name: `caret-down`,
    theme: `outlined`,
  }
function Be() {
  return (
    (Be = Object.assign
      ? Object.assign.bind()
      : function (e) {
          for (var t = 1; t < arguments.length; t++) {
            var n = arguments[t]
            for (var r in n) Object.prototype.hasOwnProperty.call(n, r) && (e[r] = n[r])
          }
          return e
        }),
    Be.apply(this, arguments)
  )
}
var Ve = H.forwardRef((e, t) => H.createElement(T, Be({}, e, { ref: t, icon: ze }))),
  He = {
    icon: {
      tag: `svg`,
      attrs: { viewBox: `0 0 1024 1024`, focusable: `false` },
      children: [
        { tag: `path`, attrs: { d: `M858.9 689L530.5 308.2c-9.4-10.9-27.5-10.9-37 0L165.1 689c-12.2 14.2-1.2 35 18.5 35h656.8c19.7 0 30.7-20.8 18.5-35z` } },
      ],
    },
    name: `caret-up`,
    theme: `outlined`,
  }
function Ue() {
  return (
    (Ue = Object.assign
      ? Object.assign.bind()
      : function (e) {
          for (var t = 1; t < arguments.length; t++) {
            var n = arguments[t]
            for (var r in n) Object.prototype.hasOwnProperty.call(n, r) && (e[r] = n[r])
          }
          return e
        }),
    Ue.apply(this, arguments)
  )
}
var We = H.forwardRef((e, t) => H.createElement(T, Ue({}, e, { ref: t, icon: He }))),
  Ge = {
    icon: {
      tag: `svg`,
      attrs: { viewBox: `64 64 896 896`, focusable: `false` },
      children: [
        {
          tag: `path`,
          attrs: {
            d: `M880.1 154H143.9c-24.5 0-39.8 26.7-27.5 48L349 597.4V838c0 17.7 14.2 32 31.8 32h262.4c17.6 0 31.8-14.3 31.8-32V597.4L907.7 202c12.2-21.3-3.1-48-27.6-48zM603.4 798H420.6V642h182.9v156zm9.6-236.6l-9.5 16.6h-183l-9.5-16.6L212.7 226h598.6L613 561.4z`,
          },
        },
      ],
    },
    name: `filter`,
    theme: `outlined`,
  }
function Ke() {
  return (
    (Ke = Object.assign
      ? Object.assign.bind()
      : function (e) {
          for (var t = 1; t < arguments.length; t++) {
            var n = arguments[t]
            for (var r in n) Object.prototype.hasOwnProperty.call(n, r) && (e[r] = n[r])
          }
          return e
        }),
    Ke.apply(this, arguments)
  )
}
var qe = H.forwardRef((e, t) => H.createElement(T, Ke({}, e, { ref: t, icon: Ge }))),
  Je = {
    icon: {
      tag: `svg`,
      attrs: { viewBox: `64 64 896 896`, focusable: `false` },
      children: [
        {
          tag: `path`,
          attrs: {
            d: `M924.8 625.7l-65.5-56c3.1-19 4.7-38.4 4.7-57.8s-1.6-38.8-4.7-57.8l65.5-56a32.03 32.03 0 009.3-35.2l-.9-2.6a443.74 443.74 0 00-79.7-137.9l-1.8-2.1a32.12 32.12 0 00-35.1-9.5l-81.3 28.9c-30-24.6-63.5-44-99.7-57.6l-15.7-85a32.05 32.05 0 00-25.8-25.7l-2.7-.5c-52.1-9.4-106.9-9.4-159 0l-2.7.5a32.05 32.05 0 00-25.8 25.7l-15.8 85.4a351.86 351.86 0 00-99 57.4l-81.9-29.1a32 32 0 00-35.1 9.5l-1.8 2.1a446.02 446.02 0 00-79.7 137.9l-.9 2.6c-4.5 12.5-.8 26.5 9.3 35.2l66.3 56.6c-3.1 18.8-4.6 38-4.6 57.1 0 19.2 1.5 38.4 4.6 57.1L99 625.5a32.03 32.03 0 00-9.3 35.2l.9 2.6c18.1 50.4 44.9 96.9 79.7 137.9l1.8 2.1a32.12 32.12 0 0035.1 9.5l81.9-29.1c29.8 24.5 63.1 43.9 99 57.4l15.8 85.4a32.05 32.05 0 0025.8 25.7l2.7.5a449.4 449.4 0 00159 0l2.7-.5a32.05 32.05 0 0025.8-25.7l15.7-85a350 350 0 0099.7-57.6l81.3 28.9a32 32 0 0035.1-9.5l1.8-2.1c34.8-41.1 61.6-87.5 79.7-137.9l.9-2.6c4.5-12.3.8-26.3-9.3-35zM788.3 465.9c2.5 15.1 3.8 30.6 3.8 46.1s-1.3 31-3.8 46.1l-6.6 40.1 74.7 63.9a370.03 370.03 0 01-42.6 73.6L721 702.8l-31.4 25.8c-23.9 19.6-50.5 35-79.3 45.8l-38.1 14.3-17.9 97a377.5 377.5 0 01-85 0l-17.9-97.2-37.8-14.5c-28.5-10.8-55-26.2-78.7-45.7l-31.4-25.9-93.4 33.2c-17-22.9-31.2-47.6-42.6-73.6l75.5-64.5-6.5-40c-2.4-14.9-3.7-30.3-3.7-45.5 0-15.3 1.2-30.6 3.7-45.5l6.5-40-75.5-64.5c11.3-26.1 25.6-50.7 42.6-73.6l93.4 33.2 31.4-25.9c23.7-19.5 50.2-34.9 78.7-45.7l37.9-14.3 17.9-97.2c28.1-3.2 56.8-3.2 85 0l17.9 97 38.1 14.3c28.7 10.8 55.4 26.2 79.3 45.8l31.4 25.8 92.8-32.9c17 22.9 31.2 47.6 42.6 73.6L781.8 426l6.5 39.9zM512 326c-97.2 0-176 78.8-176 176s78.8 176 176 176 176-78.8 176-176-78.8-176-176-176zm79.2 255.2A111.6 111.6 0 01512 614c-29.9 0-58-11.7-79.2-32.8A111.6 111.6 0 01400 502c0-29.9 11.7-58 32.8-79.2C454 401.6 482.1 390 512 390c29.9 0 58 11.6 79.2 32.8A111.6 111.6 0 01624 502c0 29.9-11.7 58-32.8 79.2z`,
          },
        },
      ],
    },
    name: `setting`,
    theme: `outlined`,
  }
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
var Xe = H.forwardRef((e, t) => H.createElement(T, Ye({}, e, { ref: t, icon: Je })))
function G(e, t) {
  return typeof e == `function` ? e(t) : e
}
function K(e, t) {
  return (n) => {
    t.setState((t) => ({ ...t, [e]: G(n, t[e]) }))
  }
}
function Ze(e) {
  return e instanceof Function
}
function Qe(e) {
  return Array.isArray(e) && e.every((e) => typeof e == `number`)
}
function $e(e, t) {
  let n = [],
    r = (e) => {
      e.forEach((e) => {
        n.push(e)
        let i = t(e)
        i != null && i.length && r(i)
      })
    }
  return (r(e), n)
}
function q(e, t, n) {
  let r = [],
    i
  return (a) => {
    let o
    n.key && n.debug && (o = Date.now())
    let s = e(a)
    if (!(s.length !== r.length || s.some((e, t) => r[t] !== e))) return i
    r = s
    let c
    if ((n.key && n.debug && (c = Date.now()), (i = t(...s)), n == null || n.onChange == null || n.onChange(i), n.key && n.debug && n != null && n.debug())) {
      let e = Math.round((Date.now() - o) * 100) / 100,
        t = Math.round((Date.now() - c) * 100) / 100,
        r = t / 16,
        i = (e, t) => {
          for (e = String(e); e.length < t; ) e = ` ` + e
          return e
        }
      console.info(
        `%c⏱ ${i(t, 5)} /${i(e, 5)} ms`,
        `
            font-size: .6rem;
            font-weight: bold;
            color: hsl(${Math.max(0, Math.min(120 - 120 * r, 120))}deg 100% 31%);`,
        n?.key,
      )
    }
    return i
  }
}
function J(e, t, n, r) {
  return { debug: () => e?.debugAll ?? e[t], key: !1, onChange: r }
}
function et(e, t, n, r) {
  let i = {
    id: `${t.id}_${n.id}`,
    row: t,
    column: n,
    getValue: () => t.getValue(r),
    renderValue: () => i.getValue() ?? e.options.renderFallbackValue,
    getContext: q(
      () => [e, n, t, i],
      (e, t, n, r) => ({ table: e, column: t, row: n, cell: r, getValue: r.getValue, renderValue: r.renderValue }),
      J(e.options, `debugCells`, `cell.getContext`),
    ),
  }
  return (
    e._features.forEach((r) => {
      r.createCell == null || r.createCell(i, n, t, e)
    }, {}),
    i
  )
}
function tt(e, t, n, r) {
  let i = { ...e._getDefaultColumnDef(), ...t },
    a = i.accessorKey,
    o =
      i.id ??
      (a ? (typeof String.prototype.replaceAll == `function` ? a.replaceAll(`.`, `_`) : a.replace(/\./g, `_`)) : void 0) ??
      (typeof i.header == `string` ? i.header : void 0),
    s
  if (
    (i.accessorFn
      ? (s = i.accessorFn)
      : a &&
        (s = a.includes(`.`)
          ? (e) => {
              let t = e
              for (let e of a.split(`.`)) t = t?.[e]
              return t
            }
          : (e) => e[i.accessorKey]),
    !o)
  )
    throw Error()
  let c = {
    id: `${String(o)}`,
    accessorFn: s,
    parent: r,
    depth: n,
    columnDef: i,
    columns: [],
    getFlatColumns: q(
      () => [!0],
      () => [c, ...c.columns?.flatMap((e) => e.getFlatColumns())],
      J(e.options, `debugColumns`, `column.getFlatColumns`),
    ),
    getLeafColumns: q(
      () => [e._getOrderColumnsFn()],
      (e) => {
        var t
        return (t = c.columns) != null && t.length ? e(c.columns.flatMap((e) => e.getLeafColumns())) : [c]
      },
      J(e.options, `debugColumns`, `column.getLeafColumns`),
    ),
  }
  for (let t of e._features) t.createColumn == null || t.createColumn(c, e)
  return c
}
var Y = `debugHeaders`
function nt(e, t, n) {
  let r = {
    id: n.id ?? t.id,
    column: t,
    index: n.index,
    isPlaceholder: !!n.isPlaceholder,
    placeholderId: n.placeholderId,
    depth: n.depth,
    subHeaders: [],
    colSpan: 0,
    rowSpan: 0,
    headerGroup: null,
    getLeafHeaders: () => {
      let e = [],
        t = (n) => {
          ;(n.subHeaders && n.subHeaders.length && n.subHeaders.map(t), e.push(n))
        }
      return (t(r), e)
    },
    getContext: () => ({ table: e, header: r, column: t }),
  }
  return (
    e._features.forEach((t) => {
      t.createHeader == null || t.createHeader(r, e)
    }),
    r
  )
}
var rt = {
  createTable: (e) => {
    ;((e.getHeaderGroups = q(
      () => [e.getAllColumns(), e.getVisibleLeafColumns(), e.getState().columnPinning.left, e.getState().columnPinning.right],
      (t, n, r, i) => {
        let a = r?.map((e) => n.find((t) => t.id === e)).filter(Boolean) ?? [],
          o = i?.map((e) => n.find((t) => t.id === e)).filter(Boolean) ?? [],
          s = n.filter((e) => !(r != null && r.includes(e.id)) && !(i != null && i.includes(e.id)))
        return it(t, [...a, ...s, ...o], e)
      },
      J(e.options, Y, `getHeaderGroups`),
    )),
      (e.getCenterHeaderGroups = q(
        () => [e.getAllColumns(), e.getVisibleLeafColumns(), e.getState().columnPinning.left, e.getState().columnPinning.right],
        (t, n, r, i) => ((n = n.filter((e) => !(r != null && r.includes(e.id)) && !(i != null && i.includes(e.id)))), it(t, n, e, `center`)),
        J(e.options, Y, `getCenterHeaderGroups`),
      )),
      (e.getLeftHeaderGroups = q(
        () => [e.getAllColumns(), e.getVisibleLeafColumns(), e.getState().columnPinning.left],
        (t, n, r) => it(t, r?.map((e) => n.find((t) => t.id === e)).filter(Boolean) ?? [], e, `left`),
        J(e.options, Y, `getLeftHeaderGroups`),
      )),
      (e.getRightHeaderGroups = q(
        () => [e.getAllColumns(), e.getVisibleLeafColumns(), e.getState().columnPinning.right],
        (t, n, r) => it(t, r?.map((e) => n.find((t) => t.id === e)).filter(Boolean) ?? [], e, `right`),
        J(e.options, Y, `getRightHeaderGroups`),
      )),
      (e.getFooterGroups = q(
        () => [e.getHeaderGroups()],
        (e) => [...e].reverse(),
        J(e.options, Y, `getFooterGroups`),
      )),
      (e.getLeftFooterGroups = q(
        () => [e.getLeftHeaderGroups()],
        (e) => [...e].reverse(),
        J(e.options, Y, `getLeftFooterGroups`),
      )),
      (e.getCenterFooterGroups = q(
        () => [e.getCenterHeaderGroups()],
        (e) => [...e].reverse(),
        J(e.options, Y, `getCenterFooterGroups`),
      )),
      (e.getRightFooterGroups = q(
        () => [e.getRightHeaderGroups()],
        (e) => [...e].reverse(),
        J(e.options, Y, `getRightFooterGroups`),
      )),
      (e.getFlatHeaders = q(
        () => [e.getHeaderGroups()],
        (e) => e.map((e) => e.headers).flat(),
        J(e.options, Y, `getFlatHeaders`),
      )),
      (e.getLeftFlatHeaders = q(
        () => [e.getLeftHeaderGroups()],
        (e) => e.map((e) => e.headers).flat(),
        J(e.options, Y, `getLeftFlatHeaders`),
      )),
      (e.getCenterFlatHeaders = q(
        () => [e.getCenterHeaderGroups()],
        (e) => e.map((e) => e.headers).flat(),
        J(e.options, Y, `getCenterFlatHeaders`),
      )),
      (e.getRightFlatHeaders = q(
        () => [e.getRightHeaderGroups()],
        (e) => e.map((e) => e.headers).flat(),
        J(e.options, Y, `getRightFlatHeaders`),
      )),
      (e.getCenterLeafHeaders = q(
        () => [e.getCenterFlatHeaders()],
        (e) =>
          e.filter((e) => {
            var t
            return !((t = e.subHeaders) != null && t.length)
          }),
        J(e.options, Y, `getCenterLeafHeaders`),
      )),
      (e.getLeftLeafHeaders = q(
        () => [e.getLeftFlatHeaders()],
        (e) =>
          e.filter((e) => {
            var t
            return !((t = e.subHeaders) != null && t.length)
          }),
        J(e.options, Y, `getLeftLeafHeaders`),
      )),
      (e.getRightLeafHeaders = q(
        () => [e.getRightFlatHeaders()],
        (e) =>
          e.filter((e) => {
            var t
            return !((t = e.subHeaders) != null && t.length)
          }),
        J(e.options, Y, `getRightLeafHeaders`),
      )),
      (e.getLeafHeaders = q(
        () => [e.getLeftHeaderGroups(), e.getCenterHeaderGroups(), e.getRightHeaderGroups()],
        (e, t, n) => [...(e[0]?.headers ?? []), ...(t[0]?.headers ?? []), ...(n[0]?.headers ?? [])].map((e) => e.getLeafHeaders()).flat(),
        J(e.options, Y, `getLeafHeaders`),
      )))
  },
}
function it(e, t, n, r) {
  let i = 0,
    a = function (e, t) {
      ;(t === void 0 && (t = 1),
        (i = Math.max(i, t)),
        e
          .filter((e) => e.getIsVisible())
          .forEach((e) => {
            var n
            ;(n = e.columns) != null && n.length && a(e.columns, t + 1)
          }, 0))
    }
  a(e)
  let o = [],
    s = (e, t) => {
      let i = { depth: t, id: [r, `${t}`].filter(Boolean).join(`_`), headers: [] },
        a = []
      ;(e.forEach((e) => {
        let o = [...a].reverse()[0],
          s = e.column.depth === i.depth,
          c,
          l = !1
        if ((s && e.column.parent ? (c = e.column.parent) : ((c = e.column), (l = !0)), o && o?.column === c)) o.subHeaders.push(e)
        else {
          let i = nt(n, c, {
            id: [r, t, c.id, e?.id].filter(Boolean).join(`_`),
            isPlaceholder: l,
            placeholderId: l ? `${a.filter((e) => e.column === c).length}` : void 0,
            depth: t,
            index: a.length,
          })
          ;(i.subHeaders.push(e), a.push(i))
        }
        ;(i.headers.push(e), (e.headerGroup = i))
      }),
        o.push(i),
        t > 0 && s(a, t - 1))
    }
  ;(s(
    t.map((e, t) => nt(n, e, { depth: i, index: t })),
    i - 1,
  ),
    o.reverse())
  let c = (e) =>
    e
      .filter((e) => e.column.getIsVisible())
      .map((e) => {
        let t = 0,
          n = 0,
          r = [0]
        e.subHeaders && e.subHeaders.length
          ? ((r = []),
            c(e.subHeaders).forEach((e) => {
              let { colSpan: n, rowSpan: i } = e
              ;((t += n), r.push(i))
            }))
          : (t = 1)
        let i = Math.min(...r)
        return ((n += i), (e.colSpan = t), (e.rowSpan = n), { colSpan: t, rowSpan: n })
      })
  return (c(o[0]?.headers ?? []), o)
}
var at = (e, t, n, r, i, a, o) => {
    let s = {
      id: t,
      index: r,
      original: n,
      depth: i,
      parentId: o,
      _valuesCache: {},
      _uniqueValuesCache: {},
      getValue: (t) => {
        if (s._valuesCache.hasOwnProperty(t)) return s._valuesCache[t]
        let n = e.getColumn(t)
        if (n != null && n.accessorFn) return ((s._valuesCache[t] = n.accessorFn(s.original, r)), s._valuesCache[t])
      },
      getUniqueValues: (t) => {
        if (s._uniqueValuesCache.hasOwnProperty(t)) return s._uniqueValuesCache[t]
        let n = e.getColumn(t)
        if (n != null && n.accessorFn)
          return n.columnDef.getUniqueValues
            ? ((s._uniqueValuesCache[t] = n.columnDef.getUniqueValues(s.original, r)), s._uniqueValuesCache[t])
            : ((s._uniqueValuesCache[t] = [s.getValue(t)]), s._uniqueValuesCache[t])
      },
      renderValue: (t) => s.getValue(t) ?? e.options.renderFallbackValue,
      subRows: a ?? [],
      getLeafRows: () => $e(s.subRows, (e) => e.subRows),
      getParentRow: () => (s.parentId ? e.getRow(s.parentId, !0) : void 0),
      getParentRows: () => {
        let e = [],
          t = s
        for (;;) {
          let n = t.getParentRow()
          if (!n) break
          ;(e.push(n), (t = n))
        }
        return e.reverse()
      },
      getAllCells: q(
        () => [e.getAllLeafColumns()],
        (t) => t.map((t) => et(e, s, t, t.id)),
        J(e.options, `debugRows`, `getAllCells`),
      ),
      _getAllCellsByColumnId: q(
        () => [s.getAllCells()],
        (e) => e.reduce((e, t) => ((e[t.column.id] = t), e), {}),
        J(e.options, `debugRows`, `getAllCellsByColumnId`),
      ),
    }
    for (let t = 0; t < e._features.length; t++) {
      let n = e._features[t]
      n == null || n.createRow == null || n.createRow(s, e)
    }
    return s
  },
  ot = {
    createColumn: (e, t) => {
      ;((e._getFacetedRowModel = t.options.getFacetedRowModel && t.options.getFacetedRowModel(t, e.id)),
        (e.getFacetedRowModel = () => (e._getFacetedRowModel ? e._getFacetedRowModel() : t.getPreFilteredRowModel())),
        (e._getFacetedUniqueValues = t.options.getFacetedUniqueValues && t.options.getFacetedUniqueValues(t, e.id)),
        (e.getFacetedUniqueValues = () => (e._getFacetedUniqueValues ? e._getFacetedUniqueValues() : new Map())),
        (e._getFacetedMinMaxValues = t.options.getFacetedMinMaxValues && t.options.getFacetedMinMaxValues(t, e.id)),
        (e.getFacetedMinMaxValues = () => {
          if (e._getFacetedMinMaxValues) return e._getFacetedMinMaxValues()
        }))
    },
  },
  st = (e, t, n) => {
    var r, i
    let a = n == null || (r = n.toString()) == null ? void 0 : r.toLowerCase()
    return !!(!((i = e.getValue(t)) == null || (i = i.toString()) == null || (i = i.toLowerCase()) == null) && i.includes(a))
  }
st.autoRemove = (e) => Z(e)
var ct = (e, t, n) => {
  var r
  return !!(!((r = e.getValue(t)) == null || (r = r.toString()) == null) && r.includes(n))
}
ct.autoRemove = (e) => Z(e)
var lt = (e, t, n) => {
  var r
  return ((r = e.getValue(t)) == null || (r = r.toString()) == null ? void 0 : r.toLowerCase()) === n?.toLowerCase()
}
lt.autoRemove = (e) => Z(e)
var ut = (e, t, n) => e.getValue(t)?.includes(n)
ut.autoRemove = (e) => Z(e)
var dt = (e, t, n) =>
  !n.some((n) => {
    var r
    return !((r = e.getValue(t)) != null && r.includes(n))
  })
dt.autoRemove = (e) => Z(e) || !(e != null && e.length)
var ft = (e, t, n) => n.some((n) => e.getValue(t)?.includes(n))
ft.autoRemove = (e) => Z(e) || !(e != null && e.length)
var pt = (e, t, n) => e.getValue(t) === n
pt.autoRemove = (e) => Z(e)
var mt = (e, t, n) => e.getValue(t) == n
mt.autoRemove = (e) => Z(e)
var ht = (e, t, n) => {
  let [r, i] = n,
    a = e.getValue(t)
  return a >= r && a <= i
}
;((ht.resolveFilterValue = (e) => {
  let [t, n] = e,
    r = typeof t == `number` ? t : parseFloat(t),
    i = typeof n == `number` ? n : parseFloat(n),
    a = t === null || Number.isNaN(r) ? -1 / 0 : r,
    o = n === null || Number.isNaN(i) ? 1 / 0 : i
  if (a > o) {
    let e = a
    ;((a = o), (o = e))
  }
  return [a, o]
}),
  (ht.autoRemove = (e) => Z(e) || (Z(e[0]) && Z(e[1]))))
var X = {
  includesString: st,
  includesStringSensitive: ct,
  equalsString: lt,
  arrIncludes: ut,
  arrIncludesAll: dt,
  arrIncludesSome: ft,
  equals: pt,
  weakEquals: mt,
  inNumberRange: ht,
}
function Z(e) {
  return e == null || e === ``
}
var gt = {
  getDefaultColumnDef: () => ({ filterFn: `auto` }),
  getInitialState: (e) => ({ columnFilters: [], ...e }),
  getDefaultOptions: (e) => ({ onColumnFiltersChange: K(`columnFilters`, e), filterFromLeafRows: !1, maxLeafRowFilterDepth: 100 }),
  createColumn: (e, t) => {
    ;((e.getAutoFilterFn = () => {
      let n = t.getCoreRowModel().flatRows[0]?.getValue(e.id)
      return typeof n == `string`
        ? X.includesString
        : typeof n == `number`
          ? X.inNumberRange
          : typeof n == `boolean` || (typeof n == `object` && n)
            ? X.equals
            : Array.isArray(n)
              ? X.arrIncludes
              : X.weakEquals
    }),
      (e.getFilterFn = () =>
        Ze(e.columnDef.filterFn)
          ? e.columnDef.filterFn
          : e.columnDef.filterFn === `auto`
            ? e.getAutoFilterFn()
            : (t.options.filterFns?.[e.columnDef.filterFn] ?? X[e.columnDef.filterFn])),
      (e.getCanFilter = () =>
        (e.columnDef.enableColumnFilter ?? !0) && (t.options.enableColumnFilters ?? !0) && (t.options.enableFilters ?? !0) && !!e.accessorFn),
      (e.getIsFiltered = () => e.getFilterIndex() > -1),
      (e.getFilterValue = () => {
        var n
        return (n = t.getState().columnFilters) == null || (n = n.find((t) => t.id === e.id)) == null ? void 0 : n.value
      }),
      (e.getFilterIndex = () => t.getState().columnFilters?.findIndex((t) => t.id === e.id) ?? -1),
      (e.setFilterValue = (n) => {
        t.setColumnFilters((t) => {
          let r = e.getFilterFn(),
            i = t?.find((t) => t.id === e.id),
            a = G(n, i ? i.value : void 0)
          if (_t(r, a, e)) return t?.filter((t) => t.id !== e.id) ?? []
          let o = { id: e.id, value: a }
          return i ? (t?.map((t) => (t.id === e.id ? o : t)) ?? []) : t != null && t.length ? [...t, o] : [o]
        })
      }))
  },
  createRow: (e, t) => {
    ;((e.columnFilters = {}), (e.columnFiltersMeta = {}))
  },
  createTable: (e) => {
    ;((e.setColumnFilters = (t) => {
      let n = e.getAllLeafColumns()
      e.options.onColumnFiltersChange == null ||
        e.options.onColumnFiltersChange((e) =>
          G(t, e)?.filter((e) => {
            let t = n.find((t) => t.id === e.id)
            return !(t && _t(t.getFilterFn(), e.value, t))
          }),
        )
    }),
      (e.resetColumnFilters = (t) => {
        e.setColumnFilters(t ? [] : (e.initialState?.columnFilters ?? []))
      }),
      (e.getPreFilteredRowModel = () => e.getCoreRowModel()),
      (e.getFilteredRowModel = () => (
        !e._getFilteredRowModel && e.options.getFilteredRowModel && (e._getFilteredRowModel = e.options.getFilteredRowModel(e)),
        e.options.manualFiltering || !e._getFilteredRowModel ? e.getPreFilteredRowModel() : e._getFilteredRowModel()
      )))
  },
}
function _t(e, t, n) {
  return (e && e.autoRemove ? e.autoRemove(t, n) : !1) || t === void 0 || (typeof t == `string` && !t)
}
var vt = {
    sum: (e, t, n) =>
      n.reduce((t, n) => {
        let r = n.getValue(e)
        return t + (typeof r == `number` ? r : 0)
      }, 0),
    min: (e, t, n) => {
      let r
      return (
        n.forEach((t) => {
          let n = t.getValue(e)
          n != null && (r > n || (r === void 0 && n >= n)) && (r = n)
        }),
        r
      )
    },
    max: (e, t, n) => {
      let r
      return (
        n.forEach((t) => {
          let n = t.getValue(e)
          n != null && (r < n || (r === void 0 && n >= n)) && (r = n)
        }),
        r
      )
    },
    extent: (e, t, n) => {
      let r, i
      return (
        n.forEach((t) => {
          let n = t.getValue(e)
          n != null && (r === void 0 ? n >= n && (r = i = n) : (r > n && (r = n), i < n && (i = n)))
        }),
        [r, i]
      )
    },
    mean: (e, t) => {
      let n = 0,
        r = 0
      if (
        (t.forEach((t) => {
          let i = t.getValue(e)
          i != null && (i = +i) >= i && (++n, (r += i))
        }),
        n)
      )
        return r / n
    },
    median: (e, t) => {
      if (!t.length) return
      let n = t.map((t) => t.getValue(e))
      if (!Qe(n)) return
      if (n.length === 1) return n[0]
      let r = Math.floor(n.length / 2),
        i = n.sort((e, t) => e - t)
      return n.length % 2 == 0 ? (i[r - 1] + i[r]) / 2 : i[r]
    },
    unique: (e, t) => Array.from(new Set(t.map((t) => t.getValue(e))).values()),
    uniqueCount: (e, t) => new Set(t.map((t) => t.getValue(e))).size,
    count: (e, t) => t.length,
  },
  yt = {
    getDefaultColumnDef: () => ({
      aggregatedCell: (e) => {
        var t
        return ((t = e.getValue()) == null || t.toString == null ? void 0 : t.toString()) ?? null
      },
      aggregationFn: `auto`,
    }),
    getInitialState: (e) => ({ grouping: [], ...e }),
    getDefaultOptions: (e) => ({ onGroupingChange: K(`grouping`, e), groupedColumnMode: `reorder` }),
    createColumn: (e, t) => {
      ;((e.toggleGrouping = () => {
        t.setGrouping((t) => (t != null && t.includes(e.id) ? t.filter((t) => t !== e.id) : [...(t ?? []), e.id]))
      }),
        (e.getCanGroup = () => (e.columnDef.enableGrouping ?? !0) && (t.options.enableGrouping ?? !0) && (!!e.accessorFn || !!e.columnDef.getGroupingValue)),
        (e.getIsGrouped = () => t.getState().grouping?.includes(e.id)),
        (e.getGroupedIndex = () => t.getState().grouping?.indexOf(e.id)),
        (e.getToggleGroupingHandler = () => {
          let t = e.getCanGroup()
          return () => {
            t && e.toggleGrouping()
          }
        }),
        (e.getAutoAggregationFn = () => {
          let n = t.getCoreRowModel().flatRows[0]?.getValue(e.id)
          if (typeof n == `number`) return vt.sum
          if (Object.prototype.toString.call(n) === `[object Date]`) return vt.extent
        }),
        (e.getAggregationFn = () => {
          if (!e) throw Error()
          return Ze(e.columnDef.aggregationFn)
            ? e.columnDef.aggregationFn
            : e.columnDef.aggregationFn === `auto`
              ? e.getAutoAggregationFn()
              : (t.options.aggregationFns?.[e.columnDef.aggregationFn] ?? vt[e.columnDef.aggregationFn])
        }))
    },
    createTable: (e) => {
      ;((e.setGrouping = (t) => (e.options.onGroupingChange == null ? void 0 : e.options.onGroupingChange(t))),
        (e.resetGrouping = (t) => {
          e.setGrouping(t ? [] : (e.initialState?.grouping ?? []))
        }),
        (e.getPreGroupedRowModel = () => e.getFilteredRowModel()),
        (e.getGroupedRowModel = () => (
          !e._getGroupedRowModel && e.options.getGroupedRowModel && (e._getGroupedRowModel = e.options.getGroupedRowModel(e)),
          e.options.manualGrouping || !e._getGroupedRowModel ? e.getPreGroupedRowModel() : e._getGroupedRowModel()
        )))
    },
    createRow: (e, t) => {
      ;((e.getIsGrouped = () => !!e.groupingColumnId),
        (e.getGroupingValue = (n) => {
          if (e._groupingValuesCache.hasOwnProperty(n)) return e._groupingValuesCache[n]
          let r = t.getColumn(n)
          return r != null && r.columnDef.getGroupingValue
            ? ((e._groupingValuesCache[n] = r.columnDef.getGroupingValue(e.original)), e._groupingValuesCache[n])
            : e.getValue(n)
        }),
        (e._groupingValuesCache = {}))
    },
    createCell: (e, t, n, r) => {
      ;((e.getIsGrouped = () => t.getIsGrouped() && t.id === n.groupingColumnId),
        (e.getIsPlaceholder = () => !e.getIsGrouped() && t.getIsGrouped()),
        (e.getIsAggregated = () => {
          var t
          return !e.getIsGrouped() && !e.getIsPlaceholder() && !!((t = n.subRows) != null && t.length)
        }))
    },
  }
function bt(e, t, n) {
  if (!(t != null && t.length) || !n) return e
  let r = e.filter((e) => !t.includes(e.id))
  return n === `remove` ? r : [...t.map((t) => e.find((e) => e.id === t)).filter(Boolean), ...r]
}
var xt = {
    getInitialState: (e) => ({ columnOrder: [], ...e }),
    getDefaultOptions: (e) => ({ onColumnOrderChange: K(`columnOrder`, e) }),
    createColumn: (e, t) => {
      ;((e.getIndex = q(
        (e) => [Mt(t, e)],
        (t) => t.findIndex((t) => t.id === e.id),
        J(t.options, `debugColumns`, `getIndex`),
      )),
        (e.getIsFirstColumn = (n) => Mt(t, n)[0]?.id === e.id),
        (e.getIsLastColumn = (n) => {
          let r = Mt(t, n)
          return r[r.length - 1]?.id === e.id
        }))
    },
    createTable: (e) => {
      ;((e.setColumnOrder = (t) => (e.options.onColumnOrderChange == null ? void 0 : e.options.onColumnOrderChange(t))),
        (e.resetColumnOrder = (t) => {
          e.setColumnOrder(t ? [] : (e.initialState.columnOrder ?? []))
        }),
        (e._getOrderColumnsFn = q(
          () => [e.getState().columnOrder, e.getState().grouping, e.options.groupedColumnMode],
          (e, t, n) => (r) => {
            let i = []
            if (!(e != null && e.length)) i = r
            else {
              let t = [...e],
                n = [...r]
              for (; n.length && t.length; ) {
                let e = t.shift(),
                  r = n.findIndex((t) => t.id === e)
                r > -1 && i.push(n.splice(r, 1)[0])
              }
              i = [...i, ...n]
            }
            return bt(i, t, n)
          },
          J(e.options, `debugTable`, `_getOrderColumnsFn`),
        )))
    },
  },
  St = () => ({ left: [], right: [] }),
  Ct = {
    getInitialState: (e) => ({ columnPinning: St(), ...e }),
    getDefaultOptions: (e) => ({ onColumnPinningChange: K(`columnPinning`, e) }),
    createColumn: (e, t) => {
      ;((e.pin = (n) => {
        let r = e
          .getLeafColumns()
          .map((e) => e.id)
          .filter(Boolean)
        t.setColumnPinning((e) =>
          n === `right`
            ? {
                left: (e?.left ?? []).filter((e) => !(r != null && r.includes(e))),
                right: [...(e?.right ?? []).filter((e) => !(r != null && r.includes(e))), ...r],
              }
            : n === `left`
              ? {
                  left: [...(e?.left ?? []).filter((e) => !(r != null && r.includes(e))), ...r],
                  right: (e?.right ?? []).filter((e) => !(r != null && r.includes(e))),
                }
              : { left: (e?.left ?? []).filter((e) => !(r != null && r.includes(e))), right: (e?.right ?? []).filter((e) => !(r != null && r.includes(e))) },
        )
      }),
        (e.getCanPin = () =>
          e.getLeafColumns().some((e) => (e.columnDef.enablePinning ?? !0) && (t.options.enableColumnPinning ?? t.options.enablePinning ?? !0))),
        (e.getIsPinned = () => {
          let n = e.getLeafColumns().map((e) => e.id),
            { left: r, right: i } = t.getState().columnPinning,
            a = n.some((e) => r?.includes(e)),
            o = n.some((e) => i?.includes(e))
          return a ? `left` : o ? `right` : !1
        }),
        (e.getPinnedIndex = () => {
          var n
          let r = e.getIsPinned()
          return r ? (((n = t.getState().columnPinning) == null || (n = n[r]) == null ? void 0 : n.indexOf(e.id)) ?? -1) : 0
        }))
    },
    createRow: (e, t) => {
      ;((e.getCenterVisibleCells = q(
        () => [e._getAllVisibleCells(), t.getState().columnPinning.left, t.getState().columnPinning.right],
        (e, t, n) => {
          let r = [...(t ?? []), ...(n ?? [])]
          return e.filter((e) => !r.includes(e.column.id))
        },
        J(t.options, `debugRows`, `getCenterVisibleCells`),
      )),
        (e.getLeftVisibleCells = q(
          () => [e._getAllVisibleCells(), t.getState().columnPinning.left],
          (e, t) =>
            (t ?? [])
              .map((t) => e.find((e) => e.column.id === t))
              .filter(Boolean)
              .map((e) => ({ ...e, position: `left` })),
          J(t.options, `debugRows`, `getLeftVisibleCells`),
        )),
        (e.getRightVisibleCells = q(
          () => [e._getAllVisibleCells(), t.getState().columnPinning.right],
          (e, t) =>
            (t ?? [])
              .map((t) => e.find((e) => e.column.id === t))
              .filter(Boolean)
              .map((e) => ({ ...e, position: `right` })),
          J(t.options, `debugRows`, `getRightVisibleCells`),
        )))
    },
    createTable: (e) => {
      ;((e.setColumnPinning = (t) => (e.options.onColumnPinningChange == null ? void 0 : e.options.onColumnPinningChange(t))),
        (e.resetColumnPinning = (t) => e.setColumnPinning(t ? St() : (e.initialState?.columnPinning ?? St()))),
        (e.getIsSomeColumnsPinned = (t) => {
          let n = e.getState().columnPinning
          return t ? !!n[t]?.length : !!(n.left?.length || n.right?.length)
        }),
        (e.getLeftLeafColumns = q(
          () => [e.getAllLeafColumns(), e.getState().columnPinning.left],
          (e, t) => (t ?? []).map((t) => e.find((e) => e.id === t)).filter(Boolean),
          J(e.options, `debugColumns`, `getLeftLeafColumns`),
        )),
        (e.getRightLeafColumns = q(
          () => [e.getAllLeafColumns(), e.getState().columnPinning.right],
          (e, t) => (t ?? []).map((t) => e.find((e) => e.id === t)).filter(Boolean),
          J(e.options, `debugColumns`, `getRightLeafColumns`),
        )),
        (e.getCenterLeafColumns = q(
          () => [e.getAllLeafColumns(), e.getState().columnPinning.left, e.getState().columnPinning.right],
          (e, t, n) => {
            let r = [...(t ?? []), ...(n ?? [])]
            return e.filter((e) => !r.includes(e.id))
          },
          J(e.options, `debugColumns`, `getCenterLeafColumns`),
        )))
    },
  }
function wt(e) {
  return e || (typeof document < `u` ? document : null)
}
var Tt = { size: 150, minSize: 20, maxSize: 2 ** 53 - 1 },
  Et = () => ({ startOffset: null, startSize: null, deltaOffset: null, deltaPercentage: null, isResizingColumn: !1, columnSizingStart: [] }),
  Dt = {
    getDefaultColumnDef: () => Tt,
    getInitialState: (e) => ({ columnSizing: {}, columnSizingInfo: Et(), ...e }),
    getDefaultOptions: (e) => ({
      columnResizeMode: `onEnd`,
      columnResizeDirection: `ltr`,
      onColumnSizingChange: K(`columnSizing`, e),
      onColumnSizingInfoChange: K(`columnSizingInfo`, e),
    }),
    createColumn: (e, t) => {
      ;((e.getSize = () => {
        let n = t.getState().columnSizing[e.id]
        return Math.min(Math.max(e.columnDef.minSize ?? Tt.minSize, n ?? e.columnDef.size ?? Tt.size), e.columnDef.maxSize ?? Tt.maxSize)
      }),
        (e.getStart = q(
          (e) => [e, Mt(t, e), t.getState().columnSizing],
          (t, n) => n.slice(0, e.getIndex(t)).reduce((e, t) => e + t.getSize(), 0),
          J(t.options, `debugColumns`, `getStart`),
        )),
        (e.getAfter = q(
          (e) => [e, Mt(t, e), t.getState().columnSizing],
          (t, n) => n.slice(e.getIndex(t) + 1).reduce((e, t) => e + t.getSize(), 0),
          J(t.options, `debugColumns`, `getAfter`),
        )),
        (e.resetSize = () => {
          t.setColumnSizing((t) => {
            let { [e.id]: n, ...r } = t
            return r
          })
        }),
        (e.getCanResize = () => (e.columnDef.enableResizing ?? !0) && (t.options.enableColumnResizing ?? !0)),
        (e.getIsResizing = () => t.getState().columnSizingInfo.isResizingColumn === e.id))
    },
    createHeader: (e, t) => {
      ;((e.getSize = () => {
        let t = 0,
          n = (e) => {
            e.subHeaders.length ? e.subHeaders.forEach(n) : (t += e.column.getSize() ?? 0)
          }
        return (n(e), t)
      }),
        (e.getStart = () => {
          if (e.index > 0) {
            let t = e.headerGroup.headers[e.index - 1]
            return t.getStart() + t.getSize()
          }
          return 0
        }),
        (e.getResizeHandler = (n) => {
          let r = t.getColumn(e.column.id),
            i = r?.getCanResize()
          return (a) => {
            if (!r || !i || (a.persist == null || a.persist(), At(a) && a.touches && a.touches.length > 1)) return
            let o = e.getSize(),
              s = e ? e.getLeafHeaders().map((e) => [e.column.id, e.column.getSize()]) : [[r.id, r.getSize()]],
              c = At(a) ? Math.round(a.touches[0].clientX) : a.clientX,
              l = {},
              u = (e, n) => {
                typeof n == `number` &&
                  (t.setColumnSizingInfo((e) => {
                    let r = t.options.columnResizeDirection === `rtl` ? -1 : 1,
                      i = (n - (e?.startOffset ?? 0)) * r,
                      a = Math.max(i / (e?.startSize ?? 0), -0.999999)
                    return (
                      e.columnSizingStart.forEach((e) => {
                        let [t, n] = e
                        l[t] = Math.round(Math.max(n + n * a, 0) * 100) / 100
                      }),
                      { ...e, deltaOffset: i, deltaPercentage: a }
                    )
                  }),
                  (t.options.columnResizeMode === `onChange` || e === `end`) && t.setColumnSizing((e) => ({ ...e, ...l })))
              },
              d = (e) => u(`move`, e),
              f = (e) => {
                ;(u(`end`, e),
                  t.setColumnSizingInfo((e) => ({
                    ...e,
                    isResizingColumn: !1,
                    startOffset: null,
                    startSize: null,
                    deltaOffset: null,
                    deltaPercentage: null,
                    columnSizingStart: [],
                  })))
              },
              p = wt(n),
              m = {
                moveHandler: (e) => d(e.clientX),
                upHandler: (e) => {
                  ;(p?.removeEventListener(`mousemove`, m.moveHandler), p?.removeEventListener(`mouseup`, m.upHandler), f(e.clientX))
                },
              },
              h = {
                moveHandler: (e) => (e.cancelable && (e.preventDefault(), e.stopPropagation()), d(e.touches[0].clientX), !1),
                upHandler: (e) => {
                  ;(p?.removeEventListener(`touchmove`, h.moveHandler),
                    p?.removeEventListener(`touchend`, h.upHandler),
                    e.cancelable && (e.preventDefault(), e.stopPropagation()),
                    f(e.touches[0]?.clientX))
                },
              },
              g = kt() ? { passive: !1 } : !1
            ;(At(a)
              ? (p?.addEventListener(`touchmove`, h.moveHandler, g), p?.addEventListener(`touchend`, h.upHandler, g))
              : (p?.addEventListener(`mousemove`, m.moveHandler, g), p?.addEventListener(`mouseup`, m.upHandler, g)),
              t.setColumnSizingInfo((e) => ({
                ...e,
                startOffset: c,
                startSize: o,
                deltaOffset: 0,
                deltaPercentage: 0,
                columnSizingStart: s,
                isResizingColumn: r.id,
              })))
          }
        }))
    },
    createTable: (e) => {
      ;((e.setColumnSizing = (t) => (e.options.onColumnSizingChange == null ? void 0 : e.options.onColumnSizingChange(t))),
        (e.setColumnSizingInfo = (t) => (e.options.onColumnSizingInfoChange == null ? void 0 : e.options.onColumnSizingInfoChange(t))),
        (e.resetColumnSizing = (t) => {
          e.setColumnSizing(t ? {} : (e.initialState.columnSizing ?? {}))
        }),
        (e.resetHeaderSizeInfo = (t) => {
          e.setColumnSizingInfo(t ? Et() : (e.initialState.columnSizingInfo ?? Et()))
        }),
        (e.getTotalSize = () => e.getHeaderGroups()[0]?.headers.reduce((e, t) => e + t.getSize(), 0) ?? 0),
        (e.getLeftTotalSize = () => e.getLeftHeaderGroups()[0]?.headers.reduce((e, t) => e + t.getSize(), 0) ?? 0),
        (e.getCenterTotalSize = () => e.getCenterHeaderGroups()[0]?.headers.reduce((e, t) => e + t.getSize(), 0) ?? 0),
        (e.getRightTotalSize = () => e.getRightHeaderGroups()[0]?.headers.reduce((e, t) => e + t.getSize(), 0) ?? 0))
    },
  },
  Ot = null
function kt() {
  if (typeof Ot == `boolean`) return Ot
  let e = !1
  try {
    let t = {
        get passive() {
          return ((e = !0), !1)
        },
      },
      n = () => {}
    ;(window.addEventListener(`test`, n, t), window.removeEventListener(`test`, n))
  } catch {
    e = !1
  }
  return ((Ot = e), Ot)
}
function At(e) {
  return e.type === `touchstart`
}
var jt = {
  getInitialState: (e) => ({ columnVisibility: {}, ...e }),
  getDefaultOptions: (e) => ({ onColumnVisibilityChange: K(`columnVisibility`, e) }),
  createColumn: (e, t) => {
    ;((e.toggleVisibility = (n) => {
      e.getCanHide() && t.setColumnVisibility((t) => ({ ...t, [e.id]: n ?? !e.getIsVisible() }))
    }),
      (e.getIsVisible = () => {
        let n = e.columns
        return (n.length ? n.some((e) => e.getIsVisible()) : t.getState().columnVisibility?.[e.id]) ?? !0
      }),
      (e.getCanHide = () => (e.columnDef.enableHiding ?? !0) && (t.options.enableHiding ?? !0)),
      (e.getToggleVisibilityHandler = () => (t) => {
        e.toggleVisibility == null || e.toggleVisibility(t.target.checked)
      }))
  },
  createRow: (e, t) => {
    ;((e._getAllVisibleCells = q(
      () => [e.getAllCells(), t.getState().columnVisibility],
      (e) => e.filter((e) => e.column.getIsVisible()),
      J(t.options, `debugRows`, `_getAllVisibleCells`),
    )),
      (e.getVisibleCells = q(
        () => [e.getLeftVisibleCells(), e.getCenterVisibleCells(), e.getRightVisibleCells()],
        (e, t, n) => [...e, ...t, ...n],
        J(t.options, `debugRows`, `getVisibleCells`),
      )))
  },
  createTable: (e) => {
    let t = (t, n) =>
      q(
        () => [
          n(),
          n()
            .filter((e) => e.getIsVisible())
            .map((e) => e.id)
            .join(`_`),
        ],
        (e) => e.filter((e) => (e.getIsVisible == null ? void 0 : e.getIsVisible())),
        J(e.options, `debugColumns`, t),
      )
    ;((e.getVisibleFlatColumns = t(`getVisibleFlatColumns`, () => e.getAllFlatColumns())),
      (e.getVisibleLeafColumns = t(`getVisibleLeafColumns`, () => e.getAllLeafColumns())),
      (e.getLeftVisibleLeafColumns = t(`getLeftVisibleLeafColumns`, () => e.getLeftLeafColumns())),
      (e.getRightVisibleLeafColumns = t(`getRightVisibleLeafColumns`, () => e.getRightLeafColumns())),
      (e.getCenterVisibleLeafColumns = t(`getCenterVisibleLeafColumns`, () => e.getCenterLeafColumns())),
      (e.setColumnVisibility = (t) => (e.options.onColumnVisibilityChange == null ? void 0 : e.options.onColumnVisibilityChange(t))),
      (e.resetColumnVisibility = (t) => {
        e.setColumnVisibility(t ? {} : (e.initialState.columnVisibility ?? {}))
      }),
      (e.toggleAllColumnsVisible = (t) => {
        ;((t ??= !e.getIsAllColumnsVisible()),
          e.setColumnVisibility(e.getAllLeafColumns().reduce((e, n) => ({ ...e, [n.id]: t || !(n.getCanHide != null && n.getCanHide()) }), {})))
      }),
      (e.getIsAllColumnsVisible = () => !e.getAllLeafColumns().some((e) => !(e.getIsVisible != null && e.getIsVisible()))),
      (e.getIsSomeColumnsVisible = () => e.getAllLeafColumns().some((e) => (e.getIsVisible == null ? void 0 : e.getIsVisible()))),
      (e.getToggleAllColumnsVisibilityHandler = () => (t) => {
        e.toggleAllColumnsVisible(t.target?.checked)
      }))
  },
}
function Mt(e, t) {
  return t
    ? t === `center`
      ? e.getCenterVisibleLeafColumns()
      : t === `left`
        ? e.getLeftVisibleLeafColumns()
        : e.getRightVisibleLeafColumns()
    : e.getVisibleLeafColumns()
}
var Nt = {
    createTable: (e) => {
      ;((e._getGlobalFacetedRowModel = e.options.getFacetedRowModel && e.options.getFacetedRowModel(e, `__global__`)),
        (e.getGlobalFacetedRowModel = () =>
          e.options.manualFiltering || !e._getGlobalFacetedRowModel ? e.getPreFilteredRowModel() : e._getGlobalFacetedRowModel()),
        (e._getGlobalFacetedUniqueValues = e.options.getFacetedUniqueValues && e.options.getFacetedUniqueValues(e, `__global__`)),
        (e.getGlobalFacetedUniqueValues = () => (e._getGlobalFacetedUniqueValues ? e._getGlobalFacetedUniqueValues() : new Map())),
        (e._getGlobalFacetedMinMaxValues = e.options.getFacetedMinMaxValues && e.options.getFacetedMinMaxValues(e, `__global__`)),
        (e.getGlobalFacetedMinMaxValues = () => {
          if (e._getGlobalFacetedMinMaxValues) return e._getGlobalFacetedMinMaxValues()
        }))
    },
  },
  Pt = {
    getInitialState: (e) => ({ globalFilter: void 0, ...e }),
    getDefaultOptions: (e) => ({
      onGlobalFilterChange: K(`globalFilter`, e),
      globalFilterFn: `auto`,
      getColumnCanGlobalFilter: (t) => {
        var n
        let r = (n = e.getCoreRowModel().flatRows[0]) == null || (n = n._getAllCellsByColumnId()[t.id]) == null ? void 0 : n.getValue()
        return typeof r == `string` || typeof r == `number`
      },
    }),
    createColumn: (e, t) => {
      e.getCanGlobalFilter = () =>
        (e.columnDef.enableGlobalFilter ?? !0) &&
        (t.options.enableGlobalFilter ?? !0) &&
        (t.options.enableFilters ?? !0) &&
        ((t.options.getColumnCanGlobalFilter == null ? void 0 : t.options.getColumnCanGlobalFilter(e)) ?? !0) &&
        !!e.accessorFn
    },
    createTable: (e) => {
      ;((e.getGlobalAutoFilterFn = () => X.includesString),
        (e.getGlobalFilterFn = () => {
          let { globalFilterFn: t } = e.options
          return Ze(t) ? t : t === `auto` ? e.getGlobalAutoFilterFn() : (e.options.filterFns?.[t] ?? X[t])
        }),
        (e.setGlobalFilter = (t) => {
          e.options.onGlobalFilterChange == null || e.options.onGlobalFilterChange(t)
        }),
        (e.resetGlobalFilter = (t) => {
          e.setGlobalFilter(t ? void 0 : e.initialState.globalFilter)
        }))
    },
  },
  Ft = {
    getInitialState: (e) => ({ expanded: {}, ...e }),
    getDefaultOptions: (e) => ({ onExpandedChange: K(`expanded`, e), paginateExpandedRows: !0 }),
    createTable: (e) => {
      let t = !1,
        n = !1
      ;((e._autoResetExpanded = () => {
        if (!t) {
          e._queue(() => {
            t = !0
          })
          return
        }
        if (e.options.autoResetAll ?? e.options.autoResetExpanded ?? !e.options.manualExpanding) {
          if (n) return
          ;((n = !0),
            e._queue(() => {
              ;(e.resetExpanded(), (n = !1))
            }))
        }
      }),
        (e.setExpanded = (t) => (e.options.onExpandedChange == null ? void 0 : e.options.onExpandedChange(t))),
        (e.toggleAllRowsExpanded = (t) => {
          ;(t ?? !e.getIsAllRowsExpanded()) ? e.setExpanded(!0) : e.setExpanded({})
        }),
        (e.resetExpanded = (t) => {
          e.setExpanded(t ? {} : (e.initialState?.expanded ?? {}))
        }),
        (e.getCanSomeRowsExpand = () => e.getPrePaginationRowModel().flatRows.some((e) => e.getCanExpand())),
        (e.getToggleAllRowsExpandedHandler = () => (t) => {
          ;(t.persist == null || t.persist(), e.toggleAllRowsExpanded())
        }),
        (e.getIsSomeRowsExpanded = () => {
          let t = e.getState().expanded
          return t === !0 || Object.values(t).some(Boolean)
        }),
        (e.getIsAllRowsExpanded = () => {
          let t = e.getState().expanded
          return typeof t == `boolean` ? t === !0 : !(!Object.keys(t).length || e.getRowModel().flatRows.some((e) => !e.getIsExpanded()))
        }),
        (e.getExpandedDepth = () => {
          let t = 0
          return (
            (e.getState().expanded === !0 ? Object.keys(e.getRowModel().rowsById) : Object.keys(e.getState().expanded)).forEach((e) => {
              let n = e.split(`.`)
              t = Math.max(t, n.length)
            }),
            t
          )
        }),
        (e.getPreExpandedRowModel = () => e.getSortedRowModel()),
        (e.getExpandedRowModel = () => (
          !e._getExpandedRowModel && e.options.getExpandedRowModel && (e._getExpandedRowModel = e.options.getExpandedRowModel(e)),
          e.options.manualExpanding || !e._getExpandedRowModel ? e.getPreExpandedRowModel() : e._getExpandedRowModel()
        )))
    },
    createRow: (e, t) => {
      ;((e.toggleExpanded = (n) => {
        t.setExpanded((r) => {
          let i = r === !0 ? !0 : !!(r != null && r[e.id]),
            a = {}
          if (
            (r === !0
              ? Object.keys(t.getRowModel().rowsById).forEach((e) => {
                  a[e] = !0
                })
              : (a = r),
            (n ??= !i),
            !i && n)
          )
            return { ...a, [e.id]: !0 }
          if (i && !n) {
            let { [e.id]: t, ...n } = a
            return n
          }
          return r
        })
      }),
        (e.getIsExpanded = () => {
          let n = t.getState().expanded
          return !!((t.options.getIsRowExpanded == null ? void 0 : t.options.getIsRowExpanded(e)) ?? (n === !0 || n?.[e.id]))
        }),
        (e.getCanExpand = () => {
          var n
          return (
            (t.options.getRowCanExpand == null ? void 0 : t.options.getRowCanExpand(e)) ??
            ((t.options.enableExpanding ?? !0) && !!((n = e.subRows) != null && n.length))
          )
        }),
        (e.getIsAllParentsExpanded = () => {
          let n = !0,
            r = e
          for (; n && r.parentId; ) ((r = t.getRow(r.parentId, !0)), (n = r.getIsExpanded()))
          return n
        }),
        (e.getToggleExpandedHandler = () => {
          let t = e.getCanExpand()
          return () => {
            t && e.toggleExpanded()
          }
        }))
    },
  },
  It = 0,
  Lt = 10,
  Rt = () => ({ pageIndex: It, pageSize: Lt }),
  zt = {
    getInitialState: (e) => ({ ...e, pagination: { ...Rt(), ...e?.pagination } }),
    getDefaultOptions: (e) => ({ onPaginationChange: K(`pagination`, e) }),
    createTable: (e) => {
      let t = !1,
        n = !1
      ;((e._autoResetPageIndex = () => {
        if (!t) {
          e._queue(() => {
            t = !0
          })
          return
        }
        if (e.options.autoResetAll ?? e.options.autoResetPageIndex ?? !e.options.manualPagination) {
          if (n) return
          ;((n = !0),
            e._queue(() => {
              ;(e.resetPageIndex(), (n = !1))
            }))
        }
      }),
        (e.setPagination = (t) => (e.options.onPaginationChange == null ? void 0 : e.options.onPaginationChange((e) => G(t, e)))),
        (e.resetPagination = (t) => {
          e.setPagination(t ? Rt() : (e.initialState.pagination ?? Rt()))
        }),
        (e.setPageIndex = (t) => {
          e.setPagination((n) => {
            let r = G(t, n.pageIndex),
              i = e.options.pageCount === void 0 || e.options.pageCount === -1 ? 2 ** 53 - 1 : e.options.pageCount - 1
            return ((r = Math.max(0, Math.min(r, i))), { ...n, pageIndex: r })
          })
        }),
        (e.resetPageIndex = (t) => {
          var n
          e.setPageIndex(t ? It : (((n = e.initialState) == null || (n = n.pagination) == null ? void 0 : n.pageIndex) ?? It))
        }),
        (e.resetPageSize = (t) => {
          var n
          e.setPageSize(t ? Lt : (((n = e.initialState) == null || (n = n.pagination) == null ? void 0 : n.pageSize) ?? Lt))
        }),
        (e.setPageSize = (t) => {
          e.setPagination((e) => {
            let n = Math.max(1, G(t, e.pageSize)),
              r = e.pageSize * e.pageIndex,
              i = Math.floor(r / n)
            return { ...e, pageIndex: i, pageSize: n }
          })
        }),
        (e.setPageCount = (t) =>
          e.setPagination((n) => {
            let r = G(t, e.options.pageCount ?? -1)
            return (typeof r == `number` && (r = Math.max(-1, r)), { ...n, pageCount: r })
          })),
        (e.getPageOptions = q(
          () => [e.getPageCount()],
          (e) => {
            let t = []
            return (e && e > 0 && (t = [...Array(e)].fill(null).map((e, t) => t)), t)
          },
          J(e.options, `debugTable`, `getPageOptions`),
        )),
        (e.getCanPreviousPage = () => e.getState().pagination.pageIndex > 0),
        (e.getCanNextPage = () => {
          let { pageIndex: t } = e.getState().pagination,
            n = e.getPageCount()
          return n === -1 ? !0 : n === 0 ? !1 : t < n - 1
        }),
        (e.previousPage = () => e.setPageIndex((e) => e - 1)),
        (e.nextPage = () => e.setPageIndex((e) => e + 1)),
        (e.firstPage = () => e.setPageIndex(0)),
        (e.lastPage = () => e.setPageIndex(e.getPageCount() - 1)),
        (e.getPrePaginationRowModel = () => e.getExpandedRowModel()),
        (e.getPaginationRowModel = () => (
          !e._getPaginationRowModel && e.options.getPaginationRowModel && (e._getPaginationRowModel = e.options.getPaginationRowModel(e)),
          e.options.manualPagination || !e._getPaginationRowModel ? e.getPrePaginationRowModel() : e._getPaginationRowModel()
        )),
        (e.getPageCount = () => e.options.pageCount ?? Math.ceil(e.getRowCount() / e.getState().pagination.pageSize)),
        (e.getRowCount = () => e.options.rowCount ?? e.getPrePaginationRowModel().rows.length))
    },
  },
  Bt = () => ({ top: [], bottom: [] }),
  Vt = {
    getInitialState: (e) => ({ rowPinning: Bt(), ...e }),
    getDefaultOptions: (e) => ({ onRowPinningChange: K(`rowPinning`, e) }),
    createRow: (e, t) => {
      ;((e.pin = (n, r, i) => {
        let a = r
            ? e.getLeafRows().map((e) => {
                let { id: t } = e
                return t
              })
            : [],
          o = i
            ? e.getParentRows().map((e) => {
                let { id: t } = e
                return t
              })
            : [],
          s = new Set([...o, e.id, ...a])
        t.setRowPinning((e) =>
          n === `bottom`
            ? {
                top: (e?.top ?? []).filter((e) => !(s != null && s.has(e))),
                bottom: [...(e?.bottom ?? []).filter((e) => !(s != null && s.has(e))), ...Array.from(s)],
              }
            : n === `top`
              ? {
                  top: [...(e?.top ?? []).filter((e) => !(s != null && s.has(e))), ...Array.from(s)],
                  bottom: (e?.bottom ?? []).filter((e) => !(s != null && s.has(e))),
                }
              : { top: (e?.top ?? []).filter((e) => !(s != null && s.has(e))), bottom: (e?.bottom ?? []).filter((e) => !(s != null && s.has(e))) },
        )
      }),
        (e.getCanPin = () => {
          let { enableRowPinning: n, enablePinning: r } = t.options
          return typeof n == `function` ? n(e) : (n ?? r ?? !0)
        }),
        (e.getIsPinned = () => {
          let n = [e.id],
            { top: r, bottom: i } = t.getState().rowPinning,
            a = n.some((e) => r?.includes(e)),
            o = n.some((e) => i?.includes(e))
          return a ? `top` : o ? `bottom` : !1
        }),
        (e.getPinnedIndex = () => {
          let n = e.getIsPinned()
          return n
            ? ((n === `top` ? t.getTopRows() : t.getBottomRows())
                ?.map((e) => {
                  let { id: t } = e
                  return t
                })
                ?.indexOf(e.id) ?? -1)
            : -1
        }))
    },
    createTable: (e) => {
      ;((e.setRowPinning = (t) => (e.options.onRowPinningChange == null ? void 0 : e.options.onRowPinningChange(t))),
        (e.resetRowPinning = (t) => e.setRowPinning(t ? Bt() : (e.initialState?.rowPinning ?? Bt()))),
        (e.getIsSomeRowsPinned = (t) => {
          let n = e.getState().rowPinning
          return t ? !!n[t]?.length : !!(n.top?.length || n.bottom?.length)
        }),
        (e._getPinnedRows = (t, n, r) =>
          ((e.options.keepPinnedRows ?? !0)
            ? (n ?? []).map((t) => {
                let n = e.getRow(t, !0)
                return n.getIsAllParentsExpanded() ? n : null
              })
            : (n ?? []).map((e) => t.find((t) => t.id === e))
          )
            .filter(Boolean)
            .map((e) => ({ ...e, position: r }))),
        (e.getTopRows = q(
          () => [e.getRowModel().rows, e.getState().rowPinning.top],
          (t, n) => e._getPinnedRows(t, n, `top`),
          J(e.options, `debugRows`, `getTopRows`),
        )),
        (e.getBottomRows = q(
          () => [e.getRowModel().rows, e.getState().rowPinning.bottom],
          (t, n) => e._getPinnedRows(t, n, `bottom`),
          J(e.options, `debugRows`, `getBottomRows`),
        )),
        (e.getCenterRows = q(
          () => [e.getRowModel().rows, e.getState().rowPinning.top, e.getState().rowPinning.bottom],
          (e, t, n) => {
            let r = new Set([...(t ?? []), ...(n ?? [])])
            return e.filter((e) => !r.has(e.id))
          },
          J(e.options, `debugRows`, `getCenterRows`),
        )))
    },
  },
  Ht = {
    getInitialState: (e) => ({ rowSelection: {}, ...e }),
    getDefaultOptions: (e) => ({ onRowSelectionChange: K(`rowSelection`, e), enableRowSelection: !0, enableMultiRowSelection: !0, enableSubRowSelection: !0 }),
    createTable: (e) => {
      ;((e.setRowSelection = (t) => (e.options.onRowSelectionChange == null ? void 0 : e.options.onRowSelectionChange(t))),
        (e.resetRowSelection = (t) => e.setRowSelection(t ? {} : (e.initialState.rowSelection ?? {}))),
        (e.toggleAllRowsSelected = (t) => {
          e.setRowSelection((n) => {
            t = t === void 0 ? !e.getIsAllRowsSelected() : t
            let r = { ...n },
              i = e.getPreGroupedRowModel().flatRows
            return (
              t
                ? i.forEach((e) => {
                    e.getCanSelect() && (r[e.id] = !0)
                  })
                : i.forEach((e) => {
                    delete r[e.id]
                  }),
              r
            )
          })
        }),
        (e.toggleAllPageRowsSelected = (t) =>
          e.setRowSelection((n) => {
            let r = t === void 0 ? !e.getIsAllPageRowsSelected() : t,
              i = { ...n }
            return (
              e.getRowModel().rows.forEach((t) => {
                Ut(i, t.id, r, !0, e)
              }),
              i
            )
          })),
        (e.getPreSelectedRowModel = () => e.getCoreRowModel()),
        (e.getSelectedRowModel = q(
          () => [e.getState().rowSelection, e.getCoreRowModel()],
          (t, n) => (Object.keys(t).length ? Wt(e, n) : { rows: [], flatRows: [], rowsById: {} }),
          J(e.options, `debugTable`, `getSelectedRowModel`),
        )),
        (e.getFilteredSelectedRowModel = q(
          () => [e.getState().rowSelection, e.getFilteredRowModel()],
          (t, n) => (Object.keys(t).length ? Wt(e, n) : { rows: [], flatRows: [], rowsById: {} }),
          J(e.options, `debugTable`, `getFilteredSelectedRowModel`),
        )),
        (e.getGroupedSelectedRowModel = q(
          () => [e.getState().rowSelection, e.getSortedRowModel()],
          (t, n) => (Object.keys(t).length ? Wt(e, n) : { rows: [], flatRows: [], rowsById: {} }),
          J(e.options, `debugTable`, `getGroupedSelectedRowModel`),
        )),
        (e.getIsAllRowsSelected = () => {
          let t = e.getFilteredRowModel().flatRows,
            { rowSelection: n } = e.getState(),
            r = !!(t.length && Object.keys(n).length)
          return (r && t.some((e) => e.getCanSelect() && !n[e.id]) && (r = !1), r)
        }),
        (e.getIsAllPageRowsSelected = () => {
          let t = e.getPaginationRowModel().flatRows.filter((e) => e.getCanSelect()),
            { rowSelection: n } = e.getState(),
            r = !!t.length
          return (r && t.some((e) => !n[e.id]) && (r = !1), r)
        }),
        (e.getIsSomeRowsSelected = () => {
          let t = Object.keys(e.getState().rowSelection ?? {}).length
          return t > 0 && t < e.getFilteredRowModel().flatRows.length
        }),
        (e.getIsSomePageRowsSelected = () => {
          let t = e.getPaginationRowModel().flatRows
          return e.getIsAllPageRowsSelected() ? !1 : t.filter((e) => e.getCanSelect()).some((e) => e.getIsSelected() || e.getIsSomeSelected())
        }),
        (e.getToggleAllRowsSelectedHandler = () => (t) => {
          e.toggleAllRowsSelected(t.target.checked)
        }),
        (e.getToggleAllPageRowsSelectedHandler = () => (t) => {
          e.toggleAllPageRowsSelected(t.target.checked)
        }))
    },
    createRow: (e, t) => {
      ;((e.toggleSelected = (n, r) => {
        let i = e.getIsSelected()
        t.setRowSelection((a) => {
          if (((n = n === void 0 ? !i : n), e.getCanSelect() && i === n)) return a
          let o = { ...a }
          return (Ut(o, e.id, n, r?.selectChildren ?? !0, t), o)
        })
      }),
        (e.getIsSelected = () => {
          let { rowSelection: n } = t.getState()
          return Gt(e, n)
        }),
        (e.getIsSomeSelected = () => {
          let { rowSelection: n } = t.getState()
          return Kt(e, n) === `some`
        }),
        (e.getIsAllSubRowsSelected = () => {
          let { rowSelection: n } = t.getState()
          return Kt(e, n) === `all`
        }),
        (e.getCanSelect = () => (typeof t.options.enableRowSelection == `function` ? t.options.enableRowSelection(e) : (t.options.enableRowSelection ?? !0))),
        (e.getCanSelectSubRows = () =>
          typeof t.options.enableSubRowSelection == `function` ? t.options.enableSubRowSelection(e) : (t.options.enableSubRowSelection ?? !0)),
        (e.getCanMultiSelect = () =>
          typeof t.options.enableMultiRowSelection == `function` ? t.options.enableMultiRowSelection(e) : (t.options.enableMultiRowSelection ?? !0)),
        (e.getToggleSelectedHandler = () => {
          let t = e.getCanSelect()
          return (n) => {
            t && e.toggleSelected(n.target?.checked)
          }
        }))
    },
  },
  Ut = (e, t, n, r, i) => {
    var a
    let o = i.getRow(t, !0)
    ;(n ? (o.getCanMultiSelect() || Object.keys(e).forEach((t) => delete e[t]), o.getCanSelect() && (e[t] = !0)) : delete e[t],
      r && (a = o.subRows) != null && a.length && o.getCanSelectSubRows() && o.subRows.forEach((t) => Ut(e, t.id, n, r, i)))
  }
function Wt(e, t) {
  let n = e.getState().rowSelection,
    r = [],
    i = {},
    a = function (e, t) {
      return e
        .map((e) => {
          var t
          let o = Gt(e, n)
          if ((o && (r.push(e), (i[e.id] = e)), (t = e.subRows) != null && t.length && (e = { ...e, subRows: a(e.subRows) }), o)) return e
        })
        .filter(Boolean)
    }
  return { rows: a(t.rows), flatRows: r, rowsById: i }
}
function Gt(e, t) {
  return t[e.id] ?? !1
}
function Kt(e, t, n) {
  var r
  if (!((r = e.subRows) != null && r.length)) return !1
  let i = !0,
    a = !1
  return (
    e.subRows.forEach((e) => {
      if (!(a && !i) && (e.getCanSelect() && (Gt(e, t) ? (a = !0) : (i = !1)), e.subRows && e.subRows.length)) {
        let n = Kt(e, t)
        n === `all` ? (a = !0) : (n === `some` && (a = !0), (i = !1))
      }
    }),
    i ? `all` : a ? `some` : !1
  )
}
var qt = /([0-9]+)/gm,
  Jt = (e, t, n) => tn(Q(e.getValue(n)).toLowerCase(), Q(t.getValue(n)).toLowerCase()),
  Yt = (e, t, n) => tn(Q(e.getValue(n)), Q(t.getValue(n))),
  Xt = (e, t, n) => en(Q(e.getValue(n)).toLowerCase(), Q(t.getValue(n)).toLowerCase()),
  Zt = (e, t, n) => en(Q(e.getValue(n)), Q(t.getValue(n))),
  Qt = (e, t, n) => {
    let r = e.getValue(n),
      i = t.getValue(n)
    return r > i ? 1 : r < i ? -1 : 0
  },
  $t = (e, t, n) => en(e.getValue(n), t.getValue(n))
function en(e, t) {
  return e === t ? 0 : e > t ? 1 : -1
}
function Q(e) {
  return typeof e == `number` ? (isNaN(e) || e === 1 / 0 || e === -1 / 0 ? `` : String(e)) : typeof e == `string` ? e : ``
}
function tn(e, t) {
  let n = e.split(qt).filter(Boolean),
    r = t.split(qt).filter(Boolean)
  for (; n.length && r.length; ) {
    let e = n.shift(),
      t = r.shift(),
      i = parseInt(e, 10),
      a = parseInt(t, 10),
      o = [i, a].sort()
    if (isNaN(o[0])) {
      if (e > t) return 1
      if (t > e) return -1
      continue
    }
    if (isNaN(o[1])) return isNaN(i) ? -1 : 1
    if (i > a) return 1
    if (a > i) return -1
  }
  return n.length - r.length
}
var nn = { alphanumeric: Jt, alphanumericCaseSensitive: Yt, text: Xt, textCaseSensitive: Zt, datetime: Qt, basic: $t },
  rn = [
    rt,
    jt,
    xt,
    Ct,
    ot,
    gt,
    Nt,
    Pt,
    {
      getInitialState: (e) => ({ sorting: [], ...e }),
      getDefaultColumnDef: () => ({ sortingFn: `auto`, sortUndefined: 1 }),
      getDefaultOptions: (e) => ({ onSortingChange: K(`sorting`, e), isMultiSortEvent: (e) => e.shiftKey }),
      createColumn: (e, t) => {
        ;((e.getAutoSortingFn = () => {
          let n = t.getFilteredRowModel().flatRows.slice(10),
            r = !1
          for (let t of n) {
            let n = t?.getValue(e.id)
            if (Object.prototype.toString.call(n) === `[object Date]`) return nn.datetime
            if (typeof n == `string` && ((r = !0), n.split(qt).length > 1)) return nn.alphanumeric
          }
          return r ? nn.text : nn.basic
        }),
          (e.getAutoSortDir = () => (typeof t.getFilteredRowModel().flatRows[0]?.getValue(e.id) == `string` ? `asc` : `desc`)),
          (e.getSortingFn = () => {
            if (!e) throw Error()
            return Ze(e.columnDef.sortingFn)
              ? e.columnDef.sortingFn
              : e.columnDef.sortingFn === `auto`
                ? e.getAutoSortingFn()
                : (t.options.sortingFns?.[e.columnDef.sortingFn] ?? nn[e.columnDef.sortingFn])
          }),
          (e.toggleSorting = (n, r) => {
            let i = e.getNextSortingOrder(),
              a = n != null
            t.setSorting((o) => {
              let s = o?.find((t) => t.id === e.id),
                c = o?.findIndex((t) => t.id === e.id),
                l = [],
                u,
                d = a ? n : i === `desc`
              return (
                (u =
                  o != null && o.length && e.getCanMultiSort() && r
                    ? s
                      ? `toggle`
                      : `add`
                    : o != null && o.length && c !== o.length - 1
                      ? `replace`
                      : s
                        ? `toggle`
                        : `replace`),
                u === `toggle` && (a || i || (u = `remove`)),
                u === `add`
                  ? ((l = [...o, { id: e.id, desc: d }]), l.splice(0, l.length - (t.options.maxMultiSortColCount ?? 2 ** 53 - 1)))
                  : (l =
                      u === `toggle`
                        ? o.map((t) => (t.id === e.id ? { ...t, desc: d } : t))
                        : u === `remove`
                          ? o.filter((t) => t.id !== e.id)
                          : [{ id: e.id, desc: d }]),
                l
              )
            })
          }),
          (e.getFirstSortDir = () => ((e.columnDef.sortDescFirst ?? t.options.sortDescFirst ?? e.getAutoSortDir() === `desc`) ? `desc` : `asc`)),
          (e.getNextSortingOrder = (n) => {
            let r = e.getFirstSortDir(),
              i = e.getIsSorted()
            return i
              ? i !== r && (t.options.enableSortingRemoval ?? !0) && (!n || (t.options.enableMultiRemove ?? !0))
                ? !1
                : i === `desc`
                  ? `asc`
                  : `desc`
              : r
          }),
          (e.getCanSort = () => (e.columnDef.enableSorting ?? !0) && (t.options.enableSorting ?? !0) && !!e.accessorFn),
          (e.getCanMultiSort = () => e.columnDef.enableMultiSort ?? t.options.enableMultiSort ?? !!e.accessorFn),
          (e.getIsSorted = () => {
            let n = t.getState().sorting?.find((t) => t.id === e.id)
            return n ? (n.desc ? `desc` : `asc`) : !1
          }),
          (e.getSortIndex = () => t.getState().sorting?.findIndex((t) => t.id === e.id) ?? -1),
          (e.clearSorting = () => {
            t.setSorting((t) => (t != null && t.length ? t.filter((t) => t.id !== e.id) : []))
          }),
          (e.getToggleSortingHandler = () => {
            let n = e.getCanSort()
            return (r) => {
              n &&
                (r.persist == null || r.persist(),
                e.toggleSorting == null ||
                  e.toggleSorting(void 0, e.getCanMultiSort() ? (t.options.isMultiSortEvent == null ? void 0 : t.options.isMultiSortEvent(r)) : !1))
            }
          }))
      },
      createTable: (e) => {
        ;((e.setSorting = (t) => (e.options.onSortingChange == null ? void 0 : e.options.onSortingChange(t))),
          (e.resetSorting = (t) => {
            e.setSorting(t ? [] : (e.initialState?.sorting ?? []))
          }),
          (e.getPreSortedRowModel = () => e.getGroupedRowModel()),
          (e.getSortedRowModel = () => (
            !e._getSortedRowModel && e.options.getSortedRowModel && (e._getSortedRowModel = e.options.getSortedRowModel(e)),
            e.options.manualSorting || !e._getSortedRowModel ? e.getPreSortedRowModel() : e._getSortedRowModel()
          )))
      },
    },
    yt,
    Ft,
    zt,
    Vt,
    Ht,
    Dt,
  ]
function an(e) {
  let t = [...rn, ...(e._features ?? [])],
    n = { _features: t },
    r = n._features.reduce((e, t) => Object.assign(e, t.getDefaultOptions == null ? void 0 : t.getDefaultOptions(n)), {}),
    i = (e) => (n.options.mergeOptions ? n.options.mergeOptions(r, e) : { ...r, ...e }),
    a = { ...(e.initialState ?? {}) }
  n._features.forEach((e) => {
    a = (e.getInitialState == null ? void 0 : e.getInitialState(a)) ?? a
  })
  let o = [],
    s = !1,
    c = {
      _features: t,
      options: { ...r, ...e },
      initialState: a,
      _queue: (e) => {
        ;(o.push(e),
          s ||
            ((s = !0),
            Promise.resolve()
              .then(() => {
                for (; o.length; ) o.shift()()
                s = !1
              })
              .catch((e) =>
                setTimeout(() => {
                  throw e
                }),
              )))
      },
      reset: () => {
        n.setState(n.initialState)
      },
      setOptions: (e) => {
        n.options = i(G(e, n.options))
      },
      getState: () => n.options.state,
      setState: (e) => {
        n.options.onStateChange == null || n.options.onStateChange(e)
      },
      _getRowId: (e, t, r) => (n.options.getRowId == null ? void 0 : n.options.getRowId(e, t, r)) ?? `${r ? [r.id, t].join(`.`) : t}`,
      getCoreRowModel: () => ((n._getCoreRowModel ||= n.options.getCoreRowModel(n)), n._getCoreRowModel()),
      getRowModel: () => n.getPaginationRowModel(),
      getRow: (e, t) => {
        let r = (t ? n.getPrePaginationRowModel() : n.getRowModel()).rowsById[e]
        if (!r && ((r = n.getCoreRowModel().rowsById[e]), !r)) throw Error()
        return r
      },
      _getDefaultColumnDef: q(
        () => [n.options.defaultColumn],
        (e) => (
          (e ??= {}),
          {
            header: (e) => {
              let t = e.header.column.columnDef
              return t.accessorKey ? t.accessorKey : t.accessorFn ? t.id : null
            },
            cell: (e) => {
              var t
              return ((t = e.renderValue()) == null || t.toString == null ? void 0 : t.toString()) ?? null
            },
            ...n._features.reduce((e, t) => Object.assign(e, t.getDefaultColumnDef == null ? void 0 : t.getDefaultColumnDef()), {}),
            ...e,
          }
        ),
        J(e, `debugColumns`, `_getDefaultColumnDef`),
      ),
      _getColumnDefs: () => n.options.columns,
      getAllColumns: q(
        () => [n._getColumnDefs()],
        (e) => {
          let t = function (e, r, i) {
            return (
              i === void 0 && (i = 0),
              e.map((e) => {
                let a = tt(n, e, i, r),
                  o = e
                return ((a.columns = o.columns ? t(o.columns, a, i + 1) : []), a)
              })
            )
          }
          return t(e)
        },
        J(e, `debugColumns`, `getAllColumns`),
      ),
      getAllFlatColumns: q(
        () => [n.getAllColumns()],
        (e) => e.flatMap((e) => e.getFlatColumns()),
        J(e, `debugColumns`, `getAllFlatColumns`),
      ),
      _getAllFlatColumnsById: q(
        () => [n.getAllFlatColumns()],
        (e) => e.reduce((e, t) => ((e[t.id] = t), e), {}),
        J(e, `debugColumns`, `getAllFlatColumnsById`),
      ),
      getAllLeafColumns: q(
        () => [n.getAllColumns(), n._getOrderColumnsFn()],
        (e, t) => t(e.flatMap((e) => e.getLeafColumns())),
        J(e, `debugColumns`, `getAllLeafColumns`),
      ),
      getColumn: (e) => n._getAllFlatColumnsById()[e],
    }
  Object.assign(n, c)
  for (let e = 0; e < n._features.length; e++) {
    let t = n._features[e]
    t == null || t.createTable == null || t.createTable(n)
  }
  return n
}
function on() {
  return (e) =>
    q(
      () => [e.options.data],
      (t) => {
        let n = { rows: [], flatRows: [], rowsById: {} },
          r = function (t, i, a) {
            i === void 0 && (i = 0)
            let o = []
            for (let c = 0; c < t.length; c++) {
              let l = at(e, e._getRowId(t[c], c, a), t[c], c, i, void 0, a?.id)
              if ((n.flatRows.push(l), (n.rowsById[l.id] = l), o.push(l), e.options.getSubRows)) {
                var s
                ;((l.originalSubRows = e.options.getSubRows(t[c], c)),
                  (s = l.originalSubRows) != null && s.length && (l.subRows = r(l.originalSubRows, i + 1, l)))
              }
            }
            return o
          }
        return ((n.rows = r(t)), n)
      },
      J(e.options, `debugTable`, `getRowModel`, () => e._autoResetPageIndex()),
    )
}
function sn(e, t, n) {
  return n.options.filterFromLeafRows ? cn(e, t, n) : ln(e, t, n)
}
function cn(e, t, n) {
  let r = [],
    i = {},
    a = n.options.maxLeafRowFilterDepth ?? 100,
    o = function (e, s) {
      s === void 0 && (s = 0)
      let c = []
      for (let u = 0; u < e.length; u++) {
        var l
        let d = e[u],
          f = at(n, d.id, d.original, d.index, d.depth, void 0, d.parentId)
        if (((f.columnFilters = d.columnFilters), (l = d.subRows) != null && l.length && s < a)) {
          if (((f.subRows = o(d.subRows, s + 1)), (d = f), t(d) && !f.subRows.length)) {
            ;(c.push(d), (i[d.id] = d), r.push(d))
            continue
          }
          if (t(d) || f.subRows.length) {
            ;(c.push(d), (i[d.id] = d), r.push(d))
            continue
          }
        } else ((d = f), t(d) && (c.push(d), (i[d.id] = d), r.push(d)))
      }
      return c
    }
  return { rows: o(e), flatRows: r, rowsById: i }
}
function ln(e, t, n) {
  let r = [],
    i = {},
    a = n.options.maxLeafRowFilterDepth ?? 100,
    o = function (e, s) {
      s === void 0 && (s = 0)
      let c = []
      for (let u = 0; u < e.length; u++) {
        let d = e[u]
        if (t(d)) {
          var l
          if ((l = d.subRows) != null && l.length && s < a) {
            let e = at(n, d.id, d.original, d.index, d.depth, void 0, d.parentId)
            ;((e.subRows = o(d.subRows, s + 1)), (d = e))
          }
          ;(c.push(d), r.push(d), (i[d.id] = d))
        }
      }
      return c
    }
  return { rows: o(e), flatRows: r, rowsById: i }
}
function un() {
  return (e) =>
    q(
      () => [e.getPreFilteredRowModel(), e.getState().columnFilters, e.getState().globalFilter],
      (t, n, r) => {
        if (!t.rows.length || (!(n != null && n.length) && !r)) {
          for (let e = 0; e < t.flatRows.length; e++) ((t.flatRows[e].columnFilters = {}), (t.flatRows[e].columnFiltersMeta = {}))
          return t
        }
        let i = [],
          a = []
        ;(n ?? []).forEach((t) => {
          let n = e.getColumn(t.id)
          if (!n) return
          let r = n.getFilterFn()
          r && i.push({ id: t.id, filterFn: r, resolvedValue: (r.resolveFilterValue == null ? void 0 : r.resolveFilterValue(t.value)) ?? t.value })
        })
        let o = (n ?? []).map((e) => e.id),
          s = e.getGlobalFilterFn(),
          c = e.getAllLeafColumns().filter((e) => e.getCanGlobalFilter())
        r &&
          s &&
          c.length &&
          (o.push(`__global__`),
          c.forEach((e) => {
            a.push({ id: e.id, filterFn: s, resolvedValue: (s.resolveFilterValue == null ? void 0 : s.resolveFilterValue(r)) ?? r })
          }))
        let l, u
        for (let e = 0; e < t.flatRows.length; e++) {
          let n = t.flatRows[e]
          if (((n.columnFilters = {}), i.length))
            for (let e = 0; e < i.length; e++) {
              l = i[e]
              let t = l.id
              n.columnFilters[t] = l.filterFn(n, t, l.resolvedValue, (e) => {
                n.columnFiltersMeta[t] = e
              })
            }
          if (a.length) {
            for (let e = 0; e < a.length; e++) {
              u = a[e]
              let t = u.id
              if (
                u.filterFn(n, t, u.resolvedValue, (e) => {
                  n.columnFiltersMeta[t] = e
                })
              ) {
                n.columnFilters.__global__ = !0
                break
              }
            }
            n.columnFilters.__global__ !== !0 && (n.columnFilters.__global__ = !1)
          }
        }
        return sn(
          t.rows,
          (e) => {
            for (let t = 0; t < o.length; t++) if (e.columnFilters[o[t]] === !1) return !1
            return !0
          },
          e,
        )
      },
      J(e.options, `debugTable`, `getFilteredRowModel`, () => e._autoResetPageIndex()),
    )
}
function dn() {
  return (e) =>
    q(
      () => [e.getState().sorting, e.getPreSortedRowModel()],
      (t, n) => {
        if (!n.rows.length || !(t != null && t.length)) return n
        let r = e.getState().sorting,
          i = [],
          a = r.filter((t) => e.getColumn(t.id)?.getCanSort()),
          o = {}
        a.forEach((t) => {
          let n = e.getColumn(t.id)
          n && (o[t.id] = { sortUndefined: n.columnDef.sortUndefined, invertSorting: n.columnDef.invertSorting, sortingFn: n.getSortingFn() })
        })
        let s = (e) => {
          let t = e.map((e) => ({ ...e }))
          return (
            t.sort((e, t) => {
              for (let n = 0; n < a.length; n += 1) {
                let r = a[n],
                  i = o[r.id],
                  s = i.sortUndefined,
                  c = r?.desc ?? !1,
                  l = 0
                if (s) {
                  let n = e.getValue(r.id),
                    i = t.getValue(r.id),
                    a = n === void 0,
                    o = i === void 0
                  if (a || o) {
                    if (s === `first`) return a ? -1 : 1
                    if (s === `last`) return a ? 1 : -1
                    l = a && o ? 0 : a ? s : -s
                  }
                }
                if ((l === 0 && (l = i.sortingFn(e, t, r.id)), l !== 0)) return (c && (l *= -1), i.invertSorting && (l *= -1), l)
              }
              return e.index - t.index
            }),
            t.forEach((e) => {
              var t
              ;(i.push(e), (t = e.subRows) != null && t.length && (e.subRows = s(e.subRows)))
            }),
            t
          )
        }
        return { rows: s(n.rows), flatRows: i, rowsById: n.rowsById }
      },
      J(e.options, `debugTable`, `getSortedRowModel`, () => e._autoResetPageIndex()),
    )
}
function fn(e, t) {
  return e ? (pn(e) ? H.createElement(e, t) : e) : null
}
function pn(e) {
  return mn(e) || typeof e == `function` || hn(e)
}
function mn(e) {
  return (
    typeof e == `function` &&
    (() => {
      let t = Object.getPrototypeOf(e)
      return t.prototype && t.prototype.isReactComponent
    })()
  )
}
function hn(e) {
  return typeof e == `object` && typeof e.$$typeof == `symbol` && [`react.memo`, `react.forward_ref`].includes(e.$$typeof.description)
}
function gn(e) {
  let t = { state: {}, onStateChange: () => {}, renderFallbackValue: null, ...e },
    [n] = H.useState(() => ({ current: an(t) })),
    [r, i] = H.useState(() => n.current.initialState)
  return (
    n.current.setOptions((t) => ({
      ...t,
      ...e,
      state: { ...r, ...e.state },
      onStateChange: (t) => {
        ;(i(t), e.onStateChange == null || e.onStateChange(t))
      },
    })),
    n.current
  )
}
var _n = e(i(), 1)
function vn(e, t, n) {
  let r = n.initialDeps ?? [],
    i,
    a = !0
  function o() {
    let o
    n.key && n.debug?.call(n) && (o = Date.now())
    let s = e()
    if (!(s.length !== r.length || s.some((e, t) => r[t] !== e))) return i
    r = s
    let c
    if ((n.key && n.debug?.call(n) && (c = Date.now()), (i = t(...s)), n.key && n.debug?.call(n))) {
      let e = Math.round((Date.now() - o) * 100) / 100,
        t = Math.round((Date.now() - c) * 100) / 100,
        r = t / 16,
        i = (e, t) => {
          for (e = String(e); e.length < t; ) e = ` ` + e
          return e
        }
      console.info(
        `%c⏱ ${i(t, 5)} /${i(e, 5)} ms`,
        `
            font-size: .6rem;
            font-weight: bold;
            color: hsl(${Math.max(0, Math.min(120 - 120 * r, 120))}deg 100% 31%);`,
        n?.key,
      )
    }
    return (n?.onChange && !(a && n.skipInitialOnChange) && n.onChange(i), (a = !1), i)
  }
  return (
    (o.updateDeps = (e) => {
      r = e
    }),
    o
  )
}
function yn(e, t) {
  if (e === void 0) throw Error(`Unexpected undefined${t ? `: ${t}` : ``}`)
  return e
}
var bn = (e, t) => Math.abs(e - t) < 1.01,
  xn = (e, t, n) => {
    let r
    return function (...i) {
      ;(e.clearTimeout(r), (r = e.setTimeout(() => t.apply(this, i), n)))
    }
  },
  Sn = (e) => {
    let { offsetWidth: t, offsetHeight: n } = e
    return { width: t, height: n }
  },
  Cn = (e) => e,
  wn = (e) => {
    let t = Math.max(e.startIndex - e.overscan, 0),
      n = Math.min(e.endIndex + e.overscan, e.count - 1),
      r = []
    for (let e = t; e <= n; e++) r.push(e)
    return r
  },
  Tn = (e, t) => {
    let n = e.scrollElement
    if (!n) return
    let r = e.targetWindow
    if (!r) return
    let i = (e) => {
      let { width: n, height: r } = e
      t({ width: Math.round(n), height: Math.round(r) })
    }
    if ((i(Sn(n)), !r.ResizeObserver)) return () => {}
    let a = new r.ResizeObserver((t) => {
      let r = () => {
        let e = t[0]
        if (e?.borderBoxSize) {
          let t = e.borderBoxSize[0]
          if (t) {
            i({ width: t.inlineSize, height: t.blockSize })
            return
          }
        }
        i(Sn(n))
      }
      e.options.useAnimationFrameWithResizeObserver ? requestAnimationFrame(r) : r()
    })
    return (
      a.observe(n, { box: `border-box` }),
      () => {
        a.unobserve(n)
      }
    )
  },
  En = { passive: !0 },
  Dn = typeof window > `u` ? !0 : `onscrollend` in window,
  On = (e, t) => {
    let n = e.scrollElement
    if (!n) return
    let r = e.targetWindow
    if (!r) return
    let i = 0,
      a =
        e.options.useScrollendEvent && Dn
          ? () => void 0
          : xn(
              r,
              () => {
                t(i, !1)
              },
              e.options.isScrollingResetDelay,
            ),
      o = (r) => () => {
        let { horizontal: o, isRtl: s } = e.options
        ;((i = o ? n.scrollLeft * ((s && -1) || 1) : n.scrollTop), a(), t(i, r))
      },
      s = o(!0),
      c = o(!1)
    n.addEventListener(`scroll`, s, En)
    let l = e.options.useScrollendEvent && Dn
    return (
      l && n.addEventListener(`scrollend`, c, En),
      () => {
        ;(n.removeEventListener(`scroll`, s), l && n.removeEventListener(`scrollend`, c))
      }
    )
  },
  kn = (e, t, n) => {
    if (t?.borderBoxSize) {
      let e = t.borderBoxSize[0]
      if (e) return Math.round(e[n.options.horizontal ? `inlineSize` : `blockSize`])
    }
    return e[n.options.horizontal ? `offsetWidth` : `offsetHeight`]
  },
  An = (e, { adjustments: t = 0, behavior: n }, r) => {
    var i, a
    let o = e + t
    ;(a = (i = r.scrollElement)?.scrollTo) == null || a.call(i, { [r.options.horizontal ? `left` : `top`]: o, behavior: n })
  },
  jn = class {
    constructor(e) {
      ;((this.unsubs = []),
        (this.scrollElement = null),
        (this.targetWindow = null),
        (this.isScrolling = !1),
        (this.scrollState = null),
        (this.measurementsCache = []),
        (this.itemSizeCache = new Map()),
        (this.laneAssignments = new Map()),
        (this.pendingMeasuredCacheIndexes = []),
        (this.prevLanes = void 0),
        (this.lanesChangedFlag = !1),
        (this.lanesSettling = !1),
        (this.scrollRect = null),
        (this.scrollOffset = null),
        (this.scrollDirection = null),
        (this.scrollAdjustments = 0),
        (this.elementsCache = new Map()),
        (this.now = () => {
          var e
          return (e = this.targetWindow?.performance)?.now?.call(e) ?? Date.now()
        }),
        (this.observer = (() => {
          let e = null,
            t = () =>
              e ||
              (!this.targetWindow || !this.targetWindow.ResizeObserver
                ? null
                : (e = new this.targetWindow.ResizeObserver((e) => {
                    e.forEach((e) => {
                      let t = () => {
                        let t = e.target,
                          n = this.indexFromElement(t)
                        if (!t.isConnected) {
                          this.observer.unobserve(t)
                          return
                        }
                        this.shouldMeasureDuringScroll(n) && this.resizeItem(n, this.options.measureElement(t, e, this))
                      }
                      this.options.useAnimationFrameWithResizeObserver ? requestAnimationFrame(t) : t()
                    })
                  })))
          return {
            disconnect: () => {
              var n
              ;((n = t()) == null || n.disconnect(), (e = null))
            },
            observe: (e) => t()?.observe(e, { box: `border-box` }),
            unobserve: (e) => t()?.unobserve(e),
          }
        })()),
        (this.range = null),
        (this.setOptions = (e) => {
          ;(Object.entries(e).forEach(([t, n]) => {
            n === void 0 && delete e[t]
          }),
            (this.options = {
              debug: !1,
              initialOffset: 0,
              overscan: 1,
              paddingStart: 0,
              paddingEnd: 0,
              scrollPaddingStart: 0,
              scrollPaddingEnd: 0,
              horizontal: !1,
              getItemKey: Cn,
              rangeExtractor: wn,
              onChange: () => {},
              measureElement: kn,
              initialRect: { width: 0, height: 0 },
              scrollMargin: 0,
              gap: 0,
              indexAttribute: `data-index`,
              initialMeasurementsCache: [],
              lanes: 1,
              isScrollingResetDelay: 150,
              enabled: !0,
              isRtl: !1,
              useScrollendEvent: !1,
              useAnimationFrameWithResizeObserver: !1,
              laneAssignmentMode: `estimate`,
              ...e,
            }))
        }),
        (this.notify = (e) => {
          var t, n
          ;(n = (t = this.options).onChange) == null || n.call(t, this, e)
        }),
        (this.maybeNotify = vn(
          () => (this.calculateRange(), [this.isScrolling, this.range ? this.range.startIndex : null, this.range ? this.range.endIndex : null]),
          (e) => {
            this.notify(e)
          },
          {
            key: !1,
            debug: () => this.options.debug,
            initialDeps: [this.isScrolling, this.range ? this.range.startIndex : null, this.range ? this.range.endIndex : null],
          },
        )),
        (this.cleanup = () => {
          ;(this.unsubs.filter(Boolean).forEach((e) => e()),
            (this.unsubs = []),
            this.observer.disconnect(),
            this.rafId != null && this.targetWindow && (this.targetWindow.cancelAnimationFrame(this.rafId), (this.rafId = null)),
            (this.scrollState = null),
            (this.scrollElement = null),
            (this.targetWindow = null))
        }),
        (this._didMount = () => () => {
          this.cleanup()
        }),
        (this._willUpdate = () => {
          let e = this.options.enabled ? this.options.getScrollElement() : null
          if (this.scrollElement !== e) {
            if ((this.cleanup(), !e)) {
              this.maybeNotify()
              return
            }
            ;((this.scrollElement = e),
              this.scrollElement && `ownerDocument` in this.scrollElement
                ? (this.targetWindow = this.scrollElement.ownerDocument.defaultView)
                : (this.targetWindow = this.scrollElement?.window ?? null),
              this.elementsCache.forEach((e) => {
                this.observer.observe(e)
              }),
              this.unsubs.push(
                this.options.observeElementRect(this, (e) => {
                  ;((this.scrollRect = e), this.maybeNotify())
                }),
              ),
              this.unsubs.push(
                this.options.observeElementOffset(this, (e, t) => {
                  ;((this.scrollAdjustments = 0),
                    (this.scrollDirection = t ? (this.getScrollOffset() < e ? `forward` : `backward`) : null),
                    (this.scrollOffset = e),
                    (this.isScrolling = t),
                    this.scrollState && this.scheduleScrollReconcile(),
                    this.maybeNotify())
                }),
              ),
              this._scrollToOffset(this.getScrollOffset(), { adjustments: void 0, behavior: void 0 }))
          }
        }),
        (this.rafId = null),
        (this.getSize = () =>
          this.options.enabled
            ? ((this.scrollRect = this.scrollRect ?? this.options.initialRect), this.scrollRect[this.options.horizontal ? `width` : `height`])
            : ((this.scrollRect = null), 0)),
        (this.getScrollOffset = () =>
          this.options.enabled
            ? ((this.scrollOffset =
                this.scrollOffset ?? (typeof this.options.initialOffset == `function` ? this.options.initialOffset() : this.options.initialOffset)),
              this.scrollOffset)
            : ((this.scrollOffset = null), 0)),
        (this.getFurthestMeasurement = (e, t) => {
          let n = new Map(),
            r = new Map()
          for (let i = t - 1; i >= 0; i--) {
            let t = e[i]
            if (n.has(t.lane)) continue
            let a = r.get(t.lane)
            if ((a == null || t.end > a.end ? r.set(t.lane, t) : t.end < a.end && n.set(t.lane, !0), n.size === this.options.lanes)) break
          }
          return r.size === this.options.lanes ? Array.from(r.values()).sort((e, t) => (e.end === t.end ? e.index - t.index : e.end - t.end))[0] : void 0
        }),
        (this.getMeasurementOptions = vn(
          () => [
            this.options.count,
            this.options.paddingStart,
            this.options.scrollMargin,
            this.options.getItemKey,
            this.options.enabled,
            this.options.lanes,
            this.options.laneAssignmentMode,
          ],
          (e, t, n, r, i, a, o) => (
            this.prevLanes !== void 0 && this.prevLanes !== a && (this.lanesChangedFlag = !0),
            (this.prevLanes = a),
            (this.pendingMeasuredCacheIndexes = []),
            { count: e, paddingStart: t, scrollMargin: n, getItemKey: r, enabled: i, lanes: a, laneAssignmentMode: o }
          ),
          { key: !1 },
        )),
        (this.getMeasurements = vn(
          () => [this.getMeasurementOptions(), this.itemSizeCache],
          ({ count: e, paddingStart: t, scrollMargin: n, getItemKey: r, enabled: i, lanes: a, laneAssignmentMode: o }, s) => {
            if (!i) return ((this.measurementsCache = []), this.itemSizeCache.clear(), this.laneAssignments.clear(), [])
            if (this.laneAssignments.size > e) for (let t of this.laneAssignments.keys()) t >= e && this.laneAssignments.delete(t)
            ;(this.lanesChangedFlag &&
              ((this.lanesChangedFlag = !1),
              (this.lanesSettling = !0),
              (this.measurementsCache = []),
              this.itemSizeCache.clear(),
              this.laneAssignments.clear(),
              (this.pendingMeasuredCacheIndexes = [])),
              this.measurementsCache.length === 0 &&
                !this.lanesSettling &&
                ((this.measurementsCache = this.options.initialMeasurementsCache),
                this.measurementsCache.forEach((e) => {
                  this.itemSizeCache.set(e.key, e.size)
                })))
            let c = this.lanesSettling ? 0 : this.pendingMeasuredCacheIndexes.length > 0 ? Math.min(...this.pendingMeasuredCacheIndexes) : 0
            ;((this.pendingMeasuredCacheIndexes = []), this.lanesSettling && this.measurementsCache.length === e && (this.lanesSettling = !1))
            let l = this.measurementsCache.slice(0, c),
              u = Array(a).fill(void 0)
            for (let e = 0; e < c; e++) {
              let t = l[e]
              t && (u[t.lane] = e)
            }
            for (let i = c; i < e; i++) {
              let e = r(i),
                a = this.laneAssignments.get(i),
                c,
                d,
                f = o === `estimate` || s.has(e)
              if (a !== void 0 && this.options.lanes > 1) {
                c = a
                let e = u[c],
                  r = e === void 0 ? void 0 : l[e]
                d = r ? r.end + this.options.gap : t + n
              } else {
                let e = this.options.lanes === 1 ? l[i - 1] : this.getFurthestMeasurement(l, i)
                ;((d = e ? e.end + this.options.gap : t + n),
                  (c = e ? e.lane : i % this.options.lanes),
                  this.options.lanes > 1 && f && this.laneAssignments.set(i, c))
              }
              let p = s.get(e),
                m = typeof p == `number` ? p : this.options.estimateSize(i),
                h = d + m
              ;((l[i] = { index: i, start: d, size: m, end: h, key: e, lane: c }), (u[c] = i))
            }
            return ((this.measurementsCache = l), l)
          },
          { key: !1, debug: () => this.options.debug },
        )),
        (this.calculateRange = vn(
          () => [this.getMeasurements(), this.getSize(), this.getScrollOffset(), this.options.lanes],
          (e, t, n, r) => (this.range = e.length > 0 && t > 0 ? Nn({ measurements: e, outerSize: t, scrollOffset: n, lanes: r }) : null),
          { key: !1, debug: () => this.options.debug },
        )),
        (this.getVirtualIndexes = vn(
          () => {
            let e = null,
              t = null,
              n = this.calculateRange()
            return (
              n && ((e = n.startIndex), (t = n.endIndex)),
              this.maybeNotify.updateDeps([this.isScrolling, e, t]),
              [this.options.rangeExtractor, this.options.overscan, this.options.count, e, t]
            )
          },
          (e, t, n, r, i) => (r === null || i === null ? [] : e({ startIndex: r, endIndex: i, overscan: t, count: n })),
          { key: !1, debug: () => this.options.debug },
        )),
        (this.indexFromElement = (e) => {
          let t = this.options.indexAttribute,
            n = e.getAttribute(t)
          return n ? parseInt(n, 10) : (console.warn(`Missing attribute name '${t}={index}' on measured element.`), -1)
        }),
        (this.shouldMeasureDuringScroll = (e) => {
          if (!this.scrollState || this.scrollState.behavior !== `smooth`) return !0
          let t = this.scrollState.index ?? this.getVirtualItemForOffset(this.scrollState.lastTargetOffset)?.index
          if (t !== void 0 && this.range) {
            let n = Math.max(this.options.overscan, Math.ceil((this.range.endIndex - this.range.startIndex) / 2)),
              r = Math.max(0, t - n),
              i = Math.min(this.options.count - 1, t + n)
            return e >= r && e <= i
          }
          return !0
        }),
        (this.measureElement = (e) => {
          if (!e) {
            this.elementsCache.forEach((e, t) => {
              e.isConnected || (this.observer.unobserve(e), this.elementsCache.delete(t))
            })
            return
          }
          let t = this.indexFromElement(e),
            n = this.options.getItemKey(t),
            r = this.elementsCache.get(n)
          ;(r !== e && (r && this.observer.unobserve(r), this.observer.observe(e), this.elementsCache.set(n, e)),
            (!this.isScrolling || this.scrollState) && this.shouldMeasureDuringScroll(t) && this.resizeItem(t, this.options.measureElement(e, void 0, this)))
        }),
        (this.resizeItem = (e, t) => {
          let n = this.measurementsCache[e]
          if (!n) return
          let r = t - (this.itemSizeCache.get(n.key) ?? n.size)
          r !== 0 &&
            (this.scrollState?.behavior !== `smooth` &&
              (this.shouldAdjustScrollPositionOnItemSizeChange === void 0
                ? n.start < this.getScrollOffset() + this.scrollAdjustments
                : this.shouldAdjustScrollPositionOnItemSizeChange(n, r, this)) &&
              this._scrollToOffset(this.getScrollOffset(), { adjustments: (this.scrollAdjustments += r), behavior: void 0 }),
            this.pendingMeasuredCacheIndexes.push(n.index),
            (this.itemSizeCache = new Map(this.itemSizeCache.set(n.key, t))),
            this.notify(!1))
        }),
        (this.getVirtualItems = vn(
          () => [this.getVirtualIndexes(), this.getMeasurements()],
          (e, t) => {
            let n = []
            for (let r = 0, i = e.length; r < i; r++) {
              let i = t[e[r]]
              n.push(i)
            }
            return n
          },
          { key: !1, debug: () => this.options.debug },
        )),
        (this.getVirtualItemForOffset = (e) => {
          let t = this.getMeasurements()
          if (t.length !== 0) return yn(t[Mn(0, t.length - 1, (e) => yn(t[e]).start, e)])
        }),
        (this.getMaxScrollOffset = () => {
          if (!this.scrollElement) return 0
          if (`scrollHeight` in this.scrollElement)
            return this.options.horizontal
              ? this.scrollElement.scrollWidth - this.scrollElement.clientWidth
              : this.scrollElement.scrollHeight - this.scrollElement.clientHeight
          {
            let e = this.scrollElement.document.documentElement
            return this.options.horizontal ? e.scrollWidth - this.scrollElement.innerWidth : e.scrollHeight - this.scrollElement.innerHeight
          }
        }),
        (this.getOffsetForAlignment = (e, t, n = 0) => {
          if (!this.scrollElement) return 0
          let r = this.getSize(),
            i = this.getScrollOffset()
          ;(t === `auto` && (t = e >= i + r ? `end` : `start`), t === `center` ? (e += (n - r) / 2) : t === `end` && (e -= r))
          let a = this.getMaxScrollOffset()
          return Math.max(Math.min(a, e), 0)
        }),
        (this.getOffsetForIndex = (e, t = `auto`) => {
          e = Math.max(0, Math.min(e, this.options.count - 1))
          let n = this.getSize(),
            r = this.getScrollOffset(),
            i = this.measurementsCache[e]
          if (!i) return
          if (t === `auto`)
            if (i.end >= r + n - this.options.scrollPaddingEnd) t = `end`
            else if (i.start <= r + this.options.scrollPaddingStart) t = `start`
            else return [r, t]
          if (t === `end` && e === this.options.count - 1) return [this.getMaxScrollOffset(), t]
          let a = t === `end` ? i.end + this.options.scrollPaddingEnd : i.start - this.options.scrollPaddingStart
          return [this.getOffsetForAlignment(a, t, i.size), t]
        }),
        (this.scrollToOffset = (e, { align: t = `start`, behavior: n = `auto` } = {}) => {
          let r = this.getOffsetForAlignment(e, t),
            i = this.now()
          ;((this.scrollState = { index: null, align: t, behavior: n, startedAt: i, lastTargetOffset: r, stableFrames: 0 }),
            this._scrollToOffset(r, { adjustments: void 0, behavior: n }),
            this.scheduleScrollReconcile())
        }),
        (this.scrollToIndex = (e, { align: t = `auto`, behavior: n = `auto` } = {}) => {
          e = Math.max(0, Math.min(e, this.options.count - 1))
          let r = this.getOffsetForIndex(e, t)
          if (!r) return
          let [i, a] = r,
            o = this.now()
          ;((this.scrollState = { index: e, align: a, behavior: n, startedAt: o, lastTargetOffset: i, stableFrames: 0 }),
            this._scrollToOffset(i, { adjustments: void 0, behavior: n }),
            this.scheduleScrollReconcile())
        }),
        (this.scrollBy = (e, { behavior: t = `auto` } = {}) => {
          let n = this.getScrollOffset() + e,
            r = this.now()
          ;((this.scrollState = { index: null, align: `start`, behavior: t, startedAt: r, lastTargetOffset: n, stableFrames: 0 }),
            this._scrollToOffset(n, { adjustments: void 0, behavior: t }),
            this.scheduleScrollReconcile())
        }),
        (this.getTotalSize = () => {
          let e = this.getMeasurements(),
            t
          if (e.length === 0) t = this.options.paddingStart
          else if (this.options.lanes === 1) t = e[e.length - 1]?.end ?? 0
          else {
            let n = Array(this.options.lanes).fill(null),
              r = e.length - 1
            for (; r >= 0 && n.some((e) => e === null); ) {
              let t = e[r]
              ;(n[t.lane] === null && (n[t.lane] = t.end), r--)
            }
            t = Math.max(...n.filter((e) => e !== null))
          }
          return Math.max(t - this.options.scrollMargin + this.options.paddingEnd, 0)
        }),
        (this._scrollToOffset = (e, { adjustments: t, behavior: n }) => {
          this.options.scrollToFn(e, { behavior: n, adjustments: t }, this)
        }),
        (this.measure = () => {
          ;((this.itemSizeCache = new Map()), (this.laneAssignments = new Map()), this.notify(!1))
        }),
        this.setOptions(e))
    }
    scheduleScrollReconcile() {
      if (!this.targetWindow) {
        this.scrollState = null
        return
      }
      this.rafId ??= this.targetWindow.requestAnimationFrame(() => {
        ;((this.rafId = null), this.reconcileScroll())
      })
    }
    reconcileScroll() {
      if (!this.scrollState || !this.scrollElement) return
      if (this.now() - this.scrollState.startedAt > 5e3) {
        this.scrollState = null
        return
      }
      let e = this.scrollState.index == null ? void 0 : this.getOffsetForIndex(this.scrollState.index, this.scrollState.align),
        t = e ? e[0] : this.scrollState.lastTargetOffset,
        n = t !== this.scrollState.lastTargetOffset
      if (!n && bn(t, this.getScrollOffset())) {
        if ((this.scrollState.stableFrames++, this.scrollState.stableFrames >= 1)) {
          this.scrollState = null
          return
        }
      } else
        ((this.scrollState.stableFrames = 0),
          n &&
            ((this.scrollState.lastTargetOffset = t), (this.scrollState.behavior = `auto`), this._scrollToOffset(t, { adjustments: void 0, behavior: `auto` })))
      this.scheduleScrollReconcile()
    }
  },
  Mn = (e, t, n, r) => {
    for (; e <= t; ) {
      let i = ((e + t) / 2) | 0,
        a = n(i)
      if (a < r) e = i + 1
      else if (a > r) t = i - 1
      else return i
    }
    return e > 0 ? e - 1 : 0
  }
function Nn({ measurements: e, outerSize: t, scrollOffset: n, lanes: r }) {
  let i = e.length - 1,
    a = (t) => e[t].start
  if (e.length <= r) return { startIndex: 0, endIndex: i }
  let o = Mn(0, i, a, n),
    s = o
  if (r === 1) for (; s < i && e[s].end < n + t; ) s++
  else if (r > 1) {
    let a = Array(r).fill(0)
    for (; s < i && a.some((e) => e < n + t); ) {
      let t = e[s]
      ;((a[t.lane] = t.end), s++)
    }
    let c = Array(r).fill(n + t)
    for (; o >= 0 && c.some((e) => e >= n); ) {
      let t = e[o]
      ;((c[t.lane] = t.start), o--)
    }
    ;((o = Math.max(0, o - (o % r))), (s = Math.min(i, s + (r - 1 - (s % r)))))
  }
  return { startIndex: o, endIndex: s }
}
var Pn = typeof document < `u` ? H.useLayoutEffect : H.useEffect
function Fn({ useFlushSync: e = !0, ...t }) {
  let n = H.useReducer(() => ({}), {})[1],
    r = {
      ...t,
      onChange: (r, i) => {
        var a
        ;(e && i ? (0, _n.flushSync)(n) : n(), (a = t.onChange) == null || a.call(t, r, i))
      },
    },
    [i] = H.useState(() => new jn(r))
  return (i.setOptions(r), Pn(() => i._didMount(), []), Pn(() => i._willUpdate()), i)
}
function In(e) {
  return Fn({ observeElementRect: Tn, observeElementOffset: On, scrollToFn: An, ...e })
}
var $ = n(),
  Ln = [`Body Cell`, `Body Cell A`, `Body Cell B`, `Body Cell C`]
function Rn({ column: e }) {
  let [t, n] = (0, H.useState)(!1),
    [r, i] = (0, H.useState)(e.getFilterValue() ?? []),
    a = e.getIsFiltered()
  return (0, $.jsx)(pe, {
    content: (0, $.jsxs)(`div`, {
      onClick: (e) => e.stopPropagation(),
      style: { minWidth: 160, padding: 4 },
      children: [
        (0, $.jsx)(W.Group, {
          value: r,
          onChange: (e) => i(e),
          options: Ln.map((e) => ({ label: e, value: e })),
          style: { display: `flex`, flexDirection: `column`, gap: 4 },
        }),
        (0, $.jsxs)(B, {
          justify: `space-between`,
          gap: 8,
          style: { marginTop: 8, paddingTop: 6, borderTop: `1px solid #f0f0f0` },
          children: [
            (0, $.jsx)(k, {
              size: `small`,
              onClick: () => {
                ;(i([]), e.setFilterValue(void 0), n(!1))
              },
              children: `Reset`,
            }),
            (0, $.jsx)(k, {
              size: `small`,
              type: `primary`,
              onClick: () => {
                ;(e.setFilterValue(r.length === 0 ? void 0 : r), n(!1))
              },
              children: `OK`,
            }),
          ],
        }),
      ],
    }),
    open: t,
    onOpenChange: (t) => {
      ;(t && i((e.getFilterValue() ?? []).slice()), n(t))
    },
    trigger: `click`,
    placement: `bottomRight`,
    destroyOnHidden: !0,
    children: (0, $.jsx)(`span`, {
      onClick: (e) => e.stopPropagation(),
      style: { display: `inline-flex`, cursor: `pointer`, padding: 2, borderRadius: 2 },
      children: (0, $.jsx)(P, {
        title: `Filter`,
        children: (0, $.jsx)(`span`, {
          style: { display: `inline-flex`, fontSize: 12, color: a ? `#3F51B5` : `#bfbfbf` },
          children: (0, $.jsx)(a ? Re : qe, {}),
        }),
      }),
    }),
  })
}
function zn({ table: e }) {
  let [t, n] = (0, H.useState)(``),
    r = e.getAllLeafColumns(),
    i = r.filter((e) => e.getIsVisible()).length,
    a = r.filter((e) =>
      t
        ? String(e.columnDef.header ?? e.id)
            .toLowerCase()
            .includes(t.toLowerCase())
        : !0,
    ),
    o = (e) => {
      r.forEach((t) => t.toggleVisibility(e))
    }
  return (0, $.jsxs)(`div`, {
    style: { width: 240, padding: 4 },
    children: [
      (0, $.jsx)(be, {
        size: `small`,
        placeholder: `Search columns`,
        value: t,
        onChange: (e) => n(e.target.value),
        prefix: (0, $.jsx)(oe, { style: { color: `#8c8c8c` } }),
        allowClear: !0,
        style: { marginBottom: 6 },
      }),
      (0, $.jsxs)(B, {
        justify: `space-between`,
        gap: 8,
        style: { marginBottom: 6, fontSize: 12, color: `#8c8c8c` },
        children: [
          (0, $.jsxs)(`span`, { children: [i, ` / `, r.length, ` visible`] }),
          (0, $.jsxs)(B, {
            gap: 6,
            children: [(0, $.jsx)(`a`, { onClick: () => o(!0), children: `All` }), (0, $.jsx)(`a`, { onClick: () => o(!1), children: `None` })],
          }),
        ],
      }),
      (0, $.jsx)(`div`, {
        style: { maxHeight: 320, overflow: `auto` },
        children: (0, $.jsx)(B, {
          vertical: !0,
          gap: 4,
          children: a.map((e) =>
            (0, $.jsx)(
              W,
              { checked: e.getIsVisible(), onChange: (t) => e.toggleVisibility(t.target.checked), children: String(e.columnDef.header ?? e.id) },
              e.id,
            ),
          ),
        }),
      }),
    ],
  })
}
var Bn = (0, H.memo)(function ({ table: e }) {
    return (0, $.jsx)(pe, {
      content: (0, $.jsx)(zn, { table: e }),
      trigger: `click`,
      placement: `bottomRight`,
      destroyOnHidden: !0,
      children: (0, $.jsx)(k, { size: `small`, type: `text`, icon: (0, $.jsx)(Xe, {}), title: `Toggle columns` }),
    })
  }),
  Vn = 36,
  Hn = 32,
  Un = 48,
  Wn = 56,
  Gn = 160,
  Kn = 20,
  qn = 10,
  Jn = { high: 10, low: 5 },
  Yn = { high: `rgba(244, 67, 54, 0.16)`, mid: `rgba(76, 175, 80, 0.16)`, low: `rgba(0, 150, 136, 0.16)` },
  Xn = (e, t, n) => {
    if (!Array.isArray(n) || n.length === 0) return !0
    let r = String(e.getValue(t) ?? ``)
    return n.some((e) => r.startsWith(e))
  }
function Zn(e, t, n) {
  return e > t.high ? n.high : e >= t.low ? n.mid : n.low
}
function Qn({
  data: e,
  columns: t,
  rowKey: n,
  selectedKeys: r,
  onSelectionChange: i,
  renderCell: a,
  numberBuckets: o = Jn,
  numberColors: s = Yn,
  defaultColumnWidth: c = Gn,
  rowHeight: l = Hn,
  headerHeight: u = Vn,
  showColumnToggle: d = !0,
  showColumnFilter: f = !0,
  showRowNumber: p = !1,
}) {
  let m = (0, H.useRef)(null),
    [h, g] = (0, H.useState)([]),
    [_, v] = (0, H.useState)({}),
    [y, b] = (0, H.useState)([]),
    x = (0, H.useMemo)(() => {
      let e = {}
      if (r) for (let t of r) e[String(t)] = !0
      return e
    }, [r]),
    S = (0, H.useMemo)(
      () =>
        t.map((e) => ({
          id: e.key,
          accessorFn: e.accessor,
          header: e.title,
          enableSorting: e.sortable !== !1,
          enableColumnFilter: f,
          filterFn: Xn,
          size: e.width ?? c,
          meta: { kind: e.kind ?? `string`, render: e.render, align: e.align },
        })),
      [t, c, f],
    ),
    C = (0, H.useCallback)(
      (e) => {
        if (!i) return
        let t = typeof e == `function` ? e(x) : e,
          n = []
        for (let [e, r] of Object.entries(t)) r && n.push(e)
        i(n)
      },
      [x, i],
    ),
    w = gn({
      data: e,
      columns: S,
      state: { rowSelection: x, sorting: y, columnFilters: h, columnVisibility: _ },
      onSortingChange: b,
      onColumnFiltersChange: g,
      onColumnVisibilityChange: v,
      onRowSelectionChange: C,
      getRowId: (e) => String(n(e)),
      enableRowSelection: !!i,
      getCoreRowModel: on(),
      getSortedRowModel: dn(),
      getFilteredRowModel: un(),
    }),
    T = w.getRowModel().rows,
    E = w.getVisibleLeafColumns(),
    D = In({ count: T.length, getScrollElement: () => m.current, estimateSize: () => l, overscan: Kn }),
    O = In({ count: E.length, getScrollElement: () => m.current, estimateSize: () => c, horizontal: !0, overscan: qn }),
    k = D.getTotalSize(),
    A = O.getTotalSize(),
    j = D.getVirtualItems(),
    ee = O.getVirtualItems(),
    te = T.length > 0 && T.every((e) => x[e.id]),
    ne = T.some((e) => x[e.id]) && !te,
    re = (0, H.useCallback)(
      (e) => {
        i && i(e ? T.map((e) => e.id) : [])
      },
      [T, i],
    ),
    M = !!i,
    ie = M ? Un : 0,
    N = p ? Wn : 0,
    P = ie + N
  return (0, $.jsxs)(`div`, {
    style: { position: `relative`, height: `100%`, width: `100%` },
    children: [
      d &&
        (0, $.jsx)(`div`, {
          style: { position: `absolute`, top: 2, right: 16, zIndex: 10, background: `#fafafa`, borderRadius: 4, boxShadow: `0 1px 2px rgba(0,0,0,0.06)` },
          children: (0, $.jsx)(Bn, { table: w }),
        }),
      (0, $.jsx)(`div`, {
        ref: m,
        className: `ax-ct-scroll`,
        style: { position: `relative`, height: `100%`, width: `100%`, overflow: `auto`, background: `#fff` },
        children: (0, $.jsxs)(`div`, {
          style: {
            position: `relative`,
            width: P + A,
            height: u + k,
            backgroundImage: `repeating-linear-gradient(
              to bottom,
              #ffffff 0,
              #ffffff ${l}px,
              #f4f4f4 ${l}px,
              #f4f4f4 ${2 * l}px
            )`,
            backgroundPosition: `0 ${u}px`,
            backgroundRepeat: `repeat`,
          },
          children: [
            (0, $.jsxs)(`div`, {
              className: `ax-ct-header`,
              style: { position: `sticky`, top: 0, height: u, zIndex: 3, width: P + A, background: `#fafafa`, borderBottom: `1px solid #f0f0f0` },
              children: [
                p &&
                  (0, $.jsx)(`div`, {
                    style: {
                      position: `sticky`,
                      left: 0,
                      top: 0,
                      width: Wn,
                      height: u,
                      display: `inline-flex`,
                      verticalAlign: `top`,
                      background: `#fafafa`,
                      zIndex: 4,
                      borderRight: `1px solid #f0f0f0`,
                    },
                  }),
                M &&
                  (0, $.jsx)(`div`, {
                    style: {
                      position: `sticky`,
                      left: N,
                      top: 0,
                      width: Un,
                      height: u,
                      display: `inline-flex`,
                      verticalAlign: `top`,
                      alignItems: `center`,
                      justifyContent: `center`,
                      background: `#fafafa`,
                      zIndex: 4,
                      borderRight: `1px solid #f0f0f0`,
                    },
                    children: (0, $.jsx)(W, { checked: te, indeterminate: ne, onChange: (e) => re(e.target.checked) }),
                  }),
                ee.map((e) => {
                  let t = E[e.index],
                    n = t.getIsSorted()
                  return (0, $.jsxs)(
                    `div`,
                    {
                      style: { position: `absolute`, left: P + e.start, top: 0, width: e.size, height: u, ...$n },
                      onClick: t.getCanSort() ? t.getToggleSortingHandler() : void 0,
                      children: [
                        (0, $.jsx)(`span`, {
                          style: { overflow: `hidden`, textOverflow: `ellipsis`, whiteSpace: `nowrap` },
                          children: fn(t.columnDef.header, { column: t, header: t, table: w }),
                        }),
                        (0, $.jsxs)(`span`, {
                          style: { display: `inline-flex`, alignItems: `center`, gap: 2, color: `#bfbfbf`, fontSize: 12 },
                          children: [
                            n === `asc` && (0, $.jsx)(We, { style: { color: `#3F51B5` } }),
                            n === `desc` && (0, $.jsx)(Ve, { style: { color: `#3F51B5` } }),
                            !n && t.getCanSort() && (0, $.jsx)(Fe, { rotate: 90 }),
                            f && (0, $.jsx)(Rn, { column: t }),
                          ],
                        }),
                      ],
                    },
                    t.id,
                  )
                }),
              ],
            }),
            j.map((e) => {
              let t = T[e.index],
                n = x[t.id] === !0
              return (0, $.jsx)(
                er,
                {
                  top: u + e.start,
                  height: e.size,
                  totalWidth: P + A,
                  showSelection: M,
                  showRowNumber: p,
                  rowNumber: e.index + 1,
                  rowNumW: N,
                  isSelected: n,
                  onToggle: (e) => t.toggleSelected(e),
                  virtualCols: ee.map((e) => {
                    let n = E[e.index],
                      r = t.getValue(n.id),
                      i = n.columnDef.meta,
                      a = i?.kind ?? `string`,
                      c = a === `number` && typeof r == `number` ? Zn(r, o, s) : void 0,
                      l = i?.render ? i.render(r, t.original) : void 0
                    return { key: n.id, left: P + e.start, width: e.size, value: r, kind: a, background: c, rendered: l, align: i?.align }
                  }),
                  renderCell: a,
                },
                t.id,
              )
            }),
          ],
        }),
      }),
    ],
  })
}
var $n = {
    display: `flex`,
    alignItems: `center`,
    justifyContent: `space-between`,
    padding: `0 8px`,
    fontWeight: 500,
    fontSize: 13,
    cursor: `pointer`,
    borderRight: `1px solid #f0f0f0`,
    userSelect: `none`,
  },
  er = (0, H.memo)(function ({
    top: e,
    height: t,
    totalWidth: n,
    showSelection: r,
    showRowNumber: i,
    rowNumber: a,
    rowNumW: o,
    isSelected: s,
    onToggle: c,
    virtualCols: l,
    renderCell: u,
  }) {
    return (0, $.jsxs)(`div`, {
      style: { position: `absolute`, top: e, left: 0, width: n, height: t },
      children: [
        i &&
          (0, $.jsx)(`div`, {
            style: {
              position: `sticky`,
              left: 0,
              width: Wn,
              height: t,
              display: `inline-flex`,
              verticalAlign: `top`,
              alignItems: `center`,
              justifyContent: `center`,
              background: s ? `#e6f4ff` : `#fff`,
              zIndex: 1,
              borderBottom: `1px solid #f0f0f0`,
              borderRight: `1px solid #f0f0f0`,
              fontSize: 12,
              color: `#8c8c8c`,
              fontVariantNumeric: `tabular-nums`,
            },
            children: a,
          }),
        r &&
          (0, $.jsx)(`div`, {
            style: {
              position: `sticky`,
              left: o,
              width: Un,
              height: t,
              display: `inline-flex`,
              verticalAlign: `top`,
              alignItems: `center`,
              justifyContent: `center`,
              background: s ? `#e6f4ff` : `#fff`,
              zIndex: 1,
              borderBottom: `1px solid #f0f0f0`,
              borderRight: `1px solid #f0f0f0`,
            },
            children: (0, $.jsx)(W, { checked: s, onChange: (e) => c(e.target.checked) }),
          }),
        l.map((e) => {
          let n = s ? `#e6f4ff` : `#fff`,
            r = e.background ?? n,
            i = e.kind === `number`,
            a = e.align ?? (i ? `right` : `left`),
            o = a === `right` ? `flex-end` : a === `center` ? `center` : `flex-start`,
            c = e.rendered === void 0 ? (i ? String(e.value) : u ? u(String(e.value)) : String(e.value)) : e.rendered
          return (0, $.jsx)(
            `div`,
            {
              style: {
                position: `absolute`,
                left: e.left,
                top: 0,
                width: e.width,
                height: t,
                display: `flex`,
                alignItems: `center`,
                justifyContent: o,
                padding: `0 12px`,
                background: r,
                borderBottom: `1px solid #f0f0f0`,
                borderRight: `1px solid #f5f5f5`,
                fontSize: 13,
                fontVariantNumeric: i ? `tabular-nums` : void 0,
                fontWeight: i ? 500 : void 0,
              },
              children: c,
            },
            e.key,
          )
        }),
      ],
    })
  })
export { Me as n, W as r, Qn as t }
