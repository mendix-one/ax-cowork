import type { ReactElement } from 'react'
import { useEffect, useRef } from 'react'

// Animated digital background layer for the sign-in screen. A self-contained inline SVG (no external
// asset) authored on a 1920×1080 / full-HD canvas and scaled to cover any viewport via
// preserveAspectRatio="xMidYMid slice", so it stays crisp and responsive from phones to ultrawide.
// The motif — a deep neural network (embedding → self-attention → feed-forward → output, the transformer
// pipeline) with activations flowing through it, alongside a growth/optimization chart — reads as "the AI
// model powering better engineering planning".
//
// Motion is driven by a requestAnimationFrame loop that writes SVG attributes / element.style directly,
// NOT by CSS keyframes or CSS Motion Path. This is deliberate: in a packaged Mendix widget those CSS
// features proved unreliable, whereas scripted style writes are well-supported and aren't affected by a
// Content-Security-Policy that blocks inline <style>/style attributes. The JSX renders a calm "finished"
// frame, so first paint and prefers-reduced-motion (where the loop never starts) both look intentional.
// The headline / subtitle / tagline render as crisp HTML over the animation.

// Deep neural network — the core motif. Stacked layers of neurons (embedding → self-attention →
// feed-forward → decode → output, the transformer pipeline) fully wired layer-to-layer, with activations
// propagating left→right (the forward pass).
type Pt = [number, number]
const NET_CENTER_Y = 640
const NEURON_GAP = 74
const LAYERS: Array<{ x: number; count: number; label: string }> = [
  { x: 250, count: 5, label: 'INPUT' },
  { x: 520, count: 7, label: 'EMBED' },
  { x: 800, count: 8, label: 'ATTENTION' },
  { x: 1090, count: 7, label: 'FEED · FWD' },
  { x: 1380, count: 5, label: 'DECODE' },
  { x: 1670, count: 3, label: 'OUTPUT' },
]

// Neuron positions per layer (vertically centred on NET_CENTER_Y).
const NET: Pt[][] = LAYERS.map(({ x, count }) => {
  const top = NET_CENTER_Y - ((count - 1) * NEURON_GAP) / 2
  return Array.from({ length: count }, (_, i) => [x, top + i * NEURON_GAP] as Pt)
})

// Full inter-layer connectivity (every neuron to every neuron in the next layer).
const CONNECTIONS: Array<[Pt, Pt]> = []
for (let l = 0; l < NET.length - 1; l++) {
  for (const a of NET[l]) for (const b of NET[l + 1]) CONNECTIONS.push([a, b])
}

// Forward pass: one travelling activation per source neuron at each transition. Each carries its source
// point, the whole destination layer to route into, its layer index (drives the left→right wave), and a
// fixed sub-second jitter so neurons in a layer don't fire in perfect lockstep. The actual target neuron
// is chosen RANDOMLY at runtime on every repeat (see the loop), so the path varies each time instead of
// retracing the same edge.
const PASS: Array<{ a: Pt; dst: Pt[]; layer: number; jitter: number }> = []
for (let l = 0; l < NET.length - 1; l++) {
  const src = NET[l]
  const dst = NET[l + 1]
  src.forEach((a, i) => {
    PASS.push({ a, dst, layer: l, jitter: ((i * 0.6180339887) % 1) * 0.9 })
  })
}
const PASS_LAYERS = NET.length - 1

// Self-attention arcs inside the ATTENTION layer (neuron-to-neuron within the same column), bulging left.
const ATTN = NET[2]
const ATTN_ARCS: string[] = [
  [0, 4],
  [1, 6],
  [2, 7],
  [3, 5],
].map(([i, j]) => {
  const a = ATTN[i]
  const b = ATTN[j]
  return `M ${a[0]} ${a[1]} Q ${a[0] - 110} ${(a[1] + b[1]) / 2} ${b[0]} ${b[1]}`
})

// "Optimization / growth" analysis chart (local chart coords, baseline y = 300). The trend climbs with a
// small mid-course correction, reading as a plan that AI iteratively improves.
const TREND: Array<[number, number]> = [
  [0, 270],
  [68, 238],
  [136, 250],
  [204, 196],
  [272, 168],
  [340, 182],
  [408, 110],
  [480, 56],
]
const TREND_LINE = TREND.map(([x, y], i) => `${i === 0 ? 'M' : 'L'} ${x} ${y}`).join(' ')
const TREND_AREA = `M 0 300 ${TREND.map(([x, y]) => `L ${x} ${y}`).join(' ')} L 480 300 Z`

// Ascending analysis bars (x, height) — mostly growing across iterations, with one dip for realism.
const COLS: Array<[number, number]> = [
  [16, 50],
  [84, 85],
  [152, 72],
  [220, 130],
  [288, 158],
  [356, 150],
  [424, 226],
]

export function AxSigninBg({ title, subtitle, tagline }: { title?: string; subtitle?: string; tagline?: string }): ReactElement {
  const svgRef = useRef<SVGSVGElement>(null)

  // Drive every animation from one rAF loop (scripted attribute/style writes — no CSS keyframes). Elements
  // are matched by their js-* class in document order, which equals the order of the data arrays above.
  useEffect(() => {
    const svg = svgRef.current
    if (!svg) return
    const reduce = typeof window !== 'undefined' && window.matchMedia?.('(prefers-reduced-motion: reduce)')?.matches
    if (reduce) return // leave the static "finished" frame from the JSX

    const all = <T extends Element>(sel: string): T[] => Array.from(svg.querySelectorAll<T>(sel))
    const one = <T extends Element>(sel: string): T | null => svg.querySelector<T>(sel)

    const passEls = all<SVGCircleElement>('.js-pass')
    const pulseEls = all<SVGCircleElement>('.js-pulse')
    const coreEls = all<SVGCircleElement>('.js-core')
    const barEls = all<SVGRectElement>('.js-bar')
    const arcEls = all<SVGPathElement>('.js-arc')
    const trend = one<SVGPathElement>('.js-trend')
    const trace = one<SVGCircleElement>('.js-trace')
    const cscan = one<SVGRectElement>('.js-cscan')
    const scan = one<SVGRectElement>('.js-scan')
    const glow = one<SVGRectElement>('.js-glow')

    const pulseBase = pulseEls.map((el) => parseFloat(el.getAttribute('r') || '16'))
    const len = trend ? trend.getTotalLength() : 0
    if (trend) trend.setAttribute('stroke-dasharray', String(len))
    arcEls.forEach((el) => el.setAttribute('stroke-dasharray', '6 7'))

    // Per-dot routing state: which destination neuron this activation is travelling to, re-rolled each
    // time the dot starts a new pass so the path is random rather than a fixed repeat.
    const passState = passEls.map(() => ({ cycle: Number.NEGATIVE_INFINITY, target: 0 }))

    const TAU = Math.PI * 2
    const mod = (a: number, b: number): number => ((a % b) + b) % b
    const clamp01 = (x: number): number => (x < 0 ? 0 : x > 1 ? 1 : x)

    let raf = 0
    let start = 0
    const tick = (ts: number): void => {
      if (!start) start = ts
      const t = (ts - start) / 1000

      // Soft central glow breathing (7s).
      if (glow) glow.style.opacity = (0.65 + 0.35 * (0.5 + 0.5 * Math.sin((t / 7) * TAU))).toFixed(3)

      // Neuron / focus-point pulse rings (grow + fade) and bright cores.
      for (let i = 0; i < pulseEls.length; i++) {
        const v = 0.5 + 0.5 * Math.sin((t / 4.2 + i * 0.37) * TAU)
        pulseEls[i].setAttribute('r', (pulseBase[i] * (0.6 + 0.7 * v)).toFixed(2))
        pulseEls[i].style.opacity = (0.5 - 0.45 * v).toFixed(3)
      }
      for (let i = 0; i < coreEls.length; i++) {
        coreEls[i].style.opacity = (0.4 + 0.6 * (0.5 + 0.5 * Math.sin((t / 3 + i * 0.5) * TAU))).toFixed(3)
      }

      // Forward pass: each activation travels to a RANDOMLY chosen neuron in the next layer during its
      // slot, then hides. The layer-based offset keeps the wave sweeping left→right; the target is
      // re-rolled whenever the dot enters a new pass, so the routing never simply repeats.
      const period = 3.2
      const travel = 0.55
      for (let i = 0; i < passEls.length; i++) {
        const p = PASS[i]
        const offset = (p.layer / PASS_LAYERS) * 2.4 + p.jitter
        const cycle = Math.floor((t - offset) / period)
        const state = passState[i]
        if (cycle !== state.cycle) {
          state.cycle = cycle
          state.target = (Math.random() * p.dst.length) | 0
        }
        const local = mod(t - offset, period)
        if (local < travel) {
          const b = p.dst[state.target]
          const pr = local / travel
          passEls[i].setAttribute('cx', (p.a[0] + (b[0] - p.a[0]) * pr).toFixed(1))
          passEls[i].setAttribute('cy', (p.a[1] + (b[1] - p.a[1]) * pr).toFixed(1))
          passEls[i].style.opacity = clamp01(Math.min(8 * pr, 8 * (1 - pr))).toFixed(3)
        } else {
          passEls[i].style.opacity = '0'
        }
      }

      // Attention arcs: continuous dash flow.
      for (let i = 0; i < arcEls.length; i++) arcEls[i].setAttribute('stroke-dashoffset', (-(t * 22 + i * 5) % 26).toFixed(1))

      // Analysis chart on a 5s cycle: bars grow, trend draws in with a focus dot, a scan sweeps across.
      const cl = mod(t, 5)
      for (let i = 0; i < barEls.length; i++) {
        const g = clamp01((cl - i * 0.32) / 1.4)
        const h = COLS[i][1] * g
        barEls[i].setAttribute('y', (300 - h).toFixed(1))
        barEls[i].setAttribute('height', h.toFixed(1))
      }
      if (trend) {
        const p = clamp01((cl - 0.3) / 2.6)
        trend.setAttribute('stroke-dashoffset', (len * (1 - p)).toFixed(1))
        if (trace) {
          const pt = trend.getPointAtLength(p * len)
          trace.setAttribute('cx', pt.x.toFixed(1))
          trace.setAttribute('cy', pt.y.toFixed(1))
        }
      }
      if (cscan) {
        const sp = clamp01((cl - 0.4) / 3)
        cscan.setAttribute('x', (sp * 480 - 1).toFixed(1))
        cscan.style.opacity = cl > 0.4 && cl < 3.6 ? '0.5' : '0'
      }

      // Vertical scan line sweeping the whole canvas (9s).
      if (scan) {
        scan.setAttribute('x', ((mod(t, 9) / 9) * 1920).toFixed(0))
        scan.style.opacity = '1'
      }

      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [])

  return (
    <div className="ax-signin_bg" aria-hidden="true">
      <svg ref={svgRef} className="ax-signin_bg_svg" viewBox="0 0 1920 1080" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="axbgSky" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#1b1147" />
            <stop offset="45%" stopColor="#120338" />
            <stop offset="100%" stopColor="#05010f" />
          </linearGradient>
          <radialGradient id="axbgGlow" cx="50%" cy="42%" r="60%">
            <stop offset="0%" stopColor="#2f54eb" stopOpacity="0.45" />
            <stop offset="55%" stopColor="#2f54eb" stopOpacity="0.08" />
            <stop offset="100%" stopColor="#2f54eb" stopOpacity="0" />
          </radialGradient>
          <linearGradient id="axbgEdge" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#13c2c2" />
            <stop offset="100%" stopColor="#4096ff" />
          </linearGradient>
          <linearGradient id="axbgArea" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#36cfc9" stopOpacity="0.35" />
            <stop offset="100%" stopColor="#36cfc9" stopOpacity="0" />
          </linearGradient>
          <pattern id="axbgGrid" width="60" height="60" patternUnits="userSpaceOnUse">
            <path d="M60 0H0V60" fill="none" stroke="#4096ff" strokeOpacity="0.06" strokeWidth="1" />
          </pattern>
          <filter id="axbgSoft" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="6" />
          </filter>
        </defs>

        {/* Backdrop: deep digital gradient, blueprint grid, and a soft (breathing) central glow. */}
        <rect width="1920" height="1080" fill="url(#axbgSky)" />
        <rect width="1920" height="1080" fill="url(#axbgGrid)" />
        <rect className="js-glow" width="1920" height="1080" fill="url(#axbgGlow)" />

        {/* Optimization / growth analysis chart — ascending bars and a trend line that draws upward to a
            growth arrow, evoking a plan AI keeps improving. */}
        <g transform="translate(1330 170)">
          {/* Faint horizontal gridlines + a brighter baseline. */}
          {[60, 130, 200, 270].map((y) => (
            <line key={y} x1={0} y1={y} x2={480} y2={y} stroke="#4096ff" strokeOpacity="0.08" strokeWidth="1" />
          ))}
          <line x1={0} y1={300} x2={480} y2={300} stroke="#4096ff" strokeOpacity="0.18" strokeWidth="1.5" />

          {/* Live-analysis scan sweeping across the chart. */}
          <rect className="js-cscan" x={-1} y={0} width={2} height={300} fill="#5cdbd3" style={{ opacity: 0 }} />

          {/* Ascending analysis bars (rendered at full height; the loop grows them from the baseline). */}
          {COLS.map(([x, h], i) => (
            <rect key={i} className="js-bar" x={x} y={300 - h} width={40} height={h} rx={5} fill="url(#axbgEdge)" fillOpacity="0.16" />
          ))}

          {/* Area under the trend, the trend line (drawn in by the loop), and the leading focus dot. */}
          <path d={TREND_AREA} fill="url(#axbgArea)" />
          <path className="js-trend" d={TREND_LINE} fill="none" stroke="url(#axbgEdge)" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
          <circle className="js-trace" cx={480} cy={56} r={5.5} fill="#bae0ff" />

          {/* Pulsing focus point at the growth tip. */}
          <circle className="js-pulse" cx={480} cy={56} r={13} fill="#36cfc9" fillOpacity="0.25" />
          <circle className="js-core" cx={480} cy={56} r={5} fill="#caf5ef" />

          {/* Growth arrow at the leading edge. */}
          <path d="M 478 58 L 506 32 M 506 32 L 491 34 M 506 32 L 504 49" fill="none" stroke="#87e8de" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
        </g>

        {/* Neural network — faint inter-layer connections (static), self-attention arcs in the transformer
            block, the forward-pass activations, then the pulsing neurons + layer labels. */}
        <g>
          {CONNECTIONS.map(([a, b], i) => (
            <line key={i} x1={a[0]} y1={a[1]} x2={b[0]} y2={b[1]} stroke="url(#axbgEdge)" strokeOpacity="0.13" strokeWidth="1" />
          ))}
        </g>

        {/* Self-attention arcs (transformer): each neuron attending to others in its layer. */}
        <g>
          {ATTN_ARCS.map((d, i) => (
            <path key={i} className="js-arc" d={d} fill="none" stroke="#9254de" strokeOpacity="0.5" strokeWidth="1.5" />
          ))}
        </g>

        {/* Forward-pass activations hopping node→node, layer by layer left→right. */}
        {PASS.map(({ a }, i) => (
          <circle key={i} className="js-pass" cx={a[0]} cy={a[1]} r={4} fill="#5cdbd3" style={{ opacity: 0 }} />
        ))}

        {/* Neurons (pulsing) and the per-layer architecture labels. */}
        {NET.map((layer, li) => (
          <g key={li}>
            {layer.map(([x, y], ni) => (
              <g key={ni} transform={`translate(${x} ${y})`}>
                <circle className="js-pulse" r={16} fill="#4096ff" fillOpacity="0.18" />
                <circle className="js-core" r={5} fill="#bae0ff" />
              </g>
            ))}
            <text x={LAYERS[li].x} y={945} textAnchor="middle" className="ax-signin_bg_net_label">
              {LAYERS[li].label}
            </text>
          </g>
        ))}

        {/* Vertical scan line sweeping across the canvas. */}
        <rect className="js-scan" x={0} y={0} width={2} height={1080} fill="#36cfc9" fillOpacity="0.25" filter="url(#axbgSoft)" style={{ opacity: 0 }} />
      </svg>

      {(title || subtitle || tagline) && (
        <div className="ax-signin_bg_content">
          <span className="ax-signin_bg_eyebrow">AX · AI ENGINEERING</span>
          {title && <h1 className="ax-signin_bg_title">{title}</h1>}
          {subtitle && <h2 className="ax-signin_bg_subtitle">{subtitle}</h2>}
          {tagline && <p className="ax-signin_bg_tagline">{tagline}</p>}
        </div>
      )}
    </div>
  )
}
