import type { CSSProperties, ReactElement } from 'react'

// Animated digital background layer for the sign-in screen. A self-contained inline SVG (no external
// asset) authored on a 1920×1080 / full-HD canvas and scaled to cover any viewport via
// preserveAspectRatio="xMidYMid slice", so it stays crisp and responsive from phones to ultrawide.
// The motif — a pulsing planning graph, flowing data, a Gantt-style timeline, a radar sweep — reads as
// "AI applied to engineering planning". All motion is CSS-driven (see AxSignin.scss) so it honours
// prefers-reduced-motion. The headline / subtitle / tagline render as crisp HTML over the animation.

// Planning-graph nodes laid out across the canvas; edges wire them into a connected network.
const NODES: Array<[number, number]> = [
  [240, 760],
  [520, 880],
  [430, 560],
  [760, 640],
  [980, 820],
  [1180, 600],
  [1480, 720],
  [1700, 560],
  [1380, 380],
  [1080, 320],
  [820, 300],
  [560, 260],
  [1620, 940],
  [300, 420],
]

const EDGES: Array<[number, number]> = [
  [0, 1],
  [0, 2],
  [1, 4],
  [2, 3],
  [2, 13],
  [13, 11],
  [3, 5],
  [3, 10],
  [4, 3],
  [4, 5],
  [5, 6],
  [5, 8],
  [6, 7],
  [6, 12],
  [8, 7],
  [8, 9],
  [9, 10],
  [10, 11],
]

// Edges carrying a travelling "data" dot (indices into EDGES) — kept to a handful so the flow reads
// clearly without clutter.
const FLOW_EDGES = [2, 6, 10, 12, 16, 5]

// Gantt-style timeline bars (engineering planning): x, y, width, and the fraction that fills in.
const BARS: Array<{ x: number; y: number; w: number }> = [
  { x: 140, y: 935, w: 360 },
  { x: 140, y: 975, w: 250 },
  { x: 140, y: 1015, w: 430 },
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

        {/* Radar sweep — concentric rings + a rotating wedge, evoking continuous analysis. */}
        <g className="ax-bg-radar" transform="translate(1480 280)">
          {[80, 150, 220].map((r) => (
            <circle key={r} r={r} fill="none" stroke="#36cfc9" strokeOpacity="0.12" strokeWidth="1.5" />
          ))}
          <g className="ax-bg-radar_sweep">
            <path d="M0 0 L220 0 A220 220 0 0 1 150 160 Z" fill="#36cfc9" fillOpacity="0.06" />
            {/* Rotate exactly around the radar centre (this group's local origin). */}
            <animateTransform attributeName="transform" type="rotate" from="0 0 0" to="360 0 0" dur="14s" repeatCount="indefinite" />
          </g>
        </g>

        {/* Planning graph: connecting edges with a flowing dash, then the pulsing nodes on top. */}
        <g className="ax-bg-edges">
          {EDGES.map(([a, b], i) => (
            <line
              key={i}
              x1={NODES[a][0]}
              y1={NODES[a][1]}
              x2={NODES[b][0]}
              y2={NODES[b][1]}
              stroke="url(#axbgEdge)"
              strokeOpacity="0.35"
              strokeWidth="1.5"
              className="ax-bg-edge"
              style={{ animationDelay: `${(i % 6) * -0.7}s` }}
            />
          ))}
        </g>

        {/* Data dots travelling along select edges (CSS motion path). */}
        {FLOW_EDGES.map((edgeIndex, i) => {
          const [a, b] = EDGES[edgeIndex]
          const path = `path('M ${NODES[a][0]} ${NODES[a][1]} L ${NODES[b][0]} ${NODES[b][1]}')`
          return <circle key={i} r={4} fill="#5cdbd3" className="ax-bg-dot" style={{ offsetPath: path, animationDelay: `${i * -1.3}s` } as CSSProperties} />
        })}

        <g className="ax-bg-nodes">
          {NODES.map(([x, y], i) => (
            <g key={i} transform={`translate(${x} ${y})`}>
              <circle r={22} fill="#4096ff" fillOpacity="0.18" className="ax-bg-pulse" style={{ animationDelay: `${(i % 7) * -0.6}s` }} />
              <circle r={5.5} fill="#bae0ff" className="ax-bg-core" style={{ animationDelay: `${(i % 5) * -0.8}s` }} />
            </g>
          ))}
        </g>

        {/* Gantt-style planning timeline: a track that fills, suggesting an AI-optimised schedule. */}
        <g className="ax-bg-gantt">
          {BARS.map((bar, i) => (
            <g key={i}>
              <rect x={bar.x} y={bar.y} width={bar.w} height={14} rx={7} fill="#4096ff" fillOpacity="0.12" />
              <rect x={bar.x} y={bar.y} width={bar.w} height={14} rx={7} fill="url(#axbgEdge)" fillOpacity="0.8" className="ax-bg-bar" style={{ animationDelay: `${i * -0.9}s` }} />
            </g>
          ))}
        </g>

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
