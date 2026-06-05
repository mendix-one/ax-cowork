import type { CSSProperties, ReactElement } from 'react'

// Animated digital background layer for the sign-in screen. A self-contained inline SVG (no external
// asset) authored on a 1920×1080 / full-HD canvas and scaled to cover any viewport via
// preserveAspectRatio="xMidYMid slice", so it stays crisp and responsive from phones to ultrawide.
// The motif — a deep neural network (embedding → self-attention → feed-forward → output, the transformer
// pipeline) with activations flowing through it, alongside a growth/optimization chart — reads as "the AI
// model powering better engineering planning". All motion is CSS-driven (see AxSignin.scss) so it honours
// prefers-reduced-motion. The headline / subtitle / tagline render as crisp HTML over the animation.

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

// Forward pass: one travelling activation per source neuron at each transition, tagged with its source
// layer. Animating each dot with a delay proportional to its layer makes the data visibly hop left→right,
// layer by layer — an activation wave sweeping through the network and repeating.
const PASS: Array<{ a: Pt; b: Pt; layer: number }> = []
for (let l = 0; l < NET.length - 1; l++) {
  const src = NET[l]
  const dst = NET[l + 1]
  src.forEach((a, i) => {
    PASS.push({ a, b: dst[(i + l) % dst.length], layer: l })
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
  return (
    <div className="ax-signin_bg" aria-hidden="true">
      <svg className="ax-signin_bg_svg" viewBox="0 0 1920 1080" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg">
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

        {/* Backdrop: deep digital gradient, blueprint grid, and a soft central glow. */}
        <rect width="1920" height="1080" fill="url(#axbgSky)" />
        <rect width="1920" height="1080" fill="url(#axbgGrid)" />
        <rect width="1920" height="1080" fill="url(#axbgGlow)" className="ax-bg-breathe" />

        {/* Optimization / growth analysis chart — ascending bars and a trend line that draws upward to a
            growth arrow, evoking a plan AI keeps improving. */}
        <g className="ax-bg-chart" transform="translate(1330 170)">
          {/* Faint horizontal gridlines + a brighter baseline. */}
          {[60, 130, 200, 270].map((y) => (
            <line key={y} x1={0} y1={y} x2={480} y2={y} stroke="#4096ff" strokeOpacity="0.08" strokeWidth="1" />
          ))}
          <line x1={0} y1={300} x2={480} y2={300} stroke="#4096ff" strokeOpacity="0.18" strokeWidth="1.5" />

          {/* Live-analysis scan sweeping across the chart. */}
          <rect className="ax-bg-cscan" x={-1} y={0} width={2} height={300} fill="#5cdbd3" />

          {/* Ascending analysis bars, growing from the baseline. */}
          {COLS.map(([x, h], i) => (
            <rect key={i} x={x} y={300 - h} width={40} height={h} rx={5} fill="url(#axbgEdge)" fillOpacity="0.16" className="ax-bg-col" style={{ animationDelay: `${i * -0.4}s` }} />
          ))}

          {/* Area under the trend, the trend line drawing in, and the leading focus dot. */}
          <path d={TREND_AREA} fill="url(#axbgArea)" className="ax-bg-area" />
          <path d={TREND_LINE} fill="none" stroke="url(#axbgEdge)" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="ax-bg-trend" />
          <circle r={5.5} fill="#bae0ff" className="ax-bg-trace" style={{ offsetPath: `path('${TREND_LINE}')` } as CSSProperties} />

          {/* Pulsing focus point at the growth tip. */}
          <circle cx={480} cy={56} r={13} fill="#36cfc9" fillOpacity="0.25" className="ax-bg-pulse" />
          <circle cx={480} cy={56} r={5} fill="#caf5ef" className="ax-bg-core" />

          {/* Growth arrow at the leading edge. */}
          <path d="M 478 58 L 506 32 M 506 32 L 491 34 M 506 32 L 504 49" fill="none" stroke="#87e8de" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="ax-bg-core" />
        </g>

        {/* Neural network — inter-layer connections (faint, with a flowing dash), self-attention arcs in
            the transformer block, the forward-pass activations, then the pulsing neurons + layer labels. */}
        <g className="ax-bg-net">
          {CONNECTIONS.map(([a, b], i) => (
            <line
              key={i}
              x1={a[0]}
              y1={a[1]}
              x2={b[0]}
              y2={b[1]}
              stroke="url(#axbgEdge)"
              strokeOpacity="0.13"
              strokeWidth="1"
              className="ax-bg-edge"
              style={{ animationDelay: `${(i % 9) * -0.6}s` }}
            />
          ))}
        </g>

        {/* Self-attention arcs (transformer): each neuron attending to others in its layer. */}
        <g className="ax-bg-attn">
          {ATTN_ARCS.map((d, i) => (
            <path key={i} d={d} fill="none" stroke="#9254de" strokeOpacity="0.5" strokeWidth="1.5" className="ax-bg-edge" style={{ animationDelay: `${i * -0.8}s` }} />
          ))}
        </g>

        {/* Forward-pass activations hopping node→node, layer by layer left→right (CSS motion path; the
            per-layer delay below makes the wave sweep across and repeat). */}
        {PASS.map(({ a, b, layer }, i) => {
          const path = `path('M ${a[0]} ${a[1]} L ${b[0]} ${b[1]}')`
          return (
            <circle
              key={i}
              r={4}
              fill="#5cdbd3"
              className="ax-bg-pass"
              style={{ offsetPath: path, animationDelay: `${(layer / PASS_LAYERS) * 2.4}s` } as CSSProperties}
            />
          )
        })}

        {/* Neurons (pulsing) and the per-layer architecture labels. */}
        {NET.map((layer, li) => (
          <g key={li}>
            {layer.map(([x, y], ni) => (
              <g key={ni} transform={`translate(${x} ${y})`}>
                <circle r={16} fill="#4096ff" fillOpacity="0.18" className="ax-bg-pulse" style={{ animationDelay: `${(li + ni) % 7 * -0.6}s` }} />
                <circle r={5} fill="#bae0ff" className="ax-bg-core" style={{ animationDelay: `${(li + ni) % 5 * -0.8}s` }} />
              </g>
            ))}
            <text x={LAYERS[li].x} y={945} textAnchor="middle" className="ax-bg-net_label">
              {LAYERS[li].label}
            </text>
          </g>
        ))}

        {/* Vertical scan line sweeping across the canvas. */}
        <rect className="ax-bg-scan" x={0} y={0} width={2} height={1080} fill="#36cfc9" fillOpacity="0.25" filter="url(#axbgSoft)" />
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
