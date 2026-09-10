import { type ReactNode, useState } from 'react'
import { Range, WidgetShell } from './common'

/**
 * Infill pattern explorer. Pick two patterns, set one density, and compare how
 * each fills a fixed area (denser = more lines, not zoomed) plus its strength,
 * speed and material trade-offs.
 */

interface Pattern {
  id: string
  name: string
  /** 0-3 */
  top: number
  side: number
  shear: number
  /** 1-5, higher = faster / less material */
  speed: number
  material: number // 1-5, higher = more material
  note: string
  render: (density: number) => ReactNode
}

const V = 120 // viewBox

/** Map density% (5-60) to a line spacing in a fixed 120-unit box. */
const gap = (d: number, min = 6, max = 26) => max - ((d - 5) / 55) * (max - min)

const stroke = {
  stroke: 'var(--accent)',
  strokeWidth: 1.3,
  fill: 'none',
} as const

function lineSet(angleDeg: number, d: number, key: string) {
  const g = gap(d)
  const rad = (angleDeg * Math.PI) / 180
  const nx = Math.cos(rad + Math.PI / 2)
  const ny = Math.sin(rad + Math.PI / 2)
  const lines = []
  for (let o = -V * 1.5; o < V * 1.5; o += g) {
    const cx = V / 2 + nx * o
    const cy = V / 2 + ny * o
    const dx = Math.cos(rad) * V * 1.6
    const dy = Math.sin(rad) * V * 1.6
    lines.push(
      <line key={`${key}${o}`} x1={cx - dx} y1={cy - dy} x2={cx + dx} y2={cy + dy} {...stroke} />,
    )
  }
  return lines
}

const PATTERNS: Pattern[] = [
  {
    id: 'grid',
    name: 'Grid',
    top: 3, side: 1, shear: 1, speed: 4, material: 3,
    note: 'Fast and simple. Weak against side impacts — the infill layers are not bonded in Z. Double-extrudes at every crossing.',
    render: (d) => (
      <g>
        {lineSet(0, d, 'h')}
        {lineSet(90, d, 'v')}
      </g>
    ),
  },
  {
    id: 'lines',
    name: 'Lines (rectilinear)',
    top: 3, side: 1, shear: 1, speed: 5, material: 2,
    note: 'One direction per layer, alternating. Faster and lighter than grid with a similar strength profile.',
    render: (d) => <g>{lineSet(20, d, 'l')}</g>,
  },
  {
    id: 'triangles',
    name: 'Triangles',
    top: 2, side: 3, shear: 3, speed: 3, material: 3,
    note: 'Strong in-plane and against shear/twist. Good for parts loaded flat or racked sideways.',
    render: (d) => (
      <g>
        {lineSet(0, d, 't0')}
        {lineSet(60, d, 't60')}
        {lineSet(120, d, 't120')}
      </g>
    ),
  },
  {
    id: 'trihex',
    name: 'Tri-hexagon',
    top: 3, side: 3, shear: 3, speed: 2, material: 3,
    note: 'Three-way lines forming hexagons and triangles — very strong in every in-plane direction, but lots of travel moves slow it down.',
    render: (d) => (
      <g>
        {lineSet(0, d * 0.8, 'x0')}
        {lineSet(60, d * 0.8, 'x60')}
        {lineSet(120, d * 0.8, 'x120')}
      </g>
    ),
  },
  {
    id: 'honeycomb',
    name: 'Honeycomb',
    top: 3, side: 2, shear: 2, speed: 2, material: 4,
    note: 'Stiff cell walls and the classic look, but constant direction changes make it slow and heavy for the strength you get.',
    render: (d) => {
      const s = gap(d, 9, 26) / 1.6
      const h = s * Math.sqrt(3)
      const cells: ReactNode[] = []
      for (let row = -1; row * h * 0.75 < V + h; row++) {
        for (let col = -1; col * s * 1.5 < V + s; col++) {
          const cx = col * s * 1.5
          const cy = row * h + (col % 2 ? h / 2 : 0)
          const pts = Array.from({ length: 6 }, (_, i) => {
            const a = (Math.PI / 3) * i
            return `${cx + s * Math.cos(a)},${cy + s * Math.sin(a)}`
          }).join(' ')
          cells.push(<polygon key={`${row}-${col}`} points={pts} {...stroke} />)
        }
      }
      return <g>{cells}</g>
    },
  },
  {
    id: 'gyroid',
    name: 'Gyroid',
    top: 3, side: 3, shear: 3, speed: 3, material: 3,
    note: 'A 3D wave: near-equal strength in every direction, no weak crossing points, and it prints quietly. The best general default for functional parts.',
    render: (d) => {
      const g = gap(d, 10, 30)
      const rows: ReactNode[] = []
      for (let y = -g; y < V + g; y += g) {
        rows.push(
          <path key={`r${y}`} d={`M -10 ${y} Q ${V / 4} ${y - g / 1.3} ${V / 2} ${y} T ${V + 10} ${y}`} {...stroke} />,
        )
      }
      for (let x = -g; x < V + g; x += g) {
        rows.push(
          <path key={`c${x}`} d={`M ${x} -10 Q ${x - g / 1.3} ${V / 4} ${x} ${V / 2} T ${x} ${V + 10}`} {...stroke} strokeWidth={0.9} opacity={0.55} />,
        )
      }
      return <g>{rows}</g>
    },
  },
  {
    id: 'cubic',
    name: 'Cubic',
    top: 3, side: 3, shear: 2, speed: 3, material: 3,
    note: 'Tumbling cubes give good omnidirectional strength. "Adaptive cubic" adds density only deep inside the part to save time.',
    render: (d) => {
      const g = gap(d, 10, 28)
      const sq: ReactNode[] = []
      for (let x = -g; x < V + g; x += g) {
        for (let y = -g; y < V + g; y += g) {
          sq.push(
            <rect key={`a${x}-${y}`} x={x} y={y} width={g * 0.72} height={g * 0.72} {...stroke} strokeWidth={1} />,
          )
        }
      }
      return (
        <g>
          <g>{sq}</g>
          <g transform={`rotate(45 ${V / 2} ${V / 2})`} opacity={0.5}>{sq}</g>
        </g>
      )
    },
  },
  {
    id: 'concentric',
    name: 'Concentric',
    top: 1, side: 1, shear: 1, speed: 4, material: 2,
    note: 'Follows the perimeter inward. Low strength but very flexible — the standard choice for TPU and soft parts, and for light shells.',
    render: (d) => {
      const g = gap(d, 6, 18)
      const rings: ReactNode[] = []
      for (let i = g; i < V / 2; i += g) {
        rings.push(<rect key={i} x={i} y={i} width={V - 2 * i} height={V - 2 * i} rx={4} {...stroke} />)
      }
      return <g>{rings}</g>
    },
  },
  {
    id: 'lightning',
    name: 'Lightning',
    top: 1, side: 0, shear: 0, speed: 5, material: 1,
    note: 'Only grows branches where the top surface needs holding up. Minimal material and time — and essentially zero structural strength.',
    render: () => (
      <g {...stroke} strokeWidth={1.1}>
        <path d="M0 118 L30 80 L44 50 L40 20 M44 50 L64 30 M30 80 L52 78" />
        <path d="M120 118 L92 82 L84 48 L92 18 M84 48 L66 34 M92 82 L74 88" />
        <path d="M60 120 L58 96 L62 70" />
      </g>
    ),
  },
]

function get(id: string) {
  return PATTERNS.find((p) => p.id === id)!
}

export function InfillCompare() {
  const [density, setDensity] = useState(20)
  const [a, setA] = useState('grid')
  const [b, setB] = useState('gyroid')

  return (
    <WidgetShell>
      <h4 className="mb-3 text-sm font-semibold text-ink">Infill Explorer</h4>
      <Range
        label="Infill density"
        min={5}
        max={60}
        step={5}
        value={density}
        onChange={setDensity}
        format={(v) => `${v}%`}
      />
      <p className="mt-1 text-xs text-muted">
        Higher density packs more lines into the same volume — it does not change
        the pattern’s shape.
      </p>

      <div className="mt-4 grid gap-4 sm:grid-cols-2">
        {[
          { sel: a, set: setA },
          { sel: b, set: setB },
        ].map((slot, i) => (
          <PatternCard
            key={i}
            selected={slot.sel}
            onSelect={slot.set}
            density={density}
          />
        ))}
      </div>
    </WidgetShell>
  )
}

function PatternCard({
  selected,
  onSelect,
  density,
}: {
  selected: string
  onSelect: (id: string) => void
  density: number
}) {
  const p = get(selected)
  return (
    <div className="rounded-lg border border-border bg-surface p-3">
      <select
        value={selected}
        onChange={(e) => onSelect(e.target.value)}
        className="mb-2 w-full rounded-md border border-border bg-surface-2 px-2 py-1 text-sm font-semibold text-ink outline-none focus:border-accent"
      >
        {PATTERNS.map((pat) => (
          <option key={pat.id} value={pat.id}>
            {pat.name}
          </option>
        ))}
      </select>
      <svg viewBox={`0 0 ${V} ${V}`} className="w-full rounded bg-surface-3">
        <rect x={2} y={2} width={V - 4} height={V - 4} fill="none" stroke="var(--border-strong)" />
        <clipPath id={`clip-${selected}`}>
          <rect x={3} y={3} width={V - 6} height={V - 6} />
        </clipPath>
        <g clipPath={`url(#clip-${selected})`}>{p.render(density)}</g>
      </svg>
      <div className="mt-2 space-y-1">
        <Bars label="Top-down load" v={p.top} />
        <Bars label="Side impact" v={p.side} />
        <Bars label="Shear / twist" v={p.shear} />
      </div>
      <div className="mt-2 flex gap-3 text-[11px] text-muted">
        <span>Speed {'●'.repeat(p.speed)}{'○'.repeat(5 - p.speed)}</span>
        <span>Material {'●'.repeat(p.material)}{'○'.repeat(5 - p.material)}</span>
      </div>
      <p className="mt-2 text-xs text-muted">{p.note}</p>
    </div>
  )
}

function Bars({ label, v }: { label: string; v: number }) {
  return (
    <div className="flex items-center gap-2 text-xs">
      <span className="w-24 shrink-0 text-muted">{label}</span>
      <span className="flex gap-0.5">
        {[0, 1, 2].map((n) => (
          <span
            key={n}
            className="h-2 w-5 rounded-sm"
            style={{
              background:
                v > n
                  ? v >= 3
                    ? 'var(--success)'
                    : v === 2
                      ? 'var(--warn)'
                      : 'var(--danger)'
                  : 'var(--surface-3)',
            }}
          />
        ))}
      </span>
    </div>
  )
}
