import { type ReactNode, useMemo, useState } from 'react'
import { Range, Meter, WidgetShell, scoreTone } from './common'
import { cn } from '../ui'

/**
 * Cause-and-effect slicer model for a reference 40 × 40 × 50 mm functional
 * part on a 0.4 mm nozzle. Numbers are a simplified but directionally honest
 * model — not a real slicer.
 */

interface Settings {
  layer: number
  infill: number
  speed: number
  walls: number
  temp: number
}

const PRESETS: { name: string; s: Settings }[] = [
  { name: 'Draft', s: { layer: 0.28, infill: 10, speed: 100, walls: 2, temp: 210 } },
  { name: 'Standard', s: { layer: 0.2, infill: 15, speed: 60, walls: 3, temp: 210 } },
  { name: 'Strong', s: { layer: 0.2, infill: 40, speed: 45, walls: 5, temp: 235 } },
  { name: 'Fine', s: { layer: 0.12, infill: 15, speed: 40, walls: 3, temp: 205 } },
]

const clamp = (n: number, lo = 0, hi = 100) => Math.max(lo, Math.min(hi, n))

export function SlicerSim() {
  const [s, setS] = useState<Settings>(PRESETS[1].s)
  const set = (patch: Partial<Settings>) => setS((cur) => ({ ...cur, ...patch }))

  const lineWidth = 0.48 // mm, ~120% nozzle
  const out = useMemo(() => {
    const height = 50
    const layers = Math.round(height / s.layer)

    // --- Print time (minutes) ---
    // Per layer: walls + infill + a little for top/bottom & travel.
    const wallSec = (s.walls * 210) / s.speed
    const infillSec = ((s.infill / 100) * 620) / s.speed
    const fixedSec = 5 + 900 / s.speed
    const minutes = Math.round((layers * (wallSec + infillSec + fixedSec)) / 60)

    // --- Structural strength (0-100) ---
    const wallStrength = Math.min(50, (s.walls - 1) * 14)
    const infillStrength = (s.infill / 100) * 28
    const bondFromTemp = (s.temp - 210) * 0.5 // hotter = better layer weld
    const speedPenalty = Math.max(0, (s.speed - 50) * 0.14)
    const thickLayerBond = s.layer >= 0.24 ? 4 : s.layer <= 0.12 ? -3 : 0
    const strength = clamp(
      26 + wallStrength + infillStrength + bondFromTemp + thickLayerBond - speedPenalty,
      3,
    )

    // --- Visual quality (0-100) ---
    const layerQuality = ((0.32 - s.layer) / (0.32 - 0.1)) * 62
    const speedQuality = ((110 - s.speed) / 80) * 20
    const tempQuality = 14 - Math.abs(s.temp - 208) * 0.35 // too hot = blobs, too cold = rough
    const quality = clamp(layerQuality + speedQuality + tempQuality, 3)

    // --- Stringing risk (0-100, higher = worse) ---
    const stringing = clamp((s.temp - 200) * 1.6 + Math.max(0, (60 - s.speed) * 0.2), 0)

    // --- Material ---
    const shellVol = 4 * 4 * 5 // rough cm^3 of a 40mm cube
    const wallFrac = Math.min(0.9, (s.walls * lineWidth) / 20 + 0.08)
    const solidFrac = wallFrac + (1 - wallFrac) * (s.infill / 100) * 0.9 + 0.05
    const grams = Math.round(shellVol * solidFrac * 1.24 * 10) / 10 // PLA ~1.24 g/cm^3
    const cost = (grams / 1000) * 25

    // --- Contextual notes ---
    const notes: string[] = []
    if (s.layer > 0.3) notes.push('Layer height is past 75% of a 0.4 mm nozzle — expect poor layer bonding.')
    if (s.infill > 50) notes.push('Above ~50% infill you gain little strength for a lot of time — add walls instead.')
    if (s.speed > 80 && s.temp < 215) notes.push('Printing this fast needs a higher temperature to melt filament in time.')
    if (stringing > 55) notes.push('High stringing risk — drop temperature and tune retraction.')
    if (s.walls >= 5 && s.infill < 25) notes.push('5+ walls on a small part — it may be simpler to print it solid.')
    if (s.layer <= 0.12) notes.push('Ultra-fine layers roughly double print time for a modest quality gain on flat faces.')
    if (notes.length === 0) notes.push('A balanced profile — reasonable time, strength and finish.')

    return { layers, minutes, strength, quality, stringing, grams, cost, notes }
  }, [s])

  return (
    <WidgetShell>
      <div className="mb-3 flex flex-wrap items-center gap-2">
        <h4 className="text-sm font-semibold text-ink">Slicer Simulator</h4>
        <span className="font-mono text-xs text-muted">ref: 40×40×50 mm part</span>
        <div className="ml-auto flex gap-1">
          {PRESETS.map((p) => (
            <button
              key={p.name}
              type="button"
              onClick={() => setS(p.s)}
              className={cn(
                'rounded-md border px-2 py-0.5 text-xs',
                JSON.stringify(p.s) === JSON.stringify(s)
                  ? 'border-accent bg-accent-soft text-accent'
                  : 'border-border text-muted hover:text-ink',
              )}
            >
              {p.name}
            </button>
          ))}
        </div>
      </div>

      <div className="grid gap-5 lg:grid-cols-[1fr_180px]">
        <div className="space-y-3.5">
          <Range label="Layer height" min={0.08} max={0.32} step={0.02}
            value={s.layer} onChange={(v) => set({ layer: v })}
            format={(v) => `${v.toFixed(2)} mm`} />
          <Range label="Infill density" min={0} max={100} step={5}
            value={s.infill} onChange={(v) => set({ infill: v })}
            format={(v) => `${v}%`} />
          <Range label="Wall count" min={1} max={6} step={1}
            value={s.walls} onChange={(v) => set({ walls: v })}
            format={(v) => `${v} walls (${(v * 0.48).toFixed(1)} mm)`} />
          <Range label="Print speed" min={30} max={120} step={5}
            value={s.speed} onChange={(v) => set({ speed: v })}
            format={(v) => `${v} mm/s`} />
          <Range label="Nozzle temperature" min={190} max={250} step={5}
            value={s.temp} onChange={(v) => set({ temp: v })}
            format={(v) => `${v} °C`} />
        </div>

        <CrossSection s={s} lineWidth={lineWidth} />
      </div>

      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        <div className="space-y-3 rounded-lg bg-surface p-3">
          <Row label="Print time" value={fmtTime(out.minutes)} />
          <Row label="Layers" value={`${out.layers}`} muted />
          <Row label="Filament" value={`${out.grams} g · $${out.cost.toFixed(2)}`} muted />
        </div>
        <div className="space-y-2.5 rounded-lg bg-surface p-3">
          <Meter label="Structural strength" value={out.strength}
            caption={`${Math.round(out.strength)}`} tone={scoreTone(out.strength)} />
          <Meter label="Visual quality" value={out.quality}
            caption={`${Math.round(out.quality)}`} tone={scoreTone(out.quality)} />
          <Meter label="Stringing risk" value={out.stringing}
            caption={out.stringing > 55 ? 'high' : out.stringing > 30 ? 'some' : 'low'}
            tone={scoreTone(100 - out.stringing)} />
        </div>
      </div>

      <ul className="mt-3 space-y-1 text-xs text-muted">
        {out.notes.map((n, i) => (
          <li key={i} className="flex gap-1.5">
            <span className="text-accent">›</span>
            {n}
          </li>
        ))}
      </ul>
    </WidgetShell>
  )
}

function Row({ label, value, muted }: { label: string; value: string; muted?: boolean }) {
  return (
    <div className="flex items-baseline justify-between">
      <span className="text-sm text-muted">{label}</span>
      <span
        className={cn(
          'font-mono text-sm',
          muted ? 'text-text' : 'text-lg font-semibold text-accent',
        )}
      >
        {value}
      </span>
    </div>
  )
}

/** Magnified cutaway through the part wall + a stair-stepping strip. */
function CrossSection({ s, lineWidth }: { s: Settings; lineWidth: number }) {
  const W = 180
  const H = 150
  const scale = 34 // px per mm (~5 mm of part shown)
  const lw = lineWidth * scale
  const wallPx = Math.min(W * 0.5, s.walls * lw)
  const solidPx = Math.max(6, Math.round((1 / s.layer)) * s.layer * scale) // ~1 mm skins
  const infillGap = Math.max(5, 34 - s.infill * 0.3)

  // Diagonal infill hatch, clipped to the interior.
  const hatch: ReactNode[] = []
  for (let x = -H; x < W + H; x += infillGap) {
    hatch.push(
      <line key={x} x1={x} y1={H} x2={x + H} y2={0}
        stroke="color-mix(in srgb, var(--accent) 50%, transparent)" strokeWidth={1.2} />,
    )
  }

  // Stair-stepping strip: quarter-circle approximated by layer steps.
  const stripH = 46
  const lhPx = s.layer * (stripH / 1.4)
  const steps: ReactNode[] = []
  for (let y = 0; y < stripH; y += lhPx) {
    const frac = y / stripH
    const x = stripH * Math.sqrt(Math.max(0, 1 - (1 - frac) ** 2))
    steps.push(
      <rect key={y} x={0} y={stripH - y - lhPx} width={x} height={lhPx + 0.5}
        fill="color-mix(in srgb, var(--accent) 26%, var(--surface))"
        stroke="var(--accent)" strokeWidth={0.4} />,
    )
  }

  return (
    <div className="mx-auto max-w-[240px]">
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full rounded-lg bg-surface">
        <defs>
          <clipPath id="ss-int">
            <rect x={wallPx} y={solidPx} width={W - wallPx} height={H - 2 * solidPx} />
          </clipPath>
        </defs>
        {/* body */}
        <rect x={0} y={0} width={W} height={H} fill="var(--surface-3)" />
        {/* infill */}
        <g clipPath="url(#ss-int)" opacity={s.infill === 0 ? 0 : 1}>{hatch}</g>
        {/* top & bottom solid skins */}
        <rect x={0} y={0} width={W} height={solidPx} fill="color-mix(in srgb, var(--accent) 32%, var(--surface))" />
        <rect x={0} y={H - solidPx} width={W} height={solidPx} fill="color-mix(in srgb, var(--accent) 32%, var(--surface))" />
        {/* walls */}
        {Array.from({ length: s.walls }).map((_, i) => (
          <rect key={i} x={i * lw} y={0} width={lw - 0.6} height={H}
            fill="color-mix(in srgb, var(--accent) 20%, var(--surface))"
            stroke="var(--accent)" strokeWidth={0.7} />
        ))}
        <line x1={wallPx} y1={0} x2={wallPx} y2={H} stroke="var(--border-strong)" strokeWidth={0.6} />
      </svg>
      <p className="mt-1 text-center text-[11px] text-muted">
        cutaway: {s.walls} walls · {s.infill}% infill · {solidPx > 6 ? '' : 'thin '}skins
      </p>

      <div className="mt-2 flex items-end gap-2 rounded-lg bg-surface p-2">
        <svg viewBox={`0 0 ${stripH + 4} ${stripH + 4}`} width={64} height={64}>
          <path d={`M0 ${stripH} A ${stripH} ${stripH} 0 0 1 ${stripH} 0`}
            fill="none" stroke="var(--border)" strokeWidth={1} strokeDasharray="2 2" />
          {steps}
        </svg>
        <p className="text-[11px] leading-tight text-muted">
          Stair-stepping on a curved face at {s.layer.toFixed(2)} mm layers
        </p>
      </div>
    </div>
  )
}

function fmtTime(min: number): string {
  const h = Math.floor(min / 60)
  const m = min % 60
  return h > 0 ? `${h}h ${m}m` : `${m}m`
}
