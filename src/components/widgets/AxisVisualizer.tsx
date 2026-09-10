import { useState } from 'react'
import { Range, WidgetShell } from './common'

/**
 * A simple isometric-ish view of a print bed with a movable nozzle. X/Y place
 * the nozzle; Z is the current layer height, and the printed block grows with Z.
 */
export function AxisVisualizer() {
  const [x, setX] = useState(50)
  const [y, setY] = useState(45)
  const [z, setZ] = useState(20)

  // Project bed coordinates (0..100) into the SVG using a light isometric skew.
  const project = (px: number, py: number, pz: number) => {
    const ox = 60
    const oy = 210
    const sx = 2.3
    const sy = 1.15
    return {
      cx: ox + px * sx + py * 0.9,
      cy: oy - py * sy - pz * 2.4,
    }
  }

  const bed = [
    project(0, 0, 0),
    project(100, 0, 0),
    project(100, 100, 0),
    project(0, 100, 0),
  ]
  const blockTop = [
    project(35, 30, z),
    project(65, 30, z),
    project(65, 60, z),
    project(35, 60, z),
  ]
  const nozzle = project(x, y, z + 6)

  return (
    <WidgetShell>
      <h4 className="mb-3 text-sm font-semibold text-ink">
        Coordinate System
      </h4>
      <div className="grid gap-5 sm:grid-cols-[1fr_200px]">
        <svg viewBox="0 0 380 240" className="w-full rounded-lg bg-surface">
          {/* bed */}
          <polygon
            points={bed.map((p) => `${p.cx},${p.cy}`).join(' ')}
            fill="var(--surface-3)"
            stroke="var(--border-strong)"
          />
          {/* grid lines on bed */}
          {[20, 40, 60, 80].map((g) => {
            const a = project(g, 0, 0)
            const b = project(g, 100, 0)
            const c = project(0, g, 0)
            const d = project(100, g, 0)
            return (
              <g key={g} stroke="var(--border)" strokeWidth={0.75}>
                <line x1={a.cx} y1={a.cy} x2={b.cx} y2={b.cy} />
                <line x1={c.cx} y1={c.cy} x2={d.cx} y2={d.cy} />
              </g>
            )
          })}
          {/* printed block sides */}
          <polygon
            points={[
              project(35, 60, 0),
              project(65, 60, 0),
              project(65, 60, z),
              project(35, 60, z),
            ]
              .map((p) => `${p.cx},${p.cy}`)
              .join(' ')}
            fill="color-mix(in srgb, var(--accent) 22%, var(--surface))"
            stroke="var(--accent)"
            strokeWidth={0.75}
          />
          <polygon
            points={[
              project(65, 30, 0),
              project(65, 60, 0),
              project(65, 60, z),
              project(65, 30, z),
            ]
              .map((p) => `${p.cx},${p.cy}`)
              .join(' ')}
            fill="color-mix(in srgb, var(--accent) 14%, var(--surface))"
            stroke="var(--accent)"
            strokeWidth={0.75}
          />
          <polygon
            points={blockTop.map((p) => `${p.cx},${p.cy}`).join(' ')}
            fill="color-mix(in srgb, var(--accent) 32%, var(--surface))"
            stroke="var(--accent)"
          />
          {/* nozzle */}
          <line
            x1={nozzle.cx}
            y1={nozzle.cy - 26}
            x2={nozzle.cx}
            y2={nozzle.cy}
            stroke="var(--ink)"
            strokeWidth={4}
          />
          <polygon
            points={`${nozzle.cx - 5},${nozzle.cy - 6} ${nozzle.cx + 5},${nozzle.cy - 6} ${nozzle.cx},${nozzle.cy + 4}`}
            fill="var(--ink)"
          />
          {/* axis labels */}
          <text x={340} y={210} fill="var(--muted)" fontSize={11}>
            X
          </text>
          <text x={150} y={40} fill="var(--muted)" fontSize={11}>
            Y
          </text>
          <text x={44} y={70} fill="var(--muted)" fontSize={11}>
            Z
          </text>
        </svg>

        <div className="space-y-4">
          <Range label="X" min={0} max={100} step={1} value={x} onChange={setX} format={(v) => `${v} mm`} />
          <Range label="Y" min={0} max={100} step={1} value={y} onChange={setY} format={(v) => `${v} mm`} />
          <Range label="Z (build height)" min={0} max={60} step={1} value={z} onChange={setZ} format={(v) => `${v} mm`} />
          <p className="text-xs text-muted">
            X and Y move the nozzle over the bed. Z only rises — each finished
            layer lifts the head by one layer height.
          </p>
        </div>
      </div>
    </WidgetShell>
  )
}
