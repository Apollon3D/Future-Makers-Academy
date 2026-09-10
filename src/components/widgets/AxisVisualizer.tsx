import { useEffect, useMemo, useRef, useState } from 'react'
import { Range, WidgetShell } from './common'
import { Button } from '../ui'

/**
 * Coordinate system + layers. The nozzle traces each layer's toolpath in the
 * X/Y plane, then Z steps up for the next one. Watch all three coordinates
 * change together as a real print builds.
 */

// Reference part: a 60 × 44 mm L-shaped bracket footprint, 12 mm tall.
const BED = 120 // mm shown
const PART = {
  // L outline, clockwise, in mm (origin at part corner, offset onto the bed)
  ox: 34,
  oy: 40,
  outline: [
    [0, 0],
    [60, 0],
    [60, 20],
    [24, 20],
    [24, 44],
    [0, 44],
  ] as [number, number][],
}
const LAYER_H = 0.24
const PART_HEIGHT = 9.6
const N_LAYERS = Math.round(PART_HEIGHT / LAYER_H)

/** Build a simple toolpath for one layer: 2 perimeter loops + horizontal infill. */
function layerPath(): [number, number][] {
  const pts: [number, number][] = []
  const o = PART.outline.map(([x, y]) => [x + PART.ox, y + PART.oy] as [number, number])
  // outer perimeter
  pts.push(...o, o[0])
  // inner perimeter (inset ~2 mm, approximated by the same shape shrunk)
  const cx = PART.ox + 22
  const cy = PART.oy + 22
  const inset = o.map(([x, y]) => [
    x + (cx - x) * 0.09,
    y + (cy - y) * 0.09,
  ] as [number, number])
  pts.push(inset[0], ...inset, inset[0])
  // infill: horizontal sweeps across the bounding rows, clipped roughly to the L
  for (let i = 0; i < 9; i++) {
    const y = PART.oy + 4 + i * 4.4
    const leftToRight = i % 2 === 0
    const inL = y < PART.oy + 20 // full width band vs narrow band
    const xMax = inL ? PART.ox + 56 : PART.ox + 20
    const xMin = PART.ox + 4
    pts.push(
      leftToRight ? [xMin, y] : [xMax, y],
      leftToRight ? [xMax, y] : [xMin, y],
    )
  }
  return pts
}

function pathLength(pts: [number, number][]): number[] {
  const acc = [0]
  for (let i = 1; i < pts.length; i++) {
    const dx = pts[i][0] - pts[i - 1][0]
    const dy = pts[i][1] - pts[i - 1][1]
    acc.push(acc[i - 1] + Math.hypot(dx, dy))
  }
  return acc
}

export function AxisVisualizer() {
  const path = useMemo(() => layerPath(), [])
  const cum = useMemo(() => pathLength(path), [path])
  const total = cum[cum.length - 1]

  const [layer, setLayer] = useState(0)
  const [t, setT] = useState(1) // progress through current layer path (0..1)
  const [playing, setPlaying] = useState(false)
  const raf = useRef<number | undefined>(undefined)

  useEffect(() => {
    if (!playing) return
    let last = performance.now()
    const speed = 0.55 // path-fraction per second
    const tick = (now: number) => {
      const dt = (now - last) / 1000
      last = now
      setT((prev) => {
        let nt = prev + dt * speed
        if (nt >= 1) {
          setLayer((L) => {
            if (L >= N_LAYERS - 1) {
              setPlaying(false)
              return L
            }
            return L + 1
          })
          nt = 0
        }
        return nt
      })
      raf.current = requestAnimationFrame(tick)
    }
    raf.current = requestAnimationFrame(tick)
    return () => {
      if (raf.current) cancelAnimationFrame(raf.current)
    }
  }, [playing])

  // Nozzle position at current t
  const dist = t * total
  let seg = cum.findIndex((d) => d >= dist)
  if (seg <= 0) seg = 1
  const segFrac =
    (dist - cum[seg - 1]) / Math.max(0.001, cum[seg] - cum[seg - 1])
  const nx = path[seg - 1][0] + (path[seg][0] - path[seg - 1][0]) * segFrac
  const ny = path[seg - 1][1] + (path[seg][1] - path[seg - 1][1]) * segFrac
  const nz = (layer + t) * LAYER_H

  const reset = () => {
    setPlaying(false)
    setLayer(0)
    setT(1)
  }
  const done = layer >= N_LAYERS - 1 && t >= 1

  // --- SVG helpers ---
  const TW = 200 // top-view size px
  const sc = TW / BED
  const px = (v: number) => v * sc
  const drawnPts = path.slice(0, seg).concat([[nx, ny]])

  return (
    <WidgetShell>
      <h4 className="mb-1 text-sm font-semibold text-ink">
        Coordinate System &amp; Layers
      </h4>
      <p className="mb-3 text-xs text-muted">
        L-bracket · {N_LAYERS} layers × {LAYER_H} mm
      </p>

      <div className="grid gap-4 sm:grid-cols-2">
        {/* TOP VIEW — X/Y */}
        <div>
          <div className="mb-1 text-xs font-medium text-muted">
            Top view — X / Y plane (this layer’s toolpath)
          </div>
          <svg viewBox={`0 0 ${TW} ${TW}`} className="w-full rounded-lg bg-surface">
            {/* bed grid */}
            {[0, 0.25, 0.5, 0.75, 1].map((f) => (
              <g key={f} stroke="var(--border)" strokeWidth={0.5}>
                <line x1={f * TW} y1={0} x2={f * TW} y2={TW} />
                <line x1={0} y1={f * TW} x2={TW} y2={f * TW} />
              </g>
            ))}
            {/* completed part footprint (faint) */}
            <polygon
              points={PART.outline
                .map(([x, y]) => `${px(x + PART.ox)},${px(y + PART.oy)}`)
                .join(' ')}
              fill="color-mix(in srgb, var(--accent) 10%, transparent)"
              stroke="var(--border-strong)"
              strokeWidth={0.75}
            />
            {/* toolpath drawn so far */}
            <polyline
              points={drawnPts.map(([x, y]) => `${px(x)},${px(y)}`).join(' ')}
              fill="none"
              stroke="var(--accent)"
              strokeWidth={1.6}
              strokeLinejoin="round"
              strokeLinecap="round"
            />
            {/* nozzle */}
            <circle cx={px(nx)} cy={px(ny)} r={3.2} fill="var(--ink)" />
            <circle cx={px(nx)} cy={px(ny)} r={6} fill="none" stroke="var(--ink)" strokeWidth={0.75} />
            {/* axis labels */}
            <text x={TW - 10} y={TW - 4} fontSize={9} fill="var(--muted)">X</text>
            <text x={4} y={12} fontSize={9} fill="var(--muted)">Y</text>
          </svg>
        </div>

        {/* SIDE VIEW — X/Z */}
        <div>
          <div className="mb-1 text-xs font-medium text-muted">
            Side view — X / Z plane (layers stacking)
          </div>
          <svg viewBox={`0 0 ${TW} ${TW}`} className="w-full rounded-lg bg-surface">
            {/* bed */}
            <rect x={0} y={TW - 14} width={TW} height={14} fill="var(--surface-3)" />
            <line x1={0} y1={TW - 14} x2={TW} y2={TW - 14} stroke="var(--border-strong)" />
            {/* layers built so far (exaggerated Z scale for visibility) */}
            {Array.from({ length: layer + 1 }).map((_, i) => {
              const zTop = TW - 14 - (i + 1) * 12
              const isCurrent = i === layer
              // width tapers a touch near the top of the L (just visual interest)
              const w = px(60)
              return (
                <rect
                  key={i}
                  x={px(PART.ox)}
                  y={zTop}
                  width={w}
                  height={11}
                  fill={
                    isCurrent
                      ? 'color-mix(in srgb, var(--accent) 42%, var(--surface))'
                      : 'var(--surface-3)'
                  }
                  stroke={isCurrent ? 'var(--accent)' : 'var(--border)'}
                  strokeWidth={0.6}
                />
              )
            })}
            {/* nozzle above current layer */}
            <g>
              <rect
                x={px(nx) - 6}
                y={TW - 14 - (layer + 1) * 12 - 34}
                width={12}
                height={26}
                fill="var(--surface-2)"
                stroke="var(--border-strong)"
              />
              <polygon
                points={`${px(nx) - 5},${TW - 14 - (layer + 1) * 12 - 8} ${px(nx) + 5},${TW - 14 - (layer + 1) * 12 - 8} ${px(nx)},${TW - 14 - (layer + 1) * 12 + 1}`}
                fill="var(--border-strong)"
              />
            </g>
            <text x={4} y={12} fontSize={9} fill="var(--muted)">Z</text>
            <text x={TW - 10} y={TW - 4} fontSize={9} fill="var(--muted)">X</text>
          </svg>
        </div>
      </div>

      {/* Coordinate readout */}
      <div className="mt-3 grid grid-cols-3 gap-2 font-mono text-sm">
        {(
          [
            ['X', nx.toFixed(1)],
            ['Y', ny.toFixed(1)],
            ['Z', nz.toFixed(2)],
          ] as const
        ).map(([k, v]) => (
          <div key={k} className="rounded-lg bg-surface p-2 text-center">
            <span className="text-xs text-muted">{k}</span>
            <div className="text-accent">{v}<span className="text-xs text-muted"> mm</span></div>
          </div>
        ))}
      </div>

      <div className="mt-3 flex items-center gap-3">
        <Button
          variant={playing ? 'outline' : 'primary'}
          onClick={() => {
            if (done) reset()
            setPlaying((p) => !p)
          }}
        >
          {playing ? '❚❚ Pause' : done ? '↻ Replay' : '▶ Print'}
        </Button>
        <Button variant="ghost" onClick={reset}>
          Reset
        </Button>
      </div>

      <div className="mt-3">
        <Range
          label="Layer (Z)"
          min={0}
          max={N_LAYERS - 1}
          step={1}
          value={layer}
          onChange={(v) => {
            setPlaying(false)
            setLayer(v)
            setT(1)
          }}
          format={(v) => `${v + 1} / ${N_LAYERS}  ·  Z = ${((v + 1) * LAYER_H).toFixed(2)} mm`}
        />
      </div>

      <p className="mt-3 text-xs leading-relaxed text-muted">
        X and Y position the nozzle <em>within</em> the current layer — that is
        the whole toolpath you see being drawn. <strong className="text-ink">Z only ever increases</strong>,
        and only once a layer is finished. Every FDM print is this loop, a few
        hundred times over.
      </p>
    </WidgetShell>
  )
}
