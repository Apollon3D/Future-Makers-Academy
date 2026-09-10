import { useState } from 'react'
import { Range, WidgetShell } from './common'

/** Side-by-side: grid vs. gyroid infill and a rough directional-strength read. */
export function InfillCompare() {
  const [density, setDensity] = useState(20)
  const spacing = Math.max(6, 26 - density * 0.18)

  return (
    <WidgetShell>
      <h4 className="mb-3 text-sm font-semibold text-ink">
        Infill Pattern & Direction
      </h4>
      <Range
        label="Infill density"
        min={5}
        max={60}
        step={5}
        value={density}
        onChange={setDensity}
        format={(v) => `${v}%`}
      />
      <div className="mt-4 grid gap-4 sm:grid-cols-2">
        <PatternCard
          title="Grid"
          desc="Fast, simple. Strong when loaded top-down, weak against side impacts — the stacked layers of infill are not bonded to each other."
          vertical={85}
          shear={35}
        >
          <GridPattern spacing={spacing} />
        </PatternCard>
        <PatternCard
          title="Gyroid"
          desc="Wavy 3D pattern with no crossing points. Near-equal strength in every direction; a great functional default. Slightly slower."
          vertical={80}
          shear={78}
        >
          <GyroidPattern spacing={spacing} />
        </PatternCard>
      </div>
    </WidgetShell>
  )
}

function PatternCard({
  title,
  desc,
  vertical,
  shear,
  children,
}: {
  title: string
  desc: string
  vertical: number
  shear: number
  children: React.ReactNode
}) {
  return (
    <div className="rounded-lg border border-border bg-surface p-3">
      <div className="mb-2 font-semibold text-ink">{title}</div>
      <svg viewBox="0 0 120 120" className="w-full rounded bg-surface-3">
        <rect
          x={4}
          y={4}
          width={112}
          height={112}
          fill="none"
          stroke="var(--border-strong)"
        />
        {children}
      </svg>
      <div className="mt-2 space-y-1">
        <Bar label="Top-down load" v={vertical} />
        <Bar label="Side impact" v={shear} />
      </div>
      <p className="mt-2 text-xs text-muted">{desc}</p>
    </div>
  )
}

function Bar({ label, v }: { label: string; v: number }) {
  return (
    <div className="flex items-center gap-2 text-xs">
      <span className="w-24 shrink-0 text-muted">{label}</span>
      <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-surface-3">
        <div
          className="h-full rounded-full"
          style={{
            width: `${v}%`,
            background:
              v >= 66 ? 'var(--success)' : v >= 40 ? 'var(--warn)' : 'var(--danger)',
          }}
        />
      </div>
    </div>
  )
}

function GridPattern({ spacing }: { spacing: number }) {
  const lines = []
  for (let p = 8; p < 112; p += spacing) {
    lines.push(
      <line key={`h${p}`} x1={6} y1={p} x2={114} y2={p} stroke="var(--accent)" strokeWidth={1.4} />,
      <line key={`v${p}`} x1={p} y1={6} x2={p} y2={114} stroke="var(--accent)" strokeWidth={1.4} />,
    )
  }
  return <g opacity={0.85}>{lines}</g>
}

function GyroidPattern({ spacing }: { spacing: number }) {
  const paths = []
  for (let p = 4; p < 120; p += spacing) {
    paths.push(
      <path
        key={p}
        d={`M6 ${p} Q ${30} ${p - spacing / 1.4} ${60} ${p} T 114 ${p}`}
        fill="none"
        stroke="var(--accent)"
        strokeWidth={1.4}
      />,
    )
  }
  for (let p = 4; p < 120; p += spacing) {
    paths.push(
      <path
        key={`x${p}`}
        d={`M${p} 6 Q ${p - spacing / 1.4} 30 ${p} 60 T ${p} 114`}
        fill="none"
        stroke="var(--accent)"
        strokeWidth={1}
        opacity={0.5}
      />,
    )
  }
  return <g opacity={0.9}>{paths}</g>
}
