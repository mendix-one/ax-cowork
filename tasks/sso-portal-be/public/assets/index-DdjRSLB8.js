function __vite__mapDeps(indexes) {
  if (!__vite__mapDeps.viteFileDeps) {
    __vite__mapDeps.viteFileDeps = []
  }
  return indexes.map(i => __vite__mapDeps.viteFileDeps[i])
}
;(function () {
  const t = document.createElement('link').relList
  if (t && t.supports && t.supports('modulepreload')) return
  for (const r of document.querySelectorAll('link[rel="modulepreload"]')) s(r)
  new MutationObserver(r => {
    for (const o of r)
      if (o.type === 'childList')
        for (const a of o.addedNodes) a.tagName === 'LINK' && a.rel === 'modulepreload' && s(a)
  }).observe(document, { childList: !0, subtree: !0 })
  function n(r) {
    const o = {}
    return (
      r.integrity && (o.integrity = r.integrity),
      r.referrerPolicy && (o.referrerPolicy = r.referrerPolicy),
      r.crossOrigin === 'use-credentials'
        ? (o.credentials = 'include')
        : r.crossOrigin === 'anonymous'
          ? (o.credentials = 'omit')
          : (o.credentials = 'same-origin'),
      o
    )
  }
  function s(r) {
    if (r.ep) return
    r.ep = !0
    const o = n(r)
    fetch(r.href, o)
  }
})()
/**
 * @vue/shared v3.4.21
 * (c) 2018-present Yuxi (Evan) You and Vue contributors
 * @license MIT
 **/ function El(e, t) {
  const n = new Set(e.split(','))
  return t ? s => n.has(s.toLowerCase()) : s => n.has(s)
}
const ot = {},
  js = [],
  tn = () => {},
  Zg = () => !1,
  ma = e => e.charCodeAt(0) === 111 && e.charCodeAt(1) === 110 && (e.charCodeAt(2) > 122 || e.charCodeAt(2) < 97),
  _l = e => e.startsWith('onUpdate:'),
  pt = Object.assign,
  yl = (e, t) => {
    const n = e.indexOf(t)
    n > -1 && e.splice(n, 1)
  },
  ep = Object.prototype.hasOwnProperty,
  He = (e, t) => ep.call(e, t),
  ve = Array.isArray,
  Ys = e => ha(e) === '[object Map]',
  Sf = e => ha(e) === '[object Set]',
  Ce = e => typeof e == 'function',
  ft = e => typeof e == 'string',
  ir = e => typeof e == 'symbol',
  rt = e => e !== null && typeof e == 'object',
  Rf = e => (rt(e) || Ce(e)) && Ce(e.then) && Ce(e.catch),
  Of = Object.prototype.toString,
  ha = e => Of.call(e),
  tp = e => ha(e).slice(8, -1),
  Cf = e => ha(e) === '[object Object]',
  vl = e => ft(e) && e !== 'NaN' && e[0] !== '-' && '' + parseInt(e, 10) === e,
  Ar = El(
    ',key,ref,ref_for,ref_key,onVnodeBeforeMount,onVnodeMounted,onVnodeBeforeUpdate,onVnodeUpdated,onVnodeBeforeUnmount,onVnodeUnmounted'
  ),
  ga = e => {
    const t = Object.create(null)
    return n => t[n] || (t[n] = e(n))
  },
  np = /-(\w)/g,
  on = ga(e => e.replace(np, (t, n) => (n ? n.toUpperCase() : ''))),
  sp = /\B([A-Z])/g,
  lr = ga(e => e.replace(sp, '-$1').toLowerCase()),
  ur = ga(e => e.charAt(0).toUpperCase() + e.slice(1)),
  Ka = ga(e => (e ? `on${ur(e)}` : '')),
  rs = (e, t) => !Object.is(e, t),
  qa = (e, t) => {
    for (let n = 0; n < e.length; n++) e[n](t)
  },
  Wo = (e, t, n) => {
    Object.defineProperty(e, t, { configurable: !0, enumerable: !1, value: n })
  },
  rp = e => {
    const t = parseFloat(e)
    return isNaN(t) ? e : t
  },
  op = e => {
    const t = ft(e) ? Number(e) : NaN
    return isNaN(t) ? e : t
  }
let Au
const Af = () =>
  Au ||
  (Au =
    typeof globalThis < 'u'
      ? globalThis
      : typeof self < 'u'
        ? self
        : typeof window < 'u'
          ? window
          : typeof global < 'u'
            ? global
            : {})
function bl(e) {
  if (ve(e)) {
    const t = {}
    for (let n = 0; n < e.length; n++) {
      const s = e[n],
        r = ft(s) ? up(s) : bl(s)
      if (r) for (const o in r) t[o] = r[o]
    }
    return t
  } else if (ft(e) || rt(e)) return e
}
const ap = /;(?![^(]*\))/g,
  ip = /:([^]+)/,
  lp = /\/\*[^]*?\*\//g
function up(e) {
  const t = {}
  return (
    e
      .replace(lp, '')
      .split(ap)
      .forEach(n => {
        if (n) {
          const s = n.split(ip)
          s.length > 1 && (t[s[0].trim()] = s[1].trim())
        }
      }),
    t
  )
}
function Sl(e) {
  let t = ''
  if (ft(e)) t = e
  else if (ve(e))
    for (let n = 0; n < e.length; n++) {
      const s = Sl(e[n])
      s && (t += s + ' ')
    }
  else if (rt(e)) for (const n in e) e[n] && (t += n + ' ')
  return t.trim()
}
const cp = 'itemscope,allowfullscreen,formnovalidate,ismap,nomodule,novalidate,readonly',
  dp = El(cp)
function If(e) {
  return !!e || e === ''
}
const S = e =>
    ft(e)
      ? e
      : e == null
        ? ''
        : ve(e) || (rt(e) && (e.toString === Of || !Ce(e.toString)))
          ? JSON.stringify(e, Tf, 2)
          : String(e),
  Tf = (e, t) =>
    t && t.__v_isRef
      ? Tf(e, t.value)
      : Ys(t)
        ? { [`Map(${t.size})`]: [...t.entries()].reduce((n, [s, r], o) => ((n[za(s, o) + ' =>'] = r), n), {}) }
        : Sf(t)
          ? { [`Set(${t.size})`]: [...t.values()].map(n => za(n)) }
          : ir(t)
            ? za(t)
            : rt(t) && !ve(t) && !Cf(t)
              ? String(t)
              : t,
  za = (e, t = '') => {
    var n
    return ir(e) ? `Symbol(${(n = e.description) != null ? n : t})` : e
  }
/**
 * @vue/reactivity v3.4.21
 * (c) 2018-present Yuxi (Evan) You and Vue contributors
 * @license MIT
 **/ let qt
class Nf {
  constructor(t = !1) {
    ;((this.detached = t),
      (this._active = !0),
      (this.effects = []),
      (this.cleanups = []),
      (this.parent = qt),
      !t && qt && (this.index = (qt.scopes || (qt.scopes = [])).push(this) - 1))
  }
  get active() {
    return this._active
  }
  run(t) {
    if (this._active) {
      const n = qt
      try {
        return ((qt = this), t())
      } finally {
        qt = n
      }
    }
  }
  on() {
    qt = this
  }
  off() {
    qt = this.parent
  }
  stop(t) {
    if (this._active) {
      let n, s
      for (n = 0, s = this.effects.length; n < s; n++) this.effects[n].stop()
      for (n = 0, s = this.cleanups.length; n < s; n++) this.cleanups[n]()
      if (this.scopes) for (n = 0, s = this.scopes.length; n < s; n++) this.scopes[n].stop(!0)
      if (!this.detached && this.parent && !t) {
        const r = this.parent.scopes.pop()
        r && r !== this && ((this.parent.scopes[this.index] = r), (r.index = this.index))
      }
      ;((this.parent = void 0), (this._active = !1))
    }
  }
}
function cr(e) {
  return new Nf(e)
}
function fp(e, t = qt) {
  t && t.active && t.effects.push(e)
}
function wf() {
  return qt
}
function Ht(e) {
  qt && qt.cleanups.push(e)
}
let Ss
class Rl {
  constructor(t, n, s, r) {
    ;((this.fn = t),
      (this.trigger = n),
      (this.scheduler = s),
      (this.active = !0),
      (this.deps = []),
      (this._dirtyLevel = 4),
      (this._trackId = 0),
      (this._runnings = 0),
      (this._shouldSchedule = !1),
      (this._depsLength = 0),
      fp(this, r))
  }
  get dirty() {
    if (this._dirtyLevel === 2 || this._dirtyLevel === 3) {
      ;((this._dirtyLevel = 1), Ts())
      for (let t = 0; t < this._depsLength; t++) {
        const n = this.deps[t]
        if (n.computed && (mp(n.computed), this._dirtyLevel >= 4)) break
      }
      ;(this._dirtyLevel === 1 && (this._dirtyLevel = 0), Ns())
    }
    return this._dirtyLevel >= 4
  }
  set dirty(t) {
    this._dirtyLevel = t ? 4 : 0
  }
  run() {
    if (((this._dirtyLevel = 0), !this.active)) return this.fn()
    let t = es,
      n = Ss
    try {
      return ((es = !0), (Ss = this), this._runnings++, Iu(this), this.fn())
    } finally {
      ;(Tu(this), this._runnings--, (Ss = n), (es = t))
    }
  }
  stop() {
    var t
    this.active && (Iu(this), Tu(this), (t = this.onStop) == null || t.call(this), (this.active = !1))
  }
}
function mp(e) {
  return e.value
}
function Iu(e) {
  ;(e._trackId++, (e._depsLength = 0))
}
function Tu(e) {
  if (e.deps.length > e._depsLength) {
    for (let t = e._depsLength; t < e.deps.length; t++) Lf(e.deps[t], e)
    e.deps.length = e._depsLength
  }
}
function Lf(e, t) {
  const n = e.get(t)
  n !== void 0 && t._trackId !== n && (e.delete(t), e.size === 0 && e.cleanup())
}
let es = !0,
  Ri = 0
const Pf = []
function Ts() {
  ;(Pf.push(es), (es = !1))
}
function Ns() {
  const e = Pf.pop()
  es = e === void 0 ? !0 : e
}
function Ol() {
  Ri++
}
function Cl() {
  for (Ri--; !Ri && Oi.length; ) Oi.shift()()
}
function $f(e, t, n) {
  if (t.get(e) !== e._trackId) {
    t.set(e, e._trackId)
    const s = e.deps[e._depsLength]
    s !== t ? (s && Lf(s, e), (e.deps[e._depsLength++] = t)) : e._depsLength++
  }
}
const Oi = []
function Mf(e, t, n) {
  Ol()
  for (const s of e.keys()) {
    let r
    ;(s._dirtyLevel < t &&
      (r ?? (r = e.get(s) === s._trackId)) &&
      (s._shouldSchedule || (s._shouldSchedule = s._dirtyLevel === 0), (s._dirtyLevel = t)),
      s._shouldSchedule &&
        (r ?? (r = e.get(s) === s._trackId)) &&
        (s.trigger(),
        (!s._runnings || s.allowRecurse) &&
          s._dirtyLevel !== 2 &&
          ((s._shouldSchedule = !1), s.scheduler && Oi.push(s.scheduler))))
  }
  Cl()
}
const kf = (e, t) => {
    const n = new Map()
    return ((n.cleanup = e), (n.computed = t), n)
  },
  Ho = new WeakMap(),
  Rs = Symbol(''),
  Ci = Symbol('')
function Gt(e, t, n) {
  if (es && Ss) {
    let s = Ho.get(e)
    s || Ho.set(e, (s = new Map()))
    let r = s.get(n)
    ;(r || s.set(n, (r = kf(() => s.delete(n)))), $f(Ss, r))
  }
}
function $n(e, t, n, s, r, o) {
  const a = Ho.get(e)
  if (!a) return
  let i = []
  if (t === 'clear') i = [...a.values()]
  else if (n === 'length' && ve(e)) {
    const u = Number(s)
    a.forEach((c, d) => {
      ;(d === 'length' || (!ir(d) && d >= u)) && i.push(c)
    })
  } else
    switch ((n !== void 0 && i.push(a.get(n)), t)) {
      case 'add':
        ve(e) ? vl(n) && i.push(a.get('length')) : (i.push(a.get(Rs)), Ys(e) && i.push(a.get(Ci)))
        break
      case 'delete':
        ve(e) || (i.push(a.get(Rs)), Ys(e) && i.push(a.get(Ci)))
        break
      case 'set':
        Ys(e) && i.push(a.get(Rs))
        break
    }
  Ol()
  for (const u of i) u && Mf(u, 4)
  Cl()
}
function hp(e, t) {
  var n
  return (n = Ho.get(e)) == null ? void 0 : n.get(t)
}
const gp = El('__proto__,__v_isRef,__isVue'),
  Df = new Set(
    Object.getOwnPropertyNames(Symbol)
      .filter(e => e !== 'arguments' && e !== 'caller')
      .map(e => Symbol[e])
      .filter(ir)
  ),
  Nu = pp()
function pp() {
  const e = {}
  return (
    ['includes', 'indexOf', 'lastIndexOf'].forEach(t => {
      e[t] = function (...n) {
        const s = Me(this)
        for (let o = 0, a = this.length; o < a; o++) Gt(s, 'get', o + '')
        const r = s[t](...n)
        return r === -1 || r === !1 ? s[t](...n.map(Me)) : r
      }
    }),
    ['push', 'pop', 'shift', 'unshift', 'splice'].forEach(t => {
      e[t] = function (...n) {
        ;(Ts(), Ol())
        const s = Me(this)[t].apply(this, n)
        return (Cl(), Ns(), s)
      }
    }),
    e
  )
}
function Ep(e) {
  const t = Me(this)
  return (Gt(t, 'has', e), t.hasOwnProperty(e))
}
class Ff {
  constructor(t = !1, n = !1) {
    ;((this._isReadonly = t), (this._isShallow = n))
  }
  get(t, n, s) {
    const r = this._isReadonly,
      o = this._isShallow
    if (n === '__v_isReactive') return !r
    if (n === '__v_isReadonly') return r
    if (n === '__v_isShallow') return o
    if (n === '__v_raw')
      return s === (r ? (o ? wp : Uf) : o ? Bf : xf).get(t) || Object.getPrototypeOf(t) === Object.getPrototypeOf(s)
        ? t
        : void 0
    const a = ve(t)
    if (!r) {
      if (a && He(Nu, n)) return Reflect.get(Nu, n, s)
      if (n === 'hasOwnProperty') return Ep
    }
    const i = Reflect.get(t, n, s)
    return (ir(n) ? Df.has(n) : gp(n)) || (r || Gt(t, 'get', n), o)
      ? i
      : nt(i)
        ? a && vl(n)
          ? i
          : i.value
        : rt(i)
          ? r
            ? so(i)
            : At(i)
          : i
  }
}
class Vf extends Ff {
  constructor(t = !1) {
    super(!1, t)
  }
  set(t, n, s, r) {
    let o = t[n]
    if (!this._isShallow) {
      const u = Js(o)
      if ((!jo(s) && !Js(s) && ((o = Me(o)), (s = Me(s))), !ve(t) && nt(o) && !nt(s)))
        return u ? !1 : ((o.value = s), !0)
    }
    const a = ve(t) && vl(n) ? Number(n) < t.length : He(t, n),
      i = Reflect.set(t, n, s, r)
    return (t === Me(r) && (a ? rs(s, o) && $n(t, 'set', n, s) : $n(t, 'add', n, s)), i)
  }
  deleteProperty(t, n) {
    const s = He(t, n)
    t[n]
    const r = Reflect.deleteProperty(t, n)
    return (r && s && $n(t, 'delete', n, void 0), r)
  }
  has(t, n) {
    const s = Reflect.has(t, n)
    return ((!ir(n) || !Df.has(n)) && Gt(t, 'has', n), s)
  }
  ownKeys(t) {
    return (Gt(t, 'iterate', ve(t) ? 'length' : Rs), Reflect.ownKeys(t))
  }
}
class _p extends Ff {
  constructor(t = !1) {
    super(!0, t)
  }
  set(t, n) {
    return !0
  }
  deleteProperty(t, n) {
    return !0
  }
}
const yp = new Vf(),
  vp = new _p(),
  bp = new Vf(!0),
  Al = e => e,
  pa = e => Reflect.getPrototypeOf(e)
function _o(e, t, n = !1, s = !1) {
  e = e.__v_raw
  const r = Me(e),
    o = Me(t)
  n || (rs(t, o) && Gt(r, 'get', t), Gt(r, 'get', o))
  const { has: a } = pa(r),
    i = s ? Al : n ? Nl : Ur
  if (a.call(r, t)) return i(e.get(t))
  if (a.call(r, o)) return i(e.get(o))
  e !== r && e.get(t)
}
function yo(e, t = !1) {
  const n = this.__v_raw,
    s = Me(n),
    r = Me(e)
  return (t || (rs(e, r) && Gt(s, 'has', e), Gt(s, 'has', r)), e === r ? n.has(e) : n.has(e) || n.has(r))
}
function vo(e, t = !1) {
  return ((e = e.__v_raw), !t && Gt(Me(e), 'iterate', Rs), Reflect.get(e, 'size', e))
}
function wu(e) {
  e = Me(e)
  const t = Me(this)
  return (pa(t).has.call(t, e) || (t.add(e), $n(t, 'add', e, e)), this)
}
function Lu(e, t) {
  t = Me(t)
  const n = Me(this),
    { has: s, get: r } = pa(n)
  let o = s.call(n, e)
  o || ((e = Me(e)), (o = s.call(n, e)))
  const a = r.call(n, e)
  return (n.set(e, t), o ? rs(t, a) && $n(n, 'set', e, t) : $n(n, 'add', e, t), this)
}
function Pu(e) {
  const t = Me(this),
    { has: n, get: s } = pa(t)
  let r = n.call(t, e)
  ;(r || ((e = Me(e)), (r = n.call(t, e))), s && s.call(t, e))
  const o = t.delete(e)
  return (r && $n(t, 'delete', e, void 0), o)
}
function $u() {
  const e = Me(this),
    t = e.size !== 0,
    n = e.clear()
  return (t && $n(e, 'clear', void 0, void 0), n)
}
function bo(e, t) {
  return function (s, r) {
    const o = this,
      a = o.__v_raw,
      i = Me(a),
      u = t ? Al : e ? Nl : Ur
    return (!e && Gt(i, 'iterate', Rs), a.forEach((c, d) => s.call(r, u(c), u(d), o)))
  }
}
function So(e, t, n) {
  return function (...s) {
    const r = this.__v_raw,
      o = Me(r),
      a = Ys(o),
      i = e === 'entries' || (e === Symbol.iterator && a),
      u = e === 'keys' && a,
      c = r[e](...s),
      d = n ? Al : t ? Nl : Ur
    return (
      !t && Gt(o, 'iterate', u ? Ci : Rs),
      {
        next() {
          const { value: m, done: h } = c.next()
          return h ? { value: m, done: h } : { value: i ? [d(m[0]), d(m[1])] : d(m), done: h }
        },
        [Symbol.iterator]() {
          return this
        }
      }
    )
  }
}
function Gn(e) {
  return function (...t) {
    return e === 'delete' ? !1 : e === 'clear' ? void 0 : this
  }
}
function Sp() {
  const e = {
      get(o) {
        return _o(this, o)
      },
      get size() {
        return vo(this)
      },
      has: yo,
      add: wu,
      set: Lu,
      delete: Pu,
      clear: $u,
      forEach: bo(!1, !1)
    },
    t = {
      get(o) {
        return _o(this, o, !1, !0)
      },
      get size() {
        return vo(this)
      },
      has: yo,
      add: wu,
      set: Lu,
      delete: Pu,
      clear: $u,
      forEach: bo(!1, !0)
    },
    n = {
      get(o) {
        return _o(this, o, !0)
      },
      get size() {
        return vo(this, !0)
      },
      has(o) {
        return yo.call(this, o, !0)
      },
      add: Gn('add'),
      set: Gn('set'),
      delete: Gn('delete'),
      clear: Gn('clear'),
      forEach: bo(!0, !1)
    },
    s = {
      get(o) {
        return _o(this, o, !0, !0)
      },
      get size() {
        return vo(this, !0)
      },
      has(o) {
        return yo.call(this, o, !0)
      },
      add: Gn('add'),
      set: Gn('set'),
      delete: Gn('delete'),
      clear: Gn('clear'),
      forEach: bo(!0, !0)
    }
  return (
    ['keys', 'values', 'entries', Symbol.iterator].forEach(o => {
      ;((e[o] = So(o, !1, !1)), (n[o] = So(o, !0, !1)), (t[o] = So(o, !1, !0)), (s[o] = So(o, !0, !0)))
    }),
    [e, n, t, s]
  )
}
const [Rp, Op, Cp, Ap] = Sp()
function Il(e, t) {
  const n = t ? (e ? Ap : Cp) : e ? Op : Rp
  return (s, r, o) =>
    r === '__v_isReactive'
      ? !e
      : r === '__v_isReadonly'
        ? e
        : r === '__v_raw'
          ? s
          : Reflect.get(He(n, r) && r in s ? n : s, r, o)
}
const Ip = { get: Il(!1, !1) },
  Tp = { get: Il(!1, !0) },
  Np = { get: Il(!0, !1) },
  xf = new WeakMap(),
  Bf = new WeakMap(),
  Uf = new WeakMap(),
  wp = new WeakMap()
function Lp(e) {
  switch (e) {
    case 'Object':
    case 'Array':
      return 1
    case 'Map':
    case 'Set':
    case 'WeakMap':
    case 'WeakSet':
      return 2
    default:
      return 0
  }
}
function Pp(e) {
  return e.__v_skip || !Object.isExtensible(e) ? 0 : Lp(tp(e))
}
function At(e) {
  return Js(e) ? e : Tl(e, !1, yp, Ip, xf)
}
function Gf(e) {
  return Tl(e, !1, bp, Tp, Bf)
}
function so(e) {
  return Tl(e, !0, vp, Np, Uf)
}
function Tl(e, t, n, s, r) {
  if (!rt(e) || (e.__v_raw && !(t && e.__v_isReactive))) return e
  const o = r.get(e)
  if (o) return o
  const a = Pp(e)
  if (a === 0) return e
  const i = new Proxy(e, a === 2 ? s : n)
  return (r.set(e, i), i)
}
function ts(e) {
  return Js(e) ? ts(e.__v_raw) : !!(e && e.__v_isReactive)
}
function Js(e) {
  return !!(e && e.__v_isReadonly)
}
function jo(e) {
  return !!(e && e.__v_isShallow)
}
function Wf(e) {
  return ts(e) || Js(e)
}
function Me(e) {
  const t = e && e.__v_raw
  return t ? Me(t) : e
}
function Ea(e) {
  return (Object.isExtensible(e) && Wo(e, '__v_skip', !0), e)
}
const Ur = e => (rt(e) ? At(e) : e),
  Nl = e => (rt(e) ? so(e) : e)
class Hf {
  constructor(t, n, s, r) {
    ;((this.getter = t),
      (this._setter = n),
      (this.dep = void 0),
      (this.__v_isRef = !0),
      (this.__v_isReadonly = !1),
      (this.effect = new Rl(
        () => t(this._value),
        () => Po(this, this.effect._dirtyLevel === 2 ? 2 : 3)
      )),
      (this.effect.computed = this),
      (this.effect.active = this._cacheable = !r),
      (this.__v_isReadonly = s))
  }
  get value() {
    const t = Me(this)
    return (
      (!t._cacheable || t.effect.dirty) && rs(t._value, (t._value = t.effect.run())) && Po(t, 4),
      jf(t),
      t.effect._dirtyLevel >= 2 && Po(t, 2),
      t._value
    )
  }
  set value(t) {
    this._setter(t)
  }
  get _dirty() {
    return this.effect.dirty
  }
  set _dirty(t) {
    this.effect.dirty = t
  }
}
function $p(e, t, n = !1) {
  let s, r
  const o = Ce(e)
  return (o ? ((s = e), (r = tn)) : ((s = e.get), (r = e.set)), new Hf(s, r, o || !r, n))
}
function jf(e) {
  var t
  es &&
    Ss &&
    ((e = Me(e)), $f(Ss, (t = e.dep) != null ? t : (e.dep = kf(() => (e.dep = void 0), e instanceof Hf ? e : void 0))))
}
function Po(e, t = 4, n) {
  e = Me(e)
  const s = e.dep
  s && Mf(s, t)
}
function nt(e) {
  return !!(e && e.__v_isRef === !0)
}
function _e(e) {
  return Yf(e, !1)
}
function je(e) {
  return Yf(e, !0)
}
function Yf(e, t) {
  return nt(e) ? e : new Mp(e, t)
}
class Mp {
  constructor(t, n) {
    ;((this.__v_isShallow = n),
      (this.dep = void 0),
      (this.__v_isRef = !0),
      (this._rawValue = n ? t : Me(t)),
      (this._value = n ? t : Ur(t)))
  }
  get value() {
    return (jf(this), this._value)
  }
  set value(t) {
    const n = this.__v_isShallow || jo(t) || Js(t)
    ;((t = n ? t : Me(t)), rs(t, this._rawValue) && ((this._rawValue = t), (this._value = n ? t : Ur(t)), Po(this, 4)))
  }
}
function Dt(e) {
  return nt(e) ? e.value : e
}
const kp = {
  get: (e, t, n) => Dt(Reflect.get(e, t, n)),
  set: (e, t, n, s) => {
    const r = e[t]
    return nt(r) && !nt(n) ? ((r.value = n), !0) : Reflect.set(e, t, n, s)
  }
}
function Kf(e) {
  return ts(e) ? e : new Proxy(e, kp)
}
function _a(e) {
  const t = ve(e) ? new Array(e.length) : {}
  for (const n in e) t[n] = qf(e, n)
  return t
}
class Dp {
  constructor(t, n, s) {
    ;((this._object = t), (this._key = n), (this._defaultValue = s), (this.__v_isRef = !0))
  }
  get value() {
    const t = this._object[this._key]
    return t === void 0 ? this._defaultValue : t
  }
  set value(t) {
    this._object[this._key] = t
  }
  get dep() {
    return hp(Me(this._object), this._key)
  }
}
class Fp {
  constructor(t) {
    ;((this._getter = t), (this.__v_isRef = !0), (this.__v_isReadonly = !0))
  }
  get value() {
    return this._getter()
  }
}
function De(e, t, n) {
  return nt(e) ? e : Ce(e) ? new Fp(e) : rt(e) && arguments.length > 1 ? qf(e, t, n) : _e(e)
}
function qf(e, t, n) {
  const s = e[t]
  return nt(s) ? s : new Dp(e, t, n)
}
/**
 * @vue/runtime-core v3.4.21
 * (c) 2018-present Yuxi (Evan) You and Vue contributors
 * @license MIT
 **/ function ns(e, t, n, s) {
  try {
    return s ? e(...s) : e()
  } catch (r) {
    ya(r, t, n)
  }
}
function nn(e, t, n, s) {
  if (Ce(e)) {
    const o = ns(e, t, n, s)
    return (
      o &&
        Rf(o) &&
        o.catch(a => {
          ya(a, t, n)
        }),
      o
    )
  }
  const r = []
  for (let o = 0; o < e.length; o++) r.push(nn(e[o], t, n, s))
  return r
}
function ya(e, t, n, s = !0) {
  const r = t ? t.vnode : null
  if (t) {
    let o = t.parent
    const a = t.proxy,
      i = `https://vuejs.org/error-reference/#runtime-${n}`
    for (; o; ) {
      const c = o.ec
      if (c) {
        for (let d = 0; d < c.length; d++) if (c[d](e, a, i) === !1) return
      }
      o = o.parent
    }
    const u = t.appContext.config.errorHandler
    if (u) {
      ns(u, null, 10, [e, a, i])
      return
    }
  }
  Vp(e, n, r, s)
}
function Vp(e, t, n, s = !0) {
  console.error(e)
}
let Gr = !1,
  Ai = !1
const Lt = []
let _n = 0
const Ks = []
let zn = null,
  _s = 0
const zf = Promise.resolve()
let wl = null
function Et(e) {
  const t = wl || zf
  return e ? t.then(this ? e.bind(this) : e) : t
}
function xp(e) {
  let t = _n + 1,
    n = Lt.length
  for (; t < n; ) {
    const s = (t + n) >>> 1,
      r = Lt[s],
      o = Wr(r)
    o < e || (o === e && r.pre) ? (t = s + 1) : (n = s)
  }
  return t
}
function Ll(e) {
  ;(!Lt.length || !Lt.includes(e, Gr && e.allowRecurse ? _n + 1 : _n)) &&
    (e.id == null ? Lt.push(e) : Lt.splice(xp(e.id), 0, e), Xf())
}
function Xf() {
  !Gr && !Ai && ((Ai = !0), (wl = zf.then(Qf)))
}
function Bp(e) {
  const t = Lt.indexOf(e)
  t > _n && Lt.splice(t, 1)
}
function Up(e) {
  ;(ve(e) ? Ks.push(...e) : (!zn || !zn.includes(e, e.allowRecurse ? _s + 1 : _s)) && Ks.push(e), Xf())
}
function Mu(e, t, n = Gr ? _n + 1 : 0) {
  for (; n < Lt.length; n++) {
    const s = Lt[n]
    if (s && s.pre) {
      if (e && s.id !== e.uid) continue
      ;(Lt.splice(n, 1), n--, s())
    }
  }
}
function Jf(e) {
  if (Ks.length) {
    const t = [...new Set(Ks)].sort((n, s) => Wr(n) - Wr(s))
    if (((Ks.length = 0), zn)) {
      zn.push(...t)
      return
    }
    for (zn = t, _s = 0; _s < zn.length; _s++) zn[_s]()
    ;((zn = null), (_s = 0))
  }
}
const Wr = e => (e.id == null ? 1 / 0 : e.id),
  Gp = (e, t) => {
    const n = Wr(e) - Wr(t)
    if (n === 0) {
      if (e.pre && !t.pre) return -1
      if (t.pre && !e.pre) return 1
    }
    return n
  }
function Qf(e) {
  ;((Ai = !1), (Gr = !0), Lt.sort(Gp))
  try {
    for (_n = 0; _n < Lt.length; _n++) {
      const t = Lt[_n]
      t && t.active !== !1 && ns(t, null, 14)
    }
  } finally {
    ;((_n = 0), (Lt.length = 0), Jf(), (Gr = !1), (wl = null), (Lt.length || Ks.length) && Qf())
  }
}
function Wp(e, t, ...n) {
  if (e.isUnmounted) return
  const s = e.vnode.props || ot
  let r = n
  const o = t.startsWith('update:'),
    a = o && t.slice(7)
  if (a && a in s) {
    const d = `${a === 'modelValue' ? 'model' : a}Modifiers`,
      { number: m, trim: h } = s[d] || ot
    ;(h && (r = n.map(E => (ft(E) ? E.trim() : E))), m && (r = n.map(rp)))
  }
  let i,
    u = s[(i = Ka(t))] || s[(i = Ka(on(t)))]
  ;(!u && o && (u = s[(i = Ka(lr(t)))]), u && nn(u, e, 6, r))
  const c = s[i + 'Once']
  if (c) {
    if (!e.emitted) e.emitted = {}
    else if (e.emitted[i]) return
    ;((e.emitted[i] = !0), nn(c, e, 6, r))
  }
}
function Zf(e, t, n = !1) {
  const s = t.emitsCache,
    r = s.get(e)
  if (r !== void 0) return r
  const o = e.emits
  let a = {},
    i = !1
  if (!Ce(e)) {
    const u = c => {
      const d = Zf(c, t, !0)
      d && ((i = !0), pt(a, d))
    }
    ;(!n && t.mixins.length && t.mixins.forEach(u), e.extends && u(e.extends), e.mixins && e.mixins.forEach(u))
  }
  return !o && !i
    ? (rt(e) && s.set(e, null), null)
    : (ve(o) ? o.forEach(u => (a[u] = null)) : pt(a, o), rt(e) && s.set(e, a), a)
}
function va(e, t) {
  return !e || !ma(t)
    ? !1
    : ((t = t.slice(2).replace(/Once$/, '')), He(e, t[0].toLowerCase() + t.slice(1)) || He(e, lr(t)) || He(e, t))
}
let ht = null,
  em = null
function Yo(e) {
  const t = ht
  return ((ht = e), (em = (e && e.type.__scopeId) || null), t)
}
function f(e, t = ht, n) {
  if (!t || e._n) return e
  const s = (...r) => {
    s._d && qu(-1)
    const o = Yo(t)
    let a
    try {
      a = e(...r)
    } finally {
      ;(Yo(o), s._d && qu(1))
    }
    return a
  }
  return ((s._n = !0), (s._c = !0), (s._d = !0), s)
}
function Xa(e) {
  const {
    type: t,
    vnode: n,
    proxy: s,
    withProxy: r,
    props: o,
    propsOptions: [a],
    slots: i,
    attrs: u,
    emit: c,
    render: d,
    renderCache: m,
    data: h,
    setupState: E,
    ctx: y,
    inheritAttrs: v
  } = e
  let I, b
  const O = Yo(e)
  try {
    if (n.shapeFlag & 4) {
      const T = r || s,
        $ = T
      ;((I = En(d.call($, T, m, o, E, h, y))), (b = u))
    } else {
      const T = t
      ;((I = En(T.length > 1 ? T(o, { attrs: u, slots: i, emit: c }) : T(o, null))), (b = t.props ? u : Hp(u)))
    }
  } catch (T) {
    ;((wr.length = 0), ya(T, e, 1), (I = l(sn)))
  }
  let P = I
  if (b && v !== !1) {
    const T = Object.keys(b),
      { shapeFlag: $ } = P
    T.length && $ & 7 && (a && T.some(_l) && (b = jp(b, a)), (P = kn(P, b)))
  }
  return (
    n.dirs && ((P = kn(P)), (P.dirs = P.dirs ? P.dirs.concat(n.dirs) : n.dirs)),
    n.transition && (P.transition = n.transition),
    (I = P),
    Yo(O),
    I
  )
}
const Hp = e => {
    let t
    for (const n in e) (n === 'class' || n === 'style' || ma(n)) && ((t || (t = {}))[n] = e[n])
    return t
  },
  jp = (e, t) => {
    const n = {}
    for (const s in e) (!_l(s) || !(s.slice(9) in t)) && (n[s] = e[s])
    return n
  }
function Yp(e, t, n) {
  const { props: s, children: r, component: o } = e,
    { props: a, children: i, patchFlag: u } = t,
    c = o.emitsOptions
  if (t.dirs || t.transition) return !0
  if (n && u >= 0) {
    if (u & 1024) return !0
    if (u & 16) return s ? ku(s, a, c) : !!a
    if (u & 8) {
      const d = t.dynamicProps
      for (let m = 0; m < d.length; m++) {
        const h = d[m]
        if (a[h] !== s[h] && !va(c, h)) return !0
      }
    }
  } else return (r || i) && (!i || !i.$stable) ? !0 : s === a ? !1 : s ? (a ? ku(s, a, c) : !0) : !!a
  return !1
}
function ku(e, t, n) {
  const s = Object.keys(t)
  if (s.length !== Object.keys(e).length) return !0
  for (let r = 0; r < s.length; r++) {
    const o = s[r]
    if (t[o] !== e[o] && !va(n, o)) return !0
  }
  return !1
}
function Kp({ vnode: e, parent: t }, n) {
  for (; t; ) {
    const s = t.subTree
    if ((s.suspense && s.suspense.activeBranch === e && (s.el = e.el), s === e))
      (((e = t.vnode).el = n), (t = t.parent))
    else break
  }
}
const Pl = 'components',
  qp = 'directives'
function he(e, t) {
  return $l(Pl, e, !0, t) || e
}
const tm = Symbol.for('v-ndc')
function zp(e) {
  return ft(e) ? $l(Pl, e, !1) || e : e || tm
}
function dr(e) {
  return $l(qp, e)
}
function $l(e, t, n = !0, s = !1) {
  const r = ht || St
  if (r) {
    const o = r.type
    if (e === Pl) {
      const i = GE(o, !1)
      if (i && (i === t || i === on(t) || i === ur(on(t)))) return o
    }
    const a = Du(r[e] || o[e], t) || Du(r.appContext[e], t)
    return !a && s ? o : a
  }
}
function Du(e, t) {
  return e && (e[t] || e[on(t)] || e[ur(on(t))])
}
const Xp = e => e.__isSuspense
function Jp(e, t) {
  t && t.pendingBranch ? (ve(e) ? t.effects.push(...e) : t.effects.push(e)) : Up(e)
}
const Qp = Symbol.for('v-scx'),
  Zp = () => it(Qp)
function ls(e, t) {
  return Ml(e, null, t)
}
const Ro = {}
function be(e, t, n) {
  return Ml(e, t, n)
}
function Ml(e, t, { immediate: n, deep: s, flush: r, once: o, onTrack: a, onTrigger: i } = ot) {
  if (t && o) {
    const L = t
    t = (...N) => {
      ;(L(...N), $())
    }
  }
  const u = St,
    c = L => (s === !0 ? L : vs(L, s === !1 ? 1 : void 0))
  let d,
    m = !1,
    h = !1
  if (
    (nt(e)
      ? ((d = () => e.value), (m = jo(e)))
      : ts(e)
        ? ((d = () => c(e)), (m = !0))
        : ve(e)
          ? ((h = !0),
            (m = e.some(L => ts(L) || jo(L))),
            (d = () =>
              e.map(L => {
                if (nt(L)) return L.value
                if (ts(L)) return c(L)
                if (Ce(L)) return ns(L, u, 2)
              })))
          : Ce(e)
            ? t
              ? (d = () => ns(e, u, 2))
              : (d = () => (E && E(), nn(e, u, 3, [y])))
            : (d = tn),
    t && s)
  ) {
    const L = d
    d = () => vs(L())
  }
  let E,
    y = L => {
      E = P.onStop = () => {
        ;(ns(L, u, 4), (E = P.onStop = void 0))
      }
    },
    v
  if (Ca)
    if (((y = tn), t ? n && nn(t, u, 3, [d(), h ? [] : void 0, y]) : d(), r === 'sync')) {
      const L = Zp()
      v = L.__watcherHandles || (L.__watcherHandles = [])
    } else return tn
  let I = h ? new Array(e.length).fill(Ro) : Ro
  const b = () => {
    if (!(!P.active || !P.dirty))
      if (t) {
        const L = P.run()
        ;(s || m || (h ? L.some((N, A) => rs(N, I[A])) : rs(L, I))) &&
          (E && E(), nn(t, u, 3, [L, I === Ro ? void 0 : h && I[0] === Ro ? [] : I, y]), (I = L))
      } else P.run()
  }
  b.allowRecurse = !!t
  let O
  r === 'sync'
    ? (O = b)
    : r === 'post'
      ? (O = () => xt(b, u && u.suspense))
      : ((b.pre = !0), u && (b.id = u.uid), (O = () => Ll(b)))
  const P = new Rl(d, tn, O),
    T = wf(),
    $ = () => {
      ;(P.stop(), T && yl(T.effects, P))
    }
  return (
    t ? (n ? b() : (I = P.run())) : r === 'post' ? xt(P.run.bind(P), u && u.suspense) : P.run(),
    v && v.push($),
    $
  )
}
function eE(e, t, n) {
  const s = this.proxy,
    r = ft(e) ? (e.includes('.') ? nm(s, e) : () => s[e]) : e.bind(s, s)
  let o
  Ce(t) ? (o = t) : ((o = t.handler), (n = t))
  const a = ro(this),
    i = Ml(r, o.bind(s), n)
  return (a(), i)
}
function nm(e, t) {
  const n = t.split('.')
  return () => {
    let s = e
    for (let r = 0; r < n.length && s; r++) s = s[n[r]]
    return s
  }
}
function vs(e, t, n = 0, s) {
  if (!rt(e) || e.__v_skip) return e
  if (t && t > 0) {
    if (n >= t) return e
    n++
  }
  if (((s = s || new Set()), s.has(e))) return e
  if ((s.add(e), nt(e))) vs(e.value, t, n, s)
  else if (ve(e)) for (let r = 0; r < e.length; r++) vs(e[r], t, n, s)
  else if (Sf(e) || Ys(e))
    e.forEach(r => {
      vs(r, t, n, s)
    })
  else if (Cf(e)) for (const r in e) vs(e[r], t, n, s)
  return e
}
function vt(e, t) {
  if (ht === null) return e
  const n = Aa(ht) || ht.proxy,
    s = e.dirs || (e.dirs = [])
  for (let r = 0; r < t.length; r++) {
    let [o, a, i, u = ot] = t[r]
    o &&
      (Ce(o) && (o = { mounted: o, updated: o }),
      o.deep && vs(a),
      s.push({ dir: o, instance: n, value: a, oldValue: void 0, arg: i, modifiers: u }))
  }
  return e
}
function ms(e, t, n, s) {
  const r = e.dirs,
    o = t && t.dirs
  for (let a = 0; a < r.length; a++) {
    const i = r[a]
    o && (i.oldValue = o[a].value)
    let u = i.dir[s]
    u && (Ts(), nn(u, n, 8, [e.el, i, e, t]), Ns())
  }
}
const Xn = Symbol('_leaveCb'),
  Oo = Symbol('_enterCb')
function sm() {
  const e = { isMounted: !1, isLeaving: !1, isUnmounting: !1, leavingVNodes: new Map() }
  return (
    xn(() => {
      e.isMounted = !0
    }),
    Sn(() => {
      e.isUnmounting = !0
    }),
    e
  )
}
const Zt = [Function, Array],
  rm = {
    mode: String,
    appear: Boolean,
    persisted: Boolean,
    onBeforeEnter: Zt,
    onEnter: Zt,
    onAfterEnter: Zt,
    onEnterCancelled: Zt,
    onBeforeLeave: Zt,
    onLeave: Zt,
    onAfterLeave: Zt,
    onLeaveCancelled: Zt,
    onBeforeAppear: Zt,
    onAppear: Zt,
    onAfterAppear: Zt,
    onAppearCancelled: Zt
  },
  tE = {
    name: 'BaseTransition',
    props: rm,
    setup(e, { slots: t }) {
      const n = os(),
        s = sm()
      return () => {
        const r = t.default && kl(t.default(), !0)
        if (!r || !r.length) return
        let o = r[0]
        if (r.length > 1) {
          for (const h of r)
            if (h.type !== sn) {
              o = h
              break
            }
        }
        const a = Me(e),
          { mode: i } = a
        if (s.isLeaving) return Ja(o)
        const u = Fu(o)
        if (!u) return Ja(o)
        const c = Hr(u, a, s, n)
        jr(u, c)
        const d = n.subTree,
          m = d && Fu(d)
        if (m && m.type !== sn && !ys(u, m)) {
          const h = Hr(m, a, s, n)
          if ((jr(m, h), i === 'out-in'))
            return (
              (s.isLeaving = !0),
              (h.afterLeave = () => {
                ;((s.isLeaving = !1), n.update.active !== !1 && ((n.effect.dirty = !0), n.update()))
              }),
              Ja(o)
            )
          i === 'in-out' &&
            u.type !== sn &&
            (h.delayLeave = (E, y, v) => {
              const I = om(s, m)
              ;((I[String(m.key)] = m),
                (E[Xn] = () => {
                  ;(y(), (E[Xn] = void 0), delete c.delayedLeave)
                }),
                (c.delayedLeave = v))
            })
        }
        return o
      }
    }
  },
  nE = tE
function om(e, t) {
  const { leavingVNodes: n } = e
  let s = n.get(t.type)
  return (s || ((s = Object.create(null)), n.set(t.type, s)), s)
}
function Hr(e, t, n, s) {
  const {
      appear: r,
      mode: o,
      persisted: a = !1,
      onBeforeEnter: i,
      onEnter: u,
      onAfterEnter: c,
      onEnterCancelled: d,
      onBeforeLeave: m,
      onLeave: h,
      onAfterLeave: E,
      onLeaveCancelled: y,
      onBeforeAppear: v,
      onAppear: I,
      onAfterAppear: b,
      onAppearCancelled: O
    } = t,
    P = String(e.key),
    T = om(n, e),
    $ = (A, w) => {
      A && nn(A, s, 9, w)
    },
    L = (A, w) => {
      const B = w[1]
      ;($(A, w), ve(A) ? A.every(j => j.length <= 1) && B() : A.length <= 1 && B())
    },
    N = {
      mode: o,
      persisted: a,
      beforeEnter(A) {
        let w = i
        if (!n.isMounted)
          if (r) w = v || i
          else return
        A[Xn] && A[Xn](!0)
        const B = T[P]
        ;(B && ys(e, B) && B.el[Xn] && B.el[Xn](), $(w, [A]))
      },
      enter(A) {
        let w = u,
          B = c,
          j = d
        if (!n.isMounted)
          if (r) ((w = I || u), (B = b || c), (j = O || d))
          else return
        let D = !1
        const U = (A[Oo] = X => {
          D || ((D = !0), X ? $(j, [A]) : $(B, [A]), N.delayedLeave && N.delayedLeave(), (A[Oo] = void 0))
        })
        w ? L(w, [A, U]) : U()
      },
      leave(A, w) {
        const B = String(e.key)
        if ((A[Oo] && A[Oo](!0), n.isUnmounting)) return w()
        $(m, [A])
        let j = !1
        const D = (A[Xn] = U => {
          j || ((j = !0), w(), U ? $(y, [A]) : $(E, [A]), (A[Xn] = void 0), T[B] === e && delete T[B])
        })
        ;((T[B] = e), h ? L(h, [A, D]) : D())
      },
      clone(A) {
        return Hr(A, t, n, s)
      }
    }
  return N
}
function Ja(e) {
  if (ba(e)) return ((e = kn(e)), (e.children = null), e)
}
function Fu(e) {
  return ba(e) ? (e.children ? e.children[0] : void 0) : e
}
function jr(e, t) {
  e.shapeFlag & 6 && e.component
    ? jr(e.component.subTree, t)
    : e.shapeFlag & 128
      ? ((e.ssContent.transition = t.clone(e.ssContent)), (e.ssFallback.transition = t.clone(e.ssFallback)))
      : (e.transition = t)
}
function kl(e, t = !1, n) {
  let s = [],
    r = 0
  for (let o = 0; o < e.length; o++) {
    let a = e[o]
    const i = n == null ? a.key : String(n) + String(a.key != null ? a.key : o)
    a.type === Ue
      ? (a.patchFlag & 128 && r++, (s = s.concat(kl(a.children, t, i))))
      : (t || a.type !== sn) && s.push(i != null ? kn(a, { key: i }) : a)
  }
  if (r > 1) for (let o = 0; o < s.length; o++) s[o].patchFlag = -2
  return s
}
/*! #__NO_SIDE_EFFECTS__ */ function Ee(e, t) {
  return Ce(e) ? pt({ name: e.name }, t, { setup: e }) : e
}
const Ir = e => !!e.type.__asyncLoader,
  ba = e => e.type.__isKeepAlive
function am(e, t) {
  lm(e, 'a', t)
}
function im(e, t) {
  lm(e, 'da', t)
}
function lm(e, t, n = St) {
  const s =
    e.__wdc ||
    (e.__wdc = () => {
      let r = n
      for (; r; ) {
        if (r.isDeactivated) return
        r = r.parent
      }
      return e()
    })
  if ((Sa(t, s, n), n)) {
    let r = n.parent
    for (; r && r.parent; ) (ba(r.parent.vnode) && sE(s, t, n, r), (r = r.parent))
  }
}
function sE(e, t, n, s) {
  const r = Sa(t, e, s, !0)
  Dl(() => {
    yl(s[t], r)
  }, n)
}
function Sa(e, t, n = St, s = !1) {
  if (n) {
    const r = n[e] || (n[e] = []),
      o =
        t.__weh ||
        (t.__weh = (...a) => {
          if (n.isUnmounted) return
          Ts()
          const i = ro(n),
            u = nn(t, n, e, a)
          return (i(), Ns(), u)
        })
    return (s ? r.unshift(o) : r.push(o), o)
  }
}
const Vn =
    e =>
    (t, n = St) =>
      (!Ca || e === 'sp') && Sa(e, (...s) => t(...s), n),
  Ra = Vn('bm'),
  xn = Vn('m'),
  um = Vn('bu'),
  cm = Vn('u'),
  Sn = Vn('bum'),
  Dl = Vn('um'),
  rE = Vn('sp'),
  oE = Vn('rtg'),
  aE = Vn('rtc')
function iE(e, t = St) {
  Sa('ec', e, t)
}
function lE(e, t, n, s) {
  let r
  const o = n && n[s]
  if (ve(e) || ft(e)) {
    r = new Array(e.length)
    for (let a = 0, i = e.length; a < i; a++) r[a] = t(e[a], a, void 0, o && o[a])
  } else if (typeof e == 'number') {
    r = new Array(e)
    for (let a = 0; a < e; a++) r[a] = t(a + 1, a, void 0, o && o[a])
  } else if (rt(e))
    if (e[Symbol.iterator]) r = Array.from(e, (a, i) => t(a, i, void 0, o && o[i]))
    else {
      const a = Object.keys(e)
      r = new Array(a.length)
      for (let i = 0, u = a.length; i < u; i++) {
        const c = a[i]
        r[i] = t(e[c], c, i, o && o[i])
      }
    }
  else r = []
  return (n && (n[s] = r), r)
}
function uE(e, t, n = {}, s, r) {
  if (ht.isCE || (ht.parent && Ir(ht.parent) && ht.parent.isCE))
    return (t !== 'default' && (n.name = t), l('slot', n, s && s()))
  let o = e[t]
  ;(o && o._c && (o._d = !1), F())
  const a = o && dm(o(n)),
    i = G(Ue, { key: n.key || (a && a.key) || `_${t}` }, a || (s ? s() : []), a && e._ === 1 ? 64 : -2)
  return (!r && i.scopeId && (i.slotScopeIds = [i.scopeId + '-s']), o && o._c && (o._d = !0), i)
}
function dm(e) {
  return e.some(t => (qo(t) ? !(t.type === sn || (t.type === Ue && !dm(t.children))) : !0)) ? e : null
}
const Ii = e => (e ? (Rm(e) ? Aa(e) || e.proxy : Ii(e.parent)) : null),
  Tr = pt(Object.create(null), {
    $: e => e,
    $el: e => e.vnode.el,
    $data: e => e.data,
    $props: e => e.props,
    $attrs: e => e.attrs,
    $slots: e => e.slots,
    $refs: e => e.refs,
    $parent: e => Ii(e.parent),
    $root: e => Ii(e.root),
    $emit: e => e.emit,
    $options: e => Fl(e),
    $forceUpdate: e =>
      e.f ||
      (e.f = () => {
        ;((e.effect.dirty = !0), Ll(e.update))
      }),
    $nextTick: e => e.n || (e.n = Et.bind(e.proxy)),
    $watch: e => eE.bind(e)
  }),
  Qa = (e, t) => e !== ot && !e.__isScriptSetup && He(e, t),
  cE = {
    get({ _: e }, t) {
      const { ctx: n, setupState: s, data: r, props: o, accessCache: a, type: i, appContext: u } = e
      let c
      if (t[0] !== '$') {
        const E = a[t]
        if (E !== void 0)
          switch (E) {
            case 1:
              return s[t]
            case 2:
              return r[t]
            case 4:
              return n[t]
            case 3:
              return o[t]
          }
        else {
          if (Qa(s, t)) return ((a[t] = 1), s[t])
          if (r !== ot && He(r, t)) return ((a[t] = 2), r[t])
          if ((c = e.propsOptions[0]) && He(c, t)) return ((a[t] = 3), o[t])
          if (n !== ot && He(n, t)) return ((a[t] = 4), n[t])
          Ti && (a[t] = 0)
        }
      }
      const d = Tr[t]
      let m, h
      if (d) return (t === '$attrs' && Gt(e, 'get', t), d(e))
      if ((m = i.__cssModules) && (m = m[t])) return m
      if (n !== ot && He(n, t)) return ((a[t] = 4), n[t])
      if (((h = u.config.globalProperties), He(h, t))) return h[t]
    },
    set({ _: e }, t, n) {
      const { data: s, setupState: r, ctx: o } = e
      return Qa(r, t)
        ? ((r[t] = n), !0)
        : s !== ot && He(s, t)
          ? ((s[t] = n), !0)
          : He(e.props, t) || (t[0] === '$' && t.slice(1) in e)
            ? !1
            : ((o[t] = n), !0)
    },
    has({ _: { data: e, setupState: t, accessCache: n, ctx: s, appContext: r, propsOptions: o } }, a) {
      let i
      return (
        !!n[a] ||
        (e !== ot && He(e, a)) ||
        Qa(t, a) ||
        ((i = o[0]) && He(i, a)) ||
        He(s, a) ||
        He(Tr, a) ||
        He(r.config.globalProperties, a)
      )
    },
    defineProperty(e, t, n) {
      return (
        n.get != null ? (e._.accessCache[t] = 0) : He(n, 'value') && this.set(e, t, n.value, null),
        Reflect.defineProperty(e, t, n)
      )
    }
  }
function Vu(e) {
  return ve(e) ? e.reduce((t, n) => ((t[n] = null), t), {}) : e
}
let Ti = !0
function dE(e) {
  const t = Fl(e),
    n = e.proxy,
    s = e.ctx
  ;((Ti = !1), t.beforeCreate && xu(t.beforeCreate, e, 'bc'))
  const {
    data: r,
    computed: o,
    methods: a,
    watch: i,
    provide: u,
    inject: c,
    created: d,
    beforeMount: m,
    mounted: h,
    beforeUpdate: E,
    updated: y,
    activated: v,
    deactivated: I,
    beforeDestroy: b,
    beforeUnmount: O,
    destroyed: P,
    unmounted: T,
    render: $,
    renderTracked: L,
    renderTriggered: N,
    errorCaptured: A,
    serverPrefetch: w,
    expose: B,
    inheritAttrs: j,
    components: D,
    directives: U,
    filters: X
  } = t
  if ((c && fE(c, s, null), a))
    for (const fe in a) {
      const ce = a[fe]
      Ce(ce) && (s[fe] = ce.bind(n))
    }
  if (r) {
    const fe = r.call(n, n)
    rt(fe) && (e.data = At(fe))
  }
  if (((Ti = !0), o))
    for (const fe in o) {
      const ce = o[fe],
        ke = Ce(ce) ? ce.bind(n, n) : Ce(ce.get) ? ce.get.bind(n, n) : tn,
        ze = !Ce(ce) && Ce(ce.set) ? ce.set.bind(n) : tn,
        Ie = M({ get: ke, set: ze })
      Object.defineProperty(s, fe, {
        enumerable: !0,
        configurable: !0,
        get: () => Ie.value,
        set: xe => (Ie.value = xe)
      })
    }
  if (i) for (const fe in i) fm(i[fe], s, n, fe)
  if (u) {
    const fe = Ce(u) ? u.call(n) : u
    Reflect.ownKeys(fe).forEach(ce => {
      Ut(ce, fe[ce])
    })
  }
  d && xu(d, e, 'c')
  function te(fe, ce) {
    ve(ce) ? ce.forEach(ke => fe(ke.bind(n))) : ce && fe(ce.bind(n))
  }
  if (
    (te(Ra, m),
    te(xn, h),
    te(um, E),
    te(cm, y),
    te(am, v),
    te(im, I),
    te(iE, A),
    te(aE, L),
    te(oE, N),
    te(Sn, O),
    te(Dl, T),
    te(rE, w),
    ve(B))
  )
    if (B.length) {
      const fe = e.exposed || (e.exposed = {})
      B.forEach(ce => {
        Object.defineProperty(fe, ce, { get: () => n[ce], set: ke => (n[ce] = ke) })
      })
    } else e.exposed || (e.exposed = {})
  ;($ && e.render === tn && (e.render = $),
    j != null && (e.inheritAttrs = j),
    D && (e.components = D),
    U && (e.directives = U))
}
function fE(e, t, n = tn) {
  ve(e) && (e = Ni(e))
  for (const s in e) {
    const r = e[s]
    let o
    ;(rt(r) ? ('default' in r ? (o = it(r.from || s, r.default, !0)) : (o = it(r.from || s))) : (o = it(r)),
      nt(o)
        ? Object.defineProperty(t, s, { enumerable: !0, configurable: !0, get: () => o.value, set: a => (o.value = a) })
        : (t[s] = o))
  }
}
function xu(e, t, n) {
  nn(ve(e) ? e.map(s => s.bind(t.proxy)) : e.bind(t.proxy), t, n)
}
function fm(e, t, n, s) {
  const r = s.includes('.') ? nm(n, s) : () => n[s]
  if (ft(e)) {
    const o = t[e]
    Ce(o) && be(r, o)
  } else if (Ce(e)) be(r, e.bind(n))
  else if (rt(e))
    if (ve(e)) e.forEach(o => fm(o, t, n, s))
    else {
      const o = Ce(e.handler) ? e.handler.bind(n) : t[e.handler]
      Ce(o) && be(r, o, e)
    }
}
function Fl(e) {
  const t = e.type,
    { mixins: n, extends: s } = t,
    {
      mixins: r,
      optionsCache: o,
      config: { optionMergeStrategies: a }
    } = e.appContext,
    i = o.get(t)
  let u
  return (
    i
      ? (u = i)
      : !r.length && !n && !s
        ? (u = t)
        : ((u = {}), r.length && r.forEach(c => Ko(u, c, a, !0)), Ko(u, t, a)),
    rt(t) && o.set(t, u),
    u
  )
}
function Ko(e, t, n, s = !1) {
  const { mixins: r, extends: o } = t
  ;(o && Ko(e, o, n, !0), r && r.forEach(a => Ko(e, a, n, !0)))
  for (const a in t)
    if (!(s && a === 'expose')) {
      const i = mE[a] || (n && n[a])
      e[a] = i ? i(e[a], t[a]) : t[a]
    }
  return e
}
const mE = {
  data: Bu,
  props: Uu,
  emits: Uu,
  methods: Cr,
  computed: Cr,
  beforeCreate: Mt,
  created: Mt,
  beforeMount: Mt,
  mounted: Mt,
  beforeUpdate: Mt,
  updated: Mt,
  beforeDestroy: Mt,
  beforeUnmount: Mt,
  destroyed: Mt,
  unmounted: Mt,
  activated: Mt,
  deactivated: Mt,
  errorCaptured: Mt,
  serverPrefetch: Mt,
  components: Cr,
  directives: Cr,
  watch: gE,
  provide: Bu,
  inject: hE
}
function Bu(e, t) {
  return t
    ? e
      ? function () {
          return pt(Ce(e) ? e.call(this, this) : e, Ce(t) ? t.call(this, this) : t)
        }
      : t
    : e
}
function hE(e, t) {
  return Cr(Ni(e), Ni(t))
}
function Ni(e) {
  if (ve(e)) {
    const t = {}
    for (let n = 0; n < e.length; n++) t[e[n]] = e[n]
    return t
  }
  return e
}
function Mt(e, t) {
  return e ? [...new Set([].concat(e, t))] : t
}
function Cr(e, t) {
  return e ? pt(Object.create(null), e, t) : t
}
function Uu(e, t) {
  return e ? (ve(e) && ve(t) ? [...new Set([...e, ...t])] : pt(Object.create(null), Vu(e), Vu(t ?? {}))) : t
}
function gE(e, t) {
  if (!e) return t
  if (!t) return e
  const n = pt(Object.create(null), e)
  for (const s in t) n[s] = Mt(e[s], t[s])
  return n
}
function mm() {
  return {
    app: null,
    config: {
      isNativeTag: Zg,
      performance: !1,
      globalProperties: {},
      optionMergeStrategies: {},
      errorHandler: void 0,
      warnHandler: void 0,
      compilerOptions: {}
    },
    mixins: [],
    components: {},
    directives: {},
    provides: Object.create(null),
    optionsCache: new WeakMap(),
    propsCache: new WeakMap(),
    emitsCache: new WeakMap()
  }
}
let pE = 0
function EE(e, t) {
  return function (s, r = null) {
    ;(Ce(s) || (s = pt({}, s)), r != null && !rt(r) && (r = null))
    const o = mm(),
      a = new WeakSet()
    let i = !1
    const u = (o.app = {
      _uid: pE++,
      _component: s,
      _props: r,
      _container: null,
      _context: o,
      _instance: null,
      version: HE,
      get config() {
        return o.config
      },
      set config(c) {},
      use(c, ...d) {
        return (a.has(c) || (c && Ce(c.install) ? (a.add(c), c.install(u, ...d)) : Ce(c) && (a.add(c), c(u, ...d))), u)
      },
      mixin(c) {
        return (o.mixins.includes(c) || o.mixins.push(c), u)
      },
      component(c, d) {
        return d ? ((o.components[c] = d), u) : o.components[c]
      },
      directive(c, d) {
        return d ? ((o.directives[c] = d), u) : o.directives[c]
      },
      mount(c, d, m) {
        if (!i) {
          const h = l(s, r)
          return (
            (h.appContext = o),
            m === !0 ? (m = 'svg') : m === !1 && (m = void 0),
            d && t ? t(h, c) : e(h, c, m),
            (i = !0),
            (u._container = c),
            (c.__vue_app__ = u),
            Aa(h.component) || h.component.proxy
          )
        }
      },
      unmount() {
        i && (e(null, u._container), delete u._container.__vue_app__)
      },
      provide(c, d) {
        return ((o.provides[c] = d), u)
      },
      runWithContext(c) {
        const d = qs
        qs = u
        try {
          return c()
        } finally {
          qs = d
        }
      }
    })
    return u
  }
}
let qs = null
function Ut(e, t) {
  if (St) {
    let n = St.provides
    const s = St.parent && St.parent.provides
    ;(s === n && (n = St.provides = Object.create(s)), (n[e] = t))
  }
}
function it(e, t, n = !1) {
  const s = St || ht
  if (s || qs) {
    const r = s
      ? s.parent == null
        ? s.vnode.appContext && s.vnode.appContext.provides
        : s.parent.provides
      : qs._context.provides
    if (r && e in r) return r[e]
    if (arguments.length > 1) return n && Ce(t) ? t.call(s && s.proxy) : t
  }
}
function _E() {
  return !!(St || ht || qs)
}
function yE(e, t, n, s = !1) {
  const r = {},
    o = {}
  ;(Wo(o, Oa, 1), (e.propsDefaults = Object.create(null)), hm(e, t, r, o))
  for (const a in e.propsOptions[0]) a in r || (r[a] = void 0)
  ;(n ? (e.props = s ? r : Gf(r)) : e.type.props ? (e.props = r) : (e.props = o), (e.attrs = o))
}
function vE(e, t, n, s) {
  const {
      props: r,
      attrs: o,
      vnode: { patchFlag: a }
    } = e,
    i = Me(r),
    [u] = e.propsOptions
  let c = !1
  if ((s || a > 0) && !(a & 16)) {
    if (a & 8) {
      const d = e.vnode.dynamicProps
      for (let m = 0; m < d.length; m++) {
        let h = d[m]
        if (va(e.emitsOptions, h)) continue
        const E = t[h]
        if (u)
          if (He(o, h)) E !== o[h] && ((o[h] = E), (c = !0))
          else {
            const y = on(h)
            r[y] = wi(u, i, y, E, e, !1)
          }
        else E !== o[h] && ((o[h] = E), (c = !0))
      }
    }
  } else {
    hm(e, t, r, o) && (c = !0)
    let d
    for (const m in i)
      (!t || (!He(t, m) && ((d = lr(m)) === m || !He(t, d)))) &&
        (u ? n && (n[m] !== void 0 || n[d] !== void 0) && (r[m] = wi(u, i, m, void 0, e, !0)) : delete r[m])
    if (o !== i) for (const m in o) (!t || !He(t, m)) && (delete o[m], (c = !0))
  }
  c && $n(e, 'set', '$attrs')
}
function hm(e, t, n, s) {
  const [r, o] = e.propsOptions
  let a = !1,
    i
  if (t)
    for (let u in t) {
      if (Ar(u)) continue
      const c = t[u]
      let d
      r && He(r, (d = on(u)))
        ? !o || !o.includes(d)
          ? (n[d] = c)
          : ((i || (i = {}))[d] = c)
        : va(e.emitsOptions, u) || ((!(u in s) || c !== s[u]) && ((s[u] = c), (a = !0)))
    }
  if (o) {
    const u = Me(n),
      c = i || ot
    for (let d = 0; d < o.length; d++) {
      const m = o[d]
      n[m] = wi(r, u, m, c[m], e, !He(c, m))
    }
  }
  return a
}
function wi(e, t, n, s, r, o) {
  const a = e[n]
  if (a != null) {
    const i = He(a, 'default')
    if (i && s === void 0) {
      const u = a.default
      if (a.type !== Function && !a.skipFactory && Ce(u)) {
        const { propsDefaults: c } = r
        if (n in c) s = c[n]
        else {
          const d = ro(r)
          ;((s = c[n] = u.call(null, t)), d())
        }
      } else s = u
    }
    a[0] && (o && !i ? (s = !1) : a[1] && (s === '' || s === lr(n)) && (s = !0))
  }
  return s
}
function gm(e, t, n = !1) {
  const s = t.propsCache,
    r = s.get(e)
  if (r) return r
  const o = e.props,
    a = {},
    i = []
  let u = !1
  if (!Ce(e)) {
    const d = m => {
      u = !0
      const [h, E] = gm(m, t, !0)
      ;(pt(a, h), E && i.push(...E))
    }
    ;(!n && t.mixins.length && t.mixins.forEach(d), e.extends && d(e.extends), e.mixins && e.mixins.forEach(d))
  }
  if (!o && !u) return (rt(e) && s.set(e, js), js)
  if (ve(o))
    for (let d = 0; d < o.length; d++) {
      const m = on(o[d])
      Gu(m) && (a[m] = ot)
    }
  else if (o)
    for (const d in o) {
      const m = on(d)
      if (Gu(m)) {
        const h = o[d],
          E = (a[m] = ve(h) || Ce(h) ? { type: h } : pt({}, h))
        if (E) {
          const y = ju(Boolean, E.type),
            v = ju(String, E.type)
          ;((E[0] = y > -1), (E[1] = v < 0 || y < v), (y > -1 || He(E, 'default')) && i.push(m))
        }
      }
    }
  const c = [a, i]
  return (rt(e) && s.set(e, c), c)
}
function Gu(e) {
  return e[0] !== '$' && !Ar(e)
}
function Wu(e) {
  return e === null
    ? 'null'
    : typeof e == 'function'
      ? e.name || ''
      : (typeof e == 'object' && e.constructor && e.constructor.name) || ''
}
function Hu(e, t) {
  return Wu(e) === Wu(t)
}
function ju(e, t) {
  return ve(t) ? t.findIndex(n => Hu(n, e)) : Ce(t) && Hu(t, e) ? 0 : -1
}
const pm = e => e[0] === '_' || e === '$stable',
  Vl = e => (ve(e) ? e.map(En) : [En(e)]),
  bE = (e, t, n) => {
    if (t._n) return t
    const s = f((...r) => Vl(t(...r)), n)
    return ((s._c = !1), s)
  },
  Em = (e, t, n) => {
    const s = e._ctx
    for (const r in e) {
      if (pm(r)) continue
      const o = e[r]
      if (Ce(o)) t[r] = bE(r, o, s)
      else if (o != null) {
        const a = Vl(o)
        t[r] = () => a
      }
    }
  },
  _m = (e, t) => {
    const n = Vl(t)
    e.slots.default = () => n
  },
  SE = (e, t) => {
    if (e.vnode.shapeFlag & 32) {
      const n = t._
      n ? ((e.slots = Me(t)), Wo(t, '_', n)) : Em(t, (e.slots = {}))
    } else ((e.slots = {}), t && _m(e, t))
    Wo(e.slots, Oa, 1)
  },
  RE = (e, t, n) => {
    const { vnode: s, slots: r } = e
    let o = !0,
      a = ot
    if (s.shapeFlag & 32) {
      const i = t._
      ;(i ? (n && i === 1 ? (o = !1) : (pt(r, t), !n && i === 1 && delete r._)) : ((o = !t.$stable), Em(t, r)), (a = t))
    } else t && (_m(e, t), (a = { default: 1 }))
    if (o) for (const i in r) !pm(i) && a[i] == null && delete r[i]
  }
function Li(e, t, n, s, r = !1) {
  if (ve(e)) {
    e.forEach((h, E) => Li(h, t && (ve(t) ? t[E] : t), n, s, r))
    return
  }
  if (Ir(s) && !r) return
  const o = s.shapeFlag & 4 ? Aa(s.component) || s.component.proxy : s.el,
    a = r ? null : o,
    { i, r: u } = e,
    c = t && t.r,
    d = i.refs === ot ? (i.refs = {}) : i.refs,
    m = i.setupState
  if ((c != null && c !== u && (ft(c) ? ((d[c] = null), He(m, c) && (m[c] = null)) : nt(c) && (c.value = null)), Ce(u)))
    ns(u, i, 12, [a, d])
  else {
    const h = ft(u),
      E = nt(u)
    if (h || E) {
      const y = () => {
        if (e.f) {
          const v = h ? (He(m, u) ? m[u] : d[u]) : u.value
          r
            ? ve(v) && yl(v, o)
            : ve(v)
              ? v.includes(o) || v.push(o)
              : h
                ? ((d[u] = [o]), He(m, u) && (m[u] = d[u]))
                : ((u.value = [o]), e.k && (d[e.k] = u.value))
        } else h ? ((d[u] = a), He(m, u) && (m[u] = a)) : E && ((u.value = a), e.k && (d[e.k] = a))
      }
      a ? ((y.id = -1), xt(y, n)) : y()
    }
  }
}
const xt = Jp
function OE(e) {
  return CE(e)
}
function CE(e, t) {
  const n = Af()
  n.__VUE__ = !0
  const {
      insert: s,
      remove: r,
      patchProp: o,
      createElement: a,
      createText: i,
      createComment: u,
      setText: c,
      setElementText: d,
      parentNode: m,
      nextSibling: h,
      setScopeId: E = tn,
      insertStaticContent: y
    } = e,
    v = (p, g, R, k = null, V = null, Y = null, J = void 0, z = null, Z = !!g.dynamicChildren) => {
      if (p === g) return
      ;(p && !ys(p, g) && ((k = H(p)), xe(p, V, Y, !0), (p = null)),
        g.patchFlag === -2 && ((Z = !1), (g.dynamicChildren = null)))
      const { type: q, ref: oe, shapeFlag: pe } = g
      switch (q) {
        case fr:
          I(p, g, R, k)
          break
        case sn:
          b(p, g, R, k)
          break
        case ei:
          p == null && O(g, R, k, J)
          break
        case Ue:
          D(p, g, R, k, V, Y, J, z, Z)
          break
        default:
          pe & 1
            ? $(p, g, R, k, V, Y, J, z, Z)
            : pe & 6
              ? U(p, g, R, k, V, Y, J, z, Z)
              : (pe & 64 || pe & 128) && q.process(p, g, R, k, V, Y, J, z, Z, le)
      }
      oe != null && V && Li(oe, p && p.ref, Y, g || p, !g)
    },
    I = (p, g, R, k) => {
      if (p == null) s((g.el = i(g.children)), R, k)
      else {
        const V = (g.el = p.el)
        g.children !== p.children && c(V, g.children)
      }
    },
    b = (p, g, R, k) => {
      p == null ? s((g.el = u(g.children || '')), R, k) : (g.el = p.el)
    },
    O = (p, g, R, k) => {
      ;[p.el, p.anchor] = y(p.children, g, R, k, p.el, p.anchor)
    },
    P = ({ el: p, anchor: g }, R, k) => {
      let V
      for (; p && p !== g; ) ((V = h(p)), s(p, R, k), (p = V))
      s(g, R, k)
    },
    T = ({ el: p, anchor: g }) => {
      let R
      for (; p && p !== g; ) ((R = h(p)), r(p), (p = R))
      r(g)
    },
    $ = (p, g, R, k, V, Y, J, z, Z) => {
      ;(g.type === 'svg' ? (J = 'svg') : g.type === 'math' && (J = 'mathml'),
        p == null ? L(g, R, k, V, Y, J, z, Z) : w(p, g, V, Y, J, z, Z))
    },
    L = (p, g, R, k, V, Y, J, z) => {
      let Z, q
      const { props: oe, shapeFlag: pe, transition: se, dirs: x } = p
      if (
        ((Z = p.el = a(p.type, Y, oe && oe.is, oe)),
        pe & 8 ? d(Z, p.children) : pe & 16 && A(p.children, Z, null, k, V, Za(p, Y), J, z),
        x && ms(p, null, k, 'created'),
        N(Z, p, p.scopeId, J, k),
        oe)
      ) {
        for (const me in oe) me !== 'value' && !Ar(me) && o(Z, me, null, oe[me], Y, p.children, k, V, Fe)
        ;('value' in oe && o(Z, 'value', null, oe.value, Y), (q = oe.onVnodeBeforeMount) && gn(q, k, p))
      }
      x && ms(p, null, k, 'beforeMount')
      const W = AE(V, se)
      ;(W && se.beforeEnter(Z),
        s(Z, g, R),
        ((q = oe && oe.onVnodeMounted) || W || x) &&
          xt(() => {
            ;(q && gn(q, k, p), W && se.enter(Z), x && ms(p, null, k, 'mounted'))
          }, V))
    },
    N = (p, g, R, k, V) => {
      if ((R && E(p, R), k)) for (let Y = 0; Y < k.length; Y++) E(p, k[Y])
      if (V) {
        let Y = V.subTree
        if (g === Y) {
          const J = V.vnode
          N(p, J, J.scopeId, J.slotScopeIds, V.parent)
        }
      }
    },
    A = (p, g, R, k, V, Y, J, z, Z = 0) => {
      for (let q = Z; q < p.length; q++) {
        const oe = (p[q] = z ? Jn(p[q]) : En(p[q]))
        v(null, oe, g, R, k, V, Y, J, z)
      }
    },
    w = (p, g, R, k, V, Y, J) => {
      const z = (g.el = p.el)
      let { patchFlag: Z, dynamicChildren: q, dirs: oe } = g
      Z |= p.patchFlag & 16
      const pe = p.props || ot,
        se = g.props || ot
      let x
      if (
        (R && hs(R, !1),
        (x = se.onVnodeBeforeUpdate) && gn(x, R, g, p),
        oe && ms(g, p, R, 'beforeUpdate'),
        R && hs(R, !0),
        q ? B(p.dynamicChildren, q, z, R, k, Za(g, V), Y) : J || ce(p, g, z, null, R, k, Za(g, V), Y, !1),
        Z > 0)
      ) {
        if (Z & 16) j(z, g, pe, se, R, k, V)
        else if (
          (Z & 2 && pe.class !== se.class && o(z, 'class', null, se.class, V),
          Z & 4 && o(z, 'style', pe.style, se.style, V),
          Z & 8)
        ) {
          const W = g.dynamicProps
          for (let me = 0; me < W.length; me++) {
            const Se = W[me],
              tt = pe[Se],
              wt = se[Se]
            ;(wt !== tt || Se === 'value') && o(z, Se, tt, wt, V, p.children, R, k, Fe)
          }
        }
        Z & 1 && p.children !== g.children && d(z, g.children)
      } else !J && q == null && j(z, g, pe, se, R, k, V)
      ;((x = se.onVnodeUpdated) || oe) &&
        xt(() => {
          ;(x && gn(x, R, g, p), oe && ms(g, p, R, 'updated'))
        }, k)
    },
    B = (p, g, R, k, V, Y, J) => {
      for (let z = 0; z < g.length; z++) {
        const Z = p[z],
          q = g[z],
          oe = Z.el && (Z.type === Ue || !ys(Z, q) || Z.shapeFlag & 70) ? m(Z.el) : R
        v(Z, q, oe, null, k, V, Y, J, !0)
      }
    },
    j = (p, g, R, k, V, Y, J) => {
      if (R !== k) {
        if (R !== ot) for (const z in R) !Ar(z) && !(z in k) && o(p, z, R[z], null, J, g.children, V, Y, Fe)
        for (const z in k) {
          if (Ar(z)) continue
          const Z = k[z],
            q = R[z]
          Z !== q && z !== 'value' && o(p, z, q, Z, J, g.children, V, Y, Fe)
        }
        'value' in k && o(p, 'value', R.value, k.value, J)
      }
    },
    D = (p, g, R, k, V, Y, J, z, Z) => {
      const q = (g.el = p ? p.el : i('')),
        oe = (g.anchor = p ? p.anchor : i(''))
      let { patchFlag: pe, dynamicChildren: se, slotScopeIds: x } = g
      ;(x && (z = z ? z.concat(x) : x),
        p == null
          ? (s(q, R, k), s(oe, R, k), A(g.children || [], R, oe, V, Y, J, z, Z))
          : pe > 0 && pe & 64 && se && p.dynamicChildren
            ? (B(p.dynamicChildren, se, R, V, Y, J, z), (g.key != null || (V && g === V.subTree)) && xl(p, g, !0))
            : ce(p, g, R, oe, V, Y, J, z, Z))
    },
    U = (p, g, R, k, V, Y, J, z, Z) => {
      ;((g.slotScopeIds = z),
        p == null ? (g.shapeFlag & 512 ? V.ctx.activate(g, R, k, J, Z) : X(g, R, k, V, Y, J, Z)) : ge(p, g, Z))
    },
    X = (p, g, R, k, V, Y, J) => {
      const z = (p.component = FE(p, k, V))
      if ((ba(p) && (z.ctx.renderer = le), VE(z), z.asyncDep)) {
        if ((V && V.registerDep(z, te), !p.el)) {
          const Z = (z.subTree = l(sn))
          b(null, Z, g, R)
        }
      } else te(z, p, g, R, V, Y, J)
    },
    ge = (p, g, R) => {
      const k = (g.component = p.component)
      if (Yp(p, g, R))
        if (k.asyncDep && !k.asyncResolved) {
          fe(k, g, R)
          return
        } else ((k.next = g), Bp(k.update), (k.effect.dirty = !0), k.update())
      else ((g.el = p.el), (k.vnode = g))
    },
    te = (p, g, R, k, V, Y, J) => {
      const z = () => {
          if (p.isMounted) {
            let { next: oe, bu: pe, u: se, parent: x, vnode: W } = p
            {
              const Yt = ym(p)
              if (Yt) {
                ;(oe && ((oe.el = W.el), fe(p, oe, J)),
                  Yt.asyncDep.then(() => {
                    p.isUnmounted || z()
                  }))
                return
              }
            }
            let me = oe,
              Se
            ;(hs(p, !1),
              oe ? ((oe.el = W.el), fe(p, oe, J)) : (oe = W),
              pe && qa(pe),
              (Se = oe.props && oe.props.onVnodeBeforeUpdate) && gn(Se, x, oe, W),
              hs(p, !0))
            const tt = Xa(p),
              wt = p.subTree
            ;((p.subTree = tt),
              v(wt, tt, m(wt.el), H(wt), p, V, Y),
              (oe.el = tt.el),
              me === null && Kp(p, tt.el),
              se && xt(se, V),
              (Se = oe.props && oe.props.onVnodeUpdated) && xt(() => gn(Se, x, oe, W), V))
          } else {
            let oe
            const { el: pe, props: se } = g,
              { bm: x, m: W, parent: me } = p,
              Se = Ir(g)
            if (
              (hs(p, !1), x && qa(x), !Se && (oe = se && se.onVnodeBeforeMount) && gn(oe, me, g), hs(p, !0), pe && Xe)
            ) {
              const tt = () => {
                ;((p.subTree = Xa(p)), Xe(pe, p.subTree, p, V, null))
              }
              Se ? g.type.__asyncLoader().then(() => !p.isUnmounted && tt()) : tt()
            } else {
              const tt = (p.subTree = Xa(p))
              ;(v(null, tt, R, k, p, V, Y), (g.el = tt.el))
            }
            if ((W && xt(W, V), !Se && (oe = se && se.onVnodeMounted))) {
              const tt = g
              xt(() => gn(oe, me, tt), V)
            }
            ;((g.shapeFlag & 256 || (me && Ir(me.vnode) && me.vnode.shapeFlag & 256)) && p.a && xt(p.a, V),
              (p.isMounted = !0),
              (g = R = k = null))
          }
        },
        Z = (p.effect = new Rl(z, tn, () => Ll(q), p.scope)),
        q = (p.update = () => {
          Z.dirty && Z.run()
        })
      ;((q.id = p.uid), hs(p, !0), q())
    },
    fe = (p, g, R) => {
      g.component = p
      const k = p.vnode.props
      ;((p.vnode = g), (p.next = null), vE(p, g.props, k, R), RE(p, g.children, R), Ts(), Mu(p), Ns())
    },
    ce = (p, g, R, k, V, Y, J, z, Z = !1) => {
      const q = p && p.children,
        oe = p ? p.shapeFlag : 0,
        pe = g.children,
        { patchFlag: se, shapeFlag: x } = g
      if (se > 0) {
        if (se & 128) {
          ze(q, pe, R, k, V, Y, J, z, Z)
          return
        } else if (se & 256) {
          ke(q, pe, R, k, V, Y, J, z, Z)
          return
        }
      }
      x & 8
        ? (oe & 16 && Fe(q, V, Y), pe !== q && d(R, pe))
        : oe & 16
          ? x & 16
            ? ze(q, pe, R, k, V, Y, J, z, Z)
            : Fe(q, V, Y, !0)
          : (oe & 8 && d(R, ''), x & 16 && A(pe, R, k, V, Y, J, z, Z))
    },
    ke = (p, g, R, k, V, Y, J, z, Z) => {
      ;((p = p || js), (g = g || js))
      const q = p.length,
        oe = g.length,
        pe = Math.min(q, oe)
      let se
      for (se = 0; se < pe; se++) {
        const x = (g[se] = Z ? Jn(g[se]) : En(g[se]))
        v(p[se], x, R, null, V, Y, J, z, Z)
      }
      q > oe ? Fe(p, V, Y, !0, !1, pe) : A(g, R, k, V, Y, J, z, Z, pe)
    },
    ze = (p, g, R, k, V, Y, J, z, Z) => {
      let q = 0
      const oe = g.length
      let pe = p.length - 1,
        se = oe - 1
      for (; q <= pe && q <= se; ) {
        const x = p[q],
          W = (g[q] = Z ? Jn(g[q]) : En(g[q]))
        if (ys(x, W)) v(x, W, R, null, V, Y, J, z, Z)
        else break
        q++
      }
      for (; q <= pe && q <= se; ) {
        const x = p[pe],
          W = (g[se] = Z ? Jn(g[se]) : En(g[se]))
        if (ys(x, W)) v(x, W, R, null, V, Y, J, z, Z)
        else break
        ;(pe--, se--)
      }
      if (q > pe) {
        if (q <= se) {
          const x = se + 1,
            W = x < oe ? g[x].el : k
          for (; q <= se; ) (v(null, (g[q] = Z ? Jn(g[q]) : En(g[q])), R, W, V, Y, J, z, Z), q++)
        }
      } else if (q > se) for (; q <= pe; ) (xe(p[q], V, Y, !0), q++)
      else {
        const x = q,
          W = q,
          me = new Map()
        for (q = W; q <= se; q++) {
          const Kt = (g[q] = Z ? Jn(g[q]) : En(g[q]))
          Kt.key != null && me.set(Kt.key, q)
        }
        let Se,
          tt = 0
        const wt = se - W + 1
        let Yt = !1,
          Eo = 0
        const Ds = new Array(wt)
        for (q = 0; q < wt; q++) Ds[q] = 0
        for (q = x; q <= pe; q++) {
          const Kt = p[q]
          if (tt >= wt) {
            xe(Kt, V, Y, !0)
            continue
          }
          let hn
          if (Kt.key != null) hn = me.get(Kt.key)
          else
            for (Se = W; Se <= se; Se++)
              if (Ds[Se - W] === 0 && ys(Kt, g[Se])) {
                hn = Se
                break
              }
          hn === void 0
            ? xe(Kt, V, Y, !0)
            : ((Ds[hn - W] = q + 1), hn >= Eo ? (Eo = hn) : (Yt = !0), v(Kt, g[hn], R, null, V, Y, J, z, Z), tt++)
        }
        const Ou = Yt ? IE(Ds) : js
        for (Se = Ou.length - 1, q = wt - 1; q >= 0; q--) {
          const Kt = W + q,
            hn = g[Kt],
            Cu = Kt + 1 < oe ? g[Kt + 1].el : k
          Ds[q] === 0 ? v(null, hn, R, Cu, V, Y, J, z, Z) : Yt && (Se < 0 || q !== Ou[Se] ? Ie(hn, R, Cu, 2) : Se--)
        }
      }
    },
    Ie = (p, g, R, k, V = null) => {
      const { el: Y, type: J, transition: z, children: Z, shapeFlag: q } = p
      if (q & 6) {
        Ie(p.component.subTree, g, R, k)
        return
      }
      if (q & 128) {
        p.suspense.move(g, R, k)
        return
      }
      if (q & 64) {
        J.move(p, g, R, le)
        return
      }
      if (J === Ue) {
        s(Y, g, R)
        for (let pe = 0; pe < Z.length; pe++) Ie(Z[pe], g, R, k)
        s(p.anchor, g, R)
        return
      }
      if (J === ei) {
        P(p, g, R)
        return
      }
      if (k !== 2 && q & 1 && z)
        if (k === 0) (z.beforeEnter(Y), s(Y, g, R), xt(() => z.enter(Y), V))
        else {
          const { leave: pe, delayLeave: se, afterLeave: x } = z,
            W = () => s(Y, g, R),
            me = () => {
              pe(Y, () => {
                ;(W(), x && x())
              })
            }
          se ? se(Y, W, me) : me()
        }
      else s(Y, g, R)
    },
    xe = (p, g, R, k = !1, V = !1) => {
      const { type: Y, props: J, ref: z, children: Z, dynamicChildren: q, shapeFlag: oe, patchFlag: pe, dirs: se } = p
      if ((z != null && Li(z, null, R, p, !0), oe & 256)) {
        g.ctx.deactivate(p)
        return
      }
      const x = oe & 1 && se,
        W = !Ir(p)
      let me
      if ((W && (me = J && J.onVnodeBeforeUnmount) && gn(me, g, p), oe & 6)) bt(p.component, R, k)
      else {
        if (oe & 128) {
          p.suspense.unmount(R, k)
          return
        }
        ;(x && ms(p, null, g, 'beforeUnmount'),
          oe & 64
            ? p.type.remove(p, g, R, V, le, k)
            : q && (Y !== Ue || (pe > 0 && pe & 64))
              ? Fe(q, g, R, !1, !0)
              : ((Y === Ue && pe & 384) || (!V && oe & 16)) && Fe(Z, g, R),
          k && Le(p))
      }
      ;((W && (me = J && J.onVnodeUnmounted)) || x) &&
        xt(() => {
          ;(me && gn(me, g, p), x && ms(p, null, g, 'unmounted'))
        }, R)
    },
    Le = p => {
      const { type: g, el: R, anchor: k, transition: V } = p
      if (g === Ue) {
        et(R, k)
        return
      }
      if (g === ei) {
        T(p)
        return
      }
      const Y = () => {
        ;(r(R), V && !V.persisted && V.afterLeave && V.afterLeave())
      }
      if (p.shapeFlag & 1 && V && !V.persisted) {
        const { leave: J, delayLeave: z } = V,
          Z = () => J(R, Y)
        z ? z(p.el, Y, Z) : Z()
      } else Y()
    },
    et = (p, g) => {
      let R
      for (; p !== g; ) ((R = h(p)), r(p), (p = R))
      r(g)
    },
    bt = (p, g, R) => {
      const { bum: k, scope: V, update: Y, subTree: J, um: z } = p
      ;(k && qa(k),
        V.stop(),
        Y && ((Y.active = !1), xe(J, p, g, R)),
        z && xt(z, g),
        xt(() => {
          p.isUnmounted = !0
        }, g),
        g &&
          g.pendingBranch &&
          !g.isUnmounted &&
          p.asyncDep &&
          !p.asyncResolved &&
          p.suspenseId === g.pendingId &&
          (g.deps--, g.deps === 0 && g.resolve()))
    },
    Fe = (p, g, R, k = !1, V = !1, Y = 0) => {
      for (let J = Y; J < p.length; J++) xe(p[J], g, R, k, V)
    },
    H = p => (p.shapeFlag & 6 ? H(p.component.subTree) : p.shapeFlag & 128 ? p.suspense.next() : h(p.anchor || p.el))
  let ne = !1
  const Q = (p, g, R) => {
      ;(p == null ? g._vnode && xe(g._vnode, null, null, !0) : v(g._vnode || null, p, g, null, null, null, R),
        ne || ((ne = !0), Mu(), Jf(), (ne = !1)),
        (g._vnode = p))
    },
    le = { p: v, um: xe, m: Ie, r: Le, mt: X, mc: A, pc: ce, pbc: B, n: H, o: e }
  let Pe, Xe
  return (t && ([Pe, Xe] = t(le)), { render: Q, hydrate: Pe, createApp: EE(Q, Pe) })
}
function Za({ type: e, props: t }, n) {
  return (n === 'svg' && e === 'foreignObject') ||
    (n === 'mathml' && e === 'annotation-xml' && t && t.encoding && t.encoding.includes('html'))
    ? void 0
    : n
}
function hs({ effect: e, update: t }, n) {
  e.allowRecurse = t.allowRecurse = n
}
function AE(e, t) {
  return (!e || (e && !e.pendingBranch)) && t && !t.persisted
}
function xl(e, t, n = !1) {
  const s = e.children,
    r = t.children
  if (ve(s) && ve(r))
    for (let o = 0; o < s.length; o++) {
      const a = s[o]
      let i = r[o]
      ;(i.shapeFlag & 1 &&
        !i.dynamicChildren &&
        ((i.patchFlag <= 0 || i.patchFlag === 32) && ((i = r[o] = Jn(r[o])), (i.el = a.el)), n || xl(a, i)),
        i.type === fr && (i.el = a.el))
    }
}
function IE(e) {
  const t = e.slice(),
    n = [0]
  let s, r, o, a, i
  const u = e.length
  for (s = 0; s < u; s++) {
    const c = e[s]
    if (c !== 0) {
      if (((r = n[n.length - 1]), e[r] < c)) {
        ;((t[s] = r), n.push(s))
        continue
      }
      for (o = 0, a = n.length - 1; o < a; ) ((i = (o + a) >> 1), e[n[i]] < c ? (o = i + 1) : (a = i))
      c < e[n[o]] && (o > 0 && (t[s] = n[o - 1]), (n[o] = s))
    }
  }
  for (o = n.length, a = n[o - 1]; o-- > 0; ) ((n[o] = a), (a = t[a]))
  return n
}
function ym(e) {
  const t = e.subTree.component
  if (t) return t.asyncDep && !t.asyncResolved ? t : ym(t)
}
const TE = e => e.__isTeleport,
  Nr = e => e && (e.disabled || e.disabled === ''),
  Yu = e => typeof SVGElement < 'u' && e instanceof SVGElement,
  Ku = e => typeof MathMLElement == 'function' && e instanceof MathMLElement,
  Pi = (e, t) => {
    const n = e && e.to
    return ft(n) ? (t ? t(n) : null) : n
  },
  NE = {
    name: 'Teleport',
    __isTeleport: !0,
    process(e, t, n, s, r, o, a, i, u, c) {
      const {
          mc: d,
          pc: m,
          pbc: h,
          o: { insert: E, querySelector: y, createText: v, createComment: I }
        } = c,
        b = Nr(t.props)
      let { shapeFlag: O, children: P, dynamicChildren: T } = t
      if (e == null) {
        const $ = (t.el = v('')),
          L = (t.anchor = v(''))
        ;(E($, n, s), E(L, n, s))
        const N = (t.target = Pi(t.props, y)),
          A = (t.targetAnchor = v(''))
        N && (E(A, N), a === 'svg' || Yu(N) ? (a = 'svg') : (a === 'mathml' || Ku(N)) && (a = 'mathml'))
        const w = (B, j) => {
          O & 16 && d(P, B, j, r, o, a, i, u)
        }
        b ? w(n, L) : N && w(N, A)
      } else {
        t.el = e.el
        const $ = (t.anchor = e.anchor),
          L = (t.target = e.target),
          N = (t.targetAnchor = e.targetAnchor),
          A = Nr(e.props),
          w = A ? n : L,
          B = A ? $ : N
        if (
          (a === 'svg' || Yu(L) ? (a = 'svg') : (a === 'mathml' || Ku(L)) && (a = 'mathml'),
          T ? (h(e.dynamicChildren, T, w, r, o, a, i), xl(e, t, !0)) : u || m(e, t, w, B, r, o, a, i, !1),
          b)
        )
          A ? t.props && e.props && t.props.to !== e.props.to && (t.props.to = e.props.to) : Co(t, n, $, c, 1)
        else if ((t.props && t.props.to) !== (e.props && e.props.to)) {
          const j = (t.target = Pi(t.props, y))
          j && Co(t, j, null, c, 0)
        } else A && Co(t, L, N, c, 1)
      }
      vm(t)
    },
    remove(e, t, n, s, { um: r, o: { remove: o } }, a) {
      const { shapeFlag: i, children: u, anchor: c, targetAnchor: d, target: m, props: h } = e
      if ((m && o(d), a && o(c), i & 16)) {
        const E = a || !Nr(h)
        for (let y = 0; y < u.length; y++) {
          const v = u[y]
          r(v, t, n, E, !!v.dynamicChildren)
        }
      }
    },
    move: Co,
    hydrate: wE
  }
function Co(e, t, n, { o: { insert: s }, m: r }, o = 2) {
  o === 0 && s(e.targetAnchor, t, n)
  const { el: a, anchor: i, shapeFlag: u, children: c, props: d } = e,
    m = o === 2
  if ((m && s(a, t, n), (!m || Nr(d)) && u & 16)) for (let h = 0; h < c.length; h++) r(c[h], t, n, 2)
  m && s(i, t, n)
}
function wE(e, t, n, s, r, o, { o: { nextSibling: a, parentNode: i, querySelector: u } }, c) {
  const d = (t.target = Pi(t.props, u))
  if (d) {
    const m = d._lpa || d.firstChild
    if (t.shapeFlag & 16)
      if (Nr(t.props)) ((t.anchor = c(a(e), t, i(e), n, s, r, o)), (t.targetAnchor = m))
      else {
        t.anchor = a(e)
        let h = m
        for (; h; )
          if (((h = a(h)), h && h.nodeType === 8 && h.data === 'teleport anchor')) {
            ;((t.targetAnchor = h), (d._lpa = t.targetAnchor && a(t.targetAnchor)))
            break
          }
        c(m, t, d, n, s, r, o)
      }
    vm(t)
  }
  return t.anchor && a(t.anchor)
}
const LE = NE
function vm(e) {
  const t = e.ctx
  if (t && t.ut) {
    let n = e.children[0].el
    for (; n && n !== e.targetAnchor; ) (n.nodeType === 1 && n.setAttribute('data-v-owner', t.uid), (n = n.nextSibling))
    t.ut()
  }
}
const Ue = Symbol.for('v-fgt'),
  fr = Symbol.for('v-txt'),
  sn = Symbol.for('v-cmt'),
  ei = Symbol.for('v-stc'),
  wr = []
let un = null
function F(e = !1) {
  wr.push((un = e ? null : []))
}
function PE() {
  ;(wr.pop(), (un = wr[wr.length - 1] || null))
}
let Yr = 1
function qu(e) {
  Yr += e
}
function bm(e) {
  return ((e.dynamicChildren = Yr > 0 ? un || js : null), PE(), Yr > 0 && un && un.push(e), e)
}
function Ne(e, t, n, s, r, o) {
  return bm(C(e, t, n, s, r, o, !0))
}
function G(e, t, n, s, r) {
  return bm(l(e, t, n, s, r, !0))
}
function qo(e) {
  return e ? e.__v_isVNode === !0 : !1
}
function ys(e, t) {
  return e.type === t.type && e.key === t.key
}
const Oa = '__vInternal',
  Sm = ({ key: e }) => e ?? null,
  $o = ({ ref: e, ref_key: t, ref_for: n }) => (
    typeof e == 'number' && (e = '' + e),
    e != null ? (ft(e) || nt(e) || Ce(e) ? { i: ht, r: e, k: t, f: !!n } : e) : null
  )
function C(e, t = null, n = null, s = 0, r = null, o = e === Ue ? 0 : 1, a = !1, i = !1) {
  const u = {
    __v_isVNode: !0,
    __v_skip: !0,
    type: e,
    props: t,
    key: t && Sm(t),
    ref: t && $o(t),
    scopeId: em,
    slotScopeIds: null,
    children: n,
    component: null,
    suspense: null,
    ssContent: null,
    ssFallback: null,
    dirs: null,
    transition: null,
    el: null,
    anchor: null,
    target: null,
    targetAnchor: null,
    staticCount: 0,
    shapeFlag: o,
    patchFlag: s,
    dynamicProps: r,
    dynamicChildren: null,
    appContext: null,
    ctx: ht
  }
  return (
    i ? (Bl(u, n), o & 128 && e.normalize(u)) : n && (u.shapeFlag |= ft(n) ? 8 : 16),
    Yr > 0 && !a && un && (u.patchFlag > 0 || o & 6) && u.patchFlag !== 32 && un.push(u),
    u
  )
}
const l = $E
function $E(e, t = null, n = null, s = 0, r = null, o = !1) {
  if (((!e || e === tm) && (e = sn), qo(e))) {
    const i = kn(e, t, !0)
    return (
      n && Bl(i, n),
      Yr > 0 && !o && un && (i.shapeFlag & 6 ? (un[un.indexOf(e)] = i) : un.push(i)),
      (i.patchFlag |= -2),
      i
    )
  }
  if ((WE(e) && (e = e.__vccOpts), t)) {
    t = ME(t)
    let { class: i, style: u } = t
    ;(i && !ft(i) && (t.class = Sl(i)), rt(u) && (Wf(u) && !ve(u) && (u = pt({}, u)), (t.style = bl(u))))
  }
  const a = ft(e) ? 1 : Xp(e) ? 128 : TE(e) ? 64 : rt(e) ? 4 : Ce(e) ? 2 : 0
  return C(e, t, n, s, r, a, o, !0)
}
function ME(e) {
  return e ? (Wf(e) || Oa in e ? pt({}, e) : e) : null
}
function kn(e, t, n = !1) {
  const { props: s, ref: r, patchFlag: o, children: a } = e,
    i = t ? Ge(s || {}, t) : s
  return {
    __v_isVNode: !0,
    __v_skip: !0,
    type: e.type,
    props: i,
    key: i && Sm(i),
    ref: t && t.ref ? (n && r ? (ve(r) ? r.concat($o(t)) : [r, $o(t)]) : $o(t)) : r,
    scopeId: e.scopeId,
    slotScopeIds: e.slotScopeIds,
    children: a,
    target: e.target,
    targetAnchor: e.targetAnchor,
    staticCount: e.staticCount,
    shapeFlag: e.shapeFlag,
    patchFlag: t && e.type !== Ue ? (o === -1 ? 16 : o | 16) : o,
    dynamicProps: e.dynamicProps,
    dynamicChildren: e.dynamicChildren,
    appContext: e.appContext,
    dirs: e.dirs,
    transition: e.transition,
    component: e.component,
    suspense: e.suspense,
    ssContent: e.ssContent && kn(e.ssContent),
    ssFallback: e.ssFallback && kn(e.ssFallback),
    el: e.el,
    anchor: e.anchor,
    ctx: e.ctx,
    ce: e.ce
  }
}
function ee(e = ' ', t = 0) {
  return l(fr, null, e, t)
}
function We(e = '', t = !1) {
  return t ? (F(), G(sn, null, e)) : l(sn, null, e)
}
function En(e) {
  return e == null || typeof e == 'boolean'
    ? l(sn)
    : ve(e)
      ? l(Ue, null, e.slice())
      : typeof e == 'object'
        ? Jn(e)
        : l(fr, null, String(e))
}
function Jn(e) {
  return (e.el === null && e.patchFlag !== -1) || e.memo ? e : kn(e)
}
function Bl(e, t) {
  let n = 0
  const { shapeFlag: s } = e
  if (t == null) t = null
  else if (ve(t)) n = 16
  else if (typeof t == 'object')
    if (s & 65) {
      const r = t.default
      r && (r._c && (r._d = !1), Bl(e, r()), r._c && (r._d = !0))
      return
    } else {
      n = 32
      const r = t._
      !r && !(Oa in t)
        ? (t._ctx = ht)
        : r === 3 && ht && (ht.slots._ === 1 ? (t._ = 1) : ((t._ = 2), (e.patchFlag |= 1024)))
    }
  else
    Ce(t) ? ((t = { default: t, _ctx: ht }), (n = 32)) : ((t = String(t)), s & 64 ? ((n = 16), (t = [ee(t)])) : (n = 8))
  ;((e.children = t), (e.shapeFlag |= n))
}
function Ge(...e) {
  const t = {}
  for (let n = 0; n < e.length; n++) {
    const s = e[n]
    for (const r in s)
      if (r === 'class') t.class !== s.class && (t.class = Sl([t.class, s.class]))
      else if (r === 'style') t.style = bl([t.style, s.style])
      else if (ma(r)) {
        const o = t[r],
          a = s[r]
        a && o !== a && !(ve(o) && o.includes(a)) && (t[r] = o ? [].concat(o, a) : a)
      } else r !== '' && (t[r] = s[r])
  }
  return t
}
function gn(e, t, n, s = null) {
  nn(e, t, 7, [n, s])
}
const kE = mm()
let DE = 0
function FE(e, t, n) {
  const s = e.type,
    r = (t ? t.appContext : e.appContext) || kE,
    o = {
      uid: DE++,
      vnode: e,
      type: s,
      parent: t,
      appContext: r,
      root: null,
      next: null,
      subTree: null,
      effect: null,
      update: null,
      scope: new Nf(!0),
      render: null,
      proxy: null,
      exposed: null,
      exposeProxy: null,
      withProxy: null,
      provides: t ? t.provides : Object.create(r.provides),
      accessCache: null,
      renderCache: [],
      components: null,
      directives: null,
      propsOptions: gm(s, r),
      emitsOptions: Zf(s, r),
      emit: null,
      emitted: null,
      propsDefaults: ot,
      inheritAttrs: s.inheritAttrs,
      ctx: ot,
      data: ot,
      props: ot,
      attrs: ot,
      slots: ot,
      refs: ot,
      setupState: ot,
      setupContext: null,
      attrsProxy: null,
      slotsProxy: null,
      suspense: n,
      suspenseId: n ? n.pendingId : 0,
      asyncDep: null,
      asyncResolved: !1,
      isMounted: !1,
      isUnmounted: !1,
      isDeactivated: !1,
      bc: null,
      c: null,
      bm: null,
      m: null,
      bu: null,
      u: null,
      um: null,
      bum: null,
      da: null,
      a: null,
      rtg: null,
      rtc: null,
      ec: null,
      sp: null
    }
  return ((o.ctx = { _: o }), (o.root = t ? t.root : o), (o.emit = Wp.bind(null, o)), e.ce && e.ce(o), o)
}
let St = null
const os = () => St || ht
let zo, $i
{
  const e = Af(),
    t = (n, s) => {
      let r
      return (
        (r = e[n]) || (r = e[n] = []),
        r.push(s),
        o => {
          r.length > 1 ? r.forEach(a => a(o)) : r[0](o)
        }
      )
    }
  ;((zo = t('__VUE_INSTANCE_SETTERS__', n => (St = n))), ($i = t('__VUE_SSR_SETTERS__', n => (Ca = n))))
}
const ro = e => {
    const t = St
    return (
      zo(e),
      e.scope.on(),
      () => {
        ;(e.scope.off(), zo(t))
      }
    )
  },
  zu = () => {
    ;(St && St.scope.off(), zo(null))
  }
function Rm(e) {
  return e.vnode.shapeFlag & 4
}
let Ca = !1
function VE(e, t = !1) {
  t && $i(t)
  const { props: n, children: s } = e.vnode,
    r = Rm(e)
  ;(yE(e, n, r, t), SE(e, s))
  const o = r ? xE(e, t) : void 0
  return (t && $i(!1), o)
}
function xE(e, t) {
  const n = e.type
  ;((e.accessCache = Object.create(null)), (e.proxy = Ea(new Proxy(e.ctx, cE))))
  const { setup: s } = n
  if (s) {
    const r = (e.setupContext = s.length > 1 ? UE(e) : null),
      o = ro(e)
    Ts()
    const a = ns(s, e, 0, [e.props, r])
    if ((Ns(), o(), Rf(a))) {
      if ((a.then(zu, zu), t))
        return a
          .then(i => {
            Xu(e, i, t)
          })
          .catch(i => {
            ya(i, e, 0)
          })
      e.asyncDep = a
    } else Xu(e, a, t)
  } else Om(e, t)
}
function Xu(e, t, n) {
  ;(Ce(t) ? (e.type.__ssrInlineRender ? (e.ssrRender = t) : (e.render = t)) : rt(t) && (e.setupState = Kf(t)), Om(e, n))
}
let Ju
function Om(e, t, n) {
  const s = e.type
  if (!e.render) {
    if (!t && Ju && !s.render) {
      const r = s.template || Fl(e).template
      if (r) {
        const { isCustomElement: o, compilerOptions: a } = e.appContext.config,
          { delimiters: i, compilerOptions: u } = s,
          c = pt(pt({ isCustomElement: o, delimiters: i }, a), u)
        s.render = Ju(r, c)
      }
    }
    e.render = s.render || tn
  }
  {
    const r = ro(e)
    Ts()
    try {
      dE(e)
    } finally {
      ;(Ns(), r())
    }
  }
}
function BE(e) {
  return (
    e.attrsProxy ||
    (e.attrsProxy = new Proxy(e.attrs, {
      get(t, n) {
        return (Gt(e, 'get', '$attrs'), t[n])
      }
    }))
  )
}
function UE(e) {
  const t = n => {
    e.exposed = n || {}
  }
  return {
    get attrs() {
      return BE(e)
    },
    slots: e.slots,
    emit: e.emit,
    expose: t
  }
}
function Aa(e) {
  if (e.exposed)
    return (
      e.exposeProxy ||
      (e.exposeProxy = new Proxy(Kf(Ea(e.exposed)), {
        get(t, n) {
          if (n in t) return t[n]
          if (n in Tr) return Tr[n](e)
        },
        has(t, n) {
          return n in t || n in Tr
        }
      }))
    )
}
function GE(e, t = !0) {
  return Ce(e) ? e.displayName || e.name : e.name || (t && e.__name)
}
function WE(e) {
  return Ce(e) && '__vccOpts' in e
}
const M = (e, t) => $p(e, t, Ca)
function Rn(e, t, n) {
  const s = arguments.length
  return s === 2
    ? rt(t) && !ve(t)
      ? qo(t)
        ? l(e, null, [t])
        : l(e, t)
      : l(e, null, t)
    : (s > 3 ? (n = Array.prototype.slice.call(arguments, 2)) : s === 3 && qo(n) && (n = [n]), l(e, t, n))
}
const HE = '3.4.21'
/**
 * @vue/runtime-dom v3.4.21
 * (c) 2018-present Yuxi (Evan) You and Vue contributors
 * @license MIT
 **/ const jE = 'http://www.w3.org/2000/svg',
  YE = 'http://www.w3.org/1998/Math/MathML',
  Qn = typeof document < 'u' ? document : null,
  Qu = Qn && Qn.createElement('template'),
  KE = {
    insert: (e, t, n) => {
      t.insertBefore(e, n || null)
    },
    remove: e => {
      const t = e.parentNode
      t && t.removeChild(e)
    },
    createElement: (e, t, n, s) => {
      const r =
        t === 'svg'
          ? Qn.createElementNS(jE, e)
          : t === 'mathml'
            ? Qn.createElementNS(YE, e)
            : Qn.createElement(e, n ? { is: n } : void 0)
      return (e === 'select' && s && s.multiple != null && r.setAttribute('multiple', s.multiple), r)
    },
    createText: e => Qn.createTextNode(e),
    createComment: e => Qn.createComment(e),
    setText: (e, t) => {
      e.nodeValue = t
    },
    setElementText: (e, t) => {
      e.textContent = t
    },
    parentNode: e => e.parentNode,
    nextSibling: e => e.nextSibling,
    querySelector: e => Qn.querySelector(e),
    setScopeId(e, t) {
      e.setAttribute(t, '')
    },
    insertStaticContent(e, t, n, s, r, o) {
      const a = n ? n.previousSibling : t.lastChild
      if (r && (r === o || r.nextSibling))
        for (; t.insertBefore(r.cloneNode(!0), n), !(r === o || !(r = r.nextSibling)); );
      else {
        Qu.innerHTML = s === 'svg' ? `<svg>${e}</svg>` : s === 'mathml' ? `<math>${e}</math>` : e
        const i = Qu.content
        if (s === 'svg' || s === 'mathml') {
          const u = i.firstChild
          for (; u.firstChild; ) i.appendChild(u.firstChild)
          i.removeChild(u)
        }
        t.insertBefore(i, n)
      }
      return [a ? a.nextSibling : t.firstChild, n ? n.previousSibling : t.lastChild]
    }
  },
  Wn = 'transition',
  yr = 'animation',
  Qs = Symbol('_vtc'),
  Dn = (e, { slots: t }) => Rn(nE, Am(e), t)
Dn.displayName = 'Transition'
const Cm = {
    name: String,
    type: String,
    css: { type: Boolean, default: !0 },
    duration: [String, Number, Object],
    enterFromClass: String,
    enterActiveClass: String,
    enterToClass: String,
    appearFromClass: String,
    appearActiveClass: String,
    appearToClass: String,
    leaveFromClass: String,
    leaveActiveClass: String,
    leaveToClass: String
  },
  qE = (Dn.props = pt({}, rm, Cm)),
  gs = (e, t = []) => {
    ve(e) ? e.forEach(n => n(...t)) : e && e(...t)
  },
  Zu = e => (e ? (ve(e) ? e.some(t => t.length > 1) : e.length > 1) : !1)
function Am(e) {
  const t = {}
  for (const D in e) D in Cm || (t[D] = e[D])
  if (e.css === !1) return t
  const {
      name: n = 'v',
      type: s,
      duration: r,
      enterFromClass: o = `${n}-enter-from`,
      enterActiveClass: a = `${n}-enter-active`,
      enterToClass: i = `${n}-enter-to`,
      appearFromClass: u = o,
      appearActiveClass: c = a,
      appearToClass: d = i,
      leaveFromClass: m = `${n}-leave-from`,
      leaveActiveClass: h = `${n}-leave-active`,
      leaveToClass: E = `${n}-leave-to`
    } = e,
    y = zE(r),
    v = y && y[0],
    I = y && y[1],
    {
      onBeforeEnter: b,
      onEnter: O,
      onEnterCancelled: P,
      onLeave: T,
      onLeaveCancelled: $,
      onBeforeAppear: L = b,
      onAppear: N = O,
      onAppearCancelled: A = P
    } = t,
    w = (D, U, X) => {
      ;(Kn(D, U ? d : i), Kn(D, U ? c : a), X && X())
    },
    B = (D, U) => {
      ;((D._isLeaving = !1), Kn(D, m), Kn(D, E), Kn(D, h), U && U())
    },
    j = D => (U, X) => {
      const ge = D ? N : O,
        te = () => w(U, D, X)
      ;(gs(ge, [U, te]),
        ec(() => {
          ;(Kn(U, D ? u : o), Ln(U, D ? d : i), Zu(ge) || tc(U, s, v, te))
        }))
    }
  return pt(t, {
    onBeforeEnter(D) {
      ;(gs(b, [D]), Ln(D, o), Ln(D, a))
    },
    onBeforeAppear(D) {
      ;(gs(L, [D]), Ln(D, u), Ln(D, c))
    },
    onEnter: j(!1),
    onAppear: j(!0),
    onLeave(D, U) {
      D._isLeaving = !0
      const X = () => B(D, U)
      ;(Ln(D, m),
        Tm(),
        Ln(D, h),
        ec(() => {
          D._isLeaving && (Kn(D, m), Ln(D, E), Zu(T) || tc(D, s, I, X))
        }),
        gs(T, [D, X]))
    },
    onEnterCancelled(D) {
      ;(w(D, !1), gs(P, [D]))
    },
    onAppearCancelled(D) {
      ;(w(D, !0), gs(A, [D]))
    },
    onLeaveCancelled(D) {
      ;(B(D), gs($, [D]))
    }
  })
}
function zE(e) {
  if (e == null) return null
  if (rt(e)) return [ti(e.enter), ti(e.leave)]
  {
    const t = ti(e)
    return [t, t]
  }
}
function ti(e) {
  return op(e)
}
function Ln(e, t) {
  ;(t.split(/\s+/).forEach(n => n && e.classList.add(n)), (e[Qs] || (e[Qs] = new Set())).add(t))
}
function Kn(e, t) {
  t.split(/\s+/).forEach(s => s && e.classList.remove(s))
  const n = e[Qs]
  n && (n.delete(t), n.size || (e[Qs] = void 0))
}
function ec(e) {
  requestAnimationFrame(() => {
    requestAnimationFrame(e)
  })
}
let XE = 0
function tc(e, t, n, s) {
  const r = (e._endId = ++XE),
    o = () => {
      r === e._endId && s()
    }
  if (n) return setTimeout(o, n)
  const { type: a, timeout: i, propCount: u } = Im(e, t)
  if (!a) return s()
  const c = a + 'end'
  let d = 0
  const m = () => {
      ;(e.removeEventListener(c, h), o())
    },
    h = E => {
      E.target === e && ++d >= u && m()
    }
  ;(setTimeout(() => {
    d < u && m()
  }, i + 1),
    e.addEventListener(c, h))
}
function Im(e, t) {
  const n = window.getComputedStyle(e),
    s = y => (n[y] || '').split(', '),
    r = s(`${Wn}Delay`),
    o = s(`${Wn}Duration`),
    a = nc(r, o),
    i = s(`${yr}Delay`),
    u = s(`${yr}Duration`),
    c = nc(i, u)
  let d = null,
    m = 0,
    h = 0
  t === Wn
    ? a > 0 && ((d = Wn), (m = a), (h = o.length))
    : t === yr
      ? c > 0 && ((d = yr), (m = c), (h = u.length))
      : ((m = Math.max(a, c)), (d = m > 0 ? (a > c ? Wn : yr) : null), (h = d ? (d === Wn ? o.length : u.length) : 0))
  const E = d === Wn && /\b(transform|all)(,|$)/.test(s(`${Wn}Property`).toString())
  return { type: d, timeout: m, propCount: h, hasTransform: E }
}
function nc(e, t) {
  for (; e.length < t.length; ) e = e.concat(e)
  return Math.max(...t.map((n, s) => sc(n) + sc(e[s])))
}
function sc(e) {
  return e === 'auto' ? 0 : Number(e.slice(0, -1).replace(',', '.')) * 1e3
}
function Tm() {
  return document.body.offsetHeight
}
function JE(e, t, n) {
  const s = e[Qs]
  ;(s && (t = (t ? [t, ...s] : [...s]).join(' ')),
    t == null ? e.removeAttribute('class') : n ? e.setAttribute('class', t) : (e.className = t))
}
const Xo = Symbol('_vod'),
  Nm = Symbol('_vsh'),
  Wt = {
    beforeMount(e, { value: t }, { transition: n }) {
      ;((e[Xo] = e.style.display === 'none' ? '' : e.style.display), n && t ? n.beforeEnter(e) : vr(e, t))
    },
    mounted(e, { value: t }, { transition: n }) {
      n && t && n.enter(e)
    },
    updated(e, { value: t, oldValue: n }, { transition: s }) {
      !t != !n &&
        (s
          ? t
            ? (s.beforeEnter(e), vr(e, !0), s.enter(e))
            : s.leave(e, () => {
                vr(e, !1)
              })
          : vr(e, t))
    },
    beforeUnmount(e, { value: t }) {
      vr(e, t)
    }
  }
function vr(e, t) {
  ;((e.style.display = t ? e[Xo] : 'none'), (e[Nm] = !t))
}
const QE = Symbol(''),
  ZE = /(^|;)\s*display\s*:/
function e_(e, t, n) {
  const s = e.style,
    r = ft(n)
  let o = !1
  if (n && !r) {
    if (t)
      if (ft(t))
        for (const a of t.split(';')) {
          const i = a.slice(0, a.indexOf(':')).trim()
          n[i] == null && Mo(s, i, '')
        }
      else for (const a in t) n[a] == null && Mo(s, a, '')
    for (const a in n) (a === 'display' && (o = !0), Mo(s, a, n[a]))
  } else if (r) {
    if (t !== n) {
      const a = s[QE]
      ;(a && (n += ';' + a), (s.cssText = n), (o = ZE.test(n)))
    }
  } else t && e.removeAttribute('style')
  Xo in e && ((e[Xo] = o ? s.display : ''), e[Nm] && (s.display = 'none'))
}
const rc = /\s*!important$/
function Mo(e, t, n) {
  if (ve(n)) n.forEach(s => Mo(e, t, s))
  else if ((n == null && (n = ''), t.startsWith('--'))) e.setProperty(t, n)
  else {
    const s = t_(e, t)
    rc.test(n) ? e.setProperty(lr(s), n.replace(rc, ''), 'important') : (e[s] = n)
  }
}
const oc = ['Webkit', 'Moz', 'ms'],
  ni = {}
function t_(e, t) {
  const n = ni[t]
  if (n) return n
  let s = on(t)
  if (s !== 'filter' && s in e) return (ni[t] = s)
  s = ur(s)
  for (let r = 0; r < oc.length; r++) {
    const o = oc[r] + s
    if (o in e) return (ni[t] = o)
  }
  return t
}
const ac = 'http://www.w3.org/1999/xlink'
function n_(e, t, n, s, r) {
  if (s && t.startsWith('xlink:'))
    n == null ? e.removeAttributeNS(ac, t.slice(6, t.length)) : e.setAttributeNS(ac, t, n)
  else {
    const o = dp(t)
    n == null || (o && !If(n)) ? e.removeAttribute(t) : e.setAttribute(t, o ? '' : n)
  }
}
function s_(e, t, n, s, r, o, a) {
  if (t === 'innerHTML' || t === 'textContent') {
    ;(s && a(s, r, o), (e[t] = n ?? ''))
    return
  }
  const i = e.tagName
  if (t === 'value' && i !== 'PROGRESS' && !i.includes('-')) {
    const c = i === 'OPTION' ? e.getAttribute('value') || '' : e.value,
      d = n ?? ''
    ;((c !== d || !('_value' in e)) && (e.value = d), n == null && e.removeAttribute(t), (e._value = n))
    return
  }
  let u = !1
  if (n === '' || n == null) {
    const c = typeof e[t]
    c === 'boolean'
      ? (n = If(n))
      : n == null && c === 'string'
        ? ((n = ''), (u = !0))
        : c === 'number' && ((n = 0), (u = !0))
  }
  try {
    e[t] = n
  } catch {}
  u && e.removeAttribute(t)
}
function r_(e, t, n, s) {
  e.addEventListener(t, n, s)
}
function o_(e, t, n, s) {
  e.removeEventListener(t, n, s)
}
const ic = Symbol('_vei')
function a_(e, t, n, s, r = null) {
  const o = e[ic] || (e[ic] = {}),
    a = o[t]
  if (s && a) a.value = s
  else {
    const [i, u] = i_(t)
    if (s) {
      const c = (o[t] = c_(s, r))
      r_(e, i, c, u)
    } else a && (o_(e, i, a, u), (o[t] = void 0))
  }
}
const lc = /(?:Once|Passive|Capture)$/
function i_(e) {
  let t
  if (lc.test(e)) {
    t = {}
    let s
    for (; (s = e.match(lc)); ) ((e = e.slice(0, e.length - s[0].length)), (t[s[0].toLowerCase()] = !0))
  }
  return [e[2] === ':' ? e.slice(3) : lr(e.slice(2)), t]
}
let si = 0
const l_ = Promise.resolve(),
  u_ = () => si || (l_.then(() => (si = 0)), (si = Date.now()))
function c_(e, t) {
  const n = s => {
    if (!s._vts) s._vts = Date.now()
    else if (s._vts <= n.attached) return
    nn(d_(s, n.value), t, 5, [s])
  }
  return ((n.value = e), (n.attached = u_()), n)
}
function d_(e, t) {
  if (ve(t)) {
    const n = e.stopImmediatePropagation
    return (
      (e.stopImmediatePropagation = () => {
        ;(n.call(e), (e._stopped = !0))
      }),
      t.map(s => r => !r._stopped && s && s(r))
    )
  } else return t
}
const uc = e => e.charCodeAt(0) === 111 && e.charCodeAt(1) === 110 && e.charCodeAt(2) > 96 && e.charCodeAt(2) < 123,
  f_ = (e, t, n, s, r, o, a, i, u) => {
    const c = r === 'svg'
    t === 'class'
      ? JE(e, s, c)
      : t === 'style'
        ? e_(e, n, s)
        : ma(t)
          ? _l(t) || a_(e, t, n, s, a)
          : (t[0] === '.' ? ((t = t.slice(1)), !0) : t[0] === '^' ? ((t = t.slice(1)), !1) : m_(e, t, s, c))
            ? s_(e, t, s, o, a, i, u)
            : (t === 'true-value' ? (e._trueValue = s) : t === 'false-value' && (e._falseValue = s), n_(e, t, s, c))
  }
function m_(e, t, n, s) {
  if (s) return !!(t === 'innerHTML' || t === 'textContent' || (t in e && uc(t) && Ce(n)))
  if (
    t === 'spellcheck' ||
    t === 'draggable' ||
    t === 'translate' ||
    t === 'form' ||
    (t === 'list' && e.tagName === 'INPUT') ||
    (t === 'type' && e.tagName === 'TEXTAREA')
  )
    return !1
  if (t === 'width' || t === 'height') {
    const r = e.tagName
    if (r === 'IMG' || r === 'VIDEO' || r === 'CANVAS' || r === 'SOURCE') return !1
  }
  return uc(t) && ft(n) ? !1 : t in e
}
const wm = new WeakMap(),
  Lm = new WeakMap(),
  Jo = Symbol('_moveCb'),
  cc = Symbol('_enterCb'),
  Pm = {
    name: 'TransitionGroup',
    props: pt({}, qE, { tag: String, moveClass: String }),
    setup(e, { slots: t }) {
      const n = os(),
        s = sm()
      let r, o
      return (
        cm(() => {
          if (!r.length) return
          const a = e.moveClass || `${e.name || 'v'}-move`
          if (!__(r[0].el, n.vnode.el, a)) return
          ;(r.forEach(g_), r.forEach(p_))
          const i = r.filter(E_)
          ;(Tm(),
            i.forEach(u => {
              const c = u.el,
                d = c.style
              ;(Ln(c, a), (d.transform = d.webkitTransform = d.transitionDuration = ''))
              const m = (c[Jo] = h => {
                ;(h && h.target !== c) ||
                  ((!h || /transform$/.test(h.propertyName)) &&
                    (c.removeEventListener('transitionend', m), (c[Jo] = null), Kn(c, a)))
              })
              c.addEventListener('transitionend', m)
            }))
        }),
        () => {
          const a = Me(e),
            i = Am(a)
          let u = a.tag || Ue
          ;((r = o), (o = t.default ? kl(t.default()) : []))
          for (let c = 0; c < o.length; c++) {
            const d = o[c]
            d.key != null && jr(d, Hr(d, i, s, n))
          }
          if (r)
            for (let c = 0; c < r.length; c++) {
              const d = r[c]
              ;(jr(d, Hr(d, i, s, n)), wm.set(d, d.el.getBoundingClientRect()))
            }
          return l(u, null, o)
        }
      )
    }
  },
  h_ = e => delete e.mode
Pm.props
const $m = Pm
function g_(e) {
  const t = e.el
  ;(t[Jo] && t[Jo](), t[cc] && t[cc]())
}
function p_(e) {
  Lm.set(e, e.el.getBoundingClientRect())
}
function E_(e) {
  const t = wm.get(e),
    n = Lm.get(e),
    s = t.left - n.left,
    r = t.top - n.top
  if (s || r) {
    const o = e.el.style
    return ((o.transform = o.webkitTransform = `translate(${s}px,${r}px)`), (o.transitionDuration = '0s'), e)
  }
}
function __(e, t, n) {
  const s = e.cloneNode(),
    r = e[Qs]
  ;(r &&
    r.forEach(i => {
      i.split(/\s+/).forEach(u => u && s.classList.remove(u))
    }),
    n.split(/\s+/).forEach(i => i && s.classList.add(i)),
    (s.style.display = 'none'))
  const o = t.nodeType === 1 ? t : t.parentNode
  o.appendChild(s)
  const { hasTransform: a } = Im(s)
  return (o.removeChild(s), a)
}
const y_ = ['ctrl', 'shift', 'alt', 'meta'],
  v_ = {
    stop: e => e.stopPropagation(),
    prevent: e => e.preventDefault(),
    self: e => e.target !== e.currentTarget,
    ctrl: e => !e.ctrlKey,
    shift: e => !e.shiftKey,
    alt: e => !e.altKey,
    meta: e => !e.metaKey,
    left: e => 'button' in e && e.button !== 0,
    middle: e => 'button' in e && e.button !== 1,
    right: e => 'button' in e && e.button !== 2,
    exact: (e, t) => y_.some(n => e[`${n}Key`] && !t.includes(n))
  },
  us = (e, t) => {
    const n = e._withMods || (e._withMods = {}),
      s = t.join('.')
    return (
      n[s] ||
      (n[s] = (r, ...o) => {
        for (let a = 0; a < t.length; a++) {
          const i = v_[t[a]]
          if (i && i(r, t)) return
        }
        return e(r, ...o)
      })
    )
  },
  b_ = pt({ patchProp: f_ }, KE)
let dc
function S_() {
  return dc || (dc = OE(b_))
}
const R_ = (...e) => {
  const t = S_().createApp(...e),
    { mount: n } = t
  return (
    (t.mount = s => {
      const r = C_(s)
      if (!r) return
      const o = t._component
      ;(!Ce(o) && !o.render && !o.template && (o.template = r.innerHTML), (r.innerHTML = ''))
      const a = n(r, !1, O_(r))
      return (r instanceof Element && (r.removeAttribute('v-cloak'), r.setAttribute('data-v-app', '')), a)
    }),
    t
  )
}
function O_(e) {
  if (e instanceof SVGElement) return 'svg'
  if (typeof MathMLElement == 'function' && e instanceof MathMLElement) return 'mathml'
}
function C_(e) {
  return ft(e) ? document.querySelector(e) : e
}
var A_ = !1
/*!
 * pinia v2.1.7
 * (c) 2023 Eduardo San Martin Morote
 * @license MIT
 */ let Mm
const Ia = e => (Mm = e),
  km = Symbol()
function Mi(e) {
  return (
    e &&
    typeof e == 'object' &&
    Object.prototype.toString.call(e) === '[object Object]' &&
    typeof e.toJSON != 'function'
  )
}
var Lr
;(function (e) {
  ;((e.direct = 'direct'), (e.patchObject = 'patch object'), (e.patchFunction = 'patch function'))
})(Lr || (Lr = {}))
function I_() {
  const e = cr(!0),
    t = e.run(() => _e({}))
  let n = [],
    s = []
  const r = Ea({
    install(o) {
      ;(Ia(r),
        (r._a = o),
        o.provide(km, r),
        (o.config.globalProperties.$pinia = r),
        s.forEach(a => n.push(a)),
        (s = []))
    },
    use(o) {
      return (!this._a && !A_ ? s.push(o) : n.push(o), this)
    },
    _p: n,
    _a: null,
    _e: e,
    _s: new Map(),
    state: t
  })
  return r
}
const Dm = () => {}
function fc(e, t, n, s = Dm) {
  e.push(t)
  const r = () => {
    const o = e.indexOf(t)
    o > -1 && (e.splice(o, 1), s())
  }
  return (!n && wf() && Ht(r), r)
}
function Fs(e, ...t) {
  e.slice().forEach(n => {
    n(...t)
  })
}
const T_ = e => e()
function ki(e, t) {
  ;(e instanceof Map && t instanceof Map && t.forEach((n, s) => e.set(s, n)),
    e instanceof Set && t instanceof Set && t.forEach(e.add, e))
  for (const n in t) {
    if (!t.hasOwnProperty(n)) continue
    const s = t[n],
      r = e[n]
    Mi(r) && Mi(s) && e.hasOwnProperty(n) && !nt(s) && !ts(s) ? (e[n] = ki(r, s)) : (e[n] = s)
  }
  return e
}
const N_ = Symbol()
function w_(e) {
  return !Mi(e) || !e.hasOwnProperty(N_)
}
const { assign: qn } = Object
function L_(e) {
  return !!(nt(e) && e.effect)
}
function P_(e, t, n, s) {
  const { state: r, actions: o, getters: a } = t,
    i = n.state.value[e]
  let u
  function c() {
    i || (n.state.value[e] = r ? r() : {})
    const d = _a(n.state.value[e])
    return qn(
      d,
      o,
      Object.keys(a || {}).reduce(
        (m, h) => (
          (m[h] = Ea(
            M(() => {
              Ia(n)
              const E = n._s.get(e)
              return a[h].call(E, E)
            })
          )),
          m
        ),
        {}
      )
    )
  }
  return ((u = Fm(e, c, t, n, s, !0)), u)
}
function Fm(e, t, n = {}, s, r, o) {
  let a
  const i = qn({ actions: {} }, n),
    u = { deep: !0 }
  let c,
    d,
    m = [],
    h = [],
    E
  const y = s.state.value[e]
  ;(!o && !y && (s.state.value[e] = {}), _e({}))
  let v
  function I(A) {
    let w
    ;((c = d = !1),
      typeof A == 'function'
        ? (A(s.state.value[e]), (w = { type: Lr.patchFunction, storeId: e, events: E }))
        : (ki(s.state.value[e], A), (w = { type: Lr.patchObject, payload: A, storeId: e, events: E })))
    const B = (v = Symbol())
    ;(Et().then(() => {
      v === B && (c = !0)
    }),
      (d = !0),
      Fs(m, w, s.state.value[e]))
  }
  const b = o
    ? function () {
        const { state: w } = n,
          B = w ? w() : {}
        this.$patch(j => {
          qn(j, B)
        })
      }
    : Dm
  function O() {
    ;(a.stop(), (m = []), (h = []), s._s.delete(e))
  }
  function P(A, w) {
    return function () {
      Ia(s)
      const B = Array.from(arguments),
        j = [],
        D = []
      function U(te) {
        j.push(te)
      }
      function X(te) {
        D.push(te)
      }
      Fs(h, { args: B, name: A, store: $, after: U, onError: X })
      let ge
      try {
        ge = w.apply(this && this.$id === e ? this : $, B)
      } catch (te) {
        throw (Fs(D, te), te)
      }
      return ge instanceof Promise
        ? ge.then(te => (Fs(j, te), te)).catch(te => (Fs(D, te), Promise.reject(te)))
        : (Fs(j, ge), ge)
    }
  }
  const T = {
      _p: s,
      $id: e,
      $onAction: fc.bind(null, h),
      $patch: I,
      $reset: b,
      $subscribe(A, w = {}) {
        const B = fc(m, A, w.detached, () => j()),
          j = a.run(() =>
            be(
              () => s.state.value[e],
              D => {
                ;(w.flush === 'sync' ? d : c) && A({ storeId: e, type: Lr.direct, events: E }, D)
              },
              qn({}, u, w)
            )
          )
        return B
      },
      $dispose: O
    },
    $ = At(T)
  s._s.set(e, $)
  const N = ((s._a && s._a.runWithContext) || T_)(() => s._e.run(() => (a = cr()).run(t)))
  for (const A in N) {
    const w = N[A]
    if ((nt(w) && !L_(w)) || ts(w))
      o || (y && w_(w) && (nt(w) ? (w.value = y[A]) : ki(w, y[A])), (s.state.value[e][A] = w))
    else if (typeof w == 'function') {
      const B = P(A, w)
      ;((N[A] = B), (i.actions[A] = w))
    }
  }
  return (
    qn($, N),
    qn(Me($), N),
    Object.defineProperty($, '$state', {
      get: () => s.state.value[e],
      set: A => {
        I(w => {
          qn(w, A)
        })
      }
    }),
    s._p.forEach(A => {
      qn(
        $,
        a.run(() => A({ store: $, app: s._a, pinia: s, options: i }))
      )
    }),
    y && o && n.hydrate && n.hydrate($.$state, y),
    (c = !0),
    (d = !0),
    $
  )
}
function jt(e, t, n) {
  let s, r
  const o = typeof t == 'function'
  typeof e == 'string' ? ((s = e), (r = o ? n : t)) : ((r = e), (s = e.id))
  function a(i, u) {
    const c = _E()
    return (
      (i = i || (c ? it(km, null) : null)),
      i && Ia(i),
      (i = Mm),
      i._s.has(s) || (o ? Fm(s, t, r, i) : P_(s, r, i)),
      i._s.get(s)
    )
  }
  return ((a.$id = s), a)
}
function Ke(e, t) {
  return Array.isArray(t)
    ? t.reduce(
        (n, s) => (
          (n[s] = function () {
            return e(this.$pinia)[s]
          }),
          n
        ),
        {}
      )
    : Object.keys(t).reduce(
        (n, s) => (
          (n[s] = function () {
            const r = e(this.$pinia),
              o = t[s]
            return typeof o == 'function' ? o.call(this, r) : r[o]
          }),
          n
        ),
        {}
      )
}
function Ye(e, t) {
  return Array.isArray(t)
    ? t.reduce(
        (n, s) => (
          (n[s] = function (...r) {
            return e(this.$pinia)[s](...r)
          }),
          n
        ),
        {}
      )
    : Object.keys(t).reduce(
        (n, s) => (
          (n[s] = function (...r) {
            return e(this.$pinia)[t[s]](...r)
          }),
          n
        ),
        {}
      )
}
function an(e, t) {
  return Array.isArray(t)
    ? t.reduce(
        (n, s) => (
          (n[s] = {
            get() {
              return e(this.$pinia)[s]
            },
            set(r) {
              return (e(this.$pinia)[s] = r)
            }
          }),
          n
        ),
        {}
      )
    : Object.keys(t).reduce(
        (n, s) => (
          (n[s] = {
            get() {
              return e(this.$pinia)[t[s]]
            },
            set(r) {
              return (e(this.$pinia)[t[s]] = r)
            }
          }),
          n
        ),
        {}
      )
}
function Vm(e, t) {
  return function () {
    return e.apply(t, arguments)
  }
}
const { toString: $_ } = Object.prototype,
  { getPrototypeOf: Ul } = Object,
  Ta = (e => t => {
    const n = $_.call(t)
    return e[n] || (e[n] = n.slice(8, -1).toLowerCase())
  })(Object.create(null)),
  On = e => ((e = e.toLowerCase()), t => Ta(t) === e),
  Na = e => t => typeof t === e,
  { isArray: mr } = Array,
  Kr = Na('undefined')
function M_(e) {
  return (
    e !== null &&
    !Kr(e) &&
    e.constructor !== null &&
    !Kr(e.constructor) &&
    rn(e.constructor.isBuffer) &&
    e.constructor.isBuffer(e)
  )
}
const xm = On('ArrayBuffer')
function k_(e) {
  let t
  return (
    typeof ArrayBuffer < 'u' && ArrayBuffer.isView ? (t = ArrayBuffer.isView(e)) : (t = e && e.buffer && xm(e.buffer)),
    t
  )
}
const D_ = Na('string'),
  rn = Na('function'),
  Bm = Na('number'),
  wa = e => e !== null && typeof e == 'object',
  F_ = e => e === !0 || e === !1,
  ko = e => {
    if (Ta(e) !== 'object') return !1
    const t = Ul(e)
    return (
      (t === null || t === Object.prototype || Object.getPrototypeOf(t) === null) &&
      !(Symbol.toStringTag in e) &&
      !(Symbol.iterator in e)
    )
  },
  V_ = On('Date'),
  x_ = On('File'),
  B_ = On('Blob'),
  U_ = On('FileList'),
  G_ = e => wa(e) && rn(e.pipe),
  W_ = e => {
    let t
    return (
      e &&
      ((typeof FormData == 'function' && e instanceof FormData) ||
        (rn(e.append) &&
          ((t = Ta(e)) === 'formdata' || (t === 'object' && rn(e.toString) && e.toString() === '[object FormData]'))))
    )
  },
  H_ = On('URLSearchParams'),
  j_ = e => (e.trim ? e.trim() : e.replace(/^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g, ''))
function oo(e, t, { allOwnKeys: n = !1 } = {}) {
  if (e === null || typeof e > 'u') return
  let s, r
  if ((typeof e != 'object' && (e = [e]), mr(e))) for (s = 0, r = e.length; s < r; s++) t.call(null, e[s], s, e)
  else {
    const o = n ? Object.getOwnPropertyNames(e) : Object.keys(e),
      a = o.length
    let i
    for (s = 0; s < a; s++) ((i = o[s]), t.call(null, e[i], i, e))
  }
}
function Um(e, t) {
  t = t.toLowerCase()
  const n = Object.keys(e)
  let s = n.length,
    r
  for (; s-- > 0; ) if (((r = n[s]), t === r.toLowerCase())) return r
  return null
}
const Gm = typeof globalThis < 'u' ? globalThis : typeof self < 'u' ? self : typeof window < 'u' ? window : global,
  Wm = e => !Kr(e) && e !== Gm
function Di() {
  const { caseless: e } = (Wm(this) && this) || {},
    t = {},
    n = (s, r) => {
      const o = (e && Um(t, r)) || r
      ko(t[o]) && ko(s) ? (t[o] = Di(t[o], s)) : ko(s) ? (t[o] = Di({}, s)) : mr(s) ? (t[o] = s.slice()) : (t[o] = s)
    }
  for (let s = 0, r = arguments.length; s < r; s++) arguments[s] && oo(arguments[s], n)
  return t
}
const Y_ = (e, t, n, { allOwnKeys: s } = {}) => (
    oo(
      t,
      (r, o) => {
        n && rn(r) ? (e[o] = Vm(r, n)) : (e[o] = r)
      },
      { allOwnKeys: s }
    ),
    e
  ),
  K_ = e => (e.charCodeAt(0) === 65279 && (e = e.slice(1)), e),
  q_ = (e, t, n, s) => {
    ;((e.prototype = Object.create(t.prototype, s)),
      (e.prototype.constructor = e),
      Object.defineProperty(e, 'super', { value: t.prototype }),
      n && Object.assign(e.prototype, n))
  },
  z_ = (e, t, n, s) => {
    let r, o, a
    const i = {}
    if (((t = t || {}), e == null)) return t
    do {
      for (r = Object.getOwnPropertyNames(e), o = r.length; o-- > 0; )
        ((a = r[o]), (!s || s(a, e, t)) && !i[a] && ((t[a] = e[a]), (i[a] = !0)))
      e = n !== !1 && Ul(e)
    } while (e && (!n || n(e, t)) && e !== Object.prototype)
    return t
  },
  X_ = (e, t, n) => {
    ;((e = String(e)), (n === void 0 || n > e.length) && (n = e.length), (n -= t.length))
    const s = e.indexOf(t, n)
    return s !== -1 && s === n
  },
  J_ = e => {
    if (!e) return null
    if (mr(e)) return e
    let t = e.length
    if (!Bm(t)) return null
    const n = new Array(t)
    for (; t-- > 0; ) n[t] = e[t]
    return n
  },
  Q_ = (
    e => t =>
      e && t instanceof e
  )(typeof Uint8Array < 'u' && Ul(Uint8Array)),
  Z_ = (e, t) => {
    const s = (e && e[Symbol.iterator]).call(e)
    let r
    for (; (r = s.next()) && !r.done; ) {
      const o = r.value
      t.call(e, o[0], o[1])
    }
  },
  ey = (e, t) => {
    let n
    const s = []
    for (; (n = e.exec(t)) !== null; ) s.push(n)
    return s
  },
  ty = On('HTMLFormElement'),
  ny = e =>
    e.toLowerCase().replace(/[-_\s]([a-z\d])(\w*)/g, function (n, s, r) {
      return s.toUpperCase() + r
    }),
  mc = (
    ({ hasOwnProperty: e }) =>
    (t, n) =>
      e.call(t, n)
  )(Object.prototype),
  sy = On('RegExp'),
  Hm = (e, t) => {
    const n = Object.getOwnPropertyDescriptors(e),
      s = {}
    ;(oo(n, (r, o) => {
      let a
      ;(a = t(r, o, e)) !== !1 && (s[o] = a || r)
    }),
      Object.defineProperties(e, s))
  },
  ry = e => {
    Hm(e, (t, n) => {
      if (rn(e) && ['arguments', 'caller', 'callee'].indexOf(n) !== -1) return !1
      const s = e[n]
      if (rn(s)) {
        if (((t.enumerable = !1), 'writable' in t)) {
          t.writable = !1
          return
        }
        t.set ||
          (t.set = () => {
            throw Error("Can not rewrite read-only method '" + n + "'")
          })
      }
    })
  },
  oy = (e, t) => {
    const n = {},
      s = r => {
        r.forEach(o => {
          n[o] = !0
        })
      }
    return (mr(e) ? s(e) : s(String(e).split(t)), n)
  },
  ay = () => {},
  iy = (e, t) => ((e = +e), Number.isFinite(e) ? e : t),
  ri = 'abcdefghijklmnopqrstuvwxyz',
  hc = '0123456789',
  jm = { DIGIT: hc, ALPHA: ri, ALPHA_DIGIT: ri + ri.toUpperCase() + hc },
  ly = (e = 16, t = jm.ALPHA_DIGIT) => {
    let n = ''
    const { length: s } = t
    for (; e--; ) n += t[(Math.random() * s) | 0]
    return n
  }
function uy(e) {
  return !!(e && rn(e.append) && e[Symbol.toStringTag] === 'FormData' && e[Symbol.iterator])
}
const cy = e => {
    const t = new Array(10),
      n = (s, r) => {
        if (wa(s)) {
          if (t.indexOf(s) >= 0) return
          if (!('toJSON' in s)) {
            t[r] = s
            const o = mr(s) ? [] : {}
            return (
              oo(s, (a, i) => {
                const u = n(a, r + 1)
                !Kr(u) && (o[i] = u)
              }),
              (t[r] = void 0),
              o
            )
          }
        }
        return s
      }
    return n(e, 0)
  },
  dy = On('AsyncFunction'),
  fy = e => e && (wa(e) || rn(e)) && rn(e.then) && rn(e.catch),
  K = {
    isArray: mr,
    isArrayBuffer: xm,
    isBuffer: M_,
    isFormData: W_,
    isArrayBufferView: k_,
    isString: D_,
    isNumber: Bm,
    isBoolean: F_,
    isObject: wa,
    isPlainObject: ko,
    isUndefined: Kr,
    isDate: V_,
    isFile: x_,
    isBlob: B_,
    isRegExp: sy,
    isFunction: rn,
    isStream: G_,
    isURLSearchParams: H_,
    isTypedArray: Q_,
    isFileList: U_,
    forEach: oo,
    merge: Di,
    extend: Y_,
    trim: j_,
    stripBOM: K_,
    inherits: q_,
    toFlatObject: z_,
    kindOf: Ta,
    kindOfTest: On,
    endsWith: X_,
    toArray: J_,
    forEachEntry: Z_,
    matchAll: ey,
    isHTMLForm: ty,
    hasOwnProperty: mc,
    hasOwnProp: mc,
    reduceDescriptors: Hm,
    freezeMethods: ry,
    toObjectSet: oy,
    toCamelCase: ny,
    noop: ay,
    toFiniteNumber: iy,
    findKey: Um,
    global: Gm,
    isContextDefined: Wm,
    ALPHABET: jm,
    generateString: ly,
    isSpecCompliantForm: uy,
    toJSONObject: cy,
    isAsyncFn: dy,
    isThenable: fy
  }
function Be(e, t, n, s, r) {
  ;(Error.call(this),
    Error.captureStackTrace ? Error.captureStackTrace(this, this.constructor) : (this.stack = new Error().stack),
    (this.message = e),
    (this.name = 'AxiosError'),
    t && (this.code = t),
    n && (this.config = n),
    s && (this.request = s),
    r && (this.response = r))
}
K.inherits(Be, Error, {
  toJSON: function () {
    return {
      message: this.message,
      name: this.name,
      description: this.description,
      number: this.number,
      fileName: this.fileName,
      lineNumber: this.lineNumber,
      columnNumber: this.columnNumber,
      stack: this.stack,
      config: K.toJSONObject(this.config),
      code: this.code,
      status: this.response && this.response.status ? this.response.status : null
    }
  }
})
const Ym = Be.prototype,
  Km = {}
;[
  'ERR_BAD_OPTION_VALUE',
  'ERR_BAD_OPTION',
  'ECONNABORTED',
  'ETIMEDOUT',
  'ERR_NETWORK',
  'ERR_FR_TOO_MANY_REDIRECTS',
  'ERR_DEPRECATED',
  'ERR_BAD_RESPONSE',
  'ERR_BAD_REQUEST',
  'ERR_CANCELED',
  'ERR_NOT_SUPPORT',
  'ERR_INVALID_URL'
].forEach(e => {
  Km[e] = { value: e }
})
Object.defineProperties(Be, Km)
Object.defineProperty(Ym, 'isAxiosError', { value: !0 })
Be.from = (e, t, n, s, r, o) => {
  const a = Object.create(Ym)
  return (
    K.toFlatObject(
      e,
      a,
      function (u) {
        return u !== Error.prototype
      },
      i => i !== 'isAxiosError'
    ),
    Be.call(a, e.message, t, n, s, r),
    (a.cause = e),
    (a.name = e.name),
    o && Object.assign(a, o),
    a
  )
}
const my = null
function Fi(e) {
  return K.isPlainObject(e) || K.isArray(e)
}
function qm(e) {
  return K.endsWith(e, '[]') ? e.slice(0, -2) : e
}
function gc(e, t, n) {
  return e
    ? e
        .concat(t)
        .map(function (r, o) {
          return ((r = qm(r)), !n && o ? '[' + r + ']' : r)
        })
        .join(n ? '.' : '')
    : t
}
function hy(e) {
  return K.isArray(e) && !e.some(Fi)
}
const gy = K.toFlatObject(K, {}, null, function (t) {
  return /^is[A-Z]/.test(t)
})
function La(e, t, n) {
  if (!K.isObject(e)) throw new TypeError('target must be an object')
  ;((t = t || new FormData()),
    (n = K.toFlatObject(n, { metaTokens: !0, dots: !1, indexes: !1 }, !1, function (v, I) {
      return !K.isUndefined(I[v])
    })))
  const s = n.metaTokens,
    r = n.visitor || d,
    o = n.dots,
    a = n.indexes,
    u = (n.Blob || (typeof Blob < 'u' && Blob)) && K.isSpecCompliantForm(t)
  if (!K.isFunction(r)) throw new TypeError('visitor must be a function')
  function c(y) {
    if (y === null) return ''
    if (K.isDate(y)) return y.toISOString()
    if (!u && K.isBlob(y)) throw new Be('Blob is not supported. Use a Buffer instead.')
    return K.isArrayBuffer(y) || K.isTypedArray(y)
      ? u && typeof Blob == 'function'
        ? new Blob([y])
        : Buffer.from(y)
      : y
  }
  function d(y, v, I) {
    let b = y
    if (y && !I && typeof y == 'object') {
      if (K.endsWith(v, '{}')) ((v = s ? v : v.slice(0, -2)), (y = JSON.stringify(y)))
      else if ((K.isArray(y) && hy(y)) || ((K.isFileList(y) || K.endsWith(v, '[]')) && (b = K.toArray(y))))
        return (
          (v = qm(v)),
          b.forEach(function (P, T) {
            !(K.isUndefined(P) || P === null) && t.append(a === !0 ? gc([v], T, o) : a === null ? v : v + '[]', c(P))
          }),
          !1
        )
    }
    return Fi(y) ? !0 : (t.append(gc(I, v, o), c(y)), !1)
  }
  const m = [],
    h = Object.assign(gy, { defaultVisitor: d, convertValue: c, isVisitable: Fi })
  function E(y, v) {
    if (!K.isUndefined(y)) {
      if (m.indexOf(y) !== -1) throw Error('Circular reference detected in ' + v.join('.'))
      ;(m.push(y),
        K.forEach(y, function (b, O) {
          ;(!(K.isUndefined(b) || b === null) && r.call(t, b, K.isString(O) ? O.trim() : O, v, h)) === !0 &&
            E(b, v ? v.concat(O) : [O])
        }),
        m.pop())
    }
  }
  if (!K.isObject(e)) throw new TypeError('data must be an object')
  return (E(e), t)
}
function pc(e) {
  const t = { '!': '%21', "'": '%27', '(': '%28', ')': '%29', '~': '%7E', '%20': '+', '%00': '\0' }
  return encodeURIComponent(e).replace(/[!'()~]|%20|%00/g, function (s) {
    return t[s]
  })
}
function Gl(e, t) {
  ;((this._pairs = []), e && La(e, this, t))
}
const zm = Gl.prototype
zm.append = function (t, n) {
  this._pairs.push([t, n])
}
zm.toString = function (t) {
  const n = t
    ? function (s) {
        return t.call(this, s, pc)
      }
    : pc
  return this._pairs
    .map(function (r) {
      return n(r[0]) + '=' + n(r[1])
    }, '')
    .join('&')
}
function py(e) {
  return encodeURIComponent(e)
    .replace(/%3A/gi, ':')
    .replace(/%24/g, '$')
    .replace(/%2C/gi, ',')
    .replace(/%20/g, '+')
    .replace(/%5B/gi, '[')
    .replace(/%5D/gi, ']')
}
function Xm(e, t, n) {
  if (!t) return e
  const s = (n && n.encode) || py,
    r = n && n.serialize
  let o
  if ((r ? (o = r(t, n)) : (o = K.isURLSearchParams(t) ? t.toString() : new Gl(t, n).toString(s)), o)) {
    const a = e.indexOf('#')
    ;(a !== -1 && (e = e.slice(0, a)), (e += (e.indexOf('?') === -1 ? '?' : '&') + o))
  }
  return e
}
class Ec {
  constructor() {
    this.handlers = []
  }
  use(t, n, s) {
    return (
      this.handlers.push({
        fulfilled: t,
        rejected: n,
        synchronous: s ? s.synchronous : !1,
        runWhen: s ? s.runWhen : null
      }),
      this.handlers.length - 1
    )
  }
  eject(t) {
    this.handlers[t] && (this.handlers[t] = null)
  }
  clear() {
    this.handlers && (this.handlers = [])
  }
  forEach(t) {
    K.forEach(this.handlers, function (s) {
      s !== null && t(s)
    })
  }
}
const Jm = { silentJSONParsing: !0, forcedJSONParsing: !0, clarifyTimeoutError: !1 },
  Ey = typeof URLSearchParams < 'u' ? URLSearchParams : Gl,
  _y = typeof FormData < 'u' ? FormData : null,
  yy = typeof Blob < 'u' ? Blob : null,
  vy = {
    isBrowser: !0,
    classes: { URLSearchParams: Ey, FormData: _y, Blob: yy },
    protocols: ['http', 'https', 'file', 'blob', 'url', 'data']
  },
  Qm = typeof window < 'u' && typeof document < 'u',
  by = (e => Qm && ['ReactNative', 'NativeScript', 'NS'].indexOf(e) < 0)(typeof navigator < 'u' && navigator.product),
  Sy = typeof WorkerGlobalScope < 'u' && self instanceof WorkerGlobalScope && typeof self.importScripts == 'function',
  Ry = Object.freeze(
    Object.defineProperty(
      { __proto__: null, hasBrowserEnv: Qm, hasStandardBrowserEnv: by, hasStandardBrowserWebWorkerEnv: Sy },
      Symbol.toStringTag,
      { value: 'Module' }
    )
  ),
  yn = { ...Ry, ...vy }
function Oy(e, t) {
  return La(
    e,
    new yn.classes.URLSearchParams(),
    Object.assign(
      {
        visitor: function (n, s, r, o) {
          return yn.isNode && K.isBuffer(n)
            ? (this.append(s, n.toString('base64')), !1)
            : o.defaultVisitor.apply(this, arguments)
        }
      },
      t
    )
  )
}
function Cy(e) {
  return K.matchAll(/\w+|\[(\w*)]/g, e).map(t => (t[0] === '[]' ? '' : t[1] || t[0]))
}
function Ay(e) {
  const t = {},
    n = Object.keys(e)
  let s
  const r = n.length
  let o
  for (s = 0; s < r; s++) ((o = n[s]), (t[o] = e[o]))
  return t
}
function Zm(e) {
  function t(n, s, r, o) {
    let a = n[o++]
    if (a === '__proto__') return !0
    const i = Number.isFinite(+a),
      u = o >= n.length
    return (
      (a = !a && K.isArray(r) ? r.length : a),
      u
        ? (K.hasOwnProp(r, a) ? (r[a] = [r[a], s]) : (r[a] = s), !i)
        : ((!r[a] || !K.isObject(r[a])) && (r[a] = []), t(n, s, r[a], o) && K.isArray(r[a]) && (r[a] = Ay(r[a])), !i)
    )
  }
  if (K.isFormData(e) && K.isFunction(e.entries)) {
    const n = {}
    return (
      K.forEachEntry(e, (s, r) => {
        t(Cy(s), r, n, 0)
      }),
      n
    )
  }
  return null
}
function Iy(e, t, n) {
  if (K.isString(e))
    try {
      return ((t || JSON.parse)(e), K.trim(e))
    } catch (s) {
      if (s.name !== 'SyntaxError') throw s
    }
  return (n || JSON.stringify)(e)
}
const Wl = {
  transitional: Jm,
  adapter: ['xhr', 'http'],
  transformRequest: [
    function (t, n) {
      const s = n.getContentType() || '',
        r = s.indexOf('application/json') > -1,
        o = K.isObject(t)
      if ((o && K.isHTMLForm(t) && (t = new FormData(t)), K.isFormData(t))) return r ? JSON.stringify(Zm(t)) : t
      if (K.isArrayBuffer(t) || K.isBuffer(t) || K.isStream(t) || K.isFile(t) || K.isBlob(t)) return t
      if (K.isArrayBufferView(t)) return t.buffer
      if (K.isURLSearchParams(t))
        return (n.setContentType('application/x-www-form-urlencoded;charset=utf-8', !1), t.toString())
      let i
      if (o) {
        if (s.indexOf('application/x-www-form-urlencoded') > -1) return Oy(t, this.formSerializer).toString()
        if ((i = K.isFileList(t)) || s.indexOf('multipart/form-data') > -1) {
          const u = this.env && this.env.FormData
          return La(i ? { 'files[]': t } : t, u && new u(), this.formSerializer)
        }
      }
      return o || r ? (n.setContentType('application/json', !1), Iy(t)) : t
    }
  ],
  transformResponse: [
    function (t) {
      const n = this.transitional || Wl.transitional,
        s = n && n.forcedJSONParsing,
        r = this.responseType === 'json'
      if (t && K.isString(t) && ((s && !this.responseType) || r)) {
        const a = !(n && n.silentJSONParsing) && r
        try {
          return JSON.parse(t)
        } catch (i) {
          if (a) throw i.name === 'SyntaxError' ? Be.from(i, Be.ERR_BAD_RESPONSE, this, null, this.response) : i
        }
      }
      return t
    }
  ],
  timeout: 0,
  xsrfCookieName: 'XSRF-TOKEN',
  xsrfHeaderName: 'X-XSRF-TOKEN',
  maxContentLength: -1,
  maxBodyLength: -1,
  env: { FormData: yn.classes.FormData, Blob: yn.classes.Blob },
  validateStatus: function (t) {
    return t >= 200 && t < 300
  },
  headers: { common: { Accept: 'application/json, text/plain, */*', 'Content-Type': void 0 } }
}
K.forEach(['delete', 'get', 'head', 'post', 'put', 'patch'], e => {
  Wl.headers[e] = {}
})
const Hl = Wl,
  Ty = K.toObjectSet([
    'age',
    'authorization',
    'content-length',
    'content-type',
    'etag',
    'expires',
    'from',
    'host',
    'if-modified-since',
    'if-unmodified-since',
    'last-modified',
    'location',
    'max-forwards',
    'proxy-authorization',
    'referer',
    'retry-after',
    'user-agent'
  ]),
  Ny = e => {
    const t = {}
    let n, s, r
    return (
      e &&
        e
          .split(
            `
`
          )
          .forEach(function (a) {
            ;((r = a.indexOf(':')),
              (n = a.substring(0, r).trim().toLowerCase()),
              (s = a.substring(r + 1).trim()),
              !(!n || (t[n] && Ty[n])) &&
                (n === 'set-cookie' ? (t[n] ? t[n].push(s) : (t[n] = [s])) : (t[n] = t[n] ? t[n] + ', ' + s : s)))
          }),
      t
    )
  },
  _c = Symbol('internals')
function br(e) {
  return e && String(e).trim().toLowerCase()
}
function Do(e) {
  return e === !1 || e == null ? e : K.isArray(e) ? e.map(Do) : String(e)
}
function wy(e) {
  const t = Object.create(null),
    n = /([^\s,;=]+)\s*(?:=\s*([^,;]+))?/g
  let s
  for (; (s = n.exec(e)); ) t[s[1]] = s[2]
  return t
}
const Ly = e => /^[-_a-zA-Z0-9^`|~,!#$%&'*+.]+$/.test(e.trim())
function oi(e, t, n, s, r) {
  if (K.isFunction(s)) return s.call(this, t, n)
  if ((r && (t = n), !!K.isString(t))) {
    if (K.isString(s)) return t.indexOf(s) !== -1
    if (K.isRegExp(s)) return s.test(t)
  }
}
function Py(e) {
  return e
    .trim()
    .toLowerCase()
    .replace(/([a-z\d])(\w*)/g, (t, n, s) => n.toUpperCase() + s)
}
function $y(e, t) {
  const n = K.toCamelCase(' ' + t)
  ;['get', 'set', 'has'].forEach(s => {
    Object.defineProperty(e, s + n, {
      value: function (r, o, a) {
        return this[s].call(this, t, r, o, a)
      },
      configurable: !0
    })
  })
}
class Pa {
  constructor(t) {
    t && this.set(t)
  }
  set(t, n, s) {
    const r = this
    function o(i, u, c) {
      const d = br(u)
      if (!d) throw new Error('header name must be a non-empty string')
      const m = K.findKey(r, d)
      ;(!m || r[m] === void 0 || c === !0 || (c === void 0 && r[m] !== !1)) && (r[m || u] = Do(i))
    }
    const a = (i, u) => K.forEach(i, (c, d) => o(c, d, u))
    return (
      K.isPlainObject(t) || t instanceof this.constructor
        ? a(t, n)
        : K.isString(t) && (t = t.trim()) && !Ly(t)
          ? a(Ny(t), n)
          : t != null && o(n, t, s),
      this
    )
  }
  get(t, n) {
    if (((t = br(t)), t)) {
      const s = K.findKey(this, t)
      if (s) {
        const r = this[s]
        if (!n) return r
        if (n === !0) return wy(r)
        if (K.isFunction(n)) return n.call(this, r, s)
        if (K.isRegExp(n)) return n.exec(r)
        throw new TypeError('parser must be boolean|regexp|function')
      }
    }
  }
  has(t, n) {
    if (((t = br(t)), t)) {
      const s = K.findKey(this, t)
      return !!(s && this[s] !== void 0 && (!n || oi(this, this[s], s, n)))
    }
    return !1
  }
  delete(t, n) {
    const s = this
    let r = !1
    function o(a) {
      if (((a = br(a)), a)) {
        const i = K.findKey(s, a)
        i && (!n || oi(s, s[i], i, n)) && (delete s[i], (r = !0))
      }
    }
    return (K.isArray(t) ? t.forEach(o) : o(t), r)
  }
  clear(t) {
    const n = Object.keys(this)
    let s = n.length,
      r = !1
    for (; s--; ) {
      const o = n[s]
      ;(!t || oi(this, this[o], o, t, !0)) && (delete this[o], (r = !0))
    }
    return r
  }
  normalize(t) {
    const n = this,
      s = {}
    return (
      K.forEach(this, (r, o) => {
        const a = K.findKey(s, o)
        if (a) {
          ;((n[a] = Do(r)), delete n[o])
          return
        }
        const i = t ? Py(o) : String(o).trim()
        ;(i !== o && delete n[o], (n[i] = Do(r)), (s[i] = !0))
      }),
      this
    )
  }
  concat(...t) {
    return this.constructor.concat(this, ...t)
  }
  toJSON(t) {
    const n = Object.create(null)
    return (
      K.forEach(this, (s, r) => {
        s != null && s !== !1 && (n[r] = t && K.isArray(s) ? s.join(', ') : s)
      }),
      n
    )
  }
  [Symbol.iterator]() {
    return Object.entries(this.toJSON())[Symbol.iterator]()
  }
  toString() {
    return Object.entries(this.toJSON()).map(([t, n]) => t + ': ' + n).join(`
`)
  }
  get [Symbol.toStringTag]() {
    return 'AxiosHeaders'
  }
  static from(t) {
    return t instanceof this ? t : new this(t)
  }
  static concat(t, ...n) {
    const s = new this(t)
    return (n.forEach(r => s.set(r)), s)
  }
  static accessor(t) {
    const s = (this[_c] = this[_c] = { accessors: {} }).accessors,
      r = this.prototype
    function o(a) {
      const i = br(a)
      s[i] || ($y(r, a), (s[i] = !0))
    }
    return (K.isArray(t) ? t.forEach(o) : o(t), this)
  }
}
Pa.accessor(['Content-Type', 'Content-Length', 'Accept', 'Accept-Encoding', 'User-Agent', 'Authorization'])
K.reduceDescriptors(Pa.prototype, ({ value: e }, t) => {
  let n = t[0].toUpperCase() + t.slice(1)
  return {
    get: () => e,
    set(s) {
      this[n] = s
    }
  }
})
K.freezeMethods(Pa)
const Mn = Pa
function ai(e, t) {
  const n = this || Hl,
    s = t || n,
    r = Mn.from(s.headers)
  let o = s.data
  return (
    K.forEach(e, function (i) {
      o = i.call(n, o, r.normalize(), t ? t.status : void 0)
    }),
    r.normalize(),
    o
  )
}
function eh(e) {
  return !!(e && e.__CANCEL__)
}
function ao(e, t, n) {
  ;(Be.call(this, e ?? 'canceled', Be.ERR_CANCELED, t, n), (this.name = 'CanceledError'))
}
K.inherits(ao, Be, { __CANCEL__: !0 })
function My(e, t, n) {
  const s = n.config.validateStatus
  !n.status || !s || s(n.status)
    ? e(n)
    : t(
        new Be(
          'Request failed with status code ' + n.status,
          [Be.ERR_BAD_REQUEST, Be.ERR_BAD_RESPONSE][Math.floor(n.status / 100) - 4],
          n.config,
          n.request,
          n
        )
      )
}
const ky = yn.hasStandardBrowserEnv
  ? {
      write(e, t, n, s, r, o) {
        const a = [e + '=' + encodeURIComponent(t)]
        ;(K.isNumber(n) && a.push('expires=' + new Date(n).toGMTString()),
          K.isString(s) && a.push('path=' + s),
          K.isString(r) && a.push('domain=' + r),
          o === !0 && a.push('secure'),
          (document.cookie = a.join('; ')))
      },
      read(e) {
        const t = document.cookie.match(new RegExp('(^|;\\s*)(' + e + ')=([^;]*)'))
        return t ? decodeURIComponent(t[3]) : null
      },
      remove(e) {
        this.write(e, '', Date.now() - 864e5)
      }
    }
  : {
      write() {},
      read() {
        return null
      },
      remove() {}
    }
function Dy(e) {
  return /^([a-z][a-z\d+\-.]*:)?\/\//i.test(e)
}
function Fy(e, t) {
  return t ? e.replace(/\/?\/$/, '') + '/' + t.replace(/^\/+/, '') : e
}
function th(e, t) {
  return e && !Dy(t) ? Fy(e, t) : t
}
const Vy = yn.hasStandardBrowserEnv
  ? (function () {
      const t = /(msie|trident)/i.test(navigator.userAgent),
        n = document.createElement('a')
      let s
      function r(o) {
        let a = o
        return (
          t && (n.setAttribute('href', a), (a = n.href)),
          n.setAttribute('href', a),
          {
            href: n.href,
            protocol: n.protocol ? n.protocol.replace(/:$/, '') : '',
            host: n.host,
            search: n.search ? n.search.replace(/^\?/, '') : '',
            hash: n.hash ? n.hash.replace(/^#/, '') : '',
            hostname: n.hostname,
            port: n.port,
            pathname: n.pathname.charAt(0) === '/' ? n.pathname : '/' + n.pathname
          }
        )
      }
      return (
        (s = r(window.location.href)),
        function (a) {
          const i = K.isString(a) ? r(a) : a
          return i.protocol === s.protocol && i.host === s.host
        }
      )
    })()
  : (function () {
      return function () {
        return !0
      }
    })()
function xy(e) {
  const t = /^([-+\w]{1,25})(:?\/\/|:)/.exec(e)
  return (t && t[1]) || ''
}
function By(e, t) {
  e = e || 10
  const n = new Array(e),
    s = new Array(e)
  let r = 0,
    o = 0,
    a
  return (
    (t = t !== void 0 ? t : 1e3),
    function (u) {
      const c = Date.now(),
        d = s[o]
      ;(a || (a = c), (n[r] = u), (s[r] = c))
      let m = o,
        h = 0
      for (; m !== r; ) ((h += n[m++]), (m = m % e))
      if (((r = (r + 1) % e), r === o && (o = (o + 1) % e), c - a < t)) return
      const E = d && c - d
      return E ? Math.round((h * 1e3) / E) : void 0
    }
  )
}
function yc(e, t) {
  let n = 0
  const s = By(50, 250)
  return r => {
    const o = r.loaded,
      a = r.lengthComputable ? r.total : void 0,
      i = o - n,
      u = s(i),
      c = o <= a
    n = o
    const d = {
      loaded: o,
      total: a,
      progress: a ? o / a : void 0,
      bytes: i,
      rate: u || void 0,
      estimated: u && a && c ? (a - o) / u : void 0,
      event: r
    }
    ;((d[t ? 'download' : 'upload'] = !0), e(d))
  }
}
const Uy = typeof XMLHttpRequest < 'u',
  Gy =
    Uy &&
    function (e) {
      return new Promise(function (n, s) {
        let r = e.data
        const o = Mn.from(e.headers).normalize()
        let { responseType: a, withXSRFToken: i } = e,
          u
        function c() {
          ;(e.cancelToken && e.cancelToken.unsubscribe(u), e.signal && e.signal.removeEventListener('abort', u))
        }
        let d
        if (K.isFormData(r)) {
          if (yn.hasStandardBrowserEnv || yn.hasStandardBrowserWebWorkerEnv) o.setContentType(!1)
          else if ((d = o.getContentType()) !== !1) {
            const [v, ...I] = d
              ? d
                  .split(';')
                  .map(b => b.trim())
                  .filter(Boolean)
              : []
            o.setContentType([v || 'multipart/form-data', ...I].join('; '))
          }
        }
        let m = new XMLHttpRequest()
        if (e.auth) {
          const v = e.auth.username || '',
            I = e.auth.password ? unescape(encodeURIComponent(e.auth.password)) : ''
          o.set('Authorization', 'Basic ' + btoa(v + ':' + I))
        }
        const h = th(e.baseURL, e.url)
        ;(m.open(e.method.toUpperCase(), Xm(h, e.params, e.paramsSerializer), !0), (m.timeout = e.timeout))
        function E() {
          if (!m) return
          const v = Mn.from('getAllResponseHeaders' in m && m.getAllResponseHeaders()),
            b = {
              data: !a || a === 'text' || a === 'json' ? m.responseText : m.response,
              status: m.status,
              statusText: m.statusText,
              headers: v,
              config: e,
              request: m
            }
          ;(My(
            function (P) {
              ;(n(P), c())
            },
            function (P) {
              ;(s(P), c())
            },
            b
          ),
            (m = null))
        }
        if (
          ('onloadend' in m
            ? (m.onloadend = E)
            : (m.onreadystatechange = function () {
                !m ||
                  m.readyState !== 4 ||
                  (m.status === 0 && !(m.responseURL && m.responseURL.indexOf('file:') === 0)) ||
                  setTimeout(E)
              }),
          (m.onabort = function () {
            m && (s(new Be('Request aborted', Be.ECONNABORTED, e, m)), (m = null))
          }),
          (m.onerror = function () {
            ;(s(new Be('Network Error', Be.ERR_NETWORK, e, m)), (m = null))
          }),
          (m.ontimeout = function () {
            let I = e.timeout ? 'timeout of ' + e.timeout + 'ms exceeded' : 'timeout exceeded'
            const b = e.transitional || Jm
            ;(e.timeoutErrorMessage && (I = e.timeoutErrorMessage),
              s(new Be(I, b.clarifyTimeoutError ? Be.ETIMEDOUT : Be.ECONNABORTED, e, m)),
              (m = null))
          }),
          yn.hasStandardBrowserEnv && (i && K.isFunction(i) && (i = i(e)), i || (i !== !1 && Vy(h))))
        ) {
          const v = e.xsrfHeaderName && e.xsrfCookieName && ky.read(e.xsrfCookieName)
          v && o.set(e.xsrfHeaderName, v)
        }
        ;(r === void 0 && o.setContentType(null),
          'setRequestHeader' in m &&
            K.forEach(o.toJSON(), function (I, b) {
              m.setRequestHeader(b, I)
            }),
          K.isUndefined(e.withCredentials) || (m.withCredentials = !!e.withCredentials),
          a && a !== 'json' && (m.responseType = e.responseType),
          typeof e.onDownloadProgress == 'function' && m.addEventListener('progress', yc(e.onDownloadProgress, !0)),
          typeof e.onUploadProgress == 'function' &&
            m.upload &&
            m.upload.addEventListener('progress', yc(e.onUploadProgress)),
          (e.cancelToken || e.signal) &&
            ((u = v => {
              m && (s(!v || v.type ? new ao(null, e, m) : v), m.abort(), (m = null))
            }),
            e.cancelToken && e.cancelToken.subscribe(u),
            e.signal && (e.signal.aborted ? u() : e.signal.addEventListener('abort', u))))
        const y = xy(h)
        if (y && yn.protocols.indexOf(y) === -1) {
          s(new Be('Unsupported protocol ' + y + ':', Be.ERR_BAD_REQUEST, e))
          return
        }
        m.send(r || null)
      })
    },
  Vi = { http: my, xhr: Gy }
K.forEach(Vi, (e, t) => {
  if (e) {
    try {
      Object.defineProperty(e, 'name', { value: t })
    } catch {}
    Object.defineProperty(e, 'adapterName', { value: t })
  }
})
const vc = e => `- ${e}`,
  Wy = e => K.isFunction(e) || e === null || e === !1,
  nh = {
    getAdapter: e => {
      e = K.isArray(e) ? e : [e]
      const { length: t } = e
      let n, s
      const r = {}
      for (let o = 0; o < t; o++) {
        n = e[o]
        let a
        if (((s = n), !Wy(n) && ((s = Vi[(a = String(n)).toLowerCase()]), s === void 0)))
          throw new Be(`Unknown adapter '${a}'`)
        if (s) break
        r[a || '#' + o] = s
      }
      if (!s) {
        const o = Object.entries(r).map(
          ([i, u]) =>
            `adapter ${i} ` + (u === !1 ? 'is not supported by the environment' : 'is not available in the build')
        )
        let a = t
          ? o.length > 1
            ? `since :
` +
              o.map(vc).join(`
`)
            : ' ' + vc(o[0])
          : 'as no adapter specified'
        throw new Be('There is no suitable adapter to dispatch the request ' + a, 'ERR_NOT_SUPPORT')
      }
      return s
    },
    adapters: Vi
  }
function ii(e) {
  if ((e.cancelToken && e.cancelToken.throwIfRequested(), e.signal && e.signal.aborted)) throw new ao(null, e)
}
function bc(e) {
  return (
    ii(e),
    (e.headers = Mn.from(e.headers)),
    (e.data = ai.call(e, e.transformRequest)),
    ['post', 'put', 'patch'].indexOf(e.method) !== -1 &&
      e.headers.setContentType('application/x-www-form-urlencoded', !1),
    nh
      .getAdapter(e.adapter || Hl.adapter)(e)
      .then(
        function (s) {
          return (ii(e), (s.data = ai.call(e, e.transformResponse, s)), (s.headers = Mn.from(s.headers)), s)
        },
        function (s) {
          return (
            eh(s) ||
              (ii(e),
              s &&
                s.response &&
                ((s.response.data = ai.call(e, e.transformResponse, s.response)),
                (s.response.headers = Mn.from(s.response.headers)))),
            Promise.reject(s)
          )
        }
      )
  )
}
const Sc = e => (e instanceof Mn ? { ...e } : e)
function Zs(e, t) {
  t = t || {}
  const n = {}
  function s(c, d, m) {
    return K.isPlainObject(c) && K.isPlainObject(d)
      ? K.merge.call({ caseless: m }, c, d)
      : K.isPlainObject(d)
        ? K.merge({}, d)
        : K.isArray(d)
          ? d.slice()
          : d
  }
  function r(c, d, m) {
    if (K.isUndefined(d)) {
      if (!K.isUndefined(c)) return s(void 0, c, m)
    } else return s(c, d, m)
  }
  function o(c, d) {
    if (!K.isUndefined(d)) return s(void 0, d)
  }
  function a(c, d) {
    if (K.isUndefined(d)) {
      if (!K.isUndefined(c)) return s(void 0, c)
    } else return s(void 0, d)
  }
  function i(c, d, m) {
    if (m in t) return s(c, d)
    if (m in e) return s(void 0, c)
  }
  const u = {
    url: o,
    method: o,
    data: o,
    baseURL: a,
    transformRequest: a,
    transformResponse: a,
    paramsSerializer: a,
    timeout: a,
    timeoutMessage: a,
    withCredentials: a,
    withXSRFToken: a,
    adapter: a,
    responseType: a,
    xsrfCookieName: a,
    xsrfHeaderName: a,
    onUploadProgress: a,
    onDownloadProgress: a,
    decompress: a,
    maxContentLength: a,
    maxBodyLength: a,
    beforeRedirect: a,
    transport: a,
    httpAgent: a,
    httpsAgent: a,
    cancelToken: a,
    socketPath: a,
    responseEncoding: a,
    validateStatus: i,
    headers: (c, d) => r(Sc(c), Sc(d), !0)
  }
  return (
    K.forEach(Object.keys(Object.assign({}, e, t)), function (d) {
      const m = u[d] || r,
        h = m(e[d], t[d], d)
      ;(K.isUndefined(h) && m !== i) || (n[d] = h)
    }),
    n
  )
}
const sh = '1.6.8',
  jl = {}
;['object', 'boolean', 'number', 'function', 'string', 'symbol'].forEach((e, t) => {
  jl[e] = function (s) {
    return typeof s === e || 'a' + (t < 1 ? 'n ' : ' ') + e
  }
})
const Rc = {}
jl.transitional = function (t, n, s) {
  function r(o, a) {
    return '[Axios v' + sh + "] Transitional option '" + o + "'" + a + (s ? '. ' + s : '')
  }
  return (o, a, i) => {
    if (t === !1) throw new Be(r(a, ' has been removed' + (n ? ' in ' + n : '')), Be.ERR_DEPRECATED)
    return (
      n &&
        !Rc[a] &&
        ((Rc[a] = !0),
        console.warn(r(a, ' has been deprecated since v' + n + ' and will be removed in the near future'))),
      t ? t(o, a, i) : !0
    )
  }
}
function Hy(e, t, n) {
  if (typeof e != 'object') throw new Be('options must be an object', Be.ERR_BAD_OPTION_VALUE)
  const s = Object.keys(e)
  let r = s.length
  for (; r-- > 0; ) {
    const o = s[r],
      a = t[o]
    if (a) {
      const i = e[o],
        u = i === void 0 || a(i, o, e)
      if (u !== !0) throw new Be('option ' + o + ' must be ' + u, Be.ERR_BAD_OPTION_VALUE)
      continue
    }
    if (n !== !0) throw new Be('Unknown option ' + o, Be.ERR_BAD_OPTION)
  }
}
const xi = { assertOptions: Hy, validators: jl },
  Hn = xi.validators
class Qo {
  constructor(t) {
    ;((this.defaults = t), (this.interceptors = { request: new Ec(), response: new Ec() }))
  }
  async request(t, n) {
    try {
      return await this._request(t, n)
    } catch (s) {
      if (s instanceof Error) {
        let r
        Error.captureStackTrace ? Error.captureStackTrace((r = {})) : (r = new Error())
        const o = r.stack ? r.stack.replace(/^.+\n/, '') : ''
        s.stack
          ? o &&
            !String(s.stack).endsWith(o.replace(/^.+\n.+\n/, '')) &&
            (s.stack +=
              `
` + o)
          : (s.stack = o)
      }
      throw s
    }
  }
  _request(t, n) {
    ;(typeof t == 'string' ? ((n = n || {}), (n.url = t)) : (n = t || {}), (n = Zs(this.defaults, n)))
    const { transitional: s, paramsSerializer: r, headers: o } = n
    ;(s !== void 0 &&
      xi.assertOptions(
        s,
        {
          silentJSONParsing: Hn.transitional(Hn.boolean),
          forcedJSONParsing: Hn.transitional(Hn.boolean),
          clarifyTimeoutError: Hn.transitional(Hn.boolean)
        },
        !1
      ),
      r != null &&
        (K.isFunction(r)
          ? (n.paramsSerializer = { serialize: r })
          : xi.assertOptions(r, { encode: Hn.function, serialize: Hn.function }, !0)),
      (n.method = (n.method || this.defaults.method || 'get').toLowerCase()))
    let a = o && K.merge(o.common, o[n.method])
    ;(o &&
      K.forEach(['delete', 'get', 'head', 'post', 'put', 'patch', 'common'], y => {
        delete o[y]
      }),
      (n.headers = Mn.concat(a, o)))
    const i = []
    let u = !0
    this.interceptors.request.forEach(function (v) {
      ;(typeof v.runWhen == 'function' && v.runWhen(n) === !1) ||
        ((u = u && v.synchronous), i.unshift(v.fulfilled, v.rejected))
    })
    const c = []
    this.interceptors.response.forEach(function (v) {
      c.push(v.fulfilled, v.rejected)
    })
    let d,
      m = 0,
      h
    if (!u) {
      const y = [bc.bind(this), void 0]
      for (y.unshift.apply(y, i), y.push.apply(y, c), h = y.length, d = Promise.resolve(n); m < h; )
        d = d.then(y[m++], y[m++])
      return d
    }
    h = i.length
    let E = n
    for (m = 0; m < h; ) {
      const y = i[m++],
        v = i[m++]
      try {
        E = y(E)
      } catch (I) {
        v.call(this, I)
        break
      }
    }
    try {
      d = bc.call(this, E)
    } catch (y) {
      return Promise.reject(y)
    }
    for (m = 0, h = c.length; m < h; ) d = d.then(c[m++], c[m++])
    return d
  }
  getUri(t) {
    t = Zs(this.defaults, t)
    const n = th(t.baseURL, t.url)
    return Xm(n, t.params, t.paramsSerializer)
  }
}
K.forEach(['delete', 'get', 'head', 'options'], function (t) {
  Qo.prototype[t] = function (n, s) {
    return this.request(Zs(s || {}, { method: t, url: n, data: (s || {}).data }))
  }
})
K.forEach(['post', 'put', 'patch'], function (t) {
  function n(s) {
    return function (o, a, i) {
      return this.request(
        Zs(i || {}, { method: t, headers: s ? { 'Content-Type': 'multipart/form-data' } : {}, url: o, data: a })
      )
    }
  }
  ;((Qo.prototype[t] = n()), (Qo.prototype[t + 'Form'] = n(!0)))
})
const Fo = Qo
class Yl {
  constructor(t) {
    if (typeof t != 'function') throw new TypeError('executor must be a function.')
    let n
    this.promise = new Promise(function (o) {
      n = o
    })
    const s = this
    ;(this.promise.then(r => {
      if (!s._listeners) return
      let o = s._listeners.length
      for (; o-- > 0; ) s._listeners[o](r)
      s._listeners = null
    }),
      (this.promise.then = r => {
        let o
        const a = new Promise(i => {
          ;(s.subscribe(i), (o = i))
        }).then(r)
        return (
          (a.cancel = function () {
            s.unsubscribe(o)
          }),
          a
        )
      }),
      t(function (o, a, i) {
        s.reason || ((s.reason = new ao(o, a, i)), n(s.reason))
      }))
  }
  throwIfRequested() {
    if (this.reason) throw this.reason
  }
  subscribe(t) {
    if (this.reason) {
      t(this.reason)
      return
    }
    this._listeners ? this._listeners.push(t) : (this._listeners = [t])
  }
  unsubscribe(t) {
    if (!this._listeners) return
    const n = this._listeners.indexOf(t)
    n !== -1 && this._listeners.splice(n, 1)
  }
  static source() {
    let t
    return {
      token: new Yl(function (r) {
        t = r
      }),
      cancel: t
    }
  }
}
const jy = Yl
function Yy(e) {
  return function (n) {
    return e.apply(null, n)
  }
}
function Ky(e) {
  return K.isObject(e) && e.isAxiosError === !0
}
const Bi = {
  Continue: 100,
  SwitchingProtocols: 101,
  Processing: 102,
  EarlyHints: 103,
  Ok: 200,
  Created: 201,
  Accepted: 202,
  NonAuthoritativeInformation: 203,
  NoContent: 204,
  ResetContent: 205,
  PartialContent: 206,
  MultiStatus: 207,
  AlreadyReported: 208,
  ImUsed: 226,
  MultipleChoices: 300,
  MovedPermanently: 301,
  Found: 302,
  SeeOther: 303,
  NotModified: 304,
  UseProxy: 305,
  Unused: 306,
  TemporaryRedirect: 307,
  PermanentRedirect: 308,
  BadRequest: 400,
  Unauthorized: 401,
  PaymentRequired: 402,
  Forbidden: 403,
  NotFound: 404,
  MethodNotAllowed: 405,
  NotAcceptable: 406,
  ProxyAuthenticationRequired: 407,
  RequestTimeout: 408,
  Conflict: 409,
  Gone: 410,
  LengthRequired: 411,
  PreconditionFailed: 412,
  PayloadTooLarge: 413,
  UriTooLong: 414,
  UnsupportedMediaType: 415,
  RangeNotSatisfiable: 416,
  ExpectationFailed: 417,
  ImATeapot: 418,
  MisdirectedRequest: 421,
  UnprocessableEntity: 422,
  Locked: 423,
  FailedDependency: 424,
  TooEarly: 425,
  UpgradeRequired: 426,
  PreconditionRequired: 428,
  TooManyRequests: 429,
  RequestHeaderFieldsTooLarge: 431,
  UnavailableForLegalReasons: 451,
  InternalServerError: 500,
  NotImplemented: 501,
  BadGateway: 502,
  ServiceUnavailable: 503,
  GatewayTimeout: 504,
  HttpVersionNotSupported: 505,
  VariantAlsoNegotiates: 506,
  InsufficientStorage: 507,
  LoopDetected: 508,
  NotExtended: 510,
  NetworkAuthenticationRequired: 511
}
Object.entries(Bi).forEach(([e, t]) => {
  Bi[t] = e
})
const qy = Bi
function rh(e) {
  const t = new Fo(e),
    n = Vm(Fo.prototype.request, t)
  return (
    K.extend(n, Fo.prototype, t, { allOwnKeys: !0 }),
    K.extend(n, t, null, { allOwnKeys: !0 }),
    (n.create = function (r) {
      return rh(Zs(e, r))
    }),
    n
  )
}
const Oe = rh(Hl)
Oe.Axios = Fo
Oe.CanceledError = ao
Oe.CancelToken = jy
Oe.isCancel = eh
Oe.VERSION = sh
Oe.toFormData = La
Oe.AxiosError = Be
Oe.Cancel = Oe.CanceledError
Oe.all = function (t) {
  return Promise.all(t)
}
Oe.spread = Yy
Oe.isAxiosError = Ky
Oe.mergeConfig = Zs
Oe.AxiosHeaders = Mn
Oe.formToJSON = e => Zm(K.isHTMLForm(e) ? new FormData(e) : e)
Oe.getAdapter = nh.getAdapter
Oe.HttpStatusCode = qy
Oe.default = Oe
const zy = { menu: [] },
  gt = jt({
    id: 'AppStateStore',
    state: () => ({
      status: 'READY',
      errorObject: !1,
      system: zy,
      metadata: {},
      navigationHidden: !0,
      navigationDrawer: !1,
      showSnackBar: !1,
      snackbar: {
        timeout: 2e3,
        color: 'success',
        variant: 'tonal',
        message: 'Sample snackbar',
        multiLine: !1,
        link: '',
        vertical: !0,
        location: 'top'
      },
      showSystemErrorDialog: !1,
      showSystemLanguageDialog: !1,
      badeCount: { notify: 1, chatting: 1 },
      isLoadingMasterData: !1,
      masterData: { countries: [], regions: [], districts: [], wards: [], displayLanguages: [] }
    }),
    getters: {
      config() {
        var e
        return ((e = this.metadata) == null ? void 0 : e.config) || {}
      },
      account() {
        var e, t
        return ((t = (e = this.metadata) == null ? void 0 : e.auth) == null ? void 0 : t.account) || void 0
      },
      roles() {
        var e, t, n
        return (
          ((n = (t = (e = this.metadata) == null ? void 0 : e.auth) == null ? void 0 : t.account) == null
            ? void 0
            : n.roles) || void 0
        )
      }
    },
    actions: {
      initial(e) {
        try {
          ;(console.log(e),
            (this.metadata = e),
            setTimeout(() => {
              this.status = 'WORKING'
            }, 10))
        } catch (t) {
          ;((this.error = t), (this.status = 'ERROR'), console.error(t))
        }
      },
      showError(e) {
        ;((this.status = 'ERROR'), (this.errorObject = e))
      },
      destroy() {
        this.$reset()
      },
      showSystemError() {
        this.showSystemErrorDialog = !0
      },
      showSnackbar(e) {
        ;((this.showSnackBar = !0),
          (this.snackbar.message = e.message ? e.message : 'Empty Snack Message'),
          (this.snackbar.color = e.color ? e.color : 'teal-lighten-2'),
          (this.snackbar.timeout = e.timeout ? e.timeout : 2e3),
          (this.snackbar.variant = e.variant ? e.variant : 'elevated'),
          (this.snackbar.link = e.link ? e.link : ''))
      },
      async loadMasterData() {
        var e, t, n
        try {
          this.isLoadingMasterData = !0
          const s = await Promise.all([
            Oe.get('/api/sso/common/country'),
            Oe.get('/api/sso/common/region'),
            Oe.get('/api/sso/common/district'),
            Oe.get('/api/sso/common/ward'),
            Oe.get('/api/sso/common/display')
          ])
          ;((this.masterData.countries = s[0].data),
            (this.masterData.regions = s[1].data),
            (this.masterData.districts = s[2].data),
            (this.masterData.wards = s[3].data),
            (this.masterData.displayLanguages = s[4].data),
            (this.isLoadingMasterData = !1))
        } catch (s) {
          const r = new Error(`[${s.code}] ${s.message}`)
          ;((r.message = s.message || ((t = (e = s.response) == null ? void 0 : e.data) == null ? void 0 : t.message)),
            (r.code = ((n = s.response) == null ? void 0 : n.status) || s.code),
            console.error(r),
            (this.isLoadingMasterData = !1))
        }
      }
    }
  }),
  ue = (e, t) => {
    const n = e.__vccOpts || e
    for (const [s, r] of t) n[s] = r
    return n
  },
  Xy = Ee({
    name: 'App',
    data() {
      return {}
    },
    computed: {
      ...an(gt, ['isMobile']),
      ...Ke(gt, ['status', 'errorObject']),
      isMobile() {
        const { sm: e, xs: t } = this.$vuetify.display
        return t || e
      }
    },
    methods: { ...Ye(gt, ['initial', 'destroy', 'showError']) },
    mounted() {
      this.initial(appInitialData)
    },
    unmounted() {
      this.destroy()
    },
    errorCaptured(e) {
      this.showError(e)
    }
  }),
  Jy = { key: 0, style: { 'text-align': 'center' } }
function Qy(e, t, n, s, r, o) {
  const a = he('router-view'),
    i = he('s-base')
  return e.status === 'READY'
    ? (F(), Ne('div', Jy, 'Loading...!'))
    : (F(),
      Ne(
        Ue,
        { key: 1 },
        [e.status === 'WORKING' ? (F(), G(i, { key: 0 }, { default: f(() => [l(a)]), _: 1 })) : We('', !0)],
        64
      ))
}
const Zy = ue(Xy, [['render', Qy]])
/*!
 * shared v9.10.2
 * (c) 2024 kazuya kawaguchi
 * Released under the MIT License.
 */ const Zo = typeof window < 'u',
  cs = (e, t = !1) => (t ? Symbol.for(e) : Symbol(e)),
  ev = (e, t, n) => tv({ l: e, k: t, s: n }),
  tv = e =>
    JSON.stringify(e)
      .replace(/\u2028/g, '\\u2028')
      .replace(/\u2029/g, '\\u2029')
      .replace(/\u0027/g, '\\u0027'),
  _t = e => typeof e == 'number' && isFinite(e),
  nv = e => ah(e) === '[object Date]',
  as = e => ah(e) === '[object RegExp]',
  $a = e => Re(e) && Object.keys(e).length === 0,
  It = Object.assign
let Oc
const Pn = () =>
  Oc ||
  (Oc =
    typeof globalThis < 'u'
      ? globalThis
      : typeof self < 'u'
        ? self
        : typeof window < 'u'
          ? window
          : typeof global < 'u'
            ? global
            : {})
function Cc(e) {
  return e.replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&apos;')
}
const sv = Object.prototype.hasOwnProperty
function ea(e, t) {
  return sv.call(e, t)
}
const at = Array.isArray,
  st = e => typeof e == 'function',
  re = e => typeof e == 'string',
  $e = e => typeof e == 'boolean',
  Je = e => e !== null && typeof e == 'object',
  rv = e => Je(e) && st(e.then) && st(e.catch),
  oh = Object.prototype.toString,
  ah = e => oh.call(e),
  Re = e => {
    if (!Je(e)) return !1
    const t = Object.getPrototypeOf(e)
    return t === null || t.constructor === Object
  },
  ov = e => (e == null ? '' : at(e) || (Re(e) && e.toString === oh) ? JSON.stringify(e, null, 2) : String(e))
function av(e, t = '') {
  return e.reduce((n, s, r) => (r === 0 ? n + s : n + t + s), '')
}
function Kl(e) {
  let t = e
  return () => ++t
}
function iv(e, t) {
  typeof console < 'u' && (console.warn('[intlify] ' + e), t && console.warn(t.stack))
}
const Ao = e => !Je(e) || at(e)
function Vo(e, t) {
  if (Ao(e) || Ao(t)) throw new Error('Invalid value')
  const n = [{ src: e, des: t }]
  for (; n.length; ) {
    const { src: s, des: r } = n.pop()
    Object.keys(s).forEach(o => {
      Ao(s[o]) || Ao(r[o]) ? (r[o] = s[o]) : n.push({ src: s[o], des: r[o] })
    })
  }
}
/*!
 * message-compiler v9.10.2
 * (c) 2024 kazuya kawaguchi
 * Released under the MIT License.
 */ function lv(e, t, n) {
  return { line: e, column: t, offset: n }
}
function Ui(e, t, n) {
  const s = { start: e, end: t }
  return (n != null && (s.source = n), s)
}
const uv = /\{([0-9a-zA-Z]+)\}/g
function cv(e, ...t) {
  return (
    t.length === 1 && dv(t[0]) && (t = t[0]),
    (!t || !t.hasOwnProperty) && (t = {}),
    e.replace(uv, (n, s) => (t.hasOwnProperty(s) ? t[s] : ''))
  )
}
const ih = Object.assign,
  Ac = e => typeof e == 'string',
  dv = e => e !== null && typeof e == 'object'
function lh(e, t = '') {
  return e.reduce((n, s, r) => (r === 0 ? n + s : n + t + s), '')
}
const ye = {
    EXPECTED_TOKEN: 1,
    INVALID_TOKEN_IN_PLACEHOLDER: 2,
    UNTERMINATED_SINGLE_QUOTE_IN_PLACEHOLDER: 3,
    UNKNOWN_ESCAPE_SEQUENCE: 4,
    INVALID_UNICODE_ESCAPE_SEQUENCE: 5,
    UNBALANCED_CLOSING_BRACE: 6,
    UNTERMINATED_CLOSING_BRACE: 7,
    EMPTY_PLACEHOLDER: 8,
    NOT_ALLOW_NEST_PLACEHOLDER: 9,
    INVALID_LINKED_FORMAT: 10,
    MUST_HAVE_MESSAGES_IN_PLURAL: 11,
    UNEXPECTED_EMPTY_LINKED_MODIFIER: 12,
    UNEXPECTED_EMPTY_LINKED_KEY: 13,
    UNEXPECTED_LEXICAL_ANALYSIS: 14,
    UNHANDLED_CODEGEN_NODE_TYPE: 15,
    UNHANDLED_MINIFIER_NODE_TYPE: 16,
    __EXTEND_POINT__: 17
  },
  fv = {
    [ye.EXPECTED_TOKEN]: "Expected token: '{0}'",
    [ye.INVALID_TOKEN_IN_PLACEHOLDER]: "Invalid token in placeholder: '{0}'",
    [ye.UNTERMINATED_SINGLE_QUOTE_IN_PLACEHOLDER]: 'Unterminated single quote in placeholder',
    [ye.UNKNOWN_ESCAPE_SEQUENCE]: 'Unknown escape sequence: \\{0}',
    [ye.INVALID_UNICODE_ESCAPE_SEQUENCE]: 'Invalid unicode escape sequence: {0}',
    [ye.UNBALANCED_CLOSING_BRACE]: 'Unbalanced closing brace',
    [ye.UNTERMINATED_CLOSING_BRACE]: 'Unterminated closing brace',
    [ye.EMPTY_PLACEHOLDER]: 'Empty placeholder',
    [ye.NOT_ALLOW_NEST_PLACEHOLDER]: 'Not allowed nest placeholder',
    [ye.INVALID_LINKED_FORMAT]: 'Invalid linked format',
    [ye.MUST_HAVE_MESSAGES_IN_PLURAL]: 'Plural must have messages',
    [ye.UNEXPECTED_EMPTY_LINKED_MODIFIER]: 'Unexpected empty linked modifier',
    [ye.UNEXPECTED_EMPTY_LINKED_KEY]: 'Unexpected empty linked key',
    [ye.UNEXPECTED_LEXICAL_ANALYSIS]: "Unexpected lexical analysis in token: '{0}'",
    [ye.UNHANDLED_CODEGEN_NODE_TYPE]: "unhandled codegen node type: '{0}'",
    [ye.UNHANDLED_MINIFIER_NODE_TYPE]: "unhandled mimifier node type: '{0}'"
  }
function hr(e, t, n = {}) {
  const { domain: s, messages: r, args: o } = n,
    a = cv((r || fv)[e] || '', ...(o || [])),
    i = new SyntaxError(String(a))
  return ((i.code = e), t && (i.location = t), (i.domain = s), i)
}
function mv(e) {
  throw e
}
const Tn = ' ',
  hv = '\r',
  kt = `
`,
  gv = '\u2028',
  pv = '\u2029'
function Ev(e) {
  const t = e
  let n = 0,
    s = 1,
    r = 1,
    o = 0
  const a = N => t[N] === hv && t[N + 1] === kt,
    i = N => t[N] === kt,
    u = N => t[N] === pv,
    c = N => t[N] === gv,
    d = N => a(N) || i(N) || u(N) || c(N),
    m = () => n,
    h = () => s,
    E = () => r,
    y = () => o,
    v = N => (a(N) || u(N) || c(N) ? kt : t[N]),
    I = () => v(n),
    b = () => v(n + o)
  function O() {
    return ((o = 0), d(n) && (s++, (r = 0)), a(n) && n++, n++, r++, t[n])
  }
  function P() {
    return (a(n + o) && o++, o++, t[n + o])
  }
  function T() {
    ;((n = 0), (s = 1), (r = 1), (o = 0))
  }
  function $(N = 0) {
    o = N
  }
  function L() {
    const N = n + o
    for (; N !== n; ) O()
    o = 0
  }
  return {
    index: m,
    line: h,
    column: E,
    peekOffset: y,
    charAt: v,
    currentChar: I,
    currentPeek: b,
    next: O,
    peek: P,
    reset: T,
    resetPeek: $,
    skipToPeek: L
  }
}
const jn = void 0,
  _v = '.',
  Ic = "'",
  yv = 'tokenizer'
function vv(e, t = {}) {
  const n = t.location !== !1,
    s = Ev(e),
    r = () => s.index(),
    o = () => lv(s.line(), s.column(), s.index()),
    a = o(),
    i = r(),
    u = {
      currentType: 14,
      offset: i,
      startLoc: a,
      endLoc: a,
      lastType: 14,
      lastOffset: i,
      lastStartLoc: a,
      lastEndLoc: a,
      braceNest: 0,
      inLinked: !1,
      text: ''
    },
    c = () => u,
    { onError: d } = t
  function m(p, g, R, ...k) {
    const V = c()
    if (((g.column += R), (g.offset += R), d)) {
      const Y = n ? Ui(V.startLoc, g) : null,
        J = hr(p, Y, { domain: yv, args: k })
      d(J)
    }
  }
  function h(p, g, R) {
    ;((p.endLoc = o()), (p.currentType = g))
    const k = { type: g }
    return (n && (k.loc = Ui(p.startLoc, p.endLoc)), R != null && (k.value = R), k)
  }
  const E = p => h(p, 14)
  function y(p, g) {
    return p.currentChar() === g ? (p.next(), g) : (m(ye.EXPECTED_TOKEN, o(), 0, g), '')
  }
  function v(p) {
    let g = ''
    for (; p.currentPeek() === Tn || p.currentPeek() === kt; ) ((g += p.currentPeek()), p.peek())
    return g
  }
  function I(p) {
    const g = v(p)
    return (p.skipToPeek(), g)
  }
  function b(p) {
    if (p === jn) return !1
    const g = p.charCodeAt(0)
    return (g >= 97 && g <= 122) || (g >= 65 && g <= 90) || g === 95
  }
  function O(p) {
    if (p === jn) return !1
    const g = p.charCodeAt(0)
    return g >= 48 && g <= 57
  }
  function P(p, g) {
    const { currentType: R } = g
    if (R !== 2) return !1
    v(p)
    const k = b(p.currentPeek())
    return (p.resetPeek(), k)
  }
  function T(p, g) {
    const { currentType: R } = g
    if (R !== 2) return !1
    v(p)
    const k = p.currentPeek() === '-' ? p.peek() : p.currentPeek(),
      V = O(k)
    return (p.resetPeek(), V)
  }
  function $(p, g) {
    const { currentType: R } = g
    if (R !== 2) return !1
    v(p)
    const k = p.currentPeek() === Ic
    return (p.resetPeek(), k)
  }
  function L(p, g) {
    const { currentType: R } = g
    if (R !== 8) return !1
    v(p)
    const k = p.currentPeek() === '.'
    return (p.resetPeek(), k)
  }
  function N(p, g) {
    const { currentType: R } = g
    if (R !== 9) return !1
    v(p)
    const k = b(p.currentPeek())
    return (p.resetPeek(), k)
  }
  function A(p, g) {
    const { currentType: R } = g
    if (!(R === 8 || R === 12)) return !1
    v(p)
    const k = p.currentPeek() === ':'
    return (p.resetPeek(), k)
  }
  function w(p, g) {
    const { currentType: R } = g
    if (R !== 10) return !1
    const k = () => {
        const Y = p.currentPeek()
        return Y === '{'
          ? b(p.peek())
          : Y === '@' || Y === '%' || Y === '|' || Y === ':' || Y === '.' || Y === Tn || !Y
            ? !1
            : Y === kt
              ? (p.peek(), k())
              : b(Y)
      },
      V = k()
    return (p.resetPeek(), V)
  }
  function B(p) {
    v(p)
    const g = p.currentPeek() === '|'
    return (p.resetPeek(), g)
  }
  function j(p) {
    const g = v(p),
      R = p.currentPeek() === '%' && p.peek() === '{'
    return (p.resetPeek(), { isModulo: R, hasSpace: g.length > 0 })
  }
  function D(p, g = !0) {
    const R = (V = !1, Y = '', J = !1) => {
        const z = p.currentPeek()
        return z === '{'
          ? Y === '%'
            ? !1
            : V
          : z === '@' || !z
            ? Y === '%'
              ? !0
              : V
            : z === '%'
              ? (p.peek(), R(V, '%', !0))
              : z === '|'
                ? Y === '%' || J
                  ? !0
                  : !(Y === Tn || Y === kt)
                : z === Tn
                  ? (p.peek(), R(!0, Tn, J))
                  : z === kt
                    ? (p.peek(), R(!0, kt, J))
                    : !0
      },
      k = R()
    return (g && p.resetPeek(), k)
  }
  function U(p, g) {
    const R = p.currentChar()
    return R === jn ? jn : g(R) ? (p.next(), R) : null
  }
  function X(p) {
    return U(p, R => {
      const k = R.charCodeAt(0)
      return (k >= 97 && k <= 122) || (k >= 65 && k <= 90) || (k >= 48 && k <= 57) || k === 95 || k === 36
    })
  }
  function ge(p) {
    return U(p, R => {
      const k = R.charCodeAt(0)
      return k >= 48 && k <= 57
    })
  }
  function te(p) {
    return U(p, R => {
      const k = R.charCodeAt(0)
      return (k >= 48 && k <= 57) || (k >= 65 && k <= 70) || (k >= 97 && k <= 102)
    })
  }
  function fe(p) {
    let g = '',
      R = ''
    for (; (g = ge(p)); ) R += g
    return R
  }
  function ce(p) {
    I(p)
    const g = p.currentChar()
    return (g !== '%' && m(ye.EXPECTED_TOKEN, o(), 0, g), p.next(), '%')
  }
  function ke(p) {
    let g = ''
    for (;;) {
      const R = p.currentChar()
      if (R === '{' || R === '}' || R === '@' || R === '|' || !R) break
      if (R === '%')
        if (D(p)) ((g += R), p.next())
        else break
      else if (R === Tn || R === kt)
        if (D(p)) ((g += R), p.next())
        else {
          if (B(p)) break
          ;((g += R), p.next())
        }
      else ((g += R), p.next())
    }
    return g
  }
  function ze(p) {
    I(p)
    let g = '',
      R = ''
    for (; (g = X(p)); ) R += g
    return (p.currentChar() === jn && m(ye.UNTERMINATED_CLOSING_BRACE, o(), 0), R)
  }
  function Ie(p) {
    I(p)
    let g = ''
    return (
      p.currentChar() === '-' ? (p.next(), (g += `-${fe(p)}`)) : (g += fe(p)),
      p.currentChar() === jn && m(ye.UNTERMINATED_CLOSING_BRACE, o(), 0),
      g
    )
  }
  function xe(p) {
    ;(I(p), y(p, "'"))
    let g = '',
      R = ''
    const k = Y => Y !== Ic && Y !== kt
    for (; (g = U(p, k)); ) g === '\\' ? (R += Le(p)) : (R += g)
    const V = p.currentChar()
    return V === kt || V === jn
      ? (m(ye.UNTERMINATED_SINGLE_QUOTE_IN_PLACEHOLDER, o(), 0), V === kt && (p.next(), y(p, "'")), R)
      : (y(p, "'"), R)
  }
  function Le(p) {
    const g = p.currentChar()
    switch (g) {
      case '\\':
      case "'":
        return (p.next(), `\\${g}`)
      case 'u':
        return et(p, g, 4)
      case 'U':
        return et(p, g, 6)
      default:
        return (m(ye.UNKNOWN_ESCAPE_SEQUENCE, o(), 0, g), '')
    }
  }
  function et(p, g, R) {
    y(p, g)
    let k = ''
    for (let V = 0; V < R; V++) {
      const Y = te(p)
      if (!Y) {
        m(ye.INVALID_UNICODE_ESCAPE_SEQUENCE, o(), 0, `\\${g}${k}${p.currentChar()}`)
        break
      }
      k += Y
    }
    return `\\${g}${k}`
  }
  function bt(p) {
    I(p)
    let g = '',
      R = ''
    const k = V => V !== '{' && V !== '}' && V !== Tn && V !== kt
    for (; (g = U(p, k)); ) R += g
    return R
  }
  function Fe(p) {
    let g = '',
      R = ''
    for (; (g = X(p)); ) R += g
    return R
  }
  function H(p) {
    const g = (R = !1, k) => {
      const V = p.currentChar()
      return V === '{' || V === '%' || V === '@' || V === '|' || V === '(' || V === ')' || !V || V === Tn
        ? k
        : V === kt || V === _v
          ? ((k += V), p.next(), g(R, k))
          : ((k += V), p.next(), g(!0, k))
    }
    return g(!1, '')
  }
  function ne(p) {
    I(p)
    const g = y(p, '|')
    return (I(p), g)
  }
  function Q(p, g) {
    let R = null
    switch (p.currentChar()) {
      case '{':
        return (
          g.braceNest >= 1 && m(ye.NOT_ALLOW_NEST_PLACEHOLDER, o(), 0),
          p.next(),
          (R = h(g, 2, '{')),
          I(p),
          g.braceNest++,
          R
        )
      case '}':
        return (
          g.braceNest > 0 && g.currentType === 2 && m(ye.EMPTY_PLACEHOLDER, o(), 0),
          p.next(),
          (R = h(g, 3, '}')),
          g.braceNest--,
          g.braceNest > 0 && I(p),
          g.inLinked && g.braceNest === 0 && (g.inLinked = !1),
          R
        )
      case '@':
        return (
          g.braceNest > 0 && m(ye.UNTERMINATED_CLOSING_BRACE, o(), 0),
          (R = le(p, g) || E(g)),
          (g.braceNest = 0),
          R
        )
      default: {
        let V = !0,
          Y = !0,
          J = !0
        if (B(p))
          return (
            g.braceNest > 0 && m(ye.UNTERMINATED_CLOSING_BRACE, o(), 0),
            (R = h(g, 1, ne(p))),
            (g.braceNest = 0),
            (g.inLinked = !1),
            R
          )
        if (g.braceNest > 0 && (g.currentType === 5 || g.currentType === 6 || g.currentType === 7))
          return (m(ye.UNTERMINATED_CLOSING_BRACE, o(), 0), (g.braceNest = 0), Pe(p, g))
        if ((V = P(p, g))) return ((R = h(g, 5, ze(p))), I(p), R)
        if ((Y = T(p, g))) return ((R = h(g, 6, Ie(p))), I(p), R)
        if ((J = $(p, g))) return ((R = h(g, 7, xe(p))), I(p), R)
        if (!V && !Y && !J) return ((R = h(g, 13, bt(p))), m(ye.INVALID_TOKEN_IN_PLACEHOLDER, o(), 0, R.value), I(p), R)
        break
      }
    }
    return R
  }
  function le(p, g) {
    const { currentType: R } = g
    let k = null
    const V = p.currentChar()
    switch (
      ((R === 8 || R === 9 || R === 12 || R === 10) && (V === kt || V === Tn) && m(ye.INVALID_LINKED_FORMAT, o(), 0), V)
    ) {
      case '@':
        return (p.next(), (k = h(g, 8, '@')), (g.inLinked = !0), k)
      case '.':
        return (I(p), p.next(), h(g, 9, '.'))
      case ':':
        return (I(p), p.next(), h(g, 10, ':'))
      default:
        return B(p)
          ? ((k = h(g, 1, ne(p))), (g.braceNest = 0), (g.inLinked = !1), k)
          : L(p, g) || A(p, g)
            ? (I(p), le(p, g))
            : N(p, g)
              ? (I(p), h(g, 12, Fe(p)))
              : w(p, g)
                ? (I(p), V === '{' ? Q(p, g) || k : h(g, 11, H(p)))
                : (R === 8 && m(ye.INVALID_LINKED_FORMAT, o(), 0), (g.braceNest = 0), (g.inLinked = !1), Pe(p, g))
    }
  }
  function Pe(p, g) {
    let R = { type: 14 }
    if (g.braceNest > 0) return Q(p, g) || E(g)
    if (g.inLinked) return le(p, g) || E(g)
    switch (p.currentChar()) {
      case '{':
        return Q(p, g) || E(g)
      case '}':
        return (m(ye.UNBALANCED_CLOSING_BRACE, o(), 0), p.next(), h(g, 3, '}'))
      case '@':
        return le(p, g) || E(g)
      default: {
        if (B(p)) return ((R = h(g, 1, ne(p))), (g.braceNest = 0), (g.inLinked = !1), R)
        const { isModulo: V, hasSpace: Y } = j(p)
        if (V) return Y ? h(g, 0, ke(p)) : h(g, 4, ce(p))
        if (D(p)) return h(g, 0, ke(p))
        break
      }
    }
    return R
  }
  function Xe() {
    const { currentType: p, offset: g, startLoc: R, endLoc: k } = u
    return (
      (u.lastType = p),
      (u.lastOffset = g),
      (u.lastStartLoc = R),
      (u.lastEndLoc = k),
      (u.offset = r()),
      (u.startLoc = o()),
      s.currentChar() === jn ? h(u, 14) : Pe(s, u)
    )
  }
  return { nextToken: Xe, currentOffset: r, currentPosition: o, context: c }
}
const bv = 'parser',
  Sv = /(?:\\\\|\\'|\\u([0-9a-fA-F]{4})|\\U([0-9a-fA-F]{6}))/g
function Rv(e, t, n) {
  switch (e) {
    case '\\\\':
      return '\\'
    case "\\'":
      return "'"
    default: {
      const s = parseInt(t || n, 16)
      return s <= 55295 || s >= 57344 ? String.fromCodePoint(s) : '�'
    }
  }
}
function Ov(e = {}) {
  const t = e.location !== !1,
    { onError: n } = e
  function s(b, O, P, T, ...$) {
    const L = b.currentPosition()
    if (((L.offset += T), (L.column += T), n)) {
      const N = t ? Ui(P, L) : null,
        A = hr(O, N, { domain: bv, args: $ })
      n(A)
    }
  }
  function r(b, O, P) {
    const T = { type: b }
    return (t && ((T.start = O), (T.end = O), (T.loc = { start: P, end: P })), T)
  }
  function o(b, O, P, T) {
    ;(T && (b.type = T), t && ((b.end = O), b.loc && (b.loc.end = P)))
  }
  function a(b, O) {
    const P = b.context(),
      T = r(3, P.offset, P.startLoc)
    return ((T.value = O), o(T, b.currentOffset(), b.currentPosition()), T)
  }
  function i(b, O) {
    const P = b.context(),
      { lastOffset: T, lastStartLoc: $ } = P,
      L = r(5, T, $)
    return ((L.index = parseInt(O, 10)), b.nextToken(), o(L, b.currentOffset(), b.currentPosition()), L)
  }
  function u(b, O) {
    const P = b.context(),
      { lastOffset: T, lastStartLoc: $ } = P,
      L = r(4, T, $)
    return ((L.key = O), b.nextToken(), o(L, b.currentOffset(), b.currentPosition()), L)
  }
  function c(b, O) {
    const P = b.context(),
      { lastOffset: T, lastStartLoc: $ } = P,
      L = r(9, T, $)
    return ((L.value = O.replace(Sv, Rv)), b.nextToken(), o(L, b.currentOffset(), b.currentPosition()), L)
  }
  function d(b) {
    const O = b.nextToken(),
      P = b.context(),
      { lastOffset: T, lastStartLoc: $ } = P,
      L = r(8, T, $)
    return O.type !== 12
      ? (s(b, ye.UNEXPECTED_EMPTY_LINKED_MODIFIER, P.lastStartLoc, 0),
        (L.value = ''),
        o(L, T, $),
        { nextConsumeToken: O, node: L })
      : (O.value == null && s(b, ye.UNEXPECTED_LEXICAL_ANALYSIS, P.lastStartLoc, 0, pn(O)),
        (L.value = O.value || ''),
        o(L, b.currentOffset(), b.currentPosition()),
        { node: L })
  }
  function m(b, O) {
    const P = b.context(),
      T = r(7, P.offset, P.startLoc)
    return ((T.value = O), o(T, b.currentOffset(), b.currentPosition()), T)
  }
  function h(b) {
    const O = b.context(),
      P = r(6, O.offset, O.startLoc)
    let T = b.nextToken()
    if (T.type === 9) {
      const $ = d(b)
      ;((P.modifier = $.node), (T = $.nextConsumeToken || b.nextToken()))
    }
    switch (
      (T.type !== 10 && s(b, ye.UNEXPECTED_LEXICAL_ANALYSIS, O.lastStartLoc, 0, pn(T)),
      (T = b.nextToken()),
      T.type === 2 && (T = b.nextToken()),
      T.type)
    ) {
      case 11:
        ;(T.value == null && s(b, ye.UNEXPECTED_LEXICAL_ANALYSIS, O.lastStartLoc, 0, pn(T)),
          (P.key = m(b, T.value || '')))
        break
      case 5:
        ;(T.value == null && s(b, ye.UNEXPECTED_LEXICAL_ANALYSIS, O.lastStartLoc, 0, pn(T)),
          (P.key = u(b, T.value || '')))
        break
      case 6:
        ;(T.value == null && s(b, ye.UNEXPECTED_LEXICAL_ANALYSIS, O.lastStartLoc, 0, pn(T)),
          (P.key = i(b, T.value || '')))
        break
      case 7:
        ;(T.value == null && s(b, ye.UNEXPECTED_LEXICAL_ANALYSIS, O.lastStartLoc, 0, pn(T)),
          (P.key = c(b, T.value || '')))
        break
      default: {
        s(b, ye.UNEXPECTED_EMPTY_LINKED_KEY, O.lastStartLoc, 0)
        const $ = b.context(),
          L = r(7, $.offset, $.startLoc)
        return (
          (L.value = ''),
          o(L, $.offset, $.startLoc),
          (P.key = L),
          o(P, $.offset, $.startLoc),
          { nextConsumeToken: T, node: P }
        )
      }
    }
    return (o(P, b.currentOffset(), b.currentPosition()), { node: P })
  }
  function E(b) {
    const O = b.context(),
      P = O.currentType === 1 ? b.currentOffset() : O.offset,
      T = O.currentType === 1 ? O.endLoc : O.startLoc,
      $ = r(2, P, T)
    $.items = []
    let L = null
    do {
      const w = L || b.nextToken()
      switch (((L = null), w.type)) {
        case 0:
          ;(w.value == null && s(b, ye.UNEXPECTED_LEXICAL_ANALYSIS, O.lastStartLoc, 0, pn(w)),
            $.items.push(a(b, w.value || '')))
          break
        case 6:
          ;(w.value == null && s(b, ye.UNEXPECTED_LEXICAL_ANALYSIS, O.lastStartLoc, 0, pn(w)),
            $.items.push(i(b, w.value || '')))
          break
        case 5:
          ;(w.value == null && s(b, ye.UNEXPECTED_LEXICAL_ANALYSIS, O.lastStartLoc, 0, pn(w)),
            $.items.push(u(b, w.value || '')))
          break
        case 7:
          ;(w.value == null && s(b, ye.UNEXPECTED_LEXICAL_ANALYSIS, O.lastStartLoc, 0, pn(w)),
            $.items.push(c(b, w.value || '')))
          break
        case 8: {
          const B = h(b)
          ;($.items.push(B.node), (L = B.nextConsumeToken || null))
          break
        }
      }
    } while (O.currentType !== 14 && O.currentType !== 1)
    const N = O.currentType === 1 ? O.lastOffset : b.currentOffset(),
      A = O.currentType === 1 ? O.lastEndLoc : b.currentPosition()
    return (o($, N, A), $)
  }
  function y(b, O, P, T) {
    const $ = b.context()
    let L = T.items.length === 0
    const N = r(1, O, P)
    ;((N.cases = []), N.cases.push(T))
    do {
      const A = E(b)
      ;(L || (L = A.items.length === 0), N.cases.push(A))
    } while ($.currentType !== 14)
    return (L && s(b, ye.MUST_HAVE_MESSAGES_IN_PLURAL, P, 0), o(N, b.currentOffset(), b.currentPosition()), N)
  }
  function v(b) {
    const O = b.context(),
      { offset: P, startLoc: T } = O,
      $ = E(b)
    return O.currentType === 14 ? $ : y(b, P, T, $)
  }
  function I(b) {
    const O = vv(b, ih({}, e)),
      P = O.context(),
      T = r(0, P.offset, P.startLoc)
    return (
      t && T.loc && (T.loc.source = b),
      (T.body = v(O)),
      e.onCacheKey && (T.cacheKey = e.onCacheKey(b)),
      P.currentType !== 14 && s(O, ye.UNEXPECTED_LEXICAL_ANALYSIS, P.lastStartLoc, 0, b[P.offset] || ''),
      o(T, O.currentOffset(), O.currentPosition()),
      T
    )
  }
  return { parse: I }
}
function pn(e) {
  if (e.type === 14) return 'EOF'
  const t = (e.value || '').replace(/\r?\n/gu, '\\n')
  return t.length > 10 ? t.slice(0, 9) + '…' : t
}
function Cv(e, t = {}) {
  const n = { ast: e, helpers: new Set() }
  return { context: () => n, helper: o => (n.helpers.add(o), o) }
}
function Tc(e, t) {
  for (let n = 0; n < e.length; n++) ql(e[n], t)
}
function ql(e, t) {
  switch (e.type) {
    case 1:
      ;(Tc(e.cases, t), t.helper('plural'))
      break
    case 2:
      Tc(e.items, t)
      break
    case 6: {
      ;(ql(e.key, t), t.helper('linked'), t.helper('type'))
      break
    }
    case 5:
      ;(t.helper('interpolate'), t.helper('list'))
      break
    case 4:
      ;(t.helper('interpolate'), t.helper('named'))
      break
  }
}
function Av(e, t = {}) {
  const n = Cv(e)
  ;(n.helper('normalize'), e.body && ql(e.body, n))
  const s = n.context()
  e.helpers = Array.from(s.helpers)
}
function Iv(e) {
  const t = e.body
  return (t.type === 2 ? Nc(t) : t.cases.forEach(n => Nc(n)), e)
}
function Nc(e) {
  if (e.items.length === 1) {
    const t = e.items[0]
    ;(t.type === 3 || t.type === 9) && ((e.static = t.value), delete t.value)
  } else {
    const t = []
    for (let n = 0; n < e.items.length; n++) {
      const s = e.items[n]
      if (!(s.type === 3 || s.type === 9) || s.value == null) break
      t.push(s.value)
    }
    if (t.length === e.items.length) {
      e.static = lh(t)
      for (let n = 0; n < e.items.length; n++) {
        const s = e.items[n]
        ;(s.type === 3 || s.type === 9) && delete s.value
      }
    }
  }
}
const Tv = 'minifier'
function Bs(e) {
  switch (((e.t = e.type), e.type)) {
    case 0: {
      const t = e
      ;(Bs(t.body), (t.b = t.body), delete t.body)
      break
    }
    case 1: {
      const t = e,
        n = t.cases
      for (let s = 0; s < n.length; s++) Bs(n[s])
      ;((t.c = n), delete t.cases)
      break
    }
    case 2: {
      const t = e,
        n = t.items
      for (let s = 0; s < n.length; s++) Bs(n[s])
      ;((t.i = n), delete t.items, t.static && ((t.s = t.static), delete t.static))
      break
    }
    case 3:
    case 9:
    case 8:
    case 7: {
      const t = e
      t.value && ((t.v = t.value), delete t.value)
      break
    }
    case 6: {
      const t = e
      ;(Bs(t.key), (t.k = t.key), delete t.key, t.modifier && (Bs(t.modifier), (t.m = t.modifier), delete t.modifier))
      break
    }
    case 5: {
      const t = e
      ;((t.i = t.index), delete t.index)
      break
    }
    case 4: {
      const t = e
      ;((t.k = t.key), delete t.key)
      break
    }
    default:
      throw hr(ye.UNHANDLED_MINIFIER_NODE_TYPE, null, { domain: Tv, args: [e.type] })
  }
  delete e.type
}
const Nv = 'parser'
function wv(e, t) {
  const { sourceMap: n, filename: s, breakLineCode: r, needIndent: o } = t,
    a = t.location !== !1,
    i = {
      filename: s,
      code: '',
      column: 1,
      line: 1,
      offset: 0,
      map: void 0,
      breakLineCode: r,
      needIndent: o,
      indentLevel: 0
    }
  a && e.loc && (i.source = e.loc.source)
  const u = () => i
  function c(I, b) {
    i.code += I
  }
  function d(I, b = !0) {
    const O = b ? r : ''
    c(o ? O + '  '.repeat(I) : O)
  }
  function m(I = !0) {
    const b = ++i.indentLevel
    I && d(b)
  }
  function h(I = !0) {
    const b = --i.indentLevel
    I && d(b)
  }
  function E() {
    d(i.indentLevel)
  }
  return {
    context: u,
    push: c,
    indent: m,
    deindent: h,
    newline: E,
    helper: I => `_${I}`,
    needIndent: () => i.needIndent
  }
}
function Lv(e, t) {
  const { helper: n } = e
  ;(e.push(`${n('linked')}(`),
    er(e, t.key),
    t.modifier ? (e.push(', '), er(e, t.modifier), e.push(', _type')) : e.push(', undefined, _type'),
    e.push(')'))
}
function Pv(e, t) {
  const { helper: n, needIndent: s } = e
  ;(e.push(`${n('normalize')}([`), e.indent(s()))
  const r = t.items.length
  for (let o = 0; o < r && (er(e, t.items[o]), o !== r - 1); o++) e.push(', ')
  ;(e.deindent(s()), e.push('])'))
}
function $v(e, t) {
  const { helper: n, needIndent: s } = e
  if (t.cases.length > 1) {
    ;(e.push(`${n('plural')}([`), e.indent(s()))
    const r = t.cases.length
    for (let o = 0; o < r && (er(e, t.cases[o]), o !== r - 1); o++) e.push(', ')
    ;(e.deindent(s()), e.push('])'))
  }
}
function Mv(e, t) {
  t.body ? er(e, t.body) : e.push('null')
}
function er(e, t) {
  const { helper: n } = e
  switch (t.type) {
    case 0:
      Mv(e, t)
      break
    case 1:
      $v(e, t)
      break
    case 2:
      Pv(e, t)
      break
    case 6:
      Lv(e, t)
      break
    case 8:
      e.push(JSON.stringify(t.value), t)
      break
    case 7:
      e.push(JSON.stringify(t.value), t)
      break
    case 5:
      e.push(`${n('interpolate')}(${n('list')}(${t.index}))`, t)
      break
    case 4:
      e.push(`${n('interpolate')}(${n('named')}(${JSON.stringify(t.key)}))`, t)
      break
    case 9:
      e.push(JSON.stringify(t.value), t)
      break
    case 3:
      e.push(JSON.stringify(t.value), t)
      break
    default:
      throw hr(ye.UNHANDLED_CODEGEN_NODE_TYPE, null, { domain: Nv, args: [t.type] })
  }
}
const kv = (e, t = {}) => {
  const n = Ac(t.mode) ? t.mode : 'normal',
    s = Ac(t.filename) ? t.filename : 'message.intl',
    r = !!t.sourceMap,
    o =
      t.breakLineCode != null
        ? t.breakLineCode
        : n === 'arrow'
          ? ';'
          : `
`,
    a = t.needIndent ? t.needIndent : n !== 'arrow',
    i = e.helpers || [],
    u = wv(e, { mode: n, filename: s, sourceMap: r, breakLineCode: o, needIndent: a })
  ;(u.push(n === 'normal' ? 'function __msg__ (ctx) {' : '(ctx) => {'),
    u.indent(a),
    i.length > 0 &&
      (u.push(
        `const { ${lh(
          i.map(m => `${m}: _${m}`),
          ', '
        )} } = ctx`
      ),
      u.newline()),
    u.push('return '),
    er(u, e),
    u.deindent(a),
    u.push('}'),
    delete e.helpers)
  const { code: c, map: d } = u.context()
  return { ast: e, code: c, map: d ? d.toJSON() : void 0 }
}
function Dv(e, t = {}) {
  const n = ih({}, t),
    s = !!n.jit,
    r = !!n.minify,
    o = n.optimize == null ? !0 : n.optimize,
    i = Ov(n).parse(e)
  return s ? (o && Iv(i), r && Bs(i), { ast: i, code: '' }) : (Av(i, n), kv(i, n))
}
/*!
 * core-base v9.10.2
 * (c) 2024 kazuya kawaguchi
 * Released under the MIT License.
 */ function Fv() {
  ;(typeof __INTLIFY_PROD_DEVTOOLS__ != 'boolean' && (Pn().__INTLIFY_PROD_DEVTOOLS__ = !1),
    typeof __INTLIFY_JIT_COMPILATION__ != 'boolean' && (Pn().__INTLIFY_JIT_COMPILATION__ = !1),
    typeof __INTLIFY_DROP_MESSAGE_COMPILER__ != 'boolean' && (Pn().__INTLIFY_DROP_MESSAGE_COMPILER__ = !1))
}
const ds = []
ds[0] = { w: [0], i: [3, 0], '[': [4], o: [7] }
ds[1] = { w: [1], '.': [2], '[': [4], o: [7] }
ds[2] = { w: [2], i: [3, 0], 0: [3, 0] }
ds[3] = { i: [3, 0], 0: [3, 0], w: [1, 1], '.': [2, 1], '[': [4, 1], o: [7, 1] }
ds[4] = { "'": [5, 0], '"': [6, 0], '[': [4, 2], ']': [1, 3], o: 8, l: [4, 0] }
ds[5] = { "'": [4, 0], o: 8, l: [5, 0] }
ds[6] = { '"': [4, 0], o: 8, l: [6, 0] }
const Vv = /^\s?(?:true|false|-?[\d.]+|'[^']*'|"[^"]*")\s?$/
function xv(e) {
  return Vv.test(e)
}
function Bv(e) {
  const t = e.charCodeAt(0),
    n = e.charCodeAt(e.length - 1)
  return t === n && (t === 34 || t === 39) ? e.slice(1, -1) : e
}
function Uv(e) {
  if (e == null) return 'o'
  switch (e.charCodeAt(0)) {
    case 91:
    case 93:
    case 46:
    case 34:
    case 39:
      return e
    case 95:
    case 36:
    case 45:
      return 'i'
    case 9:
    case 10:
    case 13:
    case 160:
    case 65279:
    case 8232:
    case 8233:
      return 'w'
  }
  return 'i'
}
function Gv(e) {
  const t = e.trim()
  return e.charAt(0) === '0' && isNaN(parseInt(e)) ? !1 : xv(t) ? Bv(t) : '*' + t
}
function Wv(e) {
  const t = []
  let n = -1,
    s = 0,
    r = 0,
    o,
    a,
    i,
    u,
    c,
    d,
    m
  const h = []
  ;((h[0] = () => {
    a === void 0 ? (a = i) : (a += i)
  }),
    (h[1] = () => {
      a !== void 0 && (t.push(a), (a = void 0))
    }),
    (h[2] = () => {
      ;(h[0](), r++)
    }),
    (h[3] = () => {
      if (r > 0) (r--, (s = 4), h[0]())
      else {
        if (((r = 0), a === void 0 || ((a = Gv(a)), a === !1))) return !1
        h[1]()
      }
    }))
  function E() {
    const y = e[n + 1]
    if ((s === 5 && y === "'") || (s === 6 && y === '"')) return (n++, (i = '\\' + y), h[0](), !0)
  }
  for (; s !== null; )
    if ((n++, (o = e[n]), !(o === '\\' && E()))) {
      if (
        ((u = Uv(o)),
        (m = ds[s]),
        (c = m[u] || m.l || 8),
        c === 8 || ((s = c[0]), c[1] !== void 0 && ((d = h[c[1]]), d && ((i = o), d() === !1))))
      )
        return
      if (s === 7) return t
    }
}
const wc = new Map()
function Hv(e, t) {
  return Je(e) ? e[t] : null
}
function jv(e, t) {
  if (!Je(e)) return null
  let n = wc.get(t)
  if ((n || ((n = Wv(t)), n && wc.set(t, n)), !n)) return null
  const s = n.length
  let r = e,
    o = 0
  for (; o < s; ) {
    const a = r[n[o]]
    if (a === void 0 || st(r)) return null
    ;((r = a), o++)
  }
  return r
}
const Yv = e => e,
  Kv = e => '',
  qv = 'text',
  zv = e => (e.length === 0 ? '' : av(e)),
  Xv = ov
function Lc(e, t) {
  return ((e = Math.abs(e)), t === 2 ? (e ? (e > 1 ? 1 : 0) : 1) : e ? Math.min(e, 2) : 0)
}
function Jv(e) {
  const t = _t(e.pluralIndex) ? e.pluralIndex : -1
  return e.named && (_t(e.named.count) || _t(e.named.n))
    ? _t(e.named.count)
      ? e.named.count
      : _t(e.named.n)
        ? e.named.n
        : t
    : t
}
function Qv(e, t) {
  ;(t.count || (t.count = e), t.n || (t.n = e))
}
function Zv(e = {}) {
  const t = e.locale,
    n = Jv(e),
    s = Je(e.pluralRules) && re(t) && st(e.pluralRules[t]) ? e.pluralRules[t] : Lc,
    r = Je(e.pluralRules) && re(t) && st(e.pluralRules[t]) ? Lc : void 0,
    o = b => b[s(n, b.length, r)],
    a = e.list || [],
    i = b => a[b],
    u = e.named || {}
  _t(e.pluralIndex) && Qv(n, u)
  const c = b => u[b]
  function d(b) {
    const O = st(e.messages) ? e.messages(b) : Je(e.messages) ? e.messages[b] : !1
    return O || (e.parent ? e.parent.message(b) : Kv)
  }
  const m = b => (e.modifiers ? e.modifiers[b] : Yv),
    h = Re(e.processor) && st(e.processor.normalize) ? e.processor.normalize : zv,
    E = Re(e.processor) && st(e.processor.interpolate) ? e.processor.interpolate : Xv,
    y = Re(e.processor) && re(e.processor.type) ? e.processor.type : qv,
    I = {
      list: i,
      named: c,
      plural: o,
      linked: (b, ...O) => {
        const [P, T] = O
        let $ = 'text',
          L = ''
        O.length === 1
          ? Je(P)
            ? ((L = P.modifier || L), ($ = P.type || $))
            : re(P) && (L = P || L)
          : O.length === 2 && (re(P) && (L = P || L), re(T) && ($ = T || $))
        const N = d(b)(I),
          A = $ === 'vnode' && at(N) && L ? N[0] : N
        return L ? m(L)(A, $) : A
      },
      message: d,
      type: y,
      interpolate: E,
      normalize: h,
      values: It({}, a, u)
    }
  return I
}
let qr = null
function eb(e) {
  qr = e
}
function tb(e, t, n) {
  qr && qr.emit('i18n:init', { timestamp: Date.now(), i18n: e, version: t, meta: n })
}
const nb = sb('function:translate')
function sb(e) {
  return t => qr && qr.emit(e, t)
}
const rb = {
    NOT_FOUND_KEY: 1,
    FALLBACK_TO_TRANSLATE: 2,
    CANNOT_FORMAT_NUMBER: 3,
    FALLBACK_TO_NUMBER_FORMAT: 4,
    CANNOT_FORMAT_DATE: 5,
    FALLBACK_TO_DATE_FORMAT: 6,
    EXPERIMENTAL_CUSTOM_MESSAGE_COMPILER: 7,
    __EXTEND_POINT__: 8
  },
  uh = ye.__EXTEND_POINT__,
  ps = Kl(uh),
  cn = {
    INVALID_ARGUMENT: uh,
    INVALID_DATE_ARGUMENT: ps(),
    INVALID_ISO_DATE_ARGUMENT: ps(),
    NOT_SUPPORT_NON_STRING_MESSAGE: ps(),
    NOT_SUPPORT_LOCALE_PROMISE_VALUE: ps(),
    NOT_SUPPORT_LOCALE_ASYNC_FUNCTION: ps(),
    NOT_SUPPORT_LOCALE_TYPE: ps(),
    __EXTEND_POINT__: ps()
  }
function vn(e) {
  return hr(e, null, void 0)
}
function zl(e, t) {
  return t.locale != null ? Pc(t.locale) : Pc(e.locale)
}
let li
function Pc(e) {
  if (re(e)) return e
  if (st(e)) {
    if (e.resolvedOnce && li != null) return li
    if (e.constructor.name === 'Function') {
      const t = e()
      if (rv(t)) throw vn(cn.NOT_SUPPORT_LOCALE_PROMISE_VALUE)
      return (li = t)
    } else throw vn(cn.NOT_SUPPORT_LOCALE_ASYNC_FUNCTION)
  } else throw vn(cn.NOT_SUPPORT_LOCALE_TYPE)
}
function ob(e, t, n) {
  return [...new Set([n, ...(at(t) ? t : Je(t) ? Object.keys(t) : re(t) ? [t] : [n])])]
}
function ch(e, t, n) {
  const s = re(n) ? n : tr,
    r = e
  r.__localeChainCache || (r.__localeChainCache = new Map())
  let o = r.__localeChainCache.get(s)
  if (!o) {
    o = []
    let a = [n]
    for (; at(a); ) a = $c(o, a, t)
    const i = at(t) || !Re(t) ? t : t.default ? t.default : null
    ;((a = re(i) ? [i] : i), at(a) && $c(o, a, !1), r.__localeChainCache.set(s, o))
  }
  return o
}
function $c(e, t, n) {
  let s = !0
  for (let r = 0; r < t.length && $e(s); r++) {
    const o = t[r]
    re(o) && (s = ab(e, t[r], n))
  }
  return s
}
function ab(e, t, n) {
  let s
  const r = t.split('-')
  do {
    const o = r.join('-')
    ;((s = ib(e, o, n)), r.splice(-1, 1))
  } while (r.length && s === !0)
  return s
}
function ib(e, t, n) {
  let s = !1
  if (!e.includes(t) && ((s = !0), t)) {
    s = t[t.length - 1] !== '!'
    const r = t.replace(/!/g, '')
    ;(e.push(r), (at(n) || Re(n)) && n[r] && (s = n[r]))
  }
  return s
}
const lb = '9.10.2',
  Ma = -1,
  tr = 'en-US',
  Mc = '',
  kc = e => `${e.charAt(0).toLocaleUpperCase()}${e.substr(1)}`
function ub() {
  return {
    upper: (e, t) =>
      t === 'text' && re(e)
        ? e.toUpperCase()
        : t === 'vnode' && Je(e) && '__v_isVNode' in e
          ? e.children.toUpperCase()
          : e,
    lower: (e, t) =>
      t === 'text' && re(e)
        ? e.toLowerCase()
        : t === 'vnode' && Je(e) && '__v_isVNode' in e
          ? e.children.toLowerCase()
          : e,
    capitalize: (e, t) =>
      t === 'text' && re(e) ? kc(e) : t === 'vnode' && Je(e) && '__v_isVNode' in e ? kc(e.children) : e
  }
}
let dh
function Dc(e) {
  dh = e
}
let fh
function cb(e) {
  fh = e
}
let mh
function db(e) {
  mh = e
}
let hh = null
const fb = e => {
    hh = e
  },
  mb = () => hh
let gh = null
const Fc = e => {
    gh = e
  },
  hb = () => gh
let Vc = 0
function gb(e = {}) {
  const t = st(e.onWarn) ? e.onWarn : iv,
    n = re(e.version) ? e.version : lb,
    s = re(e.locale) || st(e.locale) ? e.locale : tr,
    r = st(s) ? tr : s,
    o =
      at(e.fallbackLocale) || Re(e.fallbackLocale) || re(e.fallbackLocale) || e.fallbackLocale === !1
        ? e.fallbackLocale
        : r,
    a = Re(e.messages) ? e.messages : { [r]: {} },
    i = Re(e.datetimeFormats) ? e.datetimeFormats : { [r]: {} },
    u = Re(e.numberFormats) ? e.numberFormats : { [r]: {} },
    c = It({}, e.modifiers || {}, ub()),
    d = e.pluralRules || {},
    m = st(e.missing) ? e.missing : null,
    h = $e(e.missingWarn) || as(e.missingWarn) ? e.missingWarn : !0,
    E = $e(e.fallbackWarn) || as(e.fallbackWarn) ? e.fallbackWarn : !0,
    y = !!e.fallbackFormat,
    v = !!e.unresolving,
    I = st(e.postTranslation) ? e.postTranslation : null,
    b = Re(e.processor) ? e.processor : null,
    O = $e(e.warnHtmlMessage) ? e.warnHtmlMessage : !0,
    P = !!e.escapeParameter,
    T = st(e.messageCompiler) ? e.messageCompiler : dh,
    $ = st(e.messageResolver) ? e.messageResolver : fh || Hv,
    L = st(e.localeFallbacker) ? e.localeFallbacker : mh || ob,
    N = Je(e.fallbackContext) ? e.fallbackContext : void 0,
    A = e,
    w = Je(A.__datetimeFormatters) ? A.__datetimeFormatters : new Map(),
    B = Je(A.__numberFormatters) ? A.__numberFormatters : new Map(),
    j = Je(A.__meta) ? A.__meta : {}
  Vc++
  const D = {
    version: n,
    cid: Vc,
    locale: s,
    fallbackLocale: o,
    messages: a,
    modifiers: c,
    pluralRules: d,
    missing: m,
    missingWarn: h,
    fallbackWarn: E,
    fallbackFormat: y,
    unresolving: v,
    postTranslation: I,
    processor: b,
    warnHtmlMessage: O,
    escapeParameter: P,
    messageCompiler: T,
    messageResolver: $,
    localeFallbacker: L,
    fallbackContext: N,
    onWarn: t,
    __meta: j
  }
  return (
    (D.datetimeFormats = i),
    (D.numberFormats = u),
    (D.__datetimeFormatters = w),
    (D.__numberFormatters = B),
    __INTLIFY_PROD_DEVTOOLS__ && tb(D, n, j),
    D
  )
}
function Xl(e, t, n, s, r) {
  const { missing: o, onWarn: a } = e
  if (o !== null) {
    const i = o(e, n, t, r)
    return re(i) ? i : t
  } else return t
}
function Sr(e, t, n) {
  const s = e
  ;((s.__localeChainCache = new Map()), e.localeFallbacker(e, n, t))
}
function ui(e) {
  return n => pb(n, e)
}
function pb(e, t) {
  const n = t.b || t.body
  if ((n.t || n.type) === 1) {
    const s = n,
      r = s.c || s.cases
    return e.plural(r.reduce((o, a) => [...o, xc(e, a)], []))
  } else return xc(e, n)
}
function xc(e, t) {
  const n = t.s || t.static
  if (n) return e.type === 'text' ? n : e.normalize([n])
  {
    const s = (t.i || t.items).reduce((r, o) => [...r, Gi(e, o)], [])
    return e.normalize(s)
  }
}
function Gi(e, t) {
  const n = t.t || t.type
  switch (n) {
    case 3: {
      const s = t
      return s.v || s.value
    }
    case 9: {
      const s = t
      return s.v || s.value
    }
    case 4: {
      const s = t
      return e.interpolate(e.named(s.k || s.key))
    }
    case 5: {
      const s = t
      return e.interpolate(e.list(s.i != null ? s.i : s.index))
    }
    case 6: {
      const s = t,
        r = s.m || s.modifier
      return e.linked(Gi(e, s.k || s.key), r ? Gi(e, r) : void 0, e.type)
    }
    case 7: {
      const s = t
      return s.v || s.value
    }
    case 8: {
      const s = t
      return s.v || s.value
    }
    default:
      throw new Error(`unhandled node type on format message part: ${n}`)
  }
}
const ph = e => e
let Gs = Object.create(null)
const nr = e => Je(e) && (e.t === 0 || e.type === 0) && ('b' in e || 'body' in e)
function Eh(e, t = {}) {
  let n = !1
  const s = t.onError || mv
  return (
    (t.onError = r => {
      ;((n = !0), s(r))
    }),
    { ...Dv(e, t), detectError: n }
  )
}
const Eb = (e, t) => {
  if (!re(e)) throw vn(cn.NOT_SUPPORT_NON_STRING_MESSAGE)
  {
    $e(t.warnHtmlMessage) && t.warnHtmlMessage
    const s = (t.onCacheKey || ph)(e),
      r = Gs[s]
    if (r) return r
    const { code: o, detectError: a } = Eh(e, t),
      i = new Function(`return ${o}`)()
    return a ? i : (Gs[s] = i)
  }
}
function _b(e, t) {
  if (__INTLIFY_JIT_COMPILATION__ && !__INTLIFY_DROP_MESSAGE_COMPILER__ && re(e)) {
    $e(t.warnHtmlMessage) && t.warnHtmlMessage
    const s = (t.onCacheKey || ph)(e),
      r = Gs[s]
    if (r) return r
    const { ast: o, detectError: a } = Eh(e, { ...t, location: !1, jit: !0 }),
      i = ui(o)
    return a ? i : (Gs[s] = i)
  } else {
    const n = e.cacheKey
    if (n) {
      const s = Gs[n]
      return s || (Gs[n] = ui(e))
    } else return ui(e)
  }
}
const Bc = () => '',
  en = e => st(e)
function Uc(e, ...t) {
  const {
      fallbackFormat: n,
      postTranslation: s,
      unresolving: r,
      messageCompiler: o,
      fallbackLocale: a,
      messages: i
    } = e,
    [u, c] = Wi(...t),
    d = $e(c.missingWarn) ? c.missingWarn : e.missingWarn,
    m = $e(c.fallbackWarn) ? c.fallbackWarn : e.fallbackWarn,
    h = $e(c.escapeParameter) ? c.escapeParameter : e.escapeParameter,
    E = !!c.resolvedMessage,
    y = re(c.default) || $e(c.default) ? ($e(c.default) ? (o ? u : () => u) : c.default) : n ? (o ? u : () => u) : '',
    v = n || y !== '',
    I = zl(e, c)
  h && yb(c)
  let [b, O, P] = E ? [u, I, i[I] || {}] : _h(e, u, I, a, m, d),
    T = b,
    $ = u
  if ((!E && !(re(T) || nr(T) || en(T)) && v && ((T = y), ($ = T)), !E && (!(re(T) || nr(T) || en(T)) || !re(O))))
    return r ? Ma : u
  let L = !1
  const N = () => {
      L = !0
    },
    A = en(T) ? T : yh(e, u, O, T, $, N)
  if (L) return T
  const w = Sb(e, O, P, c),
    B = Zv(w),
    j = vb(e, A, B),
    D = s ? s(j, u) : j
  if (__INTLIFY_PROD_DEVTOOLS__) {
    const U = {
      timestamp: Date.now(),
      key: re(u) ? u : en(T) ? T.key : '',
      locale: O || (en(T) ? T.locale : ''),
      format: re(T) ? T : en(T) ? T.source : '',
      message: D
    }
    ;((U.meta = It({}, e.__meta, mb() || {})), nb(U))
  }
  return D
}
function yb(e) {
  at(e.list)
    ? (e.list = e.list.map(t => (re(t) ? Cc(t) : t)))
    : Je(e.named) &&
      Object.keys(e.named).forEach(t => {
        re(e.named[t]) && (e.named[t] = Cc(e.named[t]))
      })
}
function _h(e, t, n, s, r, o) {
  const { messages: a, onWarn: i, messageResolver: u, localeFallbacker: c } = e,
    d = c(e, s, n)
  let m = {},
    h,
    E = null
  const y = 'translate'
  for (
    let v = 0;
    v < d.length && ((h = d[v]), (m = a[h] || {}), (E = u(m, t)) === null && (E = m[t]), !(re(E) || nr(E) || en(E)));
    v++
  ) {
    const I = Xl(e, t, h, o, y)
    I !== t && (E = I)
  }
  return [E, h, m]
}
function yh(e, t, n, s, r, o) {
  const { messageCompiler: a, warnHtmlMessage: i } = e
  if (en(s)) {
    const c = s
    return ((c.locale = c.locale || n), (c.key = c.key || t), c)
  }
  if (a == null) {
    const c = () => s
    return ((c.locale = n), (c.key = t), c)
  }
  const u = a(s, bb(e, n, r, s, i, o))
  return ((u.locale = n), (u.key = t), (u.source = s), u)
}
function vb(e, t, n) {
  return t(n)
}
function Wi(...e) {
  const [t, n, s] = e,
    r = {}
  if (!re(t) && !_t(t) && !en(t) && !nr(t)) throw vn(cn.INVALID_ARGUMENT)
  const o = _t(t) ? String(t) : (en(t), t)
  return (
    _t(n) ? (r.plural = n) : re(n) ? (r.default = n) : Re(n) && !$a(n) ? (r.named = n) : at(n) && (r.list = n),
    _t(s) ? (r.plural = s) : re(s) ? (r.default = s) : Re(s) && It(r, s),
    [o, r]
  )
}
function bb(e, t, n, s, r, o) {
  return {
    locale: t,
    key: n,
    warnHtmlMessage: r,
    onError: a => {
      throw (o && o(a), a)
    },
    onCacheKey: a => ev(t, n, a)
  }
}
function Sb(e, t, n, s) {
  const {
      modifiers: r,
      pluralRules: o,
      messageResolver: a,
      fallbackLocale: i,
      fallbackWarn: u,
      missingWarn: c,
      fallbackContext: d
    } = e,
    h = {
      locale: t,
      modifiers: r,
      pluralRules: o,
      messages: E => {
        let y = a(n, E)
        if (y == null && d) {
          const [, , v] = _h(d, E, t, i, u, c)
          y = a(v, E)
        }
        if (re(y) || nr(y)) {
          let v = !1
          const b = yh(e, E, t, y, E, () => {
            v = !0
          })
          return v ? Bc : b
        } else return en(y) ? y : Bc
      }
    }
  return (
    e.processor && (h.processor = e.processor),
    s.list && (h.list = s.list),
    s.named && (h.named = s.named),
    _t(s.plural) && (h.pluralIndex = s.plural),
    h
  )
}
function Gc(e, ...t) {
  const { datetimeFormats: n, unresolving: s, fallbackLocale: r, onWarn: o, localeFallbacker: a } = e,
    { __datetimeFormatters: i } = e,
    [u, c, d, m] = Hi(...t),
    h = $e(d.missingWarn) ? d.missingWarn : e.missingWarn
  $e(d.fallbackWarn) ? d.fallbackWarn : e.fallbackWarn
  const E = !!d.part,
    y = zl(e, d),
    v = a(e, r, y)
  if (!re(u) || u === '') return new Intl.DateTimeFormat(y, m).format(c)
  let I = {},
    b,
    O = null
  const P = 'datetime format'
  for (let L = 0; L < v.length && ((b = v[L]), (I = n[b] || {}), (O = I[u]), !Re(O)); L++) Xl(e, u, b, h, P)
  if (!Re(O) || !re(b)) return s ? Ma : u
  let T = `${b}__${u}`
  $a(m) || (T = `${T}__${JSON.stringify(m)}`)
  let $ = i.get(T)
  return ($ || (($ = new Intl.DateTimeFormat(b, It({}, O, m))), i.set(T, $)), E ? $.formatToParts(c) : $.format(c))
}
const vh = [
  'localeMatcher',
  'weekday',
  'era',
  'year',
  'month',
  'day',
  'hour',
  'minute',
  'second',
  'timeZoneName',
  'formatMatcher',
  'hour12',
  'timeZone',
  'dateStyle',
  'timeStyle',
  'calendar',
  'dayPeriod',
  'numberingSystem',
  'hourCycle',
  'fractionalSecondDigits'
]
function Hi(...e) {
  const [t, n, s, r] = e,
    o = {}
  let a = {},
    i
  if (re(t)) {
    const u = t.match(/(\d{4}-\d{2}-\d{2})(T|\s)?(.*)/)
    if (!u) throw vn(cn.INVALID_ISO_DATE_ARGUMENT)
    const c = u[3]
      ? u[3].trim().startsWith('T')
        ? `${u[1].trim()}${u[3].trim()}`
        : `${u[1].trim()}T${u[3].trim()}`
      : u[1].trim()
    i = new Date(c)
    try {
      i.toISOString()
    } catch {
      throw vn(cn.INVALID_ISO_DATE_ARGUMENT)
    }
  } else if (nv(t)) {
    if (isNaN(t.getTime())) throw vn(cn.INVALID_DATE_ARGUMENT)
    i = t
  } else if (_t(t)) i = t
  else throw vn(cn.INVALID_ARGUMENT)
  return (
    re(n)
      ? (o.key = n)
      : Re(n) &&
        Object.keys(n).forEach(u => {
          vh.includes(u) ? (a[u] = n[u]) : (o[u] = n[u])
        }),
    re(s) ? (o.locale = s) : Re(s) && (a = s),
    Re(r) && (a = r),
    [o.key || '', i, o, a]
  )
}
function Wc(e, t, n) {
  const s = e
  for (const r in n) {
    const o = `${t}__${r}`
    s.__datetimeFormatters.has(o) && s.__datetimeFormatters.delete(o)
  }
}
function Hc(e, ...t) {
  const { numberFormats: n, unresolving: s, fallbackLocale: r, onWarn: o, localeFallbacker: a } = e,
    { __numberFormatters: i } = e,
    [u, c, d, m] = ji(...t),
    h = $e(d.missingWarn) ? d.missingWarn : e.missingWarn
  $e(d.fallbackWarn) ? d.fallbackWarn : e.fallbackWarn
  const E = !!d.part,
    y = zl(e, d),
    v = a(e, r, y)
  if (!re(u) || u === '') return new Intl.NumberFormat(y, m).format(c)
  let I = {},
    b,
    O = null
  const P = 'number format'
  for (let L = 0; L < v.length && ((b = v[L]), (I = n[b] || {}), (O = I[u]), !Re(O)); L++) Xl(e, u, b, h, P)
  if (!Re(O) || !re(b)) return s ? Ma : u
  let T = `${b}__${u}`
  $a(m) || (T = `${T}__${JSON.stringify(m)}`)
  let $ = i.get(T)
  return ($ || (($ = new Intl.NumberFormat(b, It({}, O, m))), i.set(T, $)), E ? $.formatToParts(c) : $.format(c))
}
const bh = [
  'localeMatcher',
  'style',
  'currency',
  'currencyDisplay',
  'currencySign',
  'useGrouping',
  'minimumIntegerDigits',
  'minimumFractionDigits',
  'maximumFractionDigits',
  'minimumSignificantDigits',
  'maximumSignificantDigits',
  'compactDisplay',
  'notation',
  'signDisplay',
  'unit',
  'unitDisplay',
  'roundingMode',
  'roundingPriority',
  'roundingIncrement',
  'trailingZeroDisplay'
]
function ji(...e) {
  const [t, n, s, r] = e,
    o = {}
  let a = {}
  if (!_t(t)) throw vn(cn.INVALID_ARGUMENT)
  const i = t
  return (
    re(n)
      ? (o.key = n)
      : Re(n) &&
        Object.keys(n).forEach(u => {
          bh.includes(u) ? (a[u] = n[u]) : (o[u] = n[u])
        }),
    re(s) ? (o.locale = s) : Re(s) && (a = s),
    Re(r) && (a = r),
    [o.key || '', i, o, a]
  )
}
function jc(e, t, n) {
  const s = e
  for (const r in n) {
    const o = `${t}__${r}`
    s.__numberFormatters.has(o) && s.__numberFormatters.delete(o)
  }
}
Fv()
/*!
 * vue-i18n v9.10.2
 * (c) 2024 kazuya kawaguchi
 * Released under the MIT License.
 */ const Rb = '9.10.2'
function Ob() {
  ;(typeof __VUE_I18N_FULL_INSTALL__ != 'boolean' && (Pn().__VUE_I18N_FULL_INSTALL__ = !0),
    typeof __VUE_I18N_LEGACY_API__ != 'boolean' && (Pn().__VUE_I18N_LEGACY_API__ = !0),
    typeof __INTLIFY_JIT_COMPILATION__ != 'boolean' && (Pn().__INTLIFY_JIT_COMPILATION__ = !1),
    typeof __INTLIFY_DROP_MESSAGE_COMPILER__ != 'boolean' && (Pn().__INTLIFY_DROP_MESSAGE_COMPILER__ = !1),
    typeof __INTLIFY_PROD_DEVTOOLS__ != 'boolean' && (Pn().__INTLIFY_PROD_DEVTOOLS__ = !1))
}
const Sh = rb.__EXTEND_POINT__,
  Nn = Kl(Sh)
;(Nn(), Nn(), Nn(), Nn(), Nn(), Nn(), Nn(), Nn(), Nn())
const Rh = cn.__EXTEND_POINT__,
  Vt = Kl(Rh),
  yt = {
    UNEXPECTED_RETURN_TYPE: Rh,
    INVALID_ARGUMENT: Vt(),
    MUST_BE_CALL_SETUP_TOP: Vt(),
    NOT_INSTALLED: Vt(),
    NOT_AVAILABLE_IN_LEGACY_MODE: Vt(),
    REQUIRED_VALUE: Vt(),
    INVALID_VALUE: Vt(),
    CANNOT_SETUP_VUE_DEVTOOLS_PLUGIN: Vt(),
    NOT_INSTALLED_WITH_PROVIDE: Vt(),
    UNEXPECTED_ERROR: Vt(),
    NOT_COMPATIBLE_LEGACY_VUE_I18N: Vt(),
    BRIDGE_SUPPORT_VUE_2_ONLY: Vt(),
    MUST_DEFINE_I18N_OPTION_IN_ALLOW_COMPOSITION: Vt(),
    NOT_AVAILABLE_COMPOSITION_IN_LEGACY: Vt(),
    __EXTEND_POINT__: Vt()
  }
function Rt(e, ...t) {
  return hr(e, null, void 0)
}
const Yi = cs('__translateVNode'),
  Ki = cs('__datetimeParts'),
  qi = cs('__numberParts'),
  Oh = cs('__setPluralRules'),
  Ch = cs('__injectWithOption'),
  zi = cs('__dispose')
function zr(e) {
  if (!Je(e)) return e
  for (const t in e)
    if (ea(e, t))
      if (!t.includes('.')) Je(e[t]) && zr(e[t])
      else {
        const n = t.split('.'),
          s = n.length - 1
        let r = e,
          o = !1
        for (let a = 0; a < s; a++) {
          if ((n[a] in r || (r[n[a]] = {}), !Je(r[n[a]]))) {
            o = !0
            break
          }
          r = r[n[a]]
        }
        ;(o || ((r[n[s]] = e[t]), delete e[t]), Je(r[n[s]]) && zr(r[n[s]]))
      }
  return e
}
function ka(e, t) {
  const { messages: n, __i18n: s, messageResolver: r, flatJson: o } = t,
    a = Re(n) ? n : at(s) ? {} : { [e]: {} }
  if (
    (at(s) &&
      s.forEach(i => {
        if ('locale' in i && 'resource' in i) {
          const { locale: u, resource: c } = i
          u ? ((a[u] = a[u] || {}), Vo(c, a[u])) : Vo(c, a)
        } else re(i) && Vo(JSON.parse(i), a)
      }),
    r == null && o)
  )
    for (const i in a) ea(a, i) && zr(a[i])
  return a
}
function Ah(e) {
  return e.type
}
function Ih(e, t, n) {
  let s = Je(t.messages) ? t.messages : {}
  '__i18nGlobal' in n && (s = ka(e.locale.value, { messages: s, __i18n: n.__i18nGlobal }))
  const r = Object.keys(s)
  r.length &&
    r.forEach(o => {
      e.mergeLocaleMessage(o, s[o])
    })
  {
    if (Je(t.datetimeFormats)) {
      const o = Object.keys(t.datetimeFormats)
      o.length &&
        o.forEach(a => {
          e.mergeDateTimeFormat(a, t.datetimeFormats[a])
        })
    }
    if (Je(t.numberFormats)) {
      const o = Object.keys(t.numberFormats)
      o.length &&
        o.forEach(a => {
          e.mergeNumberFormat(a, t.numberFormats[a])
        })
    }
  }
}
function Yc(e) {
  return l(fr, null, e, 0)
}
const Kc = '__INTLIFY_META__',
  qc = () => [],
  Cb = () => !1
let zc = 0
function Xc(e) {
  return (t, n, s, r) => e(n, s, os() || void 0, r)
}
const Ab = () => {
  const e = os()
  let t = null
  return e && (t = Ah(e)[Kc]) ? { [Kc]: t } : null
}
function Jl(e = {}, t) {
  const { __root: n, __injectWithOption: s } = e,
    r = n === void 0,
    o = e.flatJson,
    a = Zo ? _e : je,
    i = !!e.translateExistCompatible
  let u = $e(e.inheritLocale) ? e.inheritLocale : !0
  const c = a(n && u ? n.locale.value : re(e.locale) ? e.locale : tr),
    d = a(
      n && u
        ? n.fallbackLocale.value
        : re(e.fallbackLocale) || at(e.fallbackLocale) || Re(e.fallbackLocale) || e.fallbackLocale === !1
          ? e.fallbackLocale
          : c.value
    ),
    m = a(ka(c.value, e)),
    h = a(Re(e.datetimeFormats) ? e.datetimeFormats : { [c.value]: {} }),
    E = a(Re(e.numberFormats) ? e.numberFormats : { [c.value]: {} })
  let y = n ? n.missingWarn : $e(e.missingWarn) || as(e.missingWarn) ? e.missingWarn : !0,
    v = n ? n.fallbackWarn : $e(e.fallbackWarn) || as(e.fallbackWarn) ? e.fallbackWarn : !0,
    I = n ? n.fallbackRoot : $e(e.fallbackRoot) ? e.fallbackRoot : !0,
    b = !!e.fallbackFormat,
    O = st(e.missing) ? e.missing : null,
    P = st(e.missing) ? Xc(e.missing) : null,
    T = st(e.postTranslation) ? e.postTranslation : null,
    $ = n ? n.warnHtmlMessage : $e(e.warnHtmlMessage) ? e.warnHtmlMessage : !0,
    L = !!e.escapeParameter
  const N = n ? n.modifiers : Re(e.modifiers) ? e.modifiers : {}
  let A = e.pluralRules || (n && n.pluralRules),
    w
  ;((w = (() => {
    r && Fc(null)
    const x = {
      version: Rb,
      locale: c.value,
      fallbackLocale: d.value,
      messages: m.value,
      modifiers: N,
      pluralRules: A,
      missing: P === null ? void 0 : P,
      missingWarn: y,
      fallbackWarn: v,
      fallbackFormat: b,
      unresolving: !0,
      postTranslation: T === null ? void 0 : T,
      warnHtmlMessage: $,
      escapeParameter: L,
      messageResolver: e.messageResolver,
      messageCompiler: e.messageCompiler,
      __meta: { framework: 'vue' }
    }
    ;((x.datetimeFormats = h.value),
      (x.numberFormats = E.value),
      (x.__datetimeFormatters = Re(w) ? w.__datetimeFormatters : void 0),
      (x.__numberFormatters = Re(w) ? w.__numberFormatters : void 0))
    const W = gb(x)
    return (r && Fc(W), W)
  })()),
    Sr(w, c.value, d.value))
  function j() {
    return [c.value, d.value, m.value, h.value, E.value]
  }
  const D = M({
      get: () => c.value,
      set: x => {
        ;((c.value = x), (w.locale = c.value))
      }
    }),
    U = M({
      get: () => d.value,
      set: x => {
        ;((d.value = x), (w.fallbackLocale = d.value), Sr(w, c.value, x))
      }
    }),
    X = M(() => m.value),
    ge = M(() => h.value),
    te = M(() => E.value)
  function fe() {
    return st(T) ? T : null
  }
  function ce(x) {
    ;((T = x), (w.postTranslation = x))
  }
  function ke() {
    return O
  }
  function ze(x) {
    ;(x !== null && (P = Xc(x)), (O = x), (w.missing = P))
  }
  const Ie = (x, W, me, Se, tt, wt) => {
    j()
    let Yt
    try {
      ;(__INTLIFY_PROD_DEVTOOLS__, r || (w.fallbackContext = n ? hb() : void 0), (Yt = x(w)))
    } finally {
      ;(__INTLIFY_PROD_DEVTOOLS__, r || (w.fallbackContext = void 0))
    }
    if ((me !== 'translate exists' && _t(Yt) && Yt === Ma) || (me === 'translate exists' && !Yt)) {
      const [Eo, Ds] = W()
      return n && I ? Se(n) : tt(Eo)
    } else {
      if (wt(Yt)) return Yt
      throw Rt(yt.UNEXPECTED_RETURN_TYPE)
    }
  }
  function xe(...x) {
    return Ie(
      W => Reflect.apply(Uc, null, [W, ...x]),
      () => Wi(...x),
      'translate',
      W => Reflect.apply(W.t, W, [...x]),
      W => W,
      W => re(W)
    )
  }
  function Le(...x) {
    const [W, me, Se] = x
    if (Se && !Je(Se)) throw Rt(yt.INVALID_ARGUMENT)
    return xe(W, me, It({ resolvedMessage: !0 }, Se || {}))
  }
  function et(...x) {
    return Ie(
      W => Reflect.apply(Gc, null, [W, ...x]),
      () => Hi(...x),
      'datetime format',
      W => Reflect.apply(W.d, W, [...x]),
      () => Mc,
      W => re(W)
    )
  }
  function bt(...x) {
    return Ie(
      W => Reflect.apply(Hc, null, [W, ...x]),
      () => ji(...x),
      'number format',
      W => Reflect.apply(W.n, W, [...x]),
      () => Mc,
      W => re(W)
    )
  }
  function Fe(x) {
    return x.map(W => (re(W) || _t(W) || $e(W) ? Yc(String(W)) : W))
  }
  const ne = { normalize: Fe, interpolate: x => x, type: 'vnode' }
  function Q(...x) {
    return Ie(
      W => {
        let me
        const Se = W
        try {
          ;((Se.processor = ne), (me = Reflect.apply(Uc, null, [Se, ...x])))
        } finally {
          Se.processor = null
        }
        return me
      },
      () => Wi(...x),
      'translate',
      W => W[Yi](...x),
      W => [Yc(W)],
      W => at(W)
    )
  }
  function le(...x) {
    return Ie(
      W => Reflect.apply(Hc, null, [W, ...x]),
      () => ji(...x),
      'number format',
      W => W[qi](...x),
      qc,
      W => re(W) || at(W)
    )
  }
  function Pe(...x) {
    return Ie(
      W => Reflect.apply(Gc, null, [W, ...x]),
      () => Hi(...x),
      'datetime format',
      W => W[Ki](...x),
      qc,
      W => re(W) || at(W)
    )
  }
  function Xe(x) {
    ;((A = x), (w.pluralRules = A))
  }
  function p(x, W) {
    return Ie(
      () => {
        if (!x) return !1
        const me = re(W) ? W : c.value,
          Se = k(me),
          tt = w.messageResolver(Se, x)
        return i ? tt != null : nr(tt) || en(tt) || re(tt)
      },
      () => [x],
      'translate exists',
      me => Reflect.apply(me.te, me, [x, W]),
      Cb,
      me => $e(me)
    )
  }
  function g(x) {
    let W = null
    const me = ch(w, d.value, c.value)
    for (let Se = 0; Se < me.length; Se++) {
      const tt = m.value[me[Se]] || {},
        wt = w.messageResolver(tt, x)
      if (wt != null) {
        W = wt
        break
      }
    }
    return W
  }
  function R(x) {
    const W = g(x)
    return W ?? (n ? n.tm(x) || {} : {})
  }
  function k(x) {
    return m.value[x] || {}
  }
  function V(x, W) {
    if (o) {
      const me = { [x]: W }
      for (const Se in me) ea(me, Se) && zr(me[Se])
      W = me[x]
    }
    ;((m.value[x] = W), (w.messages = m.value))
  }
  function Y(x, W) {
    m.value[x] = m.value[x] || {}
    const me = { [x]: W }
    if (o) for (const Se in me) ea(me, Se) && zr(me[Se])
    ;((W = me[x]), Vo(W, m.value[x]), (w.messages = m.value))
  }
  function J(x) {
    return h.value[x] || {}
  }
  function z(x, W) {
    ;((h.value[x] = W), (w.datetimeFormats = h.value), Wc(w, x, W))
  }
  function Z(x, W) {
    ;((h.value[x] = It(h.value[x] || {}, W)), (w.datetimeFormats = h.value), Wc(w, x, W))
  }
  function q(x) {
    return E.value[x] || {}
  }
  function oe(x, W) {
    ;((E.value[x] = W), (w.numberFormats = E.value), jc(w, x, W))
  }
  function pe(x, W) {
    ;((E.value[x] = It(E.value[x] || {}, W)), (w.numberFormats = E.value), jc(w, x, W))
  }
  ;(zc++,
    n &&
      Zo &&
      (be(n.locale, x => {
        u && ((c.value = x), (w.locale = x), Sr(w, c.value, d.value))
      }),
      be(n.fallbackLocale, x => {
        u && ((d.value = x), (w.fallbackLocale = x), Sr(w, c.value, d.value))
      })))
  const se = {
    id: zc,
    locale: D,
    fallbackLocale: U,
    get inheritLocale() {
      return u
    },
    set inheritLocale(x) {
      ;((u = x), x && n && ((c.value = n.locale.value), (d.value = n.fallbackLocale.value), Sr(w, c.value, d.value)))
    },
    get availableLocales() {
      return Object.keys(m.value).sort()
    },
    messages: X,
    get modifiers() {
      return N
    },
    get pluralRules() {
      return A || {}
    },
    get isGlobal() {
      return r
    },
    get missingWarn() {
      return y
    },
    set missingWarn(x) {
      ;((y = x), (w.missingWarn = y))
    },
    get fallbackWarn() {
      return v
    },
    set fallbackWarn(x) {
      ;((v = x), (w.fallbackWarn = v))
    },
    get fallbackRoot() {
      return I
    },
    set fallbackRoot(x) {
      I = x
    },
    get fallbackFormat() {
      return b
    },
    set fallbackFormat(x) {
      ;((b = x), (w.fallbackFormat = b))
    },
    get warnHtmlMessage() {
      return $
    },
    set warnHtmlMessage(x) {
      ;(($ = x), (w.warnHtmlMessage = x))
    },
    get escapeParameter() {
      return L
    },
    set escapeParameter(x) {
      ;((L = x), (w.escapeParameter = x))
    },
    t: xe,
    getLocaleMessage: k,
    setLocaleMessage: V,
    mergeLocaleMessage: Y,
    getPostTranslationHandler: fe,
    setPostTranslationHandler: ce,
    getMissingHandler: ke,
    setMissingHandler: ze,
    [Oh]: Xe
  }
  return (
    (se.datetimeFormats = ge),
    (se.numberFormats = te),
    (se.rt = Le),
    (se.te = p),
    (se.tm = R),
    (se.d = et),
    (se.n = bt),
    (se.getDateTimeFormat = J),
    (se.setDateTimeFormat = z),
    (se.mergeDateTimeFormat = Z),
    (se.getNumberFormat = q),
    (se.setNumberFormat = oe),
    (se.mergeNumberFormat = pe),
    (se[Ch] = s),
    (se[Yi] = Q),
    (se[Ki] = Pe),
    (se[qi] = le),
    se
  )
}
function Ib(e) {
  const t = re(e.locale) ? e.locale : tr,
    n =
      re(e.fallbackLocale) || at(e.fallbackLocale) || Re(e.fallbackLocale) || e.fallbackLocale === !1
        ? e.fallbackLocale
        : t,
    s = st(e.missing) ? e.missing : void 0,
    r = $e(e.silentTranslationWarn) || as(e.silentTranslationWarn) ? !e.silentTranslationWarn : !0,
    o = $e(e.silentFallbackWarn) || as(e.silentFallbackWarn) ? !e.silentFallbackWarn : !0,
    a = $e(e.fallbackRoot) ? e.fallbackRoot : !0,
    i = !!e.formatFallbackMessages,
    u = Re(e.modifiers) ? e.modifiers : {},
    c = e.pluralizationRules,
    d = st(e.postTranslation) ? e.postTranslation : void 0,
    m = re(e.warnHtmlInMessage) ? e.warnHtmlInMessage !== 'off' : !0,
    h = !!e.escapeParameterHtml,
    E = $e(e.sync) ? e.sync : !0
  let y = e.messages
  if (Re(e.sharedMessages)) {
    const L = e.sharedMessages
    y = Object.keys(L).reduce((A, w) => {
      const B = A[w] || (A[w] = {})
      return (It(B, L[w]), A)
    }, y || {})
  }
  const { __i18n: v, __root: I, __injectWithOption: b } = e,
    O = e.datetimeFormats,
    P = e.numberFormats,
    T = e.flatJson,
    $ = e.translateExistCompatible
  return {
    locale: t,
    fallbackLocale: n,
    messages: y,
    flatJson: T,
    datetimeFormats: O,
    numberFormats: P,
    missing: s,
    missingWarn: r,
    fallbackWarn: o,
    fallbackRoot: a,
    fallbackFormat: i,
    modifiers: u,
    pluralRules: c,
    postTranslation: d,
    warnHtmlMessage: m,
    escapeParameter: h,
    messageResolver: e.messageResolver,
    inheritLocale: E,
    translateExistCompatible: $,
    __i18n: v,
    __root: I,
    __injectWithOption: b
  }
}
function Xi(e = {}, t) {
  {
    const n = Jl(Ib(e)),
      { __extender: s } = e,
      r = {
        id: n.id,
        get locale() {
          return n.locale.value
        },
        set locale(o) {
          n.locale.value = o
        },
        get fallbackLocale() {
          return n.fallbackLocale.value
        },
        set fallbackLocale(o) {
          n.fallbackLocale.value = o
        },
        get messages() {
          return n.messages.value
        },
        get datetimeFormats() {
          return n.datetimeFormats.value
        },
        get numberFormats() {
          return n.numberFormats.value
        },
        get availableLocales() {
          return n.availableLocales
        },
        get formatter() {
          return {
            interpolate() {
              return []
            }
          }
        },
        set formatter(o) {},
        get missing() {
          return n.getMissingHandler()
        },
        set missing(o) {
          n.setMissingHandler(o)
        },
        get silentTranslationWarn() {
          return $e(n.missingWarn) ? !n.missingWarn : n.missingWarn
        },
        set silentTranslationWarn(o) {
          n.missingWarn = $e(o) ? !o : o
        },
        get silentFallbackWarn() {
          return $e(n.fallbackWarn) ? !n.fallbackWarn : n.fallbackWarn
        },
        set silentFallbackWarn(o) {
          n.fallbackWarn = $e(o) ? !o : o
        },
        get modifiers() {
          return n.modifiers
        },
        get formatFallbackMessages() {
          return n.fallbackFormat
        },
        set formatFallbackMessages(o) {
          n.fallbackFormat = o
        },
        get postTranslation() {
          return n.getPostTranslationHandler()
        },
        set postTranslation(o) {
          n.setPostTranslationHandler(o)
        },
        get sync() {
          return n.inheritLocale
        },
        set sync(o) {
          n.inheritLocale = o
        },
        get warnHtmlInMessage() {
          return n.warnHtmlMessage ? 'warn' : 'off'
        },
        set warnHtmlInMessage(o) {
          n.warnHtmlMessage = o !== 'off'
        },
        get escapeParameterHtml() {
          return n.escapeParameter
        },
        set escapeParameterHtml(o) {
          n.escapeParameter = o
        },
        get preserveDirectiveContent() {
          return !0
        },
        set preserveDirectiveContent(o) {},
        get pluralizationRules() {
          return n.pluralRules || {}
        },
        __composer: n,
        t(...o) {
          const [a, i, u] = o,
            c = {}
          let d = null,
            m = null
          if (!re(a)) throw Rt(yt.INVALID_ARGUMENT)
          const h = a
          return (
            re(i) ? (c.locale = i) : at(i) ? (d = i) : Re(i) && (m = i),
            at(u) ? (d = u) : Re(u) && (m = u),
            Reflect.apply(n.t, n, [h, d || m || {}, c])
          )
        },
        rt(...o) {
          return Reflect.apply(n.rt, n, [...o])
        },
        tc(...o) {
          const [a, i, u] = o,
            c = { plural: 1 }
          let d = null,
            m = null
          if (!re(a)) throw Rt(yt.INVALID_ARGUMENT)
          const h = a
          return (
            re(i) ? (c.locale = i) : _t(i) ? (c.plural = i) : at(i) ? (d = i) : Re(i) && (m = i),
            re(u) ? (c.locale = u) : at(u) ? (d = u) : Re(u) && (m = u),
            Reflect.apply(n.t, n, [h, d || m || {}, c])
          )
        },
        te(o, a) {
          return n.te(o, a)
        },
        tm(o) {
          return n.tm(o)
        },
        getLocaleMessage(o) {
          return n.getLocaleMessage(o)
        },
        setLocaleMessage(o, a) {
          n.setLocaleMessage(o, a)
        },
        mergeLocaleMessage(o, a) {
          n.mergeLocaleMessage(o, a)
        },
        d(...o) {
          return Reflect.apply(n.d, n, [...o])
        },
        getDateTimeFormat(o) {
          return n.getDateTimeFormat(o)
        },
        setDateTimeFormat(o, a) {
          n.setDateTimeFormat(o, a)
        },
        mergeDateTimeFormat(o, a) {
          n.mergeDateTimeFormat(o, a)
        },
        n(...o) {
          return Reflect.apply(n.n, n, [...o])
        },
        getNumberFormat(o) {
          return n.getNumberFormat(o)
        },
        setNumberFormat(o, a) {
          n.setNumberFormat(o, a)
        },
        mergeNumberFormat(o, a) {
          n.mergeNumberFormat(o, a)
        },
        getChoiceIndex(o, a) {
          return -1
        }
      }
    return ((r.__extender = s), r)
  }
}
const Ql = {
  tag: { type: [String, Object] },
  locale: { type: String },
  scope: { type: String, validator: e => e === 'parent' || e === 'global', default: 'parent' },
  i18n: { type: Object }
}
function Tb({ slots: e }, t) {
  return t.length === 1 && t[0] === 'default'
    ? (e.default ? e.default() : []).reduce((s, r) => [...s, ...(r.type === Ue ? r.children : [r])], [])
    : t.reduce((n, s) => {
        const r = e[s]
        return (r && (n[s] = r()), n)
      }, {})
}
function Th(e) {
  return Ue
}
const Nb = Ee({
    name: 'i18n-t',
    props: It(
      {
        keypath: { type: String, required: !0 },
        plural: { type: [Number, String], validator: e => _t(e) || !isNaN(e) }
      },
      Ql
    ),
    setup(e, t) {
      const { slots: n, attrs: s } = t,
        r = e.i18n || Da({ useScope: e.scope, __useComponent: !0 })
      return () => {
        const o = Object.keys(n).filter(m => m !== '_'),
          a = {}
        ;(e.locale && (a.locale = e.locale), e.plural !== void 0 && (a.plural = re(e.plural) ? +e.plural : e.plural))
        const i = Tb(t, o),
          u = r[Yi](e.keypath, i, a),
          c = It({}, s),
          d = re(e.tag) || Je(e.tag) ? e.tag : Th()
        return Rn(d, c, u)
      }
    }
  }),
  Jc = Nb
function wb(e) {
  return at(e) && !re(e[0])
}
function Nh(e, t, n, s) {
  const { slots: r, attrs: o } = t
  return () => {
    const a = { part: !0 }
    let i = {}
    ;(e.locale && (a.locale = e.locale),
      re(e.format)
        ? (a.key = e.format)
        : Je(e.format) &&
          (re(e.format.key) && (a.key = e.format.key),
          (i = Object.keys(e.format).reduce((h, E) => (n.includes(E) ? It({}, h, { [E]: e.format[E] }) : h), {}))))
    const u = s(e.value, a, i)
    let c = [a.key]
    at(u)
      ? (c = u.map((h, E) => {
          const y = r[h.type],
            v = y ? y({ [h.type]: h.value, index: E, parts: u }) : [h.value]
          return (wb(v) && (v[0].key = `${h.type}-${E}`), v)
        }))
      : re(u) && (c = [u])
    const d = It({}, o),
      m = re(e.tag) || Je(e.tag) ? e.tag : Th()
    return Rn(m, d, c)
  }
}
const Lb = Ee({
    name: 'i18n-n',
    props: It({ value: { type: Number, required: !0 }, format: { type: [String, Object] } }, Ql),
    setup(e, t) {
      const n = e.i18n || Da({ useScope: 'parent', __useComponent: !0 })
      return Nh(e, t, bh, (...s) => n[qi](...s))
    }
  }),
  Qc = Lb,
  Pb = Ee({
    name: 'i18n-d',
    props: It({ value: { type: [Number, Date], required: !0 }, format: { type: [String, Object] } }, Ql),
    setup(e, t) {
      const n = e.i18n || Da({ useScope: 'parent', __useComponent: !0 })
      return Nh(e, t, vh, (...s) => n[Ki](...s))
    }
  }),
  Zc = Pb
function $b(e, t) {
  const n = e
  if (e.mode === 'composition') return n.__getInstance(t) || e.global
  {
    const s = n.__getInstance(t)
    return s != null ? s.__composer : e.global.__composer
  }
}
function Mb(e) {
  const t = a => {
    const { instance: i, modifiers: u, value: c } = a
    if (!i || !i.$) throw Rt(yt.UNEXPECTED_ERROR)
    const d = $b(e, i.$),
      m = ed(c)
    return [Reflect.apply(d.t, d, [...td(m)]), d]
  }
  return {
    created: (a, i) => {
      const [u, c] = t(i)
      ;(Zo &&
        e.global === c &&
        (a.__i18nWatcher = be(c.locale, () => {
          i.instance && i.instance.$forceUpdate()
        })),
        (a.__composer = c),
        (a.textContent = u))
    },
    unmounted: a => {
      ;(Zo && a.__i18nWatcher && (a.__i18nWatcher(), (a.__i18nWatcher = void 0), delete a.__i18nWatcher),
        a.__composer && ((a.__composer = void 0), delete a.__composer))
    },
    beforeUpdate: (a, { value: i }) => {
      if (a.__composer) {
        const u = a.__composer,
          c = ed(i)
        a.textContent = Reflect.apply(u.t, u, [...td(c)])
      }
    },
    getSSRProps: a => {
      const [i] = t(a)
      return { textContent: i }
    }
  }
}
function ed(e) {
  if (re(e)) return { path: e }
  if (Re(e)) {
    if (!('path' in e)) throw Rt(yt.REQUIRED_VALUE, 'path')
    return e
  } else throw Rt(yt.INVALID_VALUE)
}
function td(e) {
  const { path: t, locale: n, args: s, choice: r, plural: o } = e,
    a = {},
    i = s || {}
  return (re(n) && (a.locale = n), _t(r) && (a.plural = r), _t(o) && (a.plural = o), [t, i, a])
}
function kb(e, t, ...n) {
  const s = Re(n[0]) ? n[0] : {},
    r = !!s.useI18nComponentName
  ;(($e(s.globalInstall) ? s.globalInstall : !0) &&
    ([r ? 'i18n' : Jc.name, 'I18nT'].forEach(a => e.component(a, Jc)),
    [Qc.name, 'I18nN'].forEach(a => e.component(a, Qc)),
    [Zc.name, 'I18nD'].forEach(a => e.component(a, Zc))),
    e.directive('t', Mb(t)))
}
function Db(e, t, n) {
  return {
    beforeCreate() {
      const s = os()
      if (!s) throw Rt(yt.UNEXPECTED_ERROR)
      const r = this.$options
      if (r.i18n) {
        const o = r.i18n
        if ((r.__i18n && (o.__i18n = r.__i18n), (o.__root = t), this === this.$root)) this.$i18n = nd(e, o)
        else {
          ;((o.__injectWithOption = !0), (o.__extender = n.__vueI18nExtend), (this.$i18n = Xi(o)))
          const a = this.$i18n
          a.__extender && (a.__disposer = a.__extender(this.$i18n))
        }
      } else if (r.__i18n)
        if (this === this.$root) this.$i18n = nd(e, r)
        else {
          this.$i18n = Xi({ __i18n: r.__i18n, __injectWithOption: !0, __extender: n.__vueI18nExtend, __root: t })
          const o = this.$i18n
          o.__extender && (o.__disposer = o.__extender(this.$i18n))
        }
      else this.$i18n = e
      ;(r.__i18nGlobal && Ih(t, r, r),
        (this.$t = (...o) => this.$i18n.t(...o)),
        (this.$rt = (...o) => this.$i18n.rt(...o)),
        (this.$tc = (...o) => this.$i18n.tc(...o)),
        (this.$te = (o, a) => this.$i18n.te(o, a)),
        (this.$d = (...o) => this.$i18n.d(...o)),
        (this.$n = (...o) => this.$i18n.n(...o)),
        (this.$tm = o => this.$i18n.tm(o)),
        n.__setInstance(s, this.$i18n))
    },
    mounted() {},
    unmounted() {
      const s = os()
      if (!s) throw Rt(yt.UNEXPECTED_ERROR)
      const r = this.$i18n
      ;(delete this.$t,
        delete this.$rt,
        delete this.$tc,
        delete this.$te,
        delete this.$d,
        delete this.$n,
        delete this.$tm,
        r.__disposer && (r.__disposer(), delete r.__disposer, delete r.__extender),
        n.__deleteInstance(s),
        delete this.$i18n)
    }
  }
}
function nd(e, t) {
  ;((e.locale = t.locale || e.locale),
    (e.fallbackLocale = t.fallbackLocale || e.fallbackLocale),
    (e.missing = t.missing || e.missing),
    (e.silentTranslationWarn = t.silentTranslationWarn || e.silentFallbackWarn),
    (e.silentFallbackWarn = t.silentFallbackWarn || e.silentFallbackWarn),
    (e.formatFallbackMessages = t.formatFallbackMessages || e.formatFallbackMessages),
    (e.postTranslation = t.postTranslation || e.postTranslation),
    (e.warnHtmlInMessage = t.warnHtmlInMessage || e.warnHtmlInMessage),
    (e.escapeParameterHtml = t.escapeParameterHtml || e.escapeParameterHtml),
    (e.sync = t.sync || e.sync),
    e.__composer[Oh](t.pluralizationRules || e.pluralizationRules))
  const n = ka(e.locale, { messages: t.messages, __i18n: t.__i18n })
  return (
    Object.keys(n).forEach(s => e.mergeLocaleMessage(s, n[s])),
    t.datetimeFormats && Object.keys(t.datetimeFormats).forEach(s => e.mergeDateTimeFormat(s, t.datetimeFormats[s])),
    t.numberFormats && Object.keys(t.numberFormats).forEach(s => e.mergeNumberFormat(s, t.numberFormats[s])),
    e
  )
}
const Fb = cs('global-vue-i18n')
function Vb(e = {}, t) {
  const n = __VUE_I18N_LEGACY_API__ && $e(e.legacy) ? e.legacy : __VUE_I18N_LEGACY_API__,
    s = $e(e.globalInjection) ? e.globalInjection : !0,
    r = __VUE_I18N_LEGACY_API__ && n ? !!e.allowComposition : !0,
    o = new Map(),
    [a, i] = xb(e, n),
    u = cs('')
  function c(h) {
    return o.get(h) || null
  }
  function d(h, E) {
    o.set(h, E)
  }
  function m(h) {
    o.delete(h)
  }
  {
    const h = {
      get mode() {
        return __VUE_I18N_LEGACY_API__ && n ? 'legacy' : 'composition'
      },
      get allowComposition() {
        return r
      },
      async install(E, ...y) {
        if (((E.__VUE_I18N_SYMBOL__ = u), E.provide(E.__VUE_I18N_SYMBOL__, h), Re(y[0]))) {
          const b = y[0]
          ;((h.__composerExtend = b.__composerExtend), (h.__vueI18nExtend = b.__vueI18nExtend))
        }
        let v = null
        ;(!n && s && (v = qb(E, h.global)),
          __VUE_I18N_FULL_INSTALL__ && kb(E, h, ...y),
          __VUE_I18N_LEGACY_API__ && n && E.mixin(Db(i, i.__composer, h)))
        const I = E.unmount
        E.unmount = () => {
          ;(v && v(), h.dispose(), I())
        }
      },
      get global() {
        return i
      },
      dispose() {
        a.stop()
      },
      __instances: o,
      __getInstance: c,
      __setInstance: d,
      __deleteInstance: m
    }
    return h
  }
}
function Da(e = {}) {
  const t = os()
  if (t == null) throw Rt(yt.MUST_BE_CALL_SETUP_TOP)
  if (!t.isCE && t.appContext.app != null && !t.appContext.app.__VUE_I18N_SYMBOL__) throw Rt(yt.NOT_INSTALLED)
  const n = Bb(t),
    s = Gb(n),
    r = Ah(t),
    o = Ub(e, r)
  if (__VUE_I18N_LEGACY_API__ && n.mode === 'legacy' && !e.__useComponent) {
    if (!n.allowComposition) throw Rt(yt.NOT_AVAILABLE_IN_LEGACY_MODE)
    return Yb(t, o, s, e)
  }
  if (o === 'global') return (Ih(s, e, r), s)
  if (o === 'parent') {
    let u = Wb(n, t, e.__useComponent)
    return (u == null && (u = s), u)
  }
  const a = n
  let i = a.__getInstance(t)
  if (i == null) {
    const u = It({}, e)
    ;('__i18n' in r && (u.__i18n = r.__i18n),
      s && (u.__root = s),
      (i = Jl(u)),
      a.__composerExtend && (i[zi] = a.__composerExtend(i)),
      jb(a, t, i),
      a.__setInstance(t, i))
  }
  return i
}
function xb(e, t, n) {
  const s = cr()
  {
    const r = __VUE_I18N_LEGACY_API__ && t ? s.run(() => Xi(e)) : s.run(() => Jl(e))
    if (r == null) throw Rt(yt.UNEXPECTED_ERROR)
    return [s, r]
  }
}
function Bb(e) {
  {
    const t = it(e.isCE ? Fb : e.appContext.app.__VUE_I18N_SYMBOL__)
    if (!t) throw Rt(e.isCE ? yt.NOT_INSTALLED_WITH_PROVIDE : yt.UNEXPECTED_ERROR)
    return t
  }
}
function Ub(e, t) {
  return $a(e) ? ('__i18n' in t ? 'local' : 'global') : e.useScope ? e.useScope : 'local'
}
function Gb(e) {
  return e.mode === 'composition' ? e.global : e.global.__composer
}
function Wb(e, t, n = !1) {
  let s = null
  const r = t.root
  let o = Hb(t, n)
  for (; o != null; ) {
    const a = e
    if (e.mode === 'composition') s = a.__getInstance(o)
    else if (__VUE_I18N_LEGACY_API__) {
      const i = a.__getInstance(o)
      i != null && ((s = i.__composer), n && s && !s[Ch] && (s = null))
    }
    if (s != null || r === o) break
    o = o.parent
  }
  return s
}
function Hb(e, t = !1) {
  return e == null ? null : (t && e.vnode.ctx) || e.parent
}
function jb(e, t, n) {
  ;(xn(() => {}, t),
    Dl(() => {
      const s = n
      e.__deleteInstance(t)
      const r = s[zi]
      r && (r(), delete s[zi])
    }, t))
}
function Yb(e, t, n, s = {}) {
  const r = t === 'local',
    o = je(null)
  if (r && e.proxy && !(e.proxy.$options.i18n || e.proxy.$options.__i18n))
    throw Rt(yt.MUST_DEFINE_I18N_OPTION_IN_ALLOW_COMPOSITION)
  const a = $e(s.inheritLocale) ? s.inheritLocale : !re(s.locale),
    i = _e(!r || a ? n.locale.value : re(s.locale) ? s.locale : tr),
    u = _e(
      !r || a
        ? n.fallbackLocale.value
        : re(s.fallbackLocale) || at(s.fallbackLocale) || Re(s.fallbackLocale) || s.fallbackLocale === !1
          ? s.fallbackLocale
          : i.value
    ),
    c = _e(ka(i.value, s)),
    d = _e(Re(s.datetimeFormats) ? s.datetimeFormats : { [i.value]: {} }),
    m = _e(Re(s.numberFormats) ? s.numberFormats : { [i.value]: {} }),
    h = r ? n.missingWarn : $e(s.missingWarn) || as(s.missingWarn) ? s.missingWarn : !0,
    E = r ? n.fallbackWarn : $e(s.fallbackWarn) || as(s.fallbackWarn) ? s.fallbackWarn : !0,
    y = r ? n.fallbackRoot : $e(s.fallbackRoot) ? s.fallbackRoot : !0,
    v = !!s.fallbackFormat,
    I = st(s.missing) ? s.missing : null,
    b = st(s.postTranslation) ? s.postTranslation : null,
    O = r ? n.warnHtmlMessage : $e(s.warnHtmlMessage) ? s.warnHtmlMessage : !0,
    P = !!s.escapeParameter,
    T = r ? n.modifiers : Re(s.modifiers) ? s.modifiers : {},
    $ = s.pluralRules || (r && n.pluralRules)
  function L() {
    return [i.value, u.value, c.value, d.value, m.value]
  }
  const N = M({
      get: () => (o.value ? o.value.locale.value : i.value),
      set: g => {
        ;(o.value && (o.value.locale.value = g), (i.value = g))
      }
    }),
    A = M({
      get: () => (o.value ? o.value.fallbackLocale.value : u.value),
      set: g => {
        ;(o.value && (o.value.fallbackLocale.value = g), (u.value = g))
      }
    }),
    w = M(() => (o.value ? o.value.messages.value : c.value)),
    B = M(() => d.value),
    j = M(() => m.value)
  function D() {
    return o.value ? o.value.getPostTranslationHandler() : b
  }
  function U(g) {
    o.value && o.value.setPostTranslationHandler(g)
  }
  function X() {
    return o.value ? o.value.getMissingHandler() : I
  }
  function ge(g) {
    o.value && o.value.setMissingHandler(g)
  }
  function te(g) {
    return (L(), g())
  }
  function fe(...g) {
    return o.value ? te(() => Reflect.apply(o.value.t, null, [...g])) : te(() => '')
  }
  function ce(...g) {
    return o.value ? Reflect.apply(o.value.rt, null, [...g]) : ''
  }
  function ke(...g) {
    return o.value ? te(() => Reflect.apply(o.value.d, null, [...g])) : te(() => '')
  }
  function ze(...g) {
    return o.value ? te(() => Reflect.apply(o.value.n, null, [...g])) : te(() => '')
  }
  function Ie(g) {
    return o.value ? o.value.tm(g) : {}
  }
  function xe(g, R) {
    return o.value ? o.value.te(g, R) : !1
  }
  function Le(g) {
    return o.value ? o.value.getLocaleMessage(g) : {}
  }
  function et(g, R) {
    o.value && (o.value.setLocaleMessage(g, R), (c.value[g] = R))
  }
  function bt(g, R) {
    o.value && o.value.mergeLocaleMessage(g, R)
  }
  function Fe(g) {
    return o.value ? o.value.getDateTimeFormat(g) : {}
  }
  function H(g, R) {
    o.value && (o.value.setDateTimeFormat(g, R), (d.value[g] = R))
  }
  function ne(g, R) {
    o.value && o.value.mergeDateTimeFormat(g, R)
  }
  function Q(g) {
    return o.value ? o.value.getNumberFormat(g) : {}
  }
  function le(g, R) {
    o.value && (o.value.setNumberFormat(g, R), (m.value[g] = R))
  }
  function Pe(g, R) {
    o.value && o.value.mergeNumberFormat(g, R)
  }
  const Xe = {
    get id() {
      return o.value ? o.value.id : -1
    },
    locale: N,
    fallbackLocale: A,
    messages: w,
    datetimeFormats: B,
    numberFormats: j,
    get inheritLocale() {
      return o.value ? o.value.inheritLocale : a
    },
    set inheritLocale(g) {
      o.value && (o.value.inheritLocale = g)
    },
    get availableLocales() {
      return o.value ? o.value.availableLocales : Object.keys(c.value)
    },
    get modifiers() {
      return o.value ? o.value.modifiers : T
    },
    get pluralRules() {
      return o.value ? o.value.pluralRules : $
    },
    get isGlobal() {
      return o.value ? o.value.isGlobal : !1
    },
    get missingWarn() {
      return o.value ? o.value.missingWarn : h
    },
    set missingWarn(g) {
      o.value && (o.value.missingWarn = g)
    },
    get fallbackWarn() {
      return o.value ? o.value.fallbackWarn : E
    },
    set fallbackWarn(g) {
      o.value && (o.value.missingWarn = g)
    },
    get fallbackRoot() {
      return o.value ? o.value.fallbackRoot : y
    },
    set fallbackRoot(g) {
      o.value && (o.value.fallbackRoot = g)
    },
    get fallbackFormat() {
      return o.value ? o.value.fallbackFormat : v
    },
    set fallbackFormat(g) {
      o.value && (o.value.fallbackFormat = g)
    },
    get warnHtmlMessage() {
      return o.value ? o.value.warnHtmlMessage : O
    },
    set warnHtmlMessage(g) {
      o.value && (o.value.warnHtmlMessage = g)
    },
    get escapeParameter() {
      return o.value ? o.value.escapeParameter : P
    },
    set escapeParameter(g) {
      o.value && (o.value.escapeParameter = g)
    },
    t: fe,
    getPostTranslationHandler: D,
    setPostTranslationHandler: U,
    getMissingHandler: X,
    setMissingHandler: ge,
    rt: ce,
    d: ke,
    n: ze,
    tm: Ie,
    te: xe,
    getLocaleMessage: Le,
    setLocaleMessage: et,
    mergeLocaleMessage: bt,
    getDateTimeFormat: Fe,
    setDateTimeFormat: H,
    mergeDateTimeFormat: ne,
    getNumberFormat: Q,
    setNumberFormat: le,
    mergeNumberFormat: Pe
  }
  function p(g) {
    ;((g.locale.value = i.value),
      (g.fallbackLocale.value = u.value),
      Object.keys(c.value).forEach(R => {
        g.mergeLocaleMessage(R, c.value[R])
      }),
      Object.keys(d.value).forEach(R => {
        g.mergeDateTimeFormat(R, d.value[R])
      }),
      Object.keys(m.value).forEach(R => {
        g.mergeNumberFormat(R, m.value[R])
      }),
      (g.escapeParameter = P),
      (g.fallbackFormat = v),
      (g.fallbackRoot = y),
      (g.fallbackWarn = E),
      (g.missingWarn = h),
      (g.warnHtmlMessage = O))
  }
  return (
    Ra(() => {
      if (e.proxy == null || e.proxy.$i18n == null) throw Rt(yt.NOT_AVAILABLE_COMPOSITION_IN_LEGACY)
      const g = (o.value = e.proxy.$i18n.__composer)
      t === 'global'
        ? ((i.value = g.locale.value),
          (u.value = g.fallbackLocale.value),
          (c.value = g.messages.value),
          (d.value = g.datetimeFormats.value),
          (m.value = g.numberFormats.value))
        : r && p(g)
    }),
    Xe
  )
}
const Kb = ['locale', 'fallbackLocale', 'availableLocales'],
  sd = ['t', 'rt', 'd', 'n', 'tm', 'te']
function qb(e, t) {
  const n = Object.create(null)
  return (
    Kb.forEach(r => {
      const o = Object.getOwnPropertyDescriptor(t, r)
      if (!o) throw Rt(yt.UNEXPECTED_ERROR)
      const a = nt(o.value)
        ? {
            get() {
              return o.value.value
            },
            set(i) {
              o.value.value = i
            }
          }
        : {
            get() {
              return o.get && o.get()
            }
          }
      Object.defineProperty(n, r, a)
    }),
    (e.config.globalProperties.$i18n = n),
    sd.forEach(r => {
      const o = Object.getOwnPropertyDescriptor(t, r)
      if (!o || !o.value) throw Rt(yt.UNEXPECTED_ERROR)
      Object.defineProperty(e.config.globalProperties, `$${r}`, o)
    }),
    () => {
      ;(delete e.config.globalProperties.$i18n,
        sd.forEach(r => {
          delete e.config.globalProperties[`$${r}`]
        }))
    }
  )
}
Ob()
__INTLIFY_JIT_COMPILATION__ ? Dc(_b) : Dc(Eb)
cb(jv)
db(ch)
if (__INTLIFY_PROD_DEVTOOLS__) {
  const e = Pn()
  ;((e.__INTLIFY__ = !0), eb(e.__INTLIFY_DEVTOOLS_GLOBAL_HOOK__))
}
const zb = Object.freeze({
    TITLE: { NAVIGATOR: 'Manage Account' },
    ACTION: {
      FILTER: 'Filter',
      SEARCH: 'Search',
      RESET: 'Reset',
      CREATE: 'Create',
      UPDATE: 'Update',
      REMOVE: 'Remove',
      RESTORE: 'Restore',
      DELETE: 'Delete',
      LOCK: 'Lock',
      UNLOCK: 'Unlock',
      SHOW: 'Show',
      HIDE: 'Hide',
      ASSIGN: 'Assign',
      SETTING: 'Setting',
      SAVE: 'Save',
      CANCEL: 'Cancel',
      CLOSE: 'Close',
      SORT: 'Sort',
      YES: 'Yes',
      NO: 'No',
      PASSWORD: 'Password',
      CREATE_NEW: 'Create New',
      PERMISSION: 'Permission',
      ACTIONS: 'Actions',
      BACK: 'Back'
    },
    LABEL: {
      ITEM: 'Item',
      ITEMS: 'Items',
      HAS_FILTER: 'Has Filter',
      SEARCH_KEYWORDS: 'Keywords',
      SEARCH_LANGUAGE: 'Language',
      SEARCH_STATUS: 'Status',
      SEARCH_TYPE: 'Type',
      OPTION_ALL: 'All',
      OPTION_NONE: 'None',
      GENDER: 'Gender',
      GENDER_MALE: 'Male',
      GENDER_FEMALE: 'Female',
      GENDER_UNKNOWN: 'Unknown'
    },
    MESSAGE: {
      NOT_FOUND: 'Not found any results.',
      EMPTY_DATA: 'There is no data.',
      ITEM_WAS_CREATED: 'The item [{item}] was created.',
      ITEM_WAS_UPDATED: 'The item [{item}] was updated.',
      ITEM_WAS_DELETED: 'The item [{item}] was deleted.',
      ITEM_WAS_ADDED: 'The item [{item}] was added.',
      ITEM_WAS_CLOSED: 'The item [{item}] was closed.',
      ITEM_WAS_REMOVED: 'The item [{item}] was removed.',
      ITEM_WAS_RESTORED: 'The item [{item}] was restored.',
      ITEM_WAS_LOCKED: 'The item [{item}] was locked.',
      ITEM_WAS_UNLOCKED: 'The item [{item}] was unlocked.',
      ITEM_WAS_DISPLAY: 'The item [{item}] was display.',
      ITEM_WAS_HIDDEN: 'The item [{item}] was hidden.',
      ITEM_WAS_ASSIGNED: 'The item [{item}] was assigned.',
      DISPLAY_ORDER_WAS_UPDATED: 'The display order was updated.'
    },
    ERROR: {
      CODE_1: 'Username is duplicated.',
      CODE_2: 'Email is duplicated.',
      CODE_3: 'Phone number is duplicated.',
      CODE_5: 'The account was closed already.',
      CODE_8: 'The item does not exist or was removed.',
      CODE_9: 'The account does not exist or was removed.'
    },
    SELECT_LANGUAGE: { TITLE: 'Select Display Language' },
    CONFIRM_CANCEL: {
      TITLE: 'Confirm Cancel The Form!',
      LABEL1: 'Are you sure want to cancel?',
      LABEL2: 'The form data will be lost when cancel.'
    },
    CONFIRM_SUBMIT: {
      TITLE: 'Confirm Submit The Form!',
      LABEL1: 'Are you sure want to submit?',
      LABEL2: 'The form data will be saved and overridden.'
    },
    INVALID_FORM_DATA: {
      TITLE: 'Invalid Form Data!',
      LABEL1: 'There is data that has not been entered correctly.',
      LABEL2: 'Please check the red boxes again and correct them.'
    },
    SUBMIT_FAILED: {
      TITLE: 'Submit Form Failed!',
      LABEL1: 'An error occurred while submitting the form.',
      LABEL2: 'Please try again, or contact your administrator for support.'
    },
    UPLOAD_FAILED: {
      TITLE: 'Upload Failed!',
      LABEL1: 'An error occurred while uploading the file.',
      LABEL2: 'Please try again, or contact your administrator for support.'
    },
    CONFIRM_HIDE: {
      TITLE: 'Confirm Hide Item!',
      LABEL1: 'Are you sure want to hide item?',
      ERROR1: 'An error occurred while hiding the item.',
      ERROR2: 'Please try again or contact the administrator for support.'
    },
    CONFIRM_LOCK: {
      TITLE: 'Confirm Lock Item!',
      LABEL1: 'Are you sure want to lock item?',
      ERROR1: 'An error occurred while locking the item.',
      ERROR2: 'Please try again or contact the administrator for support.'
    },
    CONFIRM_UNLOCK: {
      TITLE: 'Confirm Unlock Item!',
      LABEL1: 'Are you sure want to unlock item?',
      ERROR1: 'An error occurred while unlocking the item.',
      ERROR2: 'Please try again or contact the administrator for support.'
    },
    CONFIRM_REMOVE: {
      TITLE: 'Confirm Remove Item!',
      LABEL1: 'Are you sure want to remove item?',
      ERROR1: 'An error occurred while removing the item.',
      ERROR2: 'Please try again or contact the administrator for support.'
    },
    CONFIRM_CLOSE: {
      TITLE: 'Confirm Close Item!',
      LABEL1: 'Are you sure want to close item?',
      ERROR1: 'An error occurred while closing the item.',
      ERROR2: 'Please try again or contact the administrator for support.'
    },
    CONFIRM_RESTORE: {
      TITLE: 'Confirm Restore Item!',
      LABEL1: 'Are you sure want to restore item?',
      ERROR1: 'An error occurred while restoring the item.',
      ERROR2: 'Please try again or contact the administrator for support.'
    },
    CONFIRM_DELETE: {
      TITLE: 'Confirm Delete Item!',
      LABEL1: 'Are you sure want to delete item?',
      ERROR1: 'An error occurred while deleting the item.',
      ERROR2: 'Please try again or contact the administrator for support.'
    },
    CONFIRM_SHOW: {
      TITLE: 'Confirm Show Item!',
      LABEL1: 'Are you sure want to show item?',
      ERROR1: 'An error occurred while showing the item.',
      ERROR2: 'Please try again or contact the administrator for support.'
    },
    CONFIRM_ASSIGN: {
      TITLE: 'Confirm Assign Item!',
      LABEL1: 'Are you sure want to assign item?',
      ERROR1: 'An error occurred while assigning the item.',
      ERROR2: 'Please try again or contact the administrator for support.'
    },
    ERROR_COMMON: {
      HELLO_WITH_NAME: 'Hi {name}!',
      HELLO_WITHOUT_NAME: 'Hi There!',
      GREETING: 'You are accessing {copyright} system!'
    },
    ERROR_NOT_FOUND: {
      TITLE: 'Oops! Page Not Found!',
      MESSAGE: 'The page does not exist or was removed.',
      LABEL1: 'Please check your request again.',
      LABEL2: 'In case you need support, please contact Webmaster.',
      ACTION: 'Go To Home'
    },
    ERROR_SYSTEM_ERROR: {
      TITLE: 'Oops! System Error!',
      MESSAGE: 'An error occurred while processing the request.',
      LABEL1: 'Please reload the page again.',
      LABEL2: 'In case you need support, please contact Webmaster.',
      ACTION: 'Reload the page'
    },
    ERROR_CONNECT_ERROR: {
      TITLE: 'Oops! Connect Error!',
      MESSAGE: 'An error occurred during connecting process.',
      LABEL1: 'Please reload the page again.',
      LABEL2: 'In case you need support, please contact Webmaster.',
      ACTION: 'Reload the page'
    },
    ERROR_AUTHORIZE_ERROR: {
      TITLE: 'Oops! Authorize Error!',
      MESSAGE: 'An error occurred during authorization process.',
      LABEL1: 'Please reload the page again.',
      LABEL2: 'In case you need support, please contact Webmaster.',
      ACTION: 'Reload the page'
    },
    ERROR_FORBIDDEN_ERROR: {
      TITLE: 'Oops! Access Denied!',
      MESSAGE: 'You have not been granted access to this page.',
      LABEL1: 'Please ask administrator grant permission to you.',
      LABEL2: 'In case you need support, please contact Webmaster.',
      ACTION: 'Go To Home'
    },
    ERROR_SESSION_EXPIRED: {
      TITLE: 'Oops! Session Expired!',
      MESSAGE: 'Your session has been expired.',
      LABEL1: 'Please sign in again to continue using system.',
      LABEL2: 'In case you need support, please contact Webmaster.',
      ACTION: 'Sign in'
    },
    ERROR_CODE_EXPIRED: {
      TITLE: 'Oops! OTP Code Was Expired!',
      MESSAGE: 'Your OTP code was expired or was used.',
      LABEL1: 'Please request new OTP code to continue function.',
      LABEL2: 'In case you need support, please contact Webmaster.',
      ACTION: 'Go To Home'
    },
    ERROR_INVALID_REQUEST: {
      TITLE: 'Oops! Invalid Request!',
      MESSAGE: 'The request does not include required parameters.',
      LABEL1: 'Please action as the flow of the system without manual modify.',
      LABEL2: 'In case you need support, please contact Webmaster.',
      ACTION: 'Go To Home'
    },
    ERROR_DUPLICATED_INFO: {
      TITLE: 'Oops! Data Is Duplicated!',
      MESSAGE: 'The data is duplicated with other processing flow.',
      LABEL1: 'Please start action from the beginning with the new data.',
      LABEL2: 'In case you need support, please contact Webmaster.',
      ACTION: 'Go To Home'
    },
    ERROR_MUST_SIGNIN: {
      TITLE: 'Oops! Sign In!',
      MESSAGE: 'You must sign in to use system.',
      LABEL1: 'Please sign in to continue using system.',
      LABEL2: 'In case you need support, please contact Webmaster.',
      ACTION: 'Sign in'
    },
    ERROR_ACCOUNT_LOCKED: {
      TITLE: 'Oops! Account Was Locked!',
      MESSAGE: 'Your account was locked by Webmaster.',
      LABEL1: 'Please send request to unlock your account.',
      LABEL2: 'In case you need support, please contact Webmaster.',
      ACTION: 'Check Your Account'
    },
    ERROR_NOT_IMPLEMENTED: {
      TITLE: 'Oops! Coming Soon!',
      MESSAGE: 'This page was not implemented yet.',
      LABEL1: 'Please come back later.',
      LABEL2: 'In case you need support, please contact Webmaster.',
      ACTION: 'Go To Home'
    },
    ERROR_ITEM_NOT_EXIST: {
      TITLE: "Oops! Item Doesn't Exist!",
      MESSAGE: 'This item does not exist or was removed.',
      LABEL1: 'Please check the request again.',
      LABEL2: 'In case you need support, please contact Webmaster.',
      ACTION: 'Go To Home'
    },
    ERROR_SUBJECT_NOT_EXIST: {
      TITLE: "Oops! Account Doesn't Exist!",
      MESSAGE: 'This account does not exist or was removed.',
      LABEL1: 'Please check the request again.',
      LABEL2: 'In case you need support, please contact Webmaster.',
      ACTION: 'Go To Home'
    },
    ERROR_SUBJECT_WAS_CLOSED: {
      TITLE: 'Oops! Account Was Closed!',
      MESSAGE: 'This account was closed already.',
      LABEL1: 'The closed account can be restored to continue using.',
      LABEL2: 'In case you need support, please contact Webmaster.',
      ACTION: 'Go To Home'
    }
  }),
  Xb = { COMMON: zb },
  Jb = Object.freeze({
    TITLE: { NAVIGATOR: 'Quản Lý Tài Khoản' },
    ACTION: {
      FILTER: 'Bộ Lọc',
      SEARCH: 'Tìm Kiếm',
      RESET: 'Tải Lại',
      CREATE: 'Tạo Mới',
      UPDATE: 'Cập Nhật',
      REMOVE: 'Remove',
      RESTORE: 'Khôi Phục',
      DELETE: 'Xoá Bỏ',
      LOCK: 'Khoá Lại',
      UNLOCK: 'Mở Khoá',
      SHOW: 'Hiển Thị',
      HIDE: 'Tạm Ẩn',
      ASSIGN: 'Liên Kết',
      SETTING: 'Cài Đặt',
      SAVE: 'Lưu Lại',
      CANCEL: 'Huỷ Bỏ',
      CLOSE: 'Đóng Lại',
      SORT: 'Sắp Xếp',
      YES: 'Đồng Ý',
      NO: 'Không',
      PASSWORD: 'Mật Khẩu',
      CREATE_NEW: 'Tạo Mới',
      PERMISSION: 'Phân Quyền',
      ACTIONS: 'Tác Vụ',
      BACK: 'Quay Lại'
    },
    LABEL: {
      ITEM: 'hạng mục',
      ITEMS: 'hạng mục',
      HAS_FILTER: 'Có Lọc',
      SEARCH_KEYWORDS: 'Từ khoá',
      SEARCH_LANGUAGE: 'Ngôn Ngữ',
      SEARCH_STATUS: 'Trạng Thái',
      SEARCH_TYPE: 'Phân Loại',
      OPTION_ALL: 'Tất Cả',
      OPTION_NONE: 'Không Gì Cả',
      GENDER: 'Giới Tính',
      GENDER_MALE: 'Nam',
      GENDER_FEMALE: 'Nữ',
      GENDER_UNKNOWN: 'Khác'
    },
    MESSAGE: {
      NOT_FOUND: 'Không tìm thấy kết quả phù hợp.',
      EMPTY_DATA: 'Không có dữ liệu để hiện thị.',
      ITEM_WAS_CREATED: 'Đã tạo mới hạng mục [{item}].',
      ITEM_WAS_UPDATED: 'Đã cập nhập hạng mục [{item}].',
      ITEM_WAS_DELETED: 'Đã xoá bỏ hạng mục [{item}].',
      ITEM_WAS_ADDED: 'Đã thêm hạng mục [{item}].',
      ITEM_WAS_CLOSED: 'Đã đóng hạng mục [{item}].',
      ITEM_WAS_REMOVED: 'Đã loại bỏ hạng mục [{item}].',
      ITEM_WAS_RESTORED: 'Đã khôi phục hạng mục [{item}].',
      ITEM_WAS_LOCKED: 'Đã khoá hạng mục [{item}].',
      ITEM_WAS_UNLOCKED: 'Đã mở khoá hạng mục [{item}].',
      ITEM_WAS_DISPLAY: 'Đã hiển thị hạng mục [{item}].',
      ITEM_WAS_HIDDEN: 'Đã tạm ẩn hạng mục [{item}].',
      ITEM_WAS_ASSIGNED: 'Đã thêm vào hạng mục [{item}].',
      DISPLAY_ORDER_WAS_UPDATED: 'Thứ tự hiển hị đã được cập nhật.'
    },
    ERROR: {
      CODE_1: 'Tài khoản đã được sử dụng.',
      CODE_2: 'Email đã được sử dụng.',
      CODE_3: 'Số điện thoại đã được sử dụng.',
      CODE_5: 'Tài khoản đã được đóng từ trước.',
      CODE_8: 'Hạng mục không tồn tại hoặc đã bị xoá bỏ.',
      CODE_9: 'Tài khoản không tồn tại hoặc đã bị xoá bỏ.'
    },
    SELECT_LANGUAGE: { TITLE: 'Lựa Chọn Ngôn Ngữ Hiển Thị' },
    CONFIRM_CANCEL: {
      TITLE: 'Xác Nhận Huỷ Bỏ!',
      LABEL1: 'Hãy kiểm tra lại việc huỷ bỏ?',
      LABEL2: 'Các dữ liệu đã nhập không được lưu khi huỷ bỏ.'
    },
    CONFIRM_SUBMIT: {
      TITLE: 'Xác Nhật Cập Nhật Dữ Liệu!',
      LABEL1: 'Hãy kiểm tra lại việc cập nhật?',
      LABEL2: 'Đảm bảo rằng các dữ liệu đã nhập là chính xác.'
    },
    INVALID_FORM_DATA: {
      TITLE: 'Dữ Liệu Không Hợp Lệ!',
      LABEL1: 'Có trường dữ liệu được nhập không chính xác.',
      LABEL2: 'Hãy kiểm tra và điều chỉnh các hạng mục màu đỏ.'
    },
    SUBMIT_FAILED: {
      TITLE: 'Cập Nhật Dữ Liệu Thất Bại!',
      LABEL1: 'Có lỗi hệ thống xảy ra khi cập nhật dữ liệu.',
      LABEL2: 'Hãy thử lại lần nữa, hoặc gửi yêu cầu hỗ trợ kỹ thuật.'
    },
    UPLOAD_FAILED: {
      TITLE: 'Đẩy File Thất Bại!',
      LABEL1: 'Có lỗi hệ thống xảy ra khi đẩy file lên.',
      LABEL2: 'Hãy thử lại lần nữa, hoặc gửi yêu cầu hỗ trợ kỹ thuật.'
    },
    CONFIRM_HIDE: {
      TITLE: 'Xác Nhận Tạm Ẩn Hạng Mục!',
      LABEL1: 'Hãy kiểm tra lại việc ẩn hạng mục:',
      ERROR1: 'Có lỗi hệ thống xảy ra khi ẩn hạng mục.',
      ERROR2: 'Hãy thử lại lần nữa, hoặc gửi yêu cầu hỗ trợ kỹ thuật.'
    },
    CONFIRM_SHOW: {
      TITLE: 'Xác Nhận Hiển Thị Hạng Mục!',
      LABEL1: 'Hãy kiểm tra lại việc hiển thị hạng mục:',
      ERROR1: 'Có lỗi hệ thống xảy ra khi hiển thị hạng mục.',
      ERROR2: 'Hãy thử lại lần nữa, hoặc gửi yêu cầu hỗ trợ kỹ thuật.'
    },
    CONFIRM_ASSIGN: {
      TITLE: 'Xác Nhận Liên Kết Hạng Mục!',
      LABEL1: 'Hãy kiểm tra lại việc liên kết hạng mục:',
      ERROR1: 'Có lỗi hệ thống xảy ra khi liên kết hạng mục.',
      ERROR2: 'Hãy thử lại lần nữa, hoặc gửi yêu cầu hỗ trợ kỹ thuật.'
    },
    CONFIRM_LOCK: {
      TITLE: 'Xác Nhận Khoá Hạng Mục!',
      LABEL1: 'Hãy kiểm tra lại việc khoá hạng mục:',
      ERROR1: 'Có lỗi hệ thống xảy ra khi khoá hạng mục.',
      ERROR2: 'Hãy thử lại lần nữa, hoặc gửi yêu cầu hỗ trợ kỹ thuật.'
    },
    CONFIRM_UNLOCK: {
      TITLE: 'Xác Nhận Mở Khoá Hạng Mục!',
      LABEL1: 'Hãy kiểm tra lại việc mở khoá hạng mục:',
      ERROR1: 'Có lỗi hệ thống xảy ra khi mở khoá hạng mục.',
      ERROR2: 'Hãy thử lại lần nữa, hoặc gửi yêu cầu hỗ trợ kỹ thuật.'
    },
    CONFIRM_REMOVE: {
      TITLE: 'Xác Nhận Loại Bỏ Hạng Mục!',
      LABEL1: 'Hãy kiểm tra lại việc loại bỏ hạng mục:',
      ERROR1: 'Có lỗi hệ thống xảy ra khi loại bỏ hạng mục.',
      ERROR2: 'Hãy thử lại lần nữa, hoặc gửi yêu cầu hỗ trợ kỹ thuật.'
    },
    CONFIRM_CLOSE: {
      TITLE: 'Xác Nhận Đóng Hạng Mục!',
      LABEL1: 'Hãy kiểm tra lại việc đóng hạng mục:',
      ERROR1: 'Có lỗi hệ thống xảy ra khi đóng hạng mục.',
      ERROR2: 'Hãy thử lại lần nữa, hoặc gửi yêu cầu hỗ trợ kỹ thuật.'
    },
    CONFIRM_RESTORE: {
      TITLE: 'Xác Nhận Khôi Phục Hạng Mục!',
      LABEL1: 'Hãy kiểm tra lại việc khôi phục hạng mục:',
      ERROR1: 'Có lỗi hệ thống xảy ra khi khôi phục hạng mục.',
      ERROR2: 'Hãy thử lại lần nữa, hoặc gửi yêu cầu hỗ trợ kỹ thuật.'
    },
    CONFIRM_DELETE: {
      TITLE: 'Xác Nhận Xoá Bỏ Hạng Mục!',
      LABEL1: 'Hãy kiểm tra lại việc xoá hạng mục:',
      ERROR1: 'Có lỗi hệ thống xảy ra khi xoá hạng mục.',
      ERROR2: 'Hãy thử lại lần nữa, hoặc gửi yêu cầu hỗ trợ kỹ thuật.'
    },
    ERROR_COMMON: {
      HELLO_WITH_NAME: 'Xin chào {name}!',
      HELLO_WITHOUT_NAME: 'Xin chào!',
      GREETING: 'Bạn đang truy cập {copyright}!'
    },
    ERROR_NOT_FOUND: {
      TITLE: 'Oops! Trang Không Tồn Tại!',
      MESSAGE: 'Trang đang truy cập hiện không còn tồn tại.',
      LABEL1: 'Hãy kiểm tra lại đường dẫn truy cập.',
      LABEL2: 'Liên hệ quản trị viên để được hỗ trợ kỹ thuật.',
      ACTION: 'Về Trang Chủ'
    },
    ERROR_SYSTEM_ERROR: {
      TITLE: 'Oops! Lỗi Hệ Thống!',
      MESSAGE: 'Cõ lỗi hệ thống khi xử ý yêu cầu truy cập.',
      LABEL1: 'Hãy thử truy cập lại lần nữa.',
      LABEL2: 'Liên hệ quản trị viên để được hỗ trợ kỹ thuật.',
      ACTION: 'Tải Lại Trang'
    },
    ERROR_CONNECT_ERROR: {
      TITLE: 'Oops! Lỗi Kết Nối!',
      MESSAGE: 'Kết nối tới hệ thống xác minh tài khoản thất bại.',
      LABEL1: 'Hãy thử truy cập lại lần nữa.',
      LABEL2: 'Liên hệ quản trị viên để được hỗ trợ kỹ thuật.',
      ACTION: 'Tải Lại Trang'
    },
    ERROR_AUTHORIZE_ERROR: {
      TITLE: 'Oops! Lỗi Xác Thực!',
      MESSAGE: 'Có lỗi xảy ra trong quá trình xác minh tài khoản.',
      LABEL1: 'Hãy thử truy cập lại lần nữa.',
      LABEL2: 'Liên hệ quản trị viên để được hỗ trợ kỹ thuật.',
      ACTION: 'Tải Lại Trang'
    },
    ERROR_FORBIDDEN_ERROR: {
      TITLE: 'Oops! Truy Cập Bị Từ Chối!',
      MESSAGE: 'Bạn chưa được cấp quyền để truy cập dữ liệu này.',
      LABEL1: 'Hãy gửi yêu cầu cấp quyền tới quản lý của bạn.',
      LABEL2: 'Liên hệ quản trị viên để được hỗ trợ kỹ thuật.',
      ACTION: 'Về Trang Chủ'
    },
    ERROR_SESSION_EXPIRED: {
      TITLE: 'Oops! Phiên Đăng Nhập Hết Hạn!',
      MESSAGE: 'Phiên đăng nhập của bạn đã hết hạn.',
      LABEL1: 'Hãy đăng nhập lại để tiếp tục sử dụng hệ thống.',
      LABEL2: 'Liên hệ quản trị viên để được hỗ trợ kỹ thuật.',
      ACTION: 'Đăng Nhập'
    },
    ERROR_CODE_EXPIRED: {
      TITLE: 'Oops! Mã Xác Thực Hết Hạn!',
      MESSAGE: 'Mã xác thực đã hết hạn hoặc đã sử dụng.',
      LABEL1: 'Thực hiện yêu cầu lại mã xác thực để tiếp tục.',
      LABEL2: 'Liên hệ quản trị viên để được hỗ trợ kỹ thuật.',
      ACTION: 'Về Trang Chủ'
    },
    ERROR_INVALID_REQUEST: {
      TITLE: 'Oops! Truy Cập Không Hợp Lệ!',
      MESSAGE: 'Truy cập không có đủ các tham số theo yêu cầu.',
      LABEL1: 'Hãy thực hiện các tác vụ theo đúng luồng của hệ thống.',
      LABEL2: 'Liên hệ quản trị viên để được hỗ trợ kỹ thuật.',
      ACTION: 'Về Trang Chủ'
    },
    ERROR_DUPLICATED_INFO: {
      TITLE: 'Oops! Dữ Liệu Bị Trùng Lặp!',
      MESSAGE: 'Dữ liệu trùng lặp với luồng xử lý khác.',
      LABEL1: 'Hãy thử thao tác lại từ đầu với dữ liệu mới.',
      LABEL2: 'Liên hệ quản trị viên để được hỗ trợ kỹ thuật.',
      ACTION: 'Về Trang Chủ'
    },
    ERROR_MUST_SIGNIN: {
      TITLE: 'Oops! Yêu Cầu Đăng Nhập!',
      MESSAGE: 'Bạn cần đăng nhập để sử dụng hệ thống.',
      LABEL1: 'Hãy thực hiện đăng nhập để tiếp tục sử dụng.',
      LABEL2: 'Liên hệ quản trị viên để được hỗ trợ kỹ thuật.',
      ACTION: 'Đăng Nhập'
    },
    ERROR_ACCOUNT_LOCKED: {
      TITLE: 'Oops! Tài Khoản Bị Khoá!',
      MESSAGE: 'Tài khoản của bạn đã bị khoá bởi quản trị viên.',
      LABEL1: 'Hãy gửi yêu cầu mở khoá tài khoản để tiếp mục sử dụng.',
      LABEL2: 'Liên hệ quản trị viên để được hỗ trợ kỹ thuật.',
      ACTION: 'Kiểm Tra Tài Khoản'
    },
    ERROR_NOT_IMPLEMENTED: {
      TITLE: 'Oops! Tính Năng Đang Hoàn Thiện!',
      MESSAGE: 'Tính năng này đang trong quá trình xây dựng.',
      LABEL1: 'Vui lòng quay lại sử dụng sau.',
      LABEL2: 'Liên hệ quản trị viên để được hỗ trợ kỹ thuật.',
      ACTION: 'Về Trang Chủ'
    },
    ERROR_ITEM_NOT_EXIST: {
      TITLE: 'Oops! Hạng Mục Không Tồn Tại!',
      MESSAGE: 'Hạng mục đang truy cập hiện không còn tồn tại.',
      LABEL1: 'Hãy kiểm tra lại đường dẫn truy cập.',
      LABEL2: 'Liên hệ quản trị viên để được hỗ trợ kỹ thuật.',
      ACTION: 'Về Trang Chủ'
    },
    ERROR_SUBJECT_NOT_EXIST: {
      TITLE: 'Oops! Tài Khoản Không Tồn Tại!',
      MESSAGE: 'Tài khoản đang truy cập hiện không còn tồn tại.',
      LABEL1: 'Hãy kiểm tra lại đường dẫn truy cập.',
      LABEL2: 'Liên hệ quản trị viên để được hỗ trợ kỹ thuật.',
      ACTION: 'Về Trang Chủ'
    },
    ERROR_SUBJECT_WAS_CLOSED: {
      TITLE: 'Oops! Tài Khoàn Đã Khoá!',
      MESSAGE: 'Tài khoản đang truy cập đã bị đóng.',
      LABEL1: 'Thực hiện khôi phục tài khoản nếu muốn sử dụng lại.',
      LABEL2: 'Liên hệ quản trị viên để được hỗ trợ kỹ thuật.',
      ACTION: 'Về Trang Chủ'
    }
  }),
  Qb = { COMMON: Jb },
  Zb = Object.freeze({
    REQUIRED: '{item} is required.',
    MIN_LENGTH: '{item} must be no less than {length} characters.',
    MAX_LENGTH: '{item} must be no longer than {length} characters.',
    CONFIRM_PASSWORD: '{confirm} must be same with {password}.',
    IS_DUPLICATED: '{item} is duplicated.',
    KEY_IS_DUPLICATED: 'Key is duplicated.',
    DOMAIN_IS_DUPLICATED: 'Domain is duplicated.',
    URL_SLUG_IS_DUPLICATED: 'URL Slug is duplicated.',
    EMAIL_PATTERN: '{item} must be a valid email format.',
    KEY_PATTERN: '{item} must only content a-z, 0-9 and dash.',
    DOMAIN_PATTERN: '{item} must be a valid website domain name.',
    URL_SLUG_PATTERN: '{item} must only content a-z, 0-9 and dash.',
    INVALID_CHARACTERS: '{item} must not include any invalid characters.',
    INVALID_CHARACTERS_WITH_ACCEPT: '{item} must not include any invalid characters. (Accept: {accept})',
    PATTERN: '{item} must has pattern {pattern}.',
    DATE_ONLY_TYPE_01: '{item} must be a valid date with format DD/MM/YYYY.',
    DATE_ONLY_TYPE_02: '{item} must be a valid date with format MM/DD/YYYY.'
  }),
  eS = { VALIDATION: Zb },
  tS = Object.freeze({
    REQUIRED: '{item} không thể bỏ trống.',
    MIN_LENGTH: '{item} không ngắn hơn {length} ký tự.',
    MAX_LENGTH: '{item} không dài hơn {length} ký tự.',
    CONFIRM_PASSWORD: '{confirm} phải trùng với {password}.',
    IS_DUPLICATED: '{item} đã được sử dụng.',
    KEY_IS_DUPLICATED: 'Key đã được sử dụng.',
    DOMAIN_IS_DUPLICATED: 'Domain đã được sử dụng.',
    URL_SLUG_IS_DUPLICATED: 'URL Slug đã được sử dụng.',
    EMAIL_PATTERN: '{item} cần có định dạng email.',
    KEY_PATTERN: '{item} chỉ bao gồm a-z, 0-9 và gạch ngang.',
    DOMAIN_PATTERN: '{item} cần có định dạng domain.',
    URL_SLUG_PATTERN: '{item} chỉ bao gồm a-z, 0-9 và gạch ngang.',
    INVALID_CHARACTERS: '{item} không thể bao gồm kỹ tự đặc biệt.',
    INVALID_CHARACTERS_WITH_ACCEPT: '{item} không thể bao gồm kỹ tự đặc biệt. (Chấp nhận: {accept})',
    PATTERN: '{item} cần có định dạng {pattern}.',
    DATE_ONLY_TYPE_01: '{item} phải có định dạng DD/MM/YYYY.',
    DATE_ONLY_TYPE_02: '{item} phải có định dạng MM/DD/YYYY.'
  }),
  nS = { VALIDATION: tS },
  sS = Object.freeze({ PRIVACY_POLICY: 'Privacy policy', TERMS_OF_USE: 'Terms of use', VERSION: 'Version' }),
  rS = { FOOTER: sS },
  oS = Object.freeze({ PRIVACY_POLICY: 'Chính sách bảo mật', TERMS_OF_USE: 'Điều khoản sử dụng', VERSION: 'Version' }),
  aS = { FOOTER: oS },
  iS = Object.freeze({ EXAMPLE: 'Ex: {sample}', HINT: { DATE_ONLY_FORMAT: 'Format: {format}' } }),
  lS = { GUIDE: iS },
  uS = Object.freeze({ EXAMPLE: 'VD: {sample}', HINT: { DATE_ONLY_FORMAT: 'Định dạng: {format}' } }),
  cS = { GUIDE: uS },
  dS = Object.freeze({
    TITLE: {},
    SUBTITLE: { NOT_SIGNIN_YET: 'Not Sign In Yet' },
    LABEL: { EMAIL: 'Email', USERNAME: 'Username', DISPLAY_NAME: 'Display Name', PHONE_NUMBER: 'Phone Number' },
    ACTION: {
      SIGNIN: 'Sign In',
      SIGNOUT: 'Sign Out',
      NEW_MESSAGES: 'Check all new messages',
      NEW_NOTIFICATIONS: 'Check all new notifications',
      ACCOUNT_INFORMATION: 'Manage account information',
      CHANGE_PASSWORD: 'Change current account password',
      GO_TO_HOME: 'Go to homepage of Amoza Connect',
      REGISTRY_NEW_ACCOUNT: 'Registry a new account',
      RESET_YOUR_PASSWORD: 'Reset your account password'
    },
    MESSAGE: {}
  }),
  fS = { INDEX_PAGE: dS },
  mS = Object.freeze({
    TITLE: {},
    SUBTITLE: { NOT_SIGNIN_YET: 'Chưa Đăng Nhập' },
    LABEL: { EMAIL: 'Email', USERNAME: 'Tài khoản', DISPLAY_NAME: 'Tên Hiển Thị', PHONE_NUMBER: 'Số Điện Thoại' },
    ACTION: {
      SIGNIN: 'Đăng Nhập',
      SIGNOUT: 'Đăng Xuất',
      NEW_MESSAGES: 'Xem tất cả tin nhắn mới',
      NEW_NOTIFICATIONS: 'Xem tất cả thông báo mới',
      ACCOUNT_INFORMATION: 'Quản lý thông tin tài khoản',
      CHANGE_PASSWORD: 'Đổi mật khẩu của tài khoản',
      GO_TO_HOME: 'Đi tới trang chủ Amoza Connect',
      REGISTRY_NEW_ACCOUNT: 'Đăng ký tài khoản mới cho bạn',
      RESET_YOUR_PASSWORD: 'Đặt lại mật khẩu tài khoản đã có'
    },
    MESSAGE: {}
  }),
  hS = { INDEX_PAGE: mS },
  gS = Object.freeze({
    TITLE: { SIGNIN: 'Sign In To The System' },
    SUBTITLE: {},
    LABEL: { USERNAME: 'Username', PASSWORD: 'Password' },
    ACTION: {
      SIGNIN: 'Sign in',
      RESET_YOUR_PASSWORD: 'Did you forget your password?',
      REGISTRY_NEW_ACCOUNT: 'Registry a new account!'
    },
    MESSAGE: {
      INCORRECT: 'Username or password is incorrect.',
      SIGNIN_FAILED: 'Failed to sign in! Please try again.',
      SIGNIN_SUCCESS: 'Sign in success!',
      REDIRECT_SYSTEM: 'The system is redirecting now.'
    }
  }),
  pS = { SIGNIN_PAGE: gS },
  ES = Object.freeze({
    TITLE: { SIGNIN: 'Đăng Nhập Hệ Thống' },
    SUBTITLE: {},
    LABEL: { USERNAME: 'Tài Khoản', PASSWORD: 'Mật Khẩu' },
    ACTION: {
      SIGNIN: 'Đăng Nhập',
      RESET_YOUR_PASSWORD: 'Bạn không nhớ mật khẩu?',
      REGISTRY_NEW_ACCOUNT: 'Đăng ký tài khoản mới!'
    },
    MESSAGE: {
      INCORRECT: 'Tài khoản hoặc mật khẩu không chính xác.',
      SIGNIN_FAILED: 'Đăng nhập thất bại! Vui lòng thử lại.',
      SIGNIN_SUCCESS: 'Đăng nhập thành công!',
      REDIRECT_SYSTEM: 'Đang chuyển hướng hệ thống.'
    }
  }),
  _S = { SIGNIN_PAGE: ES },
  yS = Object.freeze({
    TITLE: {
      SIGNUP: 'Sign Up New Account',
      VERIFY_CODE: 'Verify OTP Code',
      SET_PASSWORD: 'Set New Password',
      INFO: 'Account Information'
    },
    SUBTITLE: {},
    LABEL: {
      EMAIL: 'Email',
      CODE: 'OTP Code',
      NEW_PASSWORD: 'New Password',
      CONFIRM_PASSWORD: 'Confirm Password',
      USERNAME: 'Username',
      PASSWORD: 'Password',
      DISPLAY_NAME: 'Display Name',
      PHONE_NUMBER: 'Phone Number'
    },
    ACTION: {
      SIGNUP: 'Sign Up',
      VERIFY: 'Verify',
      SUBMIT: 'Submit',
      SIGNIN: 'Sign In',
      SING_IN_YOUR_ACCOUNT: 'Sign in with your account!',
      RESET_YOUR_PASSWORD: 'Reset password for your account!',
      BACK_TO_REQUEST: 'Back'
    },
    MESSAGE: {
      INVALID_DATA: 'Invalid input data!',
      CHECK_RED_BOXES: 'Please check red boxes.',
      CHECK_OTP_CODE: 'Please check email to get OTP code:',
      REQUEST_FAILED: 'Failed to process! Please try again.',
      REQUEST_SUCCESS: 'OTP code was sent to email.',
      REDIRECT_VERIFY: 'Please check your email.',
      INCORRECT_CODE: 'The OTP code is incorrect.',
      VERIFY_FAILED: 'Failed to verify! Please try again.',
      VERIFY_SUCCESS: 'Verify OTP code successfully!',
      REDIRECT_PASSWORD: 'Please set your password.',
      SUBMIT_FAILED: 'Failed to process! Please try again.',
      SIGNUP_FINISHED: 'Sign up new account successfully!',
      REDIRECT_SIGNIN: 'Please sign in to continue using the system.'
    }
  }),
  vS = { SIGNUP_PAGE: yS },
  bS = Object.freeze({
    TITLE: {
      SIGNUP: 'Đăng Ký Tài Khoản Mới',
      VERIFY_CODE: 'Xác Thực Mã OTP',
      SET_PASSWORD: 'Thiết Lập Mật Khẩu',
      INFO: 'Thông Tin Tài Khoản'
    },
    SUBTITLE: {},
    LABEL: {
      EMAIL: 'Email',
      CODE: 'Mã Xác Thực',
      NEW_PASSWORD: 'Mật Khẩu Mới',
      CONFIRM_PASSWORD: 'Xác Nhận Mật Khẩu',
      USERNAME: 'Tài Khoản',
      PASSWORD: 'Mật Khẩu',
      DISPLAY_NAME: 'Tên Hiển Thị',
      PHONE_NUMBER: 'Số Điện Thoại'
    },
    ACTION: {
      SIGNUP: 'Đăng Ký',
      VERIFY: 'Xác Thực',
      SUBMIT: 'Hoàn Tất',
      SIGNIN: 'Đăng Nhập',
      SING_IN_YOUR_ACCOUNT: 'Đăng nhập với tài khoản đã có!',
      RESET_YOUR_PASSWORD: 'Lấy lại mật khẩu cho tài khoản cũ!',
      BACK_TO_REQUEST: 'Quay Lại'
    },
    MESSAGE: {
      INVALID_DATA: 'Dữ liệu không hợp lệ!',
      CHECK_RED_BOXES: 'Vui lòng kiểm tra ô màu đỏ.',
      CHECK_OTP_CODE: 'Kiểm tra email để lấy mã xác thực:',
      REQUEST_FAILED: 'Xử lý thất bại! Vui lòng thử lại.',
      REQUEST_SUCCESS: 'Đã gửi mã xác thức tới email.',
      REDIRECT_VERIFY: 'Kiểm tra email để lấy mã xác thực.',
      INCORRECT_CODE: 'Mã xác thực không chính xác.',
      VERIFY_FAILED: 'Xác thực thất bại! Vui lòng thử lại.',
      VERIFY_SUCCESS: 'Xác thực thành công!',
      REDIRECT_PASSWORD: 'Tiếp tục đặt mật khẩu mới.',
      SUBMIT_FAILED: 'Xử lý thất bại! Vui lòng thử lại.',
      SIGNUP_FINISHED: 'Đăng ký tài khoản mới thành công!',
      REDIRECT_SIGNIN: 'Vui lòng đăng nhập để tiếp tục sử dụng.'
    }
  }),
  SS = { SIGNUP_PAGE: bS },
  RS = Object.freeze({
    TITLE: {
      RESET_PASSWORD: 'Reset Your Password',
      VERIFY_CODE: 'Verify OTP Code',
      SET_PASSWORD: 'Set New Password',
      INFO: 'Account Information'
    },
    SUBTITLE: {},
    LABEL: {
      EMAIL: 'Email',
      CODE: 'OTP Code',
      NEW_PASSWORD: 'New Password',
      CONFIRM_PASSWORD: 'Confirm Password',
      USERNAME: 'Username',
      PASSWORD: 'Password',
      DISPLAY_NAME: 'Display Name',
      PHONE_NUMBER: 'Phone Number'
    },
    ACTION: {
      REQUEST: 'Reset',
      VERIFY: 'Verify',
      SUBMIT: 'Submit',
      SIGNIN: 'Signin',
      SING_IN_YOUR_ACCOUNT: 'Sign in with your account!',
      REGISTRY_NEW_ACCOUNT: 'Sign up a new account!',
      BACK_TO_REQUEST: 'Back'
    },
    MESSAGE: {
      INCORRECT_EMAIL: 'The email does not exist.',
      REQUEST_FAILED: 'Failed to process! Please try again.',
      REQUEST_SUCCESS: 'OTP code was sent to email.',
      REDIRECT_VERIFY: 'Please check your email.',
      CHECK_OTP_CODE: 'Please check email to get OTP code:',
      INCORRECT_CODE: 'The OTP code is incorrect.',
      VERIFY_FAILED: 'Failed to verify! Please try again.',
      VERIFY_SUCCESS: 'Verify OTP code successfully!',
      REDIRECT_PASSWORD: 'Please set a new password.',
      SUBMIT_FAILED: 'Failed to process! Please try again.',
      SET_PASSWORD_SUCCESS: 'New password was set for your account!',
      REDIRECT_INFO: 'Please sign in with the new password.'
    }
  }),
  OS = { RESET_PAGE: RS },
  CS = Object.freeze({
    TITLE: {
      RESET_PASSWORD: 'Đặt Lại Mật Khẩu',
      VERIFY_CODE: 'Xác Thực Mã OTP',
      SET_PASSWORD: 'Thiết Lập Mật Khẩu',
      INFO: 'Thông Tin Tài Khoản'
    },
    SUBTITLE: {},
    LABEL: {
      EMAIL: 'Email',
      CODE: 'Mã Xác Thực',
      NEW_PASSWORD: 'Mật Khẩu Mới',
      CONFIRM_PASSWORD: 'Xác Nhận Mật Khẩu',
      USERNAME: 'Tài Khoản',
      PASSWORD: 'Mật Khẩu',
      DISPLAY_NAME: 'Tên Hiển Thị',
      PHONE_NUMBER: 'Số Điện Thoại'
    },
    ACTION: {
      REQUEST: 'Tiến Hành',
      VERIFY: 'Xác Thực',
      SUBMIT: 'Hoàn Tất',
      SIGNIN: 'Đăng Nhập',
      SING_IN_YOUR_ACCOUNT: 'Đăng nhập với tài khoản!',
      REGISTRY_NEW_ACCOUNT: 'Đăng ký tài khoản mới!',
      BACK_TO_REQUEST: 'Quay Lại'
    },
    MESSAGE: {
      INCORRECT_EMAIL: 'Email không tồn tại trong hệ thống.',
      REQUEST_FAILED: 'Xác thực thất bại! Vui lòng thử lại.',
      REQUEST_SUCCESS: 'Đã gửi mã xác thức tới email.',
      REDIRECT_VERIFY: 'Kiểm tra email để lấy mã xác thực.',
      CHECK_OTP_CODE: 'Kiểm tra email để lấy mã xác thực:',
      INCORRECT_CODE: 'Mã xác thực không chính xác.',
      VERIFY_FAILED: 'Xác thực thất bại! Vui lòng thử lại.',
      VERIFY_SUCCESS: 'Xác thực thành công!',
      REDIRECT_PASSWORD: 'Tiếp tục đặt mật khẩu mới.',
      SUBMIT_FAILED: 'Xử lý thất bại! Vui lòng thử lại.',
      SET_PASSWORD_SUCCESS: 'Thiết lập mật khẩu thành công!',
      REDIRECT_INFO: 'Vui lòng đăng nhập lại với mật khẩu mới.'
    }
  }),
  AS = { RESET_PAGE: CS },
  IS = Object.freeze({
    TITLE: { WELCOME: 'Welcome To {name}', SET_PASSWORD: 'Setup Your Password', INFORMATION: 'Account Information' },
    SUBTITLE: {},
    LABEL: {
      USERNAME: 'Username',
      PASSWORD: 'Password',
      DISPLAY_NAME: 'Display Name',
      PHONE_NUMBER: 'Phone Number',
      EMAIL: 'Email',
      NEW_PASSWORD: 'New Password',
      CONFIRM_PASSWORD: 'Confirm Password'
    },
    ACTION: { SETUP: 'Setup Up', SUBMIT: 'Submit', SIGNIN: 'Sign In' },
    MESSAGE: {
      CONGRATULATIONS: 'Congratulations, your account has been created!',
      PLEASE_FINISH_SETUP: 'Please finish setup before using the account.',
      SUBMIT_FAILED: 'Failed to process! Please try again.',
      SETUP_FINISHED: 'Setup account information successfully!',
      REDIRECT_SIGNIN: 'Please sign in to continue using the system.'
    }
  }),
  TS = { WELCOME_PAGE: IS },
  NS = Object.freeze({
    TITLE: {
      WELCOME: 'Chào Mứng Bạn Tới {name}',
      SET_PASSWORD: 'Thiết Lập Mật Khẩu',
      INFORMATION: 'Thông Tin Tài Khoản'
    },
    SUBTITLE: {},
    LABEL: {
      USERNAME: 'Tài Khoản',
      PASSWORD: 'Mật Khẩu',
      DISPLAY_NAME: 'Tên Hiển Thị',
      PHONE_NUMBER: 'Số Điện Thoại',
      EMAIL: 'Email',
      NEW_PASSWORD: 'Mật Khẩu Mới',
      CONFIRM_PASSWORD: 'Xác Nhận Mật Khẩu'
    },
    ACTION: { SETUP: 'Thiết Lập', SUBMIT: 'Thiết Lập', SIGNIN: 'Đăng Nhập' },
    MESSAGE: {
      CONGRATULATIONS: 'Chúc mừng bạn đã được khởi tạo tài khoản!',
      PLEASE_FINISH_SETUP: 'Vui lòng hoàn tất thiết lập trước khi sử dụng.',
      SUBMIT_FAILED: 'Xử lý thất bại! Vui lòng thử lại.',
      SETUP_FINISHED: 'Thiết lập mật khẩu mới thành công!',
      REDIRECT_SIGNIN: 'Vui lòng đăng nhập để tiếp tục sử dụng.'
    }
  }),
  wS = { WELCOME_PAGE: NS },
  wh = {
    badge: 'Badge',
    open: 'Open',
    close: 'Close',
    confirmEdit: { ok: 'OK', cancel: 'Cancel' },
    dataIterator: { noResultsText: 'No matching records found', loadingText: 'Loading items...' },
    dataTable: {
      itemsPerPageText: 'Rows per page:',
      ariaLabel: {
        sortDescending: 'Sorted descending.',
        sortAscending: 'Sorted ascending.',
        sortNone: 'Not sorted.',
        activateNone: 'Activate to remove sorting.',
        activateDescending: 'Activate to sort descending.',
        activateAscending: 'Activate to sort ascending.'
      },
      sortBy: 'Sort by'
    },
    dataFooter: {
      itemsPerPageText: 'Items per page:',
      itemsPerPageAll: 'All',
      nextPage: 'Next page',
      prevPage: 'Previous page',
      firstPage: 'First page',
      lastPage: 'Last page',
      pageText: '{0}-{1} of {2}'
    },
    dateRangeInput: { divider: 'to' },
    datePicker: {
      itemsSelected: '{0} selected',
      range: { title: 'Select dates', header: 'Enter dates' },
      title: 'Select date',
      header: 'Enter date',
      input: { placeholder: 'Enter date' }
    },
    noDataText: 'No data available',
    carousel: { prev: 'Previous visual', next: 'Next visual', ariaLabel: { delimiter: 'Carousel slide {0} of {1}' } },
    calendar: { moreEvents: '{0} more', today: 'Today' },
    input: {
      clear: 'Clear {0}',
      prependAction: '{0} prepended action',
      appendAction: '{0} appended action',
      otp: 'Please enter OTP character {0}'
    },
    fileInput: { counter: '{0} files', counterSize: '{0} files ({1} in total)' },
    timePicker: { am: 'AM', pm: 'PM' },
    pagination: {
      ariaLabel: {
        root: 'Pagination Navigation',
        next: 'Next page',
        previous: 'Previous page',
        page: 'Go to page {0}',
        currentPage: 'Page {0}, Current page',
        first: 'First page',
        last: 'Last page'
      }
    },
    stepper: { next: 'Next', prev: 'Previous' },
    rating: { ariaLabel: { item: 'Rating {0} of {1}' } },
    loading: 'Loading...',
    infiniteScroll: { loadMore: 'Load more', empty: 'No more' }
  },
  LS = {
    badge: 'Huy hiệu',
    open: 'Open',
    close: 'Đóng',
    confirmEdit: { ok: 'OK', cancel: 'Cancel' },
    dataIterator: { noResultsText: 'Không tìm thấy kết quả nào', loadingText: 'Đang tải...' },
    dataTable: {
      itemsPerPageText: 'Số hàng mỗi trang:',
      ariaLabel: {
        sortDescending: 'Sắp xếp giảm dần.',
        sortAscending: 'Sắp xếp tăng dần.',
        sortNone: 'Không sắp xếp.',
        activateNone: 'Kích hoạt để bỏ sắp xếp.',
        activateDescending: 'Kích hoạt để sắp xếp giảm dần.',
        activateAscending: 'Kích hoạt để sắp xếp tăng dần.'
      },
      sortBy: 'Sắp xếp'
    },
    dataFooter: {
      itemsPerPageText: 'Số mục mỗi trang:',
      itemsPerPageAll: 'Toàn bộ',
      nextPage: 'Trang tiếp theo',
      prevPage: 'Trang trước',
      firstPage: 'Trang đầu',
      lastPage: 'Trang cuối',
      pageText: '{0}-{1} trên {2}'
    },
    dateRangeInput: { divider: 'to' },
    datePicker: {
      itemsSelected: '{0} selected',
      range: { title: 'Select dates', header: 'Enter dates' },
      title: 'Select date',
      header: 'Enter date',
      input: { placeholder: 'Enter date' }
    },
    noDataText: 'Không có dữ liệu',
    carousel: { prev: 'Ảnh tiếp theo', next: 'Ảnh trước', ariaLabel: { delimiter: 'Carousel slide {0} trên {1}' } },
    calendar: { moreEvents: '{0} nữa', today: 'Today' },
    input: {
      clear: 'Clear {0}',
      prependAction: '{0} prepended action',
      appendAction: '{0} appended action',
      otp: 'Please enter OTP character {0}'
    },
    fileInput: { counter: '{0} tệp', counterSize: '{0} tệp (tổng cộng {1})' },
    timePicker: { am: 'SA', pm: 'CH' },
    pagination: {
      ariaLabel: {
        root: 'Điều hướng phân trang',
        next: 'Trang tiếp theo',
        previous: 'Trang trước',
        page: 'Đến trang {0}',
        currentPage: 'Trang hiện tại, Trang {0}',
        first: 'First page',
        last: 'Last page'
      }
    },
    stepper: { next: 'Next', prev: 'Previous' },
    rating: { ariaLabel: { item: 'Đánh giá {0} trên {1}' } },
    loading: 'Loading...',
    infiniteScroll: { loadMore: 'Load more', empty: 'No more' }
  },
  PS = {
    en: { ...eS, ...Xb, ...rS, ...lS, ...fS, ...pS, ...vS, ...OS, ...TS, $vuetify: { ...wh } },
    vi: { ...nS, ...Qb, ...aS, ...cS, ...hS, ..._S, ...SS, ...AS, ...wS, $vuetify: { ...LS } }
  }
var vf
const Zl = new Vb({
  legacy: !1,
  locale: ((vf = appInitialData == null ? void 0 : appInitialData.setting) == null ? void 0 : vf.lang) || 'en',
  fallbackLocale: 'en',
  globalInjection: !0,
  messages: PS
})
/*!
 * vue-router v4.3.0
 * (c) 2024 Eduardo San Martin Morote
 * @license MIT
 */ const Us = typeof document < 'u'
function $S(e) {
  return e.__esModule || e[Symbol.toStringTag] === 'Module'
}
const Ze = Object.assign
function ci(e, t) {
  const n = {}
  for (const s in t) {
    const r = t[s]
    n[s] = fn(r) ? r.map(e) : e(r)
  }
  return n
}
const Pr = () => {},
  fn = Array.isArray,
  Lh = /#/g,
  MS = /&/g,
  kS = /\//g,
  DS = /=/g,
  FS = /\?/g,
  Ph = /\+/g,
  VS = /%5B/g,
  xS = /%5D/g,
  $h = /%5E/g,
  BS = /%60/g,
  Mh = /%7B/g,
  US = /%7C/g,
  kh = /%7D/g,
  GS = /%20/g
function eu(e) {
  return encodeURI('' + e)
    .replace(US, '|')
    .replace(VS, '[')
    .replace(xS, ']')
}
function WS(e) {
  return eu(e).replace(Mh, '{').replace(kh, '}').replace($h, '^')
}
function Ji(e) {
  return eu(e)
    .replace(Ph, '%2B')
    .replace(GS, '+')
    .replace(Lh, '%23')
    .replace(MS, '%26')
    .replace(BS, '`')
    .replace(Mh, '{')
    .replace(kh, '}')
    .replace($h, '^')
}
function HS(e) {
  return Ji(e).replace(DS, '%3D')
}
function jS(e) {
  return eu(e).replace(Lh, '%23').replace(FS, '%3F')
}
function YS(e) {
  return e == null ? '' : jS(e).replace(kS, '%2F')
}
function Xr(e) {
  try {
    return decodeURIComponent('' + e)
  } catch {}
  return '' + e
}
const KS = /\/$/,
  qS = e => e.replace(KS, '')
function di(e, t, n = '/') {
  let s,
    r = {},
    o = '',
    a = ''
  const i = t.indexOf('#')
  let u = t.indexOf('?')
  return (
    i < u && i >= 0 && (u = -1),
    u > -1 && ((s = t.slice(0, u)), (o = t.slice(u + 1, i > -1 ? i : t.length)), (r = e(o))),
    i > -1 && ((s = s || t.slice(0, i)), (a = t.slice(i, t.length))),
    (s = QS(s ?? t, n)),
    { fullPath: s + (o && '?') + o + a, path: s, query: r, hash: Xr(a) }
  )
}
function zS(e, t) {
  const n = t.query ? e(t.query) : ''
  return t.path + (n && '?') + n + (t.hash || '')
}
function rd(e, t) {
  return !t || !e.toLowerCase().startsWith(t.toLowerCase()) ? e : e.slice(t.length) || '/'
}
function XS(e, t, n) {
  const s = t.matched.length - 1,
    r = n.matched.length - 1
  return (
    s > -1 &&
    s === r &&
    sr(t.matched[s], n.matched[r]) &&
    Dh(t.params, n.params) &&
    e(t.query) === e(n.query) &&
    t.hash === n.hash
  )
}
function sr(e, t) {
  return (e.aliasOf || e) === (t.aliasOf || t)
}
function Dh(e, t) {
  if (Object.keys(e).length !== Object.keys(t).length) return !1
  for (const n in e) if (!JS(e[n], t[n])) return !1
  return !0
}
function JS(e, t) {
  return fn(e) ? od(e, t) : fn(t) ? od(t, e) : e === t
}
function od(e, t) {
  return fn(t) ? e.length === t.length && e.every((n, s) => n === t[s]) : e.length === 1 && e[0] === t
}
function QS(e, t) {
  if (e.startsWith('/')) return e
  if (!e) return t
  const n = t.split('/'),
    s = e.split('/'),
    r = s[s.length - 1]
  ;(r === '..' || r === '.') && s.push('')
  let o = n.length - 1,
    a,
    i
  for (a = 0; a < s.length; a++)
    if (((i = s[a]), i !== '.'))
      if (i === '..') o > 1 && o--
      else break
  return n.slice(0, o).join('/') + '/' + s.slice(a).join('/')
}
var Jr
;(function (e) {
  ;((e.pop = 'pop'), (e.push = 'push'))
})(Jr || (Jr = {}))
var $r
;(function (e) {
  ;((e.back = 'back'), (e.forward = 'forward'), (e.unknown = ''))
})($r || ($r = {}))
function ZS(e) {
  if (!e)
    if (Us) {
      const t = document.querySelector('base')
      ;((e = (t && t.getAttribute('href')) || '/'), (e = e.replace(/^\w+:\/\/[^\/]+/, '')))
    } else e = '/'
  return (e[0] !== '/' && e[0] !== '#' && (e = '/' + e), qS(e))
}
const eR = /^[^#]+#/
function tR(e, t) {
  return e.replace(eR, '#') + t
}
function nR(e, t) {
  const n = document.documentElement.getBoundingClientRect(),
    s = e.getBoundingClientRect()
  return { behavior: t.behavior, left: s.left - n.left - (t.left || 0), top: s.top - n.top - (t.top || 0) }
}
const Fa = () => ({ left: window.scrollX, top: window.scrollY })
function sR(e) {
  let t
  if ('el' in e) {
    const n = e.el,
      s = typeof n == 'string' && n.startsWith('#'),
      r = typeof n == 'string' ? (s ? document.getElementById(n.slice(1)) : document.querySelector(n)) : n
    if (!r) return
    t = nR(r, e)
  } else t = e
  'scrollBehavior' in document.documentElement.style
    ? window.scrollTo(t)
    : window.scrollTo(t.left != null ? t.left : window.scrollX, t.top != null ? t.top : window.scrollY)
}
function ad(e, t) {
  return (history.state ? history.state.position - t : -1) + e
}
const Qi = new Map()
function rR(e, t) {
  Qi.set(e, t)
}
function oR(e) {
  const t = Qi.get(e)
  return (Qi.delete(e), t)
}
let aR = () => location.protocol + '//' + location.host
function Fh(e, t) {
  const { pathname: n, search: s, hash: r } = t,
    o = e.indexOf('#')
  if (o > -1) {
    let i = r.includes(e.slice(o)) ? e.slice(o).length : 1,
      u = r.slice(i)
    return (u[0] !== '/' && (u = '/' + u), rd(u, ''))
  }
  return rd(n, e) + s + r
}
function iR(e, t, n, s) {
  let r = [],
    o = [],
    a = null
  const i = ({ state: h }) => {
    const E = Fh(e, location),
      y = n.value,
      v = t.value
    let I = 0
    if (h) {
      if (((n.value = E), (t.value = h), a && a === y)) {
        a = null
        return
      }
      I = v ? h.position - v.position : 0
    } else s(E)
    r.forEach(b => {
      b(n.value, y, { delta: I, type: Jr.pop, direction: I ? (I > 0 ? $r.forward : $r.back) : $r.unknown })
    })
  }
  function u() {
    a = n.value
  }
  function c(h) {
    r.push(h)
    const E = () => {
      const y = r.indexOf(h)
      y > -1 && r.splice(y, 1)
    }
    return (o.push(E), E)
  }
  function d() {
    const { history: h } = window
    h.state && h.replaceState(Ze({}, h.state, { scroll: Fa() }), '')
  }
  function m() {
    for (const h of o) h()
    ;((o = []), window.removeEventListener('popstate', i), window.removeEventListener('beforeunload', d))
  }
  return (
    window.addEventListener('popstate', i),
    window.addEventListener('beforeunload', d, { passive: !0 }),
    { pauseListeners: u, listen: c, destroy: m }
  )
}
function id(e, t, n, s = !1, r = !1) {
  return { back: e, current: t, forward: n, replaced: s, position: window.history.length, scroll: r ? Fa() : null }
}
function lR(e) {
  const { history: t, location: n } = window,
    s = { value: Fh(e, n) },
    r = { value: t.state }
  r.value ||
    o(s.value, { back: null, current: s.value, forward: null, position: t.length - 1, replaced: !0, scroll: null }, !0)
  function o(u, c, d) {
    const m = e.indexOf('#'),
      h = m > -1 ? (n.host && document.querySelector('base') ? e : e.slice(m)) + u : aR() + e + u
    try {
      ;(t[d ? 'replaceState' : 'pushState'](c, '', h), (r.value = c))
    } catch (E) {
      ;(console.error(E), n[d ? 'replace' : 'assign'](h))
    }
  }
  function a(u, c) {
    const d = Ze({}, t.state, id(r.value.back, u, r.value.forward, !0), c, { position: r.value.position })
    ;(o(u, d, !0), (s.value = u))
  }
  function i(u, c) {
    const d = Ze({}, r.value, t.state, { forward: u, scroll: Fa() })
    o(d.current, d, !0)
    const m = Ze({}, id(s.value, u, null), { position: d.position + 1 }, c)
    ;(o(u, m, !1), (s.value = u))
  }
  return { location: s, state: r, push: i, replace: a }
}
function uR(e) {
  e = ZS(e)
  const t = lR(e),
    n = iR(e, t.state, t.location, t.replace)
  function s(o, a = !0) {
    ;(a || n.pauseListeners(), history.go(o))
  }
  const r = Ze({ location: '', base: e, go: s, createHref: tR.bind(null, e) }, t, n)
  return (
    Object.defineProperty(r, 'location', { enumerable: !0, get: () => t.location.value }),
    Object.defineProperty(r, 'state', { enumerable: !0, get: () => t.state.value }),
    r
  )
}
function cR(e) {
  return typeof e == 'string' || (e && typeof e == 'object')
}
function Vh(e) {
  return typeof e == 'string' || typeof e == 'symbol'
}
const Yn = {
    path: '/',
    name: void 0,
    params: {},
    query: {},
    hash: '',
    fullPath: '/',
    matched: [],
    meta: {},
    redirectedFrom: void 0
  },
  xh = Symbol('')
var ld
;(function (e) {
  ;((e[(e.aborted = 4)] = 'aborted'), (e[(e.cancelled = 8)] = 'cancelled'), (e[(e.duplicated = 16)] = 'duplicated'))
})(ld || (ld = {}))
function rr(e, t) {
  return Ze(new Error(), { type: e, [xh]: !0 }, t)
}
function wn(e, t) {
  return e instanceof Error && xh in e && (t == null || !!(e.type & t))
}
const ud = '[^/]+?',
  dR = { sensitive: !1, strict: !1, start: !0, end: !0 },
  fR = /[.+*?^${}()[\]/\\]/g
function mR(e, t) {
  const n = Ze({}, dR, t),
    s = []
  let r = n.start ? '^' : ''
  const o = []
  for (const c of e) {
    const d = c.length ? [] : [90]
    n.strict && !c.length && (r += '/')
    for (let m = 0; m < c.length; m++) {
      const h = c[m]
      let E = 40 + (n.sensitive ? 0.25 : 0)
      if (h.type === 0) (m || (r += '/'), (r += h.value.replace(fR, '\\$&')), (E += 40))
      else if (h.type === 1) {
        const { value: y, repeatable: v, optional: I, regexp: b } = h
        o.push({ name: y, repeatable: v, optional: I })
        const O = b || ud
        if (O !== ud) {
          E += 10
          try {
            new RegExp(`(${O})`)
          } catch (T) {
            throw new Error(`Invalid custom RegExp for param "${y}" (${O}): ` + T.message)
          }
        }
        let P = v ? `((?:${O})(?:/(?:${O}))*)` : `(${O})`
        ;(m || (P = I && c.length < 2 ? `(?:/${P})` : '/' + P),
          I && (P += '?'),
          (r += P),
          (E += 20),
          I && (E += -8),
          v && (E += -20),
          O === '.*' && (E += -50))
      }
      d.push(E)
    }
    s.push(d)
  }
  if (n.strict && n.end) {
    const c = s.length - 1
    s[c][s[c].length - 1] += 0.7000000000000001
  }
  ;(n.strict || (r += '/?'), n.end ? (r += '$') : n.strict && (r += '(?:/|$)'))
  const a = new RegExp(r, n.sensitive ? '' : 'i')
  function i(c) {
    const d = c.match(a),
      m = {}
    if (!d) return null
    for (let h = 1; h < d.length; h++) {
      const E = d[h] || '',
        y = o[h - 1]
      m[y.name] = E && y.repeatable ? E.split('/') : E
    }
    return m
  }
  function u(c) {
    let d = '',
      m = !1
    for (const h of e) {
      ;((!m || !d.endsWith('/')) && (d += '/'), (m = !1))
      for (const E of h)
        if (E.type === 0) d += E.value
        else if (E.type === 1) {
          const { value: y, repeatable: v, optional: I } = E,
            b = y in c ? c[y] : ''
          if (fn(b) && !v)
            throw new Error(`Provided param "${y}" is an array but it is not repeatable (* or + modifiers)`)
          const O = fn(b) ? b.join('/') : b
          if (!O)
            if (I) h.length < 2 && (d.endsWith('/') ? (d = d.slice(0, -1)) : (m = !0))
            else throw new Error(`Missing required param "${y}"`)
          d += O
        }
    }
    return d || '/'
  }
  return { re: a, score: s, keys: o, parse: i, stringify: u }
}
function hR(e, t) {
  let n = 0
  for (; n < e.length && n < t.length; ) {
    const s = t[n] - e[n]
    if (s) return s
    n++
  }
  return e.length < t.length
    ? e.length === 1 && e[0] === 80
      ? -1
      : 1
    : e.length > t.length
      ? t.length === 1 && t[0] === 80
        ? 1
        : -1
      : 0
}
function gR(e, t) {
  let n = 0
  const s = e.score,
    r = t.score
  for (; n < s.length && n < r.length; ) {
    const o = hR(s[n], r[n])
    if (o) return o
    n++
  }
  if (Math.abs(r.length - s.length) === 1) {
    if (cd(s)) return 1
    if (cd(r)) return -1
  }
  return r.length - s.length
}
function cd(e) {
  const t = e[e.length - 1]
  return e.length > 0 && t[t.length - 1] < 0
}
const pR = { type: 0, value: '' },
  ER = /[a-zA-Z0-9_]/
function _R(e) {
  if (!e) return [[]]
  if (e === '/') return [[pR]]
  if (!e.startsWith('/')) throw new Error(`Invalid path "${e}"`)
  function t(E) {
    throw new Error(`ERR (${n})/"${c}": ${E}`)
  }
  let n = 0,
    s = n
  const r = []
  let o
  function a() {
    ;(o && r.push(o), (o = []))
  }
  let i = 0,
    u,
    c = '',
    d = ''
  function m() {
    c &&
      (n === 0
        ? o.push({ type: 0, value: c })
        : n === 1 || n === 2 || n === 3
          ? (o.length > 1 &&
              (u === '*' || u === '+') &&
              t(`A repeatable param (${c}) must be alone in its segment. eg: '/:ids+.`),
            o.push({
              type: 1,
              value: c,
              regexp: d,
              repeatable: u === '*' || u === '+',
              optional: u === '*' || u === '?'
            }))
          : t('Invalid state to consume buffer'),
      (c = ''))
  }
  function h() {
    c += u
  }
  for (; i < e.length; ) {
    if (((u = e[i++]), u === '\\' && n !== 2)) {
      ;((s = n), (n = 4))
      continue
    }
    switch (n) {
      case 0:
        u === '/' ? (c && m(), a()) : u === ':' ? (m(), (n = 1)) : h()
        break
      case 4:
        ;(h(), (n = s))
        break
      case 1:
        u === '(' ? (n = 2) : ER.test(u) ? h() : (m(), (n = 0), u !== '*' && u !== '?' && u !== '+' && i--)
        break
      case 2:
        u === ')' ? (d[d.length - 1] == '\\' ? (d = d.slice(0, -1) + u) : (n = 3)) : (d += u)
        break
      case 3:
        ;(m(), (n = 0), u !== '*' && u !== '?' && u !== '+' && i--, (d = ''))
        break
      default:
        t('Unknown state')
        break
    }
  }
  return (n === 2 && t(`Unfinished custom RegExp for param "${c}"`), m(), a(), r)
}
function yR(e, t, n) {
  const s = mR(_R(e.path), n),
    r = Ze(s, { record: e, parent: t, children: [], alias: [] })
  return (t && !r.record.aliasOf == !t.record.aliasOf && t.children.push(r), r)
}
function vR(e, t) {
  const n = [],
    s = new Map()
  t = md({ strict: !1, end: !0, sensitive: !1 }, t)
  function r(d) {
    return s.get(d)
  }
  function o(d, m, h) {
    const E = !h,
      y = bR(d)
    y.aliasOf = h && h.record
    const v = md(t, d),
      I = [y]
    if ('alias' in d) {
      const P = typeof d.alias == 'string' ? [d.alias] : d.alias
      for (const T of P)
        I.push(Ze({}, y, { components: h ? h.record.components : y.components, path: T, aliasOf: h ? h.record : y }))
    }
    let b, O
    for (const P of I) {
      const { path: T } = P
      if (m && T[0] !== '/') {
        const $ = m.record.path,
          L = $[$.length - 1] === '/' ? '' : '/'
        P.path = m.record.path + (T && L + T)
      }
      if (
        ((b = yR(P, m, v)),
        h ? h.alias.push(b) : ((O = O || b), O !== b && O.alias.push(b), E && d.name && !fd(b) && a(d.name)),
        y.children)
      ) {
        const $ = y.children
        for (let L = 0; L < $.length; L++) o($[L], b, h && h.children[L])
      }
      ;((h = h || b),
        ((b.record.components && Object.keys(b.record.components).length) || b.record.name || b.record.redirect) &&
          u(b))
    }
    return O
      ? () => {
          a(O)
        }
      : Pr
  }
  function a(d) {
    if (Vh(d)) {
      const m = s.get(d)
      m && (s.delete(d), n.splice(n.indexOf(m), 1), m.children.forEach(a), m.alias.forEach(a))
    } else {
      const m = n.indexOf(d)
      m > -1 && (n.splice(m, 1), d.record.name && s.delete(d.record.name), d.children.forEach(a), d.alias.forEach(a))
    }
  }
  function i() {
    return n
  }
  function u(d) {
    let m = 0
    for (; m < n.length && gR(d, n[m]) >= 0 && (d.record.path !== n[m].record.path || !Bh(d, n[m])); ) m++
    ;(n.splice(m, 0, d), d.record.name && !fd(d) && s.set(d.record.name, d))
  }
  function c(d, m) {
    let h,
      E = {},
      y,
      v
    if ('name' in d && d.name) {
      if (((h = s.get(d.name)), !h)) throw rr(1, { location: d })
      ;((v = h.record.name),
        (E = Ze(
          dd(
            m.params,
            h.keys
              .filter(O => !O.optional)
              .concat(h.parent ? h.parent.keys.filter(O => O.optional) : [])
              .map(O => O.name)
          ),
          d.params &&
            dd(
              d.params,
              h.keys.map(O => O.name)
            )
        )),
        (y = h.stringify(E)))
    } else if (d.path != null)
      ((y = d.path), (h = n.find(O => O.re.test(y))), h && ((E = h.parse(y)), (v = h.record.name)))
    else {
      if (((h = m.name ? s.get(m.name) : n.find(O => O.re.test(m.path))), !h))
        throw rr(1, { location: d, currentLocation: m })
      ;((v = h.record.name), (E = Ze({}, m.params, d.params)), (y = h.stringify(E)))
    }
    const I = []
    let b = h
    for (; b; ) (I.unshift(b.record), (b = b.parent))
    return { name: v, path: y, params: E, matched: I, meta: RR(I) }
  }
  return (e.forEach(d => o(d)), { addRoute: o, resolve: c, removeRoute: a, getRoutes: i, getRecordMatcher: r })
}
function dd(e, t) {
  const n = {}
  for (const s of t) s in e && (n[s] = e[s])
  return n
}
function bR(e) {
  return {
    path: e.path,
    redirect: e.redirect,
    name: e.name,
    meta: e.meta || {},
    aliasOf: void 0,
    beforeEnter: e.beforeEnter,
    props: SR(e),
    children: e.children || [],
    instances: {},
    leaveGuards: new Set(),
    updateGuards: new Set(),
    enterCallbacks: {},
    components: 'components' in e ? e.components || null : e.component && { default: e.component }
  }
}
function SR(e) {
  const t = {},
    n = e.props || !1
  if ('component' in e) t.default = n
  else for (const s in e.components) t[s] = typeof n == 'object' ? n[s] : n
  return t
}
function fd(e) {
  for (; e; ) {
    if (e.record.aliasOf) return !0
    e = e.parent
  }
  return !1
}
function RR(e) {
  return e.reduce((t, n) => Ze(t, n.meta), {})
}
function md(e, t) {
  const n = {}
  for (const s in e) n[s] = s in t ? t[s] : e[s]
  return n
}
function Bh(e, t) {
  return t.children.some(n => n === e || Bh(e, n))
}
function OR(e) {
  const t = {}
  if (e === '' || e === '?') return t
  const s = (e[0] === '?' ? e.slice(1) : e).split('&')
  for (let r = 0; r < s.length; ++r) {
    const o = s[r].replace(Ph, ' '),
      a = o.indexOf('='),
      i = Xr(a < 0 ? o : o.slice(0, a)),
      u = a < 0 ? null : Xr(o.slice(a + 1))
    if (i in t) {
      let c = t[i]
      ;(fn(c) || (c = t[i] = [c]), c.push(u))
    } else t[i] = u
  }
  return t
}
function hd(e) {
  let t = ''
  for (let n in e) {
    const s = e[n]
    if (((n = HS(n)), s == null)) {
      s !== void 0 && (t += (t.length ? '&' : '') + n)
      continue
    }
    ;(fn(s) ? s.map(o => o && Ji(o)) : [s && Ji(s)]).forEach(o => {
      o !== void 0 && ((t += (t.length ? '&' : '') + n), o != null && (t += '=' + o))
    })
  }
  return t
}
function CR(e) {
  const t = {}
  for (const n in e) {
    const s = e[n]
    s !== void 0 && (t[n] = fn(s) ? s.map(r => (r == null ? null : '' + r)) : s == null ? s : '' + s)
  }
  return t
}
const AR = Symbol(''),
  gd = Symbol(''),
  tu = Symbol(''),
  Uh = Symbol(''),
  Zi = Symbol('')
function Rr() {
  let e = []
  function t(s) {
    return (
      e.push(s),
      () => {
        const r = e.indexOf(s)
        r > -1 && e.splice(r, 1)
      }
    )
  }
  function n() {
    e = []
  }
  return { add: t, list: () => e.slice(), reset: n }
}
function Zn(e, t, n, s, r, o = a => a()) {
  const a = s && (s.enterCallbacks[r] = s.enterCallbacks[r] || [])
  return () =>
    new Promise((i, u) => {
      const c = h => {
          h === !1
            ? u(rr(4, { from: n, to: t }))
            : h instanceof Error
              ? u(h)
              : cR(h)
                ? u(rr(2, { from: t, to: h }))
                : (a && s.enterCallbacks[r] === a && typeof h == 'function' && a.push(h), i())
        },
        d = o(() => e.call(s && s.instances[r], t, n, c))
      let m = Promise.resolve(d)
      ;(e.length < 3 && (m = m.then(c)), m.catch(h => u(h)))
    })
}
function fi(e, t, n, s, r = o => o()) {
  const o = []
  for (const a of e)
    for (const i in a.components) {
      let u = a.components[i]
      if (!(t !== 'beforeRouteEnter' && !a.instances[i]))
        if (IR(u)) {
          const d = (u.__vccOpts || u)[t]
          d && o.push(Zn(d, n, s, a, i, r))
        } else {
          let c = u()
          o.push(() =>
            c.then(d => {
              if (!d) return Promise.reject(new Error(`Couldn't resolve component "${i}" at "${a.path}"`))
              const m = $S(d) ? d.default : d
              a.components[i] = m
              const E = (m.__vccOpts || m)[t]
              return E && Zn(E, n, s, a, i, r)()
            })
          )
        }
    }
  return o
}
function IR(e) {
  return typeof e == 'object' || 'displayName' in e || 'props' in e || '__vccOpts' in e
}
function pd(e) {
  const t = it(tu),
    n = it(Uh),
    s = M(() => t.resolve(Dt(e.to))),
    r = M(() => {
      const { matched: u } = s.value,
        { length: c } = u,
        d = u[c - 1],
        m = n.matched
      if (!d || !m.length) return -1
      const h = m.findIndex(sr.bind(null, d))
      if (h > -1) return h
      const E = Ed(u[c - 2])
      return c > 1 && Ed(d) === E && m[m.length - 1].path !== E ? m.findIndex(sr.bind(null, u[c - 2])) : h
    }),
    o = M(() => r.value > -1 && LR(n.params, s.value.params)),
    a = M(() => r.value > -1 && r.value === n.matched.length - 1 && Dh(n.params, s.value.params))
  function i(u = {}) {
    return wR(u) ? t[Dt(e.replace) ? 'replace' : 'push'](Dt(e.to)).catch(Pr) : Promise.resolve()
  }
  return { route: s, href: M(() => s.value.href), isActive: o, isExactActive: a, navigate: i }
}
const TR = Ee({
    name: 'RouterLink',
    compatConfig: { MODE: 3 },
    props: {
      to: { type: [String, Object], required: !0 },
      replace: Boolean,
      activeClass: String,
      exactActiveClass: String,
      custom: Boolean,
      ariaCurrentValue: { type: String, default: 'page' }
    },
    useLink: pd,
    setup(e, { slots: t }) {
      const n = At(pd(e)),
        { options: s } = it(tu),
        r = M(() => ({
          [_d(e.activeClass, s.linkActiveClass, 'router-link-active')]: n.isActive,
          [_d(e.exactActiveClass, s.linkExactActiveClass, 'router-link-exact-active')]: n.isExactActive
        }))
      return () => {
        const o = t.default && t.default(n)
        return e.custom
          ? o
          : Rn(
              'a',
              {
                'aria-current': n.isExactActive ? e.ariaCurrentValue : null,
                href: n.href,
                onClick: n.navigate,
                class: r.value
              },
              o
            )
      }
    }
  }),
  NR = TR
function wR(e) {
  if (
    !(e.metaKey || e.altKey || e.ctrlKey || e.shiftKey) &&
    !e.defaultPrevented &&
    !(e.button !== void 0 && e.button !== 0)
  ) {
    if (e.currentTarget && e.currentTarget.getAttribute) {
      const t = e.currentTarget.getAttribute('target')
      if (/\b_blank\b/i.test(t)) return
    }
    return (e.preventDefault && e.preventDefault(), !0)
  }
}
function LR(e, t) {
  for (const n in t) {
    const s = t[n],
      r = e[n]
    if (typeof s == 'string') {
      if (s !== r) return !1
    } else if (!fn(r) || r.length !== s.length || s.some((o, a) => o !== r[a])) return !1
  }
  return !0
}
function Ed(e) {
  return e ? (e.aliasOf ? e.aliasOf.path : e.path) : ''
}
const _d = (e, t, n) => e ?? t ?? n,
  PR = Ee({
    name: 'RouterView',
    inheritAttrs: !1,
    props: { name: { type: String, default: 'default' }, route: Object },
    compatConfig: { MODE: 3 },
    setup(e, { attrs: t, slots: n }) {
      const s = it(Zi),
        r = M(() => e.route || s.value),
        o = it(gd, 0),
        a = M(() => {
          let c = Dt(o)
          const { matched: d } = r.value
          let m
          for (; (m = d[c]) && !m.components; ) c++
          return c
        }),
        i = M(() => r.value.matched[a.value])
      ;(Ut(
        gd,
        M(() => a.value + 1)
      ),
        Ut(AR, i),
        Ut(Zi, r))
      const u = _e()
      return (
        be(
          () => [u.value, i.value, e.name],
          ([c, d, m], [h, E, y]) => {
            ;(d &&
              ((d.instances[m] = c),
              E &&
                E !== d &&
                c &&
                c === h &&
                (d.leaveGuards.size || (d.leaveGuards = E.leaveGuards),
                d.updateGuards.size || (d.updateGuards = E.updateGuards))),
              c && d && (!E || !sr(d, E) || !h) && (d.enterCallbacks[m] || []).forEach(v => v(c)))
          },
          { flush: 'post' }
        ),
        () => {
          const c = r.value,
            d = e.name,
            m = i.value,
            h = m && m.components[d]
          if (!h) return yd(n.default, { Component: h, route: c })
          const E = m.props[d],
            y = E ? (E === !0 ? c.params : typeof E == 'function' ? E(c) : E) : null,
            I = Rn(
              h,
              Ze({}, y, t, {
                onVnodeUnmounted: b => {
                  b.component.isUnmounted && (m.instances[d] = null)
                },
                ref: u
              })
            )
          return yd(n.default, { Component: I, route: c }) || I
        }
      )
    }
  })
function yd(e, t) {
  if (!e) return null
  const n = e(t)
  return n.length === 1 ? n[0] : n
}
const $R = PR
function MR(e) {
  const t = vR(e.routes, e),
    n = e.parseQuery || OR,
    s = e.stringifyQuery || hd,
    r = e.history,
    o = Rr(),
    a = Rr(),
    i = Rr(),
    u = je(Yn)
  let c = Yn
  Us && e.scrollBehavior && 'scrollRestoration' in history && (history.scrollRestoration = 'manual')
  const d = ci.bind(null, H => '' + H),
    m = ci.bind(null, YS),
    h = ci.bind(null, Xr)
  function E(H, ne) {
    let Q, le
    return (Vh(H) ? ((Q = t.getRecordMatcher(H)), (le = ne)) : (le = H), t.addRoute(le, Q))
  }
  function y(H) {
    const ne = t.getRecordMatcher(H)
    ne && t.removeRoute(ne)
  }
  function v() {
    return t.getRoutes().map(H => H.record)
  }
  function I(H) {
    return !!t.getRecordMatcher(H)
  }
  function b(H, ne) {
    if (((ne = Ze({}, ne || u.value)), typeof H == 'string')) {
      const g = di(n, H, ne.path),
        R = t.resolve({ path: g.path }, ne),
        k = r.createHref(g.fullPath)
      return Ze(g, R, { params: h(R.params), hash: Xr(g.hash), redirectedFrom: void 0, href: k })
    }
    let Q
    if (H.path != null) Q = Ze({}, H, { path: di(n, H.path, ne.path).path })
    else {
      const g = Ze({}, H.params)
      for (const R in g) g[R] == null && delete g[R]
      ;((Q = Ze({}, H, { params: m(g) })), (ne.params = m(ne.params)))
    }
    const le = t.resolve(Q, ne),
      Pe = H.hash || ''
    le.params = d(h(le.params))
    const Xe = zS(s, Ze({}, H, { hash: WS(Pe), path: le.path })),
      p = r.createHref(Xe)
    return Ze({ fullPath: Xe, hash: Pe, query: s === hd ? CR(H.query) : H.query || {} }, le, {
      redirectedFrom: void 0,
      href: p
    })
  }
  function O(H) {
    return typeof H == 'string' ? di(n, H, u.value.path) : Ze({}, H)
  }
  function P(H, ne) {
    if (c !== H) return rr(8, { from: ne, to: H })
  }
  function T(H) {
    return N(H)
  }
  function $(H) {
    return T(Ze(O(H), { replace: !0 }))
  }
  function L(H) {
    const ne = H.matched[H.matched.length - 1]
    if (ne && ne.redirect) {
      const { redirect: Q } = ne
      let le = typeof Q == 'function' ? Q(H) : Q
      return (
        typeof le == 'string' &&
          ((le = le.includes('?') || le.includes('#') ? (le = O(le)) : { path: le }), (le.params = {})),
        Ze({ query: H.query, hash: H.hash, params: le.path != null ? {} : H.params }, le)
      )
    }
  }
  function N(H, ne) {
    const Q = (c = b(H)),
      le = u.value,
      Pe = H.state,
      Xe = H.force,
      p = H.replace === !0,
      g = L(Q)
    if (g)
      return N(Ze(O(g), { state: typeof g == 'object' ? Ze({}, Pe, g.state) : Pe, force: Xe, replace: p }), ne || Q)
    const R = Q
    R.redirectedFrom = ne
    let k
    return (
      !Xe && XS(s, le, Q) && ((k = rr(16, { to: R, from: le })), Ie(le, le, !0, !1)),
      (k ? Promise.resolve(k) : B(R, le))
        .catch(V => (wn(V) ? (wn(V, 2) ? V : ze(V)) : ce(V, R, le)))
        .then(V => {
          if (V) {
            if (wn(V, 2))
              return N(
                Ze({ replace: p }, O(V.to), {
                  state: typeof V.to == 'object' ? Ze({}, Pe, V.to.state) : Pe,
                  force: Xe
                }),
                ne || R
              )
          } else V = D(R, le, !0, p, Pe)
          return (j(R, le, V), V)
        })
    )
  }
  function A(H, ne) {
    const Q = P(H, ne)
    return Q ? Promise.reject(Q) : Promise.resolve()
  }
  function w(H) {
    const ne = et.values().next().value
    return ne && typeof ne.runWithContext == 'function' ? ne.runWithContext(H) : H()
  }
  function B(H, ne) {
    let Q
    const [le, Pe, Xe] = kR(H, ne)
    Q = fi(le.reverse(), 'beforeRouteLeave', H, ne)
    for (const g of le)
      g.leaveGuards.forEach(R => {
        Q.push(Zn(R, H, ne))
      })
    const p = A.bind(null, H, ne)
    return (
      Q.push(p),
      Fe(Q)
        .then(() => {
          Q = []
          for (const g of o.list()) Q.push(Zn(g, H, ne))
          return (Q.push(p), Fe(Q))
        })
        .then(() => {
          Q = fi(Pe, 'beforeRouteUpdate', H, ne)
          for (const g of Pe)
            g.updateGuards.forEach(R => {
              Q.push(Zn(R, H, ne))
            })
          return (Q.push(p), Fe(Q))
        })
        .then(() => {
          Q = []
          for (const g of Xe)
            if (g.beforeEnter)
              if (fn(g.beforeEnter)) for (const R of g.beforeEnter) Q.push(Zn(R, H, ne))
              else Q.push(Zn(g.beforeEnter, H, ne))
          return (Q.push(p), Fe(Q))
        })
        .then(
          () => (
            H.matched.forEach(g => (g.enterCallbacks = {})),
            (Q = fi(Xe, 'beforeRouteEnter', H, ne, w)),
            Q.push(p),
            Fe(Q)
          )
        )
        .then(() => {
          Q = []
          for (const g of a.list()) Q.push(Zn(g, H, ne))
          return (Q.push(p), Fe(Q))
        })
        .catch(g => (wn(g, 8) ? g : Promise.reject(g)))
    )
  }
  function j(H, ne, Q) {
    i.list().forEach(le => w(() => le(H, ne, Q)))
  }
  function D(H, ne, Q, le, Pe) {
    const Xe = P(H, ne)
    if (Xe) return Xe
    const p = ne === Yn,
      g = Us ? history.state : {}
    ;(Q && (le || p ? r.replace(H.fullPath, Ze({ scroll: p && g && g.scroll }, Pe)) : r.push(H.fullPath, Pe)),
      (u.value = H),
      Ie(H, ne, Q, p),
      ze())
  }
  let U
  function X() {
    U ||
      (U = r.listen((H, ne, Q) => {
        if (!bt.listening) return
        const le = b(H),
          Pe = L(le)
        if (Pe) {
          N(Ze(Pe, { replace: !0 }), le).catch(Pr)
          return
        }
        c = le
        const Xe = u.value
        ;(Us && rR(ad(Xe.fullPath, Q.delta), Fa()),
          B(le, Xe)
            .catch(p =>
              wn(p, 12)
                ? p
                : wn(p, 2)
                  ? (N(p.to, le)
                      .then(g => {
                        wn(g, 20) && !Q.delta && Q.type === Jr.pop && r.go(-1, !1)
                      })
                      .catch(Pr),
                    Promise.reject())
                  : (Q.delta && r.go(-Q.delta, !1), ce(p, le, Xe))
            )
            .then(p => {
              ;((p = p || D(le, Xe, !1)),
                p && (Q.delta && !wn(p, 8) ? r.go(-Q.delta, !1) : Q.type === Jr.pop && wn(p, 20) && r.go(-1, !1)),
                j(le, Xe, p))
            })
            .catch(Pr))
      }))
  }
  let ge = Rr(),
    te = Rr(),
    fe
  function ce(H, ne, Q) {
    ze(H)
    const le = te.list()
    return (le.length ? le.forEach(Pe => Pe(H, ne, Q)) : console.error(H), Promise.reject(H))
  }
  function ke() {
    return fe && u.value !== Yn
      ? Promise.resolve()
      : new Promise((H, ne) => {
          ge.add([H, ne])
        })
  }
  function ze(H) {
    return (fe || ((fe = !H), X(), ge.list().forEach(([ne, Q]) => (H ? Q(H) : ne())), ge.reset()), H)
  }
  function Ie(H, ne, Q, le) {
    const { scrollBehavior: Pe } = e
    if (!Us || !Pe) return Promise.resolve()
    const Xe = (!Q && oR(ad(H.fullPath, 0))) || ((le || !Q) && history.state && history.state.scroll) || null
    return Et()
      .then(() => Pe(H, ne, Xe))
      .then(p => p && sR(p))
      .catch(p => ce(p, H, ne))
  }
  const xe = H => r.go(H)
  let Le
  const et = new Set(),
    bt = {
      currentRoute: u,
      listening: !0,
      addRoute: E,
      removeRoute: y,
      hasRoute: I,
      getRoutes: v,
      resolve: b,
      options: e,
      push: T,
      replace: $,
      go: xe,
      back: () => xe(-1),
      forward: () => xe(1),
      beforeEach: o.add,
      beforeResolve: a.add,
      afterEach: i.add,
      onError: te.add,
      isReady: ke,
      install(H) {
        const ne = this
        ;(H.component('RouterLink', NR),
          H.component('RouterView', $R),
          (H.config.globalProperties.$router = ne),
          Object.defineProperty(H.config.globalProperties, '$route', { enumerable: !0, get: () => Dt(u) }),
          Us && !Le && u.value === Yn && ((Le = !0), T(r.location).catch(Pe => {})))
        const Q = {}
        for (const Pe in Yn) Object.defineProperty(Q, Pe, { get: () => u.value[Pe], enumerable: !0 })
        ;(H.provide(tu, ne), H.provide(Uh, Gf(Q)), H.provide(Zi, u))
        const le = H.unmount
        ;(et.add(H),
          (H.unmount = function () {
            ;(et.delete(H), et.size < 1 && ((c = Yn), U && U(), (U = null), (u.value = Yn), (Le = !1), (fe = !1)), le())
          }))
      }
    }
  function Fe(H) {
    return H.reduce((ne, Q) => ne.then(() => w(Q)), Promise.resolve())
  }
  return bt
}
function kR(e, t) {
  const n = [],
    s = [],
    r = [],
    o = Math.max(t.matched.length, e.matched.length)
  for (let a = 0; a < o; a++) {
    const i = t.matched[a]
    i && (e.matched.find(c => sr(c, i)) ? s.push(i) : n.push(i))
    const u = e.matched[a]
    u && (t.matched.find(c => sr(c, u)) || r.push(u))
  }
  return [n, s, r]
}
const ut = typeof window < 'u',
  nu = ut && 'IntersectionObserver' in window,
  DR = ut && ('ontouchstart' in window || window.navigator.maxTouchPoints > 0)
function FR(e, t, n) {
  const s = t.length - 1
  if (s < 0) return e === void 0 ? n : e
  for (let r = 0; r < s; r++) {
    if (e == null) return n
    e = e[t[r]]
  }
  return e == null || e[t[s]] === void 0 ? n : e[t[s]]
}
function Va(e, t) {
  if (e === t) return !0
  if ((e instanceof Date && t instanceof Date && e.getTime() !== t.getTime()) || e !== Object(e) || t !== Object(t))
    return !1
  const n = Object.keys(e)
  return n.length !== Object.keys(t).length ? !1 : n.every(s => Va(e[s], t[s]))
}
function vd(e, t, n) {
  return e == null || !t || typeof t != 'string'
    ? n
    : e[t] !== void 0
      ? e[t]
      : ((t = t.replace(/\[(\w+)\]/g, '.$1')), (t = t.replace(/^\./, '')), FR(e, t.split('.'), n))
}
function Ws(e) {
  let t = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : 0
  return Array.from({ length: e }, (n, s) => t + s)
}
function Te(e) {
  let t = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : 'px'
  if (!(e == null || e === '')) return isNaN(+e) ? String(e) : isFinite(+e) ? `${Number(e)}${t}` : void 0
}
function el(e) {
  return e !== null && typeof e == 'object' && !Array.isArray(e)
}
function Qr(e) {
  if (e && '$el' in e) {
    const t = e.$el
    return (t == null ? void 0 : t.nodeType) === Node.TEXT_NODE ? t.nextElementSibling : t
  }
  return e
}
const bd = Object.freeze({
    enter: 13,
    tab: 9,
    delete: 46,
    esc: 27,
    space: 32,
    up: 38,
    down: 40,
    left: 37,
    right: 39,
    end: 35,
    home: 36,
    del: 46,
    backspace: 8,
    insert: 45,
    pageup: 33,
    pagedown: 34,
    shift: 16
  }),
  Sd = Object.freeze({
    enter: 'Enter',
    tab: 'Tab',
    delete: 'Delete',
    esc: 'Escape',
    space: 'Space',
    up: 'ArrowUp',
    down: 'ArrowDown',
    left: 'ArrowLeft',
    right: 'ArrowRight',
    end: 'End',
    home: 'Home',
    del: 'Delete',
    backspace: 'Backspace',
    insert: 'Insert',
    pageup: 'PageUp',
    pagedown: 'PageDown',
    shift: 'Shift'
  })
function mi(e, t) {
  return t.every(n => e.hasOwnProperty(n))
}
function Gh(e, t) {
  const n = {},
    s = new Set(Object.keys(e))
  for (const r of t) s.has(r) && (n[r] = e[r])
  return n
}
function Rd(e, t, n) {
  const s = Object.create(null),
    r = Object.create(null)
  for (const o in e)
    t.some(a => (a instanceof RegExp ? a.test(o) : a === o)) && !(n != null && n.some(a => a === o))
      ? (s[o] = e[o])
      : (r[o] = e[o])
  return [s, r]
}
function su(e, t) {
  const n = { ...e }
  return (t.forEach(s => delete n[s]), n)
}
function VR(e, t) {
  const n = {}
  return (t.forEach(s => (n[s] = e[s])), n)
}
const Wh = /^on[^a-z]/,
  ru = e => Wh.test(e),
  xR = [
    'onAfterscriptexecute',
    'onAnimationcancel',
    'onAnimationend',
    'onAnimationiteration',
    'onAnimationstart',
    'onAuxclick',
    'onBeforeinput',
    'onBeforescriptexecute',
    'onChange',
    'onClick',
    'onCompositionend',
    'onCompositionstart',
    'onCompositionupdate',
    'onContextmenu',
    'onCopy',
    'onCut',
    'onDblclick',
    'onFocusin',
    'onFocusout',
    'onFullscreenchange',
    'onFullscreenerror',
    'onGesturechange',
    'onGestureend',
    'onGesturestart',
    'onGotpointercapture',
    'onInput',
    'onKeydown',
    'onKeypress',
    'onKeyup',
    'onLostpointercapture',
    'onMousedown',
    'onMousemove',
    'onMouseout',
    'onMouseover',
    'onMouseup',
    'onMousewheel',
    'onPaste',
    'onPointercancel',
    'onPointerdown',
    'onPointerenter',
    'onPointerleave',
    'onPointermove',
    'onPointerout',
    'onPointerover',
    'onPointerup',
    'onReset',
    'onSelect',
    'onSubmit',
    'onTouchcancel',
    'onTouchend',
    'onTouchmove',
    'onTouchstart',
    'onTransitioncancel',
    'onTransitionend',
    'onTransitionrun',
    'onTransitionstart',
    'onWheel'
  ]
function xa(e) {
  const [t, n] = Rd(e, [Wh]),
    s = su(t, xR),
    [r, o] = Rd(n, ['class', 'style', 'id', /^data-/])
  return (Object.assign(r, t), Object.assign(o, s), [r, o])
}
function ss(e) {
  return e == null ? [] : Array.isArray(e) ? e : [e]
}
function tl(e) {
  let t = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : 0,
    n = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : 1
  return Math.max(t, Math.min(n, e))
}
function Od(e, t) {
  let n = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : '0'
  return e + n.repeat(Math.max(0, t - e.length))
}
function Cd(e, t) {
  return (arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : '0').repeat(Math.max(0, t - e.length)) + e
}
function BR(e) {
  let t = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : 1
  const n = []
  let s = 0
  for (; s < e.length; ) (n.push(e.substr(s, t)), (s += t))
  return n
}
function Xt() {
  let e = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : {},
    t = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {},
    n = arguments.length > 2 ? arguments[2] : void 0
  const s = {}
  for (const r in e) s[r] = e[r]
  for (const r in t) {
    const o = e[r],
      a = t[r]
    if (el(o) && el(a)) {
      s[r] = Xt(o, a, n)
      continue
    }
    if (Array.isArray(o) && Array.isArray(a) && n) {
      s[r] = n(o, a)
      continue
    }
    s[r] = a
  }
  return s
}
function Hh(e) {
  return e.map(t => (t.type === Ue ? Hh(t.children) : t)).flat()
}
function Os() {
  let e = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : ''
  if (Os.cache.has(e)) return Os.cache.get(e)
  const t = e
    .replace(/[^a-z]/gi, '-')
    .replace(/\B([A-Z])/g, '-$1')
    .toLowerCase()
  return (Os.cache.set(e, t), t)
}
Os.cache = new Map()
function Mr(e, t) {
  if (!t || typeof t != 'object') return []
  if (Array.isArray(t)) return t.map(n => Mr(e, n)).flat(1)
  if (Array.isArray(t.children)) return t.children.map(n => Mr(e, n)).flat(1)
  if (t.component) {
    if (Object.getOwnPropertySymbols(t.component.provides).includes(e)) return [t.component]
    if (t.component.subTree) return Mr(e, t.component.subTree).flat(1)
  }
  return []
}
function ou(e) {
  const t = At({}),
    n = M(e)
  return (
    ls(
      () => {
        for (const s in n.value) t[s] = n.value[s]
      },
      { flush: 'sync' }
    ),
    _a(t)
  )
}
function ta(e, t) {
  return e.includes(t)
}
function jh(e) {
  return e[2].toLowerCase() + e.slice(3)
}
const Cs = () => [Function, Array]
function Ad(e, t) {
  return (
    (t = 'on' + ur(t)),
    !!(e[t] || e[`${t}Once`] || e[`${t}Capture`] || e[`${t}OnceCapture`] || e[`${t}CaptureOnce`])
  )
}
function UR(e) {
  for (var t = arguments.length, n = new Array(t > 1 ? t - 1 : 0), s = 1; s < t; s++) n[s - 1] = arguments[s]
  if (Array.isArray(e)) for (const r of e) r(...n)
  else typeof e == 'function' && e(...n)
}
function Yh(e) {
  let t = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : !0
  const n = ['button', '[href]', 'input:not([type="hidden"])', 'select', 'textarea', '[tabindex]']
    .map(s => `${s}${t ? ':not([tabindex="-1"])' : ''}:not([disabled])`)
    .join(', ')
  return [...e.querySelectorAll(n)]
}
function GR(e, t, n) {
  let s,
    r = e.indexOf(document.activeElement)
  const o = t === 'next' ? 1 : -1
  do ((r += o), (s = e[r]))
  while ((!s || s.offsetParent == null || !((n == null ? void 0 : n(s)) ?? !0)) && r < e.length && r >= 0)
  return s
}
function nl(e, t) {
  var s, r, o, a
  const n = Yh(e)
  if (!t) (e === document.activeElement || !e.contains(document.activeElement)) && ((s = n[0]) == null || s.focus())
  else if (t === 'first') (r = n[0]) == null || r.focus()
  else if (t === 'last') (o = n.at(-1)) == null || o.focus()
  else if (typeof t == 'number') (a = n[t]) == null || a.focus()
  else {
    const i = GR(n, t)
    i ? i.focus() : nl(e, t === 'next' ? 'first' : 'last')
  }
}
function Kh(e, t) {
  if (!(ut && typeof CSS < 'u' && typeof CSS.supports < 'u' && CSS.supports(`selector(${t})`))) return null
  try {
    return !!e && e.matches(t)
  } catch {
    return null
  }
}
function WR(e, t) {
  if (!ut || e === 0) return (t(), () => {})
  const n = window.setTimeout(t, e)
  return () => window.clearTimeout(n)
}
const qh = ['top', 'bottom'],
  HR = ['start', 'end', 'left', 'right']
function sl(e, t) {
  let [n, s] = e.split(' ')
  return (s || (s = ta(qh, n) ? 'start' : ta(HR, n) ? 'top' : 'center'), { side: Id(n, t), align: Id(s, t) })
}
function Id(e, t) {
  return e === 'start' ? (t ? 'right' : 'left') : e === 'end' ? (t ? 'left' : 'right') : e
}
function hi(e) {
  return {
    side: { center: 'center', top: 'bottom', bottom: 'top', left: 'right', right: 'left' }[e.side],
    align: e.align
  }
}
function gi(e) {
  return {
    side: e.side,
    align: { center: 'center', top: 'bottom', bottom: 'top', left: 'right', right: 'left' }[e.align]
  }
}
function Td(e) {
  return { side: e.align, align: e.side }
}
function Nd(e) {
  return ta(qh, e.side) ? 'y' : 'x'
}
class As {
  constructor(t) {
    let { x: n, y: s, width: r, height: o } = t
    ;((this.x = n), (this.y = s), (this.width = r), (this.height = o))
  }
  get top() {
    return this.y
  }
  get bottom() {
    return this.y + this.height
  }
  get left() {
    return this.x
  }
  get right() {
    return this.x + this.width
  }
}
function wd(e, t) {
  return {
    x: { before: Math.max(0, t.left - e.left), after: Math.max(0, e.right - t.right) },
    y: { before: Math.max(0, t.top - e.top), after: Math.max(0, e.bottom - t.bottom) }
  }
}
function zh(e) {
  return Array.isArray(e) ? new As({ x: e[0], y: e[1], width: 0, height: 0 }) : e.getBoundingClientRect()
}
function au(e) {
  const t = e.getBoundingClientRect(),
    n = getComputedStyle(e),
    s = n.transform
  if (s) {
    let r, o, a, i, u
    if (s.startsWith('matrix3d('))
      ((r = s.slice(9, -1).split(/, /)), (o = +r[0]), (a = +r[5]), (i = +r[12]), (u = +r[13]))
    else if (s.startsWith('matrix('))
      ((r = s.slice(7, -1).split(/, /)), (o = +r[0]), (a = +r[3]), (i = +r[4]), (u = +r[5]))
    else return new As(t)
    const c = n.transformOrigin,
      d = t.x - i - (1 - o) * parseFloat(c),
      m = t.y - u - (1 - a) * parseFloat(c.slice(c.indexOf(' ') + 1)),
      h = o ? t.width / o : e.offsetWidth + 1,
      E = a ? t.height / a : e.offsetHeight + 1
    return new As({ x: d, y: m, width: h, height: E })
  } else return new As(t)
}
function Hs(e, t, n) {
  if (typeof e.animate > 'u') return { finished: Promise.resolve() }
  let s
  try {
    s = e.animate(t, n)
  } catch {
    return { finished: Promise.resolve() }
  }
  return (
    typeof s.finished > 'u' &&
      (s.finished = new Promise(r => {
        s.onfinish = () => {
          r(s)
        }
      })),
    s
  )
}
const xo = new WeakMap()
function jR(e, t) {
  Object.keys(t).forEach(n => {
    if (ru(n)) {
      const s = jh(n),
        r = xo.get(e)
      if (t[n] == null)
        r == null ||
          r.forEach(o => {
            const [a, i] = o
            a === s && (e.removeEventListener(s, i), r.delete(o))
          })
      else if (!r || ![...r].some(o => o[0] === s && o[1] === t[n])) {
        e.addEventListener(s, t[n])
        const o = r || new Set()
        ;(o.add([s, t[n]]), xo.has(e) || xo.set(e, o))
      }
    } else t[n] == null ? e.removeAttribute(n) : e.setAttribute(n, t[n])
  })
}
function YR(e, t) {
  Object.keys(t).forEach(n => {
    if (ru(n)) {
      const s = jh(n),
        r = xo.get(e)
      r == null ||
        r.forEach(o => {
          const [a, i] = o
          a === s && (e.removeEventListener(s, i), r.delete(o))
        })
    } else e.removeAttribute(n)
  })
}
const Vs = 2.4,
  Ld = 0.2126729,
  Pd = 0.7151522,
  $d = 0.072175,
  KR = 0.55,
  qR = 0.58,
  zR = 0.57,
  XR = 0.62,
  Io = 0.03,
  Md = 1.45,
  JR = 5e-4,
  QR = 1.25,
  ZR = 1.25,
  kd = 0.078,
  Dd = 12.82051282051282,
  To = 0.06,
  Fd = 0.001
function Vd(e, t) {
  const n = (e.r / 255) ** Vs,
    s = (e.g / 255) ** Vs,
    r = (e.b / 255) ** Vs,
    o = (t.r / 255) ** Vs,
    a = (t.g / 255) ** Vs,
    i = (t.b / 255) ** Vs
  let u = n * Ld + s * Pd + r * $d,
    c = o * Ld + a * Pd + i * $d
  if ((u <= Io && (u += (Io - u) ** Md), c <= Io && (c += (Io - c) ** Md), Math.abs(c - u) < JR)) return 0
  let d
  if (c > u) {
    const m = (c ** KR - u ** qR) * QR
    d = m < Fd ? 0 : m < kd ? m - m * Dd * To : m - To
  } else {
    const m = (c ** XR - u ** zR) * ZR
    d = m > -Fd ? 0 : m > -kd ? m - m * Dd * To : m + To
  }
  return d * 100
}
const na = 0.20689655172413793,
  eO = e => (e > na ** 3 ? Math.cbrt(e) : e / (3 * na ** 2) + 4 / 29),
  tO = e => (e > na ? e ** 3 : 3 * na ** 2 * (e - 4 / 29))
function Xh(e) {
  const t = eO,
    n = t(e[1])
  return [116 * n - 16, 500 * (t(e[0] / 0.95047) - n), 200 * (n - t(e[2] / 1.08883))]
}
function Jh(e) {
  const t = tO,
    n = (e[0] + 16) / 116
  return [t(n + e[1] / 500) * 0.95047, t(n), t(n - e[2] / 200) * 1.08883]
}
const nO = [
    [3.2406, -1.5372, -0.4986],
    [-0.9689, 1.8758, 0.0415],
    [0.0557, -0.204, 1.057]
  ],
  sO = e => (e <= 0.0031308 ? e * 12.92 : 1.055 * e ** (1 / 2.4) - 0.055),
  rO = [
    [0.4124, 0.3576, 0.1805],
    [0.2126, 0.7152, 0.0722],
    [0.0193, 0.1192, 0.9505]
  ],
  oO = e => (e <= 0.04045 ? e / 12.92 : ((e + 0.055) / 1.055) ** 2.4)
function Qh(e) {
  const t = Array(3),
    n = sO,
    s = nO
  for (let r = 0; r < 3; ++r) t[r] = Math.round(tl(n(s[r][0] * e[0] + s[r][1] * e[1] + s[r][2] * e[2])) * 255)
  return { r: t[0], g: t[1], b: t[2] }
}
function iu(e) {
  let { r: t, g: n, b: s } = e
  const r = [0, 0, 0],
    o = oO,
    a = rO
  ;((t = o(t / 255)), (n = o(n / 255)), (s = o(s / 255)))
  for (let i = 0; i < 3; ++i) r[i] = a[i][0] * t + a[i][1] * n + a[i][2] * s
  return r
}
function rl(e) {
  return !!e && /^(#|var\(--|(rgb|hsl)a?\()/.test(e)
}
function aO(e) {
  return rl(e) && !/^((rgb|hsl)a?\()?var\(--/.test(e)
}
const xd = /^(?<fn>(?:rgb|hsl)a?)\((?<values>.+)\)/,
  iO = {
    rgb: (e, t, n, s) => ({ r: e, g: t, b: n, a: s }),
    rgba: (e, t, n, s) => ({ r: e, g: t, b: n, a: s }),
    hsl: (e, t, n, s) => Bd({ h: e, s: t, l: n, a: s }),
    hsla: (e, t, n, s) => Bd({ h: e, s: t, l: n, a: s }),
    hsv: (e, t, n, s) => Zr({ h: e, s: t, v: n, a: s }),
    hsva: (e, t, n, s) => Zr({ h: e, s: t, v: n, a: s })
  }
function bn(e) {
  if (typeof e == 'number') return { r: (e & 16711680) >> 16, g: (e & 65280) >> 8, b: e & 255 }
  if (typeof e == 'string' && xd.test(e)) {
    const { groups: t } = e.match(xd),
      { fn: n, values: s } = t,
      r = s
        .split(/,\s*/)
        .map(o => (o.endsWith('%') && ['hsl', 'hsla', 'hsv', 'hsva'].includes(n) ? parseFloat(o) / 100 : parseFloat(o)))
    return iO[n](...r)
  } else if (typeof e == 'string') {
    let t = e.startsWith('#') ? e.slice(1) : e
    return (
      [3, 4].includes(t.length)
        ? (t = t
            .split('')
            .map(n => n + n)
            .join(''))
        : [6, 8].includes(t.length),
      uO(t)
    )
  } else if (typeof e == 'object') {
    if (mi(e, ['r', 'g', 'b'])) return e
    if (mi(e, ['h', 's', 'l'])) return Zr(Zh(e))
    if (mi(e, ['h', 's', 'v'])) return Zr(e)
  }
  throw new TypeError(`Invalid color: ${e == null ? e : String(e) || e.constructor.name}
Expected #hex, #hexa, rgb(), rgba(), hsl(), hsla(), object or number`)
}
function Zr(e) {
  const { h: t, s: n, v: s, a: r } = e,
    o = i => {
      const u = (i + t / 60) % 6
      return s - s * n * Math.max(Math.min(u, 4 - u, 1), 0)
    },
    a = [o(5), o(3), o(1)].map(i => Math.round(i * 255))
  return { r: a[0], g: a[1], b: a[2], a: r }
}
function Bd(e) {
  return Zr(Zh(e))
}
function Zh(e) {
  const { h: t, s: n, l: s, a: r } = e,
    o = s + n * Math.min(s, 1 - s),
    a = o === 0 ? 0 : 2 - (2 * s) / o
  return { h: t, s: a, v: o, a: r }
}
function No(e) {
  const t = Math.round(e).toString(16)
  return ('00'.substr(0, 2 - t.length) + t).toUpperCase()
}
function lO(e) {
  let { r: t, g: n, b: s, a: r } = e
  return `#${[No(t), No(n), No(s), r !== void 0 ? No(Math.round(r * 255)) : ''].join('')}`
}
function uO(e) {
  e = cO(e)
  let [t, n, s, r] = BR(e, 2).map(o => parseInt(o, 16))
  return ((r = r === void 0 ? r : r / 255), { r: t, g: n, b: s, a: r })
}
function cO(e) {
  return (
    e.startsWith('#') && (e = e.slice(1)),
    (e = e.replace(/([^0-9a-f])/gi, 'F')),
    (e.length === 3 || e.length === 4) &&
      (e = e
        .split('')
        .map(t => t + t)
        .join('')),
    e.length !== 6 && (e = Od(Od(e, 6), 8, 'F')),
    e
  )
}
function dO(e, t) {
  const n = Xh(iu(e))
  return ((n[0] = n[0] + t * 10), Qh(Jh(n)))
}
function fO(e, t) {
  const n = Xh(iu(e))
  return ((n[0] = n[0] - t * 10), Qh(Jh(n)))
}
function mO(e) {
  const t = bn(e)
  return iu(t)[1]
}
function eg(e) {
  const t = Math.abs(Vd(bn(0), bn(e)))
  return Math.abs(Vd(bn(16777215), bn(e))) > Math.min(t, 50) ? '#fff' : '#000'
}
function ie(e, t) {
  return n =>
    Object.keys(e).reduce((s, r) => {
      const a = typeof e[r] == 'object' && e[r] != null && !Array.isArray(e[r]) ? e[r] : { type: e[r] }
      return (n && r in n ? (s[r] = { ...a, default: n[r] }) : (s[r] = a), t && !s[r].source && (s[r].source = t), s)
    }, {})
}
const Qe = ie({ class: [String, Array], style: { type: [String, Array, Object], default: null } }, 'component'),
  or = Symbol.for('vuetify:defaults')
function hO(e) {
  return _e(e)
}
function lu() {
  const e = it(or)
  if (!e) throw new Error('[Vuetify] Could not find defaults instance')
  return e
}
function Is(e, t) {
  const n = lu(),
    s = _e(e),
    r = M(() => {
      if (Dt(t == null ? void 0 : t.disabled)) return n.value
      const a = Dt(t == null ? void 0 : t.scoped),
        i = Dt(t == null ? void 0 : t.reset),
        u = Dt(t == null ? void 0 : t.root)
      if (s.value == null && !(a || i || u)) return n.value
      let c = Xt(s.value, { prev: n.value })
      if (a) return c
      if (i || u) {
        const d = Number(i || 1 / 0)
        for (let m = 0; m <= d && !(!c || !('prev' in c)); m++) c = c.prev
        return (c && typeof u == 'string' && u in c && (c = Xt(Xt(c, { prev: c }), c[u])), c)
      }
      return c.prev ? Xt(c.prev, c) : c
    })
  return (Ut(or, r), r)
}
function gO(e, t) {
  var n, s
  return (
    typeof ((n = e.props) == null ? void 0 : n[t]) < 'u' || typeof ((s = e.props) == null ? void 0 : s[Os(t)]) < 'u'
  )
}
function pO() {
  let e = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : {},
    t = arguments.length > 1 ? arguments[1] : void 0,
    n = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : lu()
  const s = Tt('useDefaults')
  if (((t = t ?? s.type.name ?? s.type.__name), !t)) throw new Error('[Vuetify] Could not determine component name')
  const r = M(() => {
      var u
      return (u = n.value) == null ? void 0 : u[e._as ?? t]
    }),
    o = new Proxy(e, {
      get(u, c) {
        var m, h, E, y
        const d = Reflect.get(u, c)
        return c === 'class' || c === 'style'
          ? [(m = r.value) == null ? void 0 : m[c], d].filter(v => v != null)
          : typeof c == 'string' && !gO(s.vnode, c)
            ? (((h = r.value) == null ? void 0 : h[c]) ??
              ((y = (E = n.value) == null ? void 0 : E.global) == null ? void 0 : y[c]) ??
              d)
            : d
      }
    }),
    a = je()
  ls(() => {
    if (r.value) {
      const u = Object.entries(r.value).filter(c => {
        let [d] = c
        return d.startsWith(d[0].toUpperCase())
      })
      a.value = u.length ? Object.fromEntries(u) : void 0
    } else a.value = void 0
  })
  function i() {
    const u = bO(or, s)
    Ut(
      or,
      M(() => (a.value ? Xt((u == null ? void 0 : u.value) ?? {}, a.value) : u == null ? void 0 : u.value))
    )
  }
  return { props: o, provideSubDefaults: i }
}
function io(e) {
  if (((e._setup = e._setup ?? e.setup), !e.name)) return e
  if (e._setup) {
    e.props = ie(e.props ?? {}, e.name)()
    const t = Object.keys(e.props).filter(n => n !== 'class' && n !== 'style')
    ;((e.filterProps = function (s) {
      return Gh(s, t)
    }),
      (e.props._as = String),
      (e.setup = function (s, r) {
        const o = lu()
        if (!o.value) return e._setup(s, r)
        const { props: a, provideSubDefaults: i } = pO(s, s._as ?? e.name, o),
          u = e._setup(a, r)
        return (i(), u)
      }))
  }
  return e
}
function Ae() {
  let e = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : !0
  return t => (e ? io : Ee)(t)
}
function lo(e) {
  let t = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : 'div',
    n = arguments.length > 2 ? arguments[2] : void 0
  return Ae()({
    name: n ?? ur(on(e.replace(/__/g, '-'))),
    props: { tag: { type: String, default: t }, ...Qe() },
    setup(s, r) {
      let { slots: o } = r
      return () => {
        var a
        return Rn(s.tag, { class: [e, s.class], style: s.style }, (a = o.default) == null ? void 0 : a.call(o))
      }
    }
  })
}
function tg(e) {
  if (typeof e.getRootNode != 'function') {
    for (; e.parentNode; ) e = e.parentNode
    return e !== document ? null : document
  }
  const t = e.getRootNode()
  return t !== document && t.getRootNode({ composed: !0 }) !== document ? null : t
}
const sa = 'cubic-bezier(0.4, 0, 0.2, 1)',
  EO = 'cubic-bezier(0.0, 0, 0.2, 1)',
  _O = 'cubic-bezier(0.4, 0, 1, 1)'
function Tt(e, t) {
  const n = os()
  if (!n) throw new Error(`[Vuetify] ${e} ${t || 'must be called from inside a setup function'}`)
  return n
}
function Cn() {
  let e = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : 'composables'
  const t = Tt(e).type
  return Os((t == null ? void 0 : t.aliasName) || (t == null ? void 0 : t.name))
}
let ng = 0,
  Bo = new WeakMap()
function An() {
  const e = Tt('getUid')
  if (Bo.has(e)) return Bo.get(e)
  {
    const t = ng++
    return (Bo.set(e, t), t)
  }
}
An.reset = () => {
  ;((ng = 0), (Bo = new WeakMap()))
}
function yO(e) {
  let t = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : !1
  for (; e; ) {
    if (t ? vO(e) : uu(e)) return e
    e = e.parentElement
  }
  return document.scrollingElement
}
function ra(e, t) {
  const n = []
  if (t && e && !t.contains(e)) return n
  for (; e && (uu(e) && n.push(e), e !== t); ) e = e.parentElement
  return n
}
function uu(e) {
  if (!e || e.nodeType !== Node.ELEMENT_NODE) return !1
  const t = window.getComputedStyle(e)
  return t.overflowY === 'scroll' || (t.overflowY === 'auto' && e.scrollHeight > e.clientHeight)
}
function vO(e) {
  if (!e || e.nodeType !== Node.ELEMENT_NODE) return !1
  const t = window.getComputedStyle(e)
  return ['scroll', 'auto'].includes(t.overflowY)
}
function bO(e) {
  let t = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : Tt('injectSelf')
  const { provides: n } = t
  if (n && e in n) return n[e]
}
function SO(e) {
  for (; e; ) {
    if (window.getComputedStyle(e).position === 'fixed') return !0
    e = e.offsetParent
  }
  return !1
}
function Ve(e) {
  const t = Tt('useRender')
  t.render = e
}
const RO = lo('v-alert-title'),
  gr = ie({ border: [Boolean, Number, String] }, 'border')
function uo(e) {
  let t = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : Cn()
  return {
    borderClasses: M(() => {
      const s = nt(e) ? e.value : e.border,
        r = []
      if (s === !0 || s === '') r.push(`${t}--border`)
      else if (typeof s == 'string' || s === 0) for (const o of String(s).split(' ')) r.push(`border-${o}`)
      return r
    })
  }
}
const OO = [null, 'default', 'comfortable', 'compact'],
  Bn = ie({ density: { type: String, default: 'default', validator: e => OO.includes(e) } }, 'density')
function ws(e) {
  let t = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : Cn()
  return { densityClasses: M(() => `${t}--density-${e.density}`) }
}
const Ls = ie(
  {
    elevation: {
      type: [Number, String],
      validator(e) {
        const t = parseInt(e)
        return !isNaN(t) && t >= 0 && t <= 24
      }
    }
  },
  'elevation'
)
function pr(e) {
  return {
    elevationClasses: M(() => {
      const n = nt(e) ? e.value : e.elevation,
        s = []
      return (n == null || s.push(`elevation-${n}`), s)
    })
  }
}
const ln = ie({ rounded: { type: [Boolean, Number, String], default: void 0 }, tile: Boolean }, 'rounded')
function mn(e) {
  let t = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : Cn()
  return {
    roundedClasses: M(() => {
      const s = nt(e) ? e.value : e.rounded,
        r = nt(e) ? e.value : e.tile,
        o = []
      if (s === !0 || s === '') o.push(`${t}--rounded`)
      else if (typeof s == 'string' || s === 0) for (const a of String(s).split(' ')) o.push(`rounded-${a}`)
      else r && o.push('rounded-0')
      return o
    })
  }
}
const Jt = ie({ tag: { type: String, default: 'div' } }, 'tag'),
  oa = Symbol.for('vuetify:theme'),
  Ot = ie({ theme: String }, 'theme')
function Ud() {
  return {
    defaultTheme: 'light',
    variations: { colors: [], lighten: 0, darken: 0 },
    themes: {
      light: {
        dark: !1,
        colors: {
          background: '#FFFFFF',
          surface: '#FFFFFF',
          'surface-bright': '#FFFFFF',
          'surface-light': '#EEEEEE',
          'surface-variant': '#424242',
          'on-surface-variant': '#EEEEEE',
          primary: '#1867C0',
          'primary-darken-1': '#1F5592',
          secondary: '#48A9A6',
          'secondary-darken-1': '#018786',
          error: '#B00020',
          info: '#2196F3',
          success: '#4CAF50',
          warning: '#FB8C00'
        },
        variables: {
          'border-color': '#000000',
          'border-opacity': 0.12,
          'high-emphasis-opacity': 0.87,
          'medium-emphasis-opacity': 0.6,
          'disabled-opacity': 0.38,
          'idle-opacity': 0.04,
          'hover-opacity': 0.04,
          'focus-opacity': 0.12,
          'selected-opacity': 0.08,
          'activated-opacity': 0.12,
          'pressed-opacity': 0.12,
          'dragged-opacity': 0.08,
          'theme-kbd': '#212529',
          'theme-on-kbd': '#FFFFFF',
          'theme-code': '#F5F5F5',
          'theme-on-code': '#000000'
        }
      },
      dark: {
        dark: !0,
        colors: {
          background: '#121212',
          surface: '#212121',
          'surface-bright': '#ccbfd6',
          'surface-light': '#424242',
          'surface-variant': '#a3a3a3',
          'on-surface-variant': '#424242',
          primary: '#2196F3',
          'primary-darken-1': '#277CC1',
          secondary: '#54B6B2',
          'secondary-darken-1': '#48A9A6',
          error: '#CF6679',
          info: '#2196F3',
          success: '#4CAF50',
          warning: '#FB8C00'
        },
        variables: {
          'border-color': '#FFFFFF',
          'border-opacity': 0.12,
          'high-emphasis-opacity': 1,
          'medium-emphasis-opacity': 0.7,
          'disabled-opacity': 0.5,
          'idle-opacity': 0.1,
          'hover-opacity': 0.04,
          'focus-opacity': 0.12,
          'selected-opacity': 0.08,
          'activated-opacity': 0.12,
          'pressed-opacity': 0.16,
          'dragged-opacity': 0.08,
          'theme-kbd': '#212529',
          'theme-on-kbd': '#FFFFFF',
          'theme-code': '#343434',
          'theme-on-code': '#CCCCCC'
        }
      }
    }
  }
}
function CO() {
  var s, r
  let e = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : Ud()
  const t = Ud()
  if (!e) return { ...t, isDisabled: !0 }
  const n = {}
  for (const [o, a] of Object.entries(e.themes ?? {})) {
    const i =
      a.dark || o === 'dark' ? ((s = t.themes) == null ? void 0 : s.dark) : (r = t.themes) == null ? void 0 : r.light
    n[o] = Xt(i, a)
  }
  return Xt(t, { ...e, themes: n })
}
function AO(e) {
  const t = CO(e),
    n = _e(t.defaultTheme),
    s = _e(t.themes),
    r = M(() => {
      const d = {}
      for (const [m, h] of Object.entries(s.value)) {
        const E = (d[m] = { ...h, colors: { ...h.colors } })
        if (t.variations)
          for (const y of t.variations.colors) {
            const v = E.colors[y]
            if (v)
              for (const I of ['lighten', 'darken']) {
                const b = I === 'lighten' ? dO : fO
                for (const O of Ws(t.variations[I], 1)) E.colors[`${y}-${I}-${O}`] = lO(b(bn(v), O))
              }
          }
        for (const y of Object.keys(E.colors)) {
          if (/^on-[a-z]/.test(y) || E.colors[`on-${y}`]) continue
          const v = `on-${y}`,
            I = bn(E.colors[y])
          E.colors[v] = eg(I)
        }
      }
      return d
    }),
    o = M(() => r.value[n.value]),
    a = M(() => {
      const d = []
      ;(o.value.dark && Es(d, ':root', ['color-scheme: dark']), Es(d, ':root', Gd(o.value)))
      for (const [y, v] of Object.entries(r.value))
        Es(d, `.v-theme--${y}`, [`color-scheme: ${v.dark ? 'dark' : 'normal'}`, ...Gd(v)])
      const m = [],
        h = [],
        E = new Set(Object.values(r.value).flatMap(y => Object.keys(y.colors)))
      for (const y of E)
        /^on-[a-z]/.test(y)
          ? Es(h, `.${y}`, [`color: rgb(var(--v-theme-${y})) !important`])
          : (Es(m, `.bg-${y}`, [
              `--v-theme-overlay-multiplier: var(--v-theme-${y}-overlay-multiplier)`,
              `background-color: rgb(var(--v-theme-${y})) !important`,
              `color: rgb(var(--v-theme-on-${y})) !important`
            ]),
            Es(h, `.text-${y}`, [`color: rgb(var(--v-theme-${y})) !important`]),
            Es(h, `.border-${y}`, [`--v-border-color: var(--v-theme-${y})`]))
      return (d.push(...m, ...h), d.map((y, v) => (v === 0 ? y : `    ${y}`)).join(''))
    })
  function i() {
    return { style: [{ children: a.value, id: 'vuetify-theme-stylesheet', nonce: t.cspNonce || !1 }] }
  }
  function u(d) {
    if (t.isDisabled) return
    const m = d._context.provides.usehead
    if (m)
      if (m.push) {
        const E = m.push(i)
        ut &&
          be(a, () => {
            E.patch(i)
          })
      } else ut ? (m.addHeadObjs(M(i)), ls(() => m.updateDOM())) : m.addHeadObjs(i())
    else {
      let y = function () {
        if (typeof document < 'u' && !E) {
          const v = document.createElement('style')
          ;((v.type = 'text/css'),
            (v.id = 'vuetify-theme-stylesheet'),
            t.cspNonce && v.setAttribute('nonce', t.cspNonce),
            (E = v),
            document.head.appendChild(E))
        }
        E && (E.innerHTML = a.value)
      }
      var h = y
      let E = ut ? document.getElementById('vuetify-theme-stylesheet') : null
      ut ? be(a, y, { immediate: !0 }) : y()
    }
  }
  const c = M(() => (t.isDisabled ? void 0 : `v-theme--${n.value}`))
  return {
    install: u,
    isDisabled: t.isDisabled,
    name: n,
    themes: s,
    current: o,
    computedThemes: r,
    themeClasses: c,
    styles: a,
    global: { name: n, current: o }
  }
}
function Pt(e) {
  Tt('provideTheme')
  const t = it(oa, null)
  if (!t) throw new Error('Could not find Vuetify theme injection')
  const n = M(() => e.theme ?? t.name.value),
    s = M(() => t.themes.value[n.value]),
    r = M(() => (t.isDisabled ? void 0 : `v-theme--${n.value}`)),
    o = { ...t, name: n, current: s, themeClasses: r }
  return (Ut(oa, o), o)
}
function Es(e, t, n) {
  e.push(
    `${t} {
`,
    ...n.map(
      s => `  ${s};
`
    ),
    `}
`
  )
}
function Gd(e) {
  const t = e.dark ? 2 : 1,
    n = e.dark ? 1 : 2,
    s = []
  for (const [r, o] of Object.entries(e.colors)) {
    const a = bn(o)
    ;(s.push(`--v-theme-${r}: ${a.r},${a.g},${a.b}`),
      r.startsWith('on-') || s.push(`--v-theme-${r}-overlay-multiplier: ${mO(o) > 0.18 ? t : n}`))
  }
  for (const [r, o] of Object.entries(e.variables)) {
    const a = typeof o == 'string' && o.startsWith('#') ? bn(o) : void 0,
      i = a ? `${a.r}, ${a.g}, ${a.b}` : void 0
    s.push(`--v-${r}: ${i ?? o}`)
  }
  return s
}
function cu(e) {
  return ou(() => {
    const t = [],
      n = {}
    if (e.value.background)
      if (rl(e.value.background)) {
        if (((n.backgroundColor = e.value.background), !e.value.text && aO(e.value.background))) {
          const s = bn(e.value.background)
          if (s.a == null || s.a === 1) {
            const r = eg(s)
            ;((n.color = r), (n.caretColor = r))
          }
        }
      } else t.push(`bg-${e.value.background}`)
    return (
      e.value.text &&
        (rl(e.value.text) ? ((n.color = e.value.text), (n.caretColor = e.value.text)) : t.push(`text-${e.value.text}`)),
      { colorClasses: t, colorStyles: n }
    )
  })
}
function Fn(e, t) {
  const n = M(() => ({ text: nt(e) ? e.value : t ? e[t] : null })),
    { colorClasses: s, colorStyles: r } = cu(n)
  return { textColorClasses: s, textColorStyles: r }
}
function is(e, t) {
  const n = M(() => ({ background: nt(e) ? e.value : t ? e[t] : null })),
    { colorClasses: s, colorStyles: r } = cu(n)
  return { backgroundColorClasses: s, backgroundColorStyles: r }
}
const IO = ['elevated', 'flat', 'tonal', 'outlined', 'text', 'plain']
function co(e, t) {
  return l(Ue, null, [
    e && l('span', { key: 'overlay', class: `${t}__overlay` }, null),
    l('span', { key: 'underlay', class: `${t}__underlay` }, null)
  ])
}
const Ps = ie(
  { color: String, variant: { type: String, default: 'elevated', validator: e => IO.includes(e) } },
  'variant'
)
function fo(e) {
  let t = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : Cn()
  const n = M(() => {
      const { variant: o } = Dt(e)
      return `${t}--variant-${o}`
    }),
    { colorClasses: s, colorStyles: r } = cu(
      M(() => {
        const { variant: o, color: a } = Dt(e)
        return { [['elevated', 'flat'].includes(o) ? 'background' : 'text']: a }
      })
    )
  return { colorClasses: s, colorStyles: r, variantClasses: n }
}
const sg = ie(
    { divided: Boolean, ...gr(), ...Qe(), ...Bn(), ...Ls(), ...ln(), ...Jt(), ...Ot(), ...Ps() },
    'VBtnGroup'
  ),
  Wd = Ae()({
    name: 'VBtnGroup',
    props: sg(),
    setup(e, t) {
      let { slots: n } = t
      const { themeClasses: s } = Pt(e),
        { densityClasses: r } = ws(e),
        { borderClasses: o } = uo(e),
        { elevationClasses: a } = pr(e),
        { roundedClasses: i } = mn(e)
      ;(Is({
        VBtn: { height: 'auto', color: De(e, 'color'), density: De(e, 'density'), flat: !0, variant: De(e, 'variant') }
      }),
        Ve(() =>
          l(
            e.tag,
            {
              class: [
                'v-btn-group',
                { 'v-btn-group--divided': e.divided },
                s.value,
                o.value,
                r.value,
                a.value,
                i.value,
                e.class
              ],
              style: e.style
            },
            n
          )
        ))
    }
  })
function ar(e, t) {
  let n
  function s() {
    ;((n = cr()),
      n.run(() =>
        t.length
          ? t(() => {
              ;(n == null || n.stop(), s())
            })
          : t()
      ))
  }
  ;(be(
    e,
    r => {
      r && !n ? s() : r || (n == null || n.stop(), (n = void 0))
    },
    { immediate: !0 }
  ),
    Ht(() => {
      n == null || n.stop()
    }))
}
function Nt(e, t, n) {
  let s = arguments.length > 3 && arguments[3] !== void 0 ? arguments[3] : m => m,
    r = arguments.length > 4 && arguments[4] !== void 0 ? arguments[4] : m => m
  const o = Tt('useProxiedModel'),
    a = _e(e[t] !== void 0 ? e[t] : n),
    i = Os(t),
    c = M(
      i !== t
        ? () => {
            var m, h, E, y
            return (
              e[t],
              !!(
                (((m = o.vnode.props) != null && m.hasOwnProperty(t)) ||
                  ((h = o.vnode.props) != null && h.hasOwnProperty(i))) &&
                (((E = o.vnode.props) != null && E.hasOwnProperty(`onUpdate:${t}`)) ||
                  ((y = o.vnode.props) != null && y.hasOwnProperty(`onUpdate:${i}`)))
              )
            )
          }
        : () => {
            var m, h
            return (
              e[t],
              !!(
                (m = o.vnode.props) != null &&
                m.hasOwnProperty(t) &&
                (h = o.vnode.props) != null &&
                h.hasOwnProperty(`onUpdate:${t}`)
              )
            )
          }
    )
  ar(
    () => !c.value,
    () => {
      be(
        () => e[t],
        m => {
          a.value = m
        }
      )
    }
  )
  const d = M({
    get() {
      const m = e[t]
      return s(c.value ? m : a.value)
    },
    set(m) {
      const h = r(m),
        E = Me(c.value ? e[t] : a.value)
      E === h || s(E) === m || ((a.value = h), o == null || o.emit(`update:${t}`, h))
    }
  })
  return (Object.defineProperty(d, 'externalValue', { get: () => (c.value ? e[t] : a.value) }), d)
}
const TO = ie(
    {
      modelValue: { type: null, default: void 0 },
      multiple: Boolean,
      mandatory: [Boolean, String],
      max: Number,
      selectedClass: String,
      disabled: Boolean
    },
    'group'
  ),
  NO = ie({ value: null, disabled: Boolean, selectedClass: String }, 'group-item')
function wO(e, t) {
  let n = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : !0
  const s = Tt('useGroupItem')
  if (!s) throw new Error('[Vuetify] useGroupItem composable must be used inside a component setup function')
  const r = An()
  Ut(Symbol.for(`${t.description}:id`), r)
  const o = it(t, null)
  if (!o) {
    if (!n) return o
    throw new Error(`[Vuetify] Could not find useGroup injection with symbol ${t.description}`)
  }
  const a = De(e, 'value'),
    i = M(() => !!(o.disabled.value || e.disabled))
  ;(o.register({ id: r, value: a, disabled: i }, s),
    Sn(() => {
      o.unregister(r)
    }))
  const u = M(() => o.isSelected(r)),
    c = M(() => u.value && [o.selectedClass.value, e.selectedClass])
  return (
    be(
      u,
      d => {
        s.emit('group:selected', { value: d })
      },
      { flush: 'sync' }
    ),
    {
      id: r,
      isSelected: u,
      toggle: () => o.select(r, !u.value),
      select: d => o.select(r, d),
      selectedClass: c,
      value: a,
      disabled: i,
      group: o
    }
  )
}
function LO(e, t) {
  let n = !1
  const s = At([]),
    r = Nt(
      e,
      'modelValue',
      [],
      h => (h == null ? [] : rg(s, ss(h))),
      h => {
        const E = $O(s, h)
        return e.multiple ? E : E[0]
      }
    ),
    o = Tt('useGroup')
  function a(h, E) {
    const y = h,
      v = Symbol.for(`${t.description}:id`),
      b = Mr(v, o == null ? void 0 : o.vnode).indexOf(E)
    ;(Dt(y.value) == null && (y.value = b), b > -1 ? s.splice(b, 0, y) : s.push(y))
  }
  function i(h) {
    if (n) return
    u()
    const E = s.findIndex(y => y.id === h)
    s.splice(E, 1)
  }
  function u() {
    const h = s.find(E => !E.disabled)
    h && e.mandatory === 'force' && !r.value.length && (r.value = [h.id])
  }
  ;(xn(() => {
    u()
  }),
    Sn(() => {
      n = !0
    }))
  function c(h, E) {
    const y = s.find(v => v.id === h)
    if (!(E && y != null && y.disabled))
      if (e.multiple) {
        const v = r.value.slice(),
          I = v.findIndex(O => O === h),
          b = ~I
        if (((E = E ?? !b), (b && e.mandatory && v.length <= 1) || (!b && e.max != null && v.length + 1 > e.max)))
          return
        ;(I < 0 && E ? v.push(h) : I >= 0 && !E && v.splice(I, 1), (r.value = v))
      } else {
        const v = r.value.includes(h)
        if (e.mandatory && v) return
        r.value = (E ?? !v) ? [h] : []
      }
  }
  function d(h) {
    if ((e.multiple, r.value.length)) {
      const E = r.value[0],
        y = s.findIndex(b => b.id === E)
      let v = (y + h) % s.length,
        I = s[v]
      for (; I.disabled && v !== y; ) ((v = (v + h) % s.length), (I = s[v]))
      if (I.disabled) return
      r.value = [s[v].id]
    } else {
      const E = s.find(y => !y.disabled)
      E && (r.value = [E.id])
    }
  }
  const m = {
    register: a,
    unregister: i,
    selected: r,
    select: c,
    disabled: De(e, 'disabled'),
    prev: () => d(s.length - 1),
    next: () => d(1),
    isSelected: h => r.value.includes(h),
    selectedClass: M(() => e.selectedClass),
    items: M(() => s),
    getItemIndex: h => PO(s, h)
  }
  return (Ut(t, m), m)
}
function PO(e, t) {
  const n = rg(e, [t])
  return n.length ? e.findIndex(s => s.id === n[0]) : -1
}
function rg(e, t) {
  const n = []
  return (
    t.forEach(s => {
      const r = e.find(a => Va(s, a.value)),
        o = e[s]
      ;(r == null ? void 0 : r.value) != null ? n.push(r.id) : o != null && n.push(o.id)
    }),
    n
  )
}
function $O(e, t) {
  const n = []
  return (
    t.forEach(s => {
      const r = e.findIndex(o => o.id === s)
      if (~r) {
        const o = e[r]
        n.push(o.value != null ? o.value : r)
      }
    }),
    n
  )
}
const og = Symbol.for('vuetify:v-btn-toggle'),
  MO = ie({ ...sg(), ...TO() }, 'VBtnToggle')
Ae()({
  name: 'VBtnToggle',
  props: MO(),
  emits: { 'update:modelValue': e => !0 },
  setup(e, t) {
    let { slots: n } = t
    const { isSelected: s, next: r, prev: o, select: a, selected: i } = LO(e, og)
    return (
      Ve(() => {
        const u = Wd.filterProps(e)
        return l(Wd, Ge({ class: ['v-btn-toggle', e.class] }, u, { style: e.style }), {
          default: () => {
            var c
            return [
              (c = n.default) == null ? void 0 : c.call(n, { isSelected: s, next: r, prev: o, select: a, selected: i })
            ]
          }
        })
      }),
      { next: r, prev: o, select: a }
    )
  }
})
const kO = ie(
    { defaults: Object, disabled: Boolean, reset: [Number, String], root: [Boolean, String], scoped: Boolean },
    'VDefaultsProvider'
  ),
  dn = Ae(!1)({
    name: 'VDefaultsProvider',
    props: kO(),
    setup(e, t) {
      let { slots: n } = t
      const { defaults: s, disabled: r, reset: o, root: a, scoped: i } = _a(e)
      return (
        Is(s, { reset: o, root: a, scoped: i, disabled: r }),
        () => {
          var u
          return (u = n.default) == null ? void 0 : u.call(n)
        }
      )
    }
  }),
  DO = {
    collapse: 'mdi-chevron-up',
    complete: 'mdi-check',
    cancel: 'mdi-close-circle',
    close: 'mdi-close',
    delete: 'mdi-close-circle',
    clear: 'mdi-close-circle',
    success: 'mdi-check-circle',
    info: 'mdi-information',
    warning: 'mdi-alert-circle',
    error: 'mdi-close-circle',
    prev: 'mdi-chevron-left',
    next: 'mdi-chevron-right',
    checkboxOn: 'mdi-checkbox-marked',
    checkboxOff: 'mdi-checkbox-blank-outline',
    checkboxIndeterminate: 'mdi-minus-box',
    delimiter: 'mdi-circle',
    sortAsc: 'mdi-arrow-up',
    sortDesc: 'mdi-arrow-down',
    expand: 'mdi-chevron-down',
    menu: 'mdi-menu',
    subgroup: 'mdi-menu-down',
    dropdown: 'mdi-menu-down',
    radioOn: 'mdi-radiobox-marked',
    radioOff: 'mdi-radiobox-blank',
    edit: 'mdi-pencil',
    ratingEmpty: 'mdi-star-outline',
    ratingFull: 'mdi-star',
    ratingHalf: 'mdi-star-half-full',
    loading: 'mdi-cached',
    first: 'mdi-page-first',
    last: 'mdi-page-last',
    unfold: 'mdi-unfold-more-horizontal',
    file: 'mdi-paperclip',
    plus: 'mdi-plus',
    minus: 'mdi-minus',
    calendar: 'mdi-calendar',
    treeviewCollapse: 'mdi-menu-down',
    treeviewExpand: 'mdi-menu-right',
    eyeDropper: 'mdi-eyedropper'
  },
  ag = { component: e => Rn(lg, { ...e, class: 'mdi' }) },
  ct = [String, Function, Object, Array],
  ol = Symbol.for('vuetify:icons'),
  Ba = ie({ icon: { type: ct }, tag: { type: String, required: !0 } }, 'icon'),
  Hd = Ae()({
    name: 'VComponentIcon',
    props: Ba(),
    setup(e, t) {
      let { slots: n } = t
      return () => {
        const s = e.icon
        return l(e.tag, null, {
          default: () => {
            var r
            return [e.icon ? l(s, null, null) : (r = n.default) == null ? void 0 : r.call(n)]
          }
        })
      }
    }
  }),
  ig = io({
    name: 'VSvgIcon',
    inheritAttrs: !1,
    props: Ba(),
    setup(e, t) {
      let { attrs: n } = t
      return () =>
        l(e.tag, Ge(n, { style: null }), {
          default: () => [
            l(
              'svg',
              {
                class: 'v-icon__svg',
                xmlns: 'http://www.w3.org/2000/svg',
                viewBox: '0 0 24 24',
                role: 'img',
                'aria-hidden': 'true'
              },
              [
                Array.isArray(e.icon)
                  ? e.icon.map(s =>
                      Array.isArray(s) ? l('path', { d: s[0], 'fill-opacity': s[1] }, null) : l('path', { d: s }, null)
                    )
                  : l('path', { d: e.icon }, null)
              ]
            )
          ]
        })
    }
  })
io({
  name: 'VLigatureIcon',
  props: Ba(),
  setup(e) {
    return () => l(e.tag, null, { default: () => [e.icon] })
  }
})
const lg = io({
  name: 'VClassIcon',
  props: Ba(),
  setup(e) {
    return () => l(e.tag, { class: e.icon }, null)
  }
})
function FO() {
  return { svg: { component: ig }, class: { component: lg } }
}
function VO(e) {
  const t = FO(),
    n = (e == null ? void 0 : e.defaultSet) ?? 'mdi'
  return (
    n === 'mdi' && !t.mdi && (t.mdi = ag),
    Xt(
      {
        defaultSet: n,
        sets: t,
        aliases: {
          ...DO,
          vuetify: [
            'M8.2241 14.2009L12 21L22 3H14.4459L8.2241 14.2009Z',
            ['M7.26303 12.4733L7.00113 12L2 3H12.5261C12.5261 3 12.5261 3 12.5261 3L7.26303 12.4733Z', 0.6]
          ],
          'vuetify-outline':
            'svg:M7.26 12.47 12.53 3H2L7.26 12.47ZM14.45 3 8.22 14.2 12 21 22 3H14.45ZM18.6 5 12 16.88 10.51 14.2 15.62 5ZM7.26 8.35 5.4 5H9.13L7.26 8.35Z'
        }
      },
      e
    )
  )
}
const xO = e => {
    const t = it(ol)
    if (!t) throw new Error('Missing Vuetify Icons provide!')
    return {
      iconData: M(() => {
        var u
        const s = Dt(e)
        if (!s) return { component: Hd }
        let r = s
        if (
          (typeof r == 'string' &&
            ((r = r.trim()), r.startsWith('$') && (r = (u = t.aliases) == null ? void 0 : u[r.slice(1)])),
          !r)
        )
          throw new Error(`Could not find aliased icon "${s}"`)
        if (Array.isArray(r)) return { component: ig, icon: r }
        if (typeof r != 'string') return { component: Hd, icon: r }
        const o = Object.keys(t.sets).find(c => typeof r == 'string' && r.startsWith(`${c}:`)),
          a = o ? r.slice(o.length + 1) : r
        return { component: t.sets[o ?? t.defaultSet].component, icon: a }
      })
    }
  },
  BO = ['x-small', 'small', 'default', 'large', 'x-large'],
  mo = ie({ size: { type: [String, Number], default: 'default' } }, 'size')
function Ua(e) {
  let t = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : Cn()
  return ou(() => {
    let n, s
    return (
      ta(BO, e.size) ? (n = `${t}--size-${e.size}`) : e.size && (s = { width: Te(e.size), height: Te(e.size) }),
      { sizeClasses: n, sizeStyles: s }
    )
  })
}
const UO = ie(
    { color: String, start: Boolean, end: Boolean, icon: ct, ...Qe(), ...mo(), ...Jt({ tag: 'i' }), ...Ot() },
    'VIcon'
  ),
  mt = Ae()({
    name: 'VIcon',
    props: UO(),
    setup(e, t) {
      let { attrs: n, slots: s } = t
      const r = _e(),
        { themeClasses: o } = Pt(e),
        { iconData: a } = xO(M(() => r.value || e.icon)),
        { sizeClasses: i } = Ua(e),
        { textColorClasses: u, textColorStyles: c } = Fn(De(e, 'color'))
      return (
        Ve(() => {
          var m, h
          const d = (m = s.default) == null ? void 0 : m.call(s)
          return (
            d &&
              (r.value =
                (h = Hh(d).filter(E => E.type === fr && E.children && typeof E.children == 'string')[0]) == null
                  ? void 0
                  : h.children),
            l(
              a.value.component,
              {
                tag: e.tag,
                icon: a.value.icon,
                class: [
                  'v-icon',
                  'notranslate',
                  o.value,
                  i.value,
                  u.value,
                  { 'v-icon--clickable': !!n.onClick, 'v-icon--start': e.start, 'v-icon--end': e.end },
                  e.class
                ],
                style: [
                  i.value ? void 0 : { fontSize: Te(e.size), height: Te(e.size), width: Te(e.size) },
                  c.value,
                  e.style
                ],
                role: n.onClick ? 'button' : void 0,
                'aria-hidden': !n.onClick
              },
              { default: () => [d] }
            )
          )
        }),
        {}
      )
    }
  })
function ug(e, t) {
  const n = _e(),
    s = je(!1)
  if (nu) {
    const r = new IntersectionObserver(o => {
      ;(e == null || e(o, r), (s.value = !!o.find(a => a.isIntersecting)))
    }, t)
    ;(Sn(() => {
      r.disconnect()
    }),
      be(
        n,
        (o, a) => {
          ;(a && (r.unobserve(a), (s.value = !1)), o && r.observe(o))
        },
        { flush: 'post' }
      ))
  }
  return { intersectionRef: n, isIntersecting: s }
}
function Ga(e) {
  let t = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : 'content'
  const n = _e(),
    s = _e()
  if (ut) {
    const r = new ResizeObserver(o => {
      ;(e == null || e(o, r),
        o.length && (t === 'content' ? (s.value = o[0].contentRect) : (s.value = o[0].target.getBoundingClientRect())))
    })
    ;(Sn(() => {
      r.disconnect()
    }),
      be(
        n,
        (o, a) => {
          ;(a && (r.unobserve(Qr(a)), (s.value = void 0)), o && r.observe(Qr(o)))
        },
        { flush: 'post' }
      ))
  }
  return { resizeRef: n, contentRect: so(s) }
}
const GO = ie(
    {
      bgColor: String,
      color: String,
      indeterminate: [Boolean, String],
      modelValue: { type: [Number, String], default: 0 },
      rotate: { type: [Number, String], default: 0 },
      width: { type: [Number, String], default: 4 },
      ...Qe(),
      ...mo(),
      ...Jt({ tag: 'div' }),
      ...Ot()
    },
    'VProgressCircular'
  ),
  ho = Ae()({
    name: 'VProgressCircular',
    props: GO(),
    setup(e, t) {
      let { slots: n } = t
      const s = 20,
        r = 2 * Math.PI * s,
        o = _e(),
        { themeClasses: a } = Pt(e),
        { sizeClasses: i, sizeStyles: u } = Ua(e),
        { textColorClasses: c, textColorStyles: d } = Fn(De(e, 'color')),
        { textColorClasses: m, textColorStyles: h } = Fn(De(e, 'bgColor')),
        { intersectionRef: E, isIntersecting: y } = ug(),
        { resizeRef: v, contentRect: I } = Ga(),
        b = M(() => Math.max(0, Math.min(100, parseFloat(e.modelValue)))),
        O = M(() => Number(e.width)),
        P = M(() => (u.value ? Number(e.size) : I.value ? I.value.width : Math.max(O.value, 32))),
        T = M(() => (s / (1 - O.value / P.value)) * 2),
        $ = M(() => (O.value / P.value) * T.value),
        L = M(() => Te(((100 - b.value) / 100) * r))
      return (
        ls(() => {
          ;((E.value = o.value), (v.value = o.value))
        }),
        Ve(() =>
          l(
            e.tag,
            {
              ref: o,
              class: [
                'v-progress-circular',
                {
                  'v-progress-circular--indeterminate': !!e.indeterminate,
                  'v-progress-circular--visible': y.value,
                  'v-progress-circular--disable-shrink': e.indeterminate === 'disable-shrink'
                },
                a.value,
                i.value,
                c.value,
                e.class
              ],
              style: [u.value, d.value, e.style],
              role: 'progressbar',
              'aria-valuemin': '0',
              'aria-valuemax': '100',
              'aria-valuenow': e.indeterminate ? void 0 : b.value
            },
            {
              default: () => [
                l(
                  'svg',
                  {
                    style: { transform: `rotate(calc(-90deg + ${Number(e.rotate)}deg))` },
                    xmlns: 'http://www.w3.org/2000/svg',
                    viewBox: `0 0 ${T.value} ${T.value}`
                  },
                  [
                    l(
                      'circle',
                      {
                        class: ['v-progress-circular__underlay', m.value],
                        style: h.value,
                        fill: 'transparent',
                        cx: '50%',
                        cy: '50%',
                        r: s,
                        'stroke-width': $.value,
                        'stroke-dasharray': r,
                        'stroke-dashoffset': 0
                      },
                      null
                    ),
                    l(
                      'circle',
                      {
                        class: 'v-progress-circular__overlay',
                        fill: 'transparent',
                        cx: '50%',
                        cy: '50%',
                        r: s,
                        'stroke-width': $.value,
                        'stroke-dasharray': r,
                        'stroke-dashoffset': L.value
                      },
                      null
                    )
                  ]
                ),
                n.default && l('div', { class: 'v-progress-circular__content' }, [n.default({ value: b.value })])
              ]
            }
          )
        ),
        {}
      )
    }
  }),
  $s = ie(
    {
      height: [Number, String],
      maxHeight: [Number, String],
      maxWidth: [Number, String],
      minHeight: [Number, String],
      minWidth: [Number, String],
      width: [Number, String]
    },
    'dimension'
  )
function Ms(e) {
  return {
    dimensionStyles: M(() => ({
      height: Te(e.height),
      maxHeight: Te(e.maxHeight),
      maxWidth: Te(e.maxWidth),
      minHeight: Te(e.minHeight),
      minWidth: Te(e.minWidth),
      width: Te(e.width)
    }))
  }
}
const jd = '$vuetify.',
  Yd = (e, t) => e.replace(/\{(\d+)\}/g, (n, s) => String(t[+s])),
  cg = (e, t, n) =>
    function (s) {
      for (var r = arguments.length, o = new Array(r > 1 ? r - 1 : 0), a = 1; a < r; a++) o[a - 1] = arguments[a]
      if (!s.startsWith(jd)) return Yd(s, o)
      const i = s.replace(jd, ''),
        u = e.value && n.value[e.value],
        c = t.value && n.value[t.value]
      let d = vd(u, i, null)
      return (d || (`${s}${e.value}`, (d = vd(c, i, null))), d || (d = s), typeof d != 'string' && (d = s), Yd(d, o))
    }
function dg(e, t) {
  return (n, s) => new Intl.NumberFormat([e.value, t.value], s).format(n)
}
function pi(e, t, n) {
  const s = Nt(e, t, e[t] ?? n.value)
  return (
    (s.value = e[t] ?? n.value),
    be(n, r => {
      e[t] == null && (s.value = n.value)
    }),
    s
  )
}
function fg(e) {
  return t => {
    const n = pi(t, 'locale', e.current),
      s = pi(t, 'fallback', e.fallback),
      r = pi(t, 'messages', e.messages)
    return {
      name: 'vuetify',
      current: n,
      fallback: s,
      messages: r,
      t: cg(n, s, r),
      n: dg(n, s),
      provide: fg({ current: n, fallback: s, messages: r })
    }
  }
}
function WO(e) {
  const t = je((e == null ? void 0 : e.locale) ?? 'en'),
    n = je((e == null ? void 0 : e.fallback) ?? 'en'),
    s = _e({ en: wh, ...(e == null ? void 0 : e.messages) })
  return {
    name: 'vuetify',
    current: t,
    fallback: n,
    messages: s,
    t: cg(t, n, s),
    n: dg(t, n),
    provide: fg({ current: t, fallback: n, messages: s })
  }
}
const aa = Symbol.for('vuetify:locale')
function HO(e) {
  return e.name != null
}
function jO(e) {
  const t = e != null && e.adapter && HO(e == null ? void 0 : e.adapter) ? (e == null ? void 0 : e.adapter) : WO(e),
    n = KO(t, e)
  return { ...t, ...n }
}
function Wa() {
  const e = it(aa)
  if (!e) throw new Error('[Vuetify] Could not find injected locale instance')
  return e
}
function YO() {
  return {
    af: !1,
    ar: !0,
    bg: !1,
    ca: !1,
    ckb: !1,
    cs: !1,
    de: !1,
    el: !1,
    en: !1,
    es: !1,
    et: !1,
    fa: !0,
    fi: !1,
    fr: !1,
    hr: !1,
    hu: !1,
    he: !0,
    id: !1,
    it: !1,
    ja: !1,
    km: !1,
    ko: !1,
    lv: !1,
    lt: !1,
    nl: !1,
    no: !1,
    pl: !1,
    pt: !1,
    ro: !1,
    ru: !1,
    sk: !1,
    sl: !1,
    srCyrl: !1,
    srLatn: !1,
    sv: !1,
    th: !1,
    tr: !1,
    az: !1,
    uk: !1,
    vi: !1,
    zhHans: !1,
    zhHant: !1
  }
}
function KO(e, t) {
  const n = _e((t == null ? void 0 : t.rtl) ?? YO()),
    s = M(() => n.value[e.current.value] ?? !1)
  return { isRtl: s, rtl: n, rtlClasses: M(() => `v-locale--is-${s.value ? 'rtl' : 'ltr'}`) }
}
function fs() {
  const e = it(aa)
  if (!e) throw new Error('[Vuetify] Could not find injected rtl instance')
  return { isRtl: e.isRtl, rtlClasses: e.rtlClasses }
}
const Kd = { center: 'center', top: 'bottom', bottom: 'top', left: 'right', right: 'left' },
  Er = ie({ location: String }, 'location')
function _r(e) {
  let t = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : !1,
    n = arguments.length > 2 ? arguments[2] : void 0
  const { isRtl: s } = fs()
  return {
    locationStyles: M(() => {
      if (!e.location) return {}
      const { side: o, align: a } = sl(e.location.split(' ').length > 1 ? e.location : `${e.location} center`, s.value)
      function i(c) {
        return n ? n(c) : 0
      }
      const u = {}
      return (
        o !== 'center' && (t ? (u[Kd[o]] = `calc(100% - ${i(o)}px)`) : (u[o] = 0)),
        a !== 'center'
          ? t
            ? (u[Kd[a]] = `calc(100% - ${i(a)}px)`)
            : (u[a] = 0)
          : (o === 'center'
              ? (u.top = u.left = '50%')
              : (u[{ top: 'left', bottom: 'left', left: 'top', right: 'top' }[o]] = '50%'),
            (u.transform = {
              top: 'translateX(-50%)',
              bottom: 'translateX(-50%)',
              left: 'translateY(-50%)',
              right: 'translateY(-50%)',
              center: 'translate(-50%, -50%)'
            }[o])),
        u
      )
    })
  }
}
const qO = ie(
    {
      absolute: Boolean,
      active: { type: Boolean, default: !0 },
      bgColor: String,
      bgOpacity: [Number, String],
      bufferValue: { type: [Number, String], default: 0 },
      clickable: Boolean,
      color: String,
      height: { type: [Number, String], default: 4 },
      indeterminate: Boolean,
      max: { type: [Number, String], default: 100 },
      modelValue: { type: [Number, String], default: 0 },
      reverse: Boolean,
      stream: Boolean,
      striped: Boolean,
      roundedBar: Boolean,
      ...Qe(),
      ...Er({ location: 'top' }),
      ...ln(),
      ...Jt(),
      ...Ot()
    },
    'VProgressLinear'
  ),
  mg = Ae()({
    name: 'VProgressLinear',
    props: qO(),
    emits: { 'update:modelValue': e => !0 },
    setup(e, t) {
      let { slots: n } = t
      const s = Nt(e, 'modelValue'),
        { isRtl: r, rtlClasses: o } = fs(),
        { themeClasses: a } = Pt(e),
        { locationStyles: i } = _r(e),
        { textColorClasses: u, textColorStyles: c } = Fn(e, 'color'),
        { backgroundColorClasses: d, backgroundColorStyles: m } = is(M(() => e.bgColor || e.color)),
        { backgroundColorClasses: h, backgroundColorStyles: E } = is(e, 'color'),
        { roundedClasses: y } = mn(e),
        { intersectionRef: v, isIntersecting: I } = ug(),
        b = M(() => parseInt(e.max, 10)),
        O = M(() => parseInt(e.height, 10)),
        P = M(() => (parseFloat(e.bufferValue) / b.value) * 100),
        T = M(() => (parseFloat(s.value) / b.value) * 100),
        $ = M(() => r.value !== e.reverse),
        L = M(() => (e.indeterminate ? 'fade-transition' : 'slide-x-transition')),
        N = M(() => (e.bgOpacity == null ? e.bgOpacity : parseFloat(e.bgOpacity)))
      function A(w) {
        if (!v.value) return
        const { left: B, right: j, width: D } = v.value.getBoundingClientRect(),
          U = $.value ? D - w.clientX + (j - D) : w.clientX - B
        s.value = Math.round((U / D) * b.value)
      }
      return (
        Ve(() =>
          l(
            e.tag,
            {
              ref: v,
              class: [
                'v-progress-linear',
                {
                  'v-progress-linear--absolute': e.absolute,
                  'v-progress-linear--active': e.active && I.value,
                  'v-progress-linear--reverse': $.value,
                  'v-progress-linear--rounded': e.rounded,
                  'v-progress-linear--rounded-bar': e.roundedBar,
                  'v-progress-linear--striped': e.striped
                },
                y.value,
                a.value,
                o.value,
                e.class
              ],
              style: [
                {
                  bottom: e.location === 'bottom' ? 0 : void 0,
                  top: e.location === 'top' ? 0 : void 0,
                  height: e.active ? Te(O.value) : 0,
                  '--v-progress-linear-height': Te(O.value),
                  ...i.value
                },
                e.style
              ],
              role: 'progressbar',
              'aria-hidden': e.active ? 'false' : 'true',
              'aria-valuemin': '0',
              'aria-valuemax': e.max,
              'aria-valuenow': e.indeterminate ? void 0 : T.value,
              onClick: e.clickable && A
            },
            {
              default: () => [
                e.stream &&
                  l(
                    'div',
                    {
                      key: 'stream',
                      class: ['v-progress-linear__stream', u.value],
                      style: {
                        ...c.value,
                        [$.value ? 'left' : 'right']: Te(-O.value),
                        borderTop: `${Te(O.value / 2)} dotted`,
                        opacity: N.value,
                        top: `calc(50% - ${Te(O.value / 4)})`,
                        width: Te(100 - P.value, '%'),
                        '--v-progress-linear-stream-to': Te(O.value * ($.value ? 1 : -1))
                      }
                    },
                    null
                  ),
                l(
                  'div',
                  {
                    class: ['v-progress-linear__background', d.value],
                    style: [m.value, { opacity: N.value, width: Te(e.stream ? P.value : 100, '%') }]
                  },
                  null
                ),
                l(
                  Dn,
                  { name: L.value },
                  {
                    default: () => [
                      e.indeterminate
                        ? l('div', { class: 'v-progress-linear__indeterminate' }, [
                            ['long', 'short'].map(w =>
                              l(
                                'div',
                                { key: w, class: ['v-progress-linear__indeterminate', w, h.value], style: E.value },
                                null
                              )
                            )
                          ])
                        : l(
                            'div',
                            {
                              class: ['v-progress-linear__determinate', h.value],
                              style: [E.value, { width: Te(T.value, '%') }]
                            },
                            null
                          )
                    ]
                  }
                ),
                n.default &&
                  l('div', { class: 'v-progress-linear__content' }, [n.default({ value: T.value, buffer: P.value })])
              ]
            }
          )
        ),
        {}
      )
    }
  }),
  du = ie({ loading: [Boolean, String] }, 'loader')
function fu(e) {
  let t = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : Cn()
  return { loaderClasses: M(() => ({ [`${t}--loading`]: e.loading })) }
}
function hg(e, t) {
  var s
  let { slots: n } = t
  return l('div', { class: `${e.name}__loader` }, [
    ((s = n.default) == null ? void 0 : s.call(n, { color: e.color, isActive: e.active })) ||
      l(mg, { absolute: e.absolute, active: e.active, color: e.color, height: '2', indeterminate: !0 }, null)
  ])
}
const zO = ['static', 'relative', 'fixed', 'absolute', 'sticky'],
  go = ie({ position: { type: String, validator: e => zO.includes(e) } }, 'position')
function po(e) {
  let t = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : Cn()
  return { positionClasses: M(() => (e.position ? `${t}--${e.position}` : void 0)) }
}
function XO() {
  const e = Tt('useRoute')
  return M(() => {
    var t
    return (t = e == null ? void 0 : e.proxy) == null ? void 0 : t.$route
  })
}
function JO() {
  var e, t
  return (t = (e = Tt('useRouter')) == null ? void 0 : e.proxy) == null ? void 0 : t.$router
}
function gg(e, t) {
  const n = zp('RouterLink'),
    s = M(() => !!(e.href || e.to)),
    r = M(() => (s == null ? void 0 : s.value) || Ad(t, 'click') || Ad(e, 'click'))
  if (typeof n == 'string') return { isLink: s, isClickable: r, href: De(e, 'href') }
  const o = e.to ? n.useLink(e) : void 0,
    a = XO()
  return {
    isLink: s,
    isClickable: r,
    route: o == null ? void 0 : o.route,
    navigate: o == null ? void 0 : o.navigate,
    isActive:
      o &&
      M(() => {
        var i, u, c
        return e.exact
          ? a.value
            ? ((c = o.isExactActive) == null ? void 0 : c.value) && Va(o.route.value.query, a.value.query)
            : (u = o.isExactActive) == null
              ? void 0
              : u.value
          : (i = o.isActive) == null
            ? void 0
            : i.value
      }),
    href: M(() => (e.to ? (o == null ? void 0 : o.route.value.href) : e.href))
  }
}
const pg = ie({ href: String, replace: Boolean, to: [String, Object], exact: Boolean }, 'router')
let Ei = !1
function QO(e, t) {
  let n = !1,
    s,
    r
  ut &&
    (Et(() => {
      ;(window.addEventListener('popstate', o),
        (s =
          e == null
            ? void 0
            : e.beforeEach((a, i, u) => {
                ;(Ei ? (n ? t(u) : u()) : setTimeout(() => (n ? t(u) : u())), (Ei = !0))
              })),
        (r =
          e == null
            ? void 0
            : e.afterEach(() => {
                Ei = !1
              })))
    }),
    Ht(() => {
      ;(window.removeEventListener('popstate', o), s == null || s(), r == null || r())
    }))
  function o(a) {
    var i
    ;((i = a.state) != null && i.replaced) || ((n = !0), setTimeout(() => (n = !1)))
  }
}
function ZO(e, t) {
  be(
    () => {
      var n
      return (n = e.isActive) == null ? void 0 : n.value
    },
    n => {
      e.isLink.value &&
        n &&
        t &&
        Et(() => {
          t(!0)
        })
    },
    { immediate: !0 }
  )
}
const al = Symbol('rippleStop'),
  eC = 80
function qd(e, t) {
  ;((e.style.transform = t), (e.style.webkitTransform = t))
}
function il(e) {
  return e.constructor.name === 'TouchEvent'
}
function Eg(e) {
  return e.constructor.name === 'KeyboardEvent'
}
const tC = function (e, t) {
    var m
    let n = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : {},
      s = 0,
      r = 0
    if (!Eg(e)) {
      const h = t.getBoundingClientRect(),
        E = il(e) ? e.touches[e.touches.length - 1] : e
      ;((s = E.clientX - h.left), (r = E.clientY - h.top))
    }
    let o = 0,
      a = 0.3
    ;(m = t._ripple) != null && m.circle
      ? ((a = 0.15), (o = t.clientWidth / 2), (o = n.center ? o : o + Math.sqrt((s - o) ** 2 + (r - o) ** 2) / 4))
      : (o = Math.sqrt(t.clientWidth ** 2 + t.clientHeight ** 2) / 2)
    const i = `${(t.clientWidth - o * 2) / 2}px`,
      u = `${(t.clientHeight - o * 2) / 2}px`,
      c = n.center ? i : `${s - o}px`,
      d = n.center ? u : `${r - o}px`
    return { radius: o, scale: a, x: c, y: d, centerX: i, centerY: u }
  },
  ia = {
    show(e, t) {
      var E
      let n = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : {}
      if (!((E = t == null ? void 0 : t._ripple) != null && E.enabled)) return
      const s = document.createElement('span'),
        r = document.createElement('span')
      ;(s.appendChild(r), (s.className = 'v-ripple__container'), n.class && (s.className += ` ${n.class}`))
      const { radius: o, scale: a, x: i, y: u, centerX: c, centerY: d } = tC(e, t, n),
        m = `${o * 2}px`
      ;((r.className = 'v-ripple__animation'), (r.style.width = m), (r.style.height = m), t.appendChild(s))
      const h = window.getComputedStyle(t)
      ;(h && h.position === 'static' && ((t.style.position = 'relative'), (t.dataset.previousPosition = 'static')),
        r.classList.add('v-ripple__animation--enter'),
        r.classList.add('v-ripple__animation--visible'),
        qd(r, `translate(${i}, ${u}) scale3d(${a},${a},${a})`),
        (r.dataset.activated = String(performance.now())),
        setTimeout(() => {
          ;(r.classList.remove('v-ripple__animation--enter'),
            r.classList.add('v-ripple__animation--in'),
            qd(r, `translate(${c}, ${d}) scale3d(1,1,1)`))
        }, 0))
    },
    hide(e) {
      var o
      if (!((o = e == null ? void 0 : e._ripple) != null && o.enabled)) return
      const t = e.getElementsByClassName('v-ripple__animation')
      if (t.length === 0) return
      const n = t[t.length - 1]
      if (n.dataset.isHiding) return
      n.dataset.isHiding = 'true'
      const s = performance.now() - Number(n.dataset.activated),
        r = Math.max(250 - s, 0)
      setTimeout(() => {
        ;(n.classList.remove('v-ripple__animation--in'),
          n.classList.add('v-ripple__animation--out'),
          setTimeout(() => {
            var i
            ;(e.getElementsByClassName('v-ripple__animation').length === 1 &&
              e.dataset.previousPosition &&
              ((e.style.position = e.dataset.previousPosition), delete e.dataset.previousPosition),
              ((i = n.parentNode) == null ? void 0 : i.parentNode) === e && e.removeChild(n.parentNode))
          }, 300))
      }, r)
    }
  }
function _g(e) {
  return typeof e > 'u' || !!e
}
function eo(e) {
  const t = {},
    n = e.currentTarget
  if (!(!(n != null && n._ripple) || n._ripple.touched || e[al])) {
    if (((e[al] = !0), il(e))) ((n._ripple.touched = !0), (n._ripple.isTouch = !0))
    else if (n._ripple.isTouch) return
    if (((t.center = n._ripple.centered || Eg(e)), n._ripple.class && (t.class = n._ripple.class), il(e))) {
      if (n._ripple.showTimerCommit) return
      ;((n._ripple.showTimerCommit = () => {
        ia.show(e, n, t)
      }),
        (n._ripple.showTimer = window.setTimeout(() => {
          var s
          ;(s = n == null ? void 0 : n._ripple) != null &&
            s.showTimerCommit &&
            (n._ripple.showTimerCommit(), (n._ripple.showTimerCommit = null))
        }, eC)))
    } else ia.show(e, n, t)
  }
}
function zd(e) {
  e[al] = !0
}
function zt(e) {
  const t = e.currentTarget
  if (t != null && t._ripple) {
    if ((window.clearTimeout(t._ripple.showTimer), e.type === 'touchend' && t._ripple.showTimerCommit)) {
      ;(t._ripple.showTimerCommit(),
        (t._ripple.showTimerCommit = null),
        (t._ripple.showTimer = window.setTimeout(() => {
          zt(e)
        })))
      return
    }
    ;(window.setTimeout(() => {
      t._ripple && (t._ripple.touched = !1)
    }),
      ia.hide(t))
  }
}
function yg(e) {
  const t = e.currentTarget
  t != null &&
    t._ripple &&
    (t._ripple.showTimerCommit && (t._ripple.showTimerCommit = null), window.clearTimeout(t._ripple.showTimer))
}
let to = !1
function vg(e) {
  !to && (e.keyCode === bd.enter || e.keyCode === bd.space) && ((to = !0), eo(e))
}
function bg(e) {
  ;((to = !1), zt(e))
}
function Sg(e) {
  to && ((to = !1), zt(e))
}
function Rg(e, t, n) {
  const { value: s, modifiers: r } = t,
    o = _g(s)
  if (
    (o || ia.hide(e),
    (e._ripple = e._ripple ?? {}),
    (e._ripple.enabled = o),
    (e._ripple.centered = r.center),
    (e._ripple.circle = r.circle),
    el(s) && s.class && (e._ripple.class = s.class),
    o && !n)
  ) {
    if (r.stop) {
      ;(e.addEventListener('touchstart', zd, { passive: !0 }), e.addEventListener('mousedown', zd))
      return
    }
    ;(e.addEventListener('touchstart', eo, { passive: !0 }),
      e.addEventListener('touchend', zt, { passive: !0 }),
      e.addEventListener('touchmove', yg, { passive: !0 }),
      e.addEventListener('touchcancel', zt),
      e.addEventListener('mousedown', eo),
      e.addEventListener('mouseup', zt),
      e.addEventListener('mouseleave', zt),
      e.addEventListener('keydown', vg),
      e.addEventListener('keyup', bg),
      e.addEventListener('blur', Sg),
      e.addEventListener('dragstart', zt, { passive: !0 }))
  } else !o && n && Og(e)
}
function Og(e) {
  ;(e.removeEventListener('mousedown', eo),
    e.removeEventListener('touchstart', eo),
    e.removeEventListener('touchend', zt),
    e.removeEventListener('touchmove', yg),
    e.removeEventListener('touchcancel', zt),
    e.removeEventListener('mouseup', zt),
    e.removeEventListener('mouseleave', zt),
    e.removeEventListener('keydown', vg),
    e.removeEventListener('keyup', bg),
    e.removeEventListener('dragstart', zt),
    e.removeEventListener('blur', Sg))
}
function nC(e, t) {
  Rg(e, t, !1)
}
function sC(e) {
  ;(delete e._ripple, Og(e))
}
function rC(e, t) {
  if (t.value === t.oldValue) return
  const n = _g(t.oldValue)
  Rg(e, t, n)
}
const mu = { mounted: nC, unmounted: sC, updated: rC },
  oC = ie(
    {
      active: { type: Boolean, default: void 0 },
      symbol: { type: null, default: og },
      flat: Boolean,
      icon: [Boolean, String, Function, Object],
      prependIcon: ct,
      appendIcon: ct,
      block: Boolean,
      slim: Boolean,
      stacked: Boolean,
      ripple: { type: [Boolean, Object], default: !0 },
      text: String,
      ...gr(),
      ...Qe(),
      ...Bn(),
      ...$s(),
      ...Ls(),
      ...NO(),
      ...du(),
      ...Er(),
      ...go(),
      ...ln(),
      ...pg(),
      ...mo(),
      ...Jt({ tag: 'button' }),
      ...Ot(),
      ...Ps({ variant: 'elevated' })
    },
    'VBtn'
  ),
  ae = Ae()({
    name: 'VBtn',
    directives: { Ripple: mu },
    props: oC(),
    emits: { 'group:selected': e => !0 },
    setup(e, t) {
      let { attrs: n, slots: s } = t
      const { themeClasses: r } = Pt(e),
        { borderClasses: o } = uo(e),
        { colorClasses: a, colorStyles: i, variantClasses: u } = fo(e),
        { densityClasses: c } = ws(e),
        { dimensionStyles: d } = Ms(e),
        { elevationClasses: m } = pr(e),
        { loaderClasses: h } = fu(e),
        { locationStyles: E } = _r(e),
        { positionClasses: y } = po(e),
        { roundedClasses: v } = mn(e),
        { sizeClasses: I, sizeStyles: b } = Ua(e),
        O = wO(e, e.symbol, !1),
        P = gg(e, n),
        T = M(() => {
          var w
          return e.active !== void 0
            ? e.active
            : P.isLink.value
              ? (w = P.isActive) == null
                ? void 0
                : w.value
              : O == null
                ? void 0
                : O.isSelected.value
        }),
        $ = M(() => (O == null ? void 0 : O.disabled.value) || e.disabled),
        L = M(() => e.variant === 'elevated' && !(e.disabled || e.flat || e.border)),
        N = M(() => {
          if (!(e.value === void 0 || typeof e.value == 'symbol'))
            return Object(e.value) === e.value ? JSON.stringify(e.value, null, 0) : e.value
        })
      function A(w) {
        var B
        $.value ||
          (P.isLink.value && (w.metaKey || w.ctrlKey || w.shiftKey || w.button !== 0 || n.target === '_blank')) ||
          ((B = P.navigate) == null || B.call(P, w), O == null || O.toggle())
      }
      return (
        ZO(P, O == null ? void 0 : O.select),
        Ve(() => {
          var X, ge
          const w = P.isLink.value ? 'a' : e.tag,
            B = !!(e.prependIcon || s.prepend),
            j = !!(e.appendIcon || s.append),
            D = !!(e.icon && e.icon !== !0),
            U =
              ((O == null ? void 0 : O.isSelected.value) &&
                (!P.isLink.value || ((X = P.isActive) == null ? void 0 : X.value))) ||
              !O ||
              ((ge = P.isActive) == null ? void 0 : ge.value)
          return vt(
            l(
              w,
              {
                type: w === 'a' ? void 0 : 'button',
                class: [
                  'v-btn',
                  O == null ? void 0 : O.selectedClass.value,
                  {
                    'v-btn--active': T.value,
                    'v-btn--block': e.block,
                    'v-btn--disabled': $.value,
                    'v-btn--elevated': L.value,
                    'v-btn--flat': e.flat,
                    'v-btn--icon': !!e.icon,
                    'v-btn--loading': e.loading,
                    'v-btn--slim': e.slim,
                    'v-btn--stacked': e.stacked
                  },
                  r.value,
                  o.value,
                  U ? a.value : void 0,
                  c.value,
                  m.value,
                  h.value,
                  y.value,
                  v.value,
                  I.value,
                  u.value,
                  e.class
                ],
                style: [U ? i.value : void 0, d.value, E.value, b.value, e.style],
                disabled: $.value || void 0,
                href: P.href.value,
                onClick: A,
                value: N.value
              },
              {
                default: () => {
                  var te
                  return [
                    co(!0, 'v-btn'),
                    !e.icon &&
                      B &&
                      l('span', { key: 'prepend', class: 'v-btn__prepend' }, [
                        s.prepend
                          ? l(
                              dn,
                              {
                                key: 'prepend-defaults',
                                disabled: !e.prependIcon,
                                defaults: { VIcon: { icon: e.prependIcon } }
                              },
                              s.prepend
                            )
                          : l(mt, { key: 'prepend-icon', icon: e.prependIcon }, null)
                      ]),
                    l('span', { class: 'v-btn__content', 'data-no-activator': '' }, [
                      !s.default && D
                        ? l(mt, { key: 'content-icon', icon: e.icon }, null)
                        : l(
                            dn,
                            { key: 'content-defaults', disabled: !D, defaults: { VIcon: { icon: e.icon } } },
                            {
                              default: () => {
                                var fe
                                return [((fe = s.default) == null ? void 0 : fe.call(s)) ?? e.text]
                              }
                            }
                          )
                    ]),
                    !e.icon &&
                      j &&
                      l('span', { key: 'append', class: 'v-btn__append' }, [
                        s.append
                          ? l(
                              dn,
                              {
                                key: 'append-defaults',
                                disabled: !e.appendIcon,
                                defaults: { VIcon: { icon: e.appendIcon } }
                              },
                              s.append
                            )
                          : l(mt, { key: 'append-icon', icon: e.appendIcon }, null)
                      ]),
                    !!e.loading &&
                      l('span', { key: 'loader', class: 'v-btn__loader' }, [
                        ((te = s.loader) == null ? void 0 : te.call(s)) ??
                          l(
                            ho,
                            {
                              color: typeof e.loading == 'boolean' ? void 0 : e.loading,
                              indeterminate: !0,
                              size: '23',
                              width: '2'
                            },
                            null
                          )
                      ])
                  ]
                }
              }
            ),
            [[dr('ripple'), !$.value && e.ripple, null]]
          )
        }),
        { group: O }
      )
    }
  }),
  aC = ['success', 'info', 'warning', 'error'],
  iC = ie(
    {
      border: {
        type: [Boolean, String],
        validator: e => typeof e == 'boolean' || ['top', 'end', 'bottom', 'start'].includes(e)
      },
      borderColor: String,
      closable: Boolean,
      closeIcon: { type: ct, default: '$close' },
      closeLabel: { type: String, default: '$vuetify.close' },
      icon: { type: [Boolean, String, Function, Object], default: null },
      modelValue: { type: Boolean, default: !0 },
      prominent: Boolean,
      title: String,
      text: String,
      type: { type: String, validator: e => aC.includes(e) },
      ...Qe(),
      ...Bn(),
      ...$s(),
      ...Ls(),
      ...Er(),
      ...go(),
      ...ln(),
      ...Jt(),
      ...Ot(),
      ...Ps({ variant: 'flat' })
    },
    'VAlert'
  ),
  de = Ae()({
    name: 'VAlert',
    props: iC(),
    emits: { 'click:close': e => !0, 'update:modelValue': e => !0 },
    setup(e, t) {
      let { emit: n, slots: s } = t
      const r = Nt(e, 'modelValue'),
        o = M(() => {
          if (e.icon !== !1) return e.type ? (e.icon ?? `$${e.type}`) : e.icon
        }),
        a = M(() => ({ color: e.color ?? e.type, variant: e.variant })),
        { themeClasses: i } = Pt(e),
        { colorClasses: u, colorStyles: c, variantClasses: d } = fo(a),
        { densityClasses: m } = ws(e),
        { dimensionStyles: h } = Ms(e),
        { elevationClasses: E } = pr(e),
        { locationStyles: y } = _r(e),
        { positionClasses: v } = po(e),
        { roundedClasses: I } = mn(e),
        { textColorClasses: b, textColorStyles: O } = Fn(De(e, 'borderColor')),
        { t: P } = Wa(),
        T = M(() => ({
          'aria-label': P(e.closeLabel),
          onClick($) {
            ;((r.value = !1), n('click:close', $))
          }
        }))
      return () => {
        const $ = !!(s.prepend || o.value),
          L = !!(s.title || e.title),
          N = !!(s.close || e.closable)
        return (
          r.value &&
          l(
            e.tag,
            {
              class: [
                'v-alert',
                e.border && {
                  'v-alert--border': !!e.border,
                  [`v-alert--border-${e.border === !0 ? 'start' : e.border}`]: !0
                },
                { 'v-alert--prominent': e.prominent },
                i.value,
                u.value,
                m.value,
                E.value,
                v.value,
                I.value,
                d.value,
                e.class
              ],
              style: [c.value, h.value, y.value, e.style],
              role: 'alert'
            },
            {
              default: () => {
                var A, w
                return [
                  co(!1, 'v-alert'),
                  e.border && l('div', { key: 'border', class: ['v-alert__border', b.value], style: O.value }, null),
                  $ &&
                    l('div', { key: 'prepend', class: 'v-alert__prepend' }, [
                      s.prepend
                        ? l(
                            dn,
                            {
                              key: 'prepend-defaults',
                              disabled: !o.value,
                              defaults: { VIcon: { density: e.density, icon: o.value, size: e.prominent ? 44 : 28 } }
                            },
                            s.prepend
                          )
                        : l(
                            mt,
                            { key: 'prepend-icon', density: e.density, icon: o.value, size: e.prominent ? 44 : 28 },
                            null
                          )
                    ]),
                  l('div', { class: 'v-alert__content' }, [
                    L &&
                      l(
                        RO,
                        { key: 'title' },
                        {
                          default: () => {
                            var B
                            return [((B = s.title) == null ? void 0 : B.call(s)) ?? e.title]
                          }
                        }
                      ),
                    ((A = s.text) == null ? void 0 : A.call(s)) ?? e.text,
                    (w = s.default) == null ? void 0 : w.call(s)
                  ]),
                  s.append && l('div', { key: 'append', class: 'v-alert__append' }, [s.append()]),
                  N &&
                    l('div', { key: 'close', class: 'v-alert__close' }, [
                      s.close
                        ? l(
                            dn,
                            {
                              key: 'close-defaults',
                              defaults: { VBtn: { icon: e.closeIcon, size: 'x-small', variant: 'text' } }
                            },
                            {
                              default: () => {
                                var B
                                return [(B = s.close) == null ? void 0 : B.call(s, { props: T.value })]
                              }
                            }
                          )
                        : l(
                            ae,
                            Ge({ key: 'close-btn', icon: e.closeIcon, size: 'x-small', variant: 'text' }, T.value),
                            null
                          )
                    ])
                ]
              }
            }
          )
        )
      }
    }
  }),
  lC = ie({ fluid: { type: Boolean, default: !1 }, ...Qe(), ...Jt() }, 'VContainer'),
  dt = Ae()({
    name: 'VContainer',
    props: lC(),
    setup(e, t) {
      let { slots: n } = t
      const { rtlClasses: s } = fs()
      return (
        Ve(() =>
          l(e.tag, { class: ['v-container', { 'v-container--fluid': e.fluid }, s.value, e.class], style: e.style }, n)
        ),
        {}
      )
    }
  }),
  ll = Symbol.for('vuetify:display'),
  Xd = { mobileBreakpoint: 'lg', thresholds: { xs: 0, sm: 600, md: 960, lg: 1280, xl: 1920, xxl: 2560 } },
  uC = function () {
    let e = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : Xd
    return Xt(Xd, e)
  }
function Jd(e) {
  return ut && !e ? window.innerWidth : (typeof e == 'object' && e.clientWidth) || 0
}
function Qd(e) {
  return ut && !e ? window.innerHeight : (typeof e == 'object' && e.clientHeight) || 0
}
function Zd(e) {
  const t = ut && !e ? window.navigator.userAgent : 'ssr'
  function n(y) {
    return !!t.match(y)
  }
  const s = n(/android/i),
    r = n(/iphone|ipad|ipod/i),
    o = n(/cordova/i),
    a = n(/electron/i),
    i = n(/chrome/i),
    u = n(/edge/i),
    c = n(/firefox/i),
    d = n(/opera/i),
    m = n(/win/i),
    h = n(/mac/i),
    E = n(/linux/i)
  return {
    android: s,
    ios: r,
    cordova: o,
    electron: a,
    chrome: i,
    edge: u,
    firefox: c,
    opera: d,
    win: m,
    mac: h,
    linux: E,
    touch: DR,
    ssr: t === 'ssr'
  }
}
function cC(e, t) {
  const { thresholds: n, mobileBreakpoint: s } = uC(e),
    r = je(Qd(t)),
    o = je(Zd(t)),
    a = At({}),
    i = je(Jd(t))
  function u() {
    ;((r.value = Qd()), (i.value = Jd()))
  }
  function c() {
    ;(u(), (o.value = Zd()))
  }
  return (
    ls(() => {
      const d = i.value < n.sm,
        m = i.value < n.md && !d,
        h = i.value < n.lg && !(m || d),
        E = i.value < n.xl && !(h || m || d),
        y = i.value < n.xxl && !(E || h || m || d),
        v = i.value >= n.xxl,
        I = d ? 'xs' : m ? 'sm' : h ? 'md' : E ? 'lg' : y ? 'xl' : 'xxl',
        b = typeof s == 'number' ? s : n[s],
        O = i.value < b
      ;((a.xs = d),
        (a.sm = m),
        (a.md = h),
        (a.lg = E),
        (a.xl = y),
        (a.xxl = v),
        (a.smAndUp = !d),
        (a.mdAndUp = !(d || m)),
        (a.lgAndUp = !(d || m || h)),
        (a.xlAndUp = !(d || m || h || E)),
        (a.smAndDown = !(h || E || y || v)),
        (a.mdAndDown = !(E || y || v)),
        (a.lgAndDown = !(y || v)),
        (a.xlAndDown = !v),
        (a.name = I),
        (a.height = r.value),
        (a.width = i.value),
        (a.mobile = O),
        (a.mobileBreakpoint = s),
        (a.platform = o.value),
        (a.thresholds = n))
    }),
    ut && window.addEventListener('resize', u, { passive: !0 }),
    { ..._a(a), update: c, ssr: !!t }
  )
}
function Cg() {
  let e = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : {},
    t = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : Cn()
  const n = it(ll)
  if (!n) throw new Error('Could not find Vuetify display injection')
  const s = M(() => {
      if (!e.mobileBreakpoint) return n.mobile.value
      const o = typeof e.mobileBreakpoint == 'number' ? e.mobileBreakpoint : n.thresholds.value[e.mobileBreakpoint]
      return n.width.value < o
    }),
    r = M(() => (t ? { [`${t}--mobile`]: s.value } : {}))
  return { ...n, displayClasses: r, mobile: s }
}
const Ft = lo('v-spacer', 'div', 'VSpacer')
function dC(e) {
  return {
    aspectStyles: M(() => {
      const t = Number(e.aspectRatio)
      return t ? { paddingBottom: String((1 / t) * 100) + '%' } : void 0
    })
  }
}
const Ag = ie(
    { aspectRatio: [String, Number], contentClass: String, inline: Boolean, ...Qe(), ...$s() },
    'VResponsive'
  ),
  ef = Ae()({
    name: 'VResponsive',
    props: Ag(),
    setup(e, t) {
      let { slots: n } = t
      const { aspectStyles: s } = dC(e),
        { dimensionStyles: r } = Ms(e)
      return (
        Ve(() => {
          var o
          return l(
            'div',
            { class: ['v-responsive', { 'v-responsive--inline': e.inline }, e.class], style: [r.value, e.style] },
            [
              l('div', { class: 'v-responsive__sizer', style: s.value }, null),
              (o = n.additional) == null ? void 0 : o.call(n),
              n.default && l('div', { class: ['v-responsive__content', e.contentClass] }, [n.default()])
            ]
          )
        }),
        {}
      )
    }
  }),
  Ha = ie(
    { transition: { type: [Boolean, String, Object], default: 'fade-transition', validator: e => e !== !0 } },
    'transition'
  ),
  bs = (e, t) => {
    let { slots: n } = t
    const { transition: s, disabled: r, group: o, ...a } = e,
      { component: i = o ? $m : Dn, ...u } = typeof s == 'object' ? s : {}
    return Rn(
      i,
      Ge(typeof s == 'string' ? { name: r ? '' : s } : u, typeof s == 'string' ? {} : { disabled: r, group: o }, a),
      n
    )
  }
function fC(e, t) {
  if (!nu) return
  const n = t.modifiers || {},
    s = t.value,
    { handler: r, options: o } = typeof s == 'object' ? s : { handler: s, options: {} },
    a = new IntersectionObserver(function () {
      var m
      let i = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : [],
        u = arguments.length > 1 ? arguments[1] : void 0
      const c = (m = e._observe) == null ? void 0 : m[t.instance.$.uid]
      if (!c) return
      const d = i.some(h => h.isIntersecting)
      ;(r && (!n.quiet || c.init) && (!n.once || d || c.init) && r(d, i, u), d && n.once ? Ig(e, t) : (c.init = !0))
    }, o)
  ;((e._observe = Object(e._observe)), (e._observe[t.instance.$.uid] = { init: !1, observer: a }), a.observe(e))
}
function Ig(e, t) {
  var s
  const n = (s = e._observe) == null ? void 0 : s[t.instance.$.uid]
  n && (n.observer.unobserve(e), delete e._observe[t.instance.$.uid])
}
const mC = { mounted: fC, unmounted: Ig },
  Tg = mC,
  hC = ie(
    {
      alt: String,
      cover: Boolean,
      color: String,
      draggable: { type: [Boolean, String], default: void 0 },
      eager: Boolean,
      gradient: String,
      lazySrc: String,
      options: { type: Object, default: () => ({ root: void 0, rootMargin: void 0, threshold: void 0 }) },
      sizes: String,
      src: { type: [String, Object], default: '' },
      crossorigin: String,
      referrerpolicy: String,
      srcset: String,
      position: String,
      ...Ag(),
      ...Qe(),
      ...ln(),
      ...Ha()
    },
    'VImg'
  ),
  lt = Ae()({
    name: 'VImg',
    directives: { intersect: Tg },
    props: hC(),
    emits: { loadstart: e => !0, load: e => !0, error: e => !0 },
    setup(e, t) {
      let { emit: n, slots: s } = t
      const { backgroundColorClasses: r, backgroundColorStyles: o } = is(De(e, 'color')),
        { roundedClasses: a } = mn(e),
        i = Tt('VImg'),
        u = je(''),
        c = _e(),
        d = je(e.eager ? 'loading' : 'idle'),
        m = je(),
        h = je(),
        E = M(() =>
          e.src && typeof e.src == 'object'
            ? {
                src: e.src.src,
                srcset: e.srcset || e.src.srcset,
                lazySrc: e.lazySrc || e.src.lazySrc,
                aspect: Number(e.aspectRatio || e.src.aspect || 0)
              }
            : { src: e.src, srcset: e.srcset, lazySrc: e.lazySrc, aspect: Number(e.aspectRatio || 0) }
        ),
        y = M(() => E.value.aspect || m.value / h.value || 0)
      ;(be(
        () => e.src,
        () => {
          v(d.value !== 'idle')
        }
      ),
        be(y, (D, U) => {
          !D && U && c.value && T(c.value)
        }),
        Ra(() => v()))
      function v(D) {
        if (!(e.eager && D) && !(nu && !D && !e.eager)) {
          if (((d.value = 'loading'), E.value.lazySrc)) {
            const U = new Image()
            ;((U.src = E.value.lazySrc), T(U, null))
          }
          E.value.src &&
            Et(() => {
              var U
              ;(n('loadstart', ((U = c.value) == null ? void 0 : U.currentSrc) || E.value.src),
                setTimeout(() => {
                  var X
                  if (!i.isUnmounted)
                    if ((X = c.value) != null && X.complete) {
                      if ((c.value.naturalWidth || b(), d.value === 'error')) return
                      ;(y.value || T(c.value, null), d.value === 'loading' && I())
                    } else (y.value || T(c.value), O())
                }))
            })
        }
      }
      function I() {
        var D
        i.isUnmounted ||
          (O(),
          T(c.value),
          (d.value = 'loaded'),
          n('load', ((D = c.value) == null ? void 0 : D.currentSrc) || E.value.src))
      }
      function b() {
        var D
        i.isUnmounted ||
          ((d.value = 'error'), n('error', ((D = c.value) == null ? void 0 : D.currentSrc) || E.value.src))
      }
      function O() {
        const D = c.value
        D && (u.value = D.currentSrc || D.src)
      }
      let P = -1
      Sn(() => {
        clearTimeout(P)
      })
      function T(D) {
        let U = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : 100
        const X = () => {
          if ((clearTimeout(P), i.isUnmounted)) return
          const { naturalHeight: ge, naturalWidth: te } = D
          ge || te
            ? ((m.value = te), (h.value = ge))
            : !D.complete && d.value === 'loading' && U != null
              ? (P = window.setTimeout(X, U))
              : (D.currentSrc.endsWith('.svg') || D.currentSrc.startsWith('data:image/svg+xml')) &&
                ((m.value = 1), (h.value = 1))
        }
        X()
      }
      const $ = M(() => ({ 'v-img__img--cover': e.cover, 'v-img__img--contain': !e.cover })),
        L = () => {
          var X
          if (!E.value.src || d.value === 'idle') return null
          const D = l(
              'img',
              {
                class: ['v-img__img', $.value],
                style: { objectPosition: e.position },
                src: E.value.src,
                srcset: E.value.srcset,
                alt: e.alt,
                crossorigin: e.crossorigin,
                referrerpolicy: e.referrerpolicy,
                draggable: e.draggable,
                sizes: e.sizes,
                ref: c,
                onLoad: I,
                onError: b
              },
              null
            ),
            U = (X = s.sources) == null ? void 0 : X.call(s)
          return l(
            bs,
            { transition: e.transition, appear: !0 },
            {
              default: () => [
                vt(U ? l('picture', { class: 'v-img__picture' }, [U, D]) : D, [[Wt, d.value === 'loaded']])
              ]
            }
          )
        },
        N = () =>
          l(
            bs,
            { transition: e.transition },
            {
              default: () => [
                E.value.lazySrc &&
                  d.value !== 'loaded' &&
                  l(
                    'img',
                    {
                      class: ['v-img__img', 'v-img__img--preload', $.value],
                      style: { objectPosition: e.position },
                      src: E.value.lazySrc,
                      alt: e.alt,
                      crossorigin: e.crossorigin,
                      referrerpolicy: e.referrerpolicy,
                      draggable: e.draggable
                    },
                    null
                  )
              ]
            }
          ),
        A = () =>
          s.placeholder
            ? l(
                bs,
                { transition: e.transition, appear: !0 },
                {
                  default: () => [
                    (d.value === 'loading' || (d.value === 'error' && !s.error)) &&
                      l('div', { class: 'v-img__placeholder' }, [s.placeholder()])
                  ]
                }
              )
            : null,
        w = () =>
          s.error
            ? l(
                bs,
                { transition: e.transition, appear: !0 },
                { default: () => [d.value === 'error' && l('div', { class: 'v-img__error' }, [s.error()])] }
              )
            : null,
        B = () =>
          e.gradient
            ? l('div', { class: 'v-img__gradient', style: { backgroundImage: `linear-gradient(${e.gradient})` } }, null)
            : null,
        j = je(!1)
      {
        const D = be(y, U => {
          U &&
            (requestAnimationFrame(() => {
              requestAnimationFrame(() => {
                j.value = !0
              })
            }),
            D())
        })
      }
      return (
        Ve(() => {
          const D = ef.filterProps(e)
          return vt(
            l(
              ef,
              Ge(
                {
                  class: ['v-img', { 'v-img--booting': !j.value }, r.value, a.value, e.class],
                  style: [{ width: Te(e.width === 'auto' ? m.value : e.width) }, o.value, e.style]
                },
                D,
                { aspectRatio: y.value, 'aria-label': e.alt, role: e.alt ? 'img' : void 0 }
              ),
              {
                additional: () =>
                  l(Ue, null, [
                    l(L, null, null),
                    l(N, null, null),
                    l(B, null, null),
                    l(A, null, null),
                    l(w, null, null)
                  ]),
                default: s.default
              }
            ),
            [[dr('intersect'), { handler: v, options: e.options }, null, { once: !0 }]]
          )
        }),
        { currentSrc: u, image: c, state: d, naturalWidth: m, naturalHeight: h }
      )
    }
  }),
  gC = ie({ color: String, ...gr(), ...Qe(), ...$s(), ...Ls(), ...Er(), ...go(), ...ln(), ...Jt(), ...Ot() }, 'VSheet'),
  _ = Ae()({
    name: 'VSheet',
    props: gC(),
    setup(e, t) {
      let { slots: n } = t
      const { themeClasses: s } = Pt(e),
        { backgroundColorClasses: r, backgroundColorStyles: o } = is(De(e, 'color')),
        { borderClasses: a } = uo(e),
        { dimensionStyles: i } = Ms(e),
        { elevationClasses: u } = pr(e),
        { locationStyles: c } = _r(e),
        { positionClasses: d } = po(e),
        { roundedClasses: m } = mn(e)
      return (
        Ve(() =>
          l(
            e.tag,
            {
              class: ['v-sheet', s.value, r.value, a.value, u.value, d.value, m.value, e.class],
              style: [o.value, i.value, c.value, e.style]
            },
            n
          )
        ),
        {}
      )
    }
  }),
  pC = Ee({
    name: 'NotFoundPage',
    methods: {
      onClickAction() {
        window.location.replace(document.baseURI)
      }
    }
  })
function EC(e, t, n, s, r, o) {
  return (
    F(),
    G(dt, null, {
      default: f(() => [
        l(
          _,
          { class: 'd-flex align-center justify-center' },
          {
            default: f(() => [
              l(
                _,
                { 'max-width': '480px' },
                {
                  default: f(() => [
                    l(
                      _,
                      { class: 'my-5 pa-4 text-center' },
                      {
                        default: f(() => [
                          l(lt, { src: e.$config.siteLogo, 'max-width': '360px', class: 'mx-auto' }, null, 8, ['src'])
                        ]),
                        _: 1
                      }
                    ),
                    l(
                      de,
                      {
                        color: 'error',
                        border: 'start',
                        variant: 'tonal',
                        title: e.$t('COMMON.ERROR_NOT_FOUND.TITLE')
                      },
                      {
                        default: f(() => [
                          l(
                            _,
                            { class: 'py-2' },
                            { default: f(() => [ee(S(e.$t('COMMON.ERROR_NOT_FOUND.MESSAGE')), 1)]), _: 1 }
                          )
                        ]),
                        _: 1
                      },
                      8,
                      ['title']
                    ),
                    l(
                      _,
                      { class: 'py-5 text-center' },
                      {
                        default: f(() => [
                          l(_, null, {
                            default: f(() => [C('span', null, S(e.$t('COMMON.ERROR_NOT_FOUND.LABEL1')), 1)]),
                            _: 1
                          }),
                          l(_, null, {
                            default: f(() => [C('span', null, S(e.$t('COMMON.ERROR_NOT_FOUND.LABEL2')), 1)]),
                            _: 1
                          })
                        ]),
                        _: 1
                      }
                    ),
                    l(
                      _,
                      { class: 'text-center py-5' },
                      {
                        default: f(() => [
                          l(
                            ae,
                            { variant: 'text', onClick: e.onClickAction },
                            { default: f(() => [ee(S(e.$t('COMMON.ERROR_NOT_FOUND.ACTION')), 1)]), _: 1 },
                            8,
                            ['onClick']
                          )
                        ]),
                        _: 1
                      }
                    )
                  ]),
                  _: 1
                }
              )
            ]),
            _: 1
          }
        )
      ]),
      _: 1
    })
  )
}
const _C = ue(pC, [['render', EC]]),
  yC = Ee({
    name: 'CodeExpiredPage',
    methods: {
      onClickAction() {
        window.location.replace(document.baseURI)
      }
    }
  })
function vC(e, t, n, s, r, o) {
  return (
    F(),
    G(dt, null, {
      default: f(() => [
        l(
          _,
          { class: 'd-flex align-center justify-center' },
          {
            default: f(() => [
              l(
                _,
                { 'max-width': '480px' },
                {
                  default: f(() => [
                    l(
                      _,
                      { class: 'my-5 pa-4 text-center' },
                      {
                        default: f(() => [
                          l(lt, { src: e.$config.siteLogo, 'max-width': '360px', class: 'mx-auto' }, null, 8, ['src'])
                        ]),
                        _: 1
                      }
                    ),
                    l(
                      de,
                      {
                        color: 'error',
                        border: 'start',
                        variant: 'tonal',
                        title: e.$t('COMMON.ERROR_CODE_EXPIRED.TITLE')
                      },
                      {
                        default: f(() => [
                          l(
                            _,
                            { class: 'py-2' },
                            { default: f(() => [ee(S(e.$t('COMMON.ERROR_CODE_EXPIRED.MESSAGE')), 1)]), _: 1 }
                          )
                        ]),
                        _: 1
                      },
                      8,
                      ['title']
                    ),
                    l(
                      _,
                      { class: 'py-5 text-center' },
                      {
                        default: f(() => [
                          l(_, null, {
                            default: f(() => [C('span', null, S(e.$t('COMMON.ERROR_CODE_EXPIRED.LABEL1')), 1)]),
                            _: 1
                          }),
                          l(_, null, {
                            default: f(() => [C('span', null, S(e.$t('COMMON.ERROR_CODE_EXPIRED.LABEL2')), 1)]),
                            _: 1
                          })
                        ]),
                        _: 1
                      }
                    ),
                    l(
                      _,
                      { class: 'text-center py-5' },
                      {
                        default: f(() => [
                          l(
                            ae,
                            { variant: 'text', onClick: e.onClickAction },
                            { default: f(() => [ee(S(e.$t('COMMON.ERROR_CODE_EXPIRED.ACTION')), 1)]), _: 1 },
                            8,
                            ['onClick']
                          )
                        ]),
                        _: 1
                      }
                    )
                  ]),
                  _: 1
                }
              )
            ]),
            _: 1
          }
        )
      ]),
      _: 1
    })
  )
}
const bC = ue(yC, [['render', vC]]),
  SC = Ee({
    name: 'SystemErrorPage',
    methods: {
      onClickAction() {
        window.location.replace(document.baseURI)
      }
    }
  })
function RC(e, t, n, s, r, o) {
  return (
    F(),
    G(dt, null, {
      default: f(() => [
        l(
          _,
          { class: 'd-flex align-center justify-center' },
          {
            default: f(() => [
              l(
                _,
                { 'max-width': '480px' },
                {
                  default: f(() => [
                    l(
                      _,
                      { class: 'my-5 pa-4 text-center' },
                      {
                        default: f(() => [
                          l(lt, { src: e.$config.siteLogo, 'max-width': '360px', class: 'mx-auto' }, null, 8, ['src'])
                        ]),
                        _: 1
                      }
                    ),
                    l(
                      de,
                      {
                        color: 'error',
                        border: 'start',
                        variant: 'tonal',
                        title: e.$t('COMMON.ERROR_SYSTEM_ERROR.TITLE')
                      },
                      {
                        default: f(() => [
                          l(
                            _,
                            { class: 'py-2' },
                            { default: f(() => [ee(S(e.$t('COMMON.ERROR_SYSTEM_ERROR.MESSAGE')), 1)]), _: 1 }
                          )
                        ]),
                        _: 1
                      },
                      8,
                      ['title']
                    ),
                    l(
                      _,
                      { class: 'py-5 text-center' },
                      {
                        default: f(() => [
                          l(_, null, {
                            default: f(() => [C('span', null, S(e.$t('COMMON.ERROR_SYSTEM_ERROR.LABEL1')), 1)]),
                            _: 1
                          }),
                          l(_, null, {
                            default: f(() => [C('span', null, S(e.$t('COMMON.ERROR_SYSTEM_ERROR.LABEL2')), 1)]),
                            _: 1
                          })
                        ]),
                        _: 1
                      }
                    ),
                    l(
                      _,
                      { class: 'text-center py-5' },
                      {
                        default: f(() => [
                          l(
                            ae,
                            { variant: 'text', onClick: e.onClickAction },
                            { default: f(() => [ee(S(e.$t('COMMON.ERROR_SYSTEM_ERROR.ACTION')), 1)]), _: 1 },
                            8,
                            ['onClick']
                          )
                        ]),
                        _: 1
                      }
                    )
                  ]),
                  _: 1
                }
              )
            ]),
            _: 1
          }
        )
      ]),
      _: 1
    })
  )
}
const tf = ue(SC, [['render', RC]]),
  OC = Ee({
    name: 'ConnectErrorPage',
    methods: {
      onClickAction() {
        window.location.replace(document.baseURI)
      }
    }
  })
function CC(e, t, n, s, r, o) {
  return (
    F(),
    G(dt, null, {
      default: f(() => [
        l(
          _,
          { class: 'd-flex align-center justify-center' },
          {
            default: f(() => [
              l(
                _,
                { 'max-width': '480px' },
                {
                  default: f(() => [
                    l(
                      _,
                      { class: 'my-5 pa-4 text-center' },
                      {
                        default: f(() => [
                          l(lt, { src: e.$config.siteLogo, 'max-width': '360px', class: 'mx-auto' }, null, 8, ['src'])
                        ]),
                        _: 1
                      }
                    ),
                    l(
                      de,
                      {
                        color: 'error',
                        border: 'start',
                        variant: 'tonal',
                        title: e.$t('COMMON.ERROR_CONNECT_ERROR.TITLE')
                      },
                      {
                        default: f(() => [
                          l(
                            _,
                            { class: 'py-2' },
                            { default: f(() => [ee(S(e.$t('COMMON.ERROR_CONNECT_ERROR.MESSAGE')), 1)]), _: 1 }
                          )
                        ]),
                        _: 1
                      },
                      8,
                      ['title']
                    ),
                    l(
                      _,
                      { class: 'py-5 text-center' },
                      {
                        default: f(() => [
                          l(_, null, {
                            default: f(() => [C('span', null, S(e.$t('COMMON.ERROR_CONNECT_ERROR.LABEL1')), 1)]),
                            _: 1
                          }),
                          l(_, null, {
                            default: f(() => [C('span', null, S(e.$t('COMMON.ERROR_CONNECT_ERROR.LABEL2')), 1)]),
                            _: 1
                          })
                        ]),
                        _: 1
                      }
                    ),
                    l(
                      _,
                      { class: 'text-center py-5' },
                      {
                        default: f(() => [
                          l(
                            ae,
                            { variant: 'text', onClick: e.onClickAction },
                            { default: f(() => [ee(S(e.$t('COMMON.ERROR_CONNECT_ERROR.ACTION')), 1)]), _: 1 },
                            8,
                            ['onClick']
                          )
                        ]),
                        _: 1
                      }
                    )
                  ]),
                  _: 1
                }
              )
            ]),
            _: 1
          }
        )
      ]),
      _: 1
    })
  )
}
const AC = ue(OC, [['render', CC]]),
  IC = Ee({
    name: 'AccessDeniedPage',
    methods: {
      onClickAction() {
        window.location.replace(document.baseURI)
      }
    }
  })
function TC(e, t, n, s, r, o) {
  return (
    F(),
    G(dt, null, {
      default: f(() => [
        l(
          _,
          { class: 'd-flex align-center justify-center' },
          {
            default: f(() => [
              l(
                _,
                { 'max-width': '480px' },
                {
                  default: f(() => [
                    l(
                      _,
                      { class: 'my-5 pa-4 text-center' },
                      {
                        default: f(() => [
                          l(lt, { src: e.$config.siteLogo, 'max-width': '360px', class: 'mx-auto' }, null, 8, ['src'])
                        ]),
                        _: 1
                      }
                    ),
                    l(
                      de,
                      {
                        color: 'error',
                        border: 'start',
                        variant: 'tonal',
                        title: e.$t('COMMON.ERROR_FORBIDDEN_ERROR.TITLE')
                      },
                      {
                        default: f(() => [
                          l(
                            _,
                            { class: 'py-2' },
                            { default: f(() => [ee(S(e.$t('COMMON.ERROR_FORBIDDEN_ERROR.MESSAGE')), 1)]), _: 1 }
                          )
                        ]),
                        _: 1
                      },
                      8,
                      ['title']
                    ),
                    l(
                      _,
                      { class: 'py-5 text-center' },
                      {
                        default: f(() => [
                          l(_, null, {
                            default: f(() => [C('span', null, S(e.$t('COMMON.ERROR_FORBIDDEN_ERROR.LABEL1')), 1)]),
                            _: 1
                          }),
                          l(_, null, {
                            default: f(() => [C('span', null, S(e.$t('COMMON.ERROR_FORBIDDEN_ERROR.LABEL2')), 1)]),
                            _: 1
                          })
                        ]),
                        _: 1
                      }
                    ),
                    l(
                      _,
                      { class: 'text-center py-5' },
                      {
                        default: f(() => [
                          l(
                            ae,
                            { variant: 'text', onClick: e.onClickAction },
                            { default: f(() => [ee(S(e.$t('COMMON.ERROR_FORBIDDEN_ERROR.ACTION')), 1)]), _: 1 },
                            8,
                            ['onClick']
                          )
                        ]),
                        _: 1
                      }
                    )
                  ]),
                  _: 1
                }
              )
            ]),
            _: 1
          }
        )
      ]),
      _: 1
    })
  )
}
const NC = ue(IC, [['render', TC]]),
  wC = Ee({
    name: 'DuplicatedInfoPage',
    methods: {
      onClickAction() {
        window.location.replace(document.baseURI)
      }
    }
  })
function LC(e, t, n, s, r, o) {
  return (
    F(),
    G(dt, null, {
      default: f(() => [
        l(
          _,
          { class: 'd-flex align-center justify-center' },
          {
            default: f(() => [
              l(
                _,
                { 'max-width': '480px' },
                {
                  default: f(() => [
                    l(
                      _,
                      { class: 'my-5 pa-4 text-center' },
                      {
                        default: f(() => [
                          l(lt, { src: e.$config.siteLogo, 'max-width': '360px', class: 'mx-auto' }, null, 8, ['src'])
                        ]),
                        _: 1
                      }
                    ),
                    l(
                      de,
                      {
                        color: 'error',
                        border: 'start',
                        variant: 'tonal',
                        title: e.$t('COMMON.ERROR_DUPLICATED_INFO.TITLE')
                      },
                      {
                        default: f(() => [
                          l(
                            _,
                            { class: 'py-2' },
                            { default: f(() => [ee(S(e.$t('COMMON.ERROR_DUPLICATED_INFO.MESSAGE')), 1)]), _: 1 }
                          )
                        ]),
                        _: 1
                      },
                      8,
                      ['title']
                    ),
                    l(
                      _,
                      { class: 'py-5 text-center' },
                      {
                        default: f(() => [
                          l(_, null, {
                            default: f(() => [C('span', null, S(e.$t('COMMON.ERROR_DUPLICATED_INFO.LABEL1')), 1)]),
                            _: 1
                          }),
                          l(_, null, {
                            default: f(() => [C('span', null, S(e.$t('COMMON.ERROR_DUPLICATED_INFO.LABEL2')), 1)]),
                            _: 1
                          })
                        ]),
                        _: 1
                      }
                    ),
                    l(
                      _,
                      { class: 'text-center py-5' },
                      {
                        default: f(() => [
                          l(
                            ae,
                            { variant: 'text', onClick: e.onClickAction },
                            { default: f(() => [ee(S(e.$t('COMMON.ERROR_DUPLICATED_INFO.ACTION')), 1)]), _: 1 },
                            8,
                            ['onClick']
                          )
                        ]),
                        _: 1
                      }
                    )
                  ]),
                  _: 1
                }
              )
            ]),
            _: 1
          }
        )
      ]),
      _: 1
    })
  )
}
const PC = ue(wC, [['render', LC]]),
  $C = Ee({
    name: 'InvalidRequestPage',
    methods: {
      onClickAction() {
        window.location.replace(document.baseURI)
      }
    }
  })
function MC(e, t, n, s, r, o) {
  return (
    F(),
    G(dt, null, {
      default: f(() => [
        l(
          _,
          { class: 'd-flex align-center justify-center' },
          {
            default: f(() => [
              l(
                _,
                { 'max-width': '480px' },
                {
                  default: f(() => [
                    l(
                      _,
                      { class: 'my-5 pa-4 text-center' },
                      {
                        default: f(() => [
                          l(lt, { src: e.$config.siteLogo, 'max-width': '360px', class: 'mx-auto' }, null, 8, ['src'])
                        ]),
                        _: 1
                      }
                    ),
                    l(
                      de,
                      {
                        color: 'error',
                        border: 'start',
                        variant: 'tonal',
                        title: e.$t('COMMON.ERROR_INVALID_REQUEST.TITLE')
                      },
                      {
                        default: f(() => [
                          l(
                            _,
                            { class: 'py-2' },
                            { default: f(() => [ee(S(e.$t('COMMON.ERROR_INVALID_REQUEST.MESSAGE')), 1)]), _: 1 }
                          )
                        ]),
                        _: 1
                      },
                      8,
                      ['title']
                    ),
                    l(
                      _,
                      { class: 'py-5 text-center' },
                      {
                        default: f(() => [
                          l(_, null, {
                            default: f(() => [C('span', null, S(e.$t('COMMON.ERROR_INVALID_REQUEST.LABEL1')), 1)]),
                            _: 1
                          }),
                          l(_, null, {
                            default: f(() => [C('span', null, S(e.$t('COMMON.ERROR_INVALID_REQUEST.LABEL2')), 1)]),
                            _: 1
                          })
                        ]),
                        _: 1
                      }
                    ),
                    l(
                      _,
                      { class: 'text-center py-5' },
                      {
                        default: f(() => [
                          l(
                            ae,
                            { variant: 'text', onClick: e.onClickAction },
                            { default: f(() => [ee(S(e.$t('COMMON.ERROR_INVALID_REQUEST.ACTION')), 1)]), _: 1 },
                            8,
                            ['onClick']
                          )
                        ]),
                        _: 1
                      }
                    )
                  ]),
                  _: 1
                }
              )
            ]),
            _: 1
          }
        )
      ]),
      _: 1
    })
  )
}
const kC = ue($C, [['render', MC]]),
  DC = Ee({
    name: 'AuthorizeErrorPage',
    methods: {
      onClickAction() {
        window.location.replace(document.baseURI)
      }
    }
  })
function FC(e, t, n, s, r, o) {
  return (
    F(),
    G(dt, null, {
      default: f(() => [
        l(
          _,
          { class: 'd-flex align-center justify-center' },
          {
            default: f(() => [
              l(
                _,
                { 'max-width': '480px' },
                {
                  default: f(() => [
                    l(
                      _,
                      { class: 'my-5 pa-4 text-center' },
                      {
                        default: f(() => [
                          l(lt, { src: e.$config.siteLogo, 'max-width': '360px', class: 'mx-auto' }, null, 8, ['src'])
                        ]),
                        _: 1
                      }
                    ),
                    l(
                      de,
                      {
                        color: 'error',
                        border: 'start',
                        variant: 'tonal',
                        title: e.$t('COMMON.ERROR_AUTHORIZE_ERROR.TITLE')
                      },
                      {
                        default: f(() => [
                          l(
                            _,
                            { class: 'py-2' },
                            { default: f(() => [ee(S(e.$t('COMMON.ERROR_AUTHORIZE_ERROR.MESSAGE')), 1)]), _: 1 }
                          )
                        ]),
                        _: 1
                      },
                      8,
                      ['title']
                    ),
                    l(
                      _,
                      { class: 'py-5 text-center' },
                      {
                        default: f(() => [
                          l(_, null, {
                            default: f(() => [C('span', null, S(e.$t('COMMON.ERROR_AUTHORIZE_ERROR.LABEL1')), 1)]),
                            _: 1
                          }),
                          l(_, null, {
                            default: f(() => [C('span', null, S(e.$t('COMMON.ERROR_AUTHORIZE_ERROR.LABEL2')), 1)]),
                            _: 1
                          })
                        ]),
                        _: 1
                      }
                    ),
                    l(
                      _,
                      { class: 'text-center py-5' },
                      {
                        default: f(() => [
                          l(
                            ae,
                            { variant: 'text', onClick: e.onClickAction },
                            { default: f(() => [ee(S(e.$t('COMMON.ERROR_AUTHORIZE_ERROR.ACTION')), 1)]), _: 1 },
                            8,
                            ['onClick']
                          )
                        ]),
                        _: 1
                      }
                    )
                  ]),
                  _: 1
                }
              )
            ]),
            _: 1
          }
        )
      ]),
      _: 1
    })
  )
}
const VC = ue(DC, [['render', FC]]),
  xC = Ee({
    name: 'NotImplementedPage',
    methods: {
      onClickAction() {
        window.location.replace(document.baseURI)
      }
    }
  })
function BC(e, t, n, s, r, o) {
  return (
    F(),
    G(dt, null, {
      default: f(() => [
        l(
          _,
          { class: 'd-flex align-center justify-center' },
          {
            default: f(() => [
              l(
                _,
                { 'max-width': '480px' },
                {
                  default: f(() => [
                    l(
                      _,
                      { class: 'my-5 pa-4 text-center' },
                      {
                        default: f(() => [
                          l(lt, { src: e.$config.siteLogo, 'max-width': '360px', class: 'mx-auto' }, null, 8, ['src'])
                        ]),
                        _: 1
                      }
                    ),
                    l(
                      de,
                      {
                        color: 'error',
                        border: 'start',
                        variant: 'tonal',
                        title: e.$t('COMMON.ERROR_NOT_IMPLEMENTED.TITLE')
                      },
                      {
                        default: f(() => [
                          l(
                            _,
                            { class: 'py-2' },
                            { default: f(() => [ee(S(e.$t('COMMON.ERROR_NOT_IMPLEMENTED.MESSAGE')), 1)]), _: 1 }
                          )
                        ]),
                        _: 1
                      },
                      8,
                      ['title']
                    ),
                    l(
                      _,
                      { class: 'py-5 text-center' },
                      {
                        default: f(() => [
                          l(_, null, {
                            default: f(() => [C('span', null, S(e.$t('COMMON.ERROR_NOT_IMPLEMENTED.LABEL1')), 1)]),
                            _: 1
                          }),
                          l(_, null, {
                            default: f(() => [C('span', null, S(e.$t('COMMON.ERROR_NOT_IMPLEMENTED.LABEL2')), 1)]),
                            _: 1
                          })
                        ]),
                        _: 1
                      }
                    ),
                    l(
                      _,
                      { class: 'text-center py-5' },
                      {
                        default: f(() => [
                          l(
                            ae,
                            { variant: 'text', onClick: e.onClickAction },
                            { default: f(() => [ee(S(e.$t('COMMON.ERROR_NOT_IMPLEMENTED.ACTION')), 1)]), _: 1 },
                            8,
                            ['onClick']
                          )
                        ]),
                        _: 1
                      }
                    )
                  ]),
                  _: 1
                }
              )
            ]),
            _: 1
          }
        )
      ]),
      _: 1
    })
  )
}
const UC = ue(xC, [['render', BC]]),
  GC = ie(
    {
      start: Boolean,
      end: Boolean,
      icon: ct,
      image: String,
      text: String,
      ...Qe(),
      ...Bn(),
      ...ln(),
      ...mo(),
      ...Jt(),
      ...Ot(),
      ...Ps({ variant: 'flat' })
    },
    'VAvatar'
  ),
  la = Ae()({
    name: 'VAvatar',
    props: GC(),
    setup(e, t) {
      let { slots: n } = t
      const { themeClasses: s } = Pt(e),
        { colorClasses: r, colorStyles: o, variantClasses: a } = fo(e),
        { densityClasses: i } = ws(e),
        { roundedClasses: u } = mn(e),
        { sizeClasses: c, sizeStyles: d } = Ua(e)
      return (
        Ve(() =>
          l(
            e.tag,
            {
              class: [
                'v-avatar',
                { 'v-avatar--start': e.start, 'v-avatar--end': e.end },
                s.value,
                r.value,
                i.value,
                u.value,
                c.value,
                a.value,
                e.class
              ],
              style: [o.value, d.value, e.style]
            },
            {
              default: () => [
                n.default
                  ? l(
                      dn,
                      {
                        key: 'content-defaults',
                        defaults: { VImg: { cover: !0, image: e.image }, VIcon: { icon: e.icon } }
                      },
                      { default: () => [n.default()] }
                    )
                  : e.image
                    ? l(lt, { key: 'image', src: e.image, alt: '', cover: !0 }, null)
                    : e.icon
                      ? l(mt, { key: 'icon', icon: e.icon }, null)
                      : e.text,
                co(!1, 'v-avatar')
              ]
            }
          )
        ),
        {}
      )
    }
  }),
  Ng = Ae()({
    name: 'VCardActions',
    props: Qe(),
    setup(e, t) {
      let { slots: n } = t
      return (
        Is({ VBtn: { slim: !0, variant: 'text' } }),
        Ve(() => {
          var s
          return l('div', { class: ['v-card-actions', e.class], style: e.style }, [
            (s = n.default) == null ? void 0 : s.call(n)
          ])
        }),
        {}
      )
    }
  }),
  WC = lo('v-card-subtitle'),
  wg = lo('v-card-title'),
  HC = ie(
    {
      appendAvatar: String,
      appendIcon: ct,
      prependAvatar: String,
      prependIcon: ct,
      subtitle: [String, Number],
      title: [String, Number],
      ...Qe(),
      ...Bn()
    },
    'VCardItem'
  ),
  jC = Ae()({
    name: 'VCardItem',
    props: HC(),
    setup(e, t) {
      let { slots: n } = t
      return (
        Ve(() => {
          var c
          const s = !!(e.prependAvatar || e.prependIcon),
            r = !!(s || n.prepend),
            o = !!(e.appendAvatar || e.appendIcon),
            a = !!(o || n.append),
            i = !!(e.title != null || n.title),
            u = !!(e.subtitle != null || n.subtitle)
          return l('div', { class: ['v-card-item', e.class], style: e.style }, [
            r &&
              l('div', { key: 'prepend', class: 'v-card-item__prepend' }, [
                n.prepend
                  ? l(
                      dn,
                      {
                        key: 'prepend-defaults',
                        disabled: !s,
                        defaults: {
                          VAvatar: { density: e.density, image: e.prependAvatar },
                          VIcon: { density: e.density, icon: e.prependIcon }
                        }
                      },
                      n.prepend
                    )
                  : l(Ue, null, [
                      e.prependAvatar &&
                        l(la, { key: 'prepend-avatar', density: e.density, image: e.prependAvatar }, null),
                      e.prependIcon && l(mt, { key: 'prepend-icon', density: e.density, icon: e.prependIcon }, null)
                    ])
              ]),
            l('div', { class: 'v-card-item__content' }, [
              i &&
                l(
                  wg,
                  { key: 'title' },
                  {
                    default: () => {
                      var d
                      return [((d = n.title) == null ? void 0 : d.call(n)) ?? e.title]
                    }
                  }
                ),
              u &&
                l(
                  WC,
                  { key: 'subtitle' },
                  {
                    default: () => {
                      var d
                      return [((d = n.subtitle) == null ? void 0 : d.call(n)) ?? e.subtitle]
                    }
                  }
                ),
              (c = n.default) == null ? void 0 : c.call(n)
            ]),
            a &&
              l('div', { key: 'append', class: 'v-card-item__append' }, [
                n.append
                  ? l(
                      dn,
                      {
                        key: 'append-defaults',
                        disabled: !o,
                        defaults: {
                          VAvatar: { density: e.density, image: e.appendAvatar },
                          VIcon: { density: e.density, icon: e.appendIcon }
                        }
                      },
                      n.append
                    )
                  : l(Ue, null, [
                      e.appendIcon && l(mt, { key: 'append-icon', density: e.density, icon: e.appendIcon }, null),
                      e.appendAvatar && l(la, { key: 'append-avatar', density: e.density, image: e.appendAvatar }, null)
                    ])
              ])
          ])
        }),
        {}
      )
    }
  }),
  Lg = lo('v-card-text'),
  YC = ie(
    {
      appendAvatar: String,
      appendIcon: ct,
      disabled: Boolean,
      flat: Boolean,
      hover: Boolean,
      image: String,
      link: { type: Boolean, default: void 0 },
      prependAvatar: String,
      prependIcon: ct,
      ripple: { type: [Boolean, Object], default: !0 },
      subtitle: [String, Number],
      text: [String, Number],
      title: [String, Number],
      ...gr(),
      ...Qe(),
      ...Bn(),
      ...$s(),
      ...Ls(),
      ...du(),
      ...Er(),
      ...go(),
      ...ln(),
      ...pg(),
      ...Jt(),
      ...Ot(),
      ...Ps({ variant: 'elevated' })
    },
    'VCard'
  ),
  we = Ae()({
    name: 'VCard',
    directives: { Ripple: mu },
    props: YC(),
    setup(e, t) {
      let { attrs: n, slots: s } = t
      const { themeClasses: r } = Pt(e),
        { borderClasses: o } = uo(e),
        { colorClasses: a, colorStyles: i, variantClasses: u } = fo(e),
        { densityClasses: c } = ws(e),
        { dimensionStyles: d } = Ms(e),
        { elevationClasses: m } = pr(e),
        { loaderClasses: h } = fu(e),
        { locationStyles: E } = _r(e),
        { positionClasses: y } = po(e),
        { roundedClasses: v } = mn(e),
        I = gg(e, n),
        b = M(() => e.link !== !1 && I.isLink.value),
        O = M(() => !e.disabled && e.link !== !1 && (e.link || I.isClickable.value))
      return (
        Ve(() => {
          const P = b.value ? 'a' : e.tag,
            T = !!(s.title || e.title != null),
            $ = !!(s.subtitle || e.subtitle != null),
            L = T || $,
            N = !!(s.append || e.appendAvatar || e.appendIcon),
            A = !!(s.prepend || e.prependAvatar || e.prependIcon),
            w = !!(s.image || e.image),
            B = L || A || N,
            j = !!(s.text || e.text != null)
          return vt(
            l(
              P,
              {
                class: [
                  'v-card',
                  {
                    'v-card--disabled': e.disabled,
                    'v-card--flat': e.flat,
                    'v-card--hover': e.hover && !(e.disabled || e.flat),
                    'v-card--link': O.value
                  },
                  r.value,
                  o.value,
                  a.value,
                  c.value,
                  m.value,
                  h.value,
                  y.value,
                  v.value,
                  u.value,
                  e.class
                ],
                style: [i.value, d.value, E.value, e.style],
                href: I.href.value,
                onClick: O.value && I.navigate,
                tabindex: e.disabled ? -1 : void 0
              },
              {
                default: () => {
                  var D
                  return [
                    w &&
                      l('div', { key: 'image', class: 'v-card__image' }, [
                        s.image
                          ? l(
                              dn,
                              {
                                key: 'image-defaults',
                                disabled: !e.image,
                                defaults: { VImg: { cover: !0, src: e.image } }
                              },
                              s.image
                            )
                          : l(lt, { key: 'image-img', cover: !0, src: e.image }, null)
                      ]),
                    l(
                      hg,
                      {
                        name: 'v-card',
                        active: !!e.loading,
                        color: typeof e.loading == 'boolean' ? void 0 : e.loading
                      },
                      { default: s.loader }
                    ),
                    B &&
                      l(
                        jC,
                        {
                          key: 'item',
                          prependAvatar: e.prependAvatar,
                          prependIcon: e.prependIcon,
                          title: e.title,
                          subtitle: e.subtitle,
                          appendAvatar: e.appendAvatar,
                          appendIcon: e.appendIcon
                        },
                        { default: s.item, prepend: s.prepend, title: s.title, subtitle: s.subtitle, append: s.append }
                      ),
                    j &&
                      l(
                        Lg,
                        { key: 'text' },
                        {
                          default: () => {
                            var U
                            return [((U = s.text) == null ? void 0 : U.call(s)) ?? e.text]
                          }
                        }
                      ),
                    (D = s.default) == null ? void 0 : D.call(s),
                    s.actions && l(Ng, null, { default: s.actions }),
                    co(O.value, 'v-card')
                  ]
                }
              }
            ),
            [[dr('ripple'), O.value && e.ripple]]
          )
        }),
        {}
      )
    }
  }),
  KC = ie(
    {
      color: String,
      inset: Boolean,
      length: [Number, String],
      thickness: [Number, String],
      vertical: Boolean,
      ...Qe(),
      ...Ot()
    },
    'VDivider'
  ),
  qe = Ae()({
    name: 'VDivider',
    props: KC(),
    setup(e, t) {
      let { attrs: n } = t
      const { themeClasses: s } = Pt(e),
        { textColorClasses: r, textColorStyles: o } = Fn(De(e, 'color')),
        a = M(() => {
          const i = {}
          return (
            e.length && (i[e.vertical ? 'maxHeight' : 'maxWidth'] = Te(e.length)),
            e.thickness && (i[e.vertical ? 'borderRightWidth' : 'borderTopWidth'] = Te(e.thickness)),
            i
          )
        })
      return (
        Ve(() =>
          l(
            'hr',
            {
              class: [
                { 'v-divider': !0, 'v-divider--inset': e.inset, 'v-divider--vertical': e.vertical },
                s.value,
                r.value,
                e.class
              ],
              style: [a.value, o.value, e.style],
              'aria-orientation': !n.role || n.role === 'separator' ? (e.vertical ? 'vertical' : 'horizontal') : void 0,
              role: `${n.role || 'separator'}`
            },
            null
          )
        ),
        {}
      )
    }
  }),
  qC = {
    name: 'AccountView',
    data() {
      return { showSuccessAlert: !0 }
    },
    computed: {
      ...Ke(gt, ['account']),
      isMobile() {
        const { sm: e, xs: t } = this.$vuetify.display
        return t || e
      }
    },
    methods: {
      onClickSignin() {
        this.$router.push({ name: 'SigninPage' })
      },
      onClickSignup() {
        this.$router.push({ name: 'SignupRequestPage' })
      },
      onClickReset() {
        this.$router.push({ name: 'ResetRequestPage' })
      },
      onClickSignout() {
        window.location.replace(`${this.$config.siteHost}/logout`)
      },
      onClickProfile() {
        window.location.replace(`${this.$config.userPortal}`)
      },
      onClickPassword() {
        window.location.replace(`${this.$config.userPortal}/password`)
      },
      onClickNotify() {
        window.location.replace(`${this.$config.userPortal}/notify`)
      },
      onClickChatting() {
        window.location.replace(`${this.$config.userPortal}/message`)
      },
      onClickGoToHome() {
        window.location.replace(`${this.$config.mainPortal}`)
      }
    }
  },
  zC = { key: 1, class: 'text-h4 text-secondary font-weight-bold' },
  XC = { class: 'text-h6 font-weight-medium text-secondary' },
  JC = { class: 'font-weight-medium text-primary' },
  QC = { class: 'text-primary font-weight-medium' },
  ZC = { class: 'text-primary font-weight-medium' },
  eA = { class: 'text-primary font-weight-medium' },
  tA = { class: 'text-primary font-weight-medium' },
  nA = { class: 'text-primary font-weight-medium' },
  sA = { class: 'text-h4 text-grey font-weight-bold' },
  rA = { class: 'text-h6 font-weight-medium text-grey' },
  oA = { class: 'text-primary font-weight-medium' },
  aA = { class: 'text-primary font-weight-medium' },
  iA = { class: 'text-primary font-weight-medium' }
function lA(e, t, n, s, r, o) {
  return (
    F(),
    G(
      _,
      { class: 'pt-5 mx-n2 mx-md-0' },
      {
        default: f(() => [
          e.account && e.account.cid
            ? (F(),
              G(
                we,
                { key: 0, class: 'pa-4' },
                {
                  default: f(() => [
                    l(
                      _,
                      { class: 'text-center' },
                      {
                        default: f(() => [
                          l(
                            la,
                            { class: 'border', size: '140' },
                            {
                              default: f(() => [
                                e.account.avatar
                                  ? (F(), G(lt, { key: 0, src: e.account.avatar }, null, 8, ['src']))
                                  : (F(), Ne('span', zC, S(e.$filters.avatar(e.account.displayName)), 1))
                              ]),
                              _: 1
                            }
                          )
                        ]),
                        _: 1
                      }
                    ),
                    l(
                      _,
                      { class: 'pt-2 text-center' },
                      {
                        default: f(() => {
                          var a
                          return [C('span', XC, S((a = e.account) == null ? void 0 : a.displayName), 1)]
                        }),
                        _: 1
                      }
                    ),
                    l(
                      _,
                      { class: 'text-center' },
                      {
                        default: f(() => {
                          var a
                          return [C('span', JC, S((a = e.account) == null ? void 0 : a.username), 1)]
                        }),
                        _: 1
                      }
                    ),
                    l(
                      _,
                      { class: 'pt-2 text-center' },
                      {
                        default: f(() => [
                          l(
                            ae,
                            {
                              variant: 'outlined',
                              density: 'compact',
                              color: 'red',
                              'append-icon': 'mdi-exit-to-app',
                              onClick: o.onClickSignout
                            },
                            { default: f(() => [ee(S(e.$t('INDEX_PAGE.ACTION.SIGNOUT')), 1)]), _: 1 },
                            8,
                            ['onClick']
                          )
                        ]),
                        _: 1
                      }
                    ),
                    l(qe, { class: 'my-5' }),
                    l(
                      we,
                      { class: 'my-2 border px-4 py-2 d-flex align-center justify-start', onClick: o.onClickChatting },
                      {
                        default: f(() => [
                          l(_, null, {
                            default: f(() => [l(mt, { color: 'primary', icon: 'mdi mdi-message-processing-outline' })]),
                            _: 1
                          }),
                          l(
                            _,
                            { class: 'pl-2' },
                            { default: f(() => [C('span', QC, S(e.$t('INDEX_PAGE.ACTION.NEW_MESSAGES')), 1)]), _: 1 }
                          )
                        ]),
                        _: 1
                      },
                      8,
                      ['onClick']
                    ),
                    l(
                      we,
                      { class: 'my-2 border px-4 py-2 d-flex align-center justify-start', onClick: o.onClickNotify },
                      {
                        default: f(() => [
                          l(_, null, {
                            default: f(() => [l(mt, { color: 'primary', icon: 'mdi mdi-bell-outline' })]),
                            _: 1
                          }),
                          l(
                            _,
                            { class: 'pl-2' },
                            {
                              default: f(() => [C('span', ZC, S(e.$t('INDEX_PAGE.ACTION.NEW_NOTIFICATIONS')), 1)]),
                              _: 1
                            }
                          )
                        ]),
                        _: 1
                      },
                      8,
                      ['onClick']
                    ),
                    l(
                      we,
                      { class: 'my-2 border px-4 py-2 d-flex align-center justify-start', onClick: o.onClickProfile },
                      {
                        default: f(() => [
                          l(_, null, {
                            default: f(() => [l(mt, { color: 'primary', icon: 'mdi-account-outline' })]),
                            _: 1
                          }),
                          l(
                            _,
                            { class: 'pl-2' },
                            {
                              default: f(() => [C('span', eA, S(e.$t('INDEX_PAGE.ACTION.ACCOUNT_INFORMATION')), 1)]),
                              _: 1
                            }
                          )
                        ]),
                        _: 1
                      },
                      8,
                      ['onClick']
                    ),
                    l(
                      we,
                      { class: 'my-2 border px-4 py-2 d-flex align-center justify-start', onClick: o.onClickPassword },
                      {
                        default: f(() => [
                          l(_, null, {
                            default: f(() => [l(mt, { color: 'primary', icon: 'mdi-lock-outline' })]),
                            _: 1
                          }),
                          l(
                            _,
                            { class: 'pl-2' },
                            { default: f(() => [C('span', tA, S(e.$t('INDEX_PAGE.ACTION.CHANGE_PASSWORD')), 1)]), _: 1 }
                          )
                        ]),
                        _: 1
                      },
                      8,
                      ['onClick']
                    ),
                    l(
                      we,
                      { class: 'my-2 border px-4 py-2 d-flex align-center justify-start', onClick: o.onClickGoToHome },
                      {
                        default: f(() => [
                          l(_, null, { default: f(() => [l(mt, { color: 'primary', icon: 'mdi mdi-web' })]), _: 1 }),
                          l(
                            _,
                            { class: 'pl-2' },
                            { default: f(() => [C('span', nA, S(e.$t('INDEX_PAGE.ACTION.GO_TO_HOME')), 1)]), _: 1 }
                          )
                        ]),
                        _: 1
                      },
                      8,
                      ['onClick']
                    )
                  ]),
                  _: 1
                }
              ))
            : (F(),
              G(
                we,
                { key: 1, class: 'pa-4' },
                {
                  default: f(() => [
                    l(
                      _,
                      { class: 'text-center' },
                      {
                        default: f(() => [
                          l(
                            la,
                            { class: 'border', size: '140' },
                            { default: f(() => [C('span', sA, S(e.$filters.avatar('U')), 1)]), _: 1 }
                          )
                        ]),
                        _: 1
                      }
                    ),
                    l(
                      _,
                      { class: 'pt-2 text-center' },
                      { default: f(() => [C('span', rA, S(e.$t('INDEX_PAGE.SUBTITLE.NOT_SIGNIN_YET')), 1)]), _: 1 }
                    ),
                    l(
                      _,
                      { class: 'pt-2 text-center' },
                      {
                        default: f(() => [
                          l(
                            ae,
                            {
                              variant: 'outlined',
                              density: 'compact',
                              'prepend-icon': 'mdi mdi-login',
                              onClick: o.onClickSignin
                            },
                            { default: f(() => [ee(S(e.$t('INDEX_PAGE.ACTION.SIGNIN')), 1)]), _: 1 },
                            8,
                            ['onClick']
                          )
                        ]),
                        _: 1
                      }
                    ),
                    l(qe, { class: 'my-5' }),
                    l(
                      we,
                      { class: 'my-2 border px-4 py-2 d-flex align-center justify-start', onClick: o.onClickSignup },
                      {
                        default: f(() => [
                          l(_, null, {
                            default: f(() => [l(mt, { color: 'primary', icon: 'mdi mdi-account-outline' })]),
                            _: 1
                          }),
                          l(
                            _,
                            { class: 'pl-2' },
                            {
                              default: f(() => [C('span', oA, S(e.$t('INDEX_PAGE.ACTION.REGISTRY_NEW_ACCOUNT')), 1)]),
                              _: 1
                            }
                          )
                        ]),
                        _: 1
                      },
                      8,
                      ['onClick']
                    ),
                    l(
                      we,
                      { class: 'my-2 border px-4 py-2 d-flex align-center justify-start', onClick: o.onClickReset },
                      {
                        default: f(() => [
                          l(_, null, {
                            default: f(() => [l(mt, { color: 'primary', icon: 'mdi mdi-form-textbox-password' })]),
                            _: 1
                          }),
                          l(
                            _,
                            { class: 'pl-2' },
                            {
                              default: f(() => [C('span', aA, S(e.$t('INDEX_PAGE.ACTION.RESET_YOUR_PASSWORD')), 1)]),
                              _: 1
                            }
                          )
                        ]),
                        _: 1
                      },
                      8,
                      ['onClick']
                    ),
                    l(
                      we,
                      { class: 'my-2 border px-4 py-2 d-flex align-center justify-start', onClick: o.onClickGoToHome },
                      {
                        default: f(() => [
                          l(_, null, { default: f(() => [l(mt, { color: 'primary', icon: 'mdi mdi-web' })]), _: 1 }),
                          l(
                            _,
                            { class: 'pl-2' },
                            { default: f(() => [C('span', iA, S(e.$t('INDEX_PAGE.ACTION.GO_TO_HOME')), 1)]), _: 1 }
                          )
                        ]),
                        _: 1
                      },
                      8,
                      ['onClick']
                    )
                  ]),
                  _: 1
                }
              ))
        ]),
        _: 1
      }
    )
  )
}
const uA = ue(qC, [['render', lA]]),
  cA = {
    list: [
      {
        id: '88ded577-b593-4387-a180-a989d49b383d',
        name: 'Nhà Phố Đẹp Nhà Phố Đẹp Nhà Phố Đẹp Nhà Phố Đẹp Nhà Phố Đẹp Nhà Phố Đẹp',
        image: '',
        status: 'READY',
        domain: 'https://nha-pho-dep-nha-pho-dep-nha-pho-dep-nha-pho-dep.cvgbuilding.vn',
        description:
          'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.'
      },
      {
        id: '88ded577-b593-4387-a180-a989d49b383d',
        name: 'Nhà Phố Đẹp',
        image: 'https://tostemvietnam.com/wp-content/uploads/2023/06/nha-pho-dep-1.png',
        status: 'WORKING',
        domain: 'https://nha-pho-dep.cvgbuilding.vn',
        description:
          'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.'
      },
      {
        id: '88ded577-b593-4387-a180-a989d49b383d',
        name: 'Nhà Phố Đẹp',
        image: 'https://tostemvietnam.com/wp-content/uploads/2023/06/nha-pho-dep-1.png',
        status: 'WORKING',
        domain: 'https://nha-pho-dep.cvgbuilding.vn',
        description:
          'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.'
      },
      {
        id: '88ded577-b593-4387-a180-a989d49b383d',
        name: 'Nhà Phố Đẹp',
        image: 'https://tostemvietnam.com/wp-content/uploads/2023/06/nha-pho-dep-1.png',
        status: 'LOCKED',
        domain: 'https://nha-pho-dep.cvgbuilding.vn',
        description:
          'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.'
      },
      {
        id: '88ded577-b593-4387-a180-a989d49b383d',
        name: 'Nhà Phố Đẹp',
        image: 'https://tostemvietnam.com/wp-content/uploads/2023/06/nha-pho-dep-1.png',
        status: 'WORKING',
        domain: 'https://nha-pho-dep.cvgbuilding.vn',
        description:
          'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.'
      },
      {
        id: '88ded577-b593-4387-a180-a989d49b383d',
        name: 'Nhà Phố Đẹp',
        image: 'https://tostemvietnam.com/wp-content/uploads/2023/06/nha-pho-dep-1.png',
        status: 'WORKING',
        domain: 'https://nha-pho-dep.cvgbuilding.vn',
        description:
          'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.'
      }
    ],
    paginator: { totalItems: 103, totalPages: 10, pageSize: 10, pageNo: 1 },
    hasData: !0
  },
  dA = () =>
    new Promise(e => {
      setTimeout(() => {
        e({ headers: {}, data: cA })
      }, 200)
    }),
  fA = () =>
    new Promise(e => {
      setTimeout(() => {
        e({ headers: {}, data: {} })
      }, 200)
    }),
  nf = { get: dA, post: fA },
  sf = jt({
    id: 'IndexStore',
    state: () => ({
      status: 'READY',
      errorObject: !1,
      hasData: !1,
      showFilter: !1,
      filter: { text: '', status: '', owner: '' },
      list: [],
      paginator: { totalItems: 0, totalPages: 1, pageSize: 10, pageNo: 1 },
      isReloading: !1
    }),
    getters: {
      hasFilter() {
        return (
          (this.filter.text && this.filter.text.trim()) ||
          (this.filter.status && this.filter.status.trim()) ||
          (this.filter.owner && this.filter.owner.trim())
        )
      }
    },
    actions: {
      async initial() {
        try {
          const e = await nf.get()
          ;(console.log('initial'),
            e.headers.code
              ? ((this.error = new Error(e.data.message)), (this.status = 'ERROR'))
              : ((this.list = e.data.list),
                (this.paginator = e.data.paginator),
                (this.hasData = e.data.hasData),
                (this.status = 'WORKING')))
        } catch (e) {
          ;(console.error(e), (this.error = e), (this.status = 'ERROR'))
        }
      },
      async reload() {
        try {
          this.isReloading = !0
          const e = { pageSize: this.paginator.pageSize, pageNo: this.paginator.pageNo }
          ;(this.filter.text && this.filter.text.trim() && (e.text = this.filter.text.trim()),
            this.filter.status && this.filter.status.trim() && (e.status = this.filter.status.trim()),
            this.filter.owner && this.filter.owner.trim() && (e.owner = this.filter.owner.trim()),
            console.log(e))
          const t = await nf.get(e)
          ;(console.log('reload'),
            t.headers.code ||
              ((this.list = t.data.list), (this.paginator = t.data.paginator), (this.hasData = t.data.hasData)),
            (this.isReloading = !1))
        } catch (e) {
          ;(console.error(e), (this.isReloading = !1))
        }
      },
      search() {
        ;((this.paginator = { totalItems: 0, totalPages: 1, pageSize: 10, pageNo: 1 }), this.reload())
      },
      showError(e) {
        ;((this.status = 'ERROR'), (this.errorObject = e))
      },
      destroy() {
        this.status = 'READY'
      }
    }
  }),
  mA = Ee({
    name: 'IndexPage',
    components: { AccountView: uA },
    data() {
      return {}
    },
    computed: {
      ...Ke(sf, ['status', 'errorObject']),
      isMobile() {
        const { sm: e, xs: t } = this.$vuetify.display
        return t || e
      }
    },
    methods: { ...Ye(sf, ['initial', 'showError', 'destroy']) },
    mounted() {
      this.initial()
    },
    unmounted() {
      this.destroy()
    },
    errorCaptured(e) {
      this.showError(e)
    }
  })
function hA(e, t, n, s, r, o) {
  const a = he('s-page-loading'),
    i = he('s-page-error'),
    u = he('account-view')
  return e.status === 'READY'
    ? (F(), G(a, { key: 0 }))
    : e.status === 'ERROR'
      ? (F(), G(i, { key: 1, error: e.errorObject }, null, 8, ['error']))
      : e.status === 'WORKING'
        ? (F(),
          G(
            dt,
            { key: 2, class: 'overflow-hidden' },
            {
              default: f(() => [
                l(
                  _,
                  { width: '100%', 'max-width': '480px', class: 'mx-auto text-left' },
                  {
                    default: f(() => [
                      l(
                        _,
                        { class: 'pa-4 text-center' },
                        {
                          default: f(() => [
                            l(lt, { src: e.$config.siteLogo, 'max-width': '360px', class: 'mx-auto' }, null, 8, ['src'])
                          ]),
                          _: 1
                        }
                      ),
                      l(u)
                    ]),
                    _: 1
                  }
                )
              ]),
              _: 1
            }
          ))
        : We('', !0)
}
const gA = ue(mA, [['render', hA]]),
  pA = e => {
    const t = {}
    return (
      Object.keys(e).forEach(n => {
        const s = e[n]
        t[n] = typeof s == 'string' ? s.trim() : s
      }),
      t
    )
  },
  kr = jt({
    id: 'SigninStore',
    state: () => ({
      status: 'READY',
      errorObject: !1,
      isValid: !1,
      form: { username: '', password: '' },
      isSubmittingForm: !1,
      submitFormErrorCode: !1,
      submitFormSuccessResult: !1
    }),
    actions: {
      async initial() {
        var e, t, n
        try {
          this.status = 'WORKING'
        } catch (s) {
          const r = new Error(`[${s.code}] ${s.message}`)
          ;((r.message = s.message || ((t = (e = s.response) == null ? void 0 : e.data) == null ? void 0 : t.message)),
            (r.code = ((n = s.response) == null ? void 0 : n.status) || s.code),
            (this.errorObject = r),
            (this.status = 'ERROR'))
        }
      },
      async submit() {
        var e, t
        try {
          ;((this.submitFormSuccessResult = !1), (this.submitFormErrorCode = !1), (this.isSubmittingForm = !0))
          const n = pA(this.form),
            s = await Oe.post('/signin', n)
          ;(s.headers.code ? (this.submitFormErrorCode = s.headers.code) : (this.submitFormSuccessResult = s.data),
            (this.isSubmittingForm = !1))
        } catch (n) {
          ;(console.error(n),
            (this.submitFormErrorCode =
              ((t = (e = n.response) == null ? void 0 : e.headers) == null ? void 0 : t.code) || !0),
            (this.isSubmittingForm = !1))
        }
      },
      showError(e) {
        ;((this.status = 'ERROR'), (this.errorObject = e))
      },
      destroy() {
        this.$reset()
      }
    }
  }),
  Pg = Symbol.for('vuetify:form'),
  EA = ie(
    {
      disabled: Boolean,
      fastFail: Boolean,
      readonly: Boolean,
      modelValue: { type: Boolean, default: null },
      validateOn: { type: String, default: 'input' }
    },
    'form'
  )
function _A(e) {
  const t = Nt(e, 'modelValue'),
    n = M(() => e.disabled),
    s = M(() => e.readonly),
    r = je(!1),
    o = _e([]),
    a = _e([])
  async function i() {
    const d = []
    let m = !0
    ;((a.value = []), (r.value = !0))
    for (const h of o.value) {
      const E = await h.validate()
      if ((E.length > 0 && ((m = !1), d.push({ id: h.id, errorMessages: E })), !m && e.fastFail)) break
    }
    return ((a.value = d), (r.value = !1), { valid: m, errors: a.value })
  }
  function u() {
    o.value.forEach(d => d.reset())
  }
  function c() {
    o.value.forEach(d => d.resetValidation())
  }
  return (
    be(
      o,
      () => {
        let d = 0,
          m = 0
        const h = []
        for (const E of o.value)
          E.isValid === !1 ? (m++, h.push({ id: E.id, errorMessages: E.errorMessages })) : E.isValid === !0 && d++
        ;((a.value = h), (t.value = m > 0 ? !1 : d === o.value.length ? !0 : null))
      },
      { deep: !0, flush: 'post' }
    ),
    Ut(Pg, {
      register: d => {
        let { id: m, validate: h, reset: E, resetValidation: y } = d
        ;(o.value.some(v => v.id === m),
          o.value.push({ id: m, validate: h, reset: E, resetValidation: y, isValid: null, errorMessages: [] }))
      },
      unregister: d => {
        o.value = o.value.filter(m => m.id !== d)
      },
      update: (d, m, h) => {
        const E = o.value.find(y => y.id === d)
        E && ((E.isValid = m), (E.errorMessages = h))
      },
      isDisabled: n,
      isReadonly: s,
      isValidating: r,
      isValid: t,
      items: o,
      validateOn: De(e, 'validateOn')
    }),
    {
      errors: a,
      isDisabled: n,
      isReadonly: s,
      isValidating: r,
      isValid: t,
      items: o,
      validate: i,
      reset: u,
      resetValidation: c
    }
  )
}
function yA() {
  return it(Pg, null)
}
const _i = Symbol('Forwarded refs')
function yi(e, t) {
  let n = e
  for (; n; ) {
    const s = Reflect.getOwnPropertyDescriptor(n, t)
    if (s) return s
    n = Object.getPrototypeOf(n)
  }
}
function ja(e) {
  for (var t = arguments.length, n = new Array(t > 1 ? t - 1 : 0), s = 1; s < t; s++) n[s - 1] = arguments[s]
  return (
    (e[_i] = n),
    new Proxy(e, {
      get(r, o) {
        if (Reflect.has(r, o)) return Reflect.get(r, o)
        if (!(typeof o == 'symbol' || o.startsWith('$') || o.startsWith('__'))) {
          for (const a of n)
            if (a.value && Reflect.has(a.value, o)) {
              const i = Reflect.get(a.value, o)
              return typeof i == 'function' ? i.bind(a.value) : i
            }
        }
      },
      has(r, o) {
        if (Reflect.has(r, o)) return !0
        if (typeof o == 'symbol' || o.startsWith('$') || o.startsWith('__')) return !1
        for (const a of n) if (a.value && Reflect.has(a.value, o)) return !0
        return !1
      },
      set(r, o, a) {
        if (Reflect.has(r, o)) return Reflect.set(r, o, a)
        if (typeof o == 'symbol' || o.startsWith('$') || o.startsWith('__')) return !1
        for (const i of n) if (i.value && Reflect.has(i.value, o)) return Reflect.set(i.value, o, a)
        return !1
      },
      getOwnPropertyDescriptor(r, o) {
        var i
        const a = Reflect.getOwnPropertyDescriptor(r, o)
        if (a) return a
        if (!(typeof o == 'symbol' || o.startsWith('$') || o.startsWith('__'))) {
          for (const u of n) {
            if (!u.value) continue
            const c =
              yi(u.value, o) ?? ('_' in u.value ? yi((i = u.value._) == null ? void 0 : i.setupState, o) : void 0)
            if (c) return c
          }
          for (const u of n) {
            const c = u.value && u.value[_i]
            if (!c) continue
            const d = c.slice()
            for (; d.length; ) {
              const m = d.shift(),
                h = yi(m.value, o)
              if (h) return h
              const E = m.value && m.value[_i]
              E && d.push(...E)
            }
          }
        }
      }
    })
  )
}
const vA = ie({ ...Qe(), ...EA() }, 'VForm'),
  Un = Ae()({
    name: 'VForm',
    props: vA(),
    emits: { 'update:modelValue': e => !0, submit: e => !0 },
    setup(e, t) {
      let { slots: n, emit: s } = t
      const r = _A(e),
        o = _e()
      function a(u) {
        ;(u.preventDefault(), r.reset())
      }
      function i(u) {
        const c = u,
          d = r.validate()
        ;((c.then = d.then.bind(d)),
          (c.catch = d.catch.bind(d)),
          (c.finally = d.finally.bind(d)),
          s('submit', c),
          c.defaultPrevented ||
            d.then(m => {
              var E
              let { valid: h } = m
              h && ((E = o.value) == null || E.submit())
            }),
          c.preventDefault())
      }
      return (
        Ve(() => {
          var u
          return l(
            'form',
            { ref: o, class: ['v-form', e.class], style: e.style, novalidate: !0, onReset: a, onSubmit: i },
            [(u = n.default) == null ? void 0 : u.call(n, r)]
          )
        }),
        ja(r, o)
      )
    }
  }),
  bA = ie(
    { disabled: Boolean, group: Boolean, hideOnLeave: Boolean, leaveAbsolute: Boolean, mode: String, origin: String },
    'transition'
  )
function Qt(e, t, n) {
  return Ae()({
    name: e,
    props: bA({ mode: n, origin: t }),
    setup(s, r) {
      let { slots: o } = r
      const a = {
        onBeforeEnter(i) {
          s.origin && (i.style.transformOrigin = s.origin)
        },
        onLeave(i) {
          if (s.leaveAbsolute) {
            const { offsetTop: u, offsetLeft: c, offsetWidth: d, offsetHeight: m } = i
            ;((i._transitionInitialStyles = {
              position: i.style.position,
              top: i.style.top,
              left: i.style.left,
              width: i.style.width,
              height: i.style.height
            }),
              (i.style.position = 'absolute'),
              (i.style.top = `${u}px`),
              (i.style.left = `${c}px`),
              (i.style.width = `${d}px`),
              (i.style.height = `${m}px`))
          }
          s.hideOnLeave && i.style.setProperty('display', 'none', 'important')
        },
        onAfterLeave(i) {
          if (s.leaveAbsolute && i != null && i._transitionInitialStyles) {
            const { position: u, top: c, left: d, width: m, height: h } = i._transitionInitialStyles
            ;(delete i._transitionInitialStyles,
              (i.style.position = u || ''),
              (i.style.top = c || ''),
              (i.style.left = d || ''),
              (i.style.width = m || ''),
              (i.style.height = h || ''))
          }
        }
      }
      return () => {
        const i = s.group ? $m : Dn
        return Rn(
          i,
          {
            name: s.disabled ? '' : e,
            css: !s.disabled,
            ...(s.group ? void 0 : { mode: s.mode }),
            ...(s.disabled ? {} : a)
          },
          o.default
        )
      }
    }
  })
}
function $g(e, t) {
  let n = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : 'in-out'
  return Ae()({
    name: e,
    props: { mode: { type: String, default: n }, disabled: Boolean },
    setup(s, r) {
      let { slots: o } = r
      return () => Rn(Dn, { name: s.disabled ? '' : e, css: !s.disabled, ...(s.disabled ? {} : t) }, o.default)
    }
  })
}
function Mg() {
  let e = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : ''
  const n = (arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : !1) ? 'width' : 'height',
    s = on(`offset-${n}`)
  return {
    onBeforeEnter(a) {
      ;((a._parent = a.parentNode),
        (a._initialStyle = { transition: a.style.transition, overflow: a.style.overflow, [n]: a.style[n] }))
    },
    onEnter(a) {
      const i = a._initialStyle
      ;(a.style.setProperty('transition', 'none', 'important'), (a.style.overflow = 'hidden'))
      const u = `${a[s]}px`
      ;((a.style[n] = '0'),
        a.offsetHeight,
        (a.style.transition = i.transition),
        e && a._parent && a._parent.classList.add(e),
        requestAnimationFrame(() => {
          a.style[n] = u
        }))
    },
    onAfterEnter: o,
    onEnterCancelled: o,
    onLeave(a) {
      ;((a._initialStyle = { transition: '', overflow: a.style.overflow, [n]: a.style[n] }),
        (a.style.overflow = 'hidden'),
        (a.style[n] = `${a[s]}px`),
        a.offsetHeight,
        requestAnimationFrame(() => (a.style[n] = '0')))
    },
    onAfterLeave: r,
    onLeaveCancelled: r
  }
  function r(a) {
    ;(e && a._parent && a._parent.classList.remove(e), o(a))
  }
  function o(a) {
    const i = a._initialStyle[n]
    ;((a.style.overflow = a._initialStyle.overflow), i != null && (a.style[n] = i), delete a._initialStyle)
  }
}
const SA = ie({ target: [Object, Array] }, 'v-dialog-transition'),
  RA = Ae()({
    name: 'VDialogTransition',
    props: SA(),
    setup(e, t) {
      let { slots: n } = t
      const s = {
        onBeforeEnter(r) {
          ;((r.style.pointerEvents = 'none'), (r.style.visibility = 'hidden'))
        },
        async onEnter(r, o) {
          var h
          ;(await new Promise(E => requestAnimationFrame(E)),
            await new Promise(E => requestAnimationFrame(E)),
            (r.style.visibility = ''))
          const { x: a, y: i, sx: u, sy: c, speed: d } = of(e.target, r),
            m = Hs(r, [{ transform: `translate(${a}px, ${i}px) scale(${u}, ${c})`, opacity: 0 }, {}], {
              duration: 225 * d,
              easing: EO
            })
          ;((h = rf(r)) == null ||
            h.forEach(E => {
              Hs(E, [{ opacity: 0 }, { opacity: 0, offset: 0.33 }, {}], { duration: 225 * 2 * d, easing: sa })
            }),
            m.finished.then(() => o()))
        },
        onAfterEnter(r) {
          r.style.removeProperty('pointer-events')
        },
        onBeforeLeave(r) {
          r.style.pointerEvents = 'none'
        },
        async onLeave(r, o) {
          var h
          await new Promise(E => requestAnimationFrame(E))
          const { x: a, y: i, sx: u, sy: c, speed: d } = of(e.target, r)
          ;(Hs(r, [{}, { transform: `translate(${a}px, ${i}px) scale(${u}, ${c})`, opacity: 0 }], {
            duration: 125 * d,
            easing: _O
          }).finished.then(() => o()),
            (h = rf(r)) == null ||
              h.forEach(E => {
                Hs(E, [{}, { opacity: 0, offset: 0.2 }, { opacity: 0 }], { duration: 125 * 2 * d, easing: sa })
              }))
        },
        onAfterLeave(r) {
          r.style.removeProperty('pointer-events')
        }
      }
      return () =>
        e.target ? l(Dn, Ge({ name: 'dialog-transition' }, s, { css: !1 }), n) : l(Dn, { name: 'dialog-transition' }, n)
    }
  })
function rf(e) {
  var n
  const t = (n = e.querySelector(':scope > .v-card, :scope > .v-sheet, :scope > .v-list')) == null ? void 0 : n.children
  return t && [...t]
}
function of(e, t) {
  const n = zh(e),
    s = au(t),
    [r, o] = getComputedStyle(t)
      .transformOrigin.split(' ')
      .map(b => parseFloat(b)),
    [a, i] = getComputedStyle(t).getPropertyValue('--v-overlay-anchor-origin').split(' ')
  let u = n.left + n.width / 2
  a === 'left' || i === 'left' ? (u -= n.width / 2) : (a === 'right' || i === 'right') && (u += n.width / 2)
  let c = n.top + n.height / 2
  a === 'top' || i === 'top' ? (c -= n.height / 2) : (a === 'bottom' || i === 'bottom') && (c += n.height / 2)
  const d = n.width / s.width,
    m = n.height / s.height,
    h = Math.max(1, d, m),
    E = d / h || 0,
    y = m / h || 0,
    v = (s.width * s.height) / (window.innerWidth * window.innerHeight),
    I = v > 0.12 ? Math.min(1.5, (v - 0.12) * 10 + 1) : 1
  return { x: u - (r + s.left), y: c - (o + s.top), sx: E, sy: y, speed: I }
}
Qt('fab-transition', 'center center', 'out-in')
Qt('dialog-bottom-transition')
Qt('dialog-top-transition')
Qt('fade-transition')
Qt('scale-transition')
Qt('scroll-x-transition')
Qt('scroll-x-reverse-transition')
Qt('scroll-y-transition')
Qt('scroll-y-reverse-transition')
Qt('slide-x-transition')
Qt('slide-x-reverse-transition')
const kg = Qt('slide-y-transition')
Qt('slide-y-reverse-transition')
$g('expand-transition', Mg())
const OA = $g('expand-x-transition', Mg('', !0)),
  CA = ie(
    {
      active: Boolean,
      max: [Number, String],
      value: { type: [Number, String], default: 0 },
      ...Qe(),
      ...Ha({ transition: { component: kg } })
    },
    'VCounter'
  ),
  AA = Ae()({
    name: 'VCounter',
    functional: !0,
    props: CA(),
    setup(e, t) {
      let { slots: n } = t
      const s = M(() => (e.max ? `${e.value} / ${e.max}` : String(e.value)))
      return (
        Ve(() =>
          l(
            bs,
            { transition: e.transition },
            {
              default: () => [
                vt(
                  l('div', { class: ['v-counter', e.class], style: e.style }, [
                    n.default ? n.default({ counter: s.value, max: e.max, value: e.value }) : s.value
                  ]),
                  [[Wt, e.active]]
                )
              ]
            }
          )
        ),
        {}
      )
    }
  }),
  IA = ie({ text: String, onClick: Cs(), ...Qe(), ...Ot() }, 'VLabel'),
  hu = Ae()({
    name: 'VLabel',
    props: IA(),
    setup(e, t) {
      let { slots: n } = t
      return (
        Ve(() => {
          var s
          return l(
            'label',
            { class: ['v-label', { 'v-label--clickable': !!e.onClick }, e.class], style: e.style, onClick: e.onClick },
            [e.text, (s = n.default) == null ? void 0 : s.call(n)]
          )
        }),
        {}
      )
    }
  }),
  TA = ie({ floating: Boolean, ...Qe() }, 'VFieldLabel'),
  wo = Ae()({
    name: 'VFieldLabel',
    props: TA(),
    setup(e, t) {
      let { slots: n } = t
      return (
        Ve(() =>
          l(
            hu,
            {
              class: ['v-field-label', { 'v-field-label--floating': e.floating }, e.class],
              style: e.style,
              'aria-hidden': e.floating || void 0
            },
            n
          )
        ),
        {}
      )
    }
  })
function Dg(e) {
  const { t } = Wa()
  function n(s) {
    let { name: r } = s
    const o = {
        prepend: 'prependAction',
        prependInner: 'prependAction',
        append: 'appendAction',
        appendInner: 'appendAction',
        clear: 'clear'
      }[r],
      a = e[`onClick:${r}`],
      i = a && o ? t(`$vuetify.input.${o}`, e.label ?? '') : void 0
    return l(mt, { icon: e[`${r}Icon`], 'aria-label': i, onClick: a }, null)
  }
  return { InputIcon: n }
}
const gu = ie({ focused: Boolean, 'onUpdate:focused': Cs() }, 'focus')
function pu(e) {
  let t = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : Cn()
  const n = Nt(e, 'focused'),
    s = M(() => ({ [`${t}--focused`]: n.value }))
  function r() {
    n.value = !0
  }
  function o() {
    n.value = !1
  }
  return { focusClasses: s, isFocused: n, focus: r, blur: o }
}
const NA = ['underlined', 'outlined', 'filled', 'solo', 'solo-inverted', 'solo-filled', 'plain'],
  Eu = ie(
    {
      appendInnerIcon: ct,
      bgColor: String,
      clearable: Boolean,
      clearIcon: { type: ct, default: '$clear' },
      active: Boolean,
      centerAffix: { type: Boolean, default: void 0 },
      color: String,
      baseColor: String,
      dirty: Boolean,
      disabled: { type: Boolean, default: null },
      error: Boolean,
      flat: Boolean,
      label: String,
      persistentClear: Boolean,
      prependInnerIcon: ct,
      reverse: Boolean,
      singleLine: Boolean,
      variant: { type: String, default: 'filled', validator: e => NA.includes(e) },
      'onClick:clear': Cs(),
      'onClick:appendInner': Cs(),
      'onClick:prependInner': Cs(),
      ...Qe(),
      ...du(),
      ...ln(),
      ...Ot()
    },
    'VField'
  ),
  _u = Ae()({
    name: 'VField',
    inheritAttrs: !1,
    props: { id: String, ...gu(), ...Eu() },
    emits: { 'update:focused': e => !0, 'update:modelValue': e => !0 },
    setup(e, t) {
      let { attrs: n, emit: s, slots: r } = t
      const { themeClasses: o } = Pt(e),
        { loaderClasses: a } = fu(e),
        { focusClasses: i, isFocused: u, focus: c, blur: d } = pu(e),
        { InputIcon: m } = Dg(e),
        { roundedClasses: h } = mn(e),
        { rtlClasses: E } = fs(),
        y = M(() => e.dirty || e.active),
        v = M(() => !e.singleLine && !!(e.label || r.label)),
        I = An(),
        b = M(() => e.id || `input-${I}`),
        O = M(() => `${b.value}-messages`),
        P = _e(),
        T = _e(),
        $ = _e(),
        L = M(() => ['plain', 'underlined'].includes(e.variant)),
        { backgroundColorClasses: N, backgroundColorStyles: A } = is(De(e, 'bgColor')),
        { textColorClasses: w, textColorStyles: B } = Fn(
          M(() => (e.error || e.disabled ? void 0 : y.value && u.value ? e.color : e.baseColor))
        )
      be(
        y,
        U => {
          if (v.value) {
            const X = P.value.$el,
              ge = T.value.$el
            requestAnimationFrame(() => {
              const te = au(X),
                fe = ge.getBoundingClientRect(),
                ce = fe.x - te.x,
                ke = fe.y - te.y - (te.height / 2 - fe.height / 2),
                ze = fe.width / 0.75,
                Ie = Math.abs(ze - te.width) > 1 ? { maxWidth: Te(ze) } : void 0,
                xe = getComputedStyle(X),
                Le = getComputedStyle(ge),
                et = parseFloat(xe.transitionDuration) * 1e3 || 150,
                bt = parseFloat(Le.getPropertyValue('--v-field-label-scale')),
                Fe = Le.getPropertyValue('color')
              ;((X.style.visibility = 'visible'),
                (ge.style.visibility = 'hidden'),
                Hs(
                  X,
                  { transform: `translate(${ce}px, ${ke}px) scale(${bt})`, color: Fe, ...Ie },
                  { duration: et, easing: sa, direction: U ? 'normal' : 'reverse' }
                ).finished.then(() => {
                  ;(X.style.removeProperty('visibility'), ge.style.removeProperty('visibility'))
                }))
            })
          }
        },
        { flush: 'post' }
      )
      const j = M(() => ({ isActive: y, isFocused: u, controlRef: $, blur: d, focus: c }))
      function D(U) {
        U.target !== document.activeElement && U.preventDefault()
      }
      return (
        Ve(() => {
          var ce, ke, ze
          const U = e.variant === 'outlined',
            X = r['prepend-inner'] || e.prependInnerIcon,
            ge = !!(e.clearable || r.clear),
            te = !!(r['append-inner'] || e.appendInnerIcon || ge),
            fe = () => (r.label ? r.label({ ...j.value, label: e.label, props: { for: b.value } }) : e.label)
          return l(
            'div',
            Ge(
              {
                class: [
                  'v-field',
                  {
                    'v-field--active': y.value,
                    'v-field--appended': te,
                    'v-field--center-affix': e.centerAffix ?? !L.value,
                    'v-field--disabled': e.disabled,
                    'v-field--dirty': e.dirty,
                    'v-field--error': e.error,
                    'v-field--flat': e.flat,
                    'v-field--has-background': !!e.bgColor,
                    'v-field--persistent-clear': e.persistentClear,
                    'v-field--prepended': X,
                    'v-field--reverse': e.reverse,
                    'v-field--single-line': e.singleLine,
                    'v-field--no-label': !fe(),
                    [`v-field--variant-${e.variant}`]: !0
                  },
                  o.value,
                  N.value,
                  i.value,
                  a.value,
                  h.value,
                  E.value,
                  e.class
                ],
                style: [A.value, e.style],
                onClick: D
              },
              n
            ),
            [
              l('div', { class: 'v-field__overlay' }, null),
              l(
                hg,
                {
                  name: 'v-field',
                  active: !!e.loading,
                  color: e.error ? 'error' : typeof e.loading == 'string' ? e.loading : e.color
                },
                { default: r.loader }
              ),
              X &&
                l('div', { key: 'prepend', class: 'v-field__prepend-inner' }, [
                  e.prependInnerIcon && l(m, { key: 'prepend-icon', name: 'prependInner' }, null),
                  (ce = r['prepend-inner']) == null ? void 0 : ce.call(r, j.value)
                ]),
              l('div', { class: 'v-field__field', 'data-no-activator': '' }, [
                ['filled', 'solo', 'solo-inverted', 'solo-filled'].includes(e.variant) &&
                  v.value &&
                  l(
                    wo,
                    { key: 'floating-label', ref: T, class: [w.value], floating: !0, for: b.value, style: B.value },
                    { default: () => [fe()] }
                  ),
                l(wo, { ref: P, for: b.value }, { default: () => [fe()] }),
                (ke = r.default) == null
                  ? void 0
                  : ke.call(r, {
                      ...j.value,
                      props: { id: b.value, class: 'v-field__input', 'aria-describedby': O.value },
                      focus: c,
                      blur: d
                    })
              ]),
              ge &&
                l(
                  OA,
                  { key: 'clear' },
                  {
                    default: () => [
                      vt(
                        l(
                          'div',
                          {
                            class: 'v-field__clearable',
                            onMousedown: Ie => {
                              ;(Ie.preventDefault(), Ie.stopPropagation())
                            }
                          },
                          [r.clear ? r.clear() : l(m, { name: 'clear' }, null)]
                        ),
                        [[Wt, e.dirty]]
                      )
                    ]
                  }
                ),
              te &&
                l('div', { key: 'append', class: 'v-field__append-inner' }, [
                  (ze = r['append-inner']) == null ? void 0 : ze.call(r, j.value),
                  e.appendInnerIcon && l(m, { key: 'append-icon', name: 'appendInner' }, null)
                ]),
              l('div', { class: ['v-field__outline', w.value], style: B.value }, [
                U &&
                  l(Ue, null, [
                    l('div', { class: 'v-field__outline__start' }, null),
                    v.value &&
                      l('div', { class: 'v-field__outline__notch' }, [
                        l(wo, { ref: T, floating: !0, for: b.value }, { default: () => [fe()] })
                      ]),
                    l('div', { class: 'v-field__outline__end' }, null)
                  ]),
                L.value && v.value && l(wo, { ref: T, floating: !0, for: b.value }, { default: () => [fe()] })
              ])
            ]
          )
        }),
        { controlRef: $ }
      )
    }
  })
function wA(e) {
  const t = Object.keys(_u.props).filter(n => !ru(n) && n !== 'class' && n !== 'style')
  return Gh(e, t)
}
const LA = ie(
    {
      active: Boolean,
      color: String,
      messages: { type: [Array, String], default: () => [] },
      ...Qe(),
      ...Ha({ transition: { component: kg, leaveAbsolute: !0, group: !0 } })
    },
    'VMessages'
  ),
  PA = Ae()({
    name: 'VMessages',
    props: LA(),
    setup(e, t) {
      let { slots: n } = t
      const s = M(() => ss(e.messages)),
        { textColorClasses: r, textColorStyles: o } = Fn(M(() => e.color))
      return (
        Ve(() =>
          l(
            bs,
            {
              transition: e.transition,
              tag: 'div',
              class: ['v-messages', r.value, e.class],
              style: [o.value, e.style],
              role: 'alert',
              'aria-live': 'polite'
            },
            {
              default: () => [
                e.active &&
                  s.value.map((a, i) =>
                    l('div', { class: 'v-messages__message', key: `${i}-${s.value}` }, [
                      n.message ? n.message({ message: a }) : a
                    ])
                  )
              ]
            }
          )
        ),
        {}
      )
    }
  }),
  $A = ie(
    {
      disabled: { type: Boolean, default: null },
      error: Boolean,
      errorMessages: { type: [Array, String], default: () => [] },
      maxErrors: { type: [Number, String], default: 1 },
      name: String,
      label: String,
      readonly: { type: Boolean, default: null },
      rules: { type: Array, default: () => [] },
      modelValue: null,
      validateOn: String,
      validationValue: null,
      ...gu()
    },
    'validation'
  )
function MA(e) {
  let t = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : Cn(),
    n = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : An()
  const s = Nt(e, 'modelValue'),
    r = M(() => (e.validationValue === void 0 ? s.value : e.validationValue)),
    o = yA(),
    a = _e([]),
    i = je(!0),
    u = M(() => !!(ss(s.value === '' ? null : s.value).length || ss(r.value === '' ? null : r.value).length)),
    c = M(() => !!(e.disabled ?? (o == null ? void 0 : o.isDisabled.value))),
    d = M(() => !!(e.readonly ?? (o == null ? void 0 : o.isReadonly.value))),
    m = M(() => {
      var T
      return (T = e.errorMessages) != null && T.length
        ? ss(e.errorMessages).concat(a.value).slice(0, Math.max(0, +e.maxErrors))
        : a.value
    }),
    h = M(() => {
      let T = (e.validateOn ?? (o == null ? void 0 : o.validateOn.value)) || 'input'
      T === 'lazy' && (T = 'input lazy')
      const $ = new Set((T == null ? void 0 : T.split(' ')) ?? [])
      return {
        blur: $.has('blur') || $.has('input'),
        input: $.has('input'),
        submit: $.has('submit'),
        lazy: $.has('lazy')
      }
    }),
    E = M(() => {
      var T
      return e.error || ((T = e.errorMessages) != null && T.length)
        ? !1
        : e.rules.length
          ? i.value
            ? a.value.length || h.value.lazy
              ? null
              : !0
            : !a.value.length
          : !0
    }),
    y = je(!1),
    v = M(() => ({
      [`${t}--error`]: E.value === !1,
      [`${t}--dirty`]: u.value,
      [`${t}--disabled`]: c.value,
      [`${t}--readonly`]: d.value
    })),
    I = M(() => e.name ?? Dt(n))
  ;(Ra(() => {
    o == null || o.register({ id: I.value, validate: P, reset: b, resetValidation: O })
  }),
    Sn(() => {
      o == null || o.unregister(I.value)
    }),
    xn(async () => {
      ;(h.value.lazy || (await P(!0)), o == null || o.update(I.value, E.value, m.value))
    }),
    ar(
      () => h.value.input,
      () => {
        be(r, () => {
          if (r.value != null) P()
          else if (e.focused) {
            const T = be(
              () => e.focused,
              $ => {
                ;($ || P(), T())
              }
            )
          }
        })
      }
    ),
    ar(
      () => h.value.blur,
      () => {
        be(
          () => e.focused,
          T => {
            T || P()
          }
        )
      }
    ),
    be([E, m], () => {
      o == null || o.update(I.value, E.value, m.value)
    }))
  function b() {
    ;((s.value = null), Et(O))
  }
  function O() {
    ;((i.value = !0), h.value.lazy ? (a.value = []) : P(!0))
  }
  async function P() {
    let T = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : !1
    const $ = []
    y.value = !0
    for (const L of e.rules) {
      if ($.length >= +(e.maxErrors ?? 1)) break
      const A = await (typeof L == 'function' ? L : () => L)(r.value)
      if (A !== !0) {
        if (A !== !1 && typeof A != 'string') {
          console.warn(`${A} is not a valid value. Rule functions must return boolean true or a string.`)
          continue
        }
        $.push(A || '')
      }
    }
    return ((a.value = $), (y.value = !1), (i.value = T), a.value)
  }
  return {
    errorMessages: m,
    isDirty: u,
    isDisabled: c,
    isReadonly: d,
    isPristine: i,
    isValid: E,
    isValidating: y,
    reset: b,
    resetValidation: O,
    validate: P,
    validationClasses: v
  }
}
const yu = ie(
    {
      id: String,
      appendIcon: ct,
      centerAffix: { type: Boolean, default: !0 },
      prependIcon: ct,
      hideDetails: [Boolean, String],
      hideSpinButtons: Boolean,
      hint: String,
      persistentHint: Boolean,
      messages: { type: [Array, String], default: () => [] },
      direction: { type: String, default: 'horizontal', validator: e => ['horizontal', 'vertical'].includes(e) },
      'onClick:prepend': Cs(),
      'onClick:append': Cs(),
      ...Qe(),
      ...Bn(),
      ...$A()
    },
    'VInput'
  ),
  ua = Ae()({
    name: 'VInput',
    props: { ...yu() },
    emits: { 'update:modelValue': e => !0 },
    setup(e, t) {
      let { attrs: n, slots: s, emit: r } = t
      const { densityClasses: o } = ws(e),
        { rtlClasses: a } = fs(),
        { InputIcon: i } = Dg(e),
        u = An(),
        c = M(() => e.id || `input-${u}`),
        d = M(() => `${c.value}-messages`),
        {
          errorMessages: m,
          isDirty: h,
          isDisabled: E,
          isReadonly: y,
          isPristine: v,
          isValid: I,
          isValidating: b,
          reset: O,
          resetValidation: P,
          validate: T,
          validationClasses: $
        } = MA(e, 'v-input', c),
        L = M(() => ({
          id: c,
          messagesId: d,
          isDirty: h,
          isDisabled: E,
          isReadonly: y,
          isPristine: v,
          isValid: I,
          isValidating: b,
          reset: O,
          resetValidation: P,
          validate: T
        })),
        N = M(() => {
          var A
          return ((A = e.errorMessages) != null && A.length) || (!v.value && m.value.length)
            ? m.value
            : e.hint && (e.persistentHint || e.focused)
              ? e.hint
              : e.messages
        })
      return (
        Ve(() => {
          var D, U, X, ge
          const A = !!(s.prepend || e.prependIcon),
            w = !!(s.append || e.appendIcon),
            B = N.value.length > 0,
            j = !e.hideDetails || (e.hideDetails === 'auto' && (B || !!s.details))
          return l(
            'div',
            {
              class: [
                'v-input',
                `v-input--${e.direction}`,
                { 'v-input--center-affix': e.centerAffix, 'v-input--hide-spin-buttons': e.hideSpinButtons },
                o.value,
                a.value,
                $.value,
                e.class
              ],
              style: e.style
            },
            [
              A &&
                l('div', { key: 'prepend', class: 'v-input__prepend' }, [
                  (D = s.prepend) == null ? void 0 : D.call(s, L.value),
                  e.prependIcon && l(i, { key: 'prepend-icon', name: 'prepend' }, null)
                ]),
              s.default &&
                l('div', { class: 'v-input__control' }, [(U = s.default) == null ? void 0 : U.call(s, L.value)]),
              w &&
                l('div', { key: 'append', class: 'v-input__append' }, [
                  e.appendIcon && l(i, { key: 'append-icon', name: 'append' }, null),
                  (X = s.append) == null ? void 0 : X.call(s, L.value)
                ]),
              j &&
                l('div', { class: 'v-input__details' }, [
                  l(PA, { id: d.value, active: B, messages: N.value }, { message: s.message }),
                  (ge = s.details) == null ? void 0 : ge.call(s, L.value)
                ])
            ]
          )
        }),
        { reset: O, resetValidation: P, validate: T, isValid: I, errorMessages: m }
      )
    }
  }),
  kA = ['color', 'file', 'time', 'date', 'datetime-local', 'week', 'month'],
  DA = ie(
    {
      autofocus: Boolean,
      counter: [Boolean, Number, String],
      counterValue: [Number, Function],
      prefix: String,
      placeholder: String,
      persistentPlaceholder: Boolean,
      persistentCounter: Boolean,
      suffix: String,
      role: String,
      type: { type: String, default: 'text' },
      modelModifiers: Object,
      ...yu(),
      ...Eu()
    },
    'VTextField'
  ),
  Bt = Ae()({
    name: 'VTextField',
    directives: { Intersect: Tg },
    inheritAttrs: !1,
    props: DA(),
    emits: {
      'click:control': e => !0,
      'mousedown:control': e => !0,
      'update:focused': e => !0,
      'update:modelValue': e => !0
    },
    setup(e, t) {
      let { attrs: n, emit: s, slots: r } = t
      const o = Nt(e, 'modelValue'),
        { isFocused: a, focus: i, blur: u } = pu(e),
        c = M(() =>
          typeof e.counterValue == 'function'
            ? e.counterValue(o.value)
            : typeof e.counterValue == 'number'
              ? e.counterValue
              : (o.value ?? '').toString().length
        ),
        d = M(() => {
          if (n.maxlength) return n.maxlength
          if (!(!e.counter || (typeof e.counter != 'number' && typeof e.counter != 'string'))) return e.counter
        }),
        m = M(() => ['plain', 'underlined'].includes(e.variant))
      function h(L, N) {
        var A, w
        !e.autofocus || !L || (w = (A = N[0].target) == null ? void 0 : A.focus) == null || w.call(A)
      }
      const E = _e(),
        y = _e(),
        v = _e(),
        I = M(() => kA.includes(e.type) || e.persistentPlaceholder || a.value || e.active)
      function b() {
        var L
        ;(v.value !== document.activeElement && ((L = v.value) == null || L.focus()), a.value || i())
      }
      function O(L) {
        ;(s('mousedown:control', L), L.target !== v.value && (b(), L.preventDefault()))
      }
      function P(L) {
        ;(b(), s('click:control', L))
      }
      function T(L) {
        ;(L.stopPropagation(),
          b(),
          Et(() => {
            ;((o.value = null), UR(e['onClick:clear'], L))
          }))
      }
      function $(L) {
        var A
        const N = L.target
        if (
          ((o.value = N.value),
          (A = e.modelModifiers) != null && A.trim && ['text', 'search', 'password', 'tel', 'url'].includes(e.type))
        ) {
          const w = [N.selectionStart, N.selectionEnd]
          Et(() => {
            ;((N.selectionStart = w[0]), (N.selectionEnd = w[1]))
          })
        }
      }
      return (
        Ve(() => {
          const L = !!(r.counter || (e.counter !== !1 && e.counter != null)),
            N = !!(L || r.details),
            [A, w] = xa(n),
            { modelValue: B, ...j } = ua.filterProps(e),
            D = wA(e)
          return l(
            ua,
            Ge(
              {
                ref: E,
                modelValue: o.value,
                'onUpdate:modelValue': U => (o.value = U),
                class: [
                  'v-text-field',
                  {
                    'v-text-field--prefixed': e.prefix,
                    'v-text-field--suffixed': e.suffix,
                    'v-input--plain-underlined': m.value
                  },
                  e.class
                ],
                style: e.style
              },
              A,
              j,
              { centerAffix: !m.value, focused: a.value }
            ),
            {
              ...r,
              default: U => {
                let { id: X, isDisabled: ge, isDirty: te, isReadonly: fe, isValid: ce } = U
                return l(
                  _u,
                  Ge(
                    {
                      ref: y,
                      onMousedown: O,
                      onClick: P,
                      'onClick:clear': T,
                      'onClick:prependInner': e['onClick:prependInner'],
                      'onClick:appendInner': e['onClick:appendInner'],
                      role: e.role
                    },
                    D,
                    {
                      id: X.value,
                      active: I.value || te.value,
                      dirty: te.value || e.dirty,
                      disabled: ge.value,
                      focused: a.value,
                      error: ce.value === !1
                    }
                  ),
                  {
                    ...r,
                    default: ke => {
                      let {
                        props: { class: ze, ...Ie }
                      } = ke
                      const xe = vt(
                        l(
                          'input',
                          Ge(
                            {
                              ref: v,
                              value: o.value,
                              onInput: $,
                              autofocus: e.autofocus,
                              readonly: fe.value,
                              disabled: ge.value,
                              name: e.name,
                              placeholder: e.placeholder,
                              size: 1,
                              type: e.type,
                              onFocus: b,
                              onBlur: u
                            },
                            Ie,
                            w
                          ),
                          null
                        ),
                        [[dr('intersect'), { handler: h }, null, { once: !0 }]]
                      )
                      return l(Ue, null, [
                        e.prefix &&
                          l('span', { class: 'v-text-field__prefix' }, [
                            l('span', { class: 'v-text-field__prefix__text' }, [e.prefix])
                          ]),
                        r.default
                          ? l('div', { class: ze, 'data-no-activator': '' }, [r.default(), xe])
                          : kn(xe, { class: ze }),
                        e.suffix &&
                          l('span', { class: 'v-text-field__suffix' }, [
                            l('span', { class: 'v-text-field__suffix__text' }, [e.suffix])
                          ])
                      ])
                    }
                  }
                )
              },
              details: N
                ? U => {
                    var X
                    return l(Ue, null, [
                      (X = r.details) == null ? void 0 : X.call(r, U),
                      L &&
                        l(Ue, null, [
                          l('span', null, null),
                          l(AA, { active: e.persistentCounter || a.value, value: c.value, max: d.value }, r.counter)
                        ])
                    ])
                  }
                : void 0
            }
          )
        }),
        ja({}, E, y, v)
      )
    }
  }),
  FA = {
    name: 'LoginForm',
    data() {
      return { showErrorAlert: !1, showIncorrectAlert: !1, showSuccessAlert: !1, showPassword: !1 }
    },
    computed: {
      ...an(kr, ['form', 'isValid', 'submitFormErrorCode']),
      ...Ke(kr, ['isSubmittingForm', 'submitFormSuccessResult']),
      ...Ke(gt, ['metadata']),
      isMobile() {
        const { sm: e, xs: t } = this.$vuetify.display
        return t || e
      },
      rules() {
        return {
          username: [
            e =>
              !e || !e.trim()
                ? this.$filters.message(this.$t('VALIDATION.REQUIRED', { item: this.$t('SIGNIN_PAGE.LABEL.USERNAME') }))
                : e.trim().length > 250
                  ? this.$filters.message(
                      this.$t('VALIDATION.MAX_LENGTH', { item: this.$t('SIGNIN_PAGE.LABEL.USERNAME'), length: 250 })
                    )
                  : !0
          ],
          password: [
            e =>
              !e || !e.trim()
                ? this.$filters.message(this.$t('VALIDATION.REQUIRED', { item: this.$t('SIGNIN_PAGE.LABEL.PASSWORD') }))
                : e.trim().length > 250
                  ? this.$filters.message(
                      this.$t('VALIDATION.MAX_LENGTH', { item: this.$t('SIGNIN_PAGE.LABEL.PASSWORD'), length: 250 })
                    )
                  : !0
          ]
        }
      }
    },
    watch: {
      'form.username'() {
        ;(this.showIncorrectAlert && (this.showIncorrectAlert = !1), this.showErrorAlert && (this.showErrorAlert = !1))
      },
      'form.password'() {
        ;(this.showIncorrectAlert && (this.showIncorrectAlert = !1), this.showErrorAlert && (this.showErrorAlert = !1))
      },
      showIncorrectAlert() {
        this.showIncorrectAlert || (this.submitFormErrorCode = !1)
      },
      showErrorAlert() {
        this.showErrorAlert || (this.submitFormErrorCode = !1)
      },
      isSubmittingForm() {
        this.isSubmittingForm && ((this.showIncorrectAlert = !1), (this.showErrorAlert = !1))
      },
      submitFormErrorCode() {
        this.submitFormErrorCode === 1 || this.submitFormErrorCode === '1'
          ? (this.showIncorrectAlert = !0)
          : this.submitFormErrorCode && (this.showErrorAlert = !0)
      },
      submitFormSuccessResult() {
        if (this.submitFormSuccessResult) {
          this.showSuccessAlert = !0
          const { action: e } = this.submitFormSuccessResult
          ;(console.log(`Redirect to: ${e}`), window.location.replace(e))
        }
      }
    },
    methods: {
      ...Ye(kr, ['submit']),
      async onClickSubmit() {
        const { valid: e } = await this.$refs.form.validate()
        e && this.submit()
      }
    },
    mounted() {
      const e = this.$route.query.username
      e && (this.form.username = e)
    }
  },
  VA = { class: 'font-weight-medium text-secondary' },
  xA = C('br', null, null, -1)
function BA(e, t, n, s, r, o) {
  const a = he('router-link')
  return (
    F(),
    G(
      _,
      { class: 'pt-5 mx-n2 mx-md-0' },
      {
        default: f(() => [
          l(
            we,
            { class: 'pa-4' },
            {
              default: f(() => [
                l(
                  Un,
                  {
                    ref: 'form',
                    modelValue: e.isValid,
                    'onUpdate:modelValue': t[6] || (t[6] = i => (e.isValid = i)),
                    onSubmit: t[7] || (t[7] = us(() => {}, ['prevent']))
                  },
                  {
                    default: f(() => [
                      l(
                        _,
                        { class: 'py-2 text-center text-h5' },
                        { default: f(() => [C('span', VA, S(e.$t('SIGNIN_PAGE.TITLE.SIGNIN')), 1)]), _: 1 }
                      ),
                      l(
                        _,
                        { class: 'py-2' },
                        {
                          default: f(() => [
                            l(
                              de,
                              {
                                modelValue: r.showIncorrectAlert,
                                'onUpdate:modelValue': t[0] || (t[0] = i => (r.showIncorrectAlert = i)),
                                closable: '',
                                density: 'compact',
                                icon: '$warning',
                                type: 'error',
                                variant: 'outlined'
                              },
                              {
                                default: f(() => [C('span', null, S(e.$t('SIGNIN_PAGE.MESSAGE.INCORRECT')), 1)]),
                                _: 1
                              },
                              8,
                              ['modelValue']
                            ),
                            l(
                              de,
                              {
                                modelValue: r.showErrorAlert,
                                'onUpdate:modelValue': t[1] || (t[1] = i => (r.showErrorAlert = i)),
                                closable: '',
                                density: 'compact',
                                icon: '$warning',
                                type: 'error',
                                variant: 'outlined'
                              },
                              {
                                default: f(() => [C('span', null, S(e.$t('SIGNIN_PAGE.MESSAGE.SIGNIN_FAILED')), 1)]),
                                _: 1
                              },
                              8,
                              ['modelValue']
                            ),
                            l(
                              de,
                              {
                                modelValue: r.showSuccessAlert,
                                'onUpdate:modelValue': t[2] || (t[2] = i => (r.showSuccessAlert = i)),
                                closable: '',
                                density: 'compact',
                                icon: '$success',
                                type: 'success',
                                variant: 'outlined'
                              },
                              {
                                default: f(() => [
                                  C('span', null, S(e.$t('SIGNIN_PAGE.MESSAGE.SIGNIN_SUCCESS')), 1),
                                  xA,
                                  C('span', null, S(e.$t('SIGNIN_PAGE.MESSAGE.REDIRECT_SYSTEM')), 1)
                                ]),
                                _: 1
                              },
                              8,
                              ['modelValue']
                            )
                          ]),
                          _: 1
                        }
                      ),
                      l(
                        _,
                        { class: 'py-2' },
                        {
                          default: f(() => [
                            l(
                              _,
                              { class: 'py-2' },
                              {
                                default: f(() => [
                                  l(
                                    Bt,
                                    {
                                      modelValue: e.form.username,
                                      'onUpdate:modelValue': t[3] || (t[3] = i => (e.form.username = i)),
                                      label: e.$t('SIGNIN_PAGE.LABEL.USERNAME'),
                                      rules: o.rules.username,
                                      'prepend-inner-icon': 'mdi mdi-account',
                                      variant: 'outlined',
                                      disabled: !!e.submitFormSuccessResult
                                    },
                                    null,
                                    8,
                                    ['modelValue', 'label', 'rules', 'disabled']
                                  )
                                ]),
                                _: 1
                              }
                            ),
                            l(
                              _,
                              { class: 'py-2' },
                              {
                                default: f(() => [
                                  l(
                                    Bt,
                                    {
                                      modelValue: e.form.password,
                                      'onUpdate:modelValue': t[4] || (t[4] = i => (e.form.password = i)),
                                      'append-inner-icon': r.showPassword ? 'mdi-eye' : 'mdi-eye-off',
                                      label: e.$t('SIGNIN_PAGE.LABEL.PASSWORD'),
                                      rules: o.rules.password,
                                      type: r.showPassword ? 'text' : 'password',
                                      'prepend-inner-icon': 'mdi mdi-lock-outline',
                                      variant: 'outlined',
                                      'onClick:appendInner': t[5] || (t[5] = i => (r.showPassword = !r.showPassword)),
                                      disabled: !!e.submitFormSuccessResult
                                    },
                                    null,
                                    8,
                                    ['modelValue', 'append-inner-icon', 'label', 'rules', 'type', 'disabled']
                                  )
                                ]),
                                _: 1
                              }
                            ),
                            l(
                              _,
                              { class: 'py-2 d-flex align-center justify-space-between' },
                              {
                                default: f(() => [
                                  l(
                                    _,
                                    { class: 'flex-grow-1' },
                                    {
                                      default: f(() => [
                                        vt(
                                          l(
                                            a,
                                            { to: { name: 'ResetRequestPage' } },
                                            {
                                              default: f(() => [
                                                C('span', null, S(e.$t('SIGNIN_PAGE.ACTION.RESET_YOUR_PASSWORD')), 1)
                                              ]),
                                              _: 1
                                            },
                                            512
                                          ),
                                          [[Wt, !e.isSubmittingForm]]
                                        )
                                      ]),
                                      _: 1
                                    }
                                  ),
                                  l(
                                    _,
                                    { class: 'flex-grow-0 text-right' },
                                    {
                                      default: f(() => [
                                        l(
                                          ae,
                                          {
                                            disabled: !!e.submitFormSuccessResult,
                                            loading: e.isSubmittingForm,
                                            'prepend-icon': 'mdi-login',
                                            onClick: o.onClickSubmit
                                          },
                                          { default: f(() => [ee(S(e.$t('SIGNIN_PAGE.ACTION.SIGNIN')), 1)]), _: 1 },
                                          8,
                                          ['disabled', 'loading', 'onClick']
                                        )
                                      ]),
                                      _: 1
                                    }
                                  )
                                ]),
                                _: 1
                              }
                            )
                          ]),
                          _: 1
                        }
                      )
                    ]),
                    _: 1
                  },
                  8,
                  ['modelValue']
                )
              ]),
              _: 1
            }
          )
        ]),
        _: 1
      }
    )
  )
}
const UA = ue(FA, [['render', BA]]),
  GA = Ee({
    name: 'SigninPage',
    components: { LoginForm: UA },
    data() {
      return {}
    },
    computed: {
      ...Ke(gt, ['account']),
      ...Ke(kr, ['status', 'errorObject', 'isSubmittingForm']),
      isMobile() {
        const { sm: e, xs: t } = this.$vuetify.display
        return t || e
      }
    },
    methods: { ...Ye(kr, ['initial', 'showError', 'destroy']) },
    mounted() {
      this.account && this.account.cid ? this.$router.push({ name: 'IndexPage' }) : this.initial()
    },
    unmounted() {
      this.destroy()
    },
    errorCaptured(e) {
      this.showError(e)
    }
  })
function WA(e, t, n, s, r, o) {
  const a = he('s-page-loading'),
    i = he('s-page-error'),
    u = he('login-form'),
    c = he('router-link')
  return e.status === 'READY'
    ? (F(), G(a, { key: 0 }))
    : e.status === 'ERROR'
      ? (F(), G(i, { key: 1, error: e.errorObject }, null, 8, ['error']))
      : e.status === 'WORKING'
        ? (F(),
          G(
            dt,
            { key: 2, class: 'overflow-hidden' },
            {
              default: f(() => [
                l(
                  _,
                  { width: '100%', 'max-width': '480px', class: 'mx-auto text-left' },
                  {
                    default: f(() => [
                      l(
                        _,
                        { class: 'pa-4 text-center' },
                        {
                          default: f(() => [
                            l(lt, { src: e.$config.siteLogo, 'max-width': '360px', class: 'mx-auto' }, null, 8, ['src'])
                          ]),
                          _: 1
                        }
                      ),
                      l(u),
                      l(
                        _,
                        { class: 'pt-5 text-center' },
                        {
                          default: f(() => [
                            vt(
                              l(
                                c,
                                { to: { name: 'SignupRequestPage' } },
                                {
                                  default: f(() => [
                                    C('span', null, S(e.$t('SIGNIN_PAGE.ACTION.REGISTRY_NEW_ACCOUNT')), 1)
                                  ]),
                                  _: 1
                                },
                                512
                              ),
                              [[Wt, !e.isSubmittingForm]]
                            )
                          ]),
                          _: 1
                        }
                      )
                    ]),
                    _: 1
                  }
                )
              ]),
              _: 1
            }
          ))
        : We('', !0)
}
const HA = ue(GA, [['render', WA]]),
  jA = e => {
    const t = {}
    return (
      Object.keys(e).forEach(n => {
        const s = e[n]
        t[n] = typeof s == 'string' ? s.trim() : s
      }),
      t
    )
  },
  zs = jt({
    id: 'SignupRequestStore',
    state: () => ({
      status: 'READY',
      errorObject: !1,
      isValid: !1,
      form: { username: '', displayName: '', email: '', phoneNumber: '' },
      isSubmittingForm: !1,
      submitFormErrorCode: !1,
      submitFormSuccessResult: !1
    }),
    actions: {
      async initial() {
        var e, t, n
        try {
          ;((this.status = 'WORKING'),
            (this.isSubmittingForm = !1),
            (this.submitFormErrorCode = !1),
            (this.submitFormSuccessResult = !1))
        } catch (s) {
          const r = new Error(`[${s.code}] ${s.message}`)
          ;((r.message = s.message || ((t = (e = s.response) == null ? void 0 : e.data) == null ? void 0 : t.message)),
            (r.code = ((n = s.response) == null ? void 0 : n.status) || s.code),
            (this.errorObject = r),
            (this.status = 'ERROR'))
        }
      },
      async submit() {
        var e, t
        try {
          ;((this.submitFormSuccessResult = !1), (this.submitFormErrorCode = !1), (this.isSubmittingForm = !0))
          const n = jA(this.form),
            s = await Oe.post('/signup/request', n)
          ;(s.headers.code ? (this.submitFormErrorCode = s.headers.code) : (this.submitFormSuccessResult = s.data),
            (this.isSubmittingForm = !1))
        } catch (n) {
          ;(console.error(n),
            (this.submitFormErrorCode =
              ((t = (e = n.response) == null ? void 0 : e.headers) == null ? void 0 : t.code) || !0),
            (this.isSubmittingForm = !1))
        }
      },
      showError(e) {
        ;((this.status = 'ERROR'), (this.errorObject = e))
      },
      destroy() {
        this.$reset()
      }
    }
  }),
  YA = {
    name: 'SignupPage',
    methods: { ...Ye(zs, ['showError', 'destroy']) },
    mounted() {
      this.$route.name === 'SignupPage' && this.$router.push({ name: 'SignupRequestPage' })
    },
    unmounted() {
      this.destroy()
    },
    errorCaptured(e) {
      this.showError(e)
    }
  }
function KA(e, t, n, s, r, o) {
  const a = he('router-view')
  return (F(), G(a))
}
const qA = ue(YA, [['render', KA]]),
  Uo = Object.freeze({
    DATE_ONLY_TYPE_01: /^(0?[1-9]|[12][0-9]|3[01])[/-](0?[1-9]|1[012])[/-]\d{4}$/,
    DATE_ONLY_TYPE_02: /^(0?[1-9]|1[012])[/-](0?[1-9]|[12][0-9]|3[01])[/-]\d{4}$/,
    EMAIL: /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/,
    USERNAME: /^[a-zA-Z0-9\-_@.+]+$/,
    PASSWORD: /^[a-zA-Z0-9~!@#$%^&*()_+{}|:"<>?\-=[\]\\;',./]+$/,
    PHONE: /^[0-9 +]+$/
  }),
  zA = {
    name: 'SignupForm',
    data() {
      return {
        showErrorAlert: !1,
        showInvalidAlert: !1,
        showSuccessAlert: !1,
        error: { username: '', email: '', phoneNumber: '' }
      }
    },
    computed: {
      ...an(zs, ['form', 'isValid', 'submitFormErrorCode']),
      ...Ke(zs, ['isSubmittingForm', 'submitFormSuccessResult']),
      isMobile() {
        const { sm: e, xs: t } = this.$vuetify.display
        return t || e
      },
      rules() {
        return {
          username: [
            e =>
              !e || !e.trim()
                ? this.$filters.message(this.$t('VALIDATION.REQUIRED', { item: this.$t('SIGNUP_PAGE.LABEL.USERNAME') }))
                : e.trim().length < 3
                  ? this.$filters.message(
                      this.$t('VALIDATION.MIN_LENGTH', { item: this.$t('SIGNUP_PAGE.LABEL.USERNAME'), length: 3 })
                    )
                  : e.trim().length > 250
                    ? this.$filters.message(
                        this.$t('VALIDATION.MAX_LENGTH', { item: this.$t('SIGNUP_PAGE.LABEL.USERNAME'), length: 250 })
                      )
                    : Uo.USERNAME.test(e.trim())
                      ? !0
                      : this.$filters.message(
                          this.$t('VALIDATION.INVALID_CHARACTERS', { item: this.$t('SIGNUP_PAGE.LABEL.USERNAME') })
                        )
          ],
          displayName: [
            e =>
              !e || !e.trim()
                ? this.$filters.message(
                    this.$t('VALIDATION.REQUIRED', { item: this.$t('SIGNUP_PAGE.LABEL.DISPLAY_NAME') })
                  )
                : e.trim().length < 5
                  ? this.$filters.message(
                      this.$t('VALIDATION.MIN_LENGTH', { item: this.$t('SIGNUP_PAGE.LABEL.DISPLAY_NAME'), length: 4 })
                    )
                  : e.trim().length > 250
                    ? this.$filters.message(
                        this.$t('VALIDATION.MAX_LENGTH', {
                          item: this.$t('SIGNUP_PAGE.LABEL.DISPLAY_NAME'),
                          length: 250
                        })
                      )
                    : !0
          ],
          email: [
            e =>
              !e || !e.trim()
                ? this.$filters.message(this.$t('VALIDATION.REQUIRED', { item: this.$t('SIGNUP_PAGE.LABEL.EMAIL') }))
                : e.trim().length > 250
                  ? this.$filters.message(
                      this.$t('VALIDATION.MAX_LENGTH', { item: this.$t('SIGNUP_PAGE.LABEL.EMAIL'), length: 250 })
                    )
                  : Uo.EMAIL.test(e.trim())
                    ? !0
                    : this.$filters.message(
                        this.$t('VALIDATION.EMAIL_PATTERN', { item: this.$t('SIGNUP_PAGE.LABEL.EMAIL') })
                      )
          ],
          phoneNumber: [
            e =>
              !e || !e.trim()
                ? !0
                : e.trim().length > 20
                  ? this.$filters.message(
                      this.$t('VALIDATION.MAX_LENGTH', { item: this.$t('SIGNUP_PAGE.LABEL.PHONE_NUMBER'), length: 20 })
                    )
                  : Uo.PHONE.test(e.trim())
                    ? !0
                    : this.$filters.message(
                        this.$t('VALIDATION.INVALID_CHARACTERS', { item: this.$t('SIGNUP_PAGE.LABEL.PHONE_NUMBER') })
                      )
          ]
        }
      }
    },
    watch: {
      'form.username'() {
        ;((this.error.username = ''),
          this.showInvalidAlert && (this.showInvalidAlert = !1),
          this.showErrorAlert && (this.showErrorAlert = !1))
      },
      'form.email'() {
        ;((this.error.email = ''),
          this.showInvalidAlert && (this.showInvalidAlert = !1),
          this.showErrorAlert && (this.showErrorAlert = !1))
      },
      'form.phoneNumber'() {
        ;((this.error.phoneNumber = ''),
          this.showInvalidAlert && (this.showInvalidAlert = !1),
          this.showErrorAlert && (this.showErrorAlert = !1))
      },
      showInvalidAlert() {
        this.showInvalidAlert || (this.submitFormErrorCode = !1)
      },
      showErrorAlert() {
        this.showErrorAlert || (this.submitFormErrorCode = !1)
      },
      isSubmittingForm() {
        this.isSubmittingForm && ((this.showInvalidAlert = !1), (this.showErrorAlert = !1))
      },
      submitFormErrorCode() {
        this.submitFormErrorCode === '1'
          ? ((this.error.username = this.$filters.message(
              this.$t('VALIDATION.IS_DUPLICATED', { item: this.$t('SIGNUP_PAGE.LABEL.USERNAME') })
            )),
            (this.showInvalidAlert = !0))
          : this.submitFormErrorCode === '2'
            ? ((this.error.email = this.$filters.message(
                this.$t('VALIDATION.IS_DUPLICATED', { item: this.$t('SIGNUP_PAGE.LABEL.EMAIL') })
              )),
              (this.showInvalidAlert = !0))
            : this.submitFormErrorCode === '3'
              ? ((this.error.phoneNumber = this.$filters.message(
                  this.$t('VALIDATION.IS_DUPLICATED', { item: this.$t('SIGNUP_PAGE.LABEL.PHONE_NUMBER') })
                )),
                (this.showInvalidAlert = !0))
              : this.submitFormErrorCode && (this.showErrorAlert = !0)
      },
      submitFormSuccessResult() {
        this.submitFormSuccessResult &&
          (this.showSnackbar({
            message: `${this.$t('SIGNUP_PAGE.MESSAGE.REQUEST_SUCCESS')} ${this.$t('SIGNUP_PAGE.MESSAGE.REDIRECT_VERIFY')}`,
            timeout: 5e3
          }),
          this.$router.push({
            name: 'SignupVerifyPage',
            query: { key: this.submitFormSuccessResult.key, email: this.submitFormSuccessResult.email }
          }))
      }
    },
    methods: {
      ...Ye(gt, ['showSnackbar']),
      ...Ye(zs, ['submit']),
      async onClickSubmit() {
        const { valid: e } = await this.$refs.form.validate()
        e ? this.submit() : (this.showInvalidAlert = !0)
      }
    },
    mounted() {
      const e = this.$route.query.username
      e && (this.form.username = e)
    }
  },
  XA = { class: 'font-weight-medium text-secondary' },
  JA = C('br', null, null, -1),
  QA = C('br', null, null, -1)
function ZA(e, t, n, s, r, o) {
  const a = he('router-link')
  return (
    F(),
    G(
      _,
      { class: 'pt-5 mx-n2 mx-md-0' },
      {
        default: f(() => [
          l(
            we,
            { class: 'pa-4' },
            {
              default: f(() => [
                l(
                  Un,
                  {
                    ref: 'form',
                    modelValue: e.isValid,
                    'onUpdate:modelValue': t[7] || (t[7] = i => (e.isValid = i)),
                    onSubmit: t[8] || (t[8] = us(() => {}, ['prevent']))
                  },
                  {
                    default: f(() => [
                      l(
                        _,
                        { class: 'py-2 text-center text-h5' },
                        { default: f(() => [C('span', XA, S(e.$t('SIGNUP_PAGE.TITLE.SIGNUP')), 1)]), _: 1 }
                      ),
                      l(
                        _,
                        { class: 'py-2' },
                        {
                          default: f(() => [
                            l(
                              de,
                              {
                                modelValue: r.showInvalidAlert,
                                'onUpdate:modelValue': t[0] || (t[0] = i => (r.showInvalidAlert = i)),
                                closable: '',
                                density: 'compact',
                                icon: '$warning',
                                type: 'error',
                                variant: 'outlined'
                              },
                              {
                                default: f(() => [
                                  C('span', null, S(e.$t('SIGNUP_PAGE.MESSAGE.INVALID_DATA')), 1),
                                  JA,
                                  C('span', null, S(e.$t('SIGNUP_PAGE.MESSAGE.CHECK_RED_BOXES')), 1)
                                ]),
                                _: 1
                              },
                              8,
                              ['modelValue']
                            ),
                            l(
                              de,
                              {
                                modelValue: r.showErrorAlert,
                                'onUpdate:modelValue': t[1] || (t[1] = i => (r.showErrorAlert = i)),
                                closable: '',
                                density: 'compact',
                                icon: '$warning',
                                type: 'error',
                                variant: 'outlined'
                              },
                              {
                                default: f(() => [C('span', null, S(e.$t('SIGNUP_PAGE.MESSAGE.REQUEST_FAILED')), 1)]),
                                _: 1
                              },
                              8,
                              ['modelValue']
                            ),
                            l(
                              de,
                              {
                                modelValue: r.showSuccessAlert,
                                'onUpdate:modelValue': t[2] || (t[2] = i => (r.showSuccessAlert = i)),
                                closable: '',
                                density: 'compact',
                                icon: '$success',
                                type: 'success',
                                variant: 'outlined'
                              },
                              {
                                default: f(() => [
                                  C('span', null, S(e.$t('SIGNUP_PAGE.MESSAGE.REQUEST_SUCCESS')), 1),
                                  QA,
                                  C('span', null, S(e.$t('SIGNUP_PAGE.MESSAGE.REDIRECT_VERIFY')), 1)
                                ]),
                                _: 1
                              },
                              8,
                              ['modelValue']
                            )
                          ]),
                          _: 1
                        }
                      ),
                      l(
                        _,
                        { class: 'py-2' },
                        {
                          default: f(() => [
                            l(
                              _,
                              { class: 'py-2' },
                              {
                                default: f(() => [
                                  l(
                                    Bt,
                                    {
                                      modelValue: e.form.username,
                                      'onUpdate:modelValue': t[3] || (t[3] = i => (e.form.username = i)),
                                      label: e.$t('SIGNUP_PAGE.LABEL.USERNAME'),
                                      rules: o.rules.username,
                                      'prepend-inner-icon': 'mdi mdi-account',
                                      variant: 'outlined',
                                      error: !!r.error.username,
                                      'error-messages': r.error.username,
                                      disabled: !!e.submitFormSuccessResult
                                    },
                                    null,
                                    8,
                                    ['modelValue', 'label', 'rules', 'error', 'error-messages', 'disabled']
                                  )
                                ]),
                                _: 1
                              }
                            ),
                            l(
                              _,
                              { class: 'py-2' },
                              {
                                default: f(() => [
                                  l(
                                    Bt,
                                    {
                                      modelValue: e.form.displayName,
                                      'onUpdate:modelValue': t[4] || (t[4] = i => (e.form.displayName = i)),
                                      label: e.$t('SIGNUP_PAGE.LABEL.DISPLAY_NAME'),
                                      rules: o.rules.displayName,
                                      'prepend-inner-icon': 'mdi mdi-smart-card-outline',
                                      variant: 'outlined',
                                      disabled: !!e.submitFormSuccessResult
                                    },
                                    null,
                                    8,
                                    ['modelValue', 'label', 'rules', 'disabled']
                                  )
                                ]),
                                _: 1
                              }
                            ),
                            l(
                              _,
                              { class: 'py-2' },
                              {
                                default: f(() => [
                                  l(
                                    Bt,
                                    {
                                      modelValue: e.form.email,
                                      'onUpdate:modelValue': t[5] || (t[5] = i => (e.form.email = i)),
                                      label: e.$t('SIGNUP_PAGE.LABEL.EMAIL'),
                                      rules: o.rules.email,
                                      'prepend-inner-icon': 'mdi mdi-email-outline',
                                      variant: 'outlined',
                                      error: !!r.error.email,
                                      'error-messages': r.error.email,
                                      disabled: !!e.submitFormSuccessResult
                                    },
                                    null,
                                    8,
                                    ['modelValue', 'label', 'rules', 'error', 'error-messages', 'disabled']
                                  )
                                ]),
                                _: 1
                              }
                            ),
                            l(
                              _,
                              { class: 'py-2' },
                              {
                                default: f(() => [
                                  l(
                                    Bt,
                                    {
                                      modelValue: e.form.phoneNumber,
                                      'onUpdate:modelValue': t[6] || (t[6] = i => (e.form.phoneNumber = i)),
                                      label: e.$t('SIGNUP_PAGE.LABEL.PHONE_NUMBER'),
                                      rules: o.rules.phoneNumber,
                                      'prepend-inner-icon': 'mdi mdi-phone-dial',
                                      variant: 'outlined',
                                      error: !!r.error.phoneNumber,
                                      'error-messages': r.error.phoneNumber,
                                      disabled: !!e.submitFormSuccessResult
                                    },
                                    null,
                                    8,
                                    ['modelValue', 'label', 'rules', 'error', 'error-messages', 'disabled']
                                  )
                                ]),
                                _: 1
                              }
                            ),
                            l(
                              _,
                              { class: 'py-2 d-flex align-center justify-space-between' },
                              {
                                default: f(() => [
                                  l(
                                    _,
                                    { class: 'flex-grow-1' },
                                    {
                                      default: f(() => [
                                        vt(
                                          l(
                                            a,
                                            { to: { name: 'SigninPage' } },
                                            {
                                              default: f(() => [
                                                C('span', null, S(e.$t('SIGNUP_PAGE.ACTION.SING_IN_YOUR_ACCOUNT')), 1)
                                              ]),
                                              _: 1
                                            },
                                            512
                                          ),
                                          [[Wt, !e.isSubmittingForm]]
                                        )
                                      ]),
                                      _: 1
                                    }
                                  ),
                                  l(
                                    _,
                                    { class: 'flex-grow-0 text-right' },
                                    {
                                      default: f(() => [
                                        l(
                                          ae,
                                          {
                                            disabled: !!e.submitFormSuccessResult,
                                            loading: e.isSubmittingForm,
                                            'append-icon': 'mdi-login',
                                            onClick: o.onClickSubmit
                                          },
                                          { default: f(() => [ee(S(e.$t('SIGNUP_PAGE.ACTION.SIGNUP')), 1)]), _: 1 },
                                          8,
                                          ['disabled', 'loading', 'onClick']
                                        )
                                      ]),
                                      _: 1
                                    }
                                  )
                                ]),
                                _: 1
                              }
                            )
                          ]),
                          _: 1
                        }
                      )
                    ]),
                    _: 1
                  },
                  8,
                  ['modelValue']
                )
              ]),
              _: 1
            }
          )
        ]),
        _: 1
      }
    )
  )
}
const e1 = ue(zA, [['render', ZA]]),
  t1 = Ee({
    name: 'SignupRequestPage',
    components: { SignupForm: e1 },
    data() {
      return {}
    },
    computed: {
      ...Ke(zs, ['status', 'errorObject', 'isSubmittingForm']),
      isMobile() {
        const { sm: e, xs: t } = this.$vuetify.display
        return t || e
      }
    },
    methods: { ...Ye(zs, ['initial', 'showError']) },
    mounted() {
      this.initial()
    },
    errorCaptured(e) {
      this.showError(e)
    }
  })
function n1(e, t, n, s, r, o) {
  const a = he('s-page-loading'),
    i = he('s-page-error'),
    u = he('signup-form'),
    c = he('router-link')
  return e.status === 'READY'
    ? (F(), G(a, { key: 0 }))
    : e.status === 'ERROR'
      ? (F(), G(i, { key: 1, error: e.errorObject }, null, 8, ['error']))
      : e.status === 'WORKING'
        ? (F(),
          G(
            dt,
            { key: 2, class: 'overflow-hidden' },
            {
              default: f(() => [
                l(
                  _,
                  { width: '100%', 'max-width': '480px', class: 'mx-auto text-left' },
                  {
                    default: f(() => [
                      l(
                        _,
                        { class: 'pa-4 text-center' },
                        {
                          default: f(() => [
                            l(lt, { src: e.$config.siteLogo, 'max-width': '360px', class: 'mx-auto' }, null, 8, ['src'])
                          ]),
                          _: 1
                        }
                      ),
                      l(u),
                      l(
                        _,
                        { class: 'pt-5 text-center' },
                        {
                          default: f(() => [
                            vt(
                              l(
                                c,
                                { to: { name: 'ResetRequestPage' } },
                                {
                                  default: f(() => [
                                    C('span', null, S(e.$t('SIGNUP_PAGE.ACTION.RESET_YOUR_PASSWORD')), 1)
                                  ]),
                                  _: 1
                                },
                                512
                              ),
                              [[Wt, !e.isSubmittingForm]]
                            )
                          ]),
                          _: 1
                        }
                      )
                    ]),
                    _: 1
                  }
                )
              ]),
              _: 1
            }
          ))
        : We('', !0)
}
const s1 = ue(t1, [['render', n1]]),
  r1 = e => {
    const t = {}
    return (
      Object.keys(e).forEach(n => {
        const s = e[n]
        t[n] = typeof s == 'string' ? s.trim() : s
      }),
      t
    )
  },
  Dr = jt({
    id: 'SignupVerifyStore',
    state: () => ({
      status: 'READY',
      errorObject: !1,
      isValid: !1,
      form: { key: '', code: '', email: '' },
      isSubmittingForm: !1,
      submitFormErrorCode: !1,
      submitFormSuccessResult: !1
    }),
    actions: {
      async initial(e) {
        var t, n, s
        try {
          ;((this.form.key = e.key), (this.form.email = e.email), (this.status = 'WORKING'))
        } catch (r) {
          const o = new Error(`[${r.code}] ${r.message}`)
          ;((o.message = r.message || ((n = (t = r.response) == null ? void 0 : t.data) == null ? void 0 : n.message)),
            (o.code = ((s = r.response) == null ? void 0 : s.status) || r.code),
            (this.errorObject = o),
            (this.status = 'ERROR'))
        }
      },
      async submit() {
        var e, t
        try {
          ;((this.submitFormSuccessResult = !1), (this.submitFormErrorCode = !1), (this.isSubmittingForm = !0))
          const n = r1(this.form),
            s = await Oe.post('/signup/verify', n)
          ;(s.headers.code ? (this.submitFormErrorCode = s.headers.code) : (this.submitFormSuccessResult = s.data),
            (this.isSubmittingForm = !1))
        } catch (n) {
          ;(console.error(n),
            (this.submitFormErrorCode =
              ((t = (e = n.response) == null ? void 0 : e.headers) == null ? void 0 : t.code) || !0),
            (this.isSubmittingForm = !1))
        }
      },
      showError(e) {
        ;((this.status = 'ERROR'), (this.errorObject = e))
      },
      destroy() {
        this.$reset()
      }
    }
  })
function vi(e, t) {
  return { x: e.x + t.x, y: e.y + t.y }
}
function o1(e, t) {
  return { x: e.x - t.x, y: e.y - t.y }
}
function af(e, t) {
  if (e.side === 'top' || e.side === 'bottom') {
    const { side: n, align: s } = e,
      r = s === 'left' ? 0 : s === 'center' ? t.width / 2 : s === 'right' ? t.width : s,
      o = n === 'top' ? 0 : n === 'bottom' ? t.height : n
    return vi({ x: r, y: o }, t)
  } else if (e.side === 'left' || e.side === 'right') {
    const { side: n, align: s } = e,
      r = n === 'left' ? 0 : n === 'right' ? t.width : n,
      o = s === 'top' ? 0 : s === 'center' ? t.height / 2 : s === 'bottom' ? t.height : s
    return vi({ x: r, y: o }, t)
  }
  return vi({ x: t.width / 2, y: t.height / 2 }, t)
}
const Fg = { static: l1, connected: c1 },
  a1 = ie(
    {
      locationStrategy: {
        type: [String, Function],
        default: 'static',
        validator: e => typeof e == 'function' || e in Fg
      },
      location: { type: String, default: 'bottom' },
      origin: { type: String, default: 'auto' },
      offset: [Number, String, Array]
    },
    'VOverlay-location-strategies'
  )
function i1(e, t) {
  const n = _e({}),
    s = _e()
  ut &&
    ar(
      () => !!(t.isActive.value && e.locationStrategy),
      o => {
        var a, i
        ;(be(() => e.locationStrategy, o),
          Ht(() => {
            ;(window.removeEventListener('resize', r), (s.value = void 0))
          }),
          window.addEventListener('resize', r, { passive: !0 }),
          typeof e.locationStrategy == 'function'
            ? (s.value = (a = e.locationStrategy(t, e, n)) == null ? void 0 : a.updateLocation)
            : (s.value = (i = Fg[e.locationStrategy](t, e, n)) == null ? void 0 : i.updateLocation))
      }
    )
  function r(o) {
    var a
    ;(a = s.value) == null || a.call(s, o)
  }
  return { contentStyles: n, updateLocation: s }
}
function l1() {}
function u1(e, t) {
  t ? e.style.removeProperty('left') : e.style.removeProperty('right')
  const n = au(e)
  return (
    t ? (n.x += parseFloat(e.style.right || 0)) : (n.x -= parseFloat(e.style.left || 0)),
    (n.y -= parseFloat(e.style.top || 0)),
    n
  )
}
function c1(e, t, n) {
  ;(Array.isArray(e.target.value) || SO(e.target.value)) &&
    Object.assign(n.value, { position: 'fixed', top: 0, [e.isRtl.value ? 'right' : 'left']: 0 })
  const { preferredAnchor: r, preferredOrigin: o } = ou(() => {
      const y = sl(t.location, e.isRtl.value),
        v = t.origin === 'overlap' ? y : t.origin === 'auto' ? hi(y) : sl(t.origin, e.isRtl.value)
      return y.side === v.side && y.align === gi(v).align
        ? { preferredAnchor: Td(y), preferredOrigin: Td(v) }
        : { preferredAnchor: y, preferredOrigin: v }
    }),
    [a, i, u, c] = ['minWidth', 'minHeight', 'maxWidth', 'maxHeight'].map(y =>
      M(() => {
        const v = parseFloat(t[y])
        return isNaN(v) ? 1 / 0 : v
      })
    ),
    d = M(() => {
      if (Array.isArray(t.offset)) return t.offset
      if (typeof t.offset == 'string') {
        const y = t.offset.split(' ').map(parseFloat)
        return (y.length < 2 && y.push(0), y)
      }
      return typeof t.offset == 'number' ? [t.offset, 0] : [0, 0]
    })
  let m = !1
  const h = new ResizeObserver(() => {
    m && E()
  })
  ;(be(
    [e.target, e.contentEl],
    (y, v) => {
      let [I, b] = y,
        [O, P] = v
      ;(O && !Array.isArray(O) && h.unobserve(O),
        I && !Array.isArray(I) && h.observe(I),
        P && h.unobserve(P),
        b && h.observe(b))
    },
    { immediate: !0 }
  ),
    Ht(() => {
      h.disconnect()
    }))
  function E() {
    if (((m = !1), requestAnimationFrame(() => (m = !0)), !e.target.value || !e.contentEl.value)) return
    const y = zh(e.target.value),
      v = u1(e.contentEl.value, e.isRtl.value),
      I = ra(e.contentEl.value),
      b = 12
    I.length ||
      (I.push(document.documentElement),
      (e.contentEl.value.style.top && e.contentEl.value.style.left) ||
        ((v.x -= parseFloat(document.documentElement.style.getPropertyValue('--v-body-scroll-x') || 0)),
        (v.y -= parseFloat(document.documentElement.style.getPropertyValue('--v-body-scroll-y') || 0))))
    const O = I.reduce(
      (j, D) => {
        const U = D.getBoundingClientRect(),
          X = new As({
            x: D === document.documentElement ? 0 : U.x,
            y: D === document.documentElement ? 0 : U.y,
            width: D.clientWidth,
            height: D.clientHeight
          })
        return j
          ? new As({
              x: Math.max(j.left, X.left),
              y: Math.max(j.top, X.top),
              width: Math.min(j.right, X.right) - Math.max(j.left, X.left),
              height: Math.min(j.bottom, X.bottom) - Math.max(j.top, X.top)
            })
          : X
      },
      void 0
    )
    ;((O.x += b), (O.y += b), (O.width -= b * 2), (O.height -= b * 2))
    let P = { anchor: r.value, origin: o.value }
    function T(j) {
      const D = new As(v),
        U = af(j.anchor, y),
        X = af(j.origin, D)
      let { x: ge, y: te } = o1(U, X)
      switch (j.anchor.side) {
        case 'top':
          te -= d.value[0]
          break
        case 'bottom':
          te += d.value[0]
          break
        case 'left':
          ge -= d.value[0]
          break
        case 'right':
          ge += d.value[0]
          break
      }
      switch (j.anchor.align) {
        case 'top':
          te -= d.value[1]
          break
        case 'bottom':
          te += d.value[1]
          break
        case 'left':
          ge -= d.value[1]
          break
        case 'right':
          ge += d.value[1]
          break
      }
      return (
        (D.x += ge),
        (D.y += te),
        (D.width = Math.min(D.width, u.value)),
        (D.height = Math.min(D.height, c.value)),
        { overflows: wd(D, O), x: ge, y: te }
      )
    }
    let $ = 0,
      L = 0
    const N = { x: 0, y: 0 },
      A = { x: !1, y: !1 }
    let w = -1
    for (; !(w++ > 10); ) {
      const { x: j, y: D, overflows: U } = T(P)
      ;(($ += j), (L += D), (v.x += j), (v.y += D))
      {
        const X = Nd(P.anchor),
          ge = U.x.before || U.x.after,
          te = U.y.before || U.y.after
        let fe = !1
        if (
          (['x', 'y'].forEach(ce => {
            if ((ce === 'x' && ge && !A.x) || (ce === 'y' && te && !A.y)) {
              const ke = { anchor: { ...P.anchor }, origin: { ...P.origin } },
                ze = ce === 'x' ? (X === 'y' ? gi : hi) : X === 'y' ? hi : gi
              ;((ke.anchor = ze(ke.anchor)), (ke.origin = ze(ke.origin)))
              const { overflows: Ie } = T(ke)
              ;((Ie[ce].before <= U[ce].before && Ie[ce].after <= U[ce].after) ||
                Ie[ce].before + Ie[ce].after < (U[ce].before + U[ce].after) / 2) &&
                ((P = ke), (fe = A[ce] = !0))
            }
          }),
          fe)
        )
          continue
      }
      ;(U.x.before && (($ += U.x.before), (v.x += U.x.before)),
        U.x.after && (($ -= U.x.after), (v.x -= U.x.after)),
        U.y.before && ((L += U.y.before), (v.y += U.y.before)),
        U.y.after && ((L -= U.y.after), (v.y -= U.y.after)))
      {
        const X = wd(v, O)
        ;((N.x = O.width - X.x.before - X.x.after),
          (N.y = O.height - X.y.before - X.y.after),
          ($ += X.x.before),
          (v.x += X.x.before),
          (L += X.y.before),
          (v.y += X.y.before))
      }
      break
    }
    const B = Nd(P.anchor)
    return (
      Object.assign(n.value, {
        '--v-overlay-anchor-origin': `${P.anchor.side} ${P.anchor.align}`,
        transformOrigin: `${P.origin.side} ${P.origin.align}`,
        top: Te(bi(L)),
        left: e.isRtl.value ? void 0 : Te(bi($)),
        right: e.isRtl.value ? Te(bi(-$)) : void 0,
        minWidth: Te(B === 'y' ? Math.min(a.value, y.width) : a.value),
        maxWidth: Te(lf(tl(N.x, a.value === 1 / 0 ? 0 : a.value, u.value))),
        maxHeight: Te(lf(tl(N.y, i.value === 1 / 0 ? 0 : i.value, c.value)))
      }),
      { available: N, contentBox: v }
    )
  }
  return (
    be(
      () => [r.value, o.value, t.offset, t.minWidth, t.minHeight, t.maxWidth, t.maxHeight],
      () => E()
    ),
    Et(() => {
      const y = E()
      if (!y) return
      const { available: v, contentBox: I } = y
      I.height > v.y &&
        requestAnimationFrame(() => {
          ;(E(),
            requestAnimationFrame(() => {
              E()
            }))
        })
    }),
    { updateLocation: E }
  )
}
function bi(e) {
  return Math.round(e * devicePixelRatio) / devicePixelRatio
}
function lf(e) {
  return Math.ceil(e * devicePixelRatio) / devicePixelRatio
}
let ul = !0
const ca = []
function d1(e) {
  !ul || ca.length ? (ca.push(e), cl()) : ((ul = !1), e(), cl())
}
let uf = -1
function cl() {
  ;(cancelAnimationFrame(uf),
    (uf = requestAnimationFrame(() => {
      const e = ca.shift()
      ;(e && e(), ca.length ? cl() : (ul = !0))
    })))
}
const Go = { none: null, close: h1, block: g1, reposition: p1 },
  f1 = ie(
    {
      scrollStrategy: { type: [String, Function], default: 'block', validator: e => typeof e == 'function' || e in Go }
    },
    'VOverlay-scroll-strategies'
  )
function m1(e, t) {
  if (!ut) return
  let n
  ;(ls(async () => {
    ;(n == null || n.stop(),
      t.isActive.value &&
        e.scrollStrategy &&
        ((n = cr()),
        await Et(),
        n.active &&
          n.run(() => {
            var s
            typeof e.scrollStrategy == 'function'
              ? e.scrollStrategy(t, e, n)
              : (s = Go[e.scrollStrategy]) == null || s.call(Go, t, e, n)
          })))
  }),
    Ht(() => {
      n == null || n.stop()
    }))
}
function h1(e) {
  function t(n) {
    e.isActive.value = !1
  }
  Vg(e.targetEl.value ?? e.contentEl.value, t)
}
function g1(e, t) {
  var a
  const n = (a = e.root.value) == null ? void 0 : a.offsetParent,
    s = [
      ...new Set([
        ...ra(e.targetEl.value, t.contained ? n : void 0),
        ...ra(e.contentEl.value, t.contained ? n : void 0)
      ])
    ].filter(i => !i.classList.contains('v-overlay-scroll-blocked')),
    r = window.innerWidth - document.documentElement.offsetWidth,
    o = (i => uu(i) && i)(n || document.documentElement)
  ;(o && e.root.value.classList.add('v-overlay--scroll-blocked'),
    s.forEach((i, u) => {
      ;(i.style.setProperty('--v-body-scroll-x', Te(-i.scrollLeft)),
        i.style.setProperty('--v-body-scroll-y', Te(-i.scrollTop)),
        i !== document.documentElement && i.style.setProperty('--v-scrollbar-offset', Te(r)),
        i.classList.add('v-overlay-scroll-blocked'))
    }),
    Ht(() => {
      ;(s.forEach((i, u) => {
        const c = parseFloat(i.style.getPropertyValue('--v-body-scroll-x')),
          d = parseFloat(i.style.getPropertyValue('--v-body-scroll-y')),
          m = i.style.scrollBehavior
        ;((i.style.scrollBehavior = 'auto'),
          i.style.removeProperty('--v-body-scroll-x'),
          i.style.removeProperty('--v-body-scroll-y'),
          i.style.removeProperty('--v-scrollbar-offset'),
          i.classList.remove('v-overlay-scroll-blocked'),
          (i.scrollLeft = -c),
          (i.scrollTop = -d),
          (i.style.scrollBehavior = m))
      }),
        o && e.root.value.classList.remove('v-overlay--scroll-blocked'))
    }))
}
function p1(e, t, n) {
  let s = !1,
    r = -1,
    o = -1
  function a(i) {
    d1(() => {
      var d, m
      const u = performance.now()
      ;((m = (d = e.updateLocation).value) == null || m.call(d, i), (s = (performance.now() - u) / (1e3 / 60) > 2))
    })
  }
  ;((o = (typeof requestIdleCallback > 'u' ? i => i() : requestIdleCallback)(() => {
    n.run(() => {
      Vg(e.targetEl.value ?? e.contentEl.value, i => {
        s
          ? (cancelAnimationFrame(r),
            (r = requestAnimationFrame(() => {
              r = requestAnimationFrame(() => {
                a(i)
              })
            })))
          : a(i)
      })
    })
  })),
    Ht(() => {
      ;(typeof cancelIdleCallback < 'u' && cancelIdleCallback(o), cancelAnimationFrame(r))
    }))
}
function Vg(e, t) {
  const n = [document, ...ra(e)]
  ;(n.forEach(s => {
    s.addEventListener('scroll', t, { passive: !0 })
  }),
    Ht(() => {
      n.forEach(s => {
        s.removeEventListener('scroll', t)
      })
    }))
}
const E1 = Symbol.for('vuetify:v-menu'),
  _1 = ie({ closeDelay: [Number, String], openDelay: [Number, String] }, 'delay')
function y1(e, t) {
  let n = () => {}
  function s(a) {
    n == null || n()
    const i = Number(a ? e.openDelay : e.closeDelay)
    return new Promise(u => {
      n = WR(i, () => {
        ;(t == null || t(a), u(a))
      })
    })
  }
  function r() {
    return s(!0)
  }
  function o() {
    return s(!1)
  }
  return { clearDelay: n, runOpenDelay: r, runCloseDelay: o }
}
const v1 = ie(
  {
    target: [String, Object],
    activator: [String, Object],
    activatorProps: { type: Object, default: () => ({}) },
    openOnClick: { type: Boolean, default: void 0 },
    openOnHover: Boolean,
    openOnFocus: { type: Boolean, default: void 0 },
    closeOnContentClick: Boolean,
    ..._1()
  },
  'VOverlay-activator'
)
function b1(e, t) {
  let { isActive: n, isTop: s } = t
  const r = Tt('useActivator'),
    o = _e()
  let a = !1,
    i = !1,
    u = !0
  const c = M(() => e.openOnFocus || (e.openOnFocus == null && e.openOnHover)),
    d = M(() => e.openOnClick || (e.openOnClick == null && !e.openOnHover && !c.value)),
    { runOpenDelay: m, runCloseDelay: h } = y1(e, N => {
      N === ((e.openOnHover && a) || (c.value && i)) &&
        !(e.openOnHover && n.value && !s.value) &&
        (n.value !== N && (u = !0), (n.value = N))
    }),
    E = _e(),
    y = {
      onClick: N => {
        ;(N.stopPropagation(),
          (o.value = N.currentTarget || N.target),
          n.value || (E.value = [N.clientX, N.clientY]),
          (n.value = !n.value))
      },
      onMouseenter: N => {
        var A
        ;((A = N.sourceCapabilities) != null && A.firesTouchEvents) ||
          ((a = !0), (o.value = N.currentTarget || N.target), m())
      },
      onMouseleave: N => {
        ;((a = !1), h())
      },
      onFocus: N => {
        Kh(N.target, ':focus-visible') !== !1 &&
          ((i = !0), N.stopPropagation(), (o.value = N.currentTarget || N.target), m())
      },
      onBlur: N => {
        ;((i = !1), N.stopPropagation(), h())
      }
    },
    v = M(() => {
      const N = {}
      return (
        d.value && (N.onClick = y.onClick),
        e.openOnHover && ((N.onMouseenter = y.onMouseenter), (N.onMouseleave = y.onMouseleave)),
        c.value && ((N.onFocus = y.onFocus), (N.onBlur = y.onBlur)),
        N
      )
    }),
    I = M(() => {
      const N = {}
      if (
        (e.openOnHover &&
          ((N.onMouseenter = () => {
            ;((a = !0), m())
          }),
          (N.onMouseleave = () => {
            ;((a = !1), h())
          })),
        c.value &&
          ((N.onFocusin = () => {
            ;((i = !0), m())
          }),
          (N.onFocusout = () => {
            ;((i = !1), h())
          })),
        e.closeOnContentClick)
      ) {
        const A = it(E1, null)
        N.onClick = () => {
          ;((n.value = !1), A == null || A.closeParents())
        }
      }
      return N
    }),
    b = M(() => {
      const N = {}
      return (
        e.openOnHover &&
          ((N.onMouseenter = () => {
            u && ((a = !0), (u = !1), m())
          }),
          (N.onMouseleave = () => {
            ;((a = !1), h())
          })),
        N
      )
    })
  ;(be(s, N => {
    N && ((e.openOnHover && !a && (!c.value || !i)) || (c.value && !i && (!e.openOnHover || !a))) && (n.value = !1)
  }),
    be(
      n,
      N => {
        N ||
          setTimeout(() => {
            E.value = void 0
          })
      },
      { flush: 'post' }
    ))
  const O = _e()
  ls(() => {
    O.value &&
      Et(() => {
        o.value = Qr(O.value)
      })
  })
  const P = _e(),
    T = M(() => (e.target === 'cursor' && E.value ? E.value : P.value ? Qr(P.value) : xg(e.target, r) || o.value)),
    $ = M(() => (Array.isArray(T.value) ? void 0 : T.value))
  let L
  return (
    be(
      () => !!e.activator,
      N => {
        N && ut
          ? ((L = cr()),
            L.run(() => {
              S1(e, r, { activatorEl: o, activatorEvents: v })
            }))
          : L && L.stop()
      },
      { flush: 'post', immediate: !0 }
    ),
    Ht(() => {
      L == null || L.stop()
    }),
    {
      activatorEl: o,
      activatorRef: O,
      target: T,
      targetEl: $,
      targetRef: P,
      activatorEvents: v,
      contentEvents: I,
      scrimEvents: b
    }
  )
}
function S1(e, t, n) {
  let { activatorEl: s, activatorEvents: r } = n
  ;(be(
    () => e.activator,
    (u, c) => {
      if (c && u !== c) {
        const d = i(c)
        d && a(d)
      }
      u && Et(() => o())
    },
    { immediate: !0 }
  ),
    be(
      () => e.activatorProps,
      () => {
        o()
      }
    ),
    Ht(() => {
      a()
    }))
  function o() {
    let u = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : i(),
      c = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : e.activatorProps
    u && jR(u, Ge(r.value, c))
  }
  function a() {
    let u = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : i(),
      c = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : e.activatorProps
    u && YR(u, Ge(r.value, c))
  }
  function i() {
    let u = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : e.activator
    const c = xg(u, t)
    return ((s.value = (c == null ? void 0 : c.nodeType) === Node.ELEMENT_NODE ? c : void 0), s.value)
  }
}
function xg(e, t) {
  var s, r
  if (!e) return
  let n
  if (e === 'parent') {
    let o = (r = (s = t == null ? void 0 : t.proxy) == null ? void 0 : s.$el) == null ? void 0 : r.parentNode
    for (; o != null && o.hasAttribute('data-no-activator'); ) o = o.parentNode
    n = o
  } else typeof e == 'string' ? (n = document.querySelector(e)) : '$el' in e ? (n = e.$el) : (n = e)
  return n
}
function R1() {
  if (!ut) return je(!1)
  const { ssr: e } = Cg()
  if (e) {
    const t = je(!1)
    return (
      xn(() => {
        t.value = !0
      }),
      t
    )
  } else return je(!0)
}
const O1 = ie({ eager: Boolean }, 'lazy')
function C1(e, t) {
  const n = je(!1),
    s = M(() => n.value || e.eager || t.value)
  be(t, () => (n.value = !0))
  function r() {
    e.eager || (n.value = !1)
  }
  return { isBooted: n, hasContent: s, onAfterLeave: r }
}
function vu() {
  const t = Tt('useScopeId').vnode.scopeId
  return { scopeId: t ? { [t]: '' } : void 0 }
}
const cf = Symbol.for('vuetify:stack'),
  Or = At([])
function A1(e, t, n) {
  const s = Tt('useStack'),
    r = !n,
    o = it(cf, void 0),
    a = At({ activeChildren: new Set() })
  Ut(cf, a)
  const i = je(+t.value)
  ar(e, () => {
    var m
    const d = (m = Or.at(-1)) == null ? void 0 : m[1]
    ;((i.value = d ? d + 10 : +t.value),
      r && Or.push([s.uid, i.value]),
      o == null || o.activeChildren.add(s.uid),
      Ht(() => {
        if (r) {
          const h = Me(Or).findIndex(E => E[0] === s.uid)
          Or.splice(h, 1)
        }
        o == null || o.activeChildren.delete(s.uid)
      }))
  })
  const u = je(!0)
  r &&
    ls(() => {
      var m
      const d = ((m = Or.at(-1)) == null ? void 0 : m[0]) === s.uid
      setTimeout(() => (u.value = d))
    })
  const c = M(() => !a.activeChildren.size)
  return { globalTop: so(u), localTop: c, stackStyles: M(() => ({ zIndex: i.value })) }
}
function I1(e) {
  return {
    teleportTarget: M(() => {
      const n = e.value
      if (n === !0 || !ut) return
      const s = n === !1 ? document.body : typeof n == 'string' ? document.querySelector(n) : n
      if (s == null) return
      let r = s.querySelector(':scope > .v-overlay-container')
      return (r || ((r = document.createElement('div')), (r.className = 'v-overlay-container'), s.appendChild(r)), r)
    })
  }
}
function T1() {
  return !0
}
function Bg(e, t, n) {
  if (!e || Ug(e, n) === !1) return !1
  const s = tg(t)
  if (typeof ShadowRoot < 'u' && s instanceof ShadowRoot && s.host === e.target) return !1
  const r = ((typeof n.value == 'object' && n.value.include) || (() => []))()
  return (r.push(t), !r.some(o => (o == null ? void 0 : o.contains(e.target))))
}
function Ug(e, t) {
  return ((typeof t.value == 'object' && t.value.closeConditional) || T1)(e)
}
function N1(e, t, n) {
  const s = typeof n.value == 'function' ? n.value : n.value.handler
  t._clickOutside.lastMousedownWasOutside &&
    Bg(e, t, n) &&
    setTimeout(() => {
      Ug(e, n) && s && s(e)
    }, 0)
}
function df(e, t) {
  const n = tg(e)
  ;(t(document), typeof ShadowRoot < 'u' && n instanceof ShadowRoot && t(n))
}
const w1 = {
  mounted(e, t) {
    const n = r => N1(r, e, t),
      s = r => {
        e._clickOutside.lastMousedownWasOutside = Bg(r, e, t)
      }
    ;(df(e, r => {
      ;(r.addEventListener('click', n, !0), r.addEventListener('mousedown', s, !0))
    }),
      e._clickOutside || (e._clickOutside = { lastMousedownWasOutside: !1 }),
      (e._clickOutside[t.instance.$.uid] = { onClick: n, onMousedown: s }))
  },
  unmounted(e, t) {
    e._clickOutside &&
      (df(e, n => {
        var o
        if (!n || !((o = e._clickOutside) != null && o[t.instance.$.uid])) return
        const { onClick: s, onMousedown: r } = e._clickOutside[t.instance.$.uid]
        ;(n.removeEventListener('click', s, !0), n.removeEventListener('mousedown', r, !0))
      }),
      delete e._clickOutside[t.instance.$.uid])
  }
}
function L1(e) {
  const { modelValue: t, color: n, ...s } = e
  return l(
    Dn,
    { name: 'fade-transition', appear: !0 },
    {
      default: () => [
        e.modelValue &&
          l(
            'div',
            Ge(
              {
                class: ['v-overlay__scrim', e.color.backgroundColorClasses.value],
                style: e.color.backgroundColorStyles.value
              },
              s
            ),
            null
          )
      ]
    }
  )
}
const bu = ie(
    {
      absolute: Boolean,
      attach: [Boolean, String, Object],
      closeOnBack: { type: Boolean, default: !0 },
      contained: Boolean,
      contentClass: null,
      contentProps: null,
      disabled: Boolean,
      opacity: [Number, String],
      noClickAnimation: Boolean,
      modelValue: Boolean,
      persistent: Boolean,
      scrim: { type: [Boolean, String], default: !0 },
      zIndex: { type: [Number, String], default: 2e3 },
      ...v1(),
      ...Qe(),
      ...$s(),
      ...O1(),
      ...a1(),
      ...f1(),
      ...Ot(),
      ...Ha()
    },
    'VOverlay'
  ),
  no = Ae()({
    name: 'VOverlay',
    directives: { ClickOutside: w1 },
    inheritAttrs: !1,
    props: { _disableGlobalStack: Boolean, ...bu() },
    emits: { 'click:outside': e => !0, 'update:modelValue': e => !0, afterLeave: () => !0 },
    setup(e, t) {
      let { slots: n, attrs: s, emit: r } = t
      const o = Nt(e, 'modelValue'),
        a = M({
          get: () => o.value,
          set: Le => {
            ;(Le && e.disabled) || (o.value = Le)
          }
        }),
        { teleportTarget: i } = I1(M(() => e.attach || e.contained)),
        { themeClasses: u } = Pt(e),
        { rtlClasses: c, isRtl: d } = fs(),
        { hasContent: m, onAfterLeave: h } = C1(e, a),
        E = is(M(() => (typeof e.scrim == 'string' ? e.scrim : null))),
        { globalTop: y, localTop: v, stackStyles: I } = A1(a, De(e, 'zIndex'), e._disableGlobalStack),
        {
          activatorEl: b,
          activatorRef: O,
          target: P,
          targetEl: T,
          targetRef: $,
          activatorEvents: L,
          contentEvents: N,
          scrimEvents: A
        } = b1(e, { isActive: a, isTop: v }),
        { dimensionStyles: w } = Ms(e),
        B = R1(),
        { scopeId: j } = vu()
      be(
        () => e.disabled,
        Le => {
          Le && (a.value = !1)
        }
      )
      const D = _e(),
        U = _e(),
        { contentStyles: X, updateLocation: ge } = i1(e, { isRtl: d, contentEl: U, target: P, isActive: a })
      m1(e, { root: D, contentEl: U, targetEl: T, isActive: a, updateLocation: ge })
      function te(Le) {
        ;(r('click:outside', Le), e.persistent ? Ie() : (a.value = !1))
      }
      function fe() {
        return a.value && y.value
      }
      ;(ut &&
        be(
          a,
          Le => {
            Le ? window.addEventListener('keydown', ce) : window.removeEventListener('keydown', ce)
          },
          { immediate: !0 }
        ),
        Sn(() => {
          ut && window.removeEventListener('keydown', ce)
        }))
      function ce(Le) {
        var et, bt
        Le.key === 'Escape' &&
          y.value &&
          (e.persistent
            ? Ie()
            : ((a.value = !1),
              (et = U.value) != null && et.contains(document.activeElement) && ((bt = b.value) == null || bt.focus())))
      }
      const ke = JO()
      ar(
        () => e.closeOnBack,
        () => {
          QO(ke, Le => {
            y.value && a.value ? (Le(!1), e.persistent ? Ie() : (a.value = !1)) : Le()
          })
        }
      )
      const ze = _e()
      be(
        () => a.value && (e.absolute || e.contained) && i.value == null,
        Le => {
          if (Le) {
            const et = yO(D.value)
            et && et !== document.scrollingElement && (ze.value = et.scrollTop)
          }
        }
      )
      function Ie() {
        e.noClickAnimation ||
          (U.value &&
            Hs(U.value, [{ transformOrigin: 'center' }, { transform: 'scale(1.03)' }, { transformOrigin: 'center' }], {
              duration: 150,
              easing: sa
            }))
      }
      function xe() {
        ;(h(), r('afterLeave'))
      }
      return (
        Ve(() => {
          var Le
          return l(Ue, null, [
            (Le = n.activator) == null
              ? void 0
              : Le.call(n, { isActive: a.value, props: Ge({ ref: O, targetRef: $ }, L.value, e.activatorProps) }),
            B.value &&
              m.value &&
              l(
                LE,
                { disabled: !i.value, to: i.value },
                {
                  default: () => [
                    l(
                      'div',
                      Ge(
                        {
                          class: [
                            'v-overlay',
                            {
                              'v-overlay--absolute': e.absolute || e.contained,
                              'v-overlay--active': a.value,
                              'v-overlay--contained': e.contained
                            },
                            u.value,
                            c.value,
                            e.class
                          ],
                          style: [I.value, { '--v-overlay-opacity': e.opacity, top: Te(ze.value) }, e.style],
                          ref: D
                        },
                        j,
                        s
                      ),
                      [
                        l(L1, Ge({ color: E, modelValue: a.value && !!e.scrim }, A.value), null),
                        l(
                          bs,
                          { appear: !0, persisted: !0, transition: e.transition, target: P.value, onAfterLeave: xe },
                          {
                            default: () => {
                              var et
                              return [
                                vt(
                                  l(
                                    'div',
                                    Ge(
                                      {
                                        ref: U,
                                        class: ['v-overlay__content', e.contentClass],
                                        style: [w.value, X.value]
                                      },
                                      N.value,
                                      e.contentProps
                                    ),
                                    [(et = n.default) == null ? void 0 : et.call(n, { isActive: a })]
                                  ),
                                  [
                                    [Wt, a.value],
                                    [
                                      dr('click-outside'),
                                      { handler: te, closeConditional: fe, include: () => [b.value] }
                                    ]
                                  ]
                                )
                              ]
                            }
                          }
                        )
                      ]
                    )
                  ]
                }
              )
          ])
        }),
        { activatorEl: b, target: P, animateClick: Ie, contentEl: U, globalTop: y, localTop: v, updateLocation: ge }
      )
    }
  }),
  P1 = ie(
    {
      autofocus: Boolean,
      divider: String,
      focusAll: Boolean,
      label: { type: String, default: '$vuetify.input.otp' },
      length: { type: [Number, String], default: 6 },
      modelValue: { type: [Number, String], default: void 0 },
      placeholder: String,
      type: { type: String, default: 'number' },
      ...$s(),
      ...gu(),
      ...VR(Eu({ variant: 'outlined' }), [
        'baseColor',
        'bgColor',
        'class',
        'color',
        'disabled',
        'error',
        'loading',
        'rounded',
        'style',
        'theme',
        'variant'
      ])
    },
    'VOtpInput'
  ),
  Gg = Ae()({
    name: 'VOtpInput',
    props: P1(),
    emits: { finish: e => !0, 'update:focused': e => !0, 'update:modelValue': e => !0 },
    setup(e, t) {
      let { attrs: n, emit: s, slots: r } = t
      const { dimensionStyles: o } = Ms(e),
        { isFocused: a, focus: i, blur: u } = pu(e),
        c = Nt(
          e,
          'modelValue',
          '',
          N => String(N).split(''),
          N => N.join('')
        ),
        { t: d } = Wa(),
        m = M(() => Number(e.length)),
        h = M(() => Array(m.value).fill(0)),
        E = _e(-1),
        y = _e(),
        v = _e([]),
        I = M(() => v.value[E.value])
      function b() {
        if (e.type === 'number' && /[^0-9]/g.test(I.value.value)) {
          I.value.value = ''
          return
        }
        const N = c.value.slice(),
          A = I.value.value
        N[E.value] = A
        let w = null
        ;(E.value > c.value.length ? (w = c.value.length + 1) : E.value + 1 !== m.value && (w = 'next'),
          (c.value = N),
          w && nl(y.value, w))
      }
      function O(N) {
        const A = c.value.slice(),
          w = E.value
        let B = null
        ;['ArrowLeft', 'ArrowRight', 'Backspace', 'Delete'].includes(N.key) &&
          (N.preventDefault(),
          N.key === 'ArrowLeft'
            ? (B = 'prev')
            : N.key === 'ArrowRight'
              ? (B = 'next')
              : ['Backspace', 'Delete'].includes(N.key) &&
                ((A[E.value] = ''),
                (c.value = A),
                E.value > 0 && N.key === 'Backspace'
                  ? (B = 'prev')
                  : requestAnimationFrame(() => {
                      var j
                      ;(j = v.value[w]) == null || j.select()
                    })),
          requestAnimationFrame(() => {
            B != null && nl(y.value, B)
          }))
      }
      function P(N, A) {
        var w, B
        ;(A.preventDefault(),
          A.stopPropagation(),
          (c.value = (((w = A == null ? void 0 : A.clipboardData) == null ? void 0 : w.getData('Text')) ?? '').split(
            ''
          )),
          (B = v.value) == null || B[N].blur())
      }
      function T() {
        c.value = []
      }
      function $(N, A) {
        ;(i(), (E.value = A))
      }
      function L() {
        ;(u(), (E.value = -1))
      }
      return (
        Is(
          {
            VField: {
              color: M(() => e.color),
              bgColor: M(() => e.color),
              baseColor: M(() => e.baseColor),
              disabled: M(() => e.disabled),
              error: M(() => e.error),
              variant: M(() => e.variant)
            }
          },
          { scoped: !0 }
        ),
        be(
          c,
          N => {
            N.length === m.value && s('finish', N.join(''))
          },
          { deep: !0 }
        ),
        be(E, N => {
          N < 0 ||
            Et(() => {
              var A
              ;(A = v.value[N]) == null || A.select()
            })
        }),
        Ve(() => {
          var w
          const [N, A] = xa(n)
          return l(
            'div',
            Ge({ class: ['v-otp-input', { 'v-otp-input--divided': !!e.divider }, e.class], style: [e.style] }, N),
            [
              l('div', { ref: y, class: 'v-otp-input__content', style: [o.value] }, [
                h.value.map((B, j) =>
                  l(Ue, null, [
                    e.divider && j !== 0 && l('span', { class: 'v-otp-input__divider' }, [e.divider]),
                    l(
                      _u,
                      { focused: (a.value && e.focusAll) || E.value === j, key: j },
                      {
                        ...r,
                        loader: void 0,
                        default: () =>
                          l(
                            'input',
                            {
                              ref: D => (v.value[j] = D),
                              'aria-label': d(e.label, j + 1),
                              autofocus: j === 0 && e.autofocus,
                              autocomplete: 'one-time-code',
                              class: ['v-otp-input__field'],
                              disabled: e.disabled,
                              inputmode: e.type === 'number' ? 'numeric' : 'text',
                              min: e.type === 'number' ? 0 : void 0,
                              maxlength: '1',
                              placeholder: e.placeholder,
                              type: e.type === 'number' ? 'text' : e.type,
                              value: c.value[j],
                              onInput: b,
                              onFocus: D => $(D, j),
                              onBlur: L,
                              onKeydown: O,
                              onPaste: D => P(j, D)
                            },
                            null
                          )
                      }
                    )
                  ])
                ),
                l('input', Ge({ class: 'v-otp-input-input', type: 'hidden' }, A, { value: c.value.join('') }), null),
                l(
                  no,
                  { contained: !0, 'content-class': 'v-otp-input__loader', 'model-value': !!e.loading, persistent: !0 },
                  {
                    default: () => {
                      var B
                      return [
                        ((B = r.loader) == null ? void 0 : B.call(r)) ??
                          l(
                            ho,
                            {
                              color: typeof e.loading == 'boolean' ? void 0 : e.loading,
                              indeterminate: !0,
                              size: '24',
                              width: '2'
                            },
                            null
                          )
                      ]
                    }
                  }
                ),
                (w = r.default) == null ? void 0 : w.call(r)
              ])
            ]
          )
        }),
        {
          blur: () => {
            var N
            ;(N = v.value) == null || N.some(A => A.blur())
          },
          focus: () => {
            var N
            ;(N = v.value) == null || N[0].focus()
          },
          reset: T,
          isFocused: a
        }
      )
    }
  }),
  $1 = {
    name: 'VerifyForm',
    data() {
      return { showErrorAlert: !1, showIncorrectAlert: !1, showSuccessAlert: !1, showPassword: !1 }
    },
    computed: {
      ...an(Dr, ['form', 'isValid', 'submitFormErrorCode']),
      ...Ke(Dr, ['isSubmittingForm', 'submitFormSuccessResult']),
      isMobile() {
        const { sm: e, xs: t } = this.$vuetify.display
        return t || e
      }
    },
    watch: {
      'form.code'() {
        ;(this.showIncorrectAlert && (this.showIncorrectAlert = !1), this.showErrorAlert && (this.showErrorAlert = !1))
      },
      showIncorrectAlert() {
        this.showIncorrectAlert || (this.submitFormErrorCode = !1)
      },
      showErrorAlert() {
        this.showErrorAlert || (this.submitFormErrorCode = !1)
      },
      isSubmittingForm() {
        this.isSubmittingForm && ((this.showIncorrectAlert = !1), (this.showErrorAlert = !1))
      },
      submitFormErrorCode() {
        this.submitFormErrorCode === '1' || this.submitFormErrorCode === '2' || this.submitFormErrorCode === '3'
          ? this.$router.push({ name: 'DuplicatedInfoPage' })
          : this.submitFormErrorCode === '7'
            ? this.$router.push({ name: 'CodeExpiredPage' })
            : this.submitFormErrorCode === '5'
              ? (this.showIncorrectAlert = !0)
              : this.submitFormErrorCode && (this.showErrorAlert = !0)
      },
      submitFormSuccessResult() {
        this.submitFormSuccessResult &&
          (this.showSnackbar({
            message: `${this.$t('SIGNUP_PAGE.MESSAGE.VERIFY_SUCCESS')} ${this.$t('SIGNUP_PAGE.MESSAGE.REDIRECT_PASSWORD')}`,
            timeout: 5e3
          }),
          this.$router.push({
            name: 'SignupPasswordPage',
            query: { key: this.submitFormSuccessResult.key, secret: this.submitFormSuccessResult.secret }
          }))
      }
    },
    methods: {
      ...Ye(gt, ['showSnackbar']),
      ...Ye(Dr, ['submit']),
      onClickBack() {
        this.$router.push({ name: 'SignupRequestPage' })
      },
      async onClickSubmit() {
        const { valid: e } = await this.$refs.form.validate()
        e && this.submit()
      }
    }
  },
  M1 = { class: 'font-weight-medium text-secondary' },
  k1 = C('br', null, null, -1),
  D1 = { class: 'text-grey-darken-3' },
  F1 = C('br', null, null, -1),
  V1 = { class: 'text-grey-darken-3' }
function x1(e, t, n, s, r, o) {
  return (
    F(),
    G(
      _,
      { class: 'pt-5 mx-n2 mx-md-0' },
      {
        default: f(() => [
          l(
            we,
            { class: 'pa-4' },
            {
              default: f(() => [
                l(
                  Un,
                  {
                    ref: 'form',
                    modelValue: e.isValid,
                    'onUpdate:modelValue': t[4] || (t[4] = a => (e.isValid = a)),
                    onSubmit: t[5] || (t[5] = us(() => {}, ['prevent']))
                  },
                  {
                    default: f(() => [
                      l(
                        _,
                        { class: 'py-2 text-center text-h5' },
                        { default: f(() => [C('span', M1, S(e.$t('SIGNUP_PAGE.TITLE.VERIFY_CODE')), 1)]), _: 1 }
                      ),
                      l(
                        _,
                        { class: 'py-2' },
                        {
                          default: f(() => [
                            l(
                              de,
                              {
                                modelValue: r.showIncorrectAlert,
                                'onUpdate:modelValue': t[0] || (t[0] = a => (r.showIncorrectAlert = a)),
                                closable: '',
                                density: 'compact',
                                icon: '$warning',
                                type: 'error',
                                variant: 'outlined'
                              },
                              {
                                default: f(() => [C('span', null, S(e.$t('SIGNUP_PAGE.MESSAGE.INCORRECT_CODE')), 1)]),
                                _: 1
                              },
                              8,
                              ['modelValue']
                            ),
                            l(
                              de,
                              {
                                modelValue: r.showErrorAlert,
                                'onUpdate:modelValue': t[1] || (t[1] = a => (r.showErrorAlert = a)),
                                closable: '',
                                density: 'compact',
                                icon: '$warning',
                                type: 'error',
                                variant: 'outlined'
                              },
                              {
                                default: f(() => [C('span', null, S(e.$t('SIGNUP_PAGE.MESSAGE.VERIFY_FAILED')), 1)]),
                                _: 1
                              },
                              8,
                              ['modelValue']
                            ),
                            l(
                              de,
                              {
                                modelValue: r.showSuccessAlert,
                                'onUpdate:modelValue': t[2] || (t[2] = a => (r.showSuccessAlert = a)),
                                closable: '',
                                density: 'compact',
                                icon: '$success',
                                type: 'success',
                                variant: 'outlined'
                              },
                              {
                                default: f(() => [
                                  C('span', null, S(e.$t('SIGNUP_PAGE.MESSAGE.VERIFY_SUCCESS')), 1),
                                  k1,
                                  C('span', null, S(e.$t('SIGNUP_PAGE.MESSAGE.REDIRECT_PASSWORD')), 1)
                                ]),
                                _: 1
                              },
                              8,
                              ['modelValue']
                            )
                          ]),
                          _: 1
                        }
                      ),
                      l(
                        _,
                        { class: 'pt-2 text-center' },
                        {
                          default: f(() => [
                            C('span', D1, S(e.$t('SIGNUP_PAGE.MESSAGE.CHECK_OTP_CODE')), 1),
                            F1,
                            C('span', V1, S(e.form.email), 1)
                          ]),
                          _: 1
                        }
                      ),
                      l(
                        _,
                        { class: 'py-2' },
                        {
                          default: f(() => [
                            l(
                              _,
                              { class: 'pb-2' },
                              {
                                default: f(() => [
                                  l(
                                    Gg,
                                    {
                                      length: '6',
                                      modelValue: e.form.code,
                                      'onUpdate:modelValue': t[3] || (t[3] = a => (e.form.code = a)),
                                      disabled: !!e.submitFormSuccessResult
                                    },
                                    null,
                                    8,
                                    ['modelValue', 'disabled']
                                  )
                                ]),
                                _: 1
                              }
                            ),
                            l(
                              _,
                              { class: 'py-2 text-center' },
                              {
                                default: f(() => [
                                  l(
                                    ae,
                                    {
                                      disabled: !!e.submitFormSuccessResult || !e.form.code || e.form.code.length < 6,
                                      loading: e.isSubmittingForm,
                                      'append-icon': 'mdi mdi-send-outline',
                                      onClick: o.onClickSubmit
                                    },
                                    { default: f(() => [ee(S(e.$t('SIGNUP_PAGE.ACTION.VERIFY')), 1)]), _: 1 },
                                    8,
                                    ['disabled', 'loading', 'onClick']
                                  )
                                ]),
                                _: 1
                              }
                            ),
                            l(
                              _,
                              { class: 'text-center' },
                              {
                                default: f(() => [
                                  l(
                                    ae,
                                    {
                                      disabled: !!e.submitFormSuccessResult || e.isSubmittingForm,
                                      variant: 'text',
                                      color: 'cancel',
                                      'prepend-icon': 'mdi mdi-chevron-left',
                                      onClick: o.onClickBack
                                    },
                                    { default: f(() => [ee(S(e.$t('SIGNUP_PAGE.ACTION.BACK_TO_REQUEST')), 1)]), _: 1 },
                                    8,
                                    ['disabled', 'onClick']
                                  )
                                ]),
                                _: 1
                              }
                            )
                          ]),
                          _: 1
                        }
                      )
                    ]),
                    _: 1
                  },
                  8,
                  ['modelValue']
                )
              ]),
              _: 1
            }
          )
        ]),
        _: 1
      }
    )
  )
}
const B1 = ue($1, [['render', x1]]),
  U1 = Ee({
    name: 'SignupVerifyPage',
    components: { VerifyForm: B1 },
    data() {
      return {}
    },
    computed: {
      ...Ke(Dr, ['status', 'errorObject', 'isSubmittingForm']),
      isMobile() {
        const { sm: e, xs: t } = this.$vuetify.display
        return t || e
      }
    },
    methods: { ...Ye(Dr, ['initial', 'showError', 'destroy']) },
    mounted() {
      const e = this.$route.query.key,
        t = this.$route.query.email
      !e || !t ? this.$router.push({ name: 'InvalidRequestPage' }) : this.initial({ key: e, email: t })
    },
    unmounted() {
      this.destroy()
    },
    errorCaptured(e) {
      this.showError(e)
    }
  })
function G1(e, t, n, s, r, o) {
  const a = he('s-page-loading'),
    i = he('s-page-error'),
    u = he('verify-form'),
    c = he('router-link')
  return e.status === 'READY'
    ? (F(), G(a, { key: 0 }))
    : e.status === 'ERROR'
      ? (F(), G(i, { key: 1, error: e.errorObject }, null, 8, ['error']))
      : e.status === 'WORKING'
        ? (F(),
          G(
            dt,
            { key: 2, class: 'overflow-hidden' },
            {
              default: f(() => [
                l(
                  _,
                  { width: '100%', 'max-width': '480px', class: 'mx-auto text-left' },
                  {
                    default: f(() => [
                      l(
                        _,
                        { class: 'pa-4 text-center' },
                        {
                          default: f(() => [
                            l(lt, { src: e.$config.siteLogo, 'max-width': '360px', class: 'mx-auto' }, null, 8, ['src'])
                          ]),
                          _: 1
                        }
                      ),
                      l(u),
                      l(
                        _,
                        { class: 'pt-5 text-center' },
                        {
                          default: f(() => [
                            vt(
                              l(
                                c,
                                { to: { name: 'SigninPage' } },
                                {
                                  default: f(() => [
                                    C('span', null, S(e.$t('SIGNUP_PAGE.ACTION.SING_IN_YOUR_ACCOUNT')), 1)
                                  ]),
                                  _: 1
                                },
                                512
                              ),
                              [[Wt, !e.isSubmittingForm]]
                            )
                          ]),
                          _: 1
                        }
                      ),
                      l(
                        _,
                        { class: 'pt-2 text-center' },
                        {
                          default: f(() => [
                            vt(
                              l(
                                c,
                                { to: { name: 'ResetRequestPage' } },
                                {
                                  default: f(() => [
                                    C('span', null, S(e.$t('SIGNUP_PAGE.ACTION.RESET_YOUR_PASSWORD')), 1)
                                  ]),
                                  _: 1
                                },
                                512
                              ),
                              [[Wt, !e.isSubmittingForm]]
                            )
                          ]),
                          _: 1
                        }
                      )
                    ]),
                    _: 1
                  }
                )
              ]),
              _: 1
            }
          ))
        : We('', !0)
}
const W1 = ue(U1, [['render', G1]]),
  H1 = e => {
    const t = {}
    return (
      Object.keys(e).forEach(n => {
        const s = e[n]
        t[n] = typeof s == 'string' ? s.trim() : s
      }),
      t
    )
  },
  Fr = jt({
    id: 'SignupPasswordStore',
    state: () => ({
      status: 'READY',
      errorObject: !1,
      isValid: !1,
      form: { key: '', secret: '', newPassword: '', confirmPassword: '' },
      isSubmittingForm: !1,
      submitFormErrorCode: !1,
      submitFormSuccessResult: !1
    }),
    actions: {
      async initial(e) {
        var t, n, s
        try {
          ;((this.form.key = e.key), (this.form.secret = e.secret), (this.status = 'WORKING'))
        } catch (r) {
          const o = new Error(`[${r.code}] ${r.message}`)
          ;((o.message = r.message || ((n = (t = r.response) == null ? void 0 : t.data) == null ? void 0 : n.message)),
            (o.code = ((s = r.response) == null ? void 0 : s.status) || r.code),
            (this.errorObject = o),
            (this.status = 'ERROR'))
        }
      },
      async submit() {
        var e, t
        try {
          ;((this.submitFormSuccessResult = !1), (this.submitFormErrorCode = !1), (this.isSubmittingForm = !0))
          const n = H1(this.form),
            s = await Oe.post('/signup/password', n)
          ;(s.headers.code ? (this.submitFormErrorCode = s.headers.code) : (this.submitFormSuccessResult = s.data),
            (this.isSubmittingForm = !1))
        } catch (n) {
          ;(console.error(n),
            (this.submitFormErrorCode =
              ((t = (e = n.response) == null ? void 0 : e.headers) == null ? void 0 : t.code) || !0),
            (this.isSubmittingForm = !1))
        }
      },
      showError(e) {
        ;((this.status = 'ERROR'), (this.errorObject = e))
      },
      destroy() {
        this.$reset()
      }
    }
  }),
  j1 = {
    name: 'PasswordForm',
    data() {
      return { showErrorAlert: !1, showSuccessAlert: !1, showNewPassword: !1, showConfirmPassword: !1 }
    },
    computed: {
      ...an(Fr, ['form', 'isValid', 'submitFormErrorCode']),
      ...Ke(Fr, ['isSubmittingForm', 'submitFormSuccessResult']),
      isMobile() {
        const { sm: e, xs: t } = this.$vuetify.display
        return t || e
      },
      rules() {
        return {
          newPassword: [
            e =>
              !e || !e.trim()
                ? this.$filters.message(
                    this.$t('VALIDATION.REQUIRED', { item: this.$t('SIGNUP_PAGE.LABEL.NEW_PASSWORD') })
                  )
                : e.trim().length < 6
                  ? this.$filters.message(
                      this.$t('VALIDATION.MIN_LENGTH', { item: this.$t('SIGNUP_PAGE.LABEL.NEW_PASSWORD'), length: 6 })
                    )
                  : e.trim().length > 250
                    ? this.$filters.message(
                        this.$t('VALIDATION.MAX_LENGTH', {
                          item: this.$t('SIGNUP_PAGE.LABEL.NEW_PASSWORD'),
                          length: 250
                        })
                      )
                    : !0
          ],
          confirmPassword: [
            e =>
              !e || !e.trim()
                ? this.$filters.message(
                    this.$t('VALIDATION.REQUIRED', { item: this.$t('SIGNUP_PAGE.LABEL.CONFIRM_PASSWORD') })
                  )
                : e.trim() !== this.form.newPassword.trim()
                  ? this.$filters.message(
                      this.$t('VALIDATION.CONFIRM_PASSWORD', {
                        confirm: this.$t('SIGNUP_PAGE.LABEL.CONFIRM_PASSWORD'),
                        password: this.$t('SIGNUP_PAGE.LABEL.NEW_PASSWORD')
                      })
                    )
                  : !0
          ]
        }
      }
    },
    watch: {
      'form.newPassword'() {
        this.showErrorAlert && (this.showErrorAlert = !1)
      },
      'form.confirmPassword'() {
        this.showErrorAlert && (this.showErrorAlert = !1)
      },
      showErrorAlert() {
        this.showErrorAlert || (this.submitFormErrorCode = !1)
      },
      isSubmittingForm() {
        this.isSubmittingForm && (this.showErrorAlert = !1)
      },
      submitFormErrorCode() {
        this.submitFormErrorCode === '1' || this.submitFormErrorCode === '2' || this.submitFormErrorCode === '3'
          ? this.$router.push({ name: 'DuplicatedInfoPage' })
          : this.submitFormErrorCode === '7'
            ? this.$router.push({ name: 'CodeExpiredPage' })
            : this.submitFormErrorCode === '5'
              ? this.$router.push({ name: 'InvalidRequestPage' })
              : this.submitFormErrorCode && (this.showErrorAlert = !0)
      },
      submitFormSuccessResult() {
        this.submitFormSuccessResult &&
          (this.showSnackbar({
            message: `${this.$t('SIGNUP_PAGE.MESSAGE.SIGNUP_FINISHED')} ${this.$t('SIGNUP_PAGE.MESSAGE.REDIRECT_SIGNIN')}`,
            timeout: 5e3
          }),
          this.$router.push({ name: 'SignupDisplayPage', query: { token: this.submitFormSuccessResult.token } }))
      }
    },
    methods: {
      ...Ye(gt, ['showSnackbar']),
      ...Ye(Fr, ['submit']),
      async onClickSubmit() {
        const { valid: e } = await this.$refs.form.validate()
        e && this.submit()
      }
    }
  },
  Y1 = { class: 'font-weight-medium text-secondary' },
  K1 = C('br', null, null, -1)
function q1(e, t, n, s, r, o) {
  return (
    F(),
    G(
      _,
      { class: 'pt-5 mx-n2 mx-md-0' },
      {
        default: f(() => [
          l(
            we,
            { class: 'pa-4' },
            {
              default: f(() => [
                l(
                  Un,
                  {
                    ref: 'form',
                    modelValue: e.isValid,
                    'onUpdate:modelValue': t[6] || (t[6] = a => (e.isValid = a)),
                    onSubmit: t[7] || (t[7] = us(() => {}, ['prevent']))
                  },
                  {
                    default: f(() => [
                      l(
                        _,
                        { class: 'py-2 text-center text-h5' },
                        { default: f(() => [C('span', Y1, S(e.$t('SIGNUP_PAGE.TITLE.SET_PASSWORD')), 1)]), _: 1 }
                      ),
                      l(
                        _,
                        { class: 'py-2' },
                        {
                          default: f(() => [
                            l(
                              de,
                              {
                                modelValue: r.showErrorAlert,
                                'onUpdate:modelValue': t[0] || (t[0] = a => (r.showErrorAlert = a)),
                                closable: '',
                                density: 'compact',
                                icon: '$warning',
                                type: 'error',
                                variant: 'outlined'
                              },
                              {
                                default: f(() => [C('span', null, S(e.$t('SIGNUP_PAGE.MESSAGE.SUBMIT_FAILED')), 1)]),
                                _: 1
                              },
                              8,
                              ['modelValue']
                            ),
                            l(
                              de,
                              {
                                modelValue: r.showSuccessAlert,
                                'onUpdate:modelValue': t[1] || (t[1] = a => (r.showSuccessAlert = a)),
                                closable: '',
                                density: 'compact',
                                icon: '$success',
                                type: 'success',
                                variant: 'outlined'
                              },
                              {
                                default: f(() => [
                                  C('span', null, S(e.$t('SIGNUP_PAGE.MESSAGE.SIGNUP_FINISHED')), 1),
                                  K1,
                                  C('span', null, S(e.$t('SIGNUP_PAGE.MESSAGE.REDIRECT_SIGNIN')), 1)
                                ]),
                                _: 1
                              },
                              8,
                              ['modelValue']
                            )
                          ]),
                          _: 1
                        }
                      ),
                      l(
                        _,
                        { class: 'py-2' },
                        {
                          default: f(() => [
                            l(
                              _,
                              { class: 'py-2' },
                              {
                                default: f(() => [
                                  l(
                                    Bt,
                                    {
                                      modelValue: e.form.newPassword,
                                      'onUpdate:modelValue': t[2] || (t[2] = a => (e.form.newPassword = a)),
                                      'append-inner-icon': r.showNewPassword ? 'mdi-eye' : 'mdi-eye-off',
                                      label: e.$t('SIGNUP_PAGE.LABEL.NEW_PASSWORD'),
                                      rules: o.rules.newPassword,
                                      type: r.showNewPassword ? 'text' : 'password',
                                      'prepend-inner-icon': 'mdi mdi-lock-outline',
                                      variant: 'outlined',
                                      'onClick:appendInner':
                                        t[3] || (t[3] = a => (r.showNewPassword = !r.showNewPassword)),
                                      disabled: !!e.submitFormSuccessResult
                                    },
                                    null,
                                    8,
                                    ['modelValue', 'append-inner-icon', 'label', 'rules', 'type', 'disabled']
                                  )
                                ]),
                                _: 1
                              }
                            ),
                            l(
                              _,
                              { class: 'py-2' },
                              {
                                default: f(() => [
                                  l(
                                    Bt,
                                    {
                                      modelValue: e.form.confirmPassword,
                                      'onUpdate:modelValue': t[4] || (t[4] = a => (e.form.confirmPassword = a)),
                                      'append-inner-icon': r.showConfirmPassword ? 'mdi-eye' : 'mdi-eye-off',
                                      label: e.$t('SIGNUP_PAGE.LABEL.CONFIRM_PASSWORD'),
                                      rules: o.rules.confirmPassword,
                                      type: r.showConfirmPassword ? 'text' : 'password',
                                      'prepend-inner-icon': 'mdi mdi-lock-outline',
                                      variant: 'outlined',
                                      'onClick:appendInner':
                                        t[5] || (t[5] = a => (r.showConfirmPassword = !r.showConfirmPassword)),
                                      disabled: !!e.submitFormSuccessResult
                                    },
                                    null,
                                    8,
                                    ['modelValue', 'append-inner-icon', 'label', 'rules', 'type', 'disabled']
                                  )
                                ]),
                                _: 1
                              }
                            ),
                            l(
                              _,
                              { class: 'py-2 text-right' },
                              {
                                default: f(() => [
                                  l(
                                    ae,
                                    {
                                      disabled: !!e.submitFormSuccessResult,
                                      loading: e.isSubmittingForm,
                                      'append-icon': 'mdi mdi-send-outline',
                                      onClick: o.onClickSubmit
                                    },
                                    { default: f(() => [ee(S(e.$t('SIGNUP_PAGE.ACTION.SUBMIT')), 1)]), _: 1 },
                                    8,
                                    ['disabled', 'loading', 'onClick']
                                  )
                                ]),
                                _: 1
                              }
                            )
                          ]),
                          _: 1
                        }
                      )
                    ]),
                    _: 1
                  },
                  8,
                  ['modelValue']
                )
              ]),
              _: 1
            }
          )
        ]),
        _: 1
      }
    )
  )
}
const z1 = ue(j1, [['render', q1]]),
  X1 = Ee({
    name: 'SignupPasswordPage',
    components: { PasswordForm: z1 },
    data() {
      return {}
    },
    computed: {
      ...Ke(Fr, ['status', 'errorObject', 'isSubmittingForm']),
      isMobile() {
        const { sm: e, xs: t } = this.$vuetify.display
        return t || e
      }
    },
    methods: { ...Ye(Fr, ['initial', 'showError', 'destroy']) },
    mounted() {
      const e = this.$route.query.key,
        t = this.$route.query.secret
      !e || !t ? this.$router.push({ name: 'InvalidRequestPage' }) : this.initial({ key: e, secret: t })
    },
    unmounted() {
      this.destroy()
    },
    errorCaptured(e) {
      this.showError(e)
    }
  })
function J1(e, t, n, s, r, o) {
  const a = he('s-page-loading'),
    i = he('s-page-error'),
    u = he('password-form')
  return e.status === 'READY'
    ? (F(), G(a, { key: 0 }))
    : e.status === 'ERROR'
      ? (F(), G(i, { key: 1, error: e.errorObject }, null, 8, ['error']))
      : e.status === 'WORKING'
        ? (F(),
          G(
            dt,
            { key: 2, class: 'overflow-hidden' },
            {
              default: f(() => [
                l(
                  _,
                  { width: '100%', 'max-width': '480px', class: 'mx-auto text-left' },
                  {
                    default: f(() => [
                      l(
                        _,
                        { class: 'pa-4 text-center' },
                        {
                          default: f(() => [
                            l(lt, { src: e.$config.siteLogo, 'max-width': '360px', class: 'mx-auto' }, null, 8, ['src'])
                          ]),
                          _: 1
                        }
                      ),
                      l(u)
                    ]),
                    _: 1
                  }
                )
              ]),
              _: 1
            }
          ))
        : We('', !0)
}
const Q1 = ue(X1, [['render', J1]]),
  dl = jt({
    id: 'SignupDisplayStore',
    state: () => ({ status: 'READY', errorObject: !1, token: '', account: {} }),
    actions: {
      async initial(e) {
        var t, n, s, r, o, a
        try {
          this.token = e.token
          const i = await Oe.get('/signup/extract', { params: e })
          if (!i.headers.code) ((this.account = i.data), (this.status = 'WORKING'))
          else {
            const u = new Error((t = i == null ? void 0 : i.data) == null ? void 0 : t.message)
            ;((u.message = (n = i.data) == null ? void 0 : n.message),
              (u.code = (s = i.headers) == null ? void 0 : s.code),
              (this.errorObject = u),
              (this.status = 'ERROR'))
          }
        } catch (i) {
          const u = new Error(`[${i.code}] ${i.message}`)
          ;((u.message = i.message || ((o = (r = i.response) == null ? void 0 : r.data) == null ? void 0 : o.message)),
            (u.code = ((a = i.response) == null ? void 0 : a.status) || i.code),
            (this.errorObject = u),
            (this.status = 'ERROR'))
        }
      },
      showError(e) {
        ;((this.status = 'ERROR'), (this.errorObject = e))
      },
      destroy() {
        this.$reset()
      }
    }
  }),
  Z1 = {
    name: 'AccountView',
    data() {
      return { showSuccessAlert: !0 }
    },
    computed: {
      ...Ke(dl, ['account']),
      isMobile() {
        const { sm: e, xs: t } = this.$vuetify.display
        return t || e
      }
    },
    methods: {
      async onClickSignin() {
        this.$router.push({ name: 'SigninPage', query: { username: this.account.username } })
      }
    }
  },
  eI = { class: 'font-weight-medium text-secondary' },
  tI = C('br', null, null, -1),
  nI = { class: 'text-label' },
  sI = { class: 'text-label' },
  rI = { class: 'text-label' },
  oI = { class: 'text-label' },
  aI = { key: 0 },
  iI = { key: 1 },
  lI = { class: 'text-label' },
  uI = { key: 0 },
  cI = { key: 1 }
function dI(e, t, n, s, r, o) {
  return (
    F(),
    G(
      _,
      { class: 'pt-5 mx-n2 mx-md-0' },
      {
        default: f(() => [
          l(
            we,
            { class: 'pa-4' },
            {
              default: f(() => [
                l(
                  _,
                  { class: 'py-2 text-center text-h5' },
                  { default: f(() => [C('span', eI, S(e.$t('SIGNUP_PAGE.TITLE.INFO')), 1)]), _: 1 }
                ),
                l(
                  _,
                  { class: 'py-2' },
                  {
                    default: f(() => [
                      l(
                        de,
                        {
                          modelValue: r.showSuccessAlert,
                          'onUpdate:modelValue': t[0] || (t[0] = a => (r.showSuccessAlert = a)),
                          closable: '',
                          density: 'compact',
                          icon: '$success',
                          type: 'success',
                          variant: 'outlined'
                        },
                        {
                          default: f(() => [
                            C('span', null, S(e.$t('SIGNUP_PAGE.MESSAGE.SIGNUP_FINISHED')), 1),
                            tI,
                            C('span', null, S(e.$t('SIGNUP_PAGE.MESSAGE.REDIRECT_SIGNIN')), 1)
                          ]),
                          _: 1
                        },
                        8,
                        ['modelValue']
                      )
                    ]),
                    _: 1
                  }
                ),
                l(
                  _,
                  { class: 'py-2' },
                  {
                    default: f(() => [
                      l(
                        _,
                        { class: 'py-1 d-flex align-center justify-space-between' },
                        {
                          default: f(() => [
                            l(
                              _,
                              { class: 'flex-grow-0', width: '110px' },
                              {
                                default: f(() => [C('label', nI, S(e.$t('SIGNUP_PAGE.LABEL.USERNAME')) + ':', 1)]),
                                _: 1
                              }
                            ),
                            l(
                              _,
                              { class: 'flex-grow-1' },
                              { default: f(() => [C('span', null, S(e.account.username), 1)]), _: 1 }
                            )
                          ]),
                          _: 1
                        }
                      ),
                      l(
                        _,
                        { class: 'py-1 d-flex align-center justify-space-between' },
                        {
                          default: f(() => [
                            l(
                              _,
                              { class: 'flex-grow-0', width: '110px' },
                              {
                                default: f(() => [C('label', sI, S(e.$t('SIGNUP_PAGE.LABEL.PASSWORD')) + ':', 1)]),
                                _: 1
                              }
                            ),
                            l(
                              _,
                              { class: 'flex-grow-1' },
                              { default: f(() => [C('span', null, S(e.account.password), 1)]), _: 1 }
                            )
                          ]),
                          _: 1
                        }
                      ),
                      l(
                        _,
                        { class: 'pt-3 pb-1 d-flex align-center justify-space-between' },
                        {
                          default: f(() => [
                            l(
                              _,
                              { class: 'flex-grow-0', width: '110px' },
                              {
                                default: f(() => [C('label', rI, S(e.$t('SIGNUP_PAGE.LABEL.DISPLAY_NAME')) + ':', 1)]),
                                _: 1
                              }
                            ),
                            l(
                              _,
                              { class: 'flex-grow-1' },
                              { default: f(() => [C('span', null, S(e.account.displayName), 1)]), _: 1 }
                            )
                          ]),
                          _: 1
                        }
                      ),
                      l(
                        _,
                        { class: 'py-1 d-flex align-center justify-space-between' },
                        {
                          default: f(() => [
                            l(
                              _,
                              { class: 'flex-grow-0', width: '110px' },
                              {
                                default: f(() => [C('label', oI, S(e.$t('SIGNUP_PAGE.LABEL.PHONE_NUMBER')) + ':', 1)]),
                                _: 1
                              }
                            ),
                            l(
                              _,
                              { class: 'flex-grow-1' },
                              {
                                default: f(() => [
                                  e.account.phoneNumber
                                    ? (F(), Ne('span', aI, S(e.$filters.phone(e.account.phoneNumber)), 1))
                                    : (F(), Ne('span', iI, 'N/A'))
                                ]),
                                _: 1
                              }
                            )
                          ]),
                          _: 1
                        }
                      ),
                      l(
                        _,
                        { class: 'py-1 d-flex align-center justify-space-between' },
                        {
                          default: f(() => [
                            l(
                              _,
                              { class: 'flex-grow-0', width: '110px' },
                              { default: f(() => [C('label', lI, S(e.$t('SIGNUP_PAGE.LABEL.EMAIL')) + ':', 1)]), _: 1 }
                            ),
                            l(
                              _,
                              { class: 'flex-grow-1' },
                              {
                                default: f(() => [
                                  e.account.email
                                    ? (F(), Ne('span', uI, S(e.account.email), 1))
                                    : (F(), Ne('span', cI, 'N/A'))
                                ]),
                                _: 1
                              }
                            )
                          ]),
                          _: 1
                        }
                      ),
                      l(
                        _,
                        { class: 'py-2 text-right' },
                        {
                          default: f(() => [
                            l(
                              ae,
                              { variant: 'outlined', 'append-icon': 'mdi mdi-login', onClick: o.onClickSignin },
                              { default: f(() => [ee(S(e.$t('SIGNUP_PAGE.ACTION.SIGNIN')), 1)]), _: 1 },
                              8,
                              ['onClick']
                            )
                          ]),
                          _: 1
                        }
                      )
                    ]),
                    _: 1
                  }
                )
              ]),
              _: 1
            }
          )
        ]),
        _: 1
      }
    )
  )
}
const fI = ue(Z1, [['render', dI]]),
  mI = Ee({
    name: 'DisplayPage',
    components: { AccountView: fI },
    data() {
      return {}
    },
    computed: {
      ...Ke(dl, ['status', 'errorObject']),
      isMobile() {
        const { sm: e, xs: t } = this.$vuetify.display
        return t || e
      }
    },
    methods: { ...Ye(dl, ['initial', 'showError', 'destroy']) },
    mounted() {
      const e = this.$route.query.token
      e ? this.initial({ token: e }) : this.$router.push({ name: 'InvalidRequestPage' })
    },
    unmounted() {
      this.destroy()
    },
    errorCaptured(e) {
      this.showError(e)
    }
  })
function hI(e, t, n, s, r, o) {
  const a = he('s-page-loading'),
    i = he('s-page-error'),
    u = he('account-view')
  return e.status === 'READY'
    ? (F(), G(a, { key: 0 }))
    : e.status === 'ERROR'
      ? (F(), G(i, { key: 1, error: e.errorObject }, null, 8, ['error']))
      : e.status === 'WORKING'
        ? (F(),
          G(
            dt,
            { key: 2, class: 'overflow-hidden' },
            {
              default: f(() => [
                l(
                  _,
                  { width: '100%', 'max-width': '480px', class: 'mx-auto text-left' },
                  {
                    default: f(() => [
                      l(
                        _,
                        { class: 'pa-4 text-center' },
                        {
                          default: f(() => [
                            l(lt, { src: e.$config.siteLogo, 'max-width': '360px', class: 'mx-auto' }, null, 8, ['src'])
                          ]),
                          _: 1
                        }
                      ),
                      l(u)
                    ]),
                    _: 1
                  }
                )
              ]),
              _: 1
            }
          ))
        : We('', !0)
}
const gI = ue(mI, [['render', hI]]),
  pI = e => {
    const t = {}
    return (
      Object.keys(e).forEach(n => {
        const s = e[n]
        t[n] = typeof s == 'string' ? s.trim() : s
      }),
      t
    )
  },
  Xs = jt({
    id: 'ResetRequestStore',
    state: () => ({
      status: 'READY',
      errorObject: !1,
      isValid: !1,
      form: { email: '' },
      isSubmittingForm: !1,
      submitFormErrorCode: !1,
      submitFormSuccessResult: !1
    }),
    actions: {
      async initial() {
        var e, t, n
        try {
          ;((this.status = 'WORKING'),
            (this.isSubmittingForm = !1),
            (this.submitFormErrorCode = !1),
            (this.submitFormSuccessResult = !1))
        } catch (s) {
          const r = new Error(`[${s.code}] ${s.message}`)
          ;((r.message = s.message || ((t = (e = s.response) == null ? void 0 : e.data) == null ? void 0 : t.message)),
            (r.code = ((n = s.response) == null ? void 0 : n.status) || s.code),
            (this.errorObject = r),
            (this.status = 'ERROR'))
        }
      },
      async submit() {
        var e, t
        try {
          ;((this.submitFormSuccessResult = !1), (this.submitFormErrorCode = !1), (this.isSubmittingForm = !0))
          const n = pI(this.form),
            s = await Oe.post('/reset/request', n)
          ;(s.headers.code ? (this.submitFormErrorCode = s.headers.code) : (this.submitFormSuccessResult = s.data),
            (this.isSubmittingForm = !1))
        } catch (n) {
          ;(console.error(n),
            (this.submitFormErrorCode =
              ((t = (e = n.response) == null ? void 0 : e.headers) == null ? void 0 : t.code) || !0),
            (this.isSubmittingForm = !1))
        }
      },
      showError(e) {
        ;((this.status = 'ERROR'), (this.errorObject = e))
      },
      destroy() {
        this.$reset()
      }
    }
  }),
  EI = {
    name: 'ResetPage',
    methods: { ...Ye(Xs, ['showError', 'destroy']) },
    mounted() {
      this.$route.name === 'ResetPage' && this.$router.push({ name: 'ResetRequestPage' })
    },
    unmounted() {
      this.destroy()
    },
    errorCaptured(e) {
      this.showError(e)
    }
  }
function _I(e, t, n, s, r, o) {
  const a = he('router-view')
  return (F(), G(a))
}
const yI = ue(EI, [['render', _I]]),
  vI = {
    name: 'ResetForm',
    data() {
      return { showErrorAlert: !1, showIncorrectAlert: !1, showSuccessAlert: !1, showPassword: !1 }
    },
    computed: {
      ...an(Xs, ['form', 'isValid', 'submitFormErrorCode']),
      ...Ke(Xs, ['isSubmittingForm', 'submitFormSuccessResult']),
      isMobile() {
        const { sm: e, xs: t } = this.$vuetify.display
        return t || e
      },
      rules() {
        return {
          email: [
            e =>
              !e || !e.trim()
                ? this.$filters.message(this.$t('VALIDATION.REQUIRED', { item: this.$t('RESET_PAGE.LABEL.EMAIL') }))
                : e.trim().length > 250
                  ? this.$filters.message(
                      this.$t('VALIDATION.MAX_LENGTH', { item: this.$t('RESET_PAGE.LABEL.EMAIL'), length: 250 })
                    )
                  : Uo.EMAIL.test(e.trim())
                    ? !0
                    : this.$filters.message(
                        this.$t('VALIDATION.EMAIL_PATTERN', { item: this.$t('RESET_PAGE.LABEL.EMAIL') })
                      )
          ]
        }
      }
    },
    watch: {
      'form.email'() {
        ;(this.showIncorrectAlert && (this.showIncorrectAlert = !1), this.showErrorAlert && (this.showErrorAlert = !1))
      },
      showIncorrectAlert() {
        this.showIncorrectAlert || (this.submitFormErrorCode = !1)
      },
      showErrorAlert() {
        this.showErrorAlert || (this.submitFormErrorCode = !1)
      },
      isSubmittingForm() {
        this.isSubmittingForm && ((this.showIncorrectAlert = !1), (this.showErrorAlert = !1))
      },
      submitFormErrorCode() {
        this.submitFormErrorCode === 1 || this.submitFormErrorCode === '1'
          ? (this.showIncorrectAlert = !0)
          : this.submitFormErrorCode && (this.showErrorAlert = !0)
      },
      submitFormSuccessResult() {
        this.submitFormSuccessResult &&
          (this.showSnackbar({
            message: `${this.$t('RESET_PAGE.MESSAGE.REQUEST_SUCCESS')} ${this.$t('RESET_PAGE.MESSAGE.REDIRECT_VERIFY')}`,
            timeout: 5e3
          }),
          this.$router.push({
            name: 'RestVerifyPage',
            query: { key: this.submitFormSuccessResult.key, email: this.submitFormSuccessResult.email }
          }))
      }
    },
    methods: {
      ...Ye(gt, ['showSnackbar']),
      ...Ye(Xs, ['submit']),
      async onClickSubmit() {
        const { valid: e } = await this.$refs.form.validate()
        e && this.submit()
      }
    }
  },
  bI = { class: 'font-weight-medium text-secondary' },
  SI = C('br', null, null, -1)
function RI(e, t, n, s, r, o) {
  return (
    F(),
    G(
      _,
      { class: 'pt-5 mx-n2 mx-md-0' },
      {
        default: f(() => [
          l(
            we,
            { class: 'pa-4' },
            {
              default: f(() => [
                l(
                  Un,
                  {
                    ref: 'form',
                    modelValue: e.isValid,
                    'onUpdate:modelValue': t[4] || (t[4] = a => (e.isValid = a)),
                    onSubmit: t[5] || (t[5] = us(() => {}, ['prevent']))
                  },
                  {
                    default: f(() => [
                      l(
                        _,
                        { class: 'py-2 text-center text-h5' },
                        { default: f(() => [C('span', bI, S(e.$t('RESET_PAGE.TITLE.RESET_PASSWORD')), 1)]), _: 1 }
                      ),
                      l(
                        _,
                        { class: 'py-2' },
                        {
                          default: f(() => [
                            l(
                              de,
                              {
                                modelValue: r.showIncorrectAlert,
                                'onUpdate:modelValue': t[0] || (t[0] = a => (r.showIncorrectAlert = a)),
                                closable: '',
                                density: 'compact',
                                icon: '$warning',
                                type: 'error',
                                variant: 'outlined'
                              },
                              {
                                default: f(() => [C('span', null, S(e.$t('RESET_PAGE.MESSAGE.INCORRECT_EMAIL')), 1)]),
                                _: 1
                              },
                              8,
                              ['modelValue']
                            ),
                            l(
                              de,
                              {
                                modelValue: r.showErrorAlert,
                                'onUpdate:modelValue': t[1] || (t[1] = a => (r.showErrorAlert = a)),
                                closable: '',
                                density: 'compact',
                                icon: '$warning',
                                type: 'error',
                                variant: 'outlined'
                              },
                              {
                                default: f(() => [C('span', null, S(e.$t('RESET_PAGE.MESSAGE.REQUEST_FAILED')), 1)]),
                                _: 1
                              },
                              8,
                              ['modelValue']
                            ),
                            l(
                              de,
                              {
                                modelValue: r.showSuccessAlert,
                                'onUpdate:modelValue': t[2] || (t[2] = a => (r.showSuccessAlert = a)),
                                closable: '',
                                density: 'compact',
                                icon: '$success',
                                type: 'success',
                                variant: 'outlined'
                              },
                              {
                                default: f(() => [
                                  C('span', null, S(e.$t('RESET_PAGE.MESSAGE.REQUEST_SUCCESS')), 1),
                                  SI,
                                  C('span', null, S(e.$t('RESET_PAGE.MESSAGE.REDIRECT_VERIFY')), 1)
                                ]),
                                _: 1
                              },
                              8,
                              ['modelValue']
                            )
                          ]),
                          _: 1
                        }
                      ),
                      l(
                        _,
                        { class: 'py-2' },
                        {
                          default: f(() => [
                            l(
                              _,
                              { class: 'py-2' },
                              {
                                default: f(() => [
                                  l(
                                    Bt,
                                    {
                                      modelValue: e.form.email,
                                      'onUpdate:modelValue': t[3] || (t[3] = a => (e.form.email = a)),
                                      label: e.$t('RESET_PAGE.LABEL.EMAIL'),
                                      rules: o.rules.email,
                                      'prepend-inner-icon': 'mdi mdi-email-outline',
                                      variant: 'outlined',
                                      disabled: !!e.submitFormSuccessResult
                                    },
                                    null,
                                    8,
                                    ['modelValue', 'label', 'rules', 'disabled']
                                  )
                                ]),
                                _: 1
                              }
                            ),
                            l(
                              _,
                              { class: 'py-2 text-right' },
                              {
                                default: f(() => [
                                  l(
                                    ae,
                                    {
                                      disabled: !!e.submitFormSuccessResult,
                                      loading: e.isSubmittingForm,
                                      'append-icon': 'mdi mdi-send-outline',
                                      onClick: o.onClickSubmit
                                    },
                                    { default: f(() => [ee(S(e.$t('RESET_PAGE.ACTION.REQUEST')), 1)]), _: 1 },
                                    8,
                                    ['disabled', 'loading', 'onClick']
                                  )
                                ]),
                                _: 1
                              }
                            )
                          ]),
                          _: 1
                        }
                      )
                    ]),
                    _: 1
                  },
                  8,
                  ['modelValue']
                )
              ]),
              _: 1
            }
          )
        ]),
        _: 1
      }
    )
  )
}
const OI = ue(vI, [['render', RI]]),
  CI = Ee({
    name: 'ResetRequestPage',
    components: { RequestForm: OI },
    data() {
      return {}
    },
    computed: {
      ...Ke(Xs, ['status', 'errorObject', 'isSubmittingForm']),
      isMobile() {
        const { sm: e, xs: t } = this.$vuetify.display
        return t || e
      }
    },
    methods: { ...Ye(Xs, ['initial', 'showError']) },
    mounted() {
      this.initial()
    },
    errorCaptured(e) {
      this.showError(e)
    }
  })
function AI(e, t, n, s, r, o) {
  const a = he('s-page-loading'),
    i = he('s-page-error'),
    u = he('request-form'),
    c = he('router-link')
  return e.status === 'READY'
    ? (F(), G(a, { key: 0 }))
    : e.status === 'ERROR'
      ? (F(), G(i, { key: 1, error: e.errorObject }, null, 8, ['error']))
      : e.status === 'WORKING'
        ? (F(),
          G(
            dt,
            { key: 2, class: 'overflow-hidden' },
            {
              default: f(() => [
                l(
                  _,
                  { width: '100%', 'max-width': '480px', class: 'mx-auto text-left' },
                  {
                    default: f(() => [
                      l(
                        _,
                        { class: 'pa-4 text-center' },
                        {
                          default: f(() => [
                            l(lt, { src: e.$config.siteLogo, 'max-width': '360px', class: 'mx-auto' }, null, 8, ['src'])
                          ]),
                          _: 1
                        }
                      ),
                      l(u),
                      l(
                        _,
                        { class: 'pt-5 text-center' },
                        {
                          default: f(() => [
                            vt(
                              l(
                                c,
                                { to: { name: 'SigninPage' } },
                                {
                                  default: f(() => [
                                    C('span', null, S(e.$t('RESET_PAGE.ACTION.SING_IN_YOUR_ACCOUNT')), 1)
                                  ]),
                                  _: 1
                                },
                                512
                              ),
                              [[Wt, !e.isSubmittingForm]]
                            )
                          ]),
                          _: 1
                        }
                      ),
                      l(
                        _,
                        { class: 'pt-2 text-center' },
                        {
                          default: f(() => [
                            vt(
                              l(
                                c,
                                { to: { name: 'SignupRequestPage' } },
                                {
                                  default: f(() => [
                                    C('span', null, S(e.$t('RESET_PAGE.ACTION.REGISTRY_NEW_ACCOUNT')), 1)
                                  ]),
                                  _: 1
                                },
                                512
                              ),
                              [[Wt, !e.isSubmittingForm]]
                            )
                          ]),
                          _: 1
                        }
                      )
                    ]),
                    _: 1
                  }
                )
              ]),
              _: 1
            }
          ))
        : We('', !0)
}
const II = ue(CI, [['render', AI]]),
  TI = e => {
    const t = {}
    return (
      Object.keys(e).forEach(n => {
        const s = e[n]
        t[n] = typeof s == 'string' ? s.trim() : s
      }),
      t
    )
  },
  Vr = jt({
    id: 'ResetVerifyStore',
    state: () => ({
      status: 'READY',
      errorObject: !1,
      isValid: !1,
      form: { key: '', code: '', email: '' },
      isSubmittingForm: !1,
      submitFormErrorCode: !1,
      submitFormSuccessResult: !1
    }),
    actions: {
      async initial(e) {
        var t, n, s
        try {
          ;((this.form.key = e.key), (this.form.email = e.email), (this.status = 'WORKING'))
        } catch (r) {
          const o = new Error(`[${r.code}] ${r.message}`)
          ;((o.message = r.message || ((n = (t = r.response) == null ? void 0 : t.data) == null ? void 0 : n.message)),
            (o.code = ((s = r.response) == null ? void 0 : s.status) || r.code),
            (this.errorObject = o),
            (this.status = 'ERROR'))
        }
      },
      async submit() {
        var e, t
        try {
          ;((this.submitFormSuccessResult = !1), (this.submitFormErrorCode = !1), (this.isSubmittingForm = !0))
          const n = TI(this.form),
            s = await Oe.post('/reset/verify', n)
          ;(s.headers.code ? (this.submitFormErrorCode = s.headers.code) : (this.submitFormSuccessResult = s.data),
            (this.isSubmittingForm = !1))
        } catch (n) {
          ;(console.error(n),
            (this.submitFormErrorCode =
              ((t = (e = n.response) == null ? void 0 : e.headers) == null ? void 0 : t.code) || !0),
            (this.isSubmittingForm = !1))
        }
      },
      showError(e) {
        ;((this.status = 'ERROR'), (this.errorObject = e))
      },
      destroy() {
        this.$reset()
      }
    }
  }),
  NI = {
    name: 'VerifyForm',
    data() {
      return { showErrorAlert: !1, showIncorrectAlert: !1, showSuccessAlert: !1, showPassword: !1 }
    },
    computed: {
      ...an(Vr, ['form', 'isValid', 'submitFormErrorCode']),
      ...Ke(Vr, ['isSubmittingForm', 'submitFormSuccessResult']),
      isMobile() {
        const { sm: e, xs: t } = this.$vuetify.display
        return t || e
      }
    },
    watch: {
      'form.code'() {
        ;(this.showIncorrectAlert && (this.showIncorrectAlert = !1), this.showErrorAlert && (this.showErrorAlert = !1))
      },
      showIncorrectAlert() {
        this.showIncorrectAlert || (this.submitFormErrorCode = !1)
      },
      showErrorAlert() {
        this.showErrorAlert || (this.submitFormErrorCode = !1)
      },
      isSubmittingForm() {
        this.isSubmittingForm && ((this.showIncorrectAlert = !1), (this.showErrorAlert = !1))
      },
      submitFormErrorCode() {
        this.submitFormErrorCode === '7'
          ? this.$router.push({ name: 'CodeExpiredPage' })
          : this.submitFormErrorCode === '5'
            ? (this.showIncorrectAlert = !0)
            : this.submitFormErrorCode && (this.showErrorAlert = !0)
      },
      submitFormSuccessResult() {
        this.submitFormSuccessResult &&
          (this.showSnackbar({
            message: `${this.$t('RESET_PAGE.MESSAGE.VERIFY_SUCCESS')} ${this.$t('RESET_PAGE.MESSAGE.REDIRECT_PASSWORD')}`,
            timeout: 5e3
          }),
          this.$router.push({
            name: 'RestPasswordPage',
            query: { key: this.submitFormSuccessResult.key, secret: this.submitFormSuccessResult.secret }
          }))
      }
    },
    methods: {
      ...Ye(gt, ['showSnackbar']),
      ...Ye(Vr, ['submit']),
      onClickBack() {
        this.$router.push({ name: 'ResetRequestPage' })
      },
      async onClickSubmit() {
        const { valid: e } = await this.$refs.form.validate()
        e && this.submit()
      }
    }
  },
  wI = { class: 'font-weight-medium text-secondary' },
  LI = C('br', null, null, -1),
  PI = { class: 'text-grey-darken-3' },
  $I = C('br', null, null, -1),
  MI = { class: 'text-grey-darken-3' }
function kI(e, t, n, s, r, o) {
  return (
    F(),
    G(
      _,
      { class: 'pt-5 mx-n2 mx-md-0' },
      {
        default: f(() => [
          l(
            we,
            { class: 'pa-4' },
            {
              default: f(() => [
                l(
                  Un,
                  {
                    ref: 'form',
                    modelValue: e.isValid,
                    'onUpdate:modelValue': t[4] || (t[4] = a => (e.isValid = a)),
                    onSubmit: t[5] || (t[5] = us(() => {}, ['prevent']))
                  },
                  {
                    default: f(() => [
                      l(
                        _,
                        { class: 'py-2 text-center text-h5' },
                        { default: f(() => [C('span', wI, S(e.$t('RESET_PAGE.TITLE.VERIFY_CODE')), 1)]), _: 1 }
                      ),
                      l(
                        _,
                        { class: 'py-2' },
                        {
                          default: f(() => [
                            l(
                              de,
                              {
                                modelValue: r.showIncorrectAlert,
                                'onUpdate:modelValue': t[0] || (t[0] = a => (r.showIncorrectAlert = a)),
                                closable: '',
                                density: 'compact',
                                icon: '$warning',
                                type: 'error',
                                variant: 'outlined'
                              },
                              {
                                default: f(() => [C('span', null, S(e.$t('RESET_PAGE.MESSAGE.INCORRECT_CODE')), 1)]),
                                _: 1
                              },
                              8,
                              ['modelValue']
                            ),
                            l(
                              de,
                              {
                                modelValue: r.showErrorAlert,
                                'onUpdate:modelValue': t[1] || (t[1] = a => (r.showErrorAlert = a)),
                                closable: '',
                                density: 'compact',
                                icon: '$warning',
                                type: 'error',
                                variant: 'outlined'
                              },
                              {
                                default: f(() => [C('span', null, S(e.$t('RESET_PAGE.MESSAGE.VERIFY_FAILED')), 1)]),
                                _: 1
                              },
                              8,
                              ['modelValue']
                            ),
                            l(
                              de,
                              {
                                modelValue: r.showSuccessAlert,
                                'onUpdate:modelValue': t[2] || (t[2] = a => (r.showSuccessAlert = a)),
                                closable: '',
                                density: 'compact',
                                icon: '$success',
                                type: 'success',
                                variant: 'outlined'
                              },
                              {
                                default: f(() => [
                                  C('span', null, S(e.$t('RESET_PAGE.MESSAGE.VERIFY_SUCCESS')), 1),
                                  LI,
                                  C('span', null, S(e.$t('RESET_PAGE.MESSAGE.REDIRECT_PASSWORD')), 1)
                                ]),
                                _: 1
                              },
                              8,
                              ['modelValue']
                            )
                          ]),
                          _: 1
                        }
                      ),
                      l(
                        _,
                        { class: 'pt-2 text-center' },
                        {
                          default: f(() => [
                            C('span', PI, S(e.$t('RESET_PAGE.MESSAGE.CHECK_OTP_CODE')), 1),
                            $I,
                            C('span', MI, S(e.form.email), 1)
                          ]),
                          _: 1
                        }
                      ),
                      l(
                        _,
                        { class: 'py-2' },
                        {
                          default: f(() => [
                            l(
                              _,
                              { class: 'pb-2' },
                              {
                                default: f(() => [
                                  l(
                                    Gg,
                                    {
                                      length: '6',
                                      modelValue: e.form.code,
                                      'onUpdate:modelValue': t[3] || (t[3] = a => (e.form.code = a)),
                                      disabled: !!e.submitFormSuccessResult
                                    },
                                    null,
                                    8,
                                    ['modelValue', 'disabled']
                                  )
                                ]),
                                _: 1
                              }
                            ),
                            l(
                              _,
                              { class: 'py-2 text-center' },
                              {
                                default: f(() => [
                                  l(
                                    ae,
                                    {
                                      disabled: !!e.submitFormSuccessResult || !e.form.code || e.form.code.length < 6,
                                      loading: e.isSubmittingForm,
                                      'append-icon': 'mdi mdi-send-outline',
                                      onClick: o.onClickSubmit
                                    },
                                    { default: f(() => [ee(S(e.$t('RESET_PAGE.ACTION.VERIFY')), 1)]), _: 1 },
                                    8,
                                    ['disabled', 'loading', 'onClick']
                                  )
                                ]),
                                _: 1
                              }
                            ),
                            l(
                              _,
                              { class: 'text-center' },
                              {
                                default: f(() => [
                                  l(
                                    ae,
                                    {
                                      disabled: !!e.submitFormSuccessResult || e.isSubmittingForm,
                                      variant: 'text',
                                      color: 'cancel',
                                      'prepend-icon': 'mdi mdi-chevron-left',
                                      onClick: o.onClickBack
                                    },
                                    { default: f(() => [ee(S(e.$t('RESET_PAGE.ACTION.BACK_TO_REQUEST')), 1)]), _: 1 },
                                    8,
                                    ['disabled', 'onClick']
                                  )
                                ]),
                                _: 1
                              }
                            )
                          ]),
                          _: 1
                        }
                      )
                    ]),
                    _: 1
                  },
                  8,
                  ['modelValue']
                )
              ]),
              _: 1
            }
          )
        ]),
        _: 1
      }
    )
  )
}
const DI = ue(NI, [['render', kI]]),
  FI = Ee({
    name: 'VerifyPage',
    components: { VerifyForm: DI },
    data() {
      return {}
    },
    computed: {
      ...Ke(Vr, ['status', 'errorObject', 'isSubmittingForm']),
      isMobile() {
        const { sm: e, xs: t } = this.$vuetify.display
        return t || e
      }
    },
    methods: { ...Ye(Vr, ['initial', 'showError', 'destroy']) },
    mounted() {
      const e = this.$route.query.key,
        t = this.$route.query.email
      !e || !t ? this.$router.push({ name: 'InvalidRequestPage' }) : this.initial({ key: e, email: t })
    },
    unmounted() {
      this.destroy()
    },
    errorCaptured(e) {
      this.showError(e)
    }
  })
function VI(e, t, n, s, r, o) {
  const a = he('s-page-loading'),
    i = he('s-page-error'),
    u = he('verify-form'),
    c = he('router-link')
  return e.status === 'READY'
    ? (F(), G(a, { key: 0 }))
    : e.status === 'ERROR'
      ? (F(), G(i, { key: 1, error: e.errorObject }, null, 8, ['error']))
      : e.status === 'WORKING'
        ? (F(),
          G(
            dt,
            { key: 2, class: 'overflow-hidden' },
            {
              default: f(() => [
                l(
                  _,
                  { width: '100%', 'max-width': '480px', class: 'mx-auto text-left' },
                  {
                    default: f(() => [
                      l(
                        _,
                        { class: 'pa-4 text-center' },
                        {
                          default: f(() => [
                            l(lt, { src: e.$config.siteLogo, 'max-width': '360px', class: 'mx-auto' }, null, 8, ['src'])
                          ]),
                          _: 1
                        }
                      ),
                      l(u),
                      l(
                        _,
                        { class: 'pt-5 text-center' },
                        {
                          default: f(() => [
                            vt(
                              l(
                                c,
                                { to: { name: 'SigninPage' } },
                                {
                                  default: f(() => [
                                    C('span', null, S(e.$t('RESET_PAGE.ACTION.SING_IN_YOUR_ACCOUNT')), 1)
                                  ]),
                                  _: 1
                                },
                                512
                              ),
                              [[Wt, !e.isSubmittingForm]]
                            )
                          ]),
                          _: 1
                        }
                      ),
                      l(
                        _,
                        { class: 'pt-2 text-center' },
                        {
                          default: f(() => [
                            vt(
                              l(
                                c,
                                { to: { name: 'SignupRequestPage' } },
                                {
                                  default: f(() => [
                                    C('span', null, S(e.$t('RESET_PAGE.ACTION.REGISTRY_NEW_ACCOUNT')), 1)
                                  ]),
                                  _: 1
                                },
                                512
                              ),
                              [[Wt, !e.isSubmittingForm]]
                            )
                          ]),
                          _: 1
                        }
                      )
                    ]),
                    _: 1
                  }
                )
              ]),
              _: 1
            }
          ))
        : We('', !0)
}
const xI = ue(FI, [['render', VI]]),
  BI = e => {
    const t = {}
    return (
      Object.keys(e).forEach(n => {
        const s = e[n]
        t[n] = typeof s == 'string' ? s.trim() : s
      }),
      t
    )
  },
  xr = jt({
    id: 'ResetPasswordStore',
    state: () => ({
      status: 'READY',
      errorObject: !1,
      isValid: !1,
      form: { key: '', secret: '', newPassword: '', confirmPassword: '' },
      isSubmittingForm: !1,
      submitFormErrorCode: !1,
      submitFormSuccessResult: !1
    }),
    actions: {
      async initial(e) {
        var t, n, s
        try {
          ;((this.form.key = e.key), (this.form.secret = e.secret), (this.status = 'WORKING'))
        } catch (r) {
          const o = new Error(`[${r.code}] ${r.message}`)
          ;((o.message = r.message || ((n = (t = r.response) == null ? void 0 : t.data) == null ? void 0 : n.message)),
            (o.code = ((s = r.response) == null ? void 0 : s.status) || r.code),
            (this.errorObject = o),
            (this.status = 'ERROR'))
        }
      },
      async submit() {
        var e, t
        try {
          ;((this.submitFormSuccessResult = !1), (this.submitFormErrorCode = !1), (this.isSubmittingForm = !0))
          const n = BI(this.form),
            s = await Oe.post('/reset/password', n)
          ;(s.headers.code ? (this.submitFormErrorCode = s.headers.code) : (this.submitFormSuccessResult = s.data),
            (this.isSubmittingForm = !1))
        } catch (n) {
          ;(console.error(n),
            (this.submitFormErrorCode =
              ((t = (e = n.response) == null ? void 0 : e.headers) == null ? void 0 : t.code) || !0),
            (this.isSubmittingForm = !1))
        }
      },
      showError(e) {
        ;((this.status = 'ERROR'), (this.errorObject = e))
      },
      destroy() {
        this.$reset()
      }
    }
  }),
  UI = {
    name: 'PasswordForm',
    data() {
      return { showErrorAlert: !1, showSuccessAlert: !1, showNewPassword: !1, showConfirmPassword: !1 }
    },
    computed: {
      ...an(xr, ['form', 'isValid', 'submitFormErrorCode']),
      ...Ke(xr, ['isSubmittingForm', 'submitFormSuccessResult']),
      isMobile() {
        const { sm: e, xs: t } = this.$vuetify.display
        return t || e
      },
      rules() {
        return {
          newPassword: [
            e =>
              !e || !e.trim()
                ? this.$filters.message(
                    this.$t('VALIDATION.REQUIRED', { item: this.$t('RESET_PAGE.LABEL.NEW_PASSWORD') })
                  )
                : e.trim().length < 6
                  ? this.$filters.message(
                      this.$t('VALIDATION.MIN_LENGTH', { item: this.$t('RESET_PAGE.LABEL.NEW_PASSWORD'), length: 6 })
                    )
                  : e.trim().length > 250
                    ? this.$filters.message(
                        this.$t('VALIDATION.MAX_LENGTH', {
                          item: this.$t('RESET_PAGE.LABEL.NEW_PASSWORD'),
                          length: 250
                        })
                      )
                    : !0
          ],
          confirmPassword: [
            e =>
              !e || !e.trim()
                ? this.$filters.message(
                    this.$t('VALIDATION.REQUIRED', { item: this.$t('RESET_PAGE.LABEL.CONFIRM_PASSWORD') })
                  )
                : e.trim() !== this.form.newPassword.trim()
                  ? this.$filters.message(
                      this.$t('VALIDATION.CONFIRM_PASSWORD', {
                        confirm: this.$t('RESET_PAGE.LABEL.CONFIRM_PASSWORD'),
                        password: this.$t('RESET_PAGE.LABEL.NEW_PASSWORD')
                      })
                    )
                  : !0
          ]
        }
      }
    },
    watch: {
      'form.newPassword'() {
        this.showErrorAlert && (this.showErrorAlert = !1)
      },
      'form.confirmPassword'() {
        this.showErrorAlert && (this.showErrorAlert = !1)
      },
      showErrorAlert() {
        this.showErrorAlert || (this.submitFormErrorCode = !1)
      },
      isSubmittingForm() {
        this.isSubmittingForm && (this.showErrorAlert = !1)
      },
      submitFormErrorCode() {
        this.submitFormErrorCode === '7'
          ? this.$router.push({ name: 'CodeExpiredPage' })
          : this.submitFormErrorCode === '5'
            ? this.$router.push({ name: 'InvalidRequestPage' })
            : this.submitFormErrorCode && (this.showErrorAlert = !0)
      },
      submitFormSuccessResult() {
        this.submitFormSuccessResult &&
          (this.showSnackbar({
            message: `${this.$t('RESET_PAGE.MESSAGE.SET_PASSWORD_SUCCESS')} ${this.$t('RESET_PAGE.MESSAGE.REDIRECT_INFO')}`,
            timeout: 5e3
          }),
          this.$router.push({ name: 'RestDisplayPage', query: { token: this.submitFormSuccessResult.token } }))
      }
    },
    methods: {
      ...Ye(gt, ['showSnackbar']),
      ...Ye(xr, ['submit']),
      async onClickSubmit() {
        const { valid: e } = await this.$refs.form.validate()
        e && this.submit()
      }
    }
  },
  GI = { class: 'font-weight-medium text-secondary' },
  WI = C('br', null, null, -1)
function HI(e, t, n, s, r, o) {
  return (
    F(),
    G(
      _,
      { class: 'pt-5 mx-n2 mx-md-0' },
      {
        default: f(() => [
          l(
            we,
            { class: 'pa-4' },
            {
              default: f(() => [
                l(
                  Un,
                  {
                    ref: 'form',
                    modelValue: e.isValid,
                    'onUpdate:modelValue': t[6] || (t[6] = a => (e.isValid = a)),
                    onSubmit: t[7] || (t[7] = us(() => {}, ['prevent']))
                  },
                  {
                    default: f(() => [
                      l(
                        _,
                        { class: 'py-2 text-center text-h5' },
                        { default: f(() => [C('span', GI, S(e.$t('RESET_PAGE.TITLE.SET_PASSWORD')), 1)]), _: 1 }
                      ),
                      l(
                        _,
                        { class: 'py-2' },
                        {
                          default: f(() => [
                            l(
                              de,
                              {
                                modelValue: r.showErrorAlert,
                                'onUpdate:modelValue': t[0] || (t[0] = a => (r.showErrorAlert = a)),
                                closable: '',
                                density: 'compact',
                                icon: '$warning',
                                type: 'error',
                                variant: 'outlined'
                              },
                              {
                                default: f(() => [C('span', null, S(e.$t('RESET_PAGE.MESSAGE.SUBMIT_FAILED')), 1)]),
                                _: 1
                              },
                              8,
                              ['modelValue']
                            ),
                            l(
                              de,
                              {
                                modelValue: r.showSuccessAlert,
                                'onUpdate:modelValue': t[1] || (t[1] = a => (r.showSuccessAlert = a)),
                                closable: '',
                                density: 'compact',
                                icon: '$success',
                                type: 'success',
                                variant: 'outlined'
                              },
                              {
                                default: f(() => [
                                  C('span', null, S(e.$t('RESET_PAGE.MESSAGE.SET_PASSWORD_SUCCESS')), 1),
                                  WI,
                                  C('span', null, S(e.$t('RESET_PAGE.MESSAGE.REDIRECT_INFO')), 1)
                                ]),
                                _: 1
                              },
                              8,
                              ['modelValue']
                            )
                          ]),
                          _: 1
                        }
                      ),
                      l(
                        _,
                        { class: 'py-2' },
                        {
                          default: f(() => [
                            l(
                              _,
                              { class: 'py-2' },
                              {
                                default: f(() => [
                                  l(
                                    Bt,
                                    {
                                      modelValue: e.form.newPassword,
                                      'onUpdate:modelValue': t[2] || (t[2] = a => (e.form.newPassword = a)),
                                      'append-inner-icon': r.showNewPassword ? 'mdi-eye' : 'mdi-eye-off',
                                      label: e.$t('RESET_PAGE.LABEL.NEW_PASSWORD'),
                                      rules: o.rules.newPassword,
                                      type: r.showNewPassword ? 'text' : 'password',
                                      'prepend-inner-icon': 'mdi mdi-lock-outline',
                                      variant: 'outlined',
                                      'onClick:appendInner':
                                        t[3] || (t[3] = a => (r.showNewPassword = !r.showNewPassword)),
                                      disabled: !!e.submitFormSuccessResult
                                    },
                                    null,
                                    8,
                                    ['modelValue', 'append-inner-icon', 'label', 'rules', 'type', 'disabled']
                                  )
                                ]),
                                _: 1
                              }
                            ),
                            l(
                              _,
                              { class: 'py-2' },
                              {
                                default: f(() => [
                                  l(
                                    Bt,
                                    {
                                      modelValue: e.form.confirmPassword,
                                      'onUpdate:modelValue': t[4] || (t[4] = a => (e.form.confirmPassword = a)),
                                      'append-inner-icon': r.showConfirmPassword ? 'mdi-eye' : 'mdi-eye-off',
                                      label: e.$t('RESET_PAGE.LABEL.CONFIRM_PASSWORD'),
                                      rules: o.rules.confirmPassword,
                                      type: r.showConfirmPassword ? 'text' : 'password',
                                      'prepend-inner-icon': 'mdi mdi-lock-outline',
                                      variant: 'outlined',
                                      'onClick:appendInner':
                                        t[5] || (t[5] = a => (r.showConfirmPassword = !r.showConfirmPassword)),
                                      disabled: !!e.submitFormSuccessResult
                                    },
                                    null,
                                    8,
                                    ['modelValue', 'append-inner-icon', 'label', 'rules', 'type', 'disabled']
                                  )
                                ]),
                                _: 1
                              }
                            ),
                            l(
                              _,
                              { class: 'py-2 text-right' },
                              {
                                default: f(() => [
                                  l(
                                    ae,
                                    {
                                      disabled: !!e.submitFormSuccessResult,
                                      loading: e.isSubmittingForm,
                                      'append-icon': 'mdi mdi-send-outline',
                                      onClick: o.onClickSubmit
                                    },
                                    { default: f(() => [ee(S(e.$t('RESET_PAGE.ACTION.SUBMIT')), 1)]), _: 1 },
                                    8,
                                    ['disabled', 'loading', 'onClick']
                                  )
                                ]),
                                _: 1
                              }
                            )
                          ]),
                          _: 1
                        }
                      )
                    ]),
                    _: 1
                  },
                  8,
                  ['modelValue']
                )
              ]),
              _: 1
            }
          )
        ]),
        _: 1
      }
    )
  )
}
const jI = ue(UI, [['render', HI]]),
  YI = Ee({
    name: 'PasswordPage',
    components: { PasswordForm: jI },
    data() {
      return {}
    },
    computed: {
      ...Ke(xr, ['status', 'errorObject', 'isSubmittingForm']),
      isMobile() {
        const { sm: e, xs: t } = this.$vuetify.display
        return t || e
      }
    },
    methods: { ...Ye(xr, ['initial', 'showError', 'destroy']) },
    mounted() {
      const e = this.$route.query.key,
        t = this.$route.query.secret
      !e || !t ? this.$router.push({ name: 'InvalidRequestPage' }) : this.initial({ key: e, secret: t })
    },
    unmounted() {
      this.destroy()
    },
    errorCaptured(e) {
      this.showError(e)
    }
  })
function KI(e, t, n, s, r, o) {
  const a = he('s-page-loading'),
    i = he('s-page-error'),
    u = he('password-form')
  return e.status === 'READY'
    ? (F(), G(a, { key: 0 }))
    : e.status === 'ERROR'
      ? (F(), G(i, { key: 1, error: e.errorObject }, null, 8, ['error']))
      : e.status === 'WORKING'
        ? (F(),
          G(
            dt,
            { key: 2, class: 'overflow-hidden' },
            {
              default: f(() => [
                l(
                  _,
                  { width: '100%', 'max-width': '480px', class: 'mx-auto text-left' },
                  {
                    default: f(() => [
                      l(
                        _,
                        { class: 'pa-4 text-center' },
                        {
                          default: f(() => [
                            l(lt, { src: e.$config.siteLogo, 'max-width': '360px', class: 'mx-auto' }, null, 8, ['src'])
                          ]),
                          _: 1
                        }
                      ),
                      l(u)
                    ]),
                    _: 1
                  }
                )
              ]),
              _: 1
            }
          ))
        : We('', !0)
}
const qI = ue(YI, [['render', KI]]),
  fl = jt({
    id: 'ResetDisplayStore',
    state: () => ({ status: 'READY', errorObject: !1, token: '', account: {} }),
    actions: {
      async initial(e) {
        var t, n, s, r, o, a
        try {
          this.token = e.token
          const i = await Oe.get('/reset/extract', { params: e })
          if (!i.headers.code) ((this.account = i.data), (this.status = 'WORKING'))
          else {
            const u = new Error((t = i == null ? void 0 : i.data) == null ? void 0 : t.message)
            ;((u.message = (n = i.data) == null ? void 0 : n.message),
              (u.code = (s = i.headers) == null ? void 0 : s.code),
              (this.errorObject = u),
              (this.status = 'ERROR'))
          }
        } catch (i) {
          const u = new Error(`[${i.code}] ${i.message}`)
          ;((u.message = i.message || ((o = (r = i.response) == null ? void 0 : r.data) == null ? void 0 : o.message)),
            (u.code = ((a = i.response) == null ? void 0 : a.status) || i.code),
            (this.errorObject = u),
            (this.status = 'ERROR'))
        }
      },
      showError(e) {
        ;((this.status = 'ERROR'), (this.errorObject = e))
      },
      destroy() {
        this.$reset()
      }
    }
  }),
  zI = {
    name: 'AccountView',
    data() {
      return { showSuccessAlert: !0 }
    },
    computed: {
      ...Ke(fl, ['account']),
      isMobile() {
        const { sm: e, xs: t } = this.$vuetify.display
        return t || e
      }
    },
    methods: {
      async onClickSignin() {
        this.$router.push({ name: 'SigninPage', query: { username: this.account.username } })
      }
    }
  },
  XI = { class: 'font-weight-medium text-secondary' },
  JI = C('br', null, null, -1),
  QI = { class: 'text-label' },
  ZI = { class: 'text-label' },
  eT = { class: 'text-label' },
  tT = { class: 'text-label' },
  nT = { key: 0 },
  sT = { key: 1 },
  rT = { class: 'text-label' },
  oT = { key: 0 },
  aT = { key: 1 }
function iT(e, t, n, s, r, o) {
  return (
    F(),
    G(
      _,
      { class: 'pt-5 mx-n2 mx-md-0' },
      {
        default: f(() => [
          l(
            we,
            { class: 'pa-4' },
            {
              default: f(() => [
                l(
                  _,
                  { class: 'py-2 text-center text-h5' },
                  { default: f(() => [C('span', XI, S(e.$t('RESET_PAGE.TITLE.INFO')), 1)]), _: 1 }
                ),
                l(
                  _,
                  { class: 'py-2' },
                  {
                    default: f(() => [
                      l(
                        de,
                        {
                          modelValue: r.showSuccessAlert,
                          'onUpdate:modelValue': t[0] || (t[0] = a => (r.showSuccessAlert = a)),
                          closable: '',
                          density: 'compact',
                          icon: '$success',
                          type: 'success',
                          variant: 'outlined'
                        },
                        {
                          default: f(() => [
                            C('span', null, S(e.$t('RESET_PAGE.MESSAGE.SET_PASSWORD_SUCCESS')), 1),
                            JI,
                            C('span', null, S(e.$t('RESET_PAGE.MESSAGE.REDIRECT_INFO')), 1)
                          ]),
                          _: 1
                        },
                        8,
                        ['modelValue']
                      )
                    ]),
                    _: 1
                  }
                ),
                l(
                  _,
                  { class: 'py-2' },
                  {
                    default: f(() => [
                      l(
                        _,
                        { class: 'py-1 d-flex align-center justify-space-between' },
                        {
                          default: f(() => [
                            l(
                              _,
                              { class: 'flex-grow-0', width: '110px' },
                              {
                                default: f(() => [C('label', QI, S(e.$t('RESET_PAGE.LABEL.USERNAME')) + ':', 1)]),
                                _: 1
                              }
                            ),
                            l(
                              _,
                              { class: 'flex-grow-1' },
                              { default: f(() => [C('span', null, S(e.account.username), 1)]), _: 1 }
                            )
                          ]),
                          _: 1
                        }
                      ),
                      l(
                        _,
                        { class: 'py-1 d-flex align-center justify-space-between' },
                        {
                          default: f(() => [
                            l(
                              _,
                              { class: 'flex-grow-0', width: '110px' },
                              {
                                default: f(() => [C('label', ZI, S(e.$t('RESET_PAGE.LABEL.PASSWORD')) + ':', 1)]),
                                _: 1
                              }
                            ),
                            l(
                              _,
                              { class: 'flex-grow-1' },
                              { default: f(() => [C('span', null, S(e.account.password), 1)]), _: 1 }
                            )
                          ]),
                          _: 1
                        }
                      ),
                      l(
                        _,
                        { class: 'pt-3 pb-1 d-flex align-center justify-space-between' },
                        {
                          default: f(() => [
                            l(
                              _,
                              { class: 'flex-grow-0', width: '110px' },
                              {
                                default: f(() => [C('label', eT, S(e.$t('RESET_PAGE.LABEL.DISPLAY_NAME')) + ':', 1)]),
                                _: 1
                              }
                            ),
                            l(
                              _,
                              { class: 'flex-grow-1' },
                              { default: f(() => [C('span', null, S(e.account.displayName), 1)]), _: 1 }
                            )
                          ]),
                          _: 1
                        }
                      ),
                      l(
                        _,
                        { class: 'py-1 d-flex align-center justify-space-between' },
                        {
                          default: f(() => [
                            l(
                              _,
                              { class: 'flex-grow-0', width: '110px' },
                              {
                                default: f(() => [C('label', tT, S(e.$t('RESET_PAGE.LABEL.PHONE_NUMBER')) + ':', 1)]),
                                _: 1
                              }
                            ),
                            l(
                              _,
                              { class: 'flex-grow-1' },
                              {
                                default: f(() => [
                                  e.account.phoneNumber
                                    ? (F(), Ne('span', nT, S(e.$filters.phone(e.account.phoneNumber)), 1))
                                    : (F(), Ne('span', sT, 'N/A'))
                                ]),
                                _: 1
                              }
                            )
                          ]),
                          _: 1
                        }
                      ),
                      l(
                        _,
                        { class: 'py-1 d-flex align-center justify-space-between' },
                        {
                          default: f(() => [
                            l(
                              _,
                              { class: 'flex-grow-0', width: '110px' },
                              { default: f(() => [C('label', rT, S(e.$t('RESET_PAGE.LABEL.EMAIL')) + ':', 1)]), _: 1 }
                            ),
                            l(
                              _,
                              { class: 'flex-grow-1' },
                              {
                                default: f(() => [
                                  e.account.email
                                    ? (F(), Ne('span', oT, S(e.account.email), 1))
                                    : (F(), Ne('span', aT, 'N/A'))
                                ]),
                                _: 1
                              }
                            )
                          ]),
                          _: 1
                        }
                      ),
                      l(
                        _,
                        { class: 'py-2 text-right' },
                        {
                          default: f(() => [
                            l(
                              ae,
                              { variant: 'outlined', 'append-icon': 'mdi mdi-login', onClick: o.onClickSignin },
                              { default: f(() => [ee(S(e.$t('RESET_PAGE.ACTION.SIGNIN')), 1)]), _: 1 },
                              8,
                              ['onClick']
                            )
                          ]),
                          _: 1
                        }
                      )
                    ]),
                    _: 1
                  }
                )
              ]),
              _: 1
            }
          )
        ]),
        _: 1
      }
    )
  )
}
const lT = ue(zI, [['render', iT]]),
  uT = Ee({
    name: 'DisplayPage',
    components: { AccountView: lT },
    data() {
      return {}
    },
    computed: {
      ...Ke(fl, ['status', 'errorObject']),
      isMobile() {
        const { sm: e, xs: t } = this.$vuetify.display
        return t || e
      }
    },
    methods: { ...Ye(fl, ['initial', 'showError', 'destroy']) },
    mounted() {
      const e = this.$route.query.token
      e ? this.initial({ token: e }) : this.$router.push({ name: 'InvalidRequestPage' })
    },
    unmounted() {
      this.destroy()
    },
    errorCaptured(e) {
      this.showError(e)
    }
  })
function cT(e, t, n, s, r, o) {
  const a = he('s-page-loading'),
    i = he('s-page-error'),
    u = he('account-view')
  return e.status === 'READY'
    ? (F(), G(a, { key: 0 }))
    : e.status === 'ERROR'
      ? (F(), G(i, { key: 1, error: e.errorObject }, null, 8, ['error']))
      : e.status === 'WORKING'
        ? (F(),
          G(
            dt,
            { key: 2, class: 'overflow-hidden' },
            {
              default: f(() => [
                l(
                  _,
                  { width: '100%', 'max-width': '480px', class: 'mx-auto text-left' },
                  {
                    default: f(() => [
                      l(
                        _,
                        { class: 'pa-4 text-center' },
                        {
                          default: f(() => [
                            l(lt, { src: e.$config.siteLogo, 'max-width': '360px', class: 'mx-auto' }, null, 8, ['src'])
                          ]),
                          _: 1
                        }
                      ),
                      l(u)
                    ]),
                    _: 1
                  }
                )
              ]),
              _: 1
            }
          ))
        : We('', !0)
}
const dT = ue(uT, [['render', cT]]),
  da = jt({
    id: 'WelcomeIndexStore',
    state: () => ({ status: 'READY', errorObject: !1, token: '', data: {} }),
    actions: {
      async initial(e) {
        var t, n, s, r, o, a, i, u, c, d, m, h
        try {
          this.token = e.token
          const E = await Oe.get('/welcome/check', { params: e })
          if (!E.headers.code) ((this.data = E.data), (this.status = 'WORKING'))
          else if (E.headers.code === '5') {
            const y = new Error((t = E == null ? void 0 : E.data) == null ? void 0 : t.message)
            ;((y.message = (n = E.data) == null ? void 0 : n.message),
              (y.code = (s = E.headers) == null ? void 0 : s.code),
              (this.errorObject = y),
              (this.status = 'INVALID'))
          } else if (E.headers.code === '7') {
            const y = new Error((r = E == null ? void 0 : E.data) == null ? void 0 : r.message)
            ;((y.message = (o = E.data) == null ? void 0 : o.message),
              (y.code = (a = E.headers) == null ? void 0 : a.code),
              (this.errorObject = y),
              (this.status = 'EXPIRED'))
          } else {
            const y = new Error((i = E == null ? void 0 : E.data) == null ? void 0 : i.message)
            ;((y.message = (u = E.data) == null ? void 0 : u.message),
              (y.code = (c = E.headers) == null ? void 0 : c.code),
              (this.errorObject = y),
              (this.status = 'ERROR'))
          }
        } catch (E) {
          const y = new Error(`[${E.code}] ${E.message}`)
          ;((y.message = E.message || ((m = (d = E.response) == null ? void 0 : d.data) == null ? void 0 : m.message)),
            (y.code = ((h = E.response) == null ? void 0 : h.status) || E.code),
            (this.errorObject = y),
            (this.status = 'ERROR'))
        }
      },
      showError(e) {
        ;((this.status = 'ERROR'), (this.errorObject = e))
      },
      destroy() {
        this.$reset()
      }
    }
  }),
  fT = {
    name: 'SignupPage',
    methods: { ...Ye(da, ['showError', 'destroy']) },
    mounted() {
      this.$route.name === 'WelcomePage' && this.$router.push({ name: 'WelcomeIndexPage' })
    },
    unmounted() {
      this.destroy()
    },
    errorCaptured(e) {
      this.showError(e)
    }
  }
function mT(e, t, n, s, r, o) {
  const a = he('router-view')
  return (F(), G(a))
}
const hT = ue(fT, [['render', mT]]),
  gT = {
    name: 'WelcomeView',
    data() {
      return { showSuccessAlert: !0 }
    },
    computed: {
      ...Ke(da, ['data']),
      isMobile() {
        const { sm: e, xs: t } = this.$vuetify.display
        return t || e
      }
    },
    methods: {
      async onClickSetup() {
        this.$router.push({ name: 'WelcomePasswordPage', query: { key: this.data.key, secret: this.data.secret } })
      }
    }
  },
  pT = { class: 'font-weight-medium text-secondary' },
  ET = C('br', null, null, -1),
  _T = { class: 'text-label' },
  yT = { class: 'text-label' },
  vT = { class: 'text-label' },
  bT = { class: 'text-label' },
  ST = { key: 0 },
  RT = { key: 1 },
  OT = { class: 'text-label' },
  CT = { key: 0 },
  AT = { key: 1 }
function IT(e, t, n, s, r, o) {
  return (
    F(),
    G(
      _,
      { class: 'pt-5 mx-n2 mx-md-0' },
      {
        default: f(() => [
          l(
            we,
            { class: 'pa-4' },
            {
              default: f(() => [
                l(
                  _,
                  { class: 'py-2 text-center text-h5' },
                  {
                    default: f(() => [
                      C('span', pT, S(e.$t('WELCOME_PAGE.TITLE.WELCOME', { name: e.$config.copyright })), 1)
                    ]),
                    _: 1
                  }
                ),
                l(
                  _,
                  { class: 'py-2' },
                  {
                    default: f(() => [
                      l(
                        de,
                        {
                          modelValue: r.showSuccessAlert,
                          'onUpdate:modelValue': t[0] || (t[0] = a => (r.showSuccessAlert = a)),
                          closable: '',
                          density: 'compact',
                          icon: '$success',
                          type: 'success',
                          variant: 'outlined'
                        },
                        {
                          default: f(() => [
                            C('span', null, S(e.$t('WELCOME_PAGE.MESSAGE.CONGRATULATIONS')), 1),
                            ET,
                            C('span', null, S(e.$t('WELCOME_PAGE.MESSAGE.PLEASE_FINISH_SETUP')), 1)
                          ]),
                          _: 1
                        },
                        8,
                        ['modelValue']
                      )
                    ]),
                    _: 1
                  }
                ),
                l(
                  _,
                  { class: 'py-2' },
                  {
                    default: f(() => [
                      l(
                        _,
                        { class: 'py-1 d-flex align-center justify-space-between' },
                        {
                          default: f(() => [
                            l(
                              _,
                              { class: 'flex-grow-0', width: '110px' },
                              {
                                default: f(() => [C('label', _T, S(e.$t('WELCOME_PAGE.LABEL.USERNAME')) + ':', 1)]),
                                _: 1
                              }
                            ),
                            l(
                              _,
                              { class: 'flex-grow-1' },
                              { default: f(() => [C('span', null, S(e.data.username), 1)]), _: 1 }
                            )
                          ]),
                          _: 1
                        }
                      ),
                      l(
                        _,
                        { class: 'py-1 d-flex align-center justify-space-between' },
                        {
                          default: f(() => [
                            l(
                              _,
                              { class: 'flex-grow-0', width: '110px' },
                              {
                                default: f(() => [C('label', yT, S(e.$t('WELCOME_PAGE.LABEL.PASSWORD')) + ':', 1)]),
                                _: 1
                              }
                            ),
                            l(
                              _,
                              { class: 'flex-grow-1' },
                              { default: f(() => [C('span', null, S(e.data.password), 1)]), _: 1 }
                            )
                          ]),
                          _: 1
                        }
                      ),
                      l(
                        _,
                        { class: 'pt-3 pb-1 d-flex align-center justify-space-between' },
                        {
                          default: f(() => [
                            l(
                              _,
                              { class: 'flex-grow-0', width: '110px' },
                              {
                                default: f(() => [C('label', vT, S(e.$t('WELCOME_PAGE.LABEL.DISPLAY_NAME')) + ':', 1)]),
                                _: 1
                              }
                            ),
                            l(
                              _,
                              { class: 'flex-grow-1' },
                              { default: f(() => [C('span', null, S(e.data.displayName), 1)]), _: 1 }
                            )
                          ]),
                          _: 1
                        }
                      ),
                      l(
                        _,
                        { class: 'py-1 d-flex align-center justify-space-between' },
                        {
                          default: f(() => [
                            l(
                              _,
                              { class: 'flex-grow-0', width: '110px' },
                              {
                                default: f(() => [C('label', bT, S(e.$t('WELCOME_PAGE.LABEL.PHONE_NUMBER')) + ':', 1)]),
                                _: 1
                              }
                            ),
                            l(
                              _,
                              { class: 'flex-grow-1' },
                              {
                                default: f(() => [
                                  e.data.phoneNumber
                                    ? (F(), Ne('span', ST, S(e.$filters.phone(e.data.phoneNumber)), 1))
                                    : (F(), Ne('span', RT, 'N/A'))
                                ]),
                                _: 1
                              }
                            )
                          ]),
                          _: 1
                        }
                      ),
                      l(
                        _,
                        { class: 'py-1 d-flex align-center justify-space-between' },
                        {
                          default: f(() => [
                            l(
                              _,
                              { class: 'flex-grow-0', width: '110px' },
                              { default: f(() => [C('label', OT, S(e.$t('WELCOME_PAGE.LABEL.EMAIL')) + ':', 1)]), _: 1 }
                            ),
                            l(
                              _,
                              { class: 'flex-grow-1' },
                              {
                                default: f(() => [
                                  e.data.email
                                    ? (F(), Ne('span', CT, S(e.data.email), 1))
                                    : (F(), Ne('span', AT, 'N/A'))
                                ]),
                                _: 1
                              }
                            )
                          ]),
                          _: 1
                        }
                      ),
                      l(
                        _,
                        { class: 'py-2 text-right' },
                        {
                          default: f(() => [
                            l(
                              ae,
                              { variant: 'outlined', 'append-icon': 'mdi mdi-send-outline', onClick: o.onClickSetup },
                              { default: f(() => [ee(S(e.$t('WELCOME_PAGE.ACTION.SETUP')), 1)]), _: 1 },
                              8,
                              ['onClick']
                            )
                          ]),
                          _: 1
                        }
                      )
                    ]),
                    _: 1
                  }
                )
              ]),
              _: 1
            }
          )
        ]),
        _: 1
      }
    )
  )
}
const TT = ue(gT, [['render', IT]]),
  NT = Ee({
    name: 'WelcomeIndexPage',
    components: { WelcomeView: TT },
    data() {
      return {}
    },
    computed: {
      ...Ke(da, ['status', 'errorObject', 'isSubmittingForm']),
      isMobile() {
        const { sm: e, xs: t } = this.$vuetify.display
        return t || e
      }
    },
    methods: { ...Ye(da, ['initial', 'showError']) },
    watch: {
      status() {
        this.status === 'INVALID'
          ? this.$router.push({ name: 'InvalidRequestPage' })
          : this.status === 'EXPIRED' && this.$router.push({ name: 'CodeExpiredPage' })
      }
    },
    mounted() {
      const e = this.$route.query.token
      e ? this.initial({ token: e }) : this.$router.push({ name: 'InvalidRequestPage' })
    },
    errorCaptured(e) {
      this.showError(e)
    }
  })
function wT(e, t, n, s, r, o) {
  const a = he('s-page-loading'),
    i = he('s-page-error'),
    u = he('welcome-view')
  return e.status === 'READY'
    ? (F(), G(a, { key: 0 }))
    : e.status === 'ERROR'
      ? (F(), G(i, { key: 1, error: e.errorObject }, null, 8, ['error']))
      : e.status === 'INVALID'
        ? (F(), G(i, { key: 2, error: e.errorObject }, null, 8, ['error']))
        : e.status === 'EXPIRED'
          ? (F(), G(i, { key: 3, error: e.errorObject }, null, 8, ['error']))
          : e.status === 'WORKING'
            ? (F(),
              G(
                dt,
                { key: 4, class: 'overflow-hidden' },
                {
                  default: f(() => [
                    l(
                      _,
                      { width: '100%', 'max-width': '480px', class: 'mx-auto text-left' },
                      {
                        default: f(() => [
                          l(
                            _,
                            { class: 'pa-4 text-center' },
                            {
                              default: f(() => [
                                l(lt, { src: e.$config.siteLogo, 'max-width': '360px', class: 'mx-auto' }, null, 8, [
                                  'src'
                                ])
                              ]),
                              _: 1
                            }
                          ),
                          l(u)
                        ]),
                        _: 1
                      }
                    )
                  ]),
                  _: 1
                }
              ))
            : We('', !0)
}
const LT = ue(NT, [['render', wT]]),
  PT = e => {
    const t = {}
    return (
      Object.keys(e).forEach(n => {
        const s = e[n]
        t[n] = typeof s == 'string' ? s.trim() : s
      }),
      t
    )
  },
  Br = jt({
    id: 'WelcomePasswordStore',
    state: () => ({
      status: 'READY',
      errorObject: !1,
      isValid: !1,
      form: { key: '', secret: '', newPassword: '', confirmPassword: '' },
      isSubmittingForm: !1,
      submitFormErrorCode: !1,
      submitFormSuccessResult: !1
    }),
    actions: {
      async initial(e) {
        var t, n, s
        try {
          ;((this.form.key = e.key), (this.form.secret = e.secret), (this.status = 'WORKING'))
        } catch (r) {
          const o = new Error(`[${r.code}] ${r.message}`)
          ;((o.message = r.message || ((n = (t = r.response) == null ? void 0 : t.data) == null ? void 0 : n.message)),
            (o.code = ((s = r.response) == null ? void 0 : s.status) || r.code),
            (this.errorObject = o),
            (this.status = 'ERROR'))
        }
      },
      async submit() {
        var e, t
        try {
          ;((this.submitFormSuccessResult = !1), (this.submitFormErrorCode = !1), (this.isSubmittingForm = !0))
          const n = PT(this.form),
            s = await Oe.post('/welcome/password', n)
          ;(s.headers.code ? (this.submitFormErrorCode = s.headers.code) : (this.submitFormSuccessResult = s.data),
            (this.isSubmittingForm = !1))
        } catch (n) {
          ;(console.error(n),
            (this.submitFormErrorCode =
              ((t = (e = n.response) == null ? void 0 : e.headers) == null ? void 0 : t.code) || !0),
            (this.isSubmittingForm = !1))
        }
      },
      showError(e) {
        ;((this.status = 'ERROR'), (this.errorObject = e))
      },
      destroy() {
        this.$reset()
      }
    }
  }),
  $T = {
    name: 'PasswordForm',
    data() {
      return { showErrorAlert: !1, showSuccessAlert: !1, showNewPassword: !1, showConfirmPassword: !1 }
    },
    computed: {
      ...an(Br, ['form', 'isValid', 'submitFormErrorCode']),
      ...Ke(Br, ['isSubmittingForm', 'submitFormSuccessResult']),
      isMobile() {
        const { sm: e, xs: t } = this.$vuetify.display
        return t || e
      },
      rules() {
        return {
          newPassword: [
            e =>
              !e || !e.trim()
                ? this.$filters.message(
                    this.$t('VALIDATION.REQUIRED', { item: this.$t('WELCOME_PAGE.LABEL.NEW_PASSWORD') })
                  )
                : e.trim().length < 6
                  ? this.$filters.message(
                      this.$t('VALIDATION.MIN_LENGTH', { item: this.$t('WELCOME_PAGE.LABEL.NEW_PASSWORD'), length: 6 })
                    )
                  : e.trim().length > 250
                    ? this.$filters.message(
                        this.$t('VALIDATION.MAX_LENGTH', {
                          item: this.$t('WELCOME_PAGE.LABEL.NEW_PASSWORD'),
                          length: 250
                        })
                      )
                    : !0
          ],
          confirmPassword: [
            e =>
              !e || !e.trim()
                ? this.$filters.message(
                    this.$t('VALIDATION.REQUIRED', { item: this.$t('WELCOME_PAGE.LABEL.CONFIRM_PASSWORD') })
                  )
                : e.trim() !== this.form.newPassword.trim()
                  ? this.$filters.message(
                      this.$t('VALIDATION.CONFIRM_PASSWORD', {
                        confirm: this.$t('WELCOME_PAGE.LABEL.CONFIRM_PASSWORD'),
                        password: this.$t('WELCOME_PAGE.LABEL.NEW_PASSWORD')
                      })
                    )
                  : !0
          ]
        }
      }
    },
    watch: {
      'form.newPassword'() {
        this.showErrorAlert && (this.showErrorAlert = !1)
      },
      'form.confirmPassword'() {
        this.showErrorAlert && (this.showErrorAlert = !1)
      },
      showErrorAlert() {
        this.showErrorAlert || (this.submitFormErrorCode = !1)
      },
      isSubmittingForm() {
        this.isSubmittingForm && (this.showErrorAlert = !1)
      },
      submitFormErrorCode() {
        this.submitFormErrorCode === '1' || this.submitFormErrorCode === '2' || this.submitFormErrorCode === '3'
          ? this.$router.push({ name: 'DuplicatedInfoPage' })
          : this.submitFormErrorCode === '7'
            ? this.$router.push({ name: 'CodeExpiredPage' })
            : this.submitFormErrorCode === '5'
              ? this.$router.push({ name: 'InvalidRequestPage' })
              : this.submitFormErrorCode && (this.showErrorAlert = !0)
      },
      submitFormSuccessResult() {
        this.submitFormSuccessResult &&
          (this.showSnackbar({
            message: `${this.$t('WELCOME_PAGE.MESSAGE.SETUP_FINISHED')} ${this.$t('WELCOME_PAGE.MESSAGE.REDIRECT_SIGNIN')}`,
            timeout: 5e3
          }),
          this.$router.push({ name: 'WelcomeDisplayPage', query: { token: this.submitFormSuccessResult.token } }))
      }
    },
    methods: {
      ...Ye(gt, ['showSnackbar']),
      ...Ye(Br, ['submit']),
      async onClickSubmit() {
        const { valid: e } = await this.$refs.form.validate()
        e && this.submit()
      }
    }
  },
  MT = { class: 'font-weight-medium text-secondary' },
  kT = C('br', null, null, -1)
function DT(e, t, n, s, r, o) {
  return (
    F(),
    G(
      _,
      { class: 'pt-5 mx-n2 mx-md-0' },
      {
        default: f(() => [
          l(
            we,
            { class: 'pa-4' },
            {
              default: f(() => [
                l(
                  Un,
                  {
                    ref: 'form',
                    modelValue: e.isValid,
                    'onUpdate:modelValue': t[6] || (t[6] = a => (e.isValid = a)),
                    onSubmit: t[7] || (t[7] = us(() => {}, ['prevent']))
                  },
                  {
                    default: f(() => [
                      l(
                        _,
                        { class: 'py-2 text-center text-h5' },
                        { default: f(() => [C('span', MT, S(e.$t('WELCOME_PAGE.TITLE.SET_PASSWORD')), 1)]), _: 1 }
                      ),
                      l(
                        _,
                        { class: 'py-2' },
                        {
                          default: f(() => [
                            l(
                              de,
                              {
                                modelValue: r.showErrorAlert,
                                'onUpdate:modelValue': t[0] || (t[0] = a => (r.showErrorAlert = a)),
                                closable: '',
                                density: 'compact',
                                icon: '$warning',
                                type: 'error',
                                variant: 'outlined'
                              },
                              {
                                default: f(() => [C('span', null, S(e.$t('WELCOME_PAGE.MESSAGE.SUBMIT_FAILED')), 1)]),
                                _: 1
                              },
                              8,
                              ['modelValue']
                            ),
                            l(
                              de,
                              {
                                modelValue: r.showSuccessAlert,
                                'onUpdate:modelValue': t[1] || (t[1] = a => (r.showSuccessAlert = a)),
                                closable: '',
                                density: 'compact',
                                icon: '$success',
                                type: 'success',
                                variant: 'outlined'
                              },
                              {
                                default: f(() => [
                                  C('span', null, S(e.$t('WELCOME_PAGE.MESSAGE.SIGNUP_FINISHED')), 1),
                                  kT,
                                  C('span', null, S(e.$t('WELCOME_PAGE.MESSAGE.REDIRECT_SIGNIN')), 1)
                                ]),
                                _: 1
                              },
                              8,
                              ['modelValue']
                            )
                          ]),
                          _: 1
                        }
                      ),
                      l(
                        _,
                        { class: 'py-2' },
                        {
                          default: f(() => [
                            l(
                              _,
                              { class: 'py-2' },
                              {
                                default: f(() => [
                                  l(
                                    Bt,
                                    {
                                      modelValue: e.form.newPassword,
                                      'onUpdate:modelValue': t[2] || (t[2] = a => (e.form.newPassword = a)),
                                      'append-inner-icon': r.showNewPassword ? 'mdi-eye' : 'mdi-eye-off',
                                      label: e.$t('WELCOME_PAGE.LABEL.NEW_PASSWORD'),
                                      rules: o.rules.newPassword,
                                      type: r.showNewPassword ? 'text' : 'password',
                                      'prepend-inner-icon': 'mdi mdi-lock-outline',
                                      variant: 'outlined',
                                      'onClick:appendInner':
                                        t[3] || (t[3] = a => (r.showNewPassword = !r.showNewPassword)),
                                      disabled: !!e.submitFormSuccessResult
                                    },
                                    null,
                                    8,
                                    ['modelValue', 'append-inner-icon', 'label', 'rules', 'type', 'disabled']
                                  )
                                ]),
                                _: 1
                              }
                            ),
                            l(
                              _,
                              { class: 'py-2' },
                              {
                                default: f(() => [
                                  l(
                                    Bt,
                                    {
                                      modelValue: e.form.confirmPassword,
                                      'onUpdate:modelValue': t[4] || (t[4] = a => (e.form.confirmPassword = a)),
                                      'append-inner-icon': r.showConfirmPassword ? 'mdi-eye' : 'mdi-eye-off',
                                      label: e.$t('WELCOME_PAGE.LABEL.CONFIRM_PASSWORD'),
                                      rules: o.rules.confirmPassword,
                                      type: r.showConfirmPassword ? 'text' : 'password',
                                      'prepend-inner-icon': 'mdi mdi-lock-outline',
                                      variant: 'outlined',
                                      'onClick:appendInner':
                                        t[5] || (t[5] = a => (r.showConfirmPassword = !r.showConfirmPassword)),
                                      disabled: !!e.submitFormSuccessResult
                                    },
                                    null,
                                    8,
                                    ['modelValue', 'append-inner-icon', 'label', 'rules', 'type', 'disabled']
                                  )
                                ]),
                                _: 1
                              }
                            ),
                            l(
                              _,
                              { class: 'py-2 text-right' },
                              {
                                default: f(() => [
                                  l(
                                    ae,
                                    {
                                      disabled: !!e.submitFormSuccessResult,
                                      loading: e.isSubmittingForm,
                                      'append-icon': 'mdi mdi-send-outline',
                                      onClick: o.onClickSubmit
                                    },
                                    { default: f(() => [ee(S(e.$t('WELCOME_PAGE.ACTION.SUBMIT')), 1)]), _: 1 },
                                    8,
                                    ['disabled', 'loading', 'onClick']
                                  )
                                ]),
                                _: 1
                              }
                            )
                          ]),
                          _: 1
                        }
                      )
                    ]),
                    _: 1
                  },
                  8,
                  ['modelValue']
                )
              ]),
              _: 1
            }
          )
        ]),
        _: 1
      }
    )
  )
}
const FT = ue($T, [['render', DT]]),
  VT = Ee({
    name: 'SignupPasswordPage',
    components: { PasswordForm: FT },
    data() {
      return {}
    },
    computed: {
      ...Ke(Br, ['status', 'errorObject', 'isSubmittingForm']),
      isMobile() {
        const { sm: e, xs: t } = this.$vuetify.display
        return t || e
      }
    },
    methods: { ...Ye(Br, ['initial', 'showError', 'destroy']) },
    mounted() {
      const e = this.$route.query.key,
        t = this.$route.query.secret
      !e || !t ? this.$router.push({ name: 'InvalidRequestPage' }) : this.initial({ key: e, secret: t })
    },
    unmounted() {
      this.destroy()
    },
    errorCaptured(e) {
      this.showError(e)
    }
  })
function xT(e, t, n, s, r, o) {
  const a = he('s-page-loading'),
    i = he('s-page-error'),
    u = he('password-form')
  return e.status === 'READY'
    ? (F(), G(a, { key: 0 }))
    : e.status === 'ERROR'
      ? (F(), G(i, { key: 1, error: e.errorObject }, null, 8, ['error']))
      : e.status === 'WORKING'
        ? (F(),
          G(
            dt,
            { key: 2, class: 'overflow-hidden' },
            {
              default: f(() => [
                l(
                  _,
                  { width: '100%', 'max-width': '480px', class: 'mx-auto text-left' },
                  {
                    default: f(() => [
                      l(
                        _,
                        { class: 'pa-4 text-center' },
                        {
                          default: f(() => [
                            l(lt, { src: e.$config.siteLogo, 'max-width': '360px', class: 'mx-auto' }, null, 8, ['src'])
                          ]),
                          _: 1
                        }
                      ),
                      l(u)
                    ]),
                    _: 1
                  }
                )
              ]),
              _: 1
            }
          ))
        : We('', !0)
}
const BT = ue(VT, [['render', xT]]),
  ml = jt({
    id: 'WelcomeDisplayStore',
    state: () => ({ status: 'READY', errorObject: !1, token: '', account: {} }),
    actions: {
      async initial(e) {
        var t, n, s, r, o, a
        try {
          this.token = e.token
          const i = await Oe.get('/welcome/extract', { params: e })
          if (!i.headers.code) ((this.account = i.data), (this.status = 'WORKING'))
          else {
            const u = new Error((t = i == null ? void 0 : i.data) == null ? void 0 : t.message)
            ;((u.message = (n = i.data) == null ? void 0 : n.message),
              (u.code = (s = i.headers) == null ? void 0 : s.code),
              (this.errorObject = u),
              (this.status = 'ERROR'))
          }
        } catch (i) {
          const u = new Error(`[${i.code}] ${i.message}`)
          ;((u.message = i.message || ((o = (r = i.response) == null ? void 0 : r.data) == null ? void 0 : o.message)),
            (u.code = ((a = i.response) == null ? void 0 : a.status) || i.code),
            (this.errorObject = u),
            (this.status = 'ERROR'))
        }
      },
      showError(e) {
        ;((this.status = 'ERROR'), (this.errorObject = e))
      },
      destroy() {
        this.$reset()
      }
    }
  }),
  UT = {
    name: 'AccountView',
    data() {
      return { showSuccessAlert: !0 }
    },
    computed: {
      ...Ke(ml, ['account']),
      isMobile() {
        const { sm: e, xs: t } = this.$vuetify.display
        return t || e
      }
    },
    methods: {
      async onClickSignin() {
        this.$router.push({ name: 'SigninPage', query: { username: this.account.username } })
      }
    }
  },
  GT = { class: 'font-weight-medium text-secondary' },
  WT = C('br', null, null, -1),
  HT = { class: 'text-label' },
  jT = { class: 'text-label' },
  YT = { class: 'text-label' },
  KT = { class: 'text-label' },
  qT = { key: 0 },
  zT = { key: 1 },
  XT = { class: 'text-label' },
  JT = { key: 0 },
  QT = { key: 1 }
function ZT(e, t, n, s, r, o) {
  return (
    F(),
    G(
      _,
      { class: 'pt-5 mx-n2 mx-md-0' },
      {
        default: f(() => [
          l(
            we,
            { class: 'pa-4' },
            {
              default: f(() => [
                l(
                  _,
                  { class: 'py-2 text-center text-h5' },
                  { default: f(() => [C('span', GT, S(e.$t('WELCOME_PAGE.TITLE.INFORMATION')), 1)]), _: 1 }
                ),
                l(
                  _,
                  { class: 'py-2' },
                  {
                    default: f(() => [
                      l(
                        de,
                        {
                          modelValue: r.showSuccessAlert,
                          'onUpdate:modelValue': t[0] || (t[0] = a => (r.showSuccessAlert = a)),
                          closable: '',
                          density: 'compact',
                          icon: '$success',
                          type: 'success',
                          variant: 'outlined'
                        },
                        {
                          default: f(() => [
                            C('span', null, S(e.$t('WELCOME_PAGE.MESSAGE.SETUP_FINISHED')), 1),
                            WT,
                            C('span', null, S(e.$t('WELCOME_PAGE.MESSAGE.REDIRECT_SIGNIN')), 1)
                          ]),
                          _: 1
                        },
                        8,
                        ['modelValue']
                      )
                    ]),
                    _: 1
                  }
                ),
                l(
                  _,
                  { class: 'py-2' },
                  {
                    default: f(() => [
                      l(
                        _,
                        { class: 'py-1 d-flex align-center justify-space-between' },
                        {
                          default: f(() => [
                            l(
                              _,
                              { class: 'flex-grow-0', width: '110px' },
                              {
                                default: f(() => [C('label', HT, S(e.$t('WELCOME_PAGE.LABEL.USERNAME')) + ':', 1)]),
                                _: 1
                              }
                            ),
                            l(
                              _,
                              { class: 'flex-grow-1' },
                              { default: f(() => [C('span', null, S(e.account.username), 1)]), _: 1 }
                            )
                          ]),
                          _: 1
                        }
                      ),
                      l(
                        _,
                        { class: 'py-1 d-flex align-center justify-space-between' },
                        {
                          default: f(() => [
                            l(
                              _,
                              { class: 'flex-grow-0', width: '110px' },
                              {
                                default: f(() => [C('label', jT, S(e.$t('WELCOME_PAGE.LABEL.PASSWORD')) + ':', 1)]),
                                _: 1
                              }
                            ),
                            l(
                              _,
                              { class: 'flex-grow-1' },
                              { default: f(() => [C('span', null, S(e.account.password), 1)]), _: 1 }
                            )
                          ]),
                          _: 1
                        }
                      ),
                      l(
                        _,
                        { class: 'pt-3 pb-1 d-flex align-center justify-space-between' },
                        {
                          default: f(() => [
                            l(
                              _,
                              { class: 'flex-grow-0', width: '110px' },
                              {
                                default: f(() => [C('label', YT, S(e.$t('WELCOME_PAGE.LABEL.DISPLAY_NAME')) + ':', 1)]),
                                _: 1
                              }
                            ),
                            l(
                              _,
                              { class: 'flex-grow-1' },
                              { default: f(() => [C('span', null, S(e.account.displayName), 1)]), _: 1 }
                            )
                          ]),
                          _: 1
                        }
                      ),
                      l(
                        _,
                        { class: 'py-1 d-flex align-center justify-space-between' },
                        {
                          default: f(() => [
                            l(
                              _,
                              { class: 'flex-grow-0', width: '110px' },
                              {
                                default: f(() => [C('label', KT, S(e.$t('WELCOME_PAGE.LABEL.PHONE_NUMBER')) + ':', 1)]),
                                _: 1
                              }
                            ),
                            l(
                              _,
                              { class: 'flex-grow-1' },
                              {
                                default: f(() => [
                                  e.account.phoneNumber
                                    ? (F(), Ne('span', qT, S(e.$filters.phone(e.account.phoneNumber)), 1))
                                    : (F(), Ne('span', zT, 'N/A'))
                                ]),
                                _: 1
                              }
                            )
                          ]),
                          _: 1
                        }
                      ),
                      l(
                        _,
                        { class: 'py-1 d-flex align-center justify-space-between' },
                        {
                          default: f(() => [
                            l(
                              _,
                              { class: 'flex-grow-0', width: '110px' },
                              { default: f(() => [C('label', XT, S(e.$t('WELCOME_PAGE.LABEL.EMAIL')) + ':', 1)]), _: 1 }
                            ),
                            l(
                              _,
                              { class: 'flex-grow-1' },
                              {
                                default: f(() => [
                                  e.account.email
                                    ? (F(), Ne('span', JT, S(e.account.email), 1))
                                    : (F(), Ne('span', QT, 'N/A'))
                                ]),
                                _: 1
                              }
                            )
                          ]),
                          _: 1
                        }
                      ),
                      l(
                        _,
                        { class: 'py-2 text-right' },
                        {
                          default: f(() => [
                            l(
                              ae,
                              { variant: 'outlined', 'append-icon': 'mdi mdi-login', onClick: o.onClickSignin },
                              { default: f(() => [ee(S(e.$t('WELCOME_PAGE.ACTION.SIGNIN')), 1)]), _: 1 },
                              8,
                              ['onClick']
                            )
                          ]),
                          _: 1
                        }
                      )
                    ]),
                    _: 1
                  }
                )
              ]),
              _: 1
            }
          )
        ]),
        _: 1
      }
    )
  )
}
const eN = ue(UT, [['render', ZT]]),
  tN = Ee({
    name: 'WelcomeDisplayPage',
    components: { AccountView: eN },
    data() {
      return {}
    },
    computed: {
      ...Ke(ml, ['status', 'errorObject']),
      isMobile() {
        const { sm: e, xs: t } = this.$vuetify.display
        return t || e
      }
    },
    methods: { ...Ye(ml, ['initial', 'showError', 'destroy']) },
    mounted() {
      const e = this.$route.query.token
      e ? this.initial({ token: e }) : this.$router.push({ name: 'InvalidRequestPage' })
    },
    unmounted() {
      this.destroy()
    },
    errorCaptured(e) {
      this.showError(e)
    }
  })
function nN(e, t, n, s, r, o) {
  const a = he('s-page-loading'),
    i = he('s-page-error'),
    u = he('account-view')
  return e.status === 'READY'
    ? (F(), G(a, { key: 0 }))
    : e.status === 'ERROR'
      ? (F(), G(i, { key: 1, error: e.errorObject }, null, 8, ['error']))
      : e.status === 'WORKING'
        ? (F(),
          G(
            dt,
            { key: 2, class: 'overflow-hidden' },
            {
              default: f(() => [
                l(
                  _,
                  { width: '100%', 'max-width': '480px', class: 'mx-auto text-left' },
                  {
                    default: f(() => [
                      l(
                        _,
                        { class: 'pa-4 text-center' },
                        {
                          default: f(() => [
                            l(lt, { src: e.$config.siteLogo, 'max-width': '360px', class: 'mx-auto' }, null, 8, ['src'])
                          ]),
                          _: 1
                        }
                      ),
                      l(u)
                    ]),
                    _: 1
                  }
                )
              ]),
              _: 1
            }
          ))
        : We('', !0)
}
const sN = ue(tN, [['render', nN]]),
  rN = MR({
    history: uR('/'),
    routes: [
      { path: '/', name: 'IndexPage', component: gA },
      { path: '/signin', name: 'SigninPage', component: HA },
      {
        path: '/welcome',
        name: 'WelcomePage',
        component: hT,
        children: [
          { path: '', name: 'WelcomeIndexPage', component: LT },
          { path: '/welcome/set-password', name: 'WelcomePasswordPage', component: BT }
        ]
      },
      { path: '/welcome/display', name: 'WelcomeDisplayPage', component: sN },
      {
        path: '/signup',
        name: 'SignupPage',
        component: qA,
        children: [
          { path: '', name: 'SignupRequestPage', component: s1 },
          { path: '/signup/verify-code', name: 'SignupVerifyPage', component: W1 }
        ]
      },
      { path: '/signup/set-password', name: 'SignupPasswordPage', component: Q1 },
      { path: '/signup/display', name: 'SignupDisplayPage', component: gI },
      {
        path: '/reset',
        name: 'ResetPage',
        component: yI,
        children: [
          { path: '', name: 'ResetRequestPage', component: II },
          { path: '/reset/verify-code', name: 'RestVerifyPage', component: xI }
        ]
      },
      { path: '/reset/new-password', name: 'RestPasswordPage', component: qI },
      { path: '/reset/display', name: 'RestDisplayPage', component: dT },
      { path: '/error', name: 'ErrorPage', component: tf },
      { path: '/system-error', name: 'SystemErrorPage', component: tf },
      { path: '/connect-error', name: 'ConnectErrorPage', component: AC },
      { path: '/authorize-error', name: 'AuthorizeErrorPage', component: VC },
      { path: '/access-denied', name: 'AccessDeniedPage', component: NC },
      { path: '/code-expired', name: 'CodeExpiredPage', component: bC },
      { path: '/invalid-request', name: 'InvalidRequestPage', component: kC },
      { path: '/duplicated-info', name: 'DuplicatedInfoPage', component: PC },
      { path: '/coming-soon', name: 'NotImplementedPage', component: UC },
      { path: '/:pathMatch(.*)*', name: 'NotFoundPage', component: _C }
    ]
  }),
  oN = {
    defaults: {
      global: { rounded: 'md' },
      VAvatar: { rounded: 'circle' },
      VAutocomplete: { variant: 'filled' },
      VBanner: { color: 'primary' },
      VBtn: { color: 'primary' },
      VCheckbox: { color: 'secondary' },
      VCombobox: { variant: 'filled' },
      VSelect: { variant: 'filled' },
      VSlider: { color: 'primary' },
      VTabs: { color: 'primary' },
      VTextarea: { variant: 'filled' },
      VTextField: { variant: 'filled' },
      VToolbar: { VBtn: { color: null } }
    },
    icons: { defaultSet: 'mdi', sets: { mdi: ag } },
    theme: {
      themes: {
        light: {
          colors: {
            primary: '#6200EE',
            'primary-darken-1': '#3700B3',
            secondary: '#03DAC6',
            'secondary-darken-1': '#018786',
            error: '#B00020'
          }
        }
      }
    }
  },
  hl = {
    '001': 1,
    AD: 1,
    AE: 6,
    AF: 6,
    AG: 0,
    AI: 1,
    AL: 1,
    AM: 1,
    AN: 1,
    AR: 1,
    AS: 0,
    AT: 1,
    AU: 1,
    AX: 1,
    AZ: 1,
    BA: 1,
    BD: 0,
    BE: 1,
    BG: 1,
    BH: 6,
    BM: 1,
    BN: 1,
    BR: 0,
    BS: 0,
    BT: 0,
    BW: 0,
    BY: 1,
    BZ: 0,
    CA: 0,
    CH: 1,
    CL: 1,
    CM: 1,
    CN: 1,
    CO: 0,
    CR: 1,
    CY: 1,
    CZ: 1,
    DE: 1,
    DJ: 6,
    DK: 1,
    DM: 0,
    DO: 0,
    DZ: 6,
    EC: 1,
    EE: 1,
    EG: 6,
    ES: 1,
    ET: 0,
    FI: 1,
    FJ: 1,
    FO: 1,
    FR: 1,
    GB: 1,
    'GB-alt-variant': 0,
    GE: 1,
    GF: 1,
    GP: 1,
    GR: 1,
    GT: 0,
    GU: 0,
    HK: 0,
    HN: 0,
    HR: 1,
    HU: 1,
    ID: 0,
    IE: 1,
    IL: 0,
    IN: 0,
    IQ: 6,
    IR: 6,
    IS: 1,
    IT: 1,
    JM: 0,
    JO: 6,
    JP: 0,
    KE: 0,
    KG: 1,
    KH: 0,
    KR: 0,
    KW: 6,
    KZ: 1,
    LA: 0,
    LB: 1,
    LI: 1,
    LK: 1,
    LT: 1,
    LU: 1,
    LV: 1,
    LY: 6,
    MC: 1,
    MD: 1,
    ME: 1,
    MH: 0,
    MK: 1,
    MM: 0,
    MN: 1,
    MO: 0,
    MQ: 1,
    MT: 0,
    MV: 5,
    MX: 0,
    MY: 1,
    MZ: 0,
    NI: 0,
    NL: 1,
    NO: 1,
    NP: 0,
    NZ: 1,
    OM: 6,
    PA: 0,
    PE: 0,
    PH: 0,
    PK: 0,
    PL: 1,
    PR: 0,
    PT: 0,
    PY: 0,
    QA: 6,
    RE: 1,
    RO: 1,
    RS: 1,
    RU: 1,
    SA: 0,
    SD: 6,
    SE: 1,
    SG: 0,
    SI: 1,
    SK: 1,
    SM: 1,
    SV: 0,
    SY: 6,
    TH: 0,
    TJ: 1,
    TM: 1,
    TR: 1,
    TT: 0,
    TW: 0,
    UA: 1,
    UM: 0,
    US: 0,
    UY: 1,
    UZ: 1,
    VA: 1,
    VE: 0,
    VI: 0,
    VN: 1,
    WS: 0,
    XK: 1,
    YE: 0,
    ZA: 0,
    ZW: 0
  }
function aN(e, t) {
  const n = []
  let s = []
  const r = Wg(e),
    o = Hg(e),
    a = (r.getDay() - hl[t.slice(-2).toUpperCase()] + 7) % 7,
    i = (o.getDay() - hl[t.slice(-2).toUpperCase()] + 7) % 7
  for (let u = 0; u < a; u++) {
    const c = new Date(r)
    ;(c.setDate(c.getDate() - (a - u)), s.push(c))
  }
  for (let u = 1; u <= o.getDate(); u++) {
    const c = new Date(e.getFullYear(), e.getMonth(), u)
    ;(s.push(c), s.length === 7 && (n.push(s), (s = [])))
  }
  for (let u = 1; u < 7 - i; u++) {
    const c = new Date(o)
    ;(c.setDate(c.getDate() + u), s.push(c))
  }
  return (s.length > 0 && n.push(s), n)
}
function iN(e) {
  const t = new Date(e)
  for (; t.getDay() !== 0; ) t.setDate(t.getDate() - 1)
  return t
}
function lN(e) {
  const t = new Date(e)
  for (; t.getDay() !== 6; ) t.setDate(t.getDate() + 1)
  return t
}
function Wg(e) {
  return new Date(e.getFullYear(), e.getMonth(), 1)
}
function Hg(e) {
  return new Date(e.getFullYear(), e.getMonth() + 1, 0)
}
function uN(e) {
  const t = e.split('-').map(Number)
  return new Date(t[0], t[1] - 1, t[2])
}
const cN = /^([12]\d{3}-([1-9]|0[1-9]|1[0-2])-([1-9]|0[1-9]|[12]\d|3[01]))$/
function jg(e) {
  if (e == null) return new Date()
  if (e instanceof Date) return e
  if (typeof e == 'string') {
    let t
    if (cN.test(e)) return uN(e)
    if (((t = Date.parse(e)), !isNaN(t))) return new Date(t)
  }
  return null
}
const ff = new Date(2e3, 0, 2)
function dN(e) {
  const t = hl[e.slice(-2).toUpperCase()]
  return Ws(7).map(n => {
    const s = new Date(ff)
    return (s.setDate(ff.getDate() + t + n), new Intl.DateTimeFormat(e, { weekday: 'narrow' }).format(s))
  })
}
function fN(e, t, n, s) {
  const r = jg(e) ?? new Date(),
    o = s == null ? void 0 : s[t]
  if (typeof o == 'function') return o(r, t, n)
  let a = {}
  switch (t) {
    case 'fullDateWithWeekday':
      a = { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' }
      break
    case 'hours12h':
      a = { hour: 'numeric', hour12: !0 }
      break
    case 'normalDateWithWeekday':
      a = { weekday: 'short', day: 'numeric', month: 'short' }
      break
    case 'keyboardDate':
      a = { day: '2-digit', month: '2-digit', year: 'numeric' }
      break
    case 'monthAndDate':
      a = { month: 'long', day: 'numeric' }
      break
    case 'monthAndYear':
      a = { month: 'long', year: 'numeric' }
      break
    case 'month':
      a = { month: 'long' }
      break
    case 'monthShort':
      a = { month: 'short' }
      break
    case 'dayOfMonth':
      return new Intl.NumberFormat(n).format(r.getDate())
    case 'shortDate':
      a = { year: '2-digit', month: 'numeric', day: 'numeric' }
      break
    case 'weekdayShort':
      a = { weekday: 'short' }
      break
    case 'year':
      a = { year: 'numeric' }
      break
    default:
      a = o ?? { timeZone: 'UTC', timeZoneName: 'short' }
  }
  return new Intl.DateTimeFormat(n, a).format(r)
}
function mN(e, t) {
  const n = e.toJsDate(t),
    s = n.getFullYear(),
    r = Cd(String(n.getMonth() + 1), 2, '0'),
    o = Cd(String(n.getDate()), 2, '0')
  return `${s}-${r}-${o}`
}
function hN(e) {
  const [t, n, s] = e.split('-').map(Number)
  return new Date(t, n - 1, s)
}
function gN(e, t) {
  const n = new Date(e)
  return (n.setMinutes(n.getMinutes() + t), n)
}
function pN(e, t) {
  const n = new Date(e)
  return (n.setHours(n.getHours() + t), n)
}
function EN(e, t) {
  const n = new Date(e)
  return (n.setDate(n.getDate() + t), n)
}
function _N(e, t) {
  const n = new Date(e)
  return (n.setDate(n.getDate() + t * 7), n)
}
function yN(e, t) {
  const n = new Date(e)
  return (n.setMonth(n.getMonth() + t), n)
}
function vN(e) {
  return e.getFullYear()
}
function bN(e) {
  return e.getMonth()
}
function SN(e) {
  return new Date(e.getFullYear(), e.getMonth() + 1, 1)
}
function RN(e) {
  return e.getHours()
}
function ON(e) {
  return e.getMinutes()
}
function CN(e) {
  return new Date(e.getFullYear(), 0, 1)
}
function AN(e) {
  return new Date(e.getFullYear(), 11, 31)
}
function IN(e, t) {
  return gl(e, t[0]) && NN(e, t[1])
}
function TN(e) {
  const t = new Date(e)
  return t instanceof Date && !isNaN(t.getTime())
}
function gl(e, t) {
  return e.getTime() > t.getTime()
}
function NN(e, t) {
  return e.getTime() < t.getTime()
}
function mf(e, t) {
  return e.getTime() === t.getTime()
}
function wN(e, t) {
  return e.getDate() === t.getDate() && e.getMonth() === t.getMonth() && e.getFullYear() === t.getFullYear()
}
function LN(e, t) {
  return e.getMonth() === t.getMonth() && e.getFullYear() === t.getFullYear()
}
function PN(e, t, n) {
  const s = new Date(e),
    r = new Date(t)
  switch (n) {
    case 'years':
      return s.getFullYear() - r.getFullYear()
    case 'quarters':
      return Math.floor((s.getMonth() - r.getMonth() + (s.getFullYear() - r.getFullYear()) * 12) / 4)
    case 'months':
      return s.getMonth() - r.getMonth() + (s.getFullYear() - r.getFullYear()) * 12
    case 'weeks':
      return Math.floor((s.getTime() - r.getTime()) / (1e3 * 60 * 60 * 24 * 7))
    case 'days':
      return Math.floor((s.getTime() - r.getTime()) / (1e3 * 60 * 60 * 24))
    case 'hours':
      return Math.floor((s.getTime() - r.getTime()) / (1e3 * 60 * 60))
    case 'minutes':
      return Math.floor((s.getTime() - r.getTime()) / (1e3 * 60))
    case 'seconds':
      return Math.floor((s.getTime() - r.getTime()) / 1e3)
    default:
      return s.getTime() - r.getTime()
  }
}
function $N(e, t) {
  const n = new Date(e)
  return (n.setHours(t), n)
}
function MN(e, t) {
  const n = new Date(e)
  return (n.setMinutes(t), n)
}
function kN(e, t) {
  const n = new Date(e)
  return (n.setMonth(t), n)
}
function DN(e, t) {
  const n = new Date(e)
  return (n.setFullYear(t), n)
}
function FN(e) {
  return new Date(e.getFullYear(), e.getMonth(), e.getDate())
}
function VN(e) {
  return new Date(e.getFullYear(), e.getMonth(), e.getDate(), 23, 59, 59, 999)
}
class xN {
  constructor(t) {
    ;((this.locale = t.locale), (this.formats = t.formats))
  }
  date(t) {
    return jg(t)
  }
  toJsDate(t) {
    return t
  }
  toISO(t) {
    return mN(this, t)
  }
  parseISO(t) {
    return hN(t)
  }
  addMinutes(t, n) {
    return gN(t, n)
  }
  addHours(t, n) {
    return pN(t, n)
  }
  addDays(t, n) {
    return EN(t, n)
  }
  addWeeks(t, n) {
    return _N(t, n)
  }
  addMonths(t, n) {
    return yN(t, n)
  }
  getWeekArray(t) {
    return aN(t, this.locale)
  }
  startOfWeek(t) {
    return iN(t)
  }
  endOfWeek(t) {
    return lN(t)
  }
  startOfMonth(t) {
    return Wg(t)
  }
  endOfMonth(t) {
    return Hg(t)
  }
  format(t, n) {
    return fN(t, n, this.locale, this.formats)
  }
  isEqual(t, n) {
    return mf(t, n)
  }
  isValid(t) {
    return TN(t)
  }
  isWithinRange(t, n) {
    return IN(t, n)
  }
  isAfter(t, n) {
    return gl(t, n)
  }
  isBefore(t, n) {
    return !gl(t, n) && !mf(t, n)
  }
  isSameDay(t, n) {
    return wN(t, n)
  }
  isSameMonth(t, n) {
    return LN(t, n)
  }
  setMinutes(t, n) {
    return MN(t, n)
  }
  setHours(t, n) {
    return $N(t, n)
  }
  setMonth(t, n) {
    return kN(t, n)
  }
  setYear(t, n) {
    return DN(t, n)
  }
  getDiff(t, n, s) {
    return PN(t, n, s)
  }
  getWeekdays() {
    return dN(this.locale)
  }
  getYear(t) {
    return vN(t)
  }
  getMonth(t) {
    return bN(t)
  }
  getNextMonth(t) {
    return SN(t)
  }
  getHours(t) {
    return RN(t)
  }
  getMinutes(t) {
    return ON(t)
  }
  startOfDay(t) {
    return FN(t)
  }
  endOfDay(t) {
    return VN(t)
  }
  startOfYear(t) {
    return CN(t)
  }
  endOfYear(t) {
    return AN(t)
  }
}
const BN = Symbol.for('vuetify:date-options'),
  hf = Symbol.for('vuetify:date-adapter')
function UN(e, t) {
  const n = Xt(
    {
      adapter: xN,
      locale: {
        af: 'af-ZA',
        bg: 'bg-BG',
        ca: 'ca-ES',
        ckb: '',
        cs: 'cs-CZ',
        de: 'de-DE',
        el: 'el-GR',
        en: 'en-US',
        et: 'et-EE',
        fa: 'fa-IR',
        fi: 'fi-FI',
        hr: 'hr-HR',
        hu: 'hu-HU',
        he: 'he-IL',
        id: 'id-ID',
        it: 'it-IT',
        ja: 'ja-JP',
        ko: 'ko-KR',
        lv: 'lv-LV',
        lt: 'lt-LT',
        nl: 'nl-NL',
        no: 'no-NO',
        pl: 'pl-PL',
        pt: 'pt-PT',
        ro: 'ro-RO',
        ru: 'ru-RU',
        sk: 'sk-SK',
        sl: 'sl-SI',
        srCyrl: 'sr-SP',
        srLatn: 'sr-SP',
        sv: 'sv-SE',
        th: 'th-TH',
        tr: 'tr-TR',
        az: 'az-AZ',
        uk: 'uk-UA',
        vi: 'vi-VN',
        zhHans: 'zh-CN',
        zhHant: 'zh-TW'
      }
    },
    e
  )
  return { options: n, instance: GN(n, t) }
}
function GN(e, t) {
  const n = At(
    typeof e.adapter == 'function'
      ? new e.adapter({ locale: e.locale[t.current.value] ?? t.current.value, formats: e.formats })
      : e.adapter
  )
  return (
    be(t.current, s => {
      n.locale = e.locale[s] ?? s ?? n.locale
    }),
    n
  )
}
const WN = Symbol.for('vuetify:goto')
function HN() {
  return {
    container: void 0,
    duration: 300,
    layout: !1,
    offset: 0,
    easing: 'easeInOutCubic',
    patterns: {
      linear: e => e,
      easeInQuad: e => e ** 2,
      easeOutQuad: e => e * (2 - e),
      easeInOutQuad: e => (e < 0.5 ? 2 * e ** 2 : -1 + (4 - 2 * e) * e),
      easeInCubic: e => e ** 3,
      easeOutCubic: e => (--e) ** 3 + 1,
      easeInOutCubic: e => (e < 0.5 ? 4 * e ** 3 : (e - 1) * (2 * e - 2) * (2 * e - 2) + 1),
      easeInQuart: e => e ** 4,
      easeOutQuart: e => 1 - (--e) ** 4,
      easeInOutQuart: e => (e < 0.5 ? 8 * e ** 4 : 1 - 8 * (--e) ** 4),
      easeInQuint: e => e ** 5,
      easeOutQuint: e => 1 + (--e) ** 5,
      easeInOutQuint: e => (e < 0.5 ? 16 * e ** 5 : 1 + 16 * (--e) ** 5)
    }
  }
}
function jN(e, t) {
  return { rtl: t.isRtl, options: Xt(HN(), e) }
}
const fa = Symbol.for('vuetify:layout'),
  Yg = Symbol.for('vuetify:layout-item'),
  gf = 1e3,
  YN = ie({ overlaps: { type: Array, default: () => [] }, fullHeight: Boolean }, 'layout'),
  KN = ie({ name: { type: String }, order: { type: [Number, String], default: 0 }, absolute: Boolean }, 'layout-item')
function qN() {
  const e = it(fa)
  if (!e) throw new Error('[Vuetify] Could not find injected layout')
  return { getLayoutItem: e.getLayoutItem, mainRect: e.mainRect, mainStyles: e.mainStyles }
}
function zN(e) {
  const t = it(fa)
  if (!t) throw new Error('[Vuetify] Could not find injected layout')
  const n = e.id ?? `layout-item-${An()}`,
    s = Tt('useLayoutItem')
  Ut(Yg, { id: n })
  const r = je(!1)
  ;(im(() => (r.value = !0)), am(() => (r.value = !1)))
  const { layoutItemStyles: o, layoutItemScrimStyles: a } = t.register(s, {
    ...e,
    active: M(() => (r.value ? !1 : e.active.value)),
    id: n
  })
  return (Sn(() => t.unregister(n)), { layoutItemStyles: o, layoutRect: t.layoutRect, layoutItemScrimStyles: a })
}
const XN = (e, t, n, s) => {
  let r = { top: 0, left: 0, right: 0, bottom: 0 }
  const o = [{ id: '', layer: { ...r } }]
  for (const a of e) {
    const i = t.get(a),
      u = n.get(a),
      c = s.get(a)
    if (!i || !u || !c) continue
    const d = { ...r, [i.value]: parseInt(r[i.value], 10) + (c.value ? parseInt(u.value, 10) : 0) }
    ;(o.push({ id: a, layer: d }), (r = d))
  }
  return o
}
function JN(e) {
  const t = it(fa, null),
    n = M(() => (t ? t.rootZIndex.value - 100 : gf)),
    s = _e([]),
    r = At(new Map()),
    o = At(new Map()),
    a = At(new Map()),
    i = At(new Map()),
    u = At(new Map()),
    { resizeRef: c, contentRect: d } = Ga(),
    m = M(() => {
      const L = new Map(),
        N = e.overlaps ?? []
      for (const A of N.filter(w => w.includes(':'))) {
        const [w, B] = A.split(':')
        if (!s.value.includes(w) || !s.value.includes(B)) continue
        const j = r.get(w),
          D = r.get(B),
          U = o.get(w),
          X = o.get(B)
        !j ||
          !D ||
          !U ||
          !X ||
          (L.set(B, { position: j.value, amount: parseInt(U.value, 10) }),
          L.set(w, { position: D.value, amount: -parseInt(X.value, 10) }))
      }
      return L
    }),
    h = M(() => {
      const L = [...new Set([...a.values()].map(A => A.value))].sort((A, w) => A - w),
        N = []
      for (const A of L) {
        const w = s.value.filter(B => {
          var j
          return ((j = a.get(B)) == null ? void 0 : j.value) === A
        })
        N.push(...w)
      }
      return XN(N, r, o, i)
    }),
    E = M(() => !Array.from(u.values()).some(L => L.value)),
    y = M(() => h.value[h.value.length - 1].layer),
    v = M(() => ({
      '--v-layout-left': Te(y.value.left),
      '--v-layout-right': Te(y.value.right),
      '--v-layout-top': Te(y.value.top),
      '--v-layout-bottom': Te(y.value.bottom),
      ...(E.value ? void 0 : { transition: 'none' })
    })),
    I = M(() =>
      h.value.slice(1).map((L, N) => {
        let { id: A } = L
        const { layer: w } = h.value[N],
          B = o.get(A),
          j = r.get(A)
        return { id: A, ...w, size: Number(B.value), position: j.value }
      })
    ),
    b = L => I.value.find(N => N.id === L),
    O = Tt('createLayout'),
    P = je(!1)
  ;(xn(() => {
    P.value = !0
  }),
    Ut(fa, {
      register: (L, N) => {
        let {
          id: A,
          order: w,
          position: B,
          layoutSize: j,
          elementSize: D,
          active: U,
          disableTransitions: X,
          absolute: ge
        } = N
        ;(a.set(A, w), r.set(A, B), o.set(A, j), i.set(A, U), X && u.set(A, X))
        const fe = Mr(Yg, O == null ? void 0 : O.vnode).indexOf(L)
        fe > -1 ? s.value.splice(fe, 0, A) : s.value.push(A)
        const ce = M(() => I.value.findIndex(xe => xe.id === A)),
          ke = M(() => n.value + h.value.length * 2 - ce.value * 2),
          ze = M(() => {
            const xe = B.value === 'left' || B.value === 'right',
              Le = B.value === 'right',
              et = B.value === 'bottom',
              bt = {
                [B.value]: 0,
                zIndex: ke.value,
                transform: `translate${xe ? 'X' : 'Y'}(${(U.value ? 0 : -110) * (Le || et ? -1 : 1)}%)`,
                position: ge.value || n.value !== gf ? 'absolute' : 'fixed',
                ...(E.value ? void 0 : { transition: 'none' })
              }
            if (!P.value) return bt
            const Fe = I.value[ce.value]
            if (!Fe) throw new Error(`[Vuetify] Could not find layout item "${A}"`)
            const H = m.value.get(A)
            return (
              H && (Fe[H.position] += H.amount),
              {
                ...bt,
                height: xe ? `calc(100% - ${Fe.top}px - ${Fe.bottom}px)` : D.value ? `${D.value}px` : void 0,
                left: Le ? void 0 : `${Fe.left}px`,
                right: Le ? `${Fe.right}px` : void 0,
                top: B.value !== 'bottom' ? `${Fe.top}px` : void 0,
                bottom: B.value !== 'top' ? `${Fe.bottom}px` : void 0,
                width: xe ? (D.value ? `${D.value}px` : void 0) : `calc(100% - ${Fe.left}px - ${Fe.right}px)`
              }
            )
          }),
          Ie = M(() => ({ zIndex: ke.value - 1 }))
        return { layoutItemStyles: ze, layoutItemScrimStyles: Ie, zIndex: ke }
      },
      unregister: L => {
        ;(a.delete(L), r.delete(L), o.delete(L), i.delete(L), u.delete(L), (s.value = s.value.filter(N => N !== L)))
      },
      mainRect: y,
      mainStyles: v,
      getLayoutItem: b,
      items: I,
      layoutRect: d,
      rootZIndex: n
    }))
  const T = M(() => ['v-layout', { 'v-layout--full-height': e.fullHeight }]),
    $ = M(() => ({ zIndex: t ? n.value : void 0, position: t ? 'relative' : void 0, overflow: t ? 'hidden' : void 0 }))
  return { layoutClasses: T, layoutStyles: $, getLayoutItem: b, items: I, layoutRect: d, layoutRef: c }
}
function Kg() {
  let e = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : {}
  const { blueprint: t, ...n } = e,
    s = Xt(t, n),
    { aliases: r = {}, components: o = {}, directives: a = {} } = s,
    i = hO(s.defaults),
    u = cC(s.display, s.ssr),
    c = AO(s.theme),
    d = VO(s.icons),
    m = jO(s.locale),
    h = UN(s.date, m),
    E = jN(s.goTo, m)
  return {
    install: v => {
      for (const I in a) v.directive(I, a[I])
      for (const I in o) v.component(I, o[I])
      for (const I in r) v.component(I, io({ ...r[I], name: I, aliasName: r[I].name }))
      if (
        (c.install(v),
        v.provide(or, i),
        v.provide(ll, u),
        v.provide(oa, c),
        v.provide(ol, d),
        v.provide(aa, m),
        v.provide(BN, h.options),
        v.provide(hf, h.instance),
        v.provide(WN, E),
        ut && s.ssr)
      )
        if (v.$nuxt)
          v.$nuxt.hook('app:suspense:resolve', () => {
            u.update()
          })
        else {
          const { mount: I } = v
          v.mount = function () {
            const b = I(...arguments)
            return (Et(() => u.update()), (v.mount = I), b)
          }
        }
      ;(An.reset(),
        v.mixin({
          computed: {
            $vuetify() {
              return At({
                defaults: xs.call(this, or),
                display: xs.call(this, ll),
                theme: xs.call(this, oa),
                icons: xs.call(this, ol),
                locale: xs.call(this, aa),
                date: xs.call(this, hf)
              })
            }
          }
        }))
    },
    defaults: i,
    display: u,
    theme: c,
    icons: d,
    locale: m,
    date: h,
    goTo: E
  }
}
const QN = '3.5.9'
Kg.version = QN
function xs(e) {
  var s, r
  const t = this.$,
    n = ((s = t.parent) == null ? void 0 : s.provides) ?? ((r = t.vnode.appContext) == null ? void 0 : r.provides)
  if (n && e in n) return n[e]
}
function Si(e, t, n) {
  const s = Nt(e, t)
  return (
    (s.value = e[t] ?? n.value),
    be(n, r => {
      e[t] == null && (s.value = r)
    }),
    s
  )
}
function qg(e) {
  return t => {
    const n = Si(t, 'locale', e.current),
      s = Si(t, 'fallback', e.fallback),
      r = Si(t, 'messages', e.messages),
      o = e.useI18n({
        locale: n.value,
        fallbackLocale: s.value,
        messages: r.value,
        useScope: 'local',
        legacy: !1,
        inheritLocale: !1
      })
    return (
      be(n, a => {
        o.locale.value = a
      }),
      {
        name: 'vue-i18n',
        current: n,
        fallback: s,
        messages: r,
        t: function (a) {
          for (var i = arguments.length, u = new Array(i > 1 ? i - 1 : 0), c = 1; c < i; c++) u[c - 1] = arguments[c]
          return o.t(a, u)
        },
        n: o.n,
        provide: qg({ current: n, fallback: s, messages: r, useI18n: e.useI18n })
      }
    )
  }
}
function ZN(e) {
  let { i18n: t, useI18n: n } = e
  const s = t.global.locale,
    r = t.global.fallbackLocale,
    o = t.global.messages
  return {
    name: 'vue-i18n',
    current: s,
    fallback: r,
    messages: o,
    t: function (a) {
      for (var i = arguments.length, u = new Array(i > 1 ? i - 1 : 0), c = 1; c < i; c++) u[c - 1] = arguments[c]
      return t.global.t(a, u)
    },
    n: t.global.n,
    provide: qg({ current: s, fallback: r, messages: o, useI18n: n })
  }
}
const ew = {
    dark: !1,
    colors: {
      primary: '#1167b4',
      secondary: '#653a96',
      highlight: '#dd0000',
      accent: '#039BE5',
      error: '#FF5252',
      info: '#2196F3',
      success: '#4CAF50',
      warning: '#EF6C00',
      label: '#546E7A',
      surface: '#FFFFFF',
      background: '#F5F5F5',
      save: '#1167b4',
      submit: '#1167b4',
      cancel: '#795548',
      confirm: '#dd0000',
      reject: '#795548',
      close: '#1167b4',
      ready: '#607D8B',
      active: '#4CAF50',
      hidden: '#EF6C00',
      locked: '#FF5252',
      pinned: '#653a96',
      default: '#653a96',
      children: '#3F51B5'
    }
  },
  tw = {
    global: {},
    VSheet: { elevation: 0, color: 'transparent' },
    VCard: { elevation: 0 },
    VBtn: { elevation: 0, color: 'primary' },
    VTextField: { density: 'compact', variant: 'outlined', color: 'primary', bgColor: 'white' },
    VRadioGroup: { color: 'primary', bgColor: 'white' },
    VTextarea: { color: 'primary', bgColor: 'white' },
    VSnackbar: { bgColor: 'white', background: 'white' }
  },
  nw = Kg({
    blueprint: oN,
    defaults: tw,
    theme: { defaultTheme: 'myCustomLightTheme', themes: { myCustomLightTheme: ew } },
    locale: { adapter: ZN({ i18n: Zl, useI18n: Da }) }
  })
let Su = !1
const pf = `${window.location.protocol}//${window.location.host}`
pf.indexOf('localhost:517') > -1
  ? ((Oe.defaults.baseURL = 'http://localhost:6070'), (Oe.defaults.withCredentials = !1), (Su = !0))
  : (Oe.defaults.baseURL = pf)
console.log(`Development: ${Su}`)
console.log(`Base URL: ${Oe.defaults.baseURL}`)
Oe.interceptors.request.use(
  e => {
    var t, n, s, r, o
    return (
      (t = appInitialData == null ? void 0 : appInitialData.setting) != null &&
        t.timezone &&
        (e.headers.timezone =
          (n = appInitialData == null ? void 0 : appInitialData.setting) == null ? void 0 : n.timezone),
      (s = appInitialData == null ? void 0 : appInitialData.setting) != null &&
        s.lang &&
        (e.headers.lang = (r = appInitialData == null ? void 0 : appInitialData.setting) == null ? void 0 : r.lang),
      Su &&
        (o = appInitialData.auth) != null &&
        o.token &&
        (e.headers.Authorization = `Bearer ${appInitialData.auth.token}`),
      e
    )
  },
  e => (console.error(e), Promise.reject(e))
)
Oe.interceptors.response.use(
  e => e,
  e => {
    var t, n, s
    if (((t = e == null ? void 0 : e.response) == null ? void 0 : t.status) === 401)
      window.location.href = '/session-timeout'
    else if (((n = e == null ? void 0 : e.response) == null ? void 0 : n.status) === 403)
      window.location.href = '/access-denied'
    else if (((s = e == null ? void 0 : e.response) == null ? void 0 : s.status) === 423)
      window.location.href = '/account-locked'
    else return Promise.reject(e)
  }
)
const sw = ie(
    {
      fullscreen: Boolean,
      retainFocus: { type: Boolean, default: !0 },
      scrollable: Boolean,
      ...bu({ origin: 'center center', scrollStrategy: 'block', transition: { component: RA }, zIndex: 2400 })
    },
    'VDialog'
  ),
  $t = Ae()({
    name: 'VDialog',
    props: sw(),
    emits: { 'update:modelValue': e => !0 },
    setup(e, t) {
      let { slots: n } = t
      const s = Nt(e, 'modelValue'),
        { scopeId: r } = vu(),
        o = _e()
      function a(u) {
        var m, h
        const c = u.relatedTarget,
          d = u.target
        if (
          c !== d &&
          (m = o.value) != null &&
          m.contentEl &&
          (h = o.value) != null &&
          h.globalTop &&
          ![document, o.value.contentEl].includes(d) &&
          !o.value.contentEl.contains(d)
        ) {
          const E = Yh(o.value.contentEl)
          if (!E.length) return
          const y = E[0],
            v = E[E.length - 1]
          c === y ? v.focus() : y.focus()
        }
      }
      ;(ut &&
        be(
          () => s.value && e.retainFocus,
          u => {
            u ? document.addEventListener('focusin', a) : document.removeEventListener('focusin', a)
          },
          { immediate: !0 }
        ),
        be(s, async u => {
          var c, d
          ;(await Et(),
            u
              ? (c = o.value.contentEl) == null || c.focus({ preventScroll: !0 })
              : (d = o.value.activatorEl) == null || d.focus({ preventScroll: !0 }))
        }))
      const i = M(() => Ge({ 'aria-haspopup': 'dialog', 'aria-expanded': String(s.value) }, e.activatorProps))
      return (
        Ve(() => {
          const u = no.filterProps(e)
          return l(
            no,
            Ge(
              {
                ref: o,
                class: [
                  'v-dialog',
                  { 'v-dialog--fullscreen': e.fullscreen, 'v-dialog--scrollable': e.scrollable },
                  e.class
                ],
                style: e.style
              },
              u,
              {
                modelValue: s.value,
                'onUpdate:modelValue': c => (s.value = c),
                'aria-modal': 'true',
                activatorProps: i.value,
                role: 'dialog'
              },
              r
            ),
            {
              activator: n.activator,
              default: function () {
                for (var c = arguments.length, d = new Array(c), m = 0; m < c; m++) d[m] = arguments[m]
                return l(
                  dn,
                  { root: 'VDialog' },
                  {
                    default: () => {
                      var h
                      return [(h = n.default) == null ? void 0 : h.call(n, ...d)]
                    }
                  }
                )
              }
            }
          )
        }),
        ja({}, o)
      )
    }
  }),
  rw = Ee({
    name: 'SErrorDialog',
    props: {
      modelValue: { type: Boolean, default: !1 },
      error: { type: [Object, String, Number, Array, Boolean], required: !1 }
    },
    emits: ['update:modelValue', 'close'],
    computed: {
      dialog: {
        get() {
          return this.modelValue
        },
        set(e) {
          this.$emit('update:modelValue', e)
        }
      }
    },
    methods: {
      onClickClose() {
        ;(this.$emit('close'), (this.dialog = !1))
      }
    },
    mounted() {
      typeof this.error == 'object' && console.error(this.error)
    }
  }),
  ow = { key: 0 },
  aw = { key: 1 },
  iw = { class: 'mb-2' },
  lw = { class: 'mb-2' }
function uw(e, t, n, s, r, o) {
  return (
    F(),
    G(
      $t,
      {
        modelValue: e.dialog,
        'onUpdate:modelValue': t[0] || (t[0] = a => (e.dialog = a)),
        persistent: '',
        'max-width': '420'
      },
      {
        default: f(() => [
          l(
            we,
            { class: 'border pa-1' },
            {
              default: f(() => [
                l(
                  wg,
                  { class: 'text-h5 text-error' },
                  {
                    default: f(() => {
                      var a
                      return [
                        `${(a = e.error) == null ? void 0 : a.code}` == '403'
                          ? (F(), Ne('span', ow, S(e.$t('COMMON.ERROR_FORBIDDEN.TITLE')), 1))
                          : (F(), Ne('span', aw, S(e.$t('COMMON.ERROR_SYSTEM_ERROR.TITLE')), 1))
                      ]
                    }),
                    _: 1
                  }
                ),
                l(
                  Lg,
                  { class: 'px-3 text-body-1' },
                  {
                    default: f(() => {
                      var a
                      return [
                        `${(a = e.error) == null ? void 0 : a.code}` == '403'
                          ? (F(),
                            Ne(
                              Ue,
                              { key: 0 },
                              [
                                C('p', iw, S(e.$t('COMMON.ERROR_FORBIDDEN.LABEL1')), 1),
                                C('p', null, S(e.$t('COMMON.ERROR_FORBIDDEN.LABEL2')), 1)
                              ],
                              64
                            ))
                          : (F(),
                            Ne(
                              Ue,
                              { key: 1 },
                              [
                                C('p', lw, S(e.$t('COMMON.ERROR_SYSTEM_ERROR.LABEL1')), 1),
                                C('p', null, S(e.$t('COMMON.ERROR_SYSTEM_ERROR.LABEL2')), 1)
                              ],
                              64
                            ))
                      ]
                    }),
                    _: 1
                  }
                ),
                l(Ng, null, {
                  default: f(() => [
                    l(Ft),
                    l(
                      ae,
                      { variant: 'tonal', size: 'small', color: 'accent', onClick: e.onClickClose },
                      { default: f(() => [ee(S(e.$t('COMMON.ACTION.CLOSE')), 1)]), _: 1 },
                      8,
                      ['onClick']
                    )
                  ]),
                  _: 1
                })
              ]),
              _: 1
            }
          )
        ]),
        _: 1
      },
      8,
      ['modelValue']
    )
  )
}
const cw = ue(rw, [['render', uw]])
function dw(e) {
  const t = je(e)
  let n = -1
  function s() {
    clearInterval(n)
  }
  function r() {
    ;(s(), Et(() => (t.value = e)))
  }
  function o(a) {
    const i = a ? getComputedStyle(a) : { transitionDuration: 0.2 },
      u = parseFloat(i.transitionDuration) * 1e3 || 200
    if ((s(), t.value <= 0)) return
    const c = performance.now()
    n = window.setInterval(() => {
      const d = performance.now() - c + u
      ;((t.value = Math.max(e - d, 0)), t.value <= 0 && s())
    }, u)
  }
  return (Ht(s), { clear: s, time: t, start: o, reset: r })
}
const fw = ie(
    {
      multiLine: Boolean,
      text: String,
      timer: [Boolean, String],
      timeout: { type: [Number, String], default: 5e3 },
      vertical: Boolean,
      ...Er({ location: 'bottom' }),
      ...go(),
      ...ln(),
      ...Ps(),
      ...Ot(),
      ...su(bu({ transition: 'v-snackbar-transition' }), ['persistent', 'noClickAnimation', 'scrim', 'scrollStrategy'])
    },
    'VSnackbar'
  ),
  mw = Ae()({
    name: 'VSnackbar',
    props: fw(),
    emits: { 'update:modelValue': e => !0 },
    setup(e, t) {
      let { slots: n } = t
      const s = Nt(e, 'modelValue'),
        { locationStyles: r } = _r(e),
        { positionClasses: o } = po(e),
        { scopeId: a } = vu(),
        { themeClasses: i } = Pt(e),
        { colorClasses: u, colorStyles: c, variantClasses: d } = fo(e),
        { roundedClasses: m } = mn(e),
        h = dw(Number(e.timeout)),
        E = _e(),
        y = _e(),
        v = je(!1)
      ;(be(s, b),
        be(() => e.timeout, b),
        xn(() => {
          s.value && b()
        }))
      let I = -1
      function b() {
        ;(h.reset(), window.clearTimeout(I))
        const $ = Number(e.timeout)
        if (!s.value || $ === -1) return
        const L = Qr(y.value)
        ;(h.start(L),
          (I = window.setTimeout(() => {
            s.value = !1
          }, $)))
      }
      function O() {
        ;(h.reset(), window.clearTimeout(I))
      }
      function P() {
        ;((v.value = !0), O())
      }
      function T() {
        ;((v.value = !1), b())
      }
      return (
        Ve(() => {
          const $ = no.filterProps(e),
            L = !!(n.default || n.text || e.text)
          return l(
            no,
            Ge(
              {
                ref: E,
                class: [
                  'v-snackbar',
                  {
                    'v-snackbar--active': s.value,
                    'v-snackbar--multi-line': e.multiLine && !e.vertical,
                    'v-snackbar--timer': !!e.timer,
                    'v-snackbar--vertical': e.vertical
                  },
                  o.value,
                  e.class
                ],
                style: e.style
              },
              $,
              {
                modelValue: s.value,
                'onUpdate:modelValue': N => (s.value = N),
                contentProps: Ge(
                  {
                    class: ['v-snackbar__wrapper', i.value, u.value, m.value, d.value],
                    style: [r.value, c.value],
                    onPointerenter: P,
                    onPointerleave: T
                  },
                  $.contentProps
                ),
                persistent: !0,
                noClickAnimation: !0,
                scrim: !1,
                scrollStrategy: 'none',
                _disableGlobalStack: !0
              },
              a
            ),
            {
              default: () => {
                var N, A
                return [
                  co(!1, 'v-snackbar'),
                  e.timer &&
                    !v.value &&
                    l('div', { key: 'timer', class: 'v-snackbar__timer' }, [
                      l(
                        mg,
                        {
                          ref: y,
                          color: typeof e.timer == 'string' ? e.timer : 'info',
                          max: e.timeout,
                          'model-value': h.time.value
                        },
                        null
                      )
                    ]),
                  L &&
                    l('div', { key: 'content', class: 'v-snackbar__content', role: 'status', 'aria-live': 'polite' }, [
                      ((N = n.text) == null ? void 0 : N.call(n)) ?? e.text,
                      (A = n.default) == null ? void 0 : A.call(n)
                    ]),
                  n.actions &&
                    l(
                      dn,
                      { defaults: { VBtn: { variant: 'text', ripple: !1, slim: !0 } } },
                      { default: () => [l('div', { class: 'v-snackbar__actions' }, [n.actions()])] }
                    )
                ]
              },
              activator: n.activator
            }
          )
        }),
        ja({}, E)
      )
    }
  }),
  hw = Ee({
    name: 'Snackbar',
    data: () => ({}),
    computed: {
      ...Ke(gt, ['snackbar']),
      ...an(gt, ['showSnackBar']),
      isMobile() {
        const { sm: e, xs: t } = this.$vuetify.display
        return t || e
      },
      show: {
        get() {
          return this.showSnackBar
        },
        set(e) {
          this.showSnackBar = e
        }
      },
      offset() {
        return this.snackbar.location.includes('top') ? [0, 60, 0, 0] : 0
      },
      location() {
        return this.isMobile ? 'bottom center' : 'top right'
      }
    }
  }),
  gw = { class: 'font-weight-medium text-body-1' }
function pw(e, t, n, s, r, o) {
  return (
    F(),
    G(
      mw,
      {
        modelValue: e.show,
        'onUpdate:modelValue': t[1] || (t[1] = a => (e.show = a)),
        offset: e.offset,
        location: e.location,
        color: e.snackbar.color,
        variant: e.snackbar.variant,
        timeout: e.snackbar.timeout,
        'multi-line': e.snackbar.multiLine
      },
      {
        actions: f(() => [
          l(
            ae,
            {
              variant: 'outlined',
              color: 'white',
              density: 'compact',
              icon: 'mdi-close',
              onClick: t[0] || (t[0] = a => (e.show = !1))
            },
            { default: f(() => [ee(' X ')]), _: 1 }
          )
        ]),
        default: f(() => [C('span', gw, S(e.snackbar.message), 1)]),
        _: 1
      },
      8,
      ['modelValue', 'offset', 'location', 'color', 'variant', 'timeout', 'multi-line']
    )
  )
}
const Ew = ue(hw, [['render', pw]]),
  _w = ie(
    {
      app: Boolean,
      color: String,
      height: { type: [Number, String], default: 'auto' },
      ...gr(),
      ...Qe(),
      ...Ls(),
      ...KN(),
      ...ln(),
      ...Jt({ tag: 'footer' }),
      ...Ot()
    },
    'VFooter'
  ),
  yw = Ae()({
    name: 'VFooter',
    props: _w(),
    setup(e, t) {
      let { slots: n } = t
      const { themeClasses: s } = Pt(e),
        { backgroundColorClasses: r, backgroundColorStyles: o } = is(De(e, 'color')),
        { borderClasses: a } = uo(e),
        { elevationClasses: i } = pr(e),
        { roundedClasses: u } = mn(e),
        c = je(32),
        { resizeRef: d } = Ga(E => {
          E.length && (c.value = E[0].target.clientHeight)
        }),
        m = M(() => (e.height === 'auto' ? c.value : parseInt(e.height, 10))),
        { layoutItemStyles: h } = zN({
          id: e.name,
          order: M(() => parseInt(e.order, 10)),
          position: M(() => 'bottom'),
          layoutSize: m,
          elementSize: M(() => (e.height === 'auto' ? void 0 : m.value)),
          active: M(() => e.app),
          absolute: De(e, 'absolute')
        })
      return (
        Ve(() =>
          l(
            e.tag,
            {
              ref: d,
              class: ['v-footer', s.value, r.value, a.value, i.value, u.value, e.class],
              style: [o.value, e.app ? h.value : { height: Te(e.height) }, e.style]
            },
            n
          )
        ),
        {}
      )
    }
  }),
  vw = Ee({
    name: 'SFooter',
    data: () => ({}),
    computed: {
      ...Ke(gt, ['config', 'metadata']),
      ...an(gt, ['showSystemLanguageDialog']),
      isMobile() {
        const { sm: e, xs: t } = this.$vuetify.display
        return t || e
      },
      links() {
        return [
          { url: `${this.$config.siteHost}/policies/privacy-policy`, text: this.$t('FOOTER.PRIVACY_POLICY') },
          { url: `${this.$config.siteHost}/policies/terms-of-use`, text: this.$t('FOOTER.TERMS_OF_USE') }
        ]
      }
    },
    methods: {
      onClickChangeLanguage() {
        this.showSystemLanguageDialog = !0
      }
    }
  }),
  bw = ['href'],
  Sw = { class: 'text-grey-darken-3 font-weight-bold' },
  Rw = ['href', 'title'],
  Ow = C('span', null, '|', -1),
  Cw = ['href', 'title']
function Aw(e, t, n, s, r, o) {
  return (
    F(),
    G(
      yw,
      { class: 'bg-transparent', height: '100px' },
      {
        default: f(() => [
          l(
            dt,
            { class: 'py-0' },
            {
              default: f(() => [
                l(
                  _,
                  { class: 'pb-3 text-center' },
                  {
                    default: f(() => [
                      l(
                        ae,
                        { variant: 'text', onClick: e.onClickChangeLanguage },
                        {
                          default: f(() => [
                            C('span', null, S(e.$setting.language), 1),
                            l(mt, { icon: 'mdi mdi-menu-down' })
                          ]),
                          _: 1
                        },
                        8,
                        ['onClick']
                      )
                    ]),
                    _: 1
                  }
                ),
                l(
                  _,
                  { class: 'text-center' },
                  {
                    default: f(() => [
                      l(_, null, {
                        default: f(() => [
                          C(
                            'a',
                            { href: e.$config.mainPortal },
                            [C('span', Sw, ' © ' + S(e.metadata.config.copyright) + ' 2024. ', 1)],
                            8,
                            bw
                          )
                        ]),
                        _: 1
                      })
                    ]),
                    _: 1
                  }
                ),
                l(
                  _,
                  { class: 'd-flex align-center justify-center' },
                  {
                    default: f(() => [
                      l(_, null, {
                        default: f(() => [
                          C(
                            'a',
                            { href: e.links[0].url, title: e.links[0].text, class: 'text-grey-darken-3' },
                            [C('span', null, S(e.links[0].text), 1)],
                            8,
                            Rw
                          )
                        ]),
                        _: 1
                      }),
                      l(_, { class: 'px-1' }, { default: f(() => [Ow]), _: 1 }),
                      l(_, null, {
                        default: f(() => [
                          C(
                            'a',
                            { href: e.links[1].url, title: e.links[1].text, class: 'text-grey-darken-3' },
                            [C('span', null, S(e.links[1].text), 1)],
                            8,
                            Cw
                          )
                        ]),
                        _: 1
                      })
                    ]),
                    _: 1
                  }
                )
              ]),
              _: 1
            }
          )
        ]),
        _: 1
      }
    )
  )
}
const Iw = ue(vw, [['render', Aw]]),
  zg = Symbol.for('vuetify:selection-control-group'),
  Ru = ie(
    {
      color: String,
      disabled: { type: Boolean, default: null },
      defaultsTarget: String,
      error: Boolean,
      id: String,
      inline: Boolean,
      falseIcon: ct,
      trueIcon: ct,
      ripple: { type: Boolean, default: !0 },
      multiple: { type: Boolean, default: null },
      name: String,
      readonly: { type: Boolean, default: null },
      modelValue: null,
      type: String,
      valueComparator: { type: Function, default: Va },
      ...Qe(),
      ...Bn(),
      ...Ot()
    },
    'SelectionControlGroup'
  ),
  Tw = ie({ ...Ru({ defaultsTarget: 'VSelectionControl' }) }, 'VSelectionControlGroup'),
  Nw = Ae()({
    name: 'VSelectionControlGroup',
    props: Tw(),
    emits: { 'update:modelValue': e => !0 },
    setup(e, t) {
      let { slots: n } = t
      const s = Nt(e, 'modelValue'),
        r = An(),
        o = M(() => e.id || `v-selection-control-group-${r}`),
        a = M(() => e.name || o.value),
        i = new Set()
      return (
        Ut(zg, {
          modelValue: s,
          forceUpdate: () => {
            i.forEach(u => u())
          },
          onForceUpdate: u => {
            ;(i.add(u),
              Ht(() => {
                i.delete(u)
              }))
          }
        }),
        Is({
          [e.defaultsTarget]: {
            color: De(e, 'color'),
            disabled: De(e, 'disabled'),
            density: De(e, 'density'),
            error: De(e, 'error'),
            inline: De(e, 'inline'),
            modelValue: s,
            multiple: M(() => !!e.multiple || (e.multiple == null && Array.isArray(s.value))),
            name: a,
            falseIcon: De(e, 'falseIcon'),
            trueIcon: De(e, 'trueIcon'),
            readonly: De(e, 'readonly'),
            ripple: De(e, 'ripple'),
            type: De(e, 'type'),
            valueComparator: De(e, 'valueComparator')
          }
        }),
        Ve(() => {
          var u
          return l(
            'div',
            {
              class: ['v-selection-control-group', { 'v-selection-control-group--inline': e.inline }, e.class],
              style: e.style,
              role: e.type === 'radio' ? 'radiogroup' : void 0
            },
            [(u = n.default) == null ? void 0 : u.call(n)]
          )
        }),
        {}
      )
    }
  }),
  Xg = ie(
    { label: String, baseColor: String, trueValue: null, falseValue: null, value: null, ...Qe(), ...Ru() },
    'VSelectionControl'
  )
function ww(e) {
  const t = it(zg, void 0),
    { densityClasses: n } = ws(e),
    s = Nt(e, 'modelValue'),
    r = M(() => (e.trueValue !== void 0 ? e.trueValue : e.value !== void 0 ? e.value : !0)),
    o = M(() => (e.falseValue !== void 0 ? e.falseValue : !1)),
    a = M(() => !!e.multiple || (e.multiple == null && Array.isArray(s.value))),
    i = M({
      get() {
        const E = t ? t.modelValue.value : s.value
        return a.value ? ss(E).some(y => e.valueComparator(y, r.value)) : e.valueComparator(E, r.value)
      },
      set(E) {
        if (e.readonly) return
        const y = E ? r.value : o.value
        let v = y
        ;(a.value && (v = E ? [...ss(s.value), y] : ss(s.value).filter(I => !e.valueComparator(I, r.value))),
          t ? (t.modelValue.value = v) : (s.value = v))
      }
    }),
    { textColorClasses: u, textColorStyles: c } = Fn(
      M(() => {
        if (!(e.error || e.disabled)) return i.value ? e.color : e.baseColor
      })
    ),
    { backgroundColorClasses: d, backgroundColorStyles: m } = is(
      M(() => (i.value && !e.error && !e.disabled ? e.color : void 0))
    ),
    h = M(() => (i.value ? e.trueIcon : e.falseIcon))
  return {
    group: t,
    densityClasses: n,
    trueValue: r,
    falseValue: o,
    model: i,
    textColorClasses: u,
    textColorStyles: c,
    backgroundColorClasses: d,
    backgroundColorStyles: m,
    icon: h
  }
}
const Jg = Ae()({
    name: 'VSelectionControl',
    directives: { Ripple: mu },
    inheritAttrs: !1,
    props: Xg(),
    emits: { 'update:modelValue': e => !0 },
    setup(e, t) {
      let { attrs: n, slots: s } = t
      const {
          group: r,
          densityClasses: o,
          icon: a,
          model: i,
          textColorClasses: u,
          textColorStyles: c,
          backgroundColorClasses: d,
          backgroundColorStyles: m,
          trueValue: h
        } = ww(e),
        E = An(),
        y = je(!1),
        v = je(!1),
        I = _e(),
        b = M(() => e.id || `input-${E}`),
        O = M(() => !e.disabled && !e.readonly)
      r == null ||
        r.onForceUpdate(() => {
          I.value && (I.value.checked = i.value)
        })
      function P(N) {
        O.value && ((y.value = !0), Kh(N.target, ':focus-visible') !== !1 && (v.value = !0))
      }
      function T() {
        ;((y.value = !1), (v.value = !1))
      }
      function $(N) {
        N.stopPropagation()
      }
      function L(N) {
        O.value && (e.readonly && r && Et(() => r.forceUpdate()), (i.value = N.target.checked))
      }
      return (
        Ve(() => {
          var j, D
          const N = s.label ? s.label({ label: e.label, props: { for: b.value } }) : e.label,
            [A, w] = xa(n),
            B = l(
              'input',
              Ge(
                {
                  ref: I,
                  checked: i.value,
                  disabled: !!e.disabled,
                  id: b.value,
                  onBlur: T,
                  onFocus: P,
                  onInput: L,
                  'aria-disabled': !!e.disabled,
                  type: e.type,
                  value: h.value,
                  name: e.name,
                  'aria-checked': e.type === 'checkbox' ? i.value : void 0
                },
                w
              ),
              null
            )
          return l(
            'div',
            Ge(
              {
                class: [
                  'v-selection-control',
                  {
                    'v-selection-control--dirty': i.value,
                    'v-selection-control--disabled': e.disabled,
                    'v-selection-control--error': e.error,
                    'v-selection-control--focused': y.value,
                    'v-selection-control--focus-visible': v.value,
                    'v-selection-control--inline': e.inline
                  },
                  o.value,
                  e.class
                ]
              },
              A,
              { style: e.style }
            ),
            [
              l('div', { class: ['v-selection-control__wrapper', u.value], style: c.value }, [
                (j = s.default) == null ? void 0 : j.call(s, { backgroundColorClasses: d, backgroundColorStyles: m }),
                vt(
                  l('div', { class: ['v-selection-control__input'] }, [
                    ((D = s.input) == null
                      ? void 0
                      : D.call(s, {
                          model: i,
                          textColorClasses: u,
                          textColorStyles: c,
                          backgroundColorClasses: d,
                          backgroundColorStyles: m,
                          inputNode: B,
                          icon: a.value,
                          props: { onFocus: P, onBlur: T, id: b.value }
                        })) ?? l(Ue, null, [a.value && l(mt, { key: 'icon', icon: a.value }, null), B])
                  ]),
                  [[dr('ripple'), e.ripple && [!e.disabled && !e.readonly, null, ['center', 'circle']]]]
                )
              ]),
              N && l(hu, { for: b.value, onClick: $ }, { default: () => [N] })
            ]
          )
        }),
        { isFocused: y, input: I }
      )
    }
  }),
  Lw = ie({ ...Xg({ falseIcon: '$radioOff', trueIcon: '$radioOn' }) }, 'VRadio'),
  Pw = Ae()({
    name: 'VRadio',
    props: Lw(),
    setup(e, t) {
      let { slots: n } = t
      return (Ve(() => l(Jg, Ge(e, { class: ['v-radio', e.class], style: e.style, type: 'radio' }), n)), {})
    }
  }),
  $w = ie(
    {
      height: { type: [Number, String], default: 'auto' },
      ...yu(),
      ...su(Ru(), ['multiple']),
      trueIcon: { type: ct, default: '$radioOn' },
      falseIcon: { type: ct, default: '$radioOff' },
      type: { type: String, default: 'radio' }
    },
    'VRadioGroup'
  ),
  Mw = Ae()({
    name: 'VRadioGroup',
    inheritAttrs: !1,
    props: $w(),
    emits: { 'update:modelValue': e => !0 },
    setup(e, t) {
      let { attrs: n, slots: s } = t
      const r = An(),
        o = M(() => e.id || `radio-group-${r}`),
        a = Nt(e, 'modelValue')
      return (
        Ve(() => {
          const [i, u] = xa(n),
            c = ua.filterProps(e),
            d = Jg.filterProps(e),
            m = s.label ? s.label({ label: e.label, props: { for: o.value } }) : e.label
          return l(
            ua,
            Ge({ class: ['v-radio-group', e.class], style: e.style }, i, c, {
              modelValue: a.value,
              'onUpdate:modelValue': h => (a.value = h),
              id: o.value
            }),
            {
              ...s,
              default: h => {
                let { id: E, messagesId: y, isDisabled: v, isReadonly: I } = h
                return l(Ue, null, [
                  m && l(hu, { id: E.value }, { default: () => [m] }),
                  l(
                    Nw,
                    Ge(
                      d,
                      {
                        id: E.value,
                        'aria-describedby': y.value,
                        defaultsTarget: 'VRadio',
                        trueIcon: e.trueIcon,
                        falseIcon: e.falseIcon,
                        type: e.type,
                        disabled: v.value,
                        readonly: I.value,
                        'aria-labelledby': m ? E.value : void 0,
                        multiple: !1
                      },
                      u,
                      { modelValue: a.value, 'onUpdate:modelValue': b => (a.value = b) }
                    ),
                    s
                  )
                ])
              }
            }
          )
        }),
        {}
      )
    }
  }),
  kw = Ee({
    name: 'SLanguageDialog',
    props: {
      modelValue: { type: Boolean, default: !1 },
      error: { type: [Object, String, Number, Array, Boolean], required: !1 }
    },
    emits: ['update:modelValue', 'close'],
    data() {
      return { lang: 'en' }
    },
    computed: {
      dialog: {
        get() {
          return this.modelValue
        },
        set(e) {
          this.$emit('update:modelValue', e)
        }
      },
      currentLocation() {
        return window.location.href
      },
      displayLanguages() {
        return [
          { code: 'en', name: 'English (Global)' },
          { code: 'vi', name: 'Tiếng Việt (Vietnamese)' }
        ]
      }
    },
    methods: {
      onClickClose() {
        ;(this.$emit('close'), (this.dialog = !1))
      }
    },
    mounted() {
      this.lang = this.$setting.lang
    }
  }),
  Dw = ['value'],
  Fw = ['value']
function Vw(e, t, n, s, r, o) {
  return (
    F(),
    G(
      $t,
      {
        modelValue: e.dialog,
        'onUpdate:modelValue': t[2] || (t[2] = a => (e.dialog = a)),
        persistent: '',
        'max-width': '420'
      },
      {
        default: f(() => [
          l(
            Un,
            { ref: 'languageForm', action: `${e.$config.siteHost}/language`, method: 'POST' },
            {
              default: f(() => [
                C('input', { type: 'hidden', name: 'lang', value: e.lang }, null, 8, Dw),
                C('input', { type: 'hidden', name: 'back', value: e.currentLocation }, null, 8, Fw),
                l(
                  we,
                  { class: 'border' },
                  {
                    default: f(() => [
                      l(
                        _,
                        { class: 'pa-2 text-h6 text-secondary' },
                        { default: f(() => [C('span', null, S(e.$t('COMMON.SELECT_LANGUAGE.TITLE')), 1)]), _: 1 }
                      ),
                      l(qe),
                      l(
                        _,
                        { class: 'pa-2' },
                        {
                          default: f(() => [
                            l(
                              Mw,
                              { modelValue: e.lang, 'onUpdate:modelValue': t[0] || (t[0] = a => (e.lang = a)) },
                              {
                                default: f(() => [
                                  (F(!0),
                                  Ne(
                                    Ue,
                                    null,
                                    lE(
                                      e.displayLanguages,
                                      a => (
                                        F(),
                                        G(Pw, { key: a.code, value: a.code, label: a.name }, null, 8, [
                                          'value',
                                          'label'
                                        ])
                                      )
                                    ),
                                    128
                                  ))
                                ]),
                                _: 1
                              },
                              8,
                              ['modelValue']
                            )
                          ]),
                          _: 1
                        }
                      ),
                      l(qe),
                      l(
                        _,
                        { class: 'pa-2 text-right' },
                        {
                          default: f(() => [
                            l(
                              ae,
                              {
                                type: 'button',
                                class: 'mr-2',
                                color: 'reject',
                                'min-width': '70',
                                size: 'small',
                                variant: 'elevated',
                                onClick: t[1] || (t[1] = a => (e.dialog = !1))
                              },
                              { default: f(() => [ee(S(e.$t('COMMON.ACTION.CLOSE')), 1)]), _: 1 }
                            ),
                            l(
                              ae,
                              {
                                type: 'submit',
                                color: 'primary',
                                'min-width': '70',
                                size: 'small',
                                variant: 'elevated'
                              },
                              { default: f(() => [ee(S(e.$t('COMMON.ACTION.SAVE')), 1)]), _: 1 }
                            )
                          ]),
                          _: 1
                        }
                      )
                    ]),
                    _: 1
                  }
                )
              ]),
              _: 1
            },
            8,
            ['action']
          )
        ]),
        _: 1
      },
      8,
      ['modelValue']
    )
  )
}
const xw = ue(kw, [['render', Vw]]),
  Bw = ie({ ...Qe(), ...YN({ fullHeight: !0 }), ...Ot() }, 'VApp'),
  Uw = Ae()({
    name: 'VApp',
    props: Bw(),
    setup(e, t) {
      let { slots: n } = t
      const s = Pt(e),
        { layoutClasses: r, getLayoutItem: o, items: a, layoutRef: i } = JN(e),
        { rtlClasses: u } = fs()
      return (
        Ve(() => {
          var c
          return l(
            'div',
            { ref: i, class: ['v-application', s.themeClasses.value, r.value, u.value, e.class], style: [e.style] },
            [l('div', { class: 'v-application__wrap' }, [(c = n.default) == null ? void 0 : c.call(n)])]
          )
        }),
        { getLayoutItem: o, items: a, theme: s }
      )
    }
  })
function Gw() {
  const e = je(!1)
  return (
    xn(() => {
      window.requestAnimationFrame(() => {
        e.value = !0
      })
    }),
    { ssrBootStyles: M(() => (e.value ? void 0 : { transition: 'none !important' })), isBooted: so(e) }
  )
}
const Ww = ie({ scrollable: Boolean, ...Qe(), ...Jt({ tag: 'main' }) }, 'VMain'),
  Hw = Ae()({
    name: 'VMain',
    props: Ww(),
    setup(e, t) {
      let { slots: n } = t
      const { mainStyles: s } = qN(),
        { ssrBootStyles: r } = Gw()
      return (
        Ve(() =>
          l(
            e.tag,
            { class: ['v-main', { 'v-main--scrollable': e.scrollable }, e.class], style: [s.value, r.value, e.style] },
            {
              default: () => {
                var o, a
                return [
                  e.scrollable
                    ? l('div', { class: 'v-main__scroller' }, [(o = n.default) == null ? void 0 : o.call(n)])
                    : (a = n.default) == null
                      ? void 0
                      : a.call(n)
                ]
              }
            }
          )
        ),
        {}
      )
    }
  }),
  jw = Ee({
    name: 'SBase',
    components: { SLanguageDialog: xw, SFooter: Iw, Snackbar: Ew, SErrorDialog: cw },
    computed: {
      ...Ke(gt, []),
      ...an(gt, ['showSystemErrorDialog', 'showSystemLanguageDialog']),
      isMobile() {
        const { sm: e, xs: t } = this.$vuetify.display
        return t || e
      },
      showErrorDialog: {
        get() {
          return this.showSystemErrorDialog
        },
        set(e) {
          this.showSystemErrorDialog = e
        }
      },
      showLanguageDialog: {
        get() {
          return this.showSystemLanguageDialog
        },
        set(e) {
          this.showSystemLanguageDialog = e
        }
      }
    },
    methods: { ...Ye(gt, []) },
    watch: {},
    mounted() {}
  })
function Yw(e, t, n, s, r, o) {
  const a = he('s-footer'),
    i = he('snackbar'),
    u = he('s-error-dialog'),
    c = he('s-language-dialog')
  return (
    F(),
    G(
      Uw,
      { class: 'text-body-1' },
      {
        default: f(() => [
          l(
            Hw,
            { style: { 'min-height': 'calc(100vh - 100px)' } },
            { default: f(() => [uE(e.$slots, 'default')]), _: 3 }
          ),
          l(a),
          l(i),
          l(
            u,
            { modelValue: e.showErrorDialog, 'onUpdate:modelValue': t[0] || (t[0] = d => (e.showErrorDialog = d)) },
            null,
            8,
            ['modelValue']
          ),
          l(
            c,
            {
              modelValue: e.showLanguageDialog,
              'onUpdate:modelValue': t[1] || (t[1] = d => (e.showLanguageDialog = d))
            },
            null,
            8,
            ['modelValue']
          )
        ]),
        _: 3
      }
    )
  )
}
const Kw = ue(jw, [['render', Yw]]),
  qw = Ee({
    name: 'SPaginator',
    props: {
      modelValue: { type: Number, default: 1 },
      totalPages: { type: Number, default: 1 },
      totalItems: { type: Number, default: 0 },
      pageSize: { type: Number, default: 5 }
    },
    emits: ['update:modelValue'],
    computed: {
      page: {
        get() {
          return this.modelValue
        },
        set(e) {
          this.$emit('update:modelValue', e)
        }
      },
      totalVisible() {
        const { sm: e, xs: t } = this.$vuetify.display
        return t ? 5 : 7
      }
    }
  })
function zw() {
  const e = _e([])
  um(() => (e.value = []))
  function t(n, s) {
    e.value[s] = n
  }
  return { refs: e, updateRef: t }
}
const Xw = ie(
    {
      activeColor: String,
      start: { type: [Number, String], default: 1 },
      modelValue: { type: Number, default: e => e.start },
      disabled: Boolean,
      length: { type: [Number, String], default: 1, validator: e => e % 1 === 0 },
      totalVisible: [Number, String],
      firstIcon: { type: ct, default: '$first' },
      prevIcon: { type: ct, default: '$prev' },
      nextIcon: { type: ct, default: '$next' },
      lastIcon: { type: ct, default: '$last' },
      ariaLabel: { type: String, default: '$vuetify.pagination.ariaLabel.root' },
      pageAriaLabel: { type: String, default: '$vuetify.pagination.ariaLabel.page' },
      currentPageAriaLabel: { type: String, default: '$vuetify.pagination.ariaLabel.currentPage' },
      firstAriaLabel: { type: String, default: '$vuetify.pagination.ariaLabel.first' },
      previousAriaLabel: { type: String, default: '$vuetify.pagination.ariaLabel.previous' },
      nextAriaLabel: { type: String, default: '$vuetify.pagination.ariaLabel.next' },
      lastAriaLabel: { type: String, default: '$vuetify.pagination.ariaLabel.last' },
      ellipsis: { type: String, default: '...' },
      showFirstLastPage: Boolean,
      ...gr(),
      ...Qe(),
      ...Bn(),
      ...Ls(),
      ...ln(),
      ...mo(),
      ...Jt({ tag: 'nav' }),
      ...Ot(),
      ...Ps({ variant: 'text' })
    },
    'VPagination'
  ),
  Jw = Ae()({
    name: 'VPagination',
    props: Xw(),
    emits: { 'update:modelValue': e => !0, first: e => !0, prev: e => !0, next: e => !0, last: e => !0 },
    setup(e, t) {
      let { slots: n, emit: s } = t
      const r = Nt(e, 'modelValue'),
        { t: o, n: a } = Wa(),
        { isRtl: i } = fs(),
        { themeClasses: u } = Pt(e),
        { width: c } = Cg(),
        d = je(-1)
      Is(void 0, { scoped: !0 })
      const { resizeRef: m } = Ga(A => {
          if (!A.length) return
          const { target: w, contentRect: B } = A[0],
            j = w.querySelector('.v-pagination__list > *')
          if (!j) return
          const D = B.width,
            U = j.offsetWidth + parseFloat(getComputedStyle(j).marginRight) * 2
          d.value = v(D, U)
        }),
        h = M(() => parseInt(e.length, 10)),
        E = M(() => parseInt(e.start, 10)),
        y = M(() => (e.totalVisible != null ? parseInt(e.totalVisible, 10) : d.value >= 0 ? d.value : v(c.value, 58)))
      function v(A, w) {
        const B = e.showFirstLastPage ? 5 : 3
        return Math.max(0, Math.floor(+((A - w * B) / w).toFixed(2)))
      }
      const I = M(() => {
        if (h.value <= 0 || isNaN(h.value) || h.value > Number.MAX_SAFE_INTEGER) return []
        if (y.value <= 0) return []
        if (y.value === 1) return [r.value]
        if (h.value <= y.value) return Ws(h.value, E.value)
        const A = y.value % 2 === 0,
          w = A ? y.value / 2 : Math.floor(y.value / 2),
          B = A ? w : w + 1,
          j = h.value - w
        if (B - r.value >= 0) return [...Ws(Math.max(1, y.value - 1), E.value), e.ellipsis, h.value]
        if (r.value - j >= (A ? 1 : 0)) {
          const D = y.value - 1,
            U = h.value - D + E.value
          return [E.value, e.ellipsis, ...Ws(D, U)]
        } else {
          const D = Math.max(1, y.value - 3),
            U = D === 1 ? r.value : r.value - Math.ceil(D / 2) + E.value
          return [E.value, e.ellipsis, ...Ws(D, U), e.ellipsis, h.value]
        }
      })
      function b(A, w, B) {
        ;(A.preventDefault(), (r.value = w), B && s(B, w))
      }
      const { refs: O, updateRef: P } = zw()
      Is({
        VPaginationBtn: {
          color: De(e, 'color'),
          border: De(e, 'border'),
          density: De(e, 'density'),
          size: De(e, 'size'),
          variant: De(e, 'variant'),
          rounded: De(e, 'rounded'),
          elevation: De(e, 'elevation')
        }
      })
      const T = M(() =>
          I.value.map((A, w) => {
            const B = j => P(j, w)
            if (typeof A == 'string')
              return {
                isActive: !1,
                key: `ellipsis-${w}`,
                page: A,
                props: { ref: B, ellipsis: !0, icon: !0, disabled: !0 }
              }
            {
              const j = A === r.value
              return {
                isActive: j,
                key: A,
                page: a(A),
                props: {
                  ref: B,
                  ellipsis: !1,
                  icon: !0,
                  disabled: !!e.disabled || +e.length < 2,
                  color: j ? e.activeColor : e.color,
                  'aria-current': j,
                  'aria-label': o(j ? e.currentPageAriaLabel : e.pageAriaLabel, A),
                  onClick: D => b(D, A)
                }
              }
            }
          })
        ),
        $ = M(() => {
          const A = !!e.disabled || r.value <= E.value,
            w = !!e.disabled || r.value >= E.value + h.value - 1
          return {
            first: e.showFirstLastPage
              ? {
                  icon: i.value ? e.lastIcon : e.firstIcon,
                  onClick: B => b(B, E.value, 'first'),
                  disabled: A,
                  'aria-label': o(e.firstAriaLabel),
                  'aria-disabled': A
                }
              : void 0,
            prev: {
              icon: i.value ? e.nextIcon : e.prevIcon,
              onClick: B => b(B, r.value - 1, 'prev'),
              disabled: A,
              'aria-label': o(e.previousAriaLabel),
              'aria-disabled': A
            },
            next: {
              icon: i.value ? e.prevIcon : e.nextIcon,
              onClick: B => b(B, r.value + 1, 'next'),
              disabled: w,
              'aria-label': o(e.nextAriaLabel),
              'aria-disabled': w
            },
            last: e.showFirstLastPage
              ? {
                  icon: i.value ? e.firstIcon : e.lastIcon,
                  onClick: B => b(B, E.value + h.value - 1, 'last'),
                  disabled: w,
                  'aria-label': o(e.lastAriaLabel),
                  'aria-disabled': w
                }
              : void 0
          }
        })
      function L() {
        var w
        const A = r.value - E.value
        ;(w = O.value[A]) == null || w.$el.focus()
      }
      function N(A) {
        A.key === Sd.left && !e.disabled && r.value > +e.start
          ? ((r.value = r.value - 1), Et(L))
          : A.key === Sd.right && !e.disabled && r.value < E.value + h.value - 1 && ((r.value = r.value + 1), Et(L))
      }
      return (
        Ve(() =>
          l(
            e.tag,
            {
              ref: m,
              class: ['v-pagination', u.value, e.class],
              style: e.style,
              role: 'navigation',
              'aria-label': o(e.ariaLabel),
              onKeydown: N,
              'data-test': 'v-pagination-root'
            },
            {
              default: () => [
                l('ul', { class: 'v-pagination__list' }, [
                  e.showFirstLastPage &&
                    l('li', { key: 'first', class: 'v-pagination__first', 'data-test': 'v-pagination-first' }, [
                      n.first ? n.first($.value.first) : l(ae, Ge({ _as: 'VPaginationBtn' }, $.value.first), null)
                    ]),
                  l('li', { key: 'prev', class: 'v-pagination__prev', 'data-test': 'v-pagination-prev' }, [
                    n.prev ? n.prev($.value.prev) : l(ae, Ge({ _as: 'VPaginationBtn' }, $.value.prev), null)
                  ]),
                  T.value.map((A, w) =>
                    l(
                      'li',
                      {
                        key: A.key,
                        class: ['v-pagination__item', { 'v-pagination__item--is-active': A.isActive }],
                        'data-test': 'v-pagination-item'
                      },
                      [n.item ? n.item(A) : l(ae, Ge({ _as: 'VPaginationBtn' }, A.props), { default: () => [A.page] })]
                    )
                  ),
                  l('li', { key: 'next', class: 'v-pagination__next', 'data-test': 'v-pagination-next' }, [
                    n.next ? n.next($.value.next) : l(ae, Ge({ _as: 'VPaginationBtn' }, $.value.next), null)
                  ]),
                  e.showFirstLastPage &&
                    l('li', { key: 'last', class: 'v-pagination__last', 'data-test': 'v-pagination-last' }, [
                      n.last ? n.last($.value.last) : l(ae, Ge({ _as: 'VPaginationBtn' }, $.value.last), null)
                    ])
                ])
              ]
            }
          )
        ),
        {}
      )
    }
  }),
  Qw = C('span', null, '( ', -1),
  Zw = { class: 'font-weight-medium' },
  eL = C('span', null, ' ~ ', -1),
  tL = { key: 0, class: 'font-weight-medium' },
  nL = { key: 1, class: 'font-weight-medium' },
  sL = C('span', null, ' | ', -1),
  rL = { class: 'font-weight-medium' },
  oL = C('span', null, ' )', -1)
function aL(e, t, n, s, r, o) {
  return (
    F(),
    Ne(
      Ue,
      null,
      [
        l(
          Jw,
          {
            density: 'compact',
            modelValue: e.page,
            'onUpdate:modelValue': t[0] || (t[0] = a => (e.page = a)),
            length: e.totalPages,
            'total-visible': e.totalVisible,
            rounded: 'circle'
          },
          null,
          8,
          ['modelValue', 'length', 'total-visible']
        ),
        l(
          _,
          { class: 'text-center' },
          {
            default: f(() => [
              C('p', null, [
                Qw,
                C('span', Zw, S((e.page - 1) * e.pageSize + 1), 1),
                eL,
                e.page < e.totalPages
                  ? (F(), Ne('span', tL, S(e.page * e.pageSize), 1))
                  : (F(), Ne('span', nL, S(e.totalItems), 1)),
                sL,
                C('span', rL, S(e.totalItems), 1),
                oL
              ])
            ]),
            _: 1
          }
        )
      ],
      64
    )
  )
}
const iL = ue(qw, [['render', aL]]),
  lL = Ee({
    name: 'SErrorMessage',
    props: { error: { type: [Object, String, Number, Array, Boolean], required: !1 } },
    methods: {
      onClickReload() {
        location.reload()
      },
      onClickGoToHome() {
        window.location.replace(document.baseURI)
      }
    },
    mounted() {
      typeof this.error == 'object' && (console.error(this.error), console.log(`Error code: ${this.error.code}`))
    }
  })
function uL(e, t, n, s, r, o) {
  return (
    F(),
    G(
      _,
      { color: 'transparent', class: 'd-flex align-center justify-center', width: '100%', height: '100%' },
      {
        default: f(() => {
          var a, i, u, c
          return [
            `${(a = e.error) == null ? void 0 : a.code}` == '403'
              ? (F(),
                G(
                  _,
                  { key: 0, 'max-width': '420px' },
                  {
                    default: f(() => [
                      l(
                        de,
                        {
                          color: 'error',
                          border: 'start',
                          variant: 'tonal',
                          title: e.$t('COMMON.ERROR_FORBIDDEN_ERROR.TITLE')
                        },
                        {
                          default: f(() => [
                            l(
                              _,
                              { class: 'py-2' },
                              { default: f(() => [ee(S(e.$t('COMMON.ERROR_FORBIDDEN_ERROR.MESSAGE')), 1)]), _: 1 }
                            )
                          ]),
                          _: 1
                        },
                        8,
                        ['title']
                      )
                    ]),
                    _: 1
                  }
                ))
              : `${(i = e.error) == null ? void 0 : i.code}` == '8'
                ? (F(),
                  G(
                    _,
                    { key: 1, 'max-width': '420px' },
                    {
                      default: f(() => [
                        l(
                          de,
                          {
                            color: 'error',
                            border: 'start',
                            variant: 'tonal',
                            title: e.$t('COMMON.ERROR_ITEM_NOT_EXIST.TITLE')
                          },
                          {
                            default: f(() => [
                              l(
                                _,
                                { class: 'py-2' },
                                { default: f(() => [ee(S(e.$t('COMMON.ERROR_ITEM_NOT_EXIST.MESSAGE')), 1)]), _: 1 }
                              )
                            ]),
                            _: 1
                          },
                          8,
                          ['title']
                        )
                      ]),
                      _: 1
                    }
                  ))
                : `${(u = e.error) == null ? void 0 : u.code}` == '9'
                  ? (F(),
                    G(
                      _,
                      { key: 2, 'max-width': '420px' },
                      {
                        default: f(() => [
                          l(
                            de,
                            {
                              color: 'error',
                              border: 'start',
                              variant: 'tonal',
                              title: e.$t('COMMON.ERROR_SUBJECT_NOT_EXIST.TITLE')
                            },
                            {
                              default: f(() => [
                                l(
                                  _,
                                  { class: 'py-2' },
                                  { default: f(() => [ee(S(e.$t('COMMON.ERROR_SUBJECT_NOT_EXIST.MESSAGE')), 1)]), _: 1 }
                                )
                              ]),
                              _: 1
                            },
                            8,
                            ['title']
                          )
                        ]),
                        _: 1
                      }
                    ))
                  : `${(c = e.error) == null ? void 0 : c.code}` == '5'
                    ? (F(),
                      G(
                        _,
                        { key: 3, 'max-width': '420px' },
                        {
                          default: f(() => [
                            l(
                              de,
                              {
                                color: 'error',
                                border: 'start',
                                variant: 'tonal',
                                title: e.$t('COMMON.ERROR_SUBJECT_WAS_CLOSED.TITLE')
                              },
                              {
                                default: f(() => [
                                  l(
                                    _,
                                    { class: 'py-2' },
                                    {
                                      default: f(() => [ee(S(e.$t('COMMON.ERROR_SUBJECT_WAS_CLOSED.MESSAGE')), 1)]),
                                      _: 1
                                    }
                                  )
                                ]),
                                _: 1
                              },
                              8,
                              ['title']
                            )
                          ]),
                          _: 1
                        }
                      ))
                    : (F(),
                      G(
                        _,
                        { key: 4, 'max-width': '420px' },
                        {
                          default: f(() => [
                            l(
                              de,
                              {
                                color: 'error',
                                border: 'start',
                                variant: 'tonal',
                                title: e.$t('COMMON.ERROR_SYSTEM_ERROR.TITLE')
                              },
                              {
                                default: f(() => [
                                  l(
                                    _,
                                    { class: 'py-2' },
                                    { default: f(() => [ee(S(e.$t('COMMON.ERROR_SYSTEM_ERROR.MESSAGE')), 1)]), _: 1 }
                                  )
                                ]),
                                _: 1
                              },
                              8,
                              ['title']
                            )
                          ]),
                          _: 1
                        }
                      ))
          ]
        }),
        _: 1
      }
    )
  )
}
const cL = ue(lL, [['render', uL]]),
  dL = Ee({ name: 'SLoadingAnimation' }),
  Qg = '/assets/inner-TrQH0RQ4.png',
  fL = C('img', { src: Qg, height: 100 }, null, -1)
function mL(e, t, n, s, r, o) {
  return (
    F(),
    G(
      _,
      { width: '100%', height: '100%', class: 'd-flex align-center justify-center' },
      {
        default: f(() => [
          l(ho, { indeterminate: '', size: 160, color: 'secondary' }, { default: f(() => [fL]), _: 1 })
        ]),
        _: 1
      }
    )
  )
}
const hL = ue(dL, [['render', mL]]),
  gL = Ee({
    name: 'SPageError',
    props: { error: { type: [Object, String, Number, Array, Boolean], required: !1 } },
    methods: {
      onClickReload() {
        location.reload()
      },
      onClickGoToHome() {
        window.location.replace(document.baseURI)
      }
    },
    mounted() {
      typeof this.error == 'object' && (console.error(this.error), console.log(`Error code: ${this.error.code}`))
    }
  })
function pL(e, t, n, s, r, o) {
  return (
    F(),
    G(
      _,
      {
        color: 'transparent',
        class: 'd-flex align-center justify-center',
        width: '100%',
        height: '100%',
        'min-height': 'calc(100vh - 100px)'
      },
      {
        default: f(() => {
          var a, i, u, c
          return [
            `${(a = e.error) == null ? void 0 : a.code}` == '403'
              ? (F(),
                G(
                  _,
                  { key: 0, 'max-width': '420px' },
                  {
                    default: f(() => [
                      l(
                        de,
                        {
                          color: 'error',
                          border: 'start',
                          variant: 'tonal',
                          title: e.$t('COMMON.ERROR_FORBIDDEN_ERROR.TITLE')
                        },
                        {
                          default: f(() => [
                            l(
                              _,
                              { class: 'py-2' },
                              { default: f(() => [ee(S(e.$t('COMMON.ERROR_FORBIDDEN_ERROR.MESSAGE')), 1)]), _: 1 }
                            )
                          ]),
                          _: 1
                        },
                        8,
                        ['title']
                      ),
                      l(
                        _,
                        { class: 'pt-6 text-center' },
                        {
                          default: f(() => [
                            l(_, null, {
                              default: f(() => [C('span', null, S(e.$t('COMMON.ERROR_FORBIDDEN_ERROR.LABEL1')), 1)]),
                              _: 1
                            }),
                            l(_, null, {
                              default: f(() => [C('span', null, S(e.$t('COMMON.ERROR_FORBIDDEN_ERROR.LABEL2')), 1)]),
                              _: 1
                            })
                          ]),
                          _: 1
                        }
                      ),
                      l(
                        _,
                        { class: 'pt-5 text-center' },
                        {
                          default: f(() => [
                            l(
                              ae,
                              { variant: 'outlined', color: 'primary', onClick: e.onClickGoToHome },
                              { default: f(() => [ee(S(e.$t('COMMON.ERROR_FORBIDDEN_ERROR.ACTION')), 1)]), _: 1 },
                              8,
                              ['onClick']
                            )
                          ]),
                          _: 1
                        }
                      )
                    ]),
                    _: 1
                  }
                ))
              : `${(i = e.error) == null ? void 0 : i.code}` == '8'
                ? (F(),
                  G(
                    _,
                    { key: 1, 'max-width': '420px' },
                    {
                      default: f(() => [
                        l(
                          de,
                          {
                            color: 'error',
                            border: 'start',
                            variant: 'tonal',
                            title: e.$t('COMMON.ERROR_ITEM_NOT_EXIST.TITLE')
                          },
                          {
                            default: f(() => [
                              l(
                                _,
                                { class: 'py-2' },
                                { default: f(() => [ee(S(e.$t('COMMON.ERROR_ITEM_NOT_EXIST.MESSAGE')), 1)]), _: 1 }
                              )
                            ]),
                            _: 1
                          },
                          8,
                          ['title']
                        ),
                        l(
                          _,
                          { class: 'pt-6 text-center' },
                          {
                            default: f(() => [
                              l(_, null, {
                                default: f(() => [C('span', null, S(e.$t('COMMON.ERROR_ITEM_NOT_EXIST.LABEL1')), 1)]),
                                _: 1
                              }),
                              l(_, null, {
                                default: f(() => [C('span', null, S(e.$t('COMMON.ERROR_ITEM_NOT_EXIST.LABEL2')), 1)]),
                                _: 1
                              })
                            ]),
                            _: 1
                          }
                        ),
                        l(
                          _,
                          { class: 'pt-5 text-center' },
                          {
                            default: f(() => [
                              l(
                                ae,
                                { variant: 'outlined', color: 'primary', onClick: e.onClickGoToHome },
                                { default: f(() => [ee(S(e.$t('COMMON.ERROR_ITEM_NOT_EXIST.ACTION')), 1)]), _: 1 },
                                8,
                                ['onClick']
                              )
                            ]),
                            _: 1
                          }
                        )
                      ]),
                      _: 1
                    }
                  ))
                : `${(u = e.error) == null ? void 0 : u.code}` == '9'
                  ? (F(),
                    G(
                      _,
                      { key: 2, 'max-width': '420px' },
                      {
                        default: f(() => [
                          l(
                            de,
                            {
                              color: 'error',
                              border: 'start',
                              variant: 'tonal',
                              title: e.$t('COMMON.ERROR_SUBJECT_NOT_EXIST.TITLE')
                            },
                            {
                              default: f(() => [
                                l(
                                  _,
                                  { class: 'py-2' },
                                  { default: f(() => [ee(S(e.$t('COMMON.ERROR_SUBJECT_NOT_EXIST.MESSAGE')), 1)]), _: 1 }
                                )
                              ]),
                              _: 1
                            },
                            8,
                            ['title']
                          ),
                          l(
                            _,
                            { class: 'pt-6 text-center' },
                            {
                              default: f(() => [
                                l(_, null, {
                                  default: f(() => [
                                    C('span', null, S(e.$t('COMMON.ERROR_SUBJECT_NOT_EXIST.LABEL1')), 1)
                                  ]),
                                  _: 1
                                }),
                                l(_, null, {
                                  default: f(() => [
                                    C('span', null, S(e.$t('COMMON.ERROR_SUBJECT_NOT_EXIST.LABEL2')), 1)
                                  ]),
                                  _: 1
                                })
                              ]),
                              _: 1
                            }
                          ),
                          l(
                            _,
                            { class: 'pt-5 text-center' },
                            {
                              default: f(() => [
                                l(
                                  ae,
                                  { variant: 'outlined', color: 'primary', onClick: e.onClickGoToHome },
                                  { default: f(() => [ee(S(e.$t('COMMON.ERROR_SUBJECT_NOT_EXIST.ACTION')), 1)]), _: 1 },
                                  8,
                                  ['onClick']
                                )
                              ]),
                              _: 1
                            }
                          )
                        ]),
                        _: 1
                      }
                    ))
                  : `${(c = e.error) == null ? void 0 : c.code}` == '5'
                    ? (F(),
                      G(
                        _,
                        { key: 3, 'max-width': '420px' },
                        {
                          default: f(() => [
                            l(
                              de,
                              {
                                color: 'error',
                                border: 'start',
                                variant: 'tonal',
                                title: e.$t('COMMON.ERROR_SUBJECT_WAS_CLOSED.TITLE')
                              },
                              {
                                default: f(() => [
                                  l(
                                    _,
                                    { class: 'py-2' },
                                    {
                                      default: f(() => [ee(S(e.$t('COMMON.ERROR_SUBJECT_WAS_CLOSED.MESSAGE')), 1)]),
                                      _: 1
                                    }
                                  )
                                ]),
                                _: 1
                              },
                              8,
                              ['title']
                            ),
                            l(
                              _,
                              { class: 'pt-6 text-center' },
                              {
                                default: f(() => [
                                  l(_, null, {
                                    default: f(() => [
                                      C('span', null, S(e.$t('COMMON.ERROR_SUBJECT_WAS_CLOSED.LABEL1')), 1)
                                    ]),
                                    _: 1
                                  }),
                                  l(_, null, {
                                    default: f(() => [
                                      C('span', null, S(e.$t('COMMON.ERROR_SUBJECT_WAS_CLOSED.LABEL2')), 1)
                                    ]),
                                    _: 1
                                  })
                                ]),
                                _: 1
                              }
                            ),
                            l(
                              _,
                              { class: 'pt-5 text-center' },
                              {
                                default: f(() => [
                                  l(
                                    ae,
                                    { variant: 'outlined', color: 'primary', onClick: e.onClickGoToHome },
                                    {
                                      default: f(() => [ee(S(e.$t('COMMON.ERROR_SUBJECT_WAS_CLOSED.ACTION')), 1)]),
                                      _: 1
                                    },
                                    8,
                                    ['onClick']
                                  )
                                ]),
                                _: 1
                              }
                            )
                          ]),
                          _: 1
                        }
                      ))
                    : (F(),
                      G(
                        _,
                        { key: 4, 'max-width': '420px' },
                        {
                          default: f(() => [
                            l(
                              de,
                              {
                                color: 'error',
                                border: 'start',
                                variant: 'tonal',
                                title: e.$t('COMMON.ERROR_SYSTEM_ERROR.TITLE')
                              },
                              {
                                default: f(() => [
                                  l(
                                    _,
                                    { class: 'py-2' },
                                    { default: f(() => [ee(S(e.$t('COMMON.ERROR_SYSTEM_ERROR.MESSAGE')), 1)]), _: 1 }
                                  )
                                ]),
                                _: 1
                              },
                              8,
                              ['title']
                            ),
                            l(
                              _,
                              { class: 'pt-6 text-center' },
                              {
                                default: f(() => [
                                  l(_, null, {
                                    default: f(() => [C('span', null, S(e.$t('COMMON.ERROR_SYSTEM_ERROR.LABEL1')), 1)]),
                                    _: 1
                                  }),
                                  l(_, null, {
                                    default: f(() => [C('span', null, S(e.$t('COMMON.ERROR_SYSTEM_ERROR.LABEL2')), 1)]),
                                    _: 1
                                  })
                                ]),
                                _: 1
                              }
                            ),
                            l(
                              _,
                              { class: 'pt-5 text-center' },
                              {
                                default: f(() => [
                                  l(
                                    ae,
                                    { variant: 'outlined', color: 'primary', onClick: e.onClickReload },
                                    { default: f(() => [ee(S(e.$t('COMMON.ERROR_SYSTEM_ERROR.ACTION')), 1)]), _: 1 },
                                    8,
                                    ['onClick']
                                  )
                                ]),
                                _: 1
                              }
                            )
                          ]),
                          _: 1
                        }
                      ))
          ]
        }),
        _: 1
      }
    )
  )
}
const EL = ue(gL, [['render', pL]]),
  _L = Ee({ name: 'SPageLoading' }),
  yL = C('img', { src: Qg, height: 100 }, null, -1)
function vL(e, t, n, s, r, o) {
  return (
    F(),
    G(
      _,
      {
        color: 'transparent',
        class: 'd-flex align-center justify-center',
        width: '100%',
        height: '100%',
        'min-height': 'calc(100vh - 100px)'
      },
      {
        default: f(() => [
          l(ho, { indeterminate: '', size: 160, color: 'secondary' }, { default: f(() => [yL]), _: 1 })
        ]),
        _: 1
      }
    )
  )
}
const bL = ue(_L, [['render', vL]])
let Lo
const SL = new Uint8Array(16)
function RL() {
  if (!Lo && ((Lo = typeof crypto < 'u' && crypto.getRandomValues && crypto.getRandomValues.bind(crypto)), !Lo))
    throw new Error(
      'crypto.getRandomValues() not supported. See https://github.com/uuidjs/uuid#getrandomvalues-not-supported'
    )
  return Lo(SL)
}
const Ct = []
for (let e = 0; e < 256; ++e) Ct.push((e + 256).toString(16).slice(1))
function OL(e, t = 0) {
  return (
    Ct[e[t + 0]] +
    Ct[e[t + 1]] +
    Ct[e[t + 2]] +
    Ct[e[t + 3]] +
    '-' +
    Ct[e[t + 4]] +
    Ct[e[t + 5]] +
    '-' +
    Ct[e[t + 6]] +
    Ct[e[t + 7]] +
    '-' +
    Ct[e[t + 8]] +
    Ct[e[t + 9]] +
    '-' +
    Ct[e[t + 10]] +
    Ct[e[t + 11]] +
    Ct[e[t + 12]] +
    Ct[e[t + 13]] +
    Ct[e[t + 14]] +
    Ct[e[t + 15]]
  )
}
const CL = typeof crypto < 'u' && crypto.randomUUID && crypto.randomUUID.bind(crypto),
  Ef = { randomUUID: CL }
function _f(e, t, n) {
  if (Ef.randomUUID && !t && !e) return Ef.randomUUID()
  e = e || {}
  const s = e.random || (e.rng || RL)()
  if (((s[6] = (s[6] & 15) | 64), (s[8] = (s[8] & 63) | 128), t)) {
    n = n || 0
    for (let r = 0; r < 16; ++r) t[n + r] = s[r]
    return t
  }
  return OL(s)
}
const AL = Ee({
    name: 'SUploadFailedDialog',
    props: { modelValue: { type: Boolean, default: !1 }, code: { type: String, default: '' } },
    emits: ['update:modelValue', 'close'],
    computed: {
      dialog: {
        get() {
          return this.modelValue
        },
        set(e) {
          this.$emit('update:modelValue', e)
        }
      }
    },
    methods: {
      onClickClose() {
        ;(this.$emit('close'), (this.dialog = !1))
      }
    }
  }),
  IL = { class: 'text-capitalize' },
  TL = { class: 'mb-1' },
  NL = { class: 'mb-1' }
function wL(e, t, n, s, r, o) {
  return (
    F(),
    G(
      $t,
      {
        modelValue: e.dialog,
        'onUpdate:modelValue': t[0] || (t[0] = a => (e.dialog = a)),
        persistent: '',
        'max-width': '420'
      },
      {
        default: f(() => [
          l(
            we,
            { class: 'border pa-1' },
            {
              default: f(() => [
                l(
                  _,
                  { class: 'pa-2 text-h6 text-confirm' },
                  { default: f(() => [C('span', IL, S(e.$t('COMMON.UPLOAD_FAILED.TITLE')), 1)]), _: 1 }
                ),
                l(qe),
                l(
                  _,
                  { class: 'pa-2' },
                  {
                    default: f(() => [
                      C('p', TL, S(e.$t('COMMON.UPLOAD_FAILED.LABEL1')), 1),
                      C('p', NL, S(e.$t('COMMON.UPLOAD_FAILED.LABEL2')), 1)
                    ]),
                    _: 1
                  }
                ),
                l(qe),
                l(
                  _,
                  { class: 'pa-2 d-flex align-center justify-space-between' },
                  {
                    default: f(() => [
                      l(Ft),
                      l(
                        ae,
                        {
                          variant: 'elevated',
                          size: 'small',
                          'min-width': '70',
                          color: 'close',
                          onClick: e.onClickClose
                        },
                        { default: f(() => [ee(S(e.$t('COMMON.ACTION.CLOSE')), 1)]), _: 1 },
                        8,
                        ['onClick']
                      )
                    ]),
                    _: 1
                  }
                )
              ]),
              _: 1
            }
          )
        ]),
        _: 1
      },
      8,
      ['modelValue']
    )
  )
}
const LL = ue(AL, [['render', wL]]),
  PL = {
    name: 'SUploadImage',
    components: { SUploadFailedDialog: LL },
    props: {
      modelValue: { type: String, default: '' },
      label: { type: String, default: '' },
      url: { type: String, default: '' },
      thumbnail: { type: String, default: '' },
      cdnFileId: { type: String, required: !1 },
      cdnOwnerId: { type: String, required: !1 },
      name: { type: String, required: !1 },
      category: { type: String, required: !1 },
      rules: { type: Array, required: !1, default: () => [] },
      isUploading: { type: Boolean, default: !1 },
      height: { type: String, default: '204px' }
    },
    model: {
      prop: ['modelValue', 'url', 'thumbnail', 'cdnFileId', 'cdnOwnerId', 'isUploading'],
      event: [
        'update:modelValue',
        'update:url',
        'update:thumbnail',
        'update:cdnFileId',
        'update:cdnOwnerId',
        'update:isUploading'
      ]
    },
    emits: [
      'update:modelValue',
      'update:url',
      'update:thumbnail',
      'update:cdnFileId',
      'update:cdnOwnerId',
      'update:isUploading'
    ],
    data() {
      return { metadata: {}, id: 's-image-', isUploadingFile: !1, uploadErrorCode: !1, showUploadFailedDialog: !1 }
    },
    computed: {
      isMobile() {
        const { sm: e, xs: t } = this.$vuetify.display
        return t || e
      },
      value: {
        get() {
          return this.url
        },
        set(e) {
          ;(this.$emit('update:url', e), this.$emit('update:modelValue', e))
        }
      },
      vThumbnail: {
        get() {
          return this.thumbnail
        },
        set(e) {
          this.$emit('update:thumbnail', e)
        }
      },
      vCdnFileId: {
        get() {
          return this.cdnFileId
        },
        set(e) {
          this.$emit('update:cdnFileId', e)
        }
      },
      vCdnOwnerId: {
        get() {
          return this.cdnOwnerId
        },
        set(e) {
          this.$emit('update:cdnOwnerId', e)
        }
      },
      vIsUploading: {
        get() {
          return this.isUploading
        },
        set(e) {
          this.$emit('update:isUploading', e)
        }
      }
    },
    methods: {
      async upload(e, t) {
        try {
          ;((this.vIsUploading = !0), (this.isUploadingFile = !0), (this.uploadErrorCode = !1))
          const n = { headers: { 'CDN-Owner-ID': this.vCdnOwnerId } },
            s = new FormData()
          ;(s.append('file', e), t && t.trim() && (n.params = { name: t }))
          const r = await Oe.post(`/api/upload/public/${this.category}`, s, n)
          ;(r.headers.code
            ? ((this.uploadErrorCode = r.headers.code), console.error(r.data))
            : ((this.value = r.data.url),
              (this.vThumbnail = r.data.thumbnail),
              (this.vCdnFileId = r.data.id),
              (this.vCdnOwnerId = r.data.owner),
              (this.metadata = r.data)),
            (this.vIsUploading = !1),
            (this.isUploadingFile = !1))
        } catch (n) {
          ;(console.error(n), (this.vIsUploading = !1), (this.isUploadingFile = !1), (this.uploadErrorCode = !0))
        }
      },
      clear() {
        ;((this.value = ''), (this.vThumbnail = ''), (this.vCdnFileId = ''), (this.metadata = {}))
      },
      onChoseFile(e) {
        const t = e.target
        t && t.files && (this.upload(t.files[0], this.name), (this.$refs[this.id].value = ''))
      },
      onClickChoose() {
        document.getElementById(this.id).click()
      },
      onClickClear() {
        this.clear()
      }
    },
    watch: {
      uploadErrorCode() {
        this.uploadErrorCode && ((this.showUploadFailedDialog = !0), (this.uploadErrorCode = !1))
      }
    },
    mounted() {
      ;((this.id = `${this.id}-${_f()}`), this.vCdnOwnerId || (this.vCdnOwnerId = _f()), (this.vIsUploading = !1))
    }
  },
  $L = { key: 0, class: 'text-label' },
  ML = ['src'],
  kL = ['src', 'alt'],
  DL = ['id']
function FL(e, t, n, s, r, o) {
  const a = he('s-upload-failed-dialog')
  return (
    F(),
    Ne(
      Ue,
      null,
      [
        l(
          _,
          { width: '100%' },
          {
            default: f(() => [
              l(
                _,
                { class: 'd-flex align-center justify-space-between' },
                {
                  default: f(() => [
                    l(
                      _,
                      { class: 'flex-grow-1' },
                      { default: f(() => [n.label ? (F(), Ne('label', $L, S(n.label), 1)) : We('', !0)]), _: 1 }
                    ),
                    l(
                      _,
                      { class: 'flex-grow-0' },
                      {
                        default: f(() => [
                          l(
                            ae,
                            {
                              density: 'compact',
                              variant: 'text',
                              size: 'small',
                              color: 'label',
                              icon: 'mdi mdi-image-sync-outline',
                              class: 'ml-1 mr-1',
                              loading: r.isUploadingFile,
                              onClick: o.onClickChoose
                            },
                            null,
                            8,
                            ['loading', 'onClick']
                          ),
                          l(
                            ae,
                            {
                              density: 'compact',
                              variant: 'text',
                              size: 'small',
                              color: 'warning',
                              icon: 'mdi mdi-trash-can-outline',
                              class: 'ml-1',
                              loading: r.isUploadingFile,
                              onClick: o.onClickClear
                            },
                            null,
                            8,
                            ['loading', 'onClick']
                          )
                        ]),
                        _: 1
                      }
                    )
                  ]),
                  _: 1
                }
              ),
              l(
                we,
                { class: 'my-1 pa-1 border' },
                {
                  default: f(() => [
                    r.isUploadingFile
                      ? (F(),
                        G(
                          _,
                          { key: 0, width: '100%', height: n.height, class: 'd-flex align-center justify-center' },
                          {
                            default: f(() => [
                              l(
                                ho,
                                { indeterminate: '', size: 120, color: 'secondary' },
                                {
                                  default: f(() => [
                                    l(mt, { size: '80', color: 'grey-lighten-1', icon: 'mdi mdi-image-outline' })
                                  ]),
                                  _: 1
                                }
                              )
                            ]),
                            _: 1
                          },
                          8,
                          ['height']
                        ))
                      : (F(),
                        G(
                          _,
                          {
                            key: 1,
                            width: '100%',
                            height: n.height,
                            class: 'd-flex align-center justify-center overflow-hidden'
                          },
                          {
                            default: f(() => [
                              o.vThumbnail
                                ? (F(), Ne('img', { key: 0, src: o.vThumbnail, alt: 'Thumbnail' }, null, 8, ML))
                                : o.value
                                  ? (F(), Ne('img', { key: 1, src: o.value, alt: n.name }, null, 8, kL))
                                  : (F(),
                                    G(mt, {
                                      key: 2,
                                      size: '120',
                                      color: 'grey-lighten-1',
                                      icon: 'mdi mdi-image-outline'
                                    }))
                            ]),
                            _: 1
                          },
                          8,
                          ['height']
                        ))
                  ]),
                  _: 1
                }
              ),
              l(_, null, {
                default: f(() => [
                  l(
                    Bt,
                    {
                      variant: 'outlined',
                      density: 'compact',
                      modelValue: o.value,
                      'onUpdate:modelValue': t[0] || (t[0] = i => (o.value = i)),
                      rules: n.rules,
                      readonly: !0,
                      clearable: !0,
                      loading: r.isUploadingFile,
                      'clear-icon': 'mdi mdi-close',
                      'prepend-inner-icon': 'mdi mdi-image-sync-outline',
                      'onClick:prependInner': o.onClickChoose,
                      'onClick:clear': o.onClickClear
                    },
                    null,
                    8,
                    ['modelValue', 'rules', 'loading', 'onClick:prependInner', 'onClick:clear']
                  ),
                  C(
                    'input',
                    {
                      ref: r.id,
                      id: r.id,
                      type: 'file',
                      hidden: '',
                      accept: 'image/png, image/jpeg, image/gif',
                      onChange: t[1] || (t[1] = i => o.onChoseFile(i))
                    },
                    null,
                    40,
                    DL
                  )
                ]),
                _: 1
              })
            ]),
            _: 1
          }
        ),
        l(
          a,
          {
            modelValue: r.showUploadFailedDialog,
            'onUpdate:modelValue': t[2] || (t[2] = i => (r.showUploadFailedDialog = i))
          },
          null,
          8,
          ['modelValue']
        )
      ],
      64
    )
  )
}
const VL = ue(PL, [['render', FL]]),
  xL = Ee({
    name: 'InvalidFormDialog',
    props: { modelValue: { type: Boolean, default: !1 } },
    emits: ['update:modelValue', 'close'],
    computed: {
      dialog: {
        get() {
          return this.modelValue
        },
        set(e) {
          this.$emit('update:modelValue', e)
        }
      }
    },
    methods: {
      onClickClose() {
        ;(this.$emit('close'), (this.dialog = !1))
      }
    }
  }),
  BL = { class: 'text-capitalize' }
function UL(e, t, n, s, r, o) {
  return (
    F(),
    G(
      $t,
      {
        modelValue: e.dialog,
        'onUpdate:modelValue': t[0] || (t[0] = a => (e.dialog = a)),
        persistent: '',
        'max-width': '420'
      },
      {
        default: f(() => [
          l(
            we,
            { class: 'border pa-1' },
            {
              default: f(() => [
                l(
                  _,
                  { class: 'pa-2 text-h6 text-confirm' },
                  { default: f(() => [C('span', BL, S(e.$t('COMMON.INVALID_FORM_DATA.TITLE')), 1)]), _: 1 }
                ),
                l(qe),
                l(
                  _,
                  { class: 'pa-2' },
                  {
                    default: f(() => [
                      C('p', null, S(e.$t('COMMON.INVALID_FORM_DATA.LABEL1')), 1),
                      C('p', null, S(e.$t('COMMON.INVALID_FORM_DATA.LABEL2')), 1)
                    ]),
                    _: 1
                  }
                ),
                l(qe),
                l(
                  _,
                  { class: 'pa-2 d-flex align-center justify-space-between' },
                  {
                    default: f(() => [
                      l(Ft),
                      l(
                        ae,
                        {
                          variant: 'elevated',
                          size: 'small',
                          'min-width': '70',
                          color: 'close',
                          onClick: e.onClickClose
                        },
                        { default: f(() => [ee(S(e.$t('COMMON.ACTION.CLOSE')), 1)]), _: 1 },
                        8,
                        ['onClick']
                      )
                    ]),
                    _: 1
                  }
                )
              ]),
              _: 1
            }
          )
        ]),
        _: 1
      },
      8,
      ['modelValue']
    )
  )
}
const GL = ue(xL, [['render', UL]]),
  WL = Ee({
    name: 'SubmitFailedDialog',
    props: { modelValue: { type: Boolean, default: !1 }, error: { type: [String, Boolean], default: '' } },
    emits: ['update:modelValue', 'close'],
    computed: {
      dialog: {
        get() {
          return this.modelValue
        },
        set(e) {
          this.$emit('update:modelValue', e)
        }
      }
    },
    methods: {
      onClickClose() {
        ;(this.$emit('close'), (this.dialog = !1))
      }
    }
  }),
  HL = { class: 'text-capitalize' }
function jL(e, t, n, s, r, o) {
  return (
    F(),
    G(
      $t,
      {
        modelValue: e.dialog,
        'onUpdate:modelValue': t[0] || (t[0] = a => (e.dialog = a)),
        persistent: '',
        'max-width': '420'
      },
      {
        default: f(() => [
          l(
            we,
            { class: 'border pa-1' },
            {
              default: f(() => [
                l(
                  _,
                  { class: 'pa-2 text-h6 text-confirm' },
                  { default: f(() => [C('span', HL, S(e.$t('COMMON.SUBMIT_FAILED.TITLE')), 1)]), _: 1 }
                ),
                l(qe),
                l(
                  _,
                  { class: 'pa-2' },
                  {
                    default: f(() => [
                      C('p', null, S(e.$t('COMMON.SUBMIT_FAILED.LABEL1')), 1),
                      C('p', null, S(e.$t('COMMON.SUBMIT_FAILED.LABEL2')), 1),
                      typeof e.error == 'string' &&
                      e.$t(`COMMON.ERROR.CODE_${e.error}`) !== `COMMON.ERROR.CODE_${e.error}`
                        ? (F(),
                          G(
                            de,
                            { key: 0, class: 'mt-2', variant: 'outlined', density: 'compact', type: 'error', icon: !1 },
                            { default: f(() => [C('span', null, S(e.$t(`COMMON.ERROR.CODE_${e.error}`)), 1)]), _: 1 }
                          ))
                        : We('', !0)
                    ]),
                    _: 1
                  }
                ),
                l(qe),
                l(
                  _,
                  { class: 'pa-2 d-flex align-center justify-space-between' },
                  {
                    default: f(() => [
                      l(Ft),
                      l(
                        ae,
                        {
                          variant: 'elevated',
                          size: 'small',
                          'min-width': '70',
                          color: 'close',
                          onClick: e.onClickClose
                        },
                        { default: f(() => [ee(S(e.$t('COMMON.ACTION.CLOSE')), 1)]), _: 1 },
                        8,
                        ['onClick']
                      )
                    ]),
                    _: 1
                  }
                )
              ]),
              _: 1
            }
          )
        ]),
        _: 1
      },
      8,
      ['modelValue']
    )
  )
}
const YL = ue(WL, [['render', jL]]),
  KL = Ee({
    name: 'ConfirmCancelDialog',
    props: { modelValue: { type: Boolean, default: !1 } },
    emits: ['update:modelValue', 'confirm'],
    computed: {
      dialog: {
        get() {
          return this.modelValue
        },
        set(e) {
          this.$emit('update:modelValue', e)
        }
      }
    },
    methods: {
      onClickConfirm() {
        ;(this.$emit('confirm'), (this.dialog = !1))
      }
    }
  }),
  qL = { class: 'text-capitalize' }
function zL(e, t, n, s, r, o) {
  return (
    F(),
    G(
      $t,
      {
        modelValue: e.dialog,
        'onUpdate:modelValue': t[1] || (t[1] = a => (e.dialog = a)),
        persistent: '',
        'max-width': '420'
      },
      {
        default: f(() => [
          l(
            we,
            { class: 'border' },
            {
              default: f(() => [
                l(
                  _,
                  { class: 'pa-2 text-h6 text-confirm' },
                  { default: f(() => [C('span', qL, S(e.$t('COMMON.CONFIRM_CANCEL.TITLE')), 1)]), _: 1 }
                ),
                l(qe),
                l(
                  _,
                  { class: 'pa-2' },
                  {
                    default: f(() => [
                      C('p', null, S(e.$t('COMMON.CONFIRM_CANCEL.LABEL1')), 1),
                      C('p', null, S(e.$t('COMMON.CONFIRM_CANCEL.LABEL2')), 1)
                    ]),
                    _: 1
                  }
                ),
                l(qe),
                l(
                  _,
                  { class: 'pa-2 d-flex align-center justify-space-between' },
                  {
                    default: f(() => [
                      l(Ft),
                      l(
                        ae,
                        {
                          variant: 'elevated',
                          size: 'small',
                          'min-width': '70',
                          color: 'reject',
                          class: 'mr-2',
                          onClick: t[0] || (t[0] = a => (e.dialog = !1))
                        },
                        { default: f(() => [ee(S(e.$t('COMMON.ACTION.NO')), 1)]), _: 1 }
                      ),
                      l(
                        ae,
                        {
                          variant: 'elevated',
                          size: 'small',
                          'min-width': '70',
                          color: 'confirm',
                          onClick: e.onClickConfirm
                        },
                        { default: f(() => [ee(S(e.$t('COMMON.ACTION.YES')), 1)]), _: 1 },
                        8,
                        ['onClick']
                      )
                    ]),
                    _: 1
                  }
                )
              ]),
              _: 1
            }
          )
        ]),
        _: 1
      },
      8,
      ['modelValue']
    )
  )
}
const XL = ue(KL, [['render', zL]]),
  JL = Ee({
    name: 'ConfirmSubmitDialog',
    props: { modelValue: { type: Boolean, default: !1 }, submitting: { type: Boolean, default: !1 } },
    emits: ['update:modelValue', 'confirm'],
    computed: {
      dialog: {
        get() {
          return this.modelValue
        },
        set(e) {
          this.$emit('update:modelValue', e)
        }
      }
    },
    methods: {
      onClickConfirm() {
        this.$emit('confirm')
      }
    }
  }),
  QL = { class: 'text-capitalize' }
function ZL(e, t, n, s, r, o) {
  return (
    F(),
    G(
      $t,
      {
        modelValue: e.dialog,
        'onUpdate:modelValue': t[1] || (t[1] = a => (e.dialog = a)),
        persistent: '',
        'max-width': '420'
      },
      {
        default: f(() => [
          l(
            we,
            { class: 'border' },
            {
              default: f(() => [
                l(
                  _,
                  { class: 'pa-2 text-h6 text-confirm' },
                  { default: f(() => [C('span', QL, S(e.$t('COMMON.CONFIRM_SUBMIT.TITLE')), 1)]), _: 1 }
                ),
                l(qe),
                l(
                  _,
                  { class: 'pa-2' },
                  {
                    default: f(() => [
                      C('p', null, S(e.$t('COMMON.CONFIRM_SUBMIT.LABEL1')), 1),
                      C('p', null, S(e.$t('COMMON.CONFIRM_SUBMIT.LABEL2')), 1)
                    ]),
                    _: 1
                  }
                ),
                l(qe),
                l(
                  _,
                  { class: 'pa-2 d-flex align-center justify-space-between' },
                  {
                    default: f(() => [
                      l(Ft),
                      l(
                        ae,
                        {
                          variant: 'elevated',
                          size: 'small',
                          'min-width': '70',
                          color: 'reject',
                          class: 'mr-2',
                          loading: e.submitting,
                          onClick: t[0] || (t[0] = a => (e.dialog = !1))
                        },
                        { default: f(() => [ee(S(e.$t('COMMON.ACTION.NO')), 1)]), _: 1 },
                        8,
                        ['loading']
                      ),
                      l(
                        ae,
                        {
                          variant: 'elevated',
                          size: 'small',
                          'min-width': '70',
                          color: 'confirm',
                          loading: e.submitting,
                          onClick: e.onClickConfirm
                        },
                        { default: f(() => [ee(S(e.$t('COMMON.ACTION.YES')), 1)]), _: 1 },
                        8,
                        ['loading', 'onClick']
                      )
                    ]),
                    _: 1
                  }
                )
              ]),
              _: 1
            }
          )
        ]),
        _: 1
      },
      8,
      ['modelValue']
    )
  )
}
const e0 = ue(JL, [['render', ZL]]),
  t0 = Ee({
    name: 'ConfirmRestoreDialog',
    props: {
      modelValue: { type: Boolean, default: !1 },
      loading: { type: Boolean, default: !1 },
      name: { type: [String, Boolean], default: !1 },
      error: { type: [String, Boolean], default: '' }
    },
    emits: ['update:modelValue', 'confirm'],
    computed: {
      dialog: {
        get() {
          return this.modelValue
        },
        set(e) {
          this.$emit('update:modelValue', e)
        }
      }
    },
    methods: {
      onClickConfirm() {
        this.$emit('confirm')
      }
    }
  }),
  n0 = { class: 'text-capitalize' },
  s0 = { key: 0, class: 'text-primary font-weight-medium' }
function r0(e, t, n, s, r, o) {
  return (
    F(),
    G(
      $t,
      {
        modelValue: e.dialog,
        'onUpdate:modelValue': t[1] || (t[1] = a => (e.dialog = a)),
        'max-width': '420',
        persistent: ''
      },
      {
        default: f(() => [
          l(
            we,
            { class: 'border' },
            {
              default: f(() => [
                l(
                  _,
                  { class: 'pa-2 text-h6 text-active' },
                  { default: f(() => [C('span', n0, S(e.$t('COMMON.CONFIRM_RESTORE.TITLE')), 1)]), _: 1 }
                ),
                l(qe),
                l(
                  _,
                  { class: 'pa-2' },
                  {
                    default: f(() => [
                      C('p', null, S(e.$t('COMMON.CONFIRM_RESTORE.LABEL1')), 1),
                      e.name ? (F(), Ne('p', s0, S(e.name), 1)) : We('', !0),
                      `${e.error}` == '403'
                        ? (F(),
                          G(
                            de,
                            { key: 1, class: 'mt-2', variant: 'outlined', density: 'compact', type: 'error', icon: !1 },
                            {
                              default: f(() => [
                                C('p', null, S(e.$t('COMMON.ERROR_FORBIDDEN.LABEL1')), 1),
                                C('p', null, S(e.$t('COMMON.ERROR_FORBIDDEN.LABEL2')), 1)
                              ]),
                              _: 1
                            }
                          ))
                        : e.error
                          ? (F(),
                            G(
                              de,
                              {
                                key: 2,
                                icon: !1,
                                class: 'mt-2',
                                density: 'compact',
                                type: 'error',
                                variant: 'outlined'
                              },
                              {
                                default: f(() => [
                                  C('p', null, S(e.$t('COMMON.CONFIRM_RESTORE.ERROR1')), 1),
                                  C('p', null, S(e.$t('COMMON.CONFIRM_RESTORE.ERROR2')), 1)
                                ]),
                                _: 1
                              }
                            ))
                          : We('', !0)
                    ]),
                    _: 1
                  }
                ),
                l(qe),
                l(
                  _,
                  { class: 'pa-2 d-flex align-center justify-space-between' },
                  {
                    default: f(() => [
                      l(Ft),
                      l(
                        ae,
                        {
                          loading: e.loading,
                          class: 'mr-2',
                          color: 'reject',
                          'min-width': '70',
                          size: 'small',
                          variant: 'elevated',
                          onClick: t[0] || (t[0] = a => (e.dialog = !1))
                        },
                        { default: f(() => [ee(S(e.$t('COMMON.ACTION.NO')), 1)]), _: 1 },
                        8,
                        ['loading']
                      ),
                      l(
                        ae,
                        {
                          loading: e.loading,
                          color: 'active',
                          'min-width': '70',
                          size: 'small',
                          variant: 'elevated',
                          onClick: e.onClickConfirm
                        },
                        { default: f(() => [ee(S(e.$t('COMMON.ACTION.YES')), 1)]), _: 1 },
                        8,
                        ['loading', 'onClick']
                      )
                    ]),
                    _: 1
                  }
                )
              ]),
              _: 1
            }
          )
        ]),
        _: 1
      },
      8,
      ['modelValue']
    )
  )
}
const o0 = ue(t0, [['render', r0]]),
  a0 = Ee({
    name: 'ConfirmDeleteDialog',
    props: {
      modelValue: { type: Boolean, default: !1 },
      loading: { type: Boolean, default: !1 },
      name: { type: [String, Boolean], default: !1 },
      error: { type: [String, Boolean], default: '' }
    },
    emits: ['update:modelValue', 'confirm'],
    computed: {
      dialog: {
        get() {
          return this.modelValue
        },
        set(e) {
          this.$emit('update:modelValue', e)
        }
      }
    },
    methods: {
      onClickConfirm() {
        this.$emit('confirm')
      }
    }
  }),
  i0 = { class: 'text-capitalize' },
  l0 = { key: 0, class: 'text-primary font-weight-medium' }
function u0(e, t, n, s, r, o) {
  return (
    F(),
    G(
      $t,
      {
        modelValue: e.dialog,
        'onUpdate:modelValue': t[1] || (t[1] = a => (e.dialog = a)),
        persistent: '',
        'max-width': '420'
      },
      {
        default: f(() => [
          l(
            we,
            { class: 'border' },
            {
              default: f(() => [
                l(
                  _,
                  { class: 'pa-2 text-h6 text-confirm' },
                  { default: f(() => [C('span', i0, S(e.$t('COMMON.CONFIRM_DELETE.TITLE')), 1)]), _: 1 }
                ),
                l(qe),
                l(
                  _,
                  { class: 'pa-2' },
                  {
                    default: f(() => [
                      C('p', null, S(e.$t('COMMON.CONFIRM_DELETE.LABEL1')), 1),
                      e.name ? (F(), Ne('p', l0, S(e.name), 1)) : We('', !0),
                      `${e.error}` == '403'
                        ? (F(),
                          G(
                            de,
                            { key: 1, class: 'mt-2', variant: 'outlined', density: 'compact', type: 'error', icon: !1 },
                            {
                              default: f(() => [
                                C('p', null, S(e.$t('COMMON.ERROR_FORBIDDEN.LABEL1')), 1),
                                C('p', null, S(e.$t('COMMON.ERROR_FORBIDDEN.LABEL2')), 1)
                              ]),
                              _: 1
                            }
                          ))
                        : e.error
                          ? (F(),
                            G(
                              de,
                              {
                                key: 2,
                                class: 'mt-2',
                                variant: 'outlined',
                                density: 'compact',
                                type: 'error',
                                icon: !1
                              },
                              {
                                default: f(() => [
                                  C('p', null, S(e.$t('COMMON.CONFIRM_DELETE.ERROR1')), 1),
                                  C('p', null, S(e.$t('COMMON.CONFIRM_DELETE.ERROR2')), 1)
                                ]),
                                _: 1
                              }
                            ))
                          : We('', !0)
                    ]),
                    _: 1
                  }
                ),
                l(qe),
                l(
                  _,
                  { class: 'pa-2 d-flex align-center justify-space-between' },
                  {
                    default: f(() => [
                      l(Ft),
                      l(
                        ae,
                        {
                          variant: 'elevated',
                          size: 'small',
                          'min-width': '70',
                          color: 'reject',
                          class: 'mr-2',
                          loading: e.loading,
                          onClick: t[0] || (t[0] = a => (e.dialog = !1))
                        },
                        { default: f(() => [ee(S(e.$t('COMMON.ACTION.NO')), 1)]), _: 1 },
                        8,
                        ['loading']
                      ),
                      l(
                        ae,
                        {
                          variant: 'elevated',
                          size: 'small',
                          'min-width': '70',
                          color: 'confirm',
                          loading: e.loading,
                          onClick: e.onClickConfirm
                        },
                        { default: f(() => [ee(S(e.$t('COMMON.ACTION.YES')), 1)]), _: 1 },
                        8,
                        ['loading', 'onClick']
                      )
                    ]),
                    _: 1
                  }
                )
              ]),
              _: 1
            }
          )
        ]),
        _: 1
      },
      8,
      ['modelValue']
    )
  )
}
const c0 = ue(a0, [['render', u0]]),
  d0 = Ee({
    name: 'ConfirmRemoveDialog',
    props: {
      modelValue: { type: Boolean, default: !1 },
      loading: { type: Boolean, default: !1 },
      name: { type: [String, Boolean], default: !1 },
      error: { type: [String, Boolean], default: '' }
    },
    emits: ['update:modelValue', 'confirm'],
    computed: {
      dialog: {
        get() {
          return this.modelValue
        },
        set(e) {
          this.$emit('update:modelValue', e)
        }
      }
    },
    methods: {
      onClickConfirm() {
        this.$emit('confirm')
      }
    }
  }),
  f0 = { class: 'text-capitalize' },
  m0 = { key: 0, class: 'text-primary font-weight-medium' }
function h0(e, t, n, s, r, o) {
  return (
    F(),
    G(
      $t,
      {
        modelValue: e.dialog,
        'onUpdate:modelValue': t[1] || (t[1] = a => (e.dialog = a)),
        'max-width': '420',
        persistent: ''
      },
      {
        default: f(() => [
          l(
            we,
            { class: 'border' },
            {
              default: f(() => [
                l(
                  _,
                  { class: 'pa-2 text-h6 text-confirm' },
                  { default: f(() => [C('span', f0, S(e.$t('COMMON.CONFIRM_REMOVE.TITLE')), 1)]), _: 1 }
                ),
                l(qe),
                l(
                  _,
                  { class: 'pa-2' },
                  {
                    default: f(() => [
                      C('p', null, S(e.$t('COMMON.CONFIRM_REMOVE.LABEL1')), 1),
                      e.name ? (F(), Ne('p', m0, S(e.name), 1)) : We('', !0),
                      `${e.error}` == '403'
                        ? (F(),
                          G(
                            de,
                            { key: 1, class: 'mt-2', variant: 'outlined', density: 'compact', type: 'error', icon: !1 },
                            {
                              default: f(() => [
                                C('p', null, S(e.$t('COMMON.ERROR_FORBIDDEN.LABEL1')), 1),
                                C('p', null, S(e.$t('COMMON.ERROR_FORBIDDEN.LABEL2')), 1)
                              ]),
                              _: 1
                            }
                          ))
                        : e.error
                          ? (F(),
                            G(
                              de,
                              {
                                key: 2,
                                icon: !1,
                                class: 'mt-2',
                                density: 'compact',
                                type: 'error',
                                variant: 'outlined'
                              },
                              {
                                default: f(() => [
                                  C('p', null, S(e.$t('COMMON.CONFIRM_REMOVE.ERROR1')), 1),
                                  C('p', null, S(e.$t('COMMON.CONFIRM_REMOVE.ERROR2')), 1)
                                ]),
                                _: 1
                              }
                            ))
                          : We('', !0)
                    ]),
                    _: 1
                  }
                ),
                l(qe),
                l(
                  _,
                  { class: 'pa-2 d-flex align-center justify-space-between' },
                  {
                    default: f(() => [
                      l(Ft),
                      l(
                        ae,
                        {
                          loading: e.loading,
                          class: 'mr-2',
                          color: 'reject',
                          'min-width': '70',
                          size: 'small',
                          variant: 'elevated',
                          onClick: t[0] || (t[0] = a => (e.dialog = !1))
                        },
                        { default: f(() => [ee(S(e.$t('COMMON.ACTION.NO')), 1)]), _: 1 },
                        8,
                        ['loading']
                      ),
                      l(
                        ae,
                        {
                          loading: e.loading,
                          color: 'confirm',
                          'min-width': '70',
                          size: 'small',
                          variant: 'elevated',
                          onClick: e.onClickConfirm
                        },
                        { default: f(() => [ee(S(e.$t('COMMON.ACTION.YES')), 1)]), _: 1 },
                        8,
                        ['loading', 'onClick']
                      )
                    ]),
                    _: 1
                  }
                )
              ]),
              _: 1
            }
          )
        ]),
        _: 1
      },
      8,
      ['modelValue']
    )
  )
}
const g0 = ue(d0, [['render', h0]]),
  p0 = Ee({
    name: 'ConfirmAssignDialog',
    props: {
      modelValue: { type: Boolean, default: !1 },
      loading: { type: Boolean, default: !1 },
      name: { type: [String, Boolean], default: !1 },
      error: { type: [String, Boolean], default: '' }
    },
    emits: ['update:modelValue', 'confirm'],
    computed: {
      dialog: {
        get() {
          return this.modelValue
        },
        set(e) {
          this.$emit('update:modelValue', e)
        }
      }
    },
    methods: {
      onClickConfirm() {
        this.$emit('confirm')
      }
    }
  }),
  E0 = { class: 'text-capitalize' },
  _0 = { key: 0, class: 'text-primary font-weight-medium' }
function y0(e, t, n, s, r, o) {
  return (
    F(),
    G(
      $t,
      {
        modelValue: e.dialog,
        'onUpdate:modelValue': t[1] || (t[1] = a => (e.dialog = a)),
        persistent: '',
        'max-width': '420'
      },
      {
        default: f(() => [
          l(
            we,
            { class: 'border' },
            {
              default: f(() => [
                l(
                  _,
                  { class: 'pa-2 text-h6 text-confirm' },
                  { default: f(() => [C('span', E0, S(e.$t('COMMON.CONFIRM_ASSIGN.TITLE')), 1)]), _: 1 }
                ),
                l(qe),
                l(
                  _,
                  { class: 'pa-2' },
                  {
                    default: f(() => [
                      C('p', null, S(e.$t('COMMON.CONFIRM_ASSIGN.LABEL1')), 1),
                      e.name ? (F(), Ne('p', _0, S(e.name), 1)) : We('', !0),
                      `${e.error}` == '403'
                        ? (F(),
                          G(
                            de,
                            { key: 1, class: 'mt-2', variant: 'outlined', density: 'compact', type: 'error', icon: !1 },
                            {
                              default: f(() => [
                                C('p', null, S(e.$t('COMMON.ERROR_FORBIDDEN.LABEL1')), 1),
                                C('p', null, S(e.$t('COMMON.ERROR_FORBIDDEN.LABEL2')), 1)
                              ]),
                              _: 1
                            }
                          ))
                        : e.error
                          ? (F(),
                            G(
                              de,
                              {
                                key: 2,
                                class: 'mt-2',
                                variant: 'outlined',
                                density: 'compact',
                                type: 'error',
                                icon: !1
                              },
                              {
                                default: f(() => [
                                  C('p', null, S(e.$t('COMMON.CONFIRM_ASSIGN.ERROR1')), 1),
                                  C('p', null, S(e.$t('COMMON.CONFIRM_ASSIGN.ERROR2')), 1)
                                ]),
                                _: 1
                              }
                            ))
                          : We('', !0)
                    ]),
                    _: 1
                  }
                ),
                l(qe),
                l(
                  _,
                  { class: 'pa-2 d-flex align-center justify-space-between' },
                  {
                    default: f(() => [
                      l(Ft),
                      l(
                        ae,
                        {
                          variant: 'elevated',
                          size: 'small',
                          'min-width': '70',
                          color: 'reject',
                          class: 'mr-2',
                          loading: e.loading,
                          onClick: t[0] || (t[0] = a => (e.dialog = !1))
                        },
                        { default: f(() => [ee(S(e.$t('COMMON.ACTION.NO')), 1)]), _: 1 },
                        8,
                        ['loading']
                      ),
                      l(
                        ae,
                        {
                          variant: 'elevated',
                          size: 'small',
                          'min-width': '70',
                          color: 'confirm',
                          loading: e.loading,
                          onClick: e.onClickConfirm
                        },
                        { default: f(() => [ee(S(e.$t('COMMON.ACTION.YES')), 1)]), _: 1 },
                        8,
                        ['loading', 'onClick']
                      )
                    ]),
                    _: 1
                  }
                )
              ]),
              _: 1
            }
          )
        ]),
        _: 1
      },
      8,
      ['modelValue']
    )
  )
}
const v0 = ue(p0, [['render', y0]]),
  b0 = Ee({
    name: 'ConfirmUnlockDialog',
    props: {
      modelValue: { type: Boolean, default: !1 },
      loading: { type: Boolean, default: !1 },
      name: { type: [String, Boolean], default: !1 },
      error: { type: [String, Boolean], default: '' }
    },
    emits: ['update:modelValue', 'confirm'],
    computed: {
      dialog: {
        get() {
          return this.modelValue
        },
        set(e) {
          this.$emit('update:modelValue', e)
        }
      }
    },
    methods: {
      onClickConfirm() {
        this.$emit('confirm')
      }
    }
  }),
  S0 = { class: 'text-capitalize' },
  R0 = { key: 0, class: 'text-primary font-weight-medium' }
function O0(e, t, n, s, r, o) {
  return (
    F(),
    G(
      $t,
      {
        modelValue: e.dialog,
        'onUpdate:modelValue': t[1] || (t[1] = a => (e.dialog = a)),
        persistent: '',
        'max-width': '420'
      },
      {
        default: f(() => [
          l(
            we,
            { class: 'border' },
            {
              default: f(() => [
                l(
                  _,
                  { class: 'pa-2 text-h6 text-confirm' },
                  { default: f(() => [C('span', S0, S(e.$t('COMMON.CONFIRM_UNLOCK.TITLE')), 1)]), _: 1 }
                ),
                l(qe),
                l(
                  _,
                  { class: 'pa-2' },
                  {
                    default: f(() => [
                      C('p', null, S(e.$t('COMMON.CONFIRM_UNLOCK.LABEL1')), 1),
                      e.name ? (F(), Ne('p', R0, S(e.name), 1)) : We('', !0),
                      `${e.error}` == '403'
                        ? (F(),
                          G(
                            de,
                            { key: 1, class: 'mt-2', variant: 'outlined', density: 'compact', type: 'error', icon: !1 },
                            {
                              default: f(() => [
                                C('p', null, S(e.$t('COMMON.ERROR_FORBIDDEN.LABEL1')), 1),
                                C('p', null, S(e.$t('COMMON.ERROR_FORBIDDEN.LABEL2')), 1)
                              ]),
                              _: 1
                            }
                          ))
                        : e.error
                          ? (F(),
                            G(
                              de,
                              {
                                key: 2,
                                class: 'mt-2',
                                variant: 'outlined',
                                density: 'compact',
                                type: 'error',
                                icon: !1
                              },
                              {
                                default: f(() => [
                                  C('p', null, S(e.$t('COMMON.CONFIRM_UNLOCK.ERROR1')), 1),
                                  C('p', null, S(e.$t('COMMON.CONFIRM_UNLOCK.ERROR2')), 1)
                                ]),
                                _: 1
                              }
                            ))
                          : We('', !0)
                    ]),
                    _: 1
                  }
                ),
                l(qe),
                l(
                  _,
                  { class: 'pa-2 d-flex align-center justify-space-between' },
                  {
                    default: f(() => [
                      l(Ft),
                      l(
                        ae,
                        {
                          variant: 'elevated',
                          size: 'small',
                          'min-width': '70',
                          color: 'reject',
                          class: 'mr-2',
                          loading: e.loading,
                          onClick: t[0] || (t[0] = a => (e.dialog = !1))
                        },
                        { default: f(() => [ee(S(e.$t('COMMON.ACTION.NO')), 1)]), _: 1 },
                        8,
                        ['loading']
                      ),
                      l(
                        ae,
                        {
                          variant: 'elevated',
                          size: 'small',
                          'min-width': '70',
                          color: 'confirm',
                          loading: e.loading,
                          onClick: e.onClickConfirm
                        },
                        { default: f(() => [ee(S(e.$t('COMMON.ACTION.YES')), 1)]), _: 1 },
                        8,
                        ['loading', 'onClick']
                      )
                    ]),
                    _: 1
                  }
                )
              ]),
              _: 1
            }
          )
        ]),
        _: 1
      },
      8,
      ['modelValue']
    )
  )
}
const C0 = ue(b0, [['render', O0]]),
  A0 = Ee({
    name: 'ConfirmCloseDialog',
    props: {
      modelValue: { type: Boolean, default: !1 },
      loading: { type: Boolean, default: !1 },
      name: { type: [String, Boolean], default: !1 },
      error: { type: [String, Boolean], default: '' }
    },
    emits: ['update:modelValue', 'confirm'],
    computed: {
      dialog: {
        get() {
          return this.modelValue
        },
        set(e) {
          this.$emit('update:modelValue', e)
        }
      }
    },
    methods: {
      onClickConfirm() {
        this.$emit('confirm')
      }
    }
  }),
  I0 = { class: 'text-capitalize' },
  T0 = { key: 0, class: 'text-primary font-weight-medium' }
function N0(e, t, n, s, r, o) {
  return (
    F(),
    G(
      $t,
      {
        modelValue: e.dialog,
        'onUpdate:modelValue': t[1] || (t[1] = a => (e.dialog = a)),
        'max-width': '420',
        persistent: ''
      },
      {
        default: f(() => [
          l(
            we,
            { class: 'border' },
            {
              default: f(() => [
                l(
                  _,
                  { class: 'pa-2 text-h6 text-confirm' },
                  { default: f(() => [C('span', I0, S(e.$t('COMMON.CONFIRM_CLOSE.TITLE')), 1)]), _: 1 }
                ),
                l(qe),
                l(
                  _,
                  { class: 'pa-2' },
                  {
                    default: f(() => [
                      C('p', null, S(e.$t('COMMON.CONFIRM_CLOSE.LABEL1')), 1),
                      e.name ? (F(), Ne('p', T0, S(e.name), 1)) : We('', !0),
                      `${e.error}` == '403'
                        ? (F(),
                          G(
                            de,
                            { key: 1, class: 'mt-2', variant: 'outlined', density: 'compact', type: 'error', icon: !1 },
                            {
                              default: f(() => [
                                C('p', null, S(e.$t('COMMON.ERROR_FORBIDDEN.LABEL1')), 1),
                                C('p', null, S(e.$t('COMMON.ERROR_FORBIDDEN.LABEL2')), 1)
                              ]),
                              _: 1
                            }
                          ))
                        : e.error
                          ? (F(),
                            G(
                              de,
                              {
                                key: 2,
                                icon: !1,
                                class: 'mt-2',
                                density: 'compact',
                                type: 'error',
                                variant: 'outlined'
                              },
                              {
                                default: f(() => [
                                  C('p', null, S(e.$t('COMMON.CONFIRM_CLOSE.ERROR1')), 1),
                                  C('p', null, S(e.$t('COMMON.CONFIRM_CLOSE.ERROR2')), 1)
                                ]),
                                _: 1
                              }
                            ))
                          : We('', !0)
                    ]),
                    _: 1
                  }
                ),
                l(qe),
                l(
                  _,
                  { class: 'pa-2 d-flex align-center justify-space-between' },
                  {
                    default: f(() => [
                      l(Ft),
                      l(
                        ae,
                        {
                          loading: e.loading,
                          class: 'mr-2',
                          color: 'reject',
                          'min-width': '70',
                          size: 'small',
                          variant: 'elevated',
                          onClick: t[0] || (t[0] = a => (e.dialog = !1))
                        },
                        { default: f(() => [ee(S(e.$t('COMMON.ACTION.NO')), 1)]), _: 1 },
                        8,
                        ['loading']
                      ),
                      l(
                        ae,
                        {
                          loading: e.loading,
                          color: 'confirm',
                          'min-width': '70',
                          size: 'small',
                          variant: 'elevated',
                          onClick: e.onClickConfirm
                        },
                        { default: f(() => [ee(S(e.$t('COMMON.ACTION.YES')), 1)]), _: 1 },
                        8,
                        ['loading', 'onClick']
                      )
                    ]),
                    _: 1
                  }
                )
              ]),
              _: 1
            }
          )
        ]),
        _: 1
      },
      8,
      ['modelValue']
    )
  )
}
const w0 = ue(A0, [['render', N0]]),
  L0 = Ee({
    name: 'ConfirmLockDialog',
    props: {
      modelValue: { type: Boolean, default: !1 },
      loading: { type: Boolean, default: !1 },
      name: { type: [String, Boolean], default: !1 },
      error: { type: [String, Boolean], default: '' }
    },
    emits: ['update:modelValue', 'confirm'],
    computed: {
      dialog: {
        get() {
          return this.modelValue
        },
        set(e) {
          this.$emit('update:modelValue', e)
        }
      }
    },
    methods: {
      onClickConfirm() {
        this.$emit('confirm')
      }
    }
  }),
  P0 = { class: 'text-capitalize' },
  $0 = { key: 0, class: 'text-primary font-weight-medium' }
function M0(e, t, n, s, r, o) {
  return (
    F(),
    G(
      $t,
      {
        modelValue: e.dialog,
        'onUpdate:modelValue': t[1] || (t[1] = a => (e.dialog = a)),
        persistent: '',
        'max-width': '420'
      },
      {
        default: f(() => [
          l(
            we,
            { class: 'border' },
            {
              default: f(() => [
                l(
                  _,
                  { class: 'pa-2 text-h6 text-confirm' },
                  { default: f(() => [C('span', P0, S(e.$t('COMMON.CONFIRM_LOCK.TITLE')), 1)]), _: 1 }
                ),
                l(qe),
                l(
                  _,
                  { class: 'pa-2' },
                  {
                    default: f(() => [
                      C('p', null, S(e.$t('COMMON.CONFIRM_LOCK.LABEL1')), 1),
                      e.name ? (F(), Ne('p', $0, S(e.name), 1)) : We('', !0),
                      `${e.error}` == '403'
                        ? (F(),
                          G(
                            de,
                            { key: 1, class: 'mt-2', variant: 'outlined', density: 'compact', type: 'error', icon: !1 },
                            {
                              default: f(() => [
                                C('p', null, S(e.$t('COMMON.ERROR_FORBIDDEN.LABEL1')), 1),
                                C('p', null, S(e.$t('COMMON.ERROR_FORBIDDEN.LABEL2')), 1)
                              ]),
                              _: 1
                            }
                          ))
                        : e.error
                          ? (F(),
                            G(
                              de,
                              {
                                key: 2,
                                class: 'mt-2',
                                variant: 'outlined',
                                density: 'compact',
                                type: 'error',
                                icon: !1
                              },
                              {
                                default: f(() => [
                                  C('p', null, S(e.$t('COMMON.CONFIRM_LOCK.ERROR1')), 1),
                                  C('p', null, S(e.$t('COMMON.CONFIRM_LOCK.ERROR2')), 1)
                                ]),
                                _: 1
                              }
                            ))
                          : We('', !0)
                    ]),
                    _: 1
                  }
                ),
                l(qe),
                l(
                  _,
                  { class: 'pa-2 d-flex align-center justify-space-between' },
                  {
                    default: f(() => [
                      l(Ft),
                      l(
                        ae,
                        {
                          variant: 'elevated',
                          size: 'small',
                          'min-width': '70',
                          color: 'reject',
                          class: 'mr-2',
                          loading: e.loading,
                          onClick: t[0] || (t[0] = a => (e.dialog = !1))
                        },
                        { default: f(() => [ee(S(e.$t('COMMON.ACTION.NO')), 1)]), _: 1 },
                        8,
                        ['loading']
                      ),
                      l(
                        ae,
                        {
                          variant: 'elevated',
                          size: 'small',
                          'min-width': '70',
                          color: 'confirm',
                          loading: e.loading,
                          onClick: e.onClickConfirm
                        },
                        { default: f(() => [ee(S(e.$t('COMMON.ACTION.YES')), 1)]), _: 1 },
                        8,
                        ['loading', 'onClick']
                      )
                    ]),
                    _: 1
                  }
                )
              ]),
              _: 1
            }
          )
        ]),
        _: 1
      },
      8,
      ['modelValue']
    )
  )
}
const k0 = ue(L0, [['render', M0]]),
  D0 = Ee({
    name: 'ConfirmShowDialog',
    props: {
      modelValue: { type: Boolean, default: !1 },
      loading: { type: Boolean, default: !1 },
      name: { type: [String, Boolean], default: !1 },
      error: { type: [String, Boolean], default: '' }
    },
    emits: ['update:modelValue', 'confirm'],
    computed: {
      dialog: {
        get() {
          return this.modelValue
        },
        set(e) {
          this.$emit('update:modelValue', e)
        }
      }
    },
    methods: {
      onClickConfirm() {
        this.$emit('confirm')
      }
    }
  }),
  F0 = { class: 'text-capitalize' },
  V0 = { key: 0, class: 'text-primary font-weight-medium' }
function x0(e, t, n, s, r, o) {
  return (
    F(),
    G(
      $t,
      {
        modelValue: e.dialog,
        'onUpdate:modelValue': t[1] || (t[1] = a => (e.dialog = a)),
        persistent: '',
        'max-width': '420'
      },
      {
        default: f(() => [
          l(
            we,
            { class: 'border' },
            {
              default: f(() => [
                l(
                  _,
                  { class: 'pa-2 text-h6 text-confirm' },
                  { default: f(() => [C('span', F0, S(e.$t('COMMON.CONFIRM_SHOW.TITLE')), 1)]), _: 1 }
                ),
                l(qe),
                l(
                  _,
                  { class: 'pa-2' },
                  {
                    default: f(() => [
                      C('p', null, S(e.$t('COMMON.CONFIRM_SHOW.LABEL1')), 1),
                      e.name ? (F(), Ne('p', V0, S(e.name), 1)) : We('', !0),
                      `${e.error}` == '403'
                        ? (F(),
                          G(
                            de,
                            { key: 1, class: 'mt-2', variant: 'outlined', density: 'compact', type: 'error', icon: !1 },
                            {
                              default: f(() => [
                                C('p', null, S(e.$t('COMMON.ERROR_FORBIDDEN.LABEL1')), 1),
                                C('p', null, S(e.$t('COMMON.ERROR_FORBIDDEN.LABEL2')), 1)
                              ]),
                              _: 1
                            }
                          ))
                        : e.error
                          ? (F(),
                            G(
                              de,
                              {
                                key: 2,
                                class: 'mt-2',
                                variant: 'outlined',
                                density: 'compact',
                                type: 'error',
                                icon: !1
                              },
                              {
                                default: f(() => [
                                  C('p', null, S(e.$t('COMMON.CONFIRM_SHOW.ERROR1')), 1),
                                  C('p', null, S(e.$t('COMMON.CONFIRM_SHOW.ERROR2')), 1)
                                ]),
                                _: 1
                              }
                            ))
                          : We('', !0)
                    ]),
                    _: 1
                  }
                ),
                l(qe),
                l(
                  _,
                  { class: 'pa-2 d-flex align-center justify-space-between' },
                  {
                    default: f(() => [
                      l(Ft),
                      l(
                        ae,
                        {
                          variant: 'elevated',
                          size: 'small',
                          'min-width': '70',
                          color: 'reject',
                          class: 'mr-2',
                          loading: e.loading,
                          onClick: t[0] || (t[0] = a => (e.dialog = !1))
                        },
                        { default: f(() => [ee(S(e.$t('COMMON.ACTION.NO')), 1)]), _: 1 },
                        8,
                        ['loading']
                      ),
                      l(
                        ae,
                        {
                          variant: 'elevated',
                          size: 'small',
                          'min-width': '70',
                          color: 'confirm',
                          loading: e.loading,
                          onClick: e.onClickConfirm
                        },
                        { default: f(() => [ee(S(e.$t('COMMON.ACTION.YES')), 1)]), _: 1 },
                        8,
                        ['loading', 'onClick']
                      )
                    ]),
                    _: 1
                  }
                )
              ]),
              _: 1
            }
          )
        ]),
        _: 1
      },
      8,
      ['modelValue']
    )
  )
}
const B0 = ue(D0, [['render', x0]]),
  U0 = Ee({
    name: 'ConfirmHideDialog',
    props: {
      modelValue: { type: Boolean, default: !1 },
      loading: { type: Boolean, default: !1 },
      name: { type: [String, Boolean], default: !1 },
      error: { type: [String, Boolean], default: '' }
    },
    emits: ['update:modelValue', 'confirm'],
    computed: {
      dialog: {
        get() {
          return this.modelValue
        },
        set(e) {
          this.$emit('update:modelValue', e)
        }
      }
    },
    methods: {
      onClickConfirm() {
        this.$emit('confirm')
      }
    }
  }),
  G0 = { class: 'text-capitalize' },
  W0 = { key: 0, class: 'text-primary font-weight-medium' }
function H0(e, t, n, s, r, o) {
  return (
    F(),
    G(
      $t,
      {
        modelValue: e.dialog,
        'onUpdate:modelValue': t[1] || (t[1] = a => (e.dialog = a)),
        persistent: '',
        'max-width': '420'
      },
      {
        default: f(() => [
          l(
            we,
            { class: 'border' },
            {
              default: f(() => [
                l(
                  _,
                  { class: 'pa-2 text-h6 text-confirm' },
                  { default: f(() => [C('span', G0, S(e.$t('COMMON.CONFIRM_HIDE.TITLE')), 1)]), _: 1 }
                ),
                l(qe),
                l(
                  _,
                  { class: 'pa-2' },
                  {
                    default: f(() => [
                      C('p', null, S(e.$t('COMMON.CONFIRM_HIDE.LABEL1')), 1),
                      e.name ? (F(), Ne('p', W0, S(e.name), 1)) : We('', !0),
                      `${e.error}` == '403'
                        ? (F(),
                          G(
                            de,
                            { key: 1, class: 'mt-2', variant: 'outlined', density: 'compact', type: 'error', icon: !1 },
                            {
                              default: f(() => [
                                C('p', null, S(e.$t('COMMON.ERROR_FORBIDDEN.LABEL1')), 1),
                                C('p', null, S(e.$t('COMMON.ERROR_FORBIDDEN.LABEL2')), 1)
                              ]),
                              _: 1
                            }
                          ))
                        : e.error
                          ? (F(),
                            G(
                              de,
                              {
                                key: 2,
                                class: 'mt-2',
                                variant: 'outlined',
                                density: 'compact',
                                type: 'error',
                                icon: !1
                              },
                              {
                                default: f(() => [
                                  C('p', null, S(e.$t('COMMON.CONFIRM_HIDE.ERROR1')), 1),
                                  C('p', null, S(e.$t('COMMON.CONFIRM_HIDE.ERROR2')), 1)
                                ]),
                                _: 1
                              }
                            ))
                          : We('', !0)
                    ]),
                    _: 1
                  }
                ),
                l(qe),
                l(
                  _,
                  { class: 'pa-2 d-flex align-center justify-space-between' },
                  {
                    default: f(() => [
                      l(Ft),
                      l(
                        ae,
                        {
                          variant: 'elevated',
                          size: 'small',
                          'min-width': '70',
                          color: 'reject',
                          class: 'mr-2',
                          loading: e.loading,
                          onClick: t[0] || (t[0] = a => (e.dialog = !1))
                        },
                        { default: f(() => [ee(S(e.$t('COMMON.ACTION.NO')), 1)]), _: 1 },
                        8,
                        ['loading']
                      ),
                      l(
                        ae,
                        {
                          variant: 'elevated',
                          size: 'small',
                          'min-width': '70',
                          color: 'confirm',
                          loading: e.loading,
                          onClick: e.onClickConfirm
                        },
                        { default: f(() => [ee(S(e.$t('COMMON.ACTION.YES')), 1)]), _: 1 },
                        8,
                        ['loading', 'onClick']
                      )
                    ]),
                    _: 1
                  }
                )
              ]),
              _: 1
            }
          )
        ]),
        _: 1
      },
      8,
      ['modelValue']
    )
  )
}
const j0 = ue(U0, [['render', H0]]),
  Y0 = (e, t = 'DATE_ONLY_TYPE_01', n = 'Asia/Ho_Chi_Minh') => {
    if (typeof e != 'string' && typeof e != 'number' && !(e instanceof Date)) return ''
    let s = e
    if (typeof e == 'string')
      if (e.includes('T') || e.length > 10) s = new Date(e)
      else {
        const u = new Date(`${e}T00:00:00.000Z`),
          c = new Date(u.toLocaleString('en', { timeZone: 'UTC' })),
          d = new Date(c.toLocaleString('en', { timeZone: n })),
          m = c.getTime() - d.getTime()
        s = new Date(c.getTime() + m)
      }
    if ((typeof e == 'number' && (s = new Date(e)), isNaN(s))) return ''
    const r = s.toLocaleDateString('en', {
        timeZone: n,
        timeZoneName: 'longOffset',
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: !1,
        fractionalSecondDigits: 3
      }),
      o = r.substring(6, 10),
      a = r.substring(0, 2),
      i = r.substring(3, 5)
    return t === 'DATE_ONLY_TYPE_01'
      ? `${i}-${a}-${o}`
      : t === 'DATE_ONLY_TYPE_02'
        ? `${a}-${i}-${o}`
        : `${i}-${a}-${o}`
  },
  K0 = (e, t = 'TIME_ONLY_TYPE_01', n = 'Asia/Ho_Chi_Minh') => {
    if (typeof e != 'string' && typeof e != 'number' && !(e instanceof Date)) return ''
    let s = e
    if (typeof e == 'string')
      if (e.includes('T') || e.length > 10) s = new Date(e)
      else {
        const a = new Date(`${e}T00:00:00.000Z`),
          i = new Date(a.toLocaleString('en', { timeZone: 'UTC' })),
          u = new Date(i.toLocaleString('en', { timeZone: n })),
          c = i.getTime() - u.getTime()
        s = new Date(i.getTime() + c)
      }
    if ((typeof e == 'number' && (s = new Date(e)), isNaN(s))) return ''
    const r = s.toLocaleDateString('en', {
      timeZone: n,
      timeZoneName: 'longOffset',
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: !1,
      fractionalSecondDigits: 3
    })
    let o = r.substring(12, 20)
    return (
      t === 'TIME_ONLY_TYPE_01' ? (o = r.substring(12, 20)) : t === 'DATE_TIME_TYPE_02' && (o = r.substring(12, 25)),
      o.substring(0, 2) === '24' && (o = `00${o.substring(2)}`),
      o
    )
  },
  q0 = (e, t = 'DATE_TIME_TYPE_01', n = 'Asia/Ho_Chi_Minh') => {
    if (typeof e != 'string' && typeof e != 'number' && !(e instanceof Date)) return ''
    let s = e
    if (typeof e == 'string')
      if (e.includes('T') || e.length > 10) s = new Date(e)
      else {
        const c = new Date(`${e}T00:00:00.000Z`),
          d = new Date(c.toLocaleString('en', { timeZone: 'UTC' })),
          m = new Date(d.toLocaleString('en', { timeZone: n })),
          h = d.getTime() - m.getTime()
        s = new Date(d.getTime() + h)
      }
    if ((typeof e == 'number' && (s = new Date(e)), isNaN(s))) return ''
    const r = s.toLocaleDateString('en', {
      timeZone: n,
      timeZoneName: 'longOffset',
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: !1,
      fractionalSecondDigits: 3
    })
    let o = r.substring(12, 20)
    ;(t === 'DATE_TIME_TYPE_03' && (o = r.substring(12, 25)), o.substring(0, 2) === '24' && (o = `00${o.substring(2)}`))
    const a = r.substring(6, 10),
      i = r.substring(0, 2),
      u = r.substring(3, 5)
    return t === 'DATE_TIME_TYPE_01'
      ? `${o} ${u}-${i}-${a}`
      : t === 'DATE_TIME_TYPE_02'
        ? `${a}-${i}-${u} ${o}`
        : t === 'DATE_TIME_TYPE_03'
          ? `${a}-${i}-${u} ${o}`
          : `${o} ${u}-${i}-${a}`
  },
  Ya = (e, t = 'NUMBER_TYPE_01', n = 2) => {
    if (e === void 0 || e === null || (typeof e == 'string' && e.trim() === '')) return ''
    if ((typeof e != 'string' && typeof e != 'number') || (typeof n != 'string' && typeof n != 'number')) return 'NaN'
    let s = parseInt(n, 10)
    s = s > 0 ? s : 0
    let r = s > 0 ? s : 2,
      a = `${parseFloat(`${e}`).toFixed(r)}`,
      i = a.substring(0, a.indexOf('.')),
      u = a.substring(a.indexOf('.') + 1),
      c = ''
    return (
      t === 'NUMBER_TYPE_01'
        ? ((c = i.replace(/(\d)(?=(\d{3})+(?:\.\d+)?$)/g, '$1.')), s > 0 && (c = `${c},${u}`))
        : t === 'NUMBER_TYPE_02'
          ? ((c = i.replace(/(\d)(?=(\d{3})+(?:\.\d+)?$)/g, '$1,')), s > 0 && (c = `${c}.${u}`))
          : ((c = i.replace(/(\d)(?=(\d{3})+(?:\.\d+)?$)/g, '$1,')), s > 0 && (c = `${c}.${u}`)),
      c
    )
  },
  z0 = (e, t = 'NUMBER_TYPE_01', n = 2) => `${Ya(e, t, n)}%`,
  X0 = (e, t = 'NUMBER_TYPE_01', n = 'CURRENCY_TYPE_01', s = 2, r = 'đ') => {
    if (e === void 0 || e === null || (typeof e == 'string' && e.trim() === '')) return ''
    if ((typeof e != 'string' && typeof e != 'number') || (typeof s != 'string' && typeof s != 'number')) return 'NaN'
    const o = Ya(e, t, s)
    return n === 'CURRENCY_TYPE_01'
      ? `${o}${r}`.trim()
      : n === 'CURRENCY_TYPE_02'
        ? `${r}${o}`.trim()
        : n === 'CURRENCY_TYPE_03'
          ? `${o} ${r}`.trim()
          : n === 'CURRENCY_TYPE_04'
            ? `${r} ${o}`.trim()
            : `${o}${r}`.trim()
  },
  J0 = (e, t = 'NUMBER_TYPE_01', n = 'ACCOUNTING_TYPE_01', s = 2, r = 'đ') => {
    if (
      e === void 0 ||
      e === null ||
      (typeof e == 'string' && e.trim() === '') ||
      (typeof e != 'string' && typeof e != 'number') ||
      (typeof s != 'string' && typeof s != 'number')
    )
      return '-'
    let o = parseFloat(`${e}`).toFixed(10),
      a = parseFloat('0').toFixed(10)
    if (a >= o && a <= o) return '-'
    let i = Ya(e, t, s)
    return (
      o < 0 && (i = `(${i.substring(1)})`),
      n === 'ACCOUNTING_TYPE_01'
        ? `${r} ${i}`.trim()
        : n === 'ACCOUNTING_TYPE_02'
          ? `${r} ${i}`.trim()
          : `${r} ${i}`.trim()
    )
  },
  ks = { date: Y0, time: K0, datetime: q0, number: Ya, currency: X0, accounting: J0, percentage: z0 },
  Q0 = (e, t) =>
    ks.date(
      e,
      (t == null ? void 0 : t.dateOnlyType) || 'DATE_ONLY_TYPE_01',
      (t == null ? void 0 : t.timeZone) || 'Asia/Ho_Chi_Minh'
    ),
  Z0 = (e, t) =>
    ks.time(
      e,
      (t == null ? void 0 : t.dateOnlyType) || 'DATE_ONLY_TYPE_01',
      (t == null ? void 0 : t.timeZone) || 'Asia/Ho_Chi_Minh'
    ),
  eP = (e, t) =>
    ks.datetime(
      e,
      (t == null ? void 0 : t.dateTimeType) || 'DATE_TIME_TYPE_01',
      (t == null ? void 0 : t.timeZone) || 'Asia/Ho_Chi_Minh'
    ),
  tP = e => e,
  nP = e => {
    if (typeof e > 'u' || !e || !e.trim()) return ''
    let t = ''
    const n = e.split(' ')
    return ((t = n[0].substr(0, 1)), n.length > 1 && (t += n[n.length - 1].substr(0, 1)), t)
  },
  sP = (e, t, n = 2) => ks.number(e, (t == null ? void 0 : t.numberType) || 'NUMBER_TYPE_01', n || 0),
  rP = (e, t, n, s) =>
    ks.currency(
      e,
      (t == null ? void 0 : t.numberType) || 'NUMBER_TYPE_01',
      (t == null ? void 0 : t.currencyType) || 'CURRENCY_TYPE_01',
      n || (t == null ? void 0 : t.currencyDecimal) || 0,
      s || (t == null ? void 0 : t.currencySymbol) || 'đ'
    ),
  oP = (e, t, n, s) =>
    ks.accounting(
      e,
      (t == null ? void 0 : t.numberType) || 'NUMBER_TYPE_01',
      (t == null ? void 0 : t.accountingType) || 'ACCOUNTING_TYPE_01',
      n || (t == null ? void 0 : t.currencyDecimal) || 0,
      s || (t == null ? void 0 : t.currencySymbol) || 'đ'
    ),
  aP = (e, t, n = 2) => ks.percentage(e, (t == null ? void 0 : t.numberType) || 'NUMBER_TYPE_01', n || 0),
  iP = (e, t) => {
    if (e == null) return e
    const n = e.split(' ')
    let s = '',
      r = 0
    for (; s.length <= t && r < n.length; ) ((s = s + ' ' + n[r]), r++)
    return r < n.length - 1 ? s + '...' : s
  },
  lP = e =>
    typeof e > 'u' || !e || !e.trim() ? '' : `${e.substring(0, 1).toUpperCase()}${e.substring(1).toLowerCase()}`,
  uP = {
    mounted(e, t) {
      ;((e.onMyClickOutsideEvent = function (n) {
        e === n.target || e.contains(n.target) || t.value(n, e)
      }),
        document.body.addEventListener('click', e.onMyClickOutsideEvent))
    },
    unmounted(e) {
      document.body.removeEventListener('click', e.onMyClickOutsideEvent)
    }
  },
  pl = {
    components: {
      SBase: Kw,
      SPaginator: iL,
      SPageError: EL,
      SPageLoading: bL,
      SErrorMessage: cL,
      SLoadingAnimation: hL,
      SUploadImage: VL,
      InvalidFormDialog: GL,
      SubmitFailedDialog: YL,
      ConfirmCancelDialog: XL,
      ConfirmSubmitDialog: e0,
      ConfirmDeleteDialog: c0,
      ConfirmRemoveDialog: g0,
      ConfirmRestoreDialog: o0,
      ConfirmUnlockDialog: C0,
      ConfirmAssignDialog: v0,
      ConfirmCloseDialog: w0,
      ConfirmLockDialog: k0,
      ConfirmShowDialog: B0,
      ConfirmHideDialog: j0
    },
    filters: {
      date: Q0,
      time: Z0,
      datetime: eP,
      avatar: nP,
      phone: tP,
      number: sP,
      percent: aP,
      currency: rP,
      accounting: oP,
      ellipsis: iP,
      message: lP
    },
    directives: { onClickOutside: uP }
  },
  cP = 'modulepreload',
  dP = function (e) {
    return '/' + e
  },
  yf = {},
  fP = function (t, n, s) {
    let r = Promise.resolve()
    if (n && n.length > 0) {
      const o = document.getElementsByTagName('link')
      r = Promise.all(
        n.map(a => {
          if (((a = dP(a)), a in yf)) return
          yf[a] = !0
          const i = a.endsWith('.css'),
            u = i ? '[rel="stylesheet"]' : ''
          if (!!s)
            for (let m = o.length - 1; m >= 0; m--) {
              const h = o[m]
              if (h.href === a && (!i || h.rel === 'stylesheet')) return
            }
          else if (document.querySelector(`link[href="${a}"]${u}`)) return
          const d = document.createElement('link')
          if (
            ((d.rel = i ? 'stylesheet' : cP),
            i || ((d.as = 'script'), (d.crossOrigin = '')),
            (d.href = a),
            document.head.appendChild(d),
            i)
          )
            return new Promise((m, h) => {
              ;(d.addEventListener('load', m),
                d.addEventListener('error', () => h(new Error(`Unable to preload CSS for ${a}`))))
            })
        })
      )
    }
    return r
      .then(() => t())
      .catch(o => {
        const a = new Event('vite:preloadError', { cancelable: !0 })
        if (((a.payload = o), window.dispatchEvent(a), !a.defaultPrevented)) throw o
      })
  }
async function mP() {
  ;(await fP(() => import('./webfontloader-BbsTpSw6.js').then(t => t.w), __vite__mapDeps([]))).load({
    google: { families: ['Roboto:100,300,400,500,700,900&display=swap'] }
  })
}
const hP = I_(),
  In = R_(Zy)
In.use(hP)
In.config.globalProperties.$setting = (appInitialData == null ? void 0 : appInitialData.setting) || {}
In.config.globalProperties.$config = (appInitialData == null ? void 0 : appInitialData.config) || {}
var bf
Zl.global.locale = ((bf = appInitialData == null ? void 0 : appInitialData.setting) == null ? void 0 : bf.lang) || 'en'
In.use(Zl)
In.use(rN)
In.use(nw)
const gP = Oe.create()
In.config.globalProperties.$axios = { ...gP }
Object.keys(pl.components).forEach(e => {
  In.component(e, pl.components[e])
})
In.config.globalProperties.$filters = pl.filters
mP()
In.mount('#app')
