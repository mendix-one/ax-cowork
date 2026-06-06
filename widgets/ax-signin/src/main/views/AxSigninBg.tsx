import type { CSSProperties, ReactElement } from 'react'
import { useEffect, useRef } from 'react'

// Animated digital background layer for the sign-in screen, rendered to a <canvas> and driven by a
// requestAnimationFrame loop (2D drawing — no SVG, no CSS keyframes, no CSS Motion Path).
//
// Why canvas: inside a packaged Mendix widget the SVG/CSS approaches proved unreliable (the layer depends
// on the widget CSS file loading and giving the inline <svg> a real size, and SVG geometry calls such as
// getTotalLength/getPointAtLength can throw and silently kill the animation loop). Canvas removes all of
// that: the element is sized and positioned from JS with inline styles (so it survives even if the CSS
// file fails to load), every frame is wrapped in try/catch, and ResizeObserver + a window-size fallback
// guarantee a drawable surface. The motif is unchanged — a transformer-style neural net (embedding →
// attention → feed-forward → output) with a randomly-routed forward pass, plus a growth/optimization
// chart. The headline / subtitle / tagline still render as crisp HTML over the canvas.

type Pt = [number, number]

// --- Neural network geometry ---------------------------------------------------------------------------
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
const NET: Pt[][] = LAYERS.map(({ x, count }) => {
  const top = NET_CENTER_Y - ((count - 1) * NEURON_GAP) / 2
  return Array.from({ length: count }, (_, i) => [x, top + i * NEURON_GAP] as Pt)
})
const CONNECTIONS: Array<[Pt, Pt]> = []
for (let l = 0; l < NET.length - 1; l++) {
  for (const a of NET[l]) for (const b of NET[l + 1]) CONNECTIONS.push([a, b])
}

// Forward pass: one activation per source neuron between adjacent layers. The target neuron and whether
// the neuron fires at all are re-rolled randomly each pass (see the loop), so routing never just repeats.
const PASS: Array<{ a: Pt; dst: Pt[]; layer: number; jitter: number }> = []
for (let l = 0; l < NET.length - 1; l++) {
  const src = NET[l]
  const dst = NET[l + 1]
  src.forEach((a, i) => {
    PASS.push({ a, dst, layer: l, jitter: ((i * 0.6180339887) % 1) * 0.9 })
  })
}
const PASS_LAYERS = NET.length - 1

// Self-attention arcs inside the ATTENTION layer (control point bulges left).
const ATTN = NET[2]
const ATTN_ARCS: Array<{ a: Pt; c: Pt; b: Pt }> = [
  [0, 4],
  [1, 6],
  [2, 7],
  [3, 5],
].map(([i, j]) => {
  const a = ATTN[i]
  const b = ATTN[j]
  return { a, c: [a[0] - 110, (a[1] + b[1]) / 2] as Pt, b }
})

// --- Growth / optimization chart geometry (local chart coords, baseline y = 300) -----------------------
const TREND: Pt[] = [
  [0, 270],
  [68, 238],
  [136, 250],
  [204, 196],
  [272, 168],
  [340, 182],
  [408, 110],
  [480, 56],
]
const TREND_CUM = [0]
for (let i = 1; i < TREND.length; i++) {
  TREND_CUM[i] = TREND_CUM[i - 1] + Math.hypot(TREND[i][0] - TREND[i - 1][0], TREND[i][1] - TREND[i - 1][1])
}
const TREND_TOTAL = TREND_CUM[TREND.length - 1]
function trendPointAt(p: number): Pt {
  const target = p * TREND_TOTAL
  for (let i = 1; i < TREND.length; i++) {
    if (TREND_CUM[i] >= target) {
      const seg = TREND_CUM[i] - TREND_CUM[i - 1]
      const f = seg ? (target - TREND_CUM[i - 1]) / seg : 0
      return [TREND[i - 1][0] + (TREND[i][0] - TREND[i - 1][0]) * f, TREND[i - 1][1] + (TREND[i][1] - TREND[i - 1][1]) * f]
    }
  }
  return TREND[TREND.length - 1]
}

// Ascending analysis bars (x, height).
const COLS: Pt[] = [
  [16, 50],
  [84, 85],
  [152, 72],
  [220, 130],
  [288, 158],
  [356, 150],
  [424, 226],
]

const TAU = Math.PI * 2
const mod = (a: number, b: number): number => ((a % b) + b) % b
const clamp01 = (x: number): number => (x < 0 ? 0 : x > 1 ? 1 : x)

function roundRect(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number): void {
  const rr = Math.max(0, Math.min(r, w / 2, h / 2))
  ctx.beginPath()
  ctx.moveTo(x + rr, y)
  ctx.arcTo(x + w, y, x + w, y + h, rr)
  ctx.arcTo(x + w, y + h, x, y + h, rr)
  ctx.arcTo(x, y + h, x, y, rr)
  ctx.arcTo(x, y, x + w, y, rr)
  ctx.closePath()
}

// Inline styles for the critical layout so the layer renders even if the widget CSS file fails to load.
const WRAP_STYLE: CSSProperties = { position: 'absolute', inset: 0, zIndex: 0, overflow: 'hidden' }
const CANVAS_STYLE: CSSProperties = { display: 'block', width: '100%', height: '100%' }

export function AxSigninBg({ title, subtitle, tagline }: { title?: string; subtitle?: string; tagline?: string }): ReactElement {
  const wrapRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const dpr = Math.min(window.devicePixelRatio || 1, 2)
    // Canvas CSS size, re-measured every frame (below) so the surface is always correct regardless of
    // when the host lays the widget out — no dependence on ResizeObserver / mount timing.
    let cssW = 0
    let cssH = 0

    // Per-dot routing state, re-rolled each pass: `active` decides whether the neuron fires this round,
    // `target` is the random destination neuron.
    const passState = PASS.map(() => ({ cycle: Number.NEGATIVE_INFINITY, target: 0, active: false }))
    const FIRE_PROB = 0.6

    const render = (t: number): void => {
      const w = cssW
      const h = cssH
      const scale = Math.max(w / 1920, h / 1080) // cover (== SVG "slice")
      const ox = (w - 1920 * scale) / 2
      const oy = (h - 1080 * scale) / 2
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      ctx.clearRect(0, 0, w, h)
      ctx.translate(ox, oy)
      ctx.scale(scale, scale)

      // Backdrop gradient.
      const sky = ctx.createLinearGradient(0, 0, 1920, 1080)
      sky.addColorStop(0, '#1b1147')
      sky.addColorStop(0.45, '#120338')
      sky.addColorStop(1, '#05010f')
      ctx.fillStyle = sky
      ctx.fillRect(0, 0, 1920, 1080)

      // Blueprint grid.
      ctx.lineWidth = 1
      ctx.strokeStyle = 'rgba(64,150,255,0.06)'
      ctx.beginPath()
      for (let x = 0; x <= 1920; x += 60) {
        ctx.moveTo(x, 0)
        ctx.lineTo(x, 1080)
      }
      for (let y = 0; y <= 1080; y += 60) {
        ctx.moveTo(0, y)
        ctx.lineTo(1920, y)
      }
      ctx.stroke()

      // Breathing central glow.
      const breathe = 0.65 + 0.35 * (0.5 + 0.5 * Math.sin((t / 7) * TAU))
      const glow = ctx.createRadialGradient(960, 454, 0, 960, 454, 820)
      glow.addColorStop(0, `rgba(47,84,235,${0.45 * breathe})`)
      glow.addColorStop(0.55, `rgba(47,84,235,${0.08 * breathe})`)
      glow.addColorStop(1, 'rgba(47,84,235,0)')
      ctx.fillStyle = glow
      ctx.fillRect(0, 0, 1920, 1080)

      // --- Chart (translate to its origin) ---
      ctx.save()
      ctx.translate(1330, 170)
      // gridlines + baseline
      ctx.strokeStyle = 'rgba(64,150,255,0.08)'
      ctx.beginPath()
      for (const gy of [60, 130, 200, 270]) {
        ctx.moveTo(0, gy)
        ctx.lineTo(480, gy)
      }
      ctx.stroke()
      ctx.strokeStyle = 'rgba(64,150,255,0.18)'
      ctx.lineWidth = 1.5
      ctx.beginPath()
      ctx.moveTo(0, 300)
      ctx.lineTo(480, 300)
      ctx.stroke()
      const chartCycle = mod(t, 5)
      // bars
      for (let i = 0; i < COLS.length; i++) {
        const g = clamp01((chartCycle - i * 0.32) / 1.4)
        const bh = COLS[i][1] * g
        ctx.fillStyle = 'rgba(74,180,225,0.75)'
        roundRect(ctx, COLS[i][0], 300 - bh, 40, bh, 5)
        ctx.fill()
      }
      // area
      const area = ctx.createLinearGradient(0, 0, 0, 300)
      area.addColorStop(0, 'rgba(54,207,201,0.35)')
      area.addColorStop(1, 'rgba(54,207,201,0)')
      ctx.fillStyle = area
      ctx.beginPath()
      ctx.moveTo(0, 300)
      for (const p of TREND) ctx.lineTo(p[0], p[1])
      ctx.lineTo(480, 300)
      ctx.closePath()
      ctx.fill()
      // trend line drawn up to the current fraction
      const drawP = clamp01((chartCycle - 0.3) / 2.6)
      const line = ctx.createLinearGradient(0, 0, 480, 0)
      line.addColorStop(0, '#13c2c2')
      line.addColorStop(1, '#4096ff')
      ctx.strokeStyle = line
      ctx.lineWidth = 3
      ctx.lineJoin = 'round'
      ctx.lineCap = 'round'
      const target = drawP * TREND_TOTAL
      ctx.beginPath()
      ctx.moveTo(TREND[0][0], TREND[0][1])
      for (let i = 1; i < TREND.length; i++) {
        if (TREND_CUM[i] <= target) {
          ctx.lineTo(TREND[i][0], TREND[i][1])
        } else {
          const seg = TREND_CUM[i] - TREND_CUM[i - 1]
          const f = seg ? (target - TREND_CUM[i - 1]) / seg : 0
          ctx.lineTo(TREND[i - 1][0] + (TREND[i][0] - TREND[i - 1][0]) * f, TREND[i - 1][1] + (TREND[i][1] - TREND[i - 1][1]) * f)
          break
        }
      }
      ctx.stroke()
      // trace dot at the leading edge
      const tp = trendPointAt(drawP)
      ctx.fillStyle = '#bae0ff'
      ctx.beginPath()
      ctx.arc(tp[0], tp[1], 5.5, 0, TAU)
      ctx.fill()
      // tip pulse + core
      const tipV = 0.5 + 0.5 * Math.sin((t / 4.2) * TAU)
      ctx.fillStyle = `rgba(54,207,201,${(0.5 - 0.45 * tipV).toFixed(3)})`
      ctx.beginPath()
      ctx.arc(480, 56, 13 * (0.6 + 0.7 * tipV), 0, TAU)
      ctx.fill()
      ctx.fillStyle = '#caf5ef'
      ctx.beginPath()
      ctx.arc(480, 56, 5, 0, TAU)
      ctx.fill()
      // growth arrow
      ctx.strokeStyle = '#87e8de'
      ctx.lineWidth = 3
      ctx.beginPath()
      ctx.moveTo(478, 58)
      ctx.lineTo(506, 32)
      ctx.moveTo(506, 32)
      ctx.lineTo(491, 34)
      ctx.moveTo(506, 32)
      ctx.lineTo(504, 49)
      ctx.stroke()
      // chart scan
      const scanSp = clamp01((chartCycle - 0.4) / 3)
      if (chartCycle > 0.4 && chartCycle < 3.6) {
        ctx.strokeStyle = 'rgba(92,219,211,0.5)'
        ctx.lineWidth = 2
        ctx.beginPath()
        ctx.moveTo(scanSp * 480, 0)
        ctx.lineTo(scanSp * 480, 300)
        ctx.stroke()
      }
      ctx.restore()

      // --- Neural network ---
      // connections (one batched stroke)
      ctx.strokeStyle = 'rgba(85,170,255,0.13)'
      ctx.lineWidth = 1
      ctx.beginPath()
      for (const [a, b] of CONNECTIONS) {
        ctx.moveTo(a[0], a[1])
        ctx.lineTo(b[0], b[1])
      }
      ctx.stroke()

      // attention arcs with dash flow
      ctx.strokeStyle = 'rgba(146,84,222,0.5)'
      ctx.lineWidth = 1.5
      ctx.setLineDash([6, 7])
      ctx.lineDashOffset = -(t * 22) % 26
      ctx.beginPath()
      for (const arc of ATTN_ARCS) {
        ctx.moveTo(arc.a[0], arc.a[1])
        ctx.quadraticCurveTo(arc.c[0], arc.c[1], arc.b[0], arc.b[1])
      }
      ctx.stroke()
      ctx.setLineDash([])

      // forward-pass activations (random source + target each pass)
      const period = 3.2
      const travel = 0.55
      for (let i = 0; i < PASS.length; i++) {
        const p = PASS[i]
        const offset = (p.layer / PASS_LAYERS) * 2.4 + p.jitter
        const cycle = Math.floor((t - offset) / period)
        const st = passState[i]
        if (cycle !== st.cycle) {
          st.cycle = cycle
          st.active = Math.random() < FIRE_PROB
          st.target = (Math.random() * p.dst.length) | 0
        }
        const local = mod(t - offset, period)
        if (!st.active || local >= travel) continue
        const b = p.dst[st.target]
        const pr = local / travel
        const op = clamp01(Math.min(8 * pr, 8 * (1 - pr)))
        ctx.fillStyle = `rgba(92,219,211,${op.toFixed(3)})`
        ctx.beginPath()
        ctx.arc(p.a[0] + (b[0] - p.a[0]) * pr, p.a[1] + (b[1] - p.a[1]) * pr, 4, 0, TAU)
        ctx.fill()
      }

      // neurons (pulse ring + core) and layer labels
      let ni = 0
      for (let li = 0; li < NET.length; li++) {
        for (const [nx, ny] of NET[li]) {
          const v = 0.5 + 0.5 * Math.sin((t / 4.2 + ni * 0.37) * TAU)
          const v2 = 0.5 + 0.5 * Math.sin((t / 3 + ni * 0.5) * TAU)
          ctx.fillStyle = `rgba(64,150,255,${(0.5 - 0.45 * v).toFixed(3)})`
          ctx.beginPath()
          ctx.arc(nx, ny, 16 * (0.6 + 0.7 * v), 0, TAU)
          ctx.fill()
          ctx.fillStyle = `rgba(186,224,255,${(0.4 + 0.6 * v2).toFixed(3)})`
          ctx.beginPath()
          ctx.arc(nx, ny, 5, 0, TAU)
          ctx.fill()
          ni++
        }
        ctx.fillStyle = 'rgba(92,219,211,0.55)'
        ctx.font = '600 17px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
        ctx.textAlign = 'center'
        ctx.fillText(LAYERS[li].label, LAYERS[li].x, 945)
      }

      // full-canvas vertical scan line
      ctx.strokeStyle = 'rgba(54,207,201,0.22)'
      ctx.lineWidth = 3
      const sx = (mod(t, 9) / 9) * 1920
      ctx.beginPath()
      ctx.moveTo(sx, 0)
      ctx.lineTo(sx, 1080)
      ctx.stroke()
    }

    let raf = 0
    let start = 0
    const frame = (ts: number): void => {
      if (!start) start = ts
      // Re-measure the live canvas every frame; fall back to the viewport if it's momentarily collapsed.
      const rect = canvas.getBoundingClientRect()
      let w = rect.width
      let h = rect.height
      if (w < 2 || h < 2) {
        w = window.innerWidth || 1280
        h = window.innerHeight || 720
      }
      cssW = w
      cssH = h
      const bw = Math.max(1, Math.round(w * dpr))
      const bh = Math.max(1, Math.round(h * dpr))
      if (canvas.width !== bw) canvas.width = bw
      if (canvas.height !== bh) canvas.height = bh
      render((ts - start) / 1000)
      raf = requestAnimationFrame(frame)
    }
    raf = requestAnimationFrame(frame)

    return () => cancelAnimationFrame(raf)
  }, [])

  return (
    <div ref={wrapRef} className="ax-signin_bg" style={WRAP_STYLE} aria-hidden="true">
      <canvas ref={canvasRef} className="ax-signin_bg_svg" style={CANVAS_STYLE} />

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
